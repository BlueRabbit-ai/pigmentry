"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { Coins } from "lucide-react";
import Link from "next/link";

/**
 * Compact credit balance display for the app header.
 * Shows live balance from Convex next to the UserButton.
 */
export function HeaderCredits() {
  const data = useQuery(api.credits.getBalance, {});
  const balance = (data as any)?.balance ?? 0;

  return (
    <Link
      href="/app/billing"
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      title={`${balance} credit${balance !== 1 ? "s" : ""} remaining — click for billing`}
    >
      <Coins className="size-4 text-primary" />
      <span className="tabular-nums font-medium text-foreground">{balance}</span>
    </Link>
  );
}
