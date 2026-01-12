import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all projects
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("projects").collect();
    },
});

// Get a single project by ID
export const getById = query({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new project
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("paused"),
            v.literal("completed"),
            v.literal("archived")
        ),
        color: v.string(),
        deadline: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("projects", {
            ...args,
            tasks: [],
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing project
export const update = mutation({
    args: {
        id: v.id("projects"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("paused"),
                v.literal("completed"),
                v.literal("archived")
            )
        ),
        color: v.optional(v.string()),
        deadline: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = new Date().toISOString();
        await ctx.db.patch(id, { ...updates, updatedAt: now });
    },
});

// Delete a project
export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Add a task to a project
export const addTask = mutation({
    args: {
        projectId: v.id("projects"),
        taskTitle: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        const newTask = {
            id: crypto.randomUUID(),
            title: args.taskTitle,
            completed: false,
        };

        await ctx.db.patch(args.projectId, {
            tasks: [...project.tasks, newTask],
            updatedAt: new Date().toISOString(),
        });

        return newTask;
    },
});

// Toggle a task's completed status
export const toggleTask = mutation({
    args: {
        projectId: v.id("projects"),
        taskId: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        const updatedTasks = project.tasks.map((task) =>
            task.id === args.taskId ? { ...task, completed: !task.completed } : task
        );

        await ctx.db.patch(args.projectId, {
            tasks: updatedTasks,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete a task from a project
export const deleteTask = mutation({
    args: {
        projectId: v.id("projects"),
        taskId: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        const updatedTasks = project.tasks.filter((task) => task.id !== args.taskId);

        await ctx.db.patch(args.projectId, {
            tasks: updatedTasks,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Search projects by name, description, or status
export const search = query({
    args: {
        query: v.optional(v.string()),
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("paused"),
            v.literal("completed"),
            v.literal("archived")
        )),
    },
    handler: async (ctx, args) => {
        let projects = await ctx.db.query("projects").collect();

        // Filter by status if provided
        if (args.status) {
            projects = projects.filter(p => p.status === args.status);
        }

        // Filter by search query if provided
        if (args.query) {
            const searchLower = args.query.toLowerCase();
            projects = projects.filter(project =>
                project.name.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower) ||
                project.tasks.some(task => task.title.toLowerCase().includes(searchLower))
            );
        }

        return projects;
    },
});
