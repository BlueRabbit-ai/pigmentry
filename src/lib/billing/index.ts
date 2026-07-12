/**
 * Billing abstraction — single import surface.
 *
 * All billing logic is decoupled from Clerk Billing so the
 * provider can be changed without touching application code.
 */

export { BILLING_PLANS, getPlanById, getPlanByClerkId, getSubscriptionPlans, getOneOffPacks, planHasFeature } from "./plans";
export type { BillingPlan, PlanFeature } from "./plans";

export { getCreditCost, hasEnoughCredits, isValidCreditAmount, isValidCreditReason, formatCredits, CREDIT_REASONS } from "./credits";
export type { CreditOperation, CreditWallet } from "./credits";

export { canAccessFeature, canGenerate, isPaidPlan, buildEntitlement } from "./entitlements";
export type { UserEntitlement } from "./entitlements";
