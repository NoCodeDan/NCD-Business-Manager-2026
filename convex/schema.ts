import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    sops: defineTable({
        title: v.string(),
        content: v.string(),
        category: v.string(),
        tags: v.array(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }),

    projects: defineTable({
        name: v.string(),
        description: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("paused"),
            v.literal("completed"),
            v.literal("archived")
        ),
        tasks: v.array(
            v.object({
                id: v.string(),
                title: v.string(),
                completed: v.boolean(),
            })
        ),
        color: v.string(),
        deadline: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }),

    expenses: defineTable({
        name: v.string(),
        amount: v.number(),
        billingCycle: v.union(v.literal("monthly"), v.literal("annual")),
        category: v.string(),
        renewalDate: v.string(),
        notes: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }),

    initiatives: defineTable({
        name: v.string(),
        description: v.string(),
        category: v.string(),
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed")
        ),
        color: v.string(),
        kpis: v.array(
            v.object({
                id: v.string(),
                name: v.string(),
                unit: v.string(),
                quarters: v.object({
                    q1: v.object({
                        target: v.number(),
                        actual: v.union(v.number(), v.null()),
                    }),
                    q2: v.object({
                        target: v.number(),
                        actual: v.union(v.number(), v.null()),
                    }),
                    q3: v.object({
                        target: v.number(),
                        actual: v.union(v.number(), v.null()),
                    }),
                    q4: v.object({
                        target: v.number(),
                        actual: v.union(v.number(), v.null()),
                    }),
                }),
            })
        ),
        createdAt: v.string(),
        updatedAt: v.string(),
    }),

    // Agent action logs for transparency
    agent_logs: defineTable({
        action: v.string(),           // e.g., "create", "update", "delete", "search"
        entityType: v.string(),       // e.g., "sop", "project", "expense", "initiative"
        entityId: v.optional(v.string()),
        summary: v.string(),          // Human-readable description of the action
        agentId: v.optional(v.string()),  // Optional identifier for the agent
        metadata: v.optional(v.any()), // Additional context
        timestamp: v.string(),
    }).index("by_timestamp", ["timestamp"])
        .index("by_entity", ["entityType", "entityId"]),

    // Agent conversations (enhanced for Phase 1)
    conversations: defineTable({
        title: v.optional(v.string()),
        summary: v.optional(v.string()),          // AI-generated summary
        isPinned: v.optional(v.boolean()),        // Quick access
        isArchived: v.optional(v.boolean()),      // Hidden from main view
        isStarred: v.optional(v.boolean()),       // Favorites
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("resolved"),
            v.literal("pending")
        )),
        tags: v.optional(v.array(v.string())),    // Categorization
        lastMessageAt: v.optional(v.string()),    // For sorting by activity
        messageCount: v.optional(v.number()),     // Quick stats
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_pinned", ["isPinned", "updatedAt"])
        .index("by_archived", ["isArchived", "updatedAt"])
        .index("by_status", ["status", "updatedAt"])
        .index("by_last_message", ["lastMessageAt"]),

    // Agent chat messages (enhanced for Phase 1)
    messages: defineTable({
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
        isEdited: v.optional(v.boolean()),
        editedAt: v.optional(v.string()),
        isDeleted: v.optional(v.boolean()),       // Soft delete
        toolCalls: v.optional(v.array(v.object({
            id: v.string(),
            name: v.string(),
            arguments: v.string(),
            result: v.optional(v.string()),
            status: v.optional(v.union(
                v.literal("pending"),
                v.literal("success"),
                v.literal("error")
            )),
        }))),
        attachments: v.optional(v.array(v.object({
            id: v.string(),
            type: v.union(v.literal("image"), v.literal("file"), v.literal("link")),
            url: v.string(),
            name: v.optional(v.string()),
            mimeType: v.optional(v.string()),
            size: v.optional(v.number()),
        }))),
        // Phase 2: Threading support (added now for schema stability)
        parentMessageId: v.optional(v.id("messages")),
        threadId: v.optional(v.id("messages")),
        replyCount: v.optional(v.number()),
        createdAt: v.string(),
    }).index("by_conversation", ["conversationId"])
        .index("by_conversation_created", ["conversationId", "createdAt"])
        .index("by_parent", ["parentMessageId"])
        .index("by_thread", ["threadId"]),
});
