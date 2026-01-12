import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Validators for nested objects
const contentAssetValidator = v.object({
    id: v.string(),
    title: v.string(),
    status: v.union(
        v.literal("planned"),
        v.literal("in-production"),
        v.literal("completed"),
        v.literal("published")
    ),
    publishDate: v.optional(v.string()),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
});

const contentScheduleValidator = v.object({
    frequency: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
});

const contentTargetsValidator = v.object({
    count: v.number(),
    cadence: v.string(),
});

// ==========================================
// QUERY OPERATIONS
// ==========================================

// Get all content plans
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contentPlans").order("asc").collect();
    },
});

// Get a single content plan by ID
export const getById = query({
    args: { id: v.id("contentPlans") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get plans by business area
export const getByBusiness = query({
    args: {
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("personal-brand")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contentPlans")
            .withIndex("by_business", (q) => q.eq("business", args.business))
            .collect();
    },
});

// Get plans by type
export const getByType = query({
    args: {
        type: v.union(
            v.literal("long-form"),
            v.literal("short-form"),
            v.literal("series"),
            v.literal("campaign"),
            v.literal("archetype")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contentPlans")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
    },
});

// Get plans by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("planned"),
            v.literal("in-progress"),
            v.literal("active"),
            v.literal("completed"),
            v.literal("paused")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contentPlans")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get active content plans
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("contentPlans")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
    },
});

// Search content plans
export const search = query({
    args: {
        query: v.optional(v.string()),
        business: v.optional(
            v.union(
                v.literal("tangible-ideas"),
                v.literal("no-code-effect"),
                v.literal("adalo"),
                v.literal("personal-brand")
            )
        ),
        type: v.optional(
            v.union(
                v.literal("long-form"),
                v.literal("short-form"),
                v.literal("series"),
                v.literal("campaign"),
                v.literal("archetype")
            )
        ),
        status: v.optional(
            v.union(
                v.literal("planned"),
                v.literal("in-progress"),
                v.literal("active"),
                v.literal("completed"),
                v.literal("paused")
            )
        ),
    },
    handler: async (ctx, args) => {
        let plans = await ctx.db.query("contentPlans").collect();

        // Filter by business
        if (args.business) {
            plans = plans.filter((p) => p.business === args.business);
        }

        // Filter by type
        if (args.type) {
            plans = plans.filter((p) => p.type === args.type);
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
                    plan.name.toLowerCase().includes(searchLower) ||
                    plan.description.toLowerCase().includes(searchLower) ||
                    plan.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
                    plan.assets.some((a) =>
                        a.title.toLowerCase().includes(searchLower)
                    )
            );
        }

        return plans;
    },
});

// ==========================================
// MUTATION OPERATIONS
// ==========================================

// Create a new content plan
export const create = mutation({
    args: {
        name: v.string(),
        type: v.union(
            v.literal("long-form"),
            v.literal("short-form"),
            v.literal("series"),
            v.literal("campaign"),
            v.literal("archetype")
        ),
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("personal-brand")
        ),
        description: v.string(),
        status: v.union(
            v.literal("planned"),
            v.literal("in-progress"),
            v.literal("active"),
            v.literal("completed"),
            v.literal("paused")
        ),
        schedule: v.optional(contentScheduleValidator),
        targets: v.optional(contentTargetsValidator),
        assets: v.array(contentAssetValidator),
        tags: v.array(v.string()),
        color: v.string(),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("contentPlans", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing content plan
export const update = mutation({
    args: {
        id: v.id("contentPlans"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("planned"),
                v.literal("in-progress"),
                v.literal("active"),
                v.literal("completed"),
                v.literal("paused")
            )
        ),
        schedule: v.optional(contentScheduleValidator),
        targets: v.optional(contentTargetsValidator),
        assets: v.optional(v.array(contentAssetValidator)),
        tags: v.optional(v.array(v.string())),
        color: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a content plan
export const remove = mutation({
    args: { id: v.id("contentPlans") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Add an asset to a content plan
export const addAsset = mutation({
    args: {
        planId: v.id("contentPlans"),
        title: v.string(),
        status: v.union(
            v.literal("planned"),
            v.literal("in-production"),
            v.literal("completed"),
            v.literal("published")
        ),
        publishDate: v.optional(v.string()),
        url: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Content plan not found");

        const newAsset = {
            id: crypto.randomUUID(),
            title: args.title,
            status: args.status,
            publishDate: args.publishDate,
            url: args.url,
            notes: args.notes,
        };

        await ctx.db.patch(args.planId, {
            assets: [...plan.assets, newAsset],
            updatedAt: new Date().toISOString(),
        });

        return newAsset.id;
    },
});

// Update an asset
export const updateAsset = mutation({
    args: {
        planId: v.id("contentPlans"),
        assetId: v.string(),
        title: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("planned"),
                v.literal("in-production"),
                v.literal("completed"),
                v.literal("published")
            )
        ),
        publishDate: v.optional(v.string()),
        url: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Content plan not found");

        const updatedAssets = plan.assets.map((asset) => {
            if (asset.id !== args.assetId) return asset;

            return {
                ...asset,
                title: args.title ?? asset.title,
                status: args.status ?? asset.status,
                publishDate: args.publishDate ?? asset.publishDate,
                url: args.url ?? asset.url,
                notes: args.notes ?? asset.notes,
            };
        });

        await ctx.db.patch(args.planId, {
            assets: updatedAssets,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete an asset
export const removeAsset = mutation({
    args: {
        planId: v.id("contentPlans"),
        assetId: v.string(),
    },
    handler: async (ctx, args) => {
        const plan = await ctx.db.get(args.planId);
        if (!plan) throw new Error("Content plan not found");

        const updatedAssets = plan.assets.filter((a) => a.id !== args.assetId);

        await ctx.db.patch(args.planId, {
            assets: updatedAssets,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Get content summary by business
export const getContentSummary = query({
    args: {},
    handler: async (ctx) => {
        const plans = await ctx.db.query("contentPlans").collect();

        const summary = {
            totalPlans: plans.length,
            byBusiness: {
                "tangible-ideas": 0,
                "no-code-effect": 0,
                adalo: 0,
                "personal-brand": 0,
            },
            byType: {
                "long-form": 0,
                "short-form": 0,
                series: 0,
                campaign: 0,
                archetype: 0,
            },
            byStatus: {
                planned: 0,
                "in-progress": 0,
                active: 0,
                completed: 0,
                paused: 0,
            },
            totalAssets: 0,
            publishedAssets: 0,
            inProductionAssets: 0,
        };

        plans.forEach((plan) => {
            summary.byBusiness[plan.business]++;
            summary.byType[plan.type]++;
            summary.byStatus[plan.status]++;
            summary.totalAssets += plan.assets.length;
            summary.publishedAssets += plan.assets.filter(
                (a) => a.status === "published"
            ).length;
            summary.inProductionAssets += plan.assets.filter(
                (a) => a.status === "in-production"
            ).length;
        });

        return summary;
    },
});
