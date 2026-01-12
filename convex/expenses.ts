import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all expenses
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("expenses").collect();
    },
});

// Get a single expense by ID
export const getById = query({
    args: { id: v.id("expenses") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new expense
export const create = mutation({
    args: {
        name: v.string(),
        amount: v.number(),
        billingCycle: v.union(v.literal("monthly"), v.literal("annual")),
        category: v.string(),
        renewalDate: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("expenses", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing expense
export const update = mutation({
    args: {
        id: v.id("expenses"),
        name: v.optional(v.string()),
        amount: v.optional(v.number()),
        billingCycle: v.optional(v.union(v.literal("monthly"), v.literal("annual"))),
        category: v.optional(v.string()),
        renewalDate: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete an expense
export const remove = mutation({
    args: { id: v.id("expenses") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Search expenses by name, category, or billing cycle
export const search = query({
    args: {
        query: v.optional(v.string()),
        category: v.optional(v.string()),
        billingCycle: v.optional(v.union(v.literal("monthly"), v.literal("annual"))),
        minAmount: v.optional(v.number()),
        maxAmount: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let expenses = await ctx.db.query("expenses").collect();

        // Filter by category
        if (args.category) {
            expenses = expenses.filter(e => e.category === args.category);
        }

        // Filter by billing cycle
        if (args.billingCycle) {
            expenses = expenses.filter(e => e.billingCycle === args.billingCycle);
        }

        // Filter by amount range
        if (args.minAmount !== undefined) {
            expenses = expenses.filter(e => e.amount >= args.minAmount!);
        }
        if (args.maxAmount !== undefined) {
            expenses = expenses.filter(e => e.amount <= args.maxAmount!);
        }

        // Filter by search query
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            expenses = expenses.filter(expense =>
                expense.name.toLowerCase().includes(searchLower) ||
                expense.category.toLowerCase().includes(searchLower) ||
                (expense.notes && expense.notes.toLowerCase().includes(searchLower))
            );
        }

        return expenses;
    },
});
