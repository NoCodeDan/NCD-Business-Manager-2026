import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all SOPs
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("sops").collect();
    },
});

// Get a single SOP by ID
export const getById = query({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new SOP
export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        category: v.string(),
        tags: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("sops", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing SOP
export const update = mutation({
    args: {
        id: v.id("sops"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a SOP
export const remove = mutation({
    args: { id: v.id("sops") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Search SOPs by title, content, category, or tags
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const allSOPs = await ctx.db.query("sops").collect();
        const searchLower = args.query.toLowerCase();

        return allSOPs.filter(sop =>
            sop.title.toLowerCase().includes(searchLower) ||
            sop.content.toLowerCase().includes(searchLower) ||
            sop.category.toLowerCase().includes(searchLower) ||
            sop.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    },
});
