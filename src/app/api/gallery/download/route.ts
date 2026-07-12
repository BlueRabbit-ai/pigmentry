import { NextRequest, NextResponse } from "next/server";
import { publicUrl, signedDownloadUrl } from "@/lib/r2";

/**
 * GET /api/gallery/download
 *
 * Tracks a gallery download and redirects to the actual R2 file.
 * The client should call the Convex mutation `gallery:recordDownload`
 * before or after this redirect to track the download count.
 *
 * Query params:
 *   key  — R2 object key
 *   id   — Convex galleryItem ID (for client-side tracking)
 *   dl   — if "1", force download (Content-Disposition: attachment)
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const forceDl = req.nextUrl.searchParams.get("dl") === "1";

  if (!key) {
    return NextResponse.json({ error: "Missing key param" }, { status: 400 });
  }

  // Validate the key belongs to our gallery paths to prevent abuse
  if (!key.startsWith("gallery/")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    if (forceDl) {
      // Generate a signed URL that forces download
      const signed = await signedDownloadUrl(key, 60);
      return NextResponse.redirect(signed);
    }

    // Otherwise redirect to the public URL for inline viewing
    return NextResponse.redirect(publicUrl(key));
  } catch (error) {
    console.error("[api/gallery/download] Error:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
