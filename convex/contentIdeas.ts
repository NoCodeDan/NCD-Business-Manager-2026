import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all content ideas
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contentIdeas").collect();
    },
});

// Get ideas by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("brainstorm"),
            v.literal("researching"),
            v.literal("outlined"),
            v.literal("drafted"),
            v.literal("published"),
            v.literal("archived")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contentIdeas")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get ideas by type
export const getByType = query({
    args: {
        type: v.union(
            v.literal("blog"),
            v.literal("youtube"),
            v.literal("short-form"),
            v.literal("twitter"),
            v.literal("linkedin"),
            v.literal("newsletter"),
            v.literal("other")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contentIdeas")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
    },
});

// Get active ideas (not archived or published)
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        const ideas = await ctx.db.query("contentIdeas").collect();
        return ideas.filter(i => i.status !== "archived" && i.status !== "published");
    },
});

// Search content ideas
export const search = query({
    args: {
        query: v.optional(v.string()),
        type: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let ideas = await ctx.db.query("contentIdeas").collect();

        if (args.query) {
            const q = args.query.toLowerCase();
            ideas = ideas.filter(i =>
                i.title.toLowerCase().includes(q) ||
                (i.description && i.description.toLowerCase().includes(q)) ||
                i.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        if (args.type) {
            ideas = ideas.filter(i => i.type === args.type);
        }

        if (args.status) {
            ideas = ideas.filter(i => i.status === args.status);
        }

        return ideas;
    },
});

// Create a content idea
export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        type: v.optional(v.union(
            v.literal("blog"),
            v.literal("youtube"),
            v.literal("short-form"),
            v.literal("twitter"),
            v.literal("linkedin"),
            v.literal("newsletter"),
            v.literal("other")
        )),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        tags: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        targetDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        return await ctx.db.insert("contentIdeas", {
            title: args.title,
            description: args.description,
            type: args.type || "other",
            status: "brainstorm",
            priority: args.priority,
            tags: args.tags || [],
            notes: args.notes,
            targetDate: args.targetDate,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update a content idea
export const update = mutation({
    args: {
        id: v.id("contentIdeas"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        type: v.optional(v.union(
            v.literal("blog"),
            v.literal("youtube"),
            v.literal("short-form"),
            v.literal("twitter"),
            v.literal("linkedin"),
            v.literal("newsletter"),
            v.literal("other")
        )),
        status: v.optional(v.union(
            v.literal("brainstorm"),
            v.literal("researching"),
            v.literal("outlined"),
            v.literal("drafted"),
            v.literal("published"),
            v.literal("archived")
        )),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        tags: v.optional(v.array(v.string())),
        notes: v.optional(v.string()),
        targetDate: v.optional(v.string()),
        publishedUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Content idea not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete a content idea
export const remove = mutation({
    args: { id: v.id("contentIdeas") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});
