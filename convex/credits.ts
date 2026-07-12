import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isValidCreditAmount, isValidCreditReason } from "../src/lib/billing/credits";

/**
 * Query the credit balance for the current user.
 */
export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };

    const wallet = await ctx.db
      .query("creditWallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!wallet) {
      return { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };
    }

    return {
      balance: wallet.balance,
      lifetimeEarned: wallet.lifetimeEarned,
      lifetimeSpent: wallet.lifetimeSpent,
    };
  },
});

/**
 * Grant credits to a user (called by webhooks / purchase handlers).
 * Creates a credit wallet if one doesn't exist.
 */
export const grantCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
    referenceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isValidCreditAmount(args.amount) || args.amount <= 0) {
      throw new Error("Invalid credit amount");
    }
    if (!isValidCreditReason(args.reason)) {
      throw new Error("Invalid credit reason");
    }

    // Get or create wallet
    let wallet = await ctx.db
      .query("creditWallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("creditWallets", {
        userId: args.userId,
        balance: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        updatedAt: Date.now(),
      });
      wallet = await ctx.db.get(walletId);
      if (!wallet) throw new Error("Failed to create wallet");
    }

    const newBalance = wallet.balance + args.amount;

    await ctx.db.patch(wallet._id, {
      balance: newBalance,
      lifetimeEarned: wallet.lifetimeEarned + args.amount,
      updatedAt: Date.now(),
    });

    // Record transaction for audit trail
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      amount: args.amount,
      reason: args.reason,
      referenceId: args.referenceId,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    });

    return { newBalance };
  },
});

/**
 * Deduct credits from a user (called at generation time).
 * Fails if insufficient balance.
 */
export const deductCredits = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
    referenceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isValidCreditAmount(args.amount) || args.amount <= 0) {
      throw new Error("Invalid credit amount");
    }
    if (!isValidCreditReason(args.reason)) {
      throw new Error("Invalid credit reason");
    }

    const wallet = await ctx.db
      .query("creditWallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) throw new Error("No credit wallet found");
    if (wallet.balance < args.amount) {
      throw new Error("Insufficient credits");
    }

    const newBalance = wallet.balance - args.amount;

    await ctx.db.patch(wallet._id, {
      balance: newBalance,
      lifetimeSpent: wallet.lifetimeSpent + args.amount,
      updatedAt: Date.now(),
    });

    // Record transaction for audit trail
    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      amount: -args.amount,
      reason: args.reason,
      referenceId: args.referenceId,
      balanceAfter: newBalance,
      createdAt: Date.now(),
    });

    return { newBalance };
  },
});

/**
 * Get transaction history for the current user.
 */
export const getTransactionHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("creditTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});
