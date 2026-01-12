import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Validators for nested objects
const quarterlyActionValidator = v.object({
    id: v.string(),
    action: v.string(),
    category: v.string(),
    completed: v.boolean(),
    completedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
});

const shippingTargetsValidator = v.object({
    mvps: v.object({
        target: v.number(),
        actual: v.optional(v.number()),
    }),
    internalProducts: v.object({
        target: v.number(),
        actual: v.optional(v.number()),
    }),
    buildBreakdowns: v.object({
        target: v.number(),
        actual: v.optional(v.number()),
    }),
});

const revenueTargetsValidator = v.object({
    min: v.number(),
    max: v.number(),
    actual: v.optional(v.number()),
});

const audienceTargetValidator = v.object({
    id: v.string(),
    metric: v.string(),
    target: v.number(),
    actual: v.optional(v.number()),
});

const contentTargetValidator = v.object({
    id: v.string(),
    type: v.string(),
    target: v.number(),
    actual: v.optional(v.number()),
});

// ==========================================
// QUERY OPERATIONS
// ==========================================

// Get all quarterly plans
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("quarterlyPlans").order("asc").collect();
    },
});

// Get a single quarterly plan by ID
export const getById = query({
    args: { id: v.id("quarterlyPlans") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get plans by year
export const getByYear = query({
    args: { year: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("quarterlyPlans")
            .filter((q) => q.eq(q.field("year"), args.year))
            .collect();
    },
});

// Get a specific quarter
export const getByYearAndQuarter = query({
    args: {
        year: v.number(),
        quarter: v.union(
            v.literal("Q1"),
            v.literal("Q2"),
            v.literal("Q3"),
            v.literal("Q4")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("quarterlyPlans")
            .withIndex("by_year_quarter", (q) =>
                q.eq("year", args.year).eq("quarter", args.quarter)
            )
            .first();
    },
});

// Get current quarter (based on current date)
export const getCurrentQuarter = query({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 0-indexed

        let quarter: "Q1" | "Q2" | "Q3" | "Q4";
        if (month <= 3) quarter = "Q1";
        else if (month <= 6) quarter = "Q2";
        else if (month <= 9) quarter = "Q3";
        else quarter = "Q4";

        return await ctx.db
            .query("quarterlyPlans")
            .withIndex("by_year_quarter", (q) =>
                q.eq("year", year).eq("quarter", quarter)
            )
            .first();
    },
});

// Get plans by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("upcoming"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("reviewed")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("quarterlyPlans")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Search quarterly plans
export const search = query({
    args: {
        query: v.optional(v.string()),
        year: v.optional(v.number()),
        quarter: v.optional(
            v.union(
                v.literal("Q1"),
                v.literal("Q2"),
                v.literal("Q3"),
                v.literal("Q4")
            )
        ),
        status: v.optional(
            v.union(
                v.literal("upcoming"),
                v.literal("in-progress"),
                v.literal("completed"),
                v.literal("reviewed")
            )
        ),
    },
    handler: async (ctx, args) => {
        let plans = await ctx.db.query("quarterlyPlans").collect();

        // Filter by year
        if (args.year) {
            plans = plans.filter((p) => p.year === args.year);
        }

        // Filter by quarter
        if (args.quarter) {
            plans = plans.filter((p) => p.quarter === args.quarter);
        }

        // Filter by status
        if (args.status) {
            plans = plans.filter((p) => p.status === args.status);
        }

        // Filter by search query
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            plans = plans.filter(
                (plan) =>
                    plan.theme.toLowerCase().includes(searchLower) ||
                    plan.primaryObjective.toLowerCase().includes(searchLower) ||
                    plan.focusAreas.some((f) =>
                        f.toLowerCase().includes(searchLower)
                    ) ||
                    plan.keyActions.some((a) =>
                        a.action.toLowerCase().includes(searchLower)
                    )
            );
        }

        return plans;
    },
});

// ==========================================
// MUTATION OPERATIONS
// ==========================================

// Create a new quarterly plan
export const create = mutation({
    args: {
        year: v.number(),
        quarter: v.union(
            v.literal("Q1"),
            v.literal("Q2"),
            v.literal("Q3"),
            v.literal("Q4")
        ),
        theme: v.string(),
        primaryObjective: v.string(),
        focusAreas: v.array(v.string()),
        keyActions: v.array(quarterlyActionValidator),
        shippingTargets: shippingTargetsValidator,
        revenueTargets: revenueTargetsValidator,
        audienceTargets: v.array(audienceTargetValidator),
        contentTargets: v.array(contentTargetValidator),
        status: v.union(
            v.literal("upcoming"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("reviewed")
        ),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("quarterlyPlans", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing quarterly plan
export const update = mutation({
    args: {
        id: v.id("quarterlyPlans"),
        theme: v.optional(v.string()),
        primaryObjective: v.optional(v.string()),
        focusAreas: v.optional(v.array(v.string())),
        keyActions: v.optional(v.array(quarterlyActionValidator)),
        shippingTargets: v.optional(shippingTargetsValidator),
        revenueTargets: v.optional(revenueTargetsValidator),
        audienceTargets: v.optional(v.array(audienceTargetValidator)),
        contentTargets: v.optional(v.array(contentTargetValidator)),
        status: v.optional(
            v.union(
                v.literal("upcoming"),
                v.literal("in-progress"),
                v.literal("completed"),
                v.literal("reviewed")
            )
        ),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a quarterly plan
export const remove = mutation({
    args: { id: v.id("quarterlyPlans") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle action completion
export const toggleAction = mutation({
    args: {
        planId: v.id("quarterlyPlans"),
        actionId: v.string(),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Quarterly plan not found");

        const updatedActions = plan.keyActions.map((action) => {
            if (action.id !== args.actionId) return action;

            const newCompleted = !action.completed;
            return {
                ...action,
                completed: newCompleted,
                completedDate: newCompleted ? new Date().toISOString() : undefined,
            };
        });

        await ctx.db.patch(args.planId, {
            keyActions: updatedActions,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Update shipping targets actual values
export const updateShippingTargets = mutation({
    args: {
        planId: v.id("quarterlyPlans"),
        mvps: v.optional(v.number()),
        internalProducts: v.optional(v.number()),
        buildBreakdowns: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Quarterly plan not found");

        const updatedTargets = {
            mvps: {
                target: plan.shippingTargets.mvps.target,
                actual: args.mvps ?? plan.shippingTargets.mvps.actual,
            },
            internalProducts: {
                target: plan.shippingTargets.internalProducts.target,
                actual:
                    args.internalProducts ??
                    plan.shippingTargets.internalProducts.actual,
            },
            buildBreakdowns: {
                target: plan.shippingTargets.buildBreakdowns.target,
                actual:
                    args.buildBreakdowns ??
                    plan.shippingTargets.buildBreakdowns.actual,
            },
        };

        await ctx.db.patch(args.planId, {
            shippingTargets: updatedTargets,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Update revenue actual
export const updateRevenueActual = mutation({
    args: {
        planId: v.id("quarterlyPlans"),
        actual: v.number(),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Quarterly plan not found");

        await ctx.db.patch(args.planId, {
            revenueTargets: {
                ...plan.revenueTargets,
                actual: args.actual,
            },
            updatedAt: new Date().toISOString(),
        });
    },
});

// Get year summary (all quarters for a year)
export const getYearSummary = query({
    args: { year: v.number() },
    handler: async (ctx, args) => {
        const plans = await ctx.db
            .query("quarterlyPlans")
            .filter((q) => q.eq(q.field("year"), args.year))
            .collect();

        const summary = {
            year: args.year,
            quarters: plans.length,
            totalRevenue: {
                min: 0,
                max: 0,
                actual: 0,
            },
            totalShipping: {
                mvps: { target: 0, actual: 0 },
                internalProducts: { target: 0, actual: 0 },
                buildBreakdowns: { target: 0, actual: 0 },
            },
            actionsCompleted: 0,
            actionsTotal: 0,
        };

        plans.forEach((plan) => {
            summary.totalRevenue.min += plan.revenueTargets.min;
            summary.totalRevenue.max += plan.revenueTargets.max;
            summary.totalRevenue.actual += plan.revenueTargets.actual || 0;

            summary.totalShipping.mvps.target += plan.shippingTargets.mvps.target;
            summary.totalShipping.mvps.actual +=
                plan.shippingTargets.mvps.actual || 0;
            summary.totalShipping.internalProducts.target +=
                plan.shippingTargets.internalProducts.target;
            summary.totalShipping.internalProducts.actual +=
                plan.shippingTargets.internalProducts.actual || 0;
            summary.totalShipping.buildBreakdowns.target +=
                plan.shippingTargets.buildBreakdowns.target;
            summary.totalShipping.buildBreakdowns.actual +=
                plan.shippingTargets.buildBreakdowns.actual || 0;

            summary.actionsTotal += plan.keyActions.length;
            summary.actionsCompleted += plan.keyActions.filter(
                (a) => a.completed
            ).length;
        });

        return summary;
    },
});
