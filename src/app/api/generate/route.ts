import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { buildGenerationPrompt } from "@/lib/prompts";
import { SIZE_PRESETS, CREDIT_COSTS } from "@/lib/constants";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface GenerateRequest {
  styleSlug: string;
  sizeSlug: string;
  imageBase64: string;
  mimeType: string;
}

/**
 * POST /api/generate
 *
 * Generates an oil painting from a photo using Nano Banana Lite 2.
 * Requires authentication. Deducts credits via Convex in production.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { styleSlug, sizeSlug, imageBase64, mimeType } = body;

    if (!styleSlug || !sizeSlug || !imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing required fields: styleSlug, sizeSlug, imageBase64, mimeType" },
        { status: 400 }
      );
    }

    // Validate image size (base64 is ~4/3 the original size)
    const estimatedSize = (imageBase64.length * 3) / 4;
    if (estimatedSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // Validate style and size
    const styleExists = ["classic-oil", "luxury-color", "selective-color", "desktop-wallpaper"].includes(styleSlug);
    const sizeConfig = SIZE_PRESETS.find((s) => s.slug === sizeSlug);

    if (!styleExists) {
      return NextResponse.json(
        { error: `Unknown style: ${styleSlug}` },
        { status: 400 }
      );
    }

    if (!sizeConfig) {
      return NextResponse.json(
        { error: `Unknown size: ${sizeSlug}` },
        { status: 400 }
      );
    }

    const creditCost =
      CREDIT_COSTS[sizeSlug as keyof typeof CREDIT_COSTS] ?? 1;

    // TODO: Check and deduct credits via Convex before generation
    // const hasCredits = await convex.mutation("credits:deduct", { userId, amount: creditCost });
    // if (!hasCredits) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    // Build the generation prompt
    const prompt = buildGenerationPrompt(styleSlug, sizeSlug);

    // Call Nano Banana Lite 2 via Google GenAI
    const apiKey = process.env.NANO_BANANA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.models.generateContent({
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

    const response = await model;

    // Extract the generated image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "Generation failed: no output from model" },
        { status: 500 }
      );
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "Generation failed: empty response" },
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
        { error: "Generation failed: no image in response" },
        { status: 500 }
      );
    }

    // Return the generated image as a data URL
    const dataUrl = `data:${generatedMimeType};base64,${generatedImageBase64}`;

    // TODO: Save generation to Convex database
    // await convex.mutation("generations:create", { userId, styleSlug, sizeSlug, creditCost, imageDataUrl: dataUrl });

    return NextResponse.json({
      success: true,
      imageDataUrl: dataUrl,
      mimeType: generatedMimeType,
      creditCost,
      styleName: styleSlug,
      sizeLabel: sizeConfig.label,
    });
  } catch (error) {
    console.error("[api/generate] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Generation failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
