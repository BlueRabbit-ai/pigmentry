import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Require authentication for server components and actions.
 * Redirects to /sign-up if the user is not signed in.
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  return userId;
}

/**
 * Get the current user ID without redirecting.
 * Returns null if not authenticated.
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}
