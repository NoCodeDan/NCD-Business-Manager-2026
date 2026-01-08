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
});
