import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/billing/credits
 *
 * Returns the current user's credit balance.
 * Used by the client for real-time balance display.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // In production, query Convex:
    // const balance = await convex.query("credits:getBalance");
    // For MVP, return placeholder while Convex is configured:
    return NextResponse.json({
      balance: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
    });
  } catch (error) {
    console.error("[api] Error fetching credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
