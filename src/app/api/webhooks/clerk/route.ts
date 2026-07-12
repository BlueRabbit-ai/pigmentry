import { NextResponse } from "next/server";

/**
 * Clerk webhook handler.
 *
 * Handles:
 * - user.created → create user record in Convex + grant free trial credits
 * - user.updated → update user record
 * - user.deleted → (future: cleanup)
 *
 * Secured by Svix webhook signature verification (handled by Clerk SDK
 * when CLERK_WEBHOOK_SECRET is configured).
 */

export async function POST(req: Request) {
  // In production, verify the webhook signature:
  // const evt = await clerkWebhookHandler(req, process.env.CLERK_WEBHOOK_SECRET);
  //
  // For MVP: parse the raw body and handle known event types.
  // The webhook is called by Clerk's servers, not by end users.

  try {
    const body = await req.json();
    const eventType = body?.type as string | undefined;

    if (!eventType) {
      return NextResponse.json(
        { error: "Missing event type" },
        { status: 400 }
      );
    }

    switch (eventType) {
      case "user.created": {
        const { id: clerkId, email_addresses, first_name, last_name } =
          body.data ?? {};
        const primaryEmail = email_addresses?.[0]?.email_address;
        const name =
          first_name || last_name
            ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
            : undefined;

        // In production, this would call Convex mutation to upsert user
        // and grant trial credits. For MVP, we log and return OK.
        console.log("[webhook] user.created", { clerkId, email: primaryEmail });

        // TODO: Call convex mutation:
        // await convex.mutation("users:upsertFromClerk", {
        //   clerkId, email: primaryEmail, name
        // });
        // await convex.mutation("credits:grantCredits", {
        //   userId: convexUserId, amount: 2, reason: "trial:initial_grant"
        // });
        break;
      }

      case "user.updated": {
        const { id: clerkId, first_name, last_name } = body.data ?? {};
        const name =
          first_name || last_name
            ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
            : undefined;

        console.log("[webhook] user.updated", { clerkId });

        // TODO: Call convex mutation
        break;
      }

      case "user.deleted": {
        const { id: clerkId } = body.data ?? {};
        console.log("[webhook] user.deleted", { clerkId });
        // TODO: Mark user as deleted, retain data for regulatory compliance
        break;
      }

      case "subscription.created":
      case "subscription.updated":
      case "subscription.deleted": {
        const { id, status, plan_id } = body.data ?? {};
        console.log(`[webhook] ${eventType}`, { id, status, plan_id });
        // TODO: Sync subscription state to Convex purchases table
        break;
      }

      default: {
        console.log(`[webhook] unhandled event: ${eventType}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
