import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all calendar events
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("calendarEvents").collect();
    },
});

// Get events by date range
export const getByDateRange = query({
    args: {
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const events = await ctx.db.query("calendarEvents").collect();
        return events.filter(e =>
            e.startDate >= args.startDate && e.startDate <= args.endDate
        ).sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
});

// Get upcoming events (next 7 days)
export const getUpcoming = query({
    args: {},
    handler: async (ctx) => {
        const now = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const events = await ctx.db.query("calendarEvents").collect();
        return events.filter(e => {
            const eventDate = new Date(e.startDate);
            return eventDate >= now && eventDate <= weekFromNow;
        }).sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
});

// Get today's events
export const getToday = query({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().split('T')[0];
        const events = await ctx.db.query("calendarEvents").collect();
        return events.filter(e => e.startDate.startsWith(today))
            .sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
});

// Get events by source
export const getBySource = query({
    args: {
        source: v.union(v.literal("manual"), v.literal("google"), v.literal("imported")),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("calendarEvents")
            .withIndex("by_source", (q) => q.eq("source", args.source))
            .collect();
    },
});

// Create an event
export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        allDay: v.optional(v.boolean()),
        location: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6', '#3b82f6'];

        return await ctx.db.insert("calendarEvents", {
            title: args.title,
            description: args.description,
            startDate: args.startDate,
            endDate: args.endDate,
            allDay: args.allDay ?? false,
            location: args.location,
            color: args.color || colors[Math.floor(Math.random() * colors.length)],
            source: "manual",
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an event
export const update = mutation({
    args: {
        id: v.id("calendarEvents"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        allDay: v.optional(v.boolean()),
        location: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Event not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete an event
export const remove = mutation({
    args: { id: v.id("calendarEvents") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});
