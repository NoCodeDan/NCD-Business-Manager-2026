import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all clients
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("clients").collect();
    },
});

// Get client by ID
export const getById = query({
    args: { id: v.id("clients") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get clients by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("prospect"),
            v.literal("churned")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("clients")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get active clients
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("clients")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
    },
});

// Search clients
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const clients = await ctx.db.query("clients").collect();
        const q = args.query.toLowerCase();
        return clients.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.company.toLowerCase().includes(q)
        );
    },
});

// Create client
export const create = mutation({
    args: {
        name: v.string(),
        company: v.string(),
        email: v.string(),
        projectType: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("prospect"),
            v.literal("churned")
        ),
        value: v.optional(v.number()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("clients", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update client
export const update = mutation({
    args: {
        id: v.id("clients"),
        name: v.optional(v.string()),
        company: v.optional(v.string()),
        email: v.optional(v.string()),
        projectType: v.optional(v.string()),
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("prospect"),
            v.literal("churned")
        )),
        value: v.optional(v.number()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Client not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete client
export const remove = mutation({
    args: { id: v.id("clients") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});

// Get total client value
export const getTotalValue = query({
    args: {},
    handler: async (ctx) => {
        const clients = await ctx.db.query("clients").collect();
        return clients.reduce((sum, c) => sum + (c.value || 0), 0);
    },
});
