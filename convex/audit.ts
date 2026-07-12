import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Record an audit event.
 */
export const record = mutation({
  args: {
    userId: v.optional(v.id("users")),
    eventType: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error")
    ),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate eventType format
    if (!/^[a-z_]+(?:\.[a-z_]+)*$/.test(args.eventType)) {
      throw new Error("Invalid event type format");
    }
    // Sanitize details (truncate long strings)
    const details =
      args.details && args.details.length > 2000
        ? args.details.slice(0, 2000) + "...[truncated]"
        : args.details;

    return await ctx.db.insert("auditEvents", {
      userId: args.userId,
      eventType: args.eventType,
      severity: args.severity,
      details,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      createdAt: Date.now(),
    });
  },
});

/**
 * Query recent audit events filtered by severity.
 */
export const recent = query({
  args: {
    limit: v.optional(v.number()),
    severity: v.optional(
      v.union(
        v.literal("info"),
        v.literal("warning"),
        v.literal("error")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    if (args.severity) {
      return await ctx.db
        .query("auditEvents")
        .withIndex("by_severity", (q) => q.eq("severity", args.severity!))
        .order("desc")
        .take(args.limit ?? 100);
    }

    return await ctx.db
      .query("auditEvents")
      .order("desc")
      .take(args.limit ?? 100);
  },
});
