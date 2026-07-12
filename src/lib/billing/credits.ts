/**
 * Credit management — decoupled from any billing provider.
 *
 * Credit operations are numeric and atomic. All mutations should happen
 * inside Convex mutations with proper index lookups to avoid race conditions.
 * This module provides the logic; actual Convex calls live in convex/credits.ts.
 */

import { CREDIT_COSTS } from "../constants";

export interface CreditOperation {
  userId: string;
  amount: number; // positive = credit (grant), negative = debit (spend)
  reason: string;
  referenceId?: string;
}

export interface CreditWallet {
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  updatedAt: number;
}

/**
 * Calculate the credit cost for a given size slug.
 */
export function getCreditCost(sizeSlug: string): number {
  return CREDIT_COSTS[sizeSlug as keyof typeof CREDIT_COSTS] ?? 2;
}

/**
 * Check if a user has enough credits for an operation.
 */
export function hasEnoughCredits(balance: number, cost: number): boolean {
  return balance >= cost;
}

/**
 * Validate that a credit amount is reasonable (prevents overflow/abuse).
 */
export function isValidCreditAmount(amount: number): boolean {
  return Number.isInteger(amount) && Math.abs(amount) <= 10_000;
}

/**
 * Validate a credit reason string (prevents injection/log forgery).
 */
export function isValidCreditReason(reason: string): boolean {
  return (
    typeof reason === "string" &&
    reason.length > 0 &&
    reason.length <= 200 &&
    /^[a-zA-Z0-9_:.\-\s]+$/.test(reason)
  );
}

/**
 * Format credits for display.
 */
export function formatCredits(count: number): string {
  return `${count} credit${count !== 1 ? "s" : ""}`;
}

/**
 * Credit grant reasons (standardized for audit trail).
 */
export const CREDIT_REASONS = {
  TRIAL_GRANT: "trial:initial_grant",
  SUBSCRIPTION_MONTHLY: "subscription:monthly_renewal",
  SUBSCRIPTION_UPGRADE: "subscription:upgrade",
  ONE_OFF_PURCHASE: "purchase:one_off_pack",
  GENERATION_DEBIT: "generation:job_executed",
  GENERATION_REFUND: "generation:refund",
  ADMIN_ADJUSTMENT: "admin:manual_adjustment",
} as const;
