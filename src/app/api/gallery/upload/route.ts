import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToR2, galleryKey, base64ToBuffer } from "@/lib/r2";

/**
 * POST /api/gallery/upload
 *
 * Uploads a base64 image to R2 and returns the object key + public URL.
 * Used when publishing a generation to the public gallery.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { imageDataUrl, styleSlug } = body;

    if (!imageDataUrl || !styleSlug) {
      return NextResponse.json(
        { error: "Missing imageDataUrl or styleSlug" },
        { status: 400 }
      );
    }

    // Decode the base64 data URL
    const { buffer, mimeType } = base64ToBuffer(imageDataUrl);

    // Upload full-resolution to R2
    const key = galleryKey(userId, styleSlug);
    const url = await uploadToR2(key, buffer, mimeType);

    return NextResponse.json({
      success: true,
      r2Key: key,
      url,
      mimeType,
      sizeBytes: buffer.length,
    });
  } catch (error) {
    console.error("[api/gallery/upload] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
