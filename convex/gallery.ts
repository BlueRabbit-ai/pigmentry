import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Publish a completed generation to the public gallery.
 * Awards 1 credit to the user as a reward for sharing.
 * Only completed, credit-charged generations can be published.
 */
export const publish = mutation({
  args: {
    generationJobId: v.id("generationJobs"),
    imageDataUrl: v.string(),
    styleName: v.string(),
    sizeLabel: v.string(),
    creditCost: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Verify the generation job exists, is completed, and credits were charged
    const job = await ctx.db.get(args.generationJobId);
    if (!job) throw new Error("Generation job not found");
    if (job.userId !== user._id) throw new Error("Not your generation job");
    if (job.status !== "completed") {
      throw new Error(
        "Only completed generations can be published. Failed or pending generations are not eligible."
      );
    }
    if (job.creditsCharged <= 0) {
      throw new Error(
        "Only generations where credits were deducted can be published. Free or failed conversions cannot earn credits."
      );
    }

    // Check if already published
    const existing = await ctx.db
      .query("galleryItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("generationJobId"), args.generationJobId))
      .first();

    if (existing) throw new Error("This generation is already published");

    // Insert gallery item
    await ctx.db.insert("galleryItems", {
      userId: user._id,
      generationJobId: args.generationJobId,
      outputAssetId: job.outputAssetId,
      imageDataUrl: args.imageDataUrl,
      styleName: args.styleName,
      sizeLabel: args.sizeLabel,
      creditCost: args.creditCost,
      publishedAt: Date.now(),
    });

    // Award 1 credit for publishing
    const wallet = await ctx.db
      .query("creditWallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (wallet) {
      const newBalance = wallet.balance + 1;
      await ctx.db.patch(wallet._id, {
        balance: newBalance,
        lifetimeEarned: wallet.lifetimeEarned + 1,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("creditTransactions", {
        userId: user._id,
        amount: 1,
        reason: "gallery:publish_reward",
        referenceId: args.generationJobId,
        balanceAfter: newBalance,
        createdAt: Date.now(),
      });
    }

    return { success: true, reward: 1 };
  },
});

/**
 * Get paginated public gallery items, newest first.
 */
export const getPublicItems = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("galleryItems")
      .withIndex("by_published")
      .order("desc")
      .take(args.limit ?? 20);

    return items.map((item) => ({
      id: item._id,
      imageDataUrl: item.imageDataUrl,
      styleName: item.styleName,
      sizeLabel: item.sizeLabel,
      creditCost: item.creditCost,
      publishedAt: item.publishedAt,
    }));
  },
});

/**
 * Get the current user's published gallery items.
 */
export const getMyItems = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("galleryItems")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});
