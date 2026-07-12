import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profile synced from Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Credit wallet per user
  creditWallets: defineTable({
    userId: v.id("users"),
    balance: v.number(), // current credit balance
    lifetimeEarned: v.number(), // total credits ever added
    lifetimeSpent: v.number(), // total credits ever spent
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Credit transactions (audit trail)
  creditTransactions: defineTable({
    userId: v.id("users"),
    amount: v.number(), // positive = credit, negative = debit
    reason: v.string(), // e.g. "purchase:starter_pack", "generation:job_xxx", "subscription:monthly"
    referenceId: v.optional(v.string()), // e.g. purchase ID or generation job ID
    balanceAfter: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_reference", ["referenceId"]),

  // Source assets (user uploads)
  sourceAssets: defineTable({
    userId: v.id("users"),
    storageKey: v.string(), // R2 object key
    originalFilename: v.string(),
    mimeType: v.string(), // image/jpeg, image/png, image/webp
    width: v.number(),
    height: v.number(),
    sizeBytes: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Output assets (generated paintings)
  outputAssets: defineTable({
    userId: v.id("users"),
    generationJobId: v.id("generationJobs"),
    storageKey: v.string(), // R2 object key
    mimeType: v.string(),
    width: v.number(),
    height: v.number(),
    sizeBytes: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_job", ["generationJobId"]),

  // Generation jobs
  generationJobs: defineTable({
    userId: v.id("users"),
    sourceAssetId: v.id("sourceAssets"),
    outputAssetId: v.optional(v.id("outputAssets")),
    presetSlug: v.string(), // e.g. "classic-oil", "luxury-color"
    requestedWidth: v.number(),
    requestedHeight: v.number(),
    sizeClass: v.string(), // "phone" | "square" | "laptop" | "custom"
    creditsCharged: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    provider: v.literal("gemini-3.1-flash-lite-image"),
    providerRequestId: v.optional(v.string()),
    promptVersion: v.string(),
    errorCode: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Prompt templates (server-managed)
  promptTemplates: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    masterPrompt: v.string(),
    modifiers: v.optional(
      v.array(
        v.object({
          key: v.string(),
          label: v.string(),
          promptAddition: v.string(),
        })
      )
    ),
    version: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"]),

  // Style presets
  stylePresets: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    promptModifier: v.string(), // appended to the master prompt
    previewImageKey: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_slug", ["slug"]),

  // Purchases (one-off packs / subscription tracking)
  purchases: defineTable({
    userId: v.id("users"),
    clerkSessionId: v.optional(v.string()),
    productType: v.union(
      v.literal("one_off_pack"),
      v.literal("subscription"),
      v.literal("trial")
    ),
    productId: v.string(), // Clerk plan/price ID
    creditsGranted: v.number(),
    amountPaid: v.number(), // in cents
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Public gallery — user-published generations
  galleryItems: defineTable({
    userId: v.id("users"),
    generationJobId: v.id("generationJobs"),
    outputAssetId: v.optional(v.id("outputAssets")),
    r2Key: v.string(), // R2 object key for the full-resolution image
    r2PreviewKey: v.optional(v.string()), // R2 object key for the watermarked preview
    styleName: v.string(),
    styleSlug: v.string(), // "classic-oil" | "luxury-color" | "selective-color" | "desktop-wallpaper"
    sizeLabel: v.string(),
    sizeSlug: v.string(), // "phone" | "square" | "laptop" | "custom"
    creditCost: v.number(), // credits charged for the original generation
    tags: v.array(v.string()), // user-assigned hashtags e.g. ["portrait", "sunset"]
    downloadCount: v.number(), // how many times this has been downloaded
    downloadCreditRewards: v.number(), // how many +1 credit rewards already given (1 per 10 downloads)
    publishedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_published", ["publishedAt"])
    .index("by_style", ["styleSlug"])
    .index("by_downloads", ["downloadCount"]),

  // Audit events (security and monitoring)
  auditEvents: defineTable({
    userId: v.optional(v.id("users")),
    eventType: v.string(),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("error")),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["eventType"])
    .index("by_severity", ["severity"]),
});
