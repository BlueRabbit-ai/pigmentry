import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

/**
 * Publish a completed generation to the public gallery.
 * Uploads the image to R2 on the client side, then stores the R2 key.
 * Awards 1 credit to the user as a reward for sharing.
 * Only completed, credit-charged generations can be published.
 */
export const publish = mutation({
  args: {
    generationJobId: v.id("generationJobs"),
    r2Key: v.string(),
    r2PreviewKey: v.optional(v.string()),
    styleName: v.string(),
    styleSlug: v.string(),
    sizeLabel: v.string(),
    sizeSlug: v.string(),
    creditCost: v.number(),
    tags: v.array(v.string()),
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

    // Validate tags
    const cleanedTags = args.tags
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter((t) => t.length > 0 && t.length <= 30)
      .slice(0, 10); // max 10 tags

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
      r2Key: args.r2Key,
      r2PreviewKey: args.r2PreviewKey,
      styleName: args.styleName,
      styleSlug: args.styleSlug,
      sizeLabel: args.sizeLabel,
      sizeSlug: args.sizeSlug,
      creditCost: args.creditCost,
      tags: cleanedTags,
      downloadCount: 0,
      downloadCreditRewards: 0,
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
 * Record a download of a gallery item.
 * Awards +1 credit to the uploader every 10 downloads.
 * Called client-side after a successful download.
 */
export const recordDownload = mutation({
  args: {
    galleryItemId: v.id("galleryItems"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.galleryItemId);
    if (!item) throw new Error("Gallery item not found");

    const newCount = item.downloadCount + 1;
    const rewardsEarned = item.downloadCreditRewards;
    const newRewardEarned =
      Math.floor(newCount / 10) > Math.floor(item.downloadCount / 10);

    // Update download count
    await ctx.db.patch(args.galleryItemId, {
      downloadCount: newCount,
      downloadCreditRewards: rewardsEarned + (newRewardEarned ? 1 : 0),
    });

    // Award credit to the uploader if they hit a 10-download milestone
    if (newRewardEarned) {
      const wallet = await ctx.db
        .query("creditWallets")
        .withIndex("by_user", (q) => q.eq("userId", item.userId))
        .first();

      if (wallet) {
        const newBalance = wallet.balance + 1;
        await ctx.db.patch(wallet._id, {
          balance: newBalance,
          lifetimeEarned: wallet.lifetimeEarned + 1,
          updatedAt: Date.now(),
        });

        await ctx.db.insert("creditTransactions", {
          userId: item.userId,
          amount: 1,
          reason: "gallery:download_reward",
          referenceId: args.galleryItemId,
          balanceAfter: newBalance,
          createdAt: Date.now(),
        });
      }
    }

    return { downloadCount: newCount, rewardEarned: newRewardEarned };
  },
});

/**
 * Get paginated public gallery items with optional filters.
 */
export const getPublicItems = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
    styleSlug: v.optional(v.string()),
    sizeSlug: v.optional(v.string()),
    tag: v.optional(v.string()),
    sort: v.optional(v.union(v.literal("newest"), v.literal("downloads"))),
  },
  handler: async (ctx, args) => {
    let query;

    // Start with the appropriate index based on filter
    if (args.styleSlug) {
      query = ctx.db
        .query("galleryItems")
        .withIndex("by_style", (q) => q.eq("styleSlug", args.styleSlug!));
    } else {
      query = ctx.db
        .query("galleryItems")
        .withIndex("by_published");
    }

    // Apply sort
    if (args.sort === "downloads") {
      query = query.order("desc"); // by_downloads index
    } else {
      query = query.order("desc"); // by_published = newest first
    }

    let items = await query.take(args.limit ?? 20);

    // Client-side filter for size and tags (Convex filters are limited)
    if (args.sizeSlug) {
      items = items.filter((item) => item.sizeSlug === args.sizeSlug);
    }

    if (args.tag) {
      const searchTag = args.tag.toLowerCase();
      items = items.filter((item) =>
        item.tags.some((t) => t.includes(searchTag))
      );
    }

    return items.map((item) => ({
      id: item._id,
      r2Key: item.r2Key,
      r2PreviewKey: item.r2PreviewKey,
      styleName: item.styleName,
      styleSlug: item.styleSlug,
      sizeLabel: item.sizeLabel,
      sizeSlug: item.sizeSlug,
      creditCost: item.creditCost,
      tags: item.tags,
      downloadCount: item.downloadCount,
      publishedAt: item.publishedAt,
    }));
  },
});

/**
 * Get all unique tags used in the gallery (for tag cloud / suggestions).
 */
export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("galleryItems")
      .withIndex("by_published")
      .order("desc")
      .take(200);

    const tagCounts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);
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
