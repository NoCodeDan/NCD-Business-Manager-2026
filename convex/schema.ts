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

    // ==========================================
    // REVENUE TRACKING TABLES
    // ==========================================

    // Deals - Track potential and closed revenue
    deals: defineTable({
        name: v.string(),
        client: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("lead"),
            v.literal("proposal"),
            v.literal("negotiation"),
            v.literal("won"),
            v.literal("lost")
        ),
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
        probability: v.optional(v.number()), // 0-100
        expectedCloseDate: v.optional(v.string()),
        closedDate: v.optional(v.string()),
        notes: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_status", ["status"])
        .index("by_business_area", ["businessArea"]),

    // Invoices - Track actual received payments
    invoices: defineTable({
        invoiceNumber: v.string(),
        client: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
        issueDate: v.string(),
        dueDate: v.string(),
        paidDate: v.optional(v.string()),
        description: v.optional(v.string()),
        dealId: v.optional(v.id("deals")), // Link to deal if applicable
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_status", ["status"])
        .index("by_business_area", ["businessArea"])
        .index("by_deal", ["dealId"]),

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
        // 2026 Framework Integration (optional)
        year: v.optional(v.number()),                    // e.g., 2026
        goalId: v.optional(v.id("goals")),              // Link to parent goal
        businessArea: v.optional(v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("personal-brand"),
            v.literal("general")
        )),
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

    // ==========================================
    // 2026 STRATEGIC PLANNING TABLES
    // ==========================================

    // Goals - Overarching goal framework for 2026
    goals: defineTable({
        type: v.union(
            v.literal("north-star"),      // The ultimate 2026 vision
            v.literal("business"),         // Business & Revenue goals
            v.literal("tangible-ideas"),   // Studio + Labs goals
            v.literal("no-code-effect"),   // Education + Community goals
            v.literal("personal-brand"),   // Personal branding goals
            v.literal("product-ip"),       // Product & IP assets
            v.literal("systems-ops")       // Operations & Systems
        ),
        title: v.string(),
        description: v.string(),
        category: v.string(),             // For grouping related goals
        targets: v.array(v.object({
            id: v.string(),
            metric: v.string(),           // e.g., "Annual Revenue"
            target: v.string(),           // e.g., "$300K-$500K"
            unit: v.string(),             // e.g., "$", "subscribers", "%"
            measureType: v.union(
                v.literal("range"),       // e.g., $300K-$500K
                v.literal("minimum"),     // e.g., ≥60%
                v.literal("exact"),       // e.g., 12 MVPs
                v.literal("milestone")    // e.g., "Launch flagship course"
            ),
            priority: v.union(
                v.literal("critical"),
                v.literal("high"),
                v.literal("medium"),
                v.literal("low")
            ),
            currentValue: v.optional(v.string()),  // Track actual progress
            notes: v.optional(v.string()),
        })),
        status: v.union(
            v.literal("on-track"),
            v.literal("at-risk"),
            v.literal("behind"),
            v.literal("completed"),
            v.literal("not-started")
        ),
        color: v.string(),
        order: v.number(),                // For display ordering
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_type", ["type"])
        .index("by_status", ["status"])
        .index("by_order", ["order"]),

    // Quarterly Plans - Q1-Q4 execution plans with specific actions
    quarterlyPlans: defineTable({
        year: v.number(),                 // 2026
        quarter: v.union(
            v.literal("Q1"),
            v.literal("Q2"),
            v.literal("Q3"),
            v.literal("Q4")
        ),
        theme: v.string(),                // e.g., "Foundation & Positioning"
        primaryObjective: v.string(),     // Main goal for the quarter
        focusAreas: v.array(v.string()),
        keyActions: v.array(v.object({
            id: v.string(),
            action: v.string(),
            category: v.string(),         // e.g., "Launch", "Publish", "Formalize"
            completed: v.boolean(),
            completedDate: v.optional(v.string()),
            notes: v.optional(v.string()),
        })),
        shippingTargets: v.object({
            mvps: v.object({
                target: v.number(),
                actual: v.optional(v.number()),
            }),
            internalProducts: v.object({
                target: v.number(),
                actual: v.optional(v.number()),
            }),
            buildBreakdowns: v.object({
                target: v.number(),
                actual: v.optional(v.number()),
            }),
        }),
        revenueTargets: v.object({
            min: v.number(),
            max: v.number(),
            actual: v.optional(v.number()),
        }),
        audienceTargets: v.array(v.object({
            id: v.string(),
            metric: v.string(),           // e.g., "Email Subscribers"
            target: v.number(),
            actual: v.optional(v.number()),
        })),
        contentTargets: v.array(v.object({
            id: v.string(),
            type: v.string(),             // e.g., "YouTube Videos", "Blog Posts"
            target: v.number(),
            actual: v.optional(v.number()),
        })),
        status: v.union(
            v.literal("upcoming"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("reviewed")
        ),
        startDate: v.string(),
        endDate: v.string(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_year_quarter", ["year", "quarter"])
        .index("by_status", ["status"]),

    // Content Plans - Content strategy, pillars, and campaigns
    contentPlans: defineTable({
        name: v.string(),
        type: v.union(
            v.literal("long-form"),       // YouTube tutorials
            v.literal("short-form"),      // Shorts/clips
            v.literal("series"),          // Ongoing series
            v.literal("campaign"),        // Specific campaigns
            v.literal("archetype")        // Content archetype/pillar
        ),
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("personal-brand")
        ),
        description: v.string(),
        status: v.union(
            v.literal("planned"),
            v.literal("in-progress"),
            v.literal("active"),
            v.literal("completed"),
            v.literal("paused")
        ),
        schedule: v.optional(v.object({
            frequency: v.string(),        // e.g., "bi-weekly", "daily"
            startDate: v.optional(v.string()),
            endDate: v.optional(v.string()),
        })),
        targets: v.optional(v.object({
            count: v.number(),            // e.g., 12 tutorials
            cadence: v.string(),          // e.g., "every two weeks"
        })),
        assets: v.array(v.object({
            id: v.string(),
            title: v.string(),
            status: v.union(
                v.literal("planned"),
                v.literal("in-production"),
                v.literal("completed"),
                v.literal("published")
            ),
            publishDate: v.optional(v.string()),
            url: v.optional(v.string()),
            notes: v.optional(v.string()),
        })),
        tags: v.array(v.string()),
        color: v.string(),
        order: v.number(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_business", ["business"])
        .index("by_type", ["type"])
        .index("by_status", ["status"]),

    // Operating Rules - Execution framework and decision filters
    operatingRules: defineTable({
        type: v.union(
            v.literal("weekly-execution"),    // Weekly must-dos
            v.literal("priority-stack"),      // Ordered priorities
            v.literal("decision-filter"),     // Product decision criteria
            v.literal("kill-criteria"),       // When to stop/pause
            v.literal("review-process")       // Monthly review questions
        ),
        title: v.string(),
        description: v.string(),
        rules: v.array(v.object({
            id: v.string(),
            rule: v.string(),
            order: v.number(),
            isRequired: v.boolean(),          // For filters: must pass X of Y
            examples: v.optional(v.array(v.string())),
        })),
        isActive: v.boolean(),
        order: v.number(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_type", ["type"])
        .index("by_active", ["isActive"]),

    // Target ICP - Ideal customer profile information
    targetICP: defineTable({
        business: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan")
        ),
        name: v.string(),
        description: v.string(),
        characteristics: v.array(v.string()),
        painPoints: v.array(v.string()),
        messaging: v.array(v.object({
            id: v.string(),
            message: v.string(),
            channel: v.string(),
        })),
        order: v.number(),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_business", ["business"])
        .index("by_active", ["isActive"]),

    // CRM Tables
    contacts: defineTable({
        name: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        avatar: v.optional(v.string()),
        company: v.object({
            name: v.string(),
            role: v.string(),
            website: v.optional(v.string()),
            industry: v.optional(v.string()),
        }),
        socialProfiles: v.array(v.object({
            platform: v.string(),
            url: v.string(),
            username: v.string(),
        })),
        recentActivity: v.array(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("enriched"),
            v.literal("failed")
        ),
        followUpDate: v.optional(v.string()),
        followUpNote: v.optional(v.string()),
        // Link to brand partner if this contact is from a partnership
        brandPartnerId: v.optional(v.id("brandPartners")),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_email", ["email"])
        .index("by_status", ["status"])
        .index("by_brand_partner", ["brandPartnerId"]),

    brandPartners: defineTable({
        name: v.string(),
        website: v.string(),
        logo: v.optional(v.string()),
        partnerType: v.union(
            v.literal("strategic"),
            v.literal("affiliate"),
            v.literal("referral"),
            v.literal("integration")
        ),
        status: v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("pending")
        ),
        notes: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_status", ["status"])
        .index("by_partner_type", ["partnerType"]),

    clients: defineTable({
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
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_status", ["status"])
        .index("by_email", ["email"]),

    // ==========================================
    // PRODUCTIVITY TABLES
    // ==========================================

    // Todos - Task management
    todos: defineTable({
        title: v.string(),
        completed: v.boolean(),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        dueDate: v.optional(v.string()),
        parentId: v.optional(v.id("todos")), // For subtasks
        position: v.number(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_parent", ["parentId"])
        .index("by_completed", ["completed"])
        .index("by_due_date", ["dueDate"]),

    // Calendar Events
    calendarEvents: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        allDay: v.boolean(),
        location: v.optional(v.string()),
        color: v.optional(v.string()),
        source: v.union(v.literal("manual"), v.literal("google"), v.literal("imported")),
        externalId: v.optional(v.string()), // For synced events
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_start_date", ["startDate"])
        .index("by_source", ["source"]),

    // Content Ideas
    contentIdeas: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        type: v.union(
            v.literal("blog"),
            v.literal("youtube"),
            v.literal("short-form"),
            v.literal("twitter"),
            v.literal("linkedin"),
            v.literal("newsletter"),
            v.literal("other")
        ),
        status: v.union(
            v.literal("brainstorm"),
            v.literal("researching"),
            v.literal("outlined"),
            v.literal("drafted"),
            v.literal("published"),
            v.literal("archived")
        ),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
        tags: v.array(v.string()),
        notes: v.optional(v.string()),
        targetDate: v.optional(v.string()),
        publishedUrl: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_status", ["status"])
        .index("by_type", ["type"]),
});
