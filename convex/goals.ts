import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Validators for nested objects
const goalTargetValidator = v.object({
    id: v.string(),
    metric: v.string(),
    target: v.string(),
    unit: v.string(),
    measureType: v.union(
        v.literal("range"),
        v.literal("minimum"),
        v.literal("exact"),
        v.literal("milestone")
    ),
    priority: v.union(
        v.literal("critical"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low")
    ),
    currentValue: v.optional(v.string()),
    notes: v.optional(v.string()),
});

// ==========================================
// QUERY OPERATIONS
// ==========================================

// Get all goals
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("goals").order("asc").collect();
    },
});

// Get a single goal by ID
export const getById = query({
    args: { id: v.id("goals") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get goals by type
export const getByType = query({
    args: {
        type: v.union(
            v.literal("north-star"),
            v.literal("business"),
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("personal-brand"),
            v.literal("product-ip"),
            v.literal("systems-ops")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("goals")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
    },
});

// Get goals by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed"),
            v.literal("not-started")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("goals")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get the North Star goal
export const getNorthStar = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("goals")
            .withIndex("by_type", (q) => q.eq("type", "north-star"))
            .first();
    },
});

// Search goals
export const search = query({
    args: {
        query: v.optional(v.string()),
        type: v.optional(
            v.union(
                v.literal("north-star"),
                v.literal("business"),
                v.literal("tangible-ideas"),
                v.literal("no-code-effect"),
                v.literal("personal-brand"),
                v.literal("product-ip"),
                v.literal("systems-ops")
            )
        ),
        status: v.optional(
            v.union(
                v.literal("on-track"),
                v.literal("at-risk"),
                v.literal("behind"),
                v.literal("completed"),
                v.literal("not-started")
            )
        ),
    },
    handler: async (ctx, args) => {
        let goals = await ctx.db.query("goals").collect();

        // Filter by type
        if (args.type) {
            goals = goals.filter((g) => g.type === args.type);
        }

        // Filter by status
        if (args.status) {
            goals = goals.filter((g) => g.status === args.status);
        }

        // Filter by search query
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            goals = goals.filter(
                (goal) =>
                    goal.title.toLowerCase().includes(searchLower) ||
                    goal.description.toLowerCase().includes(searchLower) ||
                    goal.category.toLowerCase().includes(searchLower) ||
                    goal.targets.some(
                        (t) =>
                            t.metric.toLowerCase().includes(searchLower) ||
                            t.target.toLowerCase().includes(searchLower)
                    )
            );
        }

        return goals;
    },
});

// ==========================================
// MUTATION OPERATIONS
// ==========================================

// Create a new goal
export const create = mutation({
    args: {
        type: v.union(
            v.literal("north-star"),
            v.literal("business"),
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("personal-brand"),
            v.literal("product-ip"),
            v.literal("systems-ops")
        ),
        title: v.string(),
        description: v.string(),
        category: v.string(),
        targets: v.array(goalTargetValidator),
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed"),
            v.literal("not-started")
        ),
        color: v.string(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("goals", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing goal
export const update = mutation({
    args: {
        id: v.id("goals"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        targets: v.optional(v.array(goalTargetValidator)),
        status: v.optional(
            v.union(
                v.literal("on-track"),
                v.literal("at-risk"),
                v.literal("behind"),
                v.literal("completed"),
                v.literal("not-started")
            )
        ),
        color: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a goal
export const remove = mutation({
    args: { id: v.id("goals") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Update a specific target within a goal
export const updateTarget = mutation({
    args: {
        goalId: v.id("goals"),
        targetId: v.string(),
        currentValue: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const goal = await ctx.db.get(args.goalId);
        if (!goal) throw new Error("Goal not found");

        const updatedTargets = goal.targets.map((target) => {
            if (target.id !== args.targetId) return target;

            return {
                ...target,
                currentValue:
                    args.currentValue !== undefined
                        ? args.currentValue
                        : target.currentValue,
                notes: args.notes !== undefined ? args.notes : target.notes,
            };
        });

        await ctx.db.patch(args.goalId, {
            targets: updatedTargets,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Update goal status
export const updateStatus = mutation({
    args: {
        id: v.id("goals"),
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed"),
            v.literal("not-started")
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Get goal progress summary
export const getProgressSummary = query({
    args: {},
    handler: async (ctx) => {
        const goals = await ctx.db.query("goals").collect();

        const summary = {
            total: goals.length,
            byStatus: {
                "on-track": 0,
                "at-risk": 0,
                behind: 0,
                completed: 0,
                "not-started": 0,
            },
            byType: {
                "north-star": 0,
                business: 0,
                "tangible-ideas": 0,
                "no-code-effect": 0,
                "personal-brand": 0,
                "product-ip": 0,
                "systems-ops": 0,
            },
            totalTargets: 0,
            targetsWithProgress: 0,
        };

        goals.forEach((goal) => {
            summary.byStatus[goal.status]++;
            summary.byType[goal.type]++;
            summary.totalTargets += goal.targets.length;
            summary.targetsWithProgress += goal.targets.filter(
                (t) => t.currentValue
            ).length;
        });

        return summary;
    },
});
