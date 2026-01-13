import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// QUERIES
// ==========================================

// Get all deals
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("deals").collect();
    },
});

// Get deal by ID
export const getById = query({
    args: { id: v.id("deals") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get deals by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("lead"),
            v.literal("proposal"),
            v.literal("negotiation"),
            v.literal("won"),
            v.literal("lost")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("deals")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get won deals (revenue)
export const getWonDeals = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("deals")
            .withIndex("by_status", (q) => q.eq("status", "won"))
            .collect();
    },
});

// Get pipeline (active deals)
export const getPipeline = query({
    args: {},
    handler: async (ctx) => {
        const allDeals = await ctx.db.query("deals").collect();
        return allDeals.filter(d =>
            d.status !== "won" && d.status !== "lost"
        );
    },
});

// Get deals by business area
export const getByBusinessArea = query({
    args: {
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("deals")
            .withIndex("by_business_area", (q) => q.eq("businessArea", args.businessArea))
            .collect();
    },
});

// Get deals summary
export const getSummary = query({
    args: {},
    handler: async (ctx) => {
        const deals = await ctx.db.query("deals").collect();

        const wonDeals = deals.filter(d => d.status === "won");
        const pipelineDeals = deals.filter(d =>
            d.status !== "won" && d.status !== "lost"
        );

        const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0);
        const pipelineValue = pipelineDeals.reduce((sum, d) => {
            const probability = d.probability || 50;
            return sum + (d.amount * probability / 100);
        }, 0);

        // Revenue by business area
        const revenueByArea: Record<string, number> = {};
        wonDeals.forEach(d => {
            revenueByArea[d.businessArea] = (revenueByArea[d.businessArea] || 0) + d.amount;
        });

        return {
            totalDeals: deals.length,
            wonDeals: wonDeals.length,
            pipelineDeals: pipelineDeals.length,
            totalRevenue,
            pipelineValue,
            revenueByArea,
        };
    },
});

// ==========================================
// MUTATIONS
// ==========================================

// Create a new deal
export const create = mutation({
    args: {
        name: v.string(),
        client: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("lead"),
            v.literal("proposal"),
            v.literal("negotiation"),
            v.literal("won"),
            v.literal("lost")
        ),
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
        probability: v.optional(v.number()),
        expectedCloseDate: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("deals", {
            ...args,
            closedDate: undefined,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update a deal
export const update = mutation({
    args: {
        id: v.id("deals"),
        name: v.optional(v.string()),
        client: v.optional(v.string()),
        amount: v.optional(v.number()),
        status: v.optional(v.union(
            v.literal("lead"),
            v.literal("proposal"),
            v.literal("negotiation"),
            v.literal("won"),
            v.literal("lost")
        )),
        businessArea: v.optional(v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        )),
        probability: v.optional(v.number()),
        expectedCloseDate: v.optional(v.string()),
        closedDate: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Deal not found");

        // If status changed to won/lost and no closedDate, set it
        if (updates.status && (updates.status === "won" || updates.status === "lost") && !updates.closedDate) {
            updates.closedDate = new Date().toISOString();
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete a deal
export const remove = mutation({
    args: { id: v.id("deals") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Mark deal as won
export const markAsWon = mutation({
    args: { id: v.id("deals") },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        await ctx.db.patch(args.id, {
            status: "won",
            probability: 100,
            closedDate: now,
            updatedAt: now,
        });
    },
});

// Mark deal as lost
export const markAsLost = mutation({
    args: { id: v.id("deals") },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        await ctx.db.patch(args.id, {
            status: "lost",
            probability: 0,
            closedDate: now,
            updatedAt: now,
        });
    },
});
