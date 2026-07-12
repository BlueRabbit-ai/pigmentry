import { NextRequest, NextResponse } from "next/server";

// In production, this calls Convex directly.
// For MVP, the client-side Convex hooks handle data fetching.
// This route exists for the gallery page to fetch via REST.

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const styleSlug = params.get("styleSlug");
    const sizeSlug = params.get("sizeSlug");
    const tag = params.get("tag");
    const limit = params.get("limit") ?? "20";

    // Call Convex HTTP action
    const convexUrl = `${CONVEX_SITE_URL}/gallery/getPublicItems`;
    const res = await fetch(convexUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        limit: parseInt(limit),
        styleSlug: styleSlug || undefined,
        sizeSlug: sizeSlug || undefined,
        tag: tag || undefined,
        sort: "newest",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const items = await res.json();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/gallery/items] Error:", error);
    // Return empty array gracefully
    return NextResponse.json({ items: [] });
  }
}
