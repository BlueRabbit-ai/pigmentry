/**
 * Billing plan definitions — intentionally decoupled from Clerk Billing.
 *
 * These definitions map to Clerk Billing plans for MVP but are structured
 * so they can be migrated to direct Stripe Billing or another provider
 * without changing the application's entitlement logic.
 *
 * All prices are strategy targets; Clerk Billing currently only supports USD.
 */

export interface PlanFeature {
  key: string;
  label: string;
  description: string;
}

export interface BillingPlan {
  id: string;
  clerkPlanId: string; // Clerk Billing plan ID for MVP; replace for other providers
  name: string;
  type: "subscription" | "one_off_pack" | "trial";
  priceCents: number;
  currency: "usd" | "eur"; // Clerk currently USD-only; EUR is a target
  displayPrice: string; // e.g. "€9.99" — consumer-facing
  interval?: "month" | "year";
  credits: number;
  features: PlanFeature[];
  highlighted?: boolean;
  badge?: string;
}

export const PLAN_FEATURES: Record<string, PlanFeature> = {
  all_styles: {
    key: "all_styles",
    label: "All 4 style presets",
    description: "Access to Classic Oil, Luxury Color, Selective Color, and Desktop Wallpaper",
  },
  all_sizes: {
    key: "all_sizes",
    label: "All output sizes",
    description: "Phone, Square, Laptop, and Custom dimensions",
  },
  standard_quality: {
    key: "standard_quality",
    label: "Standard quality",
    description: "High-quality oil painting output",
  },
  premium_quality: {
    key: "premium_quality",
    label: "Premium quality",
    description: "Enhanced detail and higher resolution output",
  },
  priority_generation: {
    key: "priority_generation",
    label: "Priority generation",
    description: "Faster processing in the generation queue",
  },
  early_access: {
    key: "early_access",
    label: "Early access to new styles",
    description: "Try new style presets before general release",
  },
} as const;

export const BILLING_PLANS: BillingPlan[] = [
  // === Subscriptions ===
  {
    id: "basic-monthly",
    clerkPlanId: "basic_monthly",
    name: "Basic Monthly",
    type: "subscription",
    priceCents: 999,
    currency: "usd",
    displayPrice: "€9.99",
    interval: "month",
    credits: 20,
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
      PLAN_FEATURES.standard_quality,
    ],
  },
  {
    id: "pro-monthly",
    clerkPlanId: "pro_monthly",
    name: "Pro Monthly",
    type: "subscription",
    priceCents: 1999,
    currency: "usd",
    displayPrice: "€19.99",
    interval: "month",
    credits: 60,
    highlighted: true,
    badge: "Most Popular",
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
      PLAN_FEATURES.premium_quality,
      PLAN_FEATURES.priority_generation,
    ],
  },
  {
    id: "studio-monthly",
    clerkPlanId: "studio_monthly",
    name: "Studio Monthly",
    type: "subscription",
    priceCents: 3999,
    currency: "usd",
    displayPrice: "€39.99",
    interval: "month",
    credits: 180,
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
      PLAN_FEATURES.premium_quality,
      PLAN_FEATURES.priority_generation,
      PLAN_FEATURES.early_access,
    ],
  },

  // === One-off packs ===
  {
    id: "starter-pack",
    clerkPlanId: "starter_pack",
    name: "Starter Pack",
    type: "one_off_pack",
    priceCents: 499,
    currency: "usd",
    displayPrice: "€4.99",
    credits: 3,
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
    ],
  },
  {
    id: "standard-pack",
    clerkPlanId: "standard_pack",
    name: "Standard Pack",
    type: "one_off_pack",
    priceCents: 999,
    currency: "usd",
    displayPrice: "€9.99",
    credits: 10,
    badge: "Popular",
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
    ],
  },
  {
    id: "value-pack",
    clerkPlanId: "value_pack",
    name: "Value Pack",
    type: "one_off_pack",
    priceCents: 1999,
    currency: "usd",
    displayPrice: "€19.99",
    credits: 25,
    highlighted: true,
    badge: "Best Value",
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
    ],
  },

  // === Trial ===
  {
    id: "free-trial",
    clerkPlanId: "free_trial",
    name: "Free Trial",
    type: "trial",
    priceCents: 0,
    currency: "usd",
    displayPrice: "€0",
    credits: 2,
    features: [
      PLAN_FEATURES.all_styles,
      PLAN_FEATURES.all_sizes,
      PLAN_FEATURES.standard_quality,
    ],
  },
];

/** Get a plan by its internal ID */
export function getPlanById(id: string): BillingPlan | undefined {
  return BILLING_PLANS.find((p) => p.id === id);
}

/** Get a plan by its Clerk plan ID */
export function getPlanByClerkId(clerkPlanId: string): BillingPlan | undefined {
  return BILLING_PLANS.find((p) => p.clerkPlanId === clerkPlanId);
}

/** Get all subscription plans */
export function getSubscriptionPlans(): BillingPlan[] {
  return BILLING_PLANS.filter((p) => p.type === "subscription");
}

/** Get all one-off packs */
export function getOneOffPacks(): BillingPlan[] {
  return BILLING_PLANS.filter((p) => p.type === "one_off_pack");
}

/** Check if a plan includes a specific feature key */
export function planHasFeature(plan: BillingPlan, featureKey: string): boolean {
  return plan.features.some((f) => f.key === featureKey);
}
