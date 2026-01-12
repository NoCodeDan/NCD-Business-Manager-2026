import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Agent Logs Module
 * 
 * Tracks all agent actions for transparency and debugging.
 * Following the agent-native architecture principle of no silent actions.
 */

// Log an agent action
export const log = mutation({
    args: {
        action: v.string(),
        entityType: v.string(),
        entityId: v.optional(v.string()),
        summary: v.string(),
        agentId: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("agent_logs", {
            ...args,
            timestamp: new Date().toISOString(),
        });
    },
});

// Get all agent logs (most recent first)
export const get = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const logs = await ctx.db
            .query("agent_logs")
            .order("desc")
            .take(limit);
        return logs;
    },
});

// Get logs for a specific entity
export const getByEntity = query({
    args: {
        entityType: v.string(),
        entityId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let logs = await ctx.db
            .query("agent_logs")
            .withIndex("by_entity", (q) => q.eq("entityType", args.entityType))
            .collect();

        if (args.entityId) {
            logs = logs.filter(log => log.entityId === args.entityId);
        }

        return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    },
});

// Get recent logs (last N hours)
export const getRecent = query({
    args: {
        hours: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const hoursAgo = new Date();
        hoursAgo.setHours(hoursAgo.getHours() - (args.hours ?? 24));
        const cutoff = hoursAgo.toISOString();

        const allLogs = await ctx.db.query("agent_logs").collect();
        return allLogs
            .filter(log => log.timestamp >= cutoff)
            .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    },
});

// Clear old logs (older than N days)
export const clearOld = mutation({
    args: {
        days: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - (args.days ?? 30));
        const cutoff = daysAgo.toISOString();

        const oldLogs = await ctx.db.query("agent_logs").collect();
        const toDelete = oldLogs.filter(log => log.timestamp < cutoff);

        for (const log of toDelete) {
            await ctx.db.delete(log._id);
        }

        return { deleted: toDelete.length };
    },
});
