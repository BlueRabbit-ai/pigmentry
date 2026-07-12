/**
 * Entitlement / feature gating — decoupled from Clerk Billing.
 *
 * In MVP, entitlements are checked against the user's active plan
 * (stored in Convex after webhook sync from Clerk). The gating functions
 * below work against plan feature keys and credit balance.
 */

import type { BillingPlan } from "./plans";

export interface UserEntitlement {
  userId: string;
  activePlanId: string | null;
  planType: "subscription" | "one_off_pack" | "trial" | null;
  creditBalance: number;
  featureKeys: string[];
}

/**
 * Check if a user has access to a specific feature.
 */
export function canAccessFeature(
  entitlement: UserEntitlement,
  featureKey: string
): boolean {
  return entitlement.featureKeys.includes(featureKey);
}

/**
 * Check if a user can generate (has credits + is on any plan).
 */
export function canGenerate(entitlement: UserEntitlement): boolean {
  return entitlement.activePlanId !== null && entitlement.creditBalance > 0;
}

/**
 * Check if a user is on a paid plan (not trial).
 */
export function isPaidPlan(entitlement: UserEntitlement): boolean {
  return (
    entitlement.planType === "subscription" ||
    entitlement.planType === "one_off_pack"
  );
}

/**
 * Build entitlement from a plan + credit balance.
 */
export function buildEntitlement(
  userId: string,
  plan: BillingPlan | null,
  creditBalance: number
): UserEntitlement {
  return {
    userId,
    activePlanId: plan?.id ?? null,
    planType: plan?.type ?? null,
    creditBalance,
    featureKeys: plan?.features.map((f) => f.key) ?? [],
  };
}
