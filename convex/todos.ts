import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all todos
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("todos").collect();
    },
});

// Get todos by completion status
export const getByCompleted = query({
    args: { completed: v.boolean() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("todos")
            .withIndex("by_completed", (q) => q.eq("completed", args.completed))
            .collect();
    },
});

// Get subtasks for a parent
export const getSubtasks = query({
    args: { parentId: v.id("todos") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("todos")
            .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
            .collect();
    },
});

// Get top-level todos (no parent)
export const getTopLevel = query({
    args: {},
    handler: async (ctx) => {
        const todos = await ctx.db.query("todos").collect();
        return todos
            .filter(t => t.parentId === undefined)
            .sort((a, b) => a.position - b.position);
    },
});

// Search todos
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const todos = await ctx.db.query("todos").collect();
        const q = args.query.toLowerCase();
        return todos.filter(t => t.title.toLowerCase().includes(q));
    },
});

// Create a todo
export const create = mutation({
    args: {
        title: v.string(),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        dueDate: v.optional(v.string()),
        parentId: v.optional(v.id("todos")),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // Get max position for this level
        const todos = await ctx.db.query("todos").collect();
        const sameLevel = todos.filter(t =>
            args.parentId ? t.parentId === args.parentId : t.parentId === undefined
        );
        const maxPosition = sameLevel.reduce((max, t) => Math.max(max, t.position), -1);

        return await ctx.db.insert("todos", {
            title: args.title,
            completed: false,
            priority: args.priority || "medium",
            dueDate: args.dueDate,
            parentId: args.parentId,
            position: maxPosition + 1,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Toggle todo completion
export const toggle = mutation({
    args: { id: v.id("todos") },
    handler: async (ctx, args) => {
        const todo = await ctx.db.get(args.id);
        if (!todo) throw new Error("Todo not found");

        const newCompleted = !todo.completed;

        // Also toggle subtasks
        const subtasks = await ctx.db
            .query("todos")
            .withIndex("by_parent", (q) => q.eq("parentId", args.id))
            .collect();

        for (const subtask of subtasks) {
            await ctx.db.patch(subtask._id, {
                completed: newCompleted,
                updatedAt: new Date().toISOString(),
            });
        }

        return await ctx.db.patch(args.id, {
            completed: newCompleted,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Update a todo
export const update = mutation({
    args: {
        id: v.id("todos"),
        title: v.optional(v.string()),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        dueDate: v.optional(v.string()),
        position: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Todo not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete a todo (and its subtasks)
export const remove = mutation({
    args: { id: v.id("todos") },
    handler: async (ctx, args) => {
        // Delete subtasks first
        const subtasks = await ctx.db
            .query("todos")
            .withIndex("by_parent", (q) => q.eq("parentId", args.id))
            .collect();

        for (const subtask of subtasks) {
            await ctx.db.delete(subtask._id);
        }

        return await ctx.db.delete(args.id);
    },
});

// Clear all completed todos
export const clearCompleted = mutation({
    args: {},
    handler: async (ctx) => {
        const completed = await ctx.db
            .query("todos")
            .withIndex("by_completed", (q) => q.eq("completed", true))
            .collect();

        for (const todo of completed) {
            await ctx.db.delete(todo._id);
        }

        return { deleted: completed.length };
    },
});
