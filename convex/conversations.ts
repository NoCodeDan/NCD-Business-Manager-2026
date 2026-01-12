import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Agent Conversations Module (Phase 1 Enhanced)
 * 
 * Handles conversation and message CRUD operations with:
 * - Search functionality
 * - Filtering (pinned, archived, starred)
 * - Conversation metadata updates
 * - Message count tracking
 */

// ==================== CONVERSATION QUERIES ====================

// Get all conversations (excludes archived by default)
export const getConversations = query({
    args: {
        includeArchived: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const conversations = await ctx.db
            .query("conversations")
            .order("desc")
            .collect();

        if (args.includeArchived) {
            return conversations;
        }
        return conversations.filter(c => !c.isArchived);
    },
});

// Get filtered conversations
export const getFilteredConversations = query({
    args: {
        filter: v.optional(v.union(
            v.literal("all"),
            v.literal("pinned"),
            v.literal("archived"),
            v.literal("starred"),
            v.literal("active"),
            v.literal("resolved"),
            v.literal("pending")
        )),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        let conversations = await ctx.db.query("conversations").order("desc").collect();

        switch (args.filter) {
            case "pinned":
                conversations = conversations.filter(c => c.isPinned && !c.isArchived);
                break;
            case "archived":
                conversations = conversations.filter(c => c.isArchived);
                break;
            case "starred":
                conversations = conversations.filter(c => c.isStarred && !c.isArchived);
                break;
            case "active":
            case "resolved":
            case "pending":
                conversations = conversations.filter(c => c.status === args.filter && !c.isArchived);
                break;
            default:
                conversations = conversations.filter(c => !c.isArchived);
        }

        return conversations.slice(0, limit);
    },
});

// Search conversations by title, summary, or content
export const searchConversations = query({
    args: {
        query: v.string(),
        includeArchived: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        if (!args.query.trim()) {
            return [];
        }

        const queryLower = args.query.toLowerCase();
        const allConversations = await ctx.db.query("conversations").collect();

        // First, filter conversations by title/summary
        const matchedConversations = allConversations.filter(conv => {
            if (!args.includeArchived && conv.isArchived) return false;
            const titleMatch = conv.title?.toLowerCase().includes(queryLower);
            const summaryMatch = conv.summary?.toLowerCase().includes(queryLower);
            const tagMatch = conv.tags?.some(tag => tag.toLowerCase().includes(queryLower));
            return titleMatch || summaryMatch || tagMatch;
        });

        // Also search message content for deeper matches
        const allMessages = await ctx.db.query("messages").collect();
        const conversationIdsWithMatches = new Set(
            allMessages
                .filter(m => m.content.toLowerCase().includes(queryLower) && !m.isDeleted)
                .map(m => m.conversationId.toString())
        );

        // Combine results
        const conversationSet = new Set([
            ...matchedConversations.map(c => c._id.toString()),
            ...conversationIdsWithMatches
        ]);

        return allConversations.filter(c => {
            if (!args.includeArchived && c.isArchived) return false;
            return conversationSet.has(c._id.toString());
        }).sort((a, b) => {
            // Prioritize pinned, then by updated date
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    },
});

// Get messages for a conversation
export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
        includeDeleted: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .collect();

        if (args.includeDeleted) {
            return messages;
        }
        return messages.filter(m => !m.isDeleted);
    },
});

// Get a single conversation
export const getConversation = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.conversationId);
    },
});

// ==================== CONVERSATION MUTATIONS ====================

// Create a new conversation
export const createConversation = mutation({
    args: {
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("conversations", {
            title: args.title,
            isPinned: false,
            isArchived: false,
            isStarred: false,
            status: "active",
            messageCount: 0,
            createdAt: now,
            updatedAt: now,
            lastMessageAt: now,
        });
    },
});

// Update conversation metadata
export const updateConversation = mutation({
    args: {
        conversationId: v.id("conversations"),
        title: v.optional(v.string()),
        summary: v.optional(v.string()),
        isPinned: v.optional(v.boolean()),
        isArchived: v.optional(v.boolean()),
        isStarred: v.optional(v.boolean()),
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("resolved"),
            v.literal("pending")
        )),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { conversationId, ...updates } = args;
        const cleanUpdates: Record<string, any> = { updatedAt: new Date().toISOString() };

        // Only include defined values
        if (updates.title !== undefined) cleanUpdates.title = updates.title;
        if (updates.summary !== undefined) cleanUpdates.summary = updates.summary;
        if (updates.isPinned !== undefined) cleanUpdates.isPinned = updates.isPinned;
        if (updates.isArchived !== undefined) cleanUpdates.isArchived = updates.isArchived;
        if (updates.isStarred !== undefined) cleanUpdates.isStarred = updates.isStarred;
        if (updates.status !== undefined) cleanUpdates.status = updates.status;
        if (updates.tags !== undefined) cleanUpdates.tags = updates.tags;

        await ctx.db.patch(conversationId, cleanUpdates);
    },
});

// Delete a conversation (and all its messages)
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

// Bulk archive old conversations
export const archiveOldConversations = mutation({
    args: {
        olderThanDays: v.number(),
    },
    handler: async (ctx, args) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - args.olderThanDays);
        const cutoffString = cutoffDate.toISOString();

        const conversations = await ctx.db.query("conversations").collect();
        const oldConversations = conversations.filter(
            c => c.updatedAt < cutoffString && !c.isArchived && !c.isPinned
        );

        for (const conv of oldConversations) {
            await ctx.db.patch(conv._id, { isArchived: true });
        }

        return { archived: oldConversations.length };
    },
});

// ==================== MESSAGE MUTATIONS ====================

// Save a message
export const saveMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
        content: v.string(),
        contentType: v.optional(v.union(
            v.literal("text"),
            v.literal("markdown"),
            v.literal("code"),
            v.literal("image"),
            v.literal("file")
        )),
        toolCalls: v.optional(v.array(v.object({
            id: v.string(),
            name: v.string(),
            arguments: v.string(),
            result: v.optional(v.string()),
        }))),
        attachments: v.optional(v.array(v.object({
            id: v.string(),
            type: v.union(v.literal("image"), v.literal("file"), v.literal("link")),
            url: v.string(),
            name: v.optional(v.string()),
            mimeType: v.optional(v.string()),
            size: v.optional(v.number()),
        }))),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();

        // Get current conversation for message count
        const conversation = await ctx.db.get(args.conversationId);
        const currentCount = conversation?.messageCount ?? 0;

        // Update conversation timestamp and message count
        await ctx.db.patch(args.conversationId, {
            updatedAt: now,
            lastMessageAt: now,
            messageCount: currentCount + 1,
        });

        return await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            role: args.role,
            content: args.content,
            contentType: args.contentType ?? "text",
            toolCalls: args.toolCalls,
            attachments: args.attachments,
            isEdited: false,
            isDeleted: false,
            createdAt: now,
        });
    },
});

// Edit a message
export const editMessage = mutation({
    args: {
        messageId: v.id("messages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error("Message not found");
        if (message.role !== "user") throw new Error("Can only edit user messages");
        if (message.isDeleted) throw new Error("Cannot edit deleted message");

        await ctx.db.patch(args.messageId, {
            content: args.content,
            isEdited: true,
            editedAt: new Date().toISOString(),
        });
    },
});

// Soft delete a message
export const deleteMessage = mutation({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.messageId, {
            isDeleted: true,
        });
    },
});
