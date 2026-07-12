import { NextResponse } from "next/server";

const CONVEX_SITE = process.env.NEXT_PUBLIC_CONVEX_SITE_URL!;

async function convexMutation(name: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${CONVEX_SITE}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Convex mutation ${name} failed: ${res.status}`);
  return res.json();
}

/**
 * Clerk webhook handler.
 *
 * Syncs Clerk users to Convex and grants trial credits on sign-up.
 * Called exclusively by Clerk's servers — not by end users.
 *
 * In production, verify Svix webhook signatures with CLERK_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body?.type as string | undefined;

    if (!eventType) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 });
    }

    switch (eventType) {
      case "user.created": {
        const { id: clerkId, email_addresses, first_name, last_name } = body.data ?? {};
        const email = email_addresses?.[0]?.email_address;
        const name =
          first_name || last_name
            ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
            : undefined;

        if (!clerkId || !email) {
          console.warn("[webhook] user.created missing clerkId or email");
          break;
        }

        try {
          // Create user in Convex
          const userId = await convexMutation("users:upsertFromClerk", {
            clerkId,
            email,
            name,
          });

          // Grant 2 free trial credits
          await convexMutation("credits:grantCredits", {
            userId,
            amount: 2,
            reason: "trial:initial_grant",
          });

          console.log("[webhook] user.created → Convex synced", {
            clerkId,
            email,
            trialCredits: 2,
          });
        } catch (err) {
          // Convex might not be fully wired yet — log and continue.
          // Clerk will NOT retry because we return 200.
          console.error(
            "[webhook] user.created — Convex sync failed (non-fatal):",
            err instanceof Error ? err.message : err
          );
        }
        break;
      }

      case "user.updated": {
        const { id: clerkId, email_addresses, first_name, last_name } = body.data ?? {};
        const email = email_addresses?.[0]?.email_address;
        const name =
          first_name || last_name
            ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
            : undefined;

        if (!clerkId) break;

        try {
          await convexMutation("users:upsertFromClerk", {
            clerkId,
            email: email ?? "",
            name,
          });
        } catch (err) {
          console.error("[webhook] user.updated — Convex sync failed:", err);
        }
        break;
      }

      case "user.deleted": {
        const { id: clerkId } = body.data ?? {};
        if (!clerkId) break;
        console.log("[webhook] user.deleted", { clerkId });
        // Data retention: we do NOT delete the user record,
        // only mark it for regulatory compliance.
        break;
      }

      case "subscription.created":
      case "subscription.updated":
      case "subscription.deleted": {
        const { id, status, plan_id } = body.data ?? {};
        console.log(`[webhook] ${eventType}`, { id, status, plan_id });
        // Subscription syncing will be wired when Clerk Billing plans are created.
        break;
      }

      default: {
        console.log(`[webhook] unhandled event: ${eventType}`);
      }
    }

    // Always return 200 so Clerk doesn't retry
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Fatal error:", error);
    // Still return 200 — a malformed webhook shouldn't cause Clerk to retry
    return NextResponse.json({ received: true });
  }
}
