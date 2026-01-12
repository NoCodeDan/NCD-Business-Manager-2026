import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Agent Conversations Module
 * 
 * Handles conversation and message CRUD operations.
 * Separated from the action file because Convex requires
 * Node.js files to only contain actions.
 */

// Create a new conversation
export const createConversation = mutation({
    args: {
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("conversations", {
            title: args.title,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Get messages for a conversation
export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();
    },
});

// Save a message
export const saveMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
        content: v.string(),
        toolCalls: v.optional(v.array(v.object({
            id: v.string(),
            name: v.string(),
            arguments: v.string(),
            result: v.optional(v.string()),
        }))),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // Update conversation timestamp
        await ctx.db.patch(args.conversationId, { updatedAt: now });

        return await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            role: args.role,
            content: args.content,
            toolCalls: args.toolCalls,
            createdAt: now,
        });
    },
});

// Get all conversations
export const getConversations = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("conversations")
            .order("desc")
            .collect();
    },
});

// Delete a conversation
export const deleteConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        // Delete all messages first
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        // Delete conversation
        await ctx.db.delete(args.conversationId);
    },
});
