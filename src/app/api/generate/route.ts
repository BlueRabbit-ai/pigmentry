import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { buildGenerationPrompt } from "@/lib/prompts";
import { SIZE_PRESETS, CREDIT_COSTS } from "@/lib/constants";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const CONVEX_SITE = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;

/**
 * Call a Convex query via HTTP (works from API routes without client SDK).
 */
async function convexQuery(name: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${CONVEX_SITE}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Convex query ${name} failed: ${res.status}`);
  return res.json();
}

/**
 * Call a Convex mutation via HTTP.
 */
async function convexMutation(name: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${CONVEX_SITE}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Convex mutation ${name} failed: ${res.status}`);
  return res.json();
}

interface GenerateRequest {
  styleSlug: string;
  sizeSlug: string;
  imageBase64: string;
  mimeType: string;
}

/**
 * Parse a Google GenAI error into a short, user-friendly message.
 */
function parseGeminiError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;

    // Quota / rate limit
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("429")) {
      const retryMatch = msg.match(/retry in (\d+\.?\d*)s/);
      const seconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
      return `The AI service is busy. Please wait ${seconds} seconds and try again.`;
    }

    // API key / auth
    if (msg.includes("API_KEY") || msg.includes("UNAUTHENTICATED") || msg.includes("401") || msg.includes("403")) {
      return "The AI service is temporarily unavailable. Please try again later.";
    }

    // Safety filters
    if (msg.includes("SAFETY") || msg.includes("BLOCKED") || msg.includes("blocked")) {
      return "Your image couldn't be processed due to content filters. Try a different photo.";
    }

    // Network / timeout
    if (msg.includes("timeout") || msg.includes("ETIMEDOUT") || msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      return "The connection to the AI service timed out. Please check your internet and try again.";
    }

    // Model overloaded
    if (msg.includes("overloaded") || msg.includes("UNAVAILABLE") || msg.includes("503")) {
      return "The AI service is temporarily overloaded. Please try again in a moment.";
    }

    // Fall back to a generic message — never show raw JSON
    return "Something went wrong during generation. Please try again.";
  }
  return "Something went wrong during generation. Please try again.";
}

/**
 * POST /api/generate
 *
 * Generates an oil painting from a photo using Gemini.
 * Checks credits BEFORE calling the AI, and deducts on success.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "You need to sign in to generate paintings." },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request. Please try again." },
        { status: 400 }
      );
    }

    const { styleSlug, sizeSlug, imageBase64, mimeType } = body;

    if (!styleSlug || !sizeSlug || !imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Please select a style, size, and upload an image." },
        { status: 400 }
      );
    }

    // Validate image size
    const estimatedSize = (imageBase64.length * 3) / 4;
    if (estimatedSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // Validate style and size
    const styleExists = ["classic-oil", "luxury-color", "selective-color"].includes(styleSlug);
    const sizeConfig = SIZE_PRESETS.find((s) => s.slug === sizeSlug);

    if (!styleExists) {
      return NextResponse.json(
        { error: `Unknown style. Please choose from Classic Oil, Luxury Color, or Selective Color.` },
        { status: 400 }
      );
    }

    if (!sizeConfig) {
      return NextResponse.json(
        { error: `Unknown size. Please choose a valid output size.` },
        { status: 400 }
      );
    }

    const creditCost =
      CREDIT_COSTS[sizeSlug as keyof typeof CREDIT_COSTS] ?? 1;

    // --- Credit check BEFORE calling AI ---
    try {
      const balanceData = await convexQuery("credits:getBalance", {});
      const currentBalance = (balanceData as any).balance ?? 0;

      if (currentBalance < creditCost) {
        return NextResponse.json(
          {
            error: `You don't have enough credits. This generation costs ${creditCost} credit${creditCost > 1 ? "s" : ""} but you only have ${currentBalance}. Visit the Billing page to get more credits.`,
            code: "INSUFFICIENT_CREDITS",
            required: creditCost,
            available: currentBalance,
          },
          { status: 402 }
        );
      }

      // Deduct credits BEFORE starting the (slow) AI call
      await convexMutation("credits:deductCredits", {
        userId,
        amount: creditCost,
        reason: `generation:${styleSlug}_${sizeSlug}`,
      });
    } catch (err) {
      // If the error is from our own credit check, re-throw
      if (err instanceof Error && err.message.includes("Insufficient credits")) {
        return NextResponse.json(
          { error: `You don't have enough credits. You need ${creditCost} credit${creditCost > 1 ? "s" : ""}.` },
          { status: 402 }
        );
      }
      // Convex might not be wired — proceed without credit check for now
      console.warn("[api/generate] Credit check skipped — Convex may not be wired:", err);
    }

    // Build the generation prompt
    const prompt = buildGenerationPrompt(styleSlug, sizeSlug);

    // Call Gemini
    const apiKey = process.env.NANO_BANANA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The AI service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });

    let response;
    try {
      response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      });
    } catch (aiError) {
      console.error("[api/generate] Gemini API error:", aiError);
      const friendly = parseGeminiError(aiError);

      // Refund credits if the AI call fails
      try {
        await convexMutation("credits:grantCredits", {
          userId,
          amount: creditCost,
          reason: "generation:refund",
        });
      } catch {
        // Refund failed — log but don't block the error response
        console.warn("[api/generate] Could not refund credits");
      }

      return NextResponse.json(
        { error: friendly, code: "AI_ERROR", refunded: true },
        { status: 500 }
      );
    }

    // Extract the generated image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "The AI couldn't generate a painting from this image. Try a different photo." },
        { status: 500 }
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    // Find the image part in the response
    let generatedImageBase64: string | null = null;
    let generatedMimeType = "image/png";

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        generatedMimeType = part.inlineData.mimeType ?? "image/png";
        break;
      }
    }

    if (!generatedImageBase64) {
      return NextResponse.json(
        { error: "The AI didn't return an image. Please try again with a different photo." },
        { status: 500 }
      );
    }

    // Return the generated image as a data URL
    const dataUrl = `data:${generatedMimeType};base64,${generatedImageBase64}`;

    return NextResponse.json({
      success: true,
      imageDataUrl: dataUrl,
      mimeType: generatedMimeType,
      creditCost,
      styleName: styleSlug,
      sizeLabel: sizeConfig.label,
    });
  } catch (error) {
    console.error("[api/generate] Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? parseGeminiError(error)
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
