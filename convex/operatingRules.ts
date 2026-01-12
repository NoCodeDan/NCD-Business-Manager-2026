import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Validator for rule object
const ruleValidator = v.object({
    id: v.string(),
    rule: v.string(),
    order: v.number(),
    isRequired: v.boolean(),
    examples: v.optional(v.array(v.string())),
});

// ==========================================
// QUERY OPERATIONS
// ==========================================

// Get all operating rules
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("operatingRules").order("asc").collect();
    },
});

// Get a single operating rule set by ID
export const getById = query({
    args: { id: v.id("operatingRules") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get rules by type
export const getByType = query({
    args: {
        type: v.union(
            v.literal("weekly-execution"),
            v.literal("priority-stack"),
            v.literal("decision-filter"),
            v.literal("kill-criteria"),
            v.literal("review-process")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .first();
    },
});

// Get all active rules
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .collect();
    },
});

// Get weekly execution rules
export const getWeeklyRules = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", "weekly-execution"))
            .first();
    },
});

// Get priority stack
export const getPriorityStack = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", "priority-stack"))
            .first();
    },
});

// Get decision filter
export const getDecisionFilter = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", "decision-filter"))
            .first();
    },
});

// Get kill criteria
export const getKillCriteria = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", "kill-criteria"))
            .first();
    },
});

// Get review process
export const getReviewProcess = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("operatingRules")
            .withIndex("by_type", (q) => q.eq("type", "review-process"))
            .first();
    },
});

// Search operating rules
export const search = query({
    args: {
        query: v.optional(v.string()),
        type: v.optional(
            v.union(
                v.literal("weekly-execution"),
                v.literal("priority-stack"),
                v.literal("decision-filter"),
                v.literal("kill-criteria"),
                v.literal("review-process")
            )
        ),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let ruleSets = await ctx.db.query("operatingRules").collect();

        // Filter by type
        if (args.type) {
            ruleSets = ruleSets.filter((r) => r.type === args.type);
        }

        // Filter by active status
        if (args.isActive !== undefined) {
            ruleSets = ruleSets.filter((r) => r.isActive === args.isActive);
        }

        // Filter by search query
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            ruleSets = ruleSets.filter(
                (ruleSet) =>
                    ruleSet.title.toLowerCase().includes(searchLower) ||
                    ruleSet.description.toLowerCase().includes(searchLower) ||
                    ruleSet.rules.some(
                        (r) =>
                            r.rule.toLowerCase().includes(searchLower) ||
                            r.examples?.some((e) =>
                                e.toLowerCase().includes(searchLower)
                            )
                    )
            );
        }

        return ruleSets;
    },
});

// ==========================================
// MUTATION OPERATIONS
// ==========================================

// Create a new operating rule set
export const create = mutation({
    args: {
        type: v.union(
            v.literal("weekly-execution"),
            v.literal("priority-stack"),
            v.literal("decision-filter"),
            v.literal("kill-criteria"),
            v.literal("review-process")
        ),
        title: v.string(),
        description: v.string(),
        rules: v.array(ruleValidator),
        isActive: v.boolean(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("operatingRules", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing operating rule set
export const update = mutation({
    args: {
        id: v.id("operatingRules"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        rules: v.optional(v.array(ruleValidator)),
        isActive: v.optional(v.boolean()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete an operating rule set
export const remove = mutation({
    args: { id: v.id("operatingRules") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Toggle active status
export const toggleActive = mutation({
    args: { id: v.id("operatingRules") },
    handler: async (ctx, args) => {
        const ruleSet = await ctx.db.get(args.id);
        if (!ruleSet) throw new Error("Operating rules not found");

        await ctx.db.patch(args.id, {
            isActive: !ruleSet.isActive,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Add a rule to a rule set
export const addRule = mutation({
    args: {
        ruleSetId: v.id("operatingRules"),
        rule: v.string(),
        order: v.number(),
        isRequired: v.boolean(),
        examples: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const ruleSet = await ctx.db.get(args.ruleSetId);
        if (!ruleSet) throw new Error("Operating rules not found");

        const newRule = {
            id: crypto.randomUUID(),
            rule: args.rule,
            order: args.order,
            isRequired: args.isRequired,
            examples: args.examples,
        };

        await ctx.db.patch(args.ruleSetId, {
            rules: [...ruleSet.rules, newRule],
            updatedAt: new Date().toISOString(),
        });

        return newRule.id;
    },
});

// Update a specific rule
export const updateRule = mutation({
    args: {
        ruleSetId: v.id("operatingRules"),
        ruleId: v.string(),
        rule: v.optional(v.string()),
        order: v.optional(v.number()),
        isRequired: v.optional(v.boolean()),
        examples: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const ruleSet = await ctx.db.get(args.ruleSetId);
        if (!ruleSet) throw new Error("Operating rules not found");

        const updatedRules = ruleSet.rules.map((r) => {
            if (r.id !== args.ruleId) return r;

            return {
                ...r,
                rule: args.rule ?? r.rule,
                order: args.order ?? r.order,
                isRequired: args.isRequired ?? r.isRequired,
                examples: args.examples ?? r.examples,
            };
        });

        await ctx.db.patch(args.ruleSetId, {
            rules: updatedRules,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Remove a specific rule
export const removeRule = mutation({
    args: {
        ruleSetId: v.id("operatingRules"),
        ruleId: v.string(),
    },
    handler: async (ctx, args) => {
        const ruleSet = await ctx.db.get(args.ruleSetId);
        if (!ruleSet) throw new Error("Operating rules not found");

        const updatedRules = ruleSet.rules.filter((r) => r.id !== args.ruleId);

        await ctx.db.patch(args.ruleSetId, {
            rules: updatedRules,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Get operating framework summary
export const getFrameworkSummary = query({
    args: {},
    handler: async (ctx) => {
        const ruleSets = await ctx.db.query("operatingRules").collect();

        const summary = {
            totalRuleSets: ruleSets.length,
            activeRuleSets: ruleSets.filter((r) => r.isActive).length,
            totalRules: 0,
            byType: {
                "weekly-execution": 0,
                "priority-stack": 0,
                "decision-filter": 0,
                "kill-criteria": 0,
                "review-process": 0,
            },
        };

        ruleSets.forEach((ruleSet) => {
            summary.totalRules += ruleSet.rules.length;
            summary.byType[ruleSet.type] = ruleSet.rules.length;
        });

        return summary;
    },
});

// Get complete operating playbook (all active rules)
export const getCompletePlaybook = query({
    args: {},
    handler: async (ctx) => {
        const ruleSets = await ctx.db
            .query("operatingRules")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .collect();

        // Sort by order
        const sortedRuleSets = ruleSets.sort((a, b) => a.order - b.order);

        // Sort rules within each set
        return sortedRuleSets.map((ruleSet) => ({
            ...ruleSet,
            rules: ruleSet.rules.sort((a, b) => a.order - b.order),
        }));
    },
});
