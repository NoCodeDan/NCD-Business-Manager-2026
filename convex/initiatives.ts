import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const quarterlyDataValidator = v.object({
    target: v.number(),
    actual: v.union(v.number(), v.null()),
});

const kpiValidator = v.object({
    id: v.string(),
    name: v.string(),
    unit: v.string(),
    quarters: v.object({
        q1: quarterlyDataValidator,
        q2: quarterlyDataValidator,
        q3: quarterlyDataValidator,
        q4: quarterlyDataValidator,
    }),
});

// Get all initiatives
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("initiatives").collect();
    },
});

// Get a single initiative by ID
export const getById = query({
    args: { id: v.id("initiatives") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new initiative
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        category: v.string(),
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed")
        ),
        color: v.string(),
        kpis: v.array(kpiValidator),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("initiatives", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing initiative
export const update = mutation({
    args: {
        id: v.id("initiatives"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("on-track"),
                v.literal("at-risk"),
                v.literal("behind"),
                v.literal("completed")
            )
        ),
        color: v.optional(v.string()),
        kpis: v.optional(v.array(kpiValidator)),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete an initiative
export const remove = mutation({
    args: { id: v.id("initiatives") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Update a specific KPI's quarterly data
export const updateKPI = mutation({
    args: {
        initiativeId: v.id("initiatives"),
        kpiId: v.string(),
        quarter: v.union(v.literal("q1"), v.literal("q2"), v.literal("q3"), v.literal("q4")),
        target: v.optional(v.number()),
        actual: v.optional(v.union(v.number(), v.null())),
    },
    handler: async (ctx, args) => {
        const initiative = await ctx.db.get(args.initiativeId);
        if (!initiative) throw new Error("Initiative not found");

        const updatedKpis = initiative.kpis.map((kpi) => {
            if (kpi.id !== args.kpiId) return kpi;

            return {
                ...kpi,
                quarters: {
                    ...kpi.quarters,
                    [args.quarter]: {
                        target: args.target ?? kpi.quarters[args.quarter].target,
                        actual: args.actual !== undefined ? args.actual : kpi.quarters[args.quarter].actual,
                    },
                },
            };
        });

        await ctx.db.patch(args.initiativeId, {
            kpis: updatedKpis,
            updatedAt: new Date().toISOString(),
        });
    },
});
