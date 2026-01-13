import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Validator for messaging object
const messagingValidator = v.object({
    id: v.string(),
    message: v.string(),
    channel: v.string(),
});

// ==========================================
// QUERY OPERATIONS
// ==========================================

// Get all target ICPs
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("targetICP").order("asc").collect();
    },
});

// Get a single target ICP by ID
export const getById = query({
    args: { id: v.id("targetICP") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get ICPs by business area
export const getByBusiness = query({
    args: {
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("targetICP")
            .withIndex("by_business", (q) => q.eq("business", args.business))
            .collect();
    },
});

// Get all active ICPs
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("targetICP")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .collect();
    },
});

// Get active ICPs by business
export const getActiveByBusiness = query({
    args: {
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan")
        ),
    },
    handler: async (ctx, args) => {
        const icps = await ctx.db
            .query("targetICP")
            .withIndex("by_business", (q) => q.eq("business", args.business))
            .collect();

        return icps.filter((icp) => icp.isActive);
    },
});

// Search target ICPs
export const search = query({
    args: {
        query: v.optional(v.string()),
        business: v.optional(
            v.union(
                v.literal("tangible-ideas"),
                v.literal("no-code-effect"),
                v.literal("adalo"),
                v.literal("no-code-dan")
            )
        ),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let icps = await ctx.db.query("targetICP").collect();

        // Filter by business
        if (args.business) {
            icps = icps.filter((icp) => icp.business === args.business);
        }

        // Filter by active status
        if (args.isActive !== undefined) {
            icps = icps.filter((icp) => icp.isActive === args.isActive);
        }

        // Filter by search query
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            icps = icps.filter(
                (icp) =>
                    icp.name.toLowerCase().includes(searchLower) ||
                    icp.description.toLowerCase().includes(searchLower) ||
                    icp.characteristics.some((c) =>
                        c.toLowerCase().includes(searchLower)
                    ) ||
                    icp.painPoints.some((p) =>
                        p.toLowerCase().includes(searchLower)
                    ) ||
                    icp.messaging.some(
                        (m) =>
                            m.message.toLowerCase().includes(searchLower) ||
                            m.channel.toLowerCase().includes(searchLower)
                    )
            );
        }

        return icps;
    },
});

// ==========================================
// MUTATION OPERATIONS
// ==========================================

// Create a new target ICP
export const create = mutation({
    args: {
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan")
        ),
        name: v.string(),
        description: v.string(),
        characteristics: v.array(v.string()),
        painPoints: v.array(v.string()),
        messaging: v.array(messagingValidator),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("targetICP", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing target ICP
export const update = mutation({
    args: {
        id: v.id("targetICP"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        characteristics: v.optional(v.array(v.string())),
        painPoints: v.optional(v.array(v.string())),
        messaging: v.optional(v.array(messagingValidator)),
        order: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a target ICP
export const remove = mutation({
    args: { id: v.id("targetICP") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle active status
export const toggleActive = mutation({
    args: { id: v.id("targetICP") },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.id);
        if (!icp) throw new Error("Target ICP not found");

        await ctx.db.patch(args.id, {
            isActive: !icp.isActive,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add a characteristic
export const addCharacteristic = mutation({
    args: {
        icpId: v.id("targetICP"),
        characteristic: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        await ctx.db.patch(args.icpId, {
            characteristics: [...icp.characteristics, args.characteristic],
            updatedAt: new Date().toISOString(),
        });
    },
});

// Remove a characteristic
export const removeCharacteristic = mutation({
    args: {
        icpId: v.id("targetICP"),
        characteristic: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        const updatedCharacteristics = icp.characteristics.filter(
            (c) => c !== args.characteristic
        );

        await ctx.db.patch(args.icpId, {
            characteristics: updatedCharacteristics,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add a pain point
export const addPainPoint = mutation({
    args: {
        icpId: v.id("targetICP"),
        painPoint: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        await ctx.db.patch(args.icpId, {
            painPoints: [...icp.painPoints, args.painPoint],
            updatedAt: new Date().toISOString(),
        });
    },
});

// Remove a pain point
export const removePainPoint = mutation({
    args: {
        icpId: v.id("targetICP"),
        painPoint: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        const updatedPainPoints = icp.painPoints.filter(
            (p) => p !== args.painPoint
        );

        await ctx.db.patch(args.icpId, {
            painPoints: updatedPainPoints,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add messaging
export const addMessaging = mutation({
    args: {
        icpId: v.id("targetICP"),
        message: v.string(),
        channel: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        const newMessaging = {
            id: crypto.randomUUID(),
            message: args.message,
            channel: args.channel,
        };

        await ctx.db.patch(args.icpId, {
            messaging: [...icp.messaging, newMessaging],
            updatedAt: new Date().toISOString(),
        });

        return newMessaging.id;
    },
});

// Update messaging
export const updateMessaging = mutation({
    args: {
        icpId: v.id("targetICP"),
        messagingId: v.string(),
        message: v.optional(v.string()),
        channel: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        const updatedMessaging = icp.messaging.map((m) => {
            if (m.id !== args.messagingId) return m;

            return {
                ...m,
                message: args.message ?? m.message,
                channel: args.channel ?? m.channel,
            };
        });

        await ctx.db.patch(args.icpId, {
            messaging: updatedMessaging,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Remove messaging
export const removeMessaging = mutation({
    args: {
        icpId: v.id("targetICP"),
        messagingId: v.string(),
    },
    handler: async (ctx, args) => {
        const icp = await ctx.db.get(args.icpId);
        if (!icp) throw new Error("Target ICP not found");

        const updatedMessaging = icp.messaging.filter(
            (m) => m.id !== args.messagingId
        );

        await ctx.db.patch(args.icpId, {
            messaging: updatedMessaging,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Get ICP summary
export const getICPSummary = query({
    args: {},
    handler: async (ctx) => {
        const icps = await ctx.db.query("targetICP").collect();

        const summary = {
            total: icps.length,
            active: icps.filter((icp) => icp.isActive).length,
            byBusiness: {
                "tangible-ideas": 0,
                "no-code-effect": 0,
                adalo: 0,
                "no-code-dan": 0,
            },
            totalCharacteristics: 0,
            totalPainPoints: 0,
            totalMessaging: 0,
        };

        icps.forEach((icp) => {
            summary.byBusiness[icp.business]++;
            summary.totalCharacteristics += icp.characteristics.length;
            summary.totalPainPoints += icp.painPoints.length;
            summary.totalMessaging += icp.messaging.length;
        });

        return summary;
    },
});
