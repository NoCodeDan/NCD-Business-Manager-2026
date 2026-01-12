import { mutation } from "./_generated/server";

// ==========================================
// 2026 OPERATING RULES SEED DATA
// Based on NCD 2026.pdf - Operating Framework
// ==========================================

const OPERATING_RULES_2026 = [
    // ==========================================
    // WEEKLY EXECUTION RULES
    // ==========================================
    {
        type: "weekly-execution" as const,
        title: "Weekly Execution Rules",
        description: "Every week must include these three non-negotiable outputs. If a week doesn't move these, it failed.",
        rules: [
            {
                id: crypto.randomUUID(),
                rule: "Ship something",
                order: 1,
                isRequired: true,
                examples: ["Feature", "MVP", "Lesson", "Content piece"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Document something",
                order: 2,
                isRequired: true,
                examples: ["Lesson", "Breakdown", "Insight", "Process"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Distribute something",
                order: 3,
                isRequired: true,
                examples: ["Video", "Clip", "Post", "Tutorial"],
            }
        ],
        isActive: true,
        order: 1,
    },

    // ==========================================
    // PRIORITY STACK
    // ==========================================
    {
        type: "priority-stack" as const,
        title: "Priority Stack (In Order - No Reordering)",
        description: "This is the non-negotiable order of priorities. Everything must flow through this stack.",
        rules: [
            {
                id: crypto.randomUUID(),
                rule: "Shipping real products",
                order: 1,
                isRequired: false,
                examples: ["MVPs", "Internal products", "Features", "Launches"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Teaching what was just shipped",
                order: 2,
                isRequired: false,
                examples: ["Build breakdowns", "Case studies", "Lessons learned"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Content derived from real work",
                order: 3,
                isRequired: false,
                examples: ["Videos about builds", "Tutorials from experience", "Insights from shipping"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Client work (only if it funds the above)",
                order: 4,
                isRequired: false,
                examples: ["MVP builds for clients", "Consulting", "Services"],
            },
            {
                id: crypto.randomUUID(),
                rule: "New ideas (only after outputs are met)",
                order: 5,
                isRequired: false,
                examples: ["Experiments", "Prototypes", "Research"],
            }
        ],
        isActive: true,
        order: 2,
    },

    // ==========================================
    // PRODUCT DECISION FILTER
    // ==========================================
    {
        type: "decision-filter" as const,
        title: "Product Decision Filter",
        description: "Every new idea must answer YES to at least 2 of these 4 questions. If not, archive it.",
        rules: [
            {
                id: crypto.randomUUID(),
                rule: "Does this generate revenue?",
                order: 1,
                isRequired: false,
                examples: ["Will people pay for this?", "Does it create a revenue stream?", "Can it be monetized?"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Does this grow audience?",
                order: 2,
                isRequired: false,
                examples: ["Will this attract new followers?", "Does it expand reach?", "Is it shareable?"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Does this create reusable IP?",
                order: 3,
                isRequired: false,
                examples: ["Can this be used in courses?", "Is it a framework?", "Can it be licensed?"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Does this reduce future effort?",
                order: 4,
                isRequired: false,
                examples: ["Does it automate something?", "Creates a template?", "Saves time later?"],
            }
        ],
        isActive: true,
        order: 3,
    },

    // ==========================================
    // KILL CRITERIA
    // ==========================================
    {
        type: "kill-criteria" as const,
        title: "Kill Criteria",
        description: "Kill or pause anything that meets ANY of these criteria. Momentum > Optionality.",
        rules: [
            {
                id: crypto.randomUUID(),
                rule: "No traction after 60-90 days",
                order: 1,
                isRequired: false,
                examples: ["No users", "No interest", "No growth", "Flat metrics"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Requires constant explaining",
                order: 2,
                isRequired: false,
                examples: ["People don't get it", "Complicated positioning", "Unclear value prop"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Pulls you away from shipping",
                order: 3,
                isRequired: false,
                examples: ["Maintenance heavy", "Constant firefighting", "Takes focus from core work"],
            },
            {
                id: crypto.randomUUID(),
                rule: "Only exists because 'it might be cool'",
                order: 4,
                isRequired: false,
                examples: ["No clear purpose", "Vanity project", "Nice to have", "No real need"],
            }
        ],
        isActive: true,
        order: 4,
    },

    // ==========================================
    // MONTHLY REVIEW PROCESS
    // ==========================================
    {
        type: "review-process" as const,
        title: "Monthly Review (30 Minutes)",
        description: "Ask these 4 questions every month. Double down on 1-3, cut the rest.",
        rules: [
            {
                id: crypto.randomUUID(),
                rule: "What shipped?",
                order: 1,
                isRequired: false,
                examples: ["MVPs launched", "Features released", "Content published", "Products completed"],
            },
            {
                id: crypto.randomUUID(),
                rule: "What made money?",
                order: 2,
                isRequired: false,
                examples: ["Revenue sources", "Paying customers", "Sales generated", "Income streams"],
            },
            {
                id: crypto.randomUUID(),
                rule: "What grew trust/audience?",
                order: 3,
                isRequired: false,
                examples: ["Subscriber growth", "Engagement increase", "Positive feedback", "Community building"],
            },
            {
                id: crypto.randomUUID(),
                rule: "What felt heavy but didn't compound?",
                order: 4,
                isRequired: false,
                examples: ["Busy work", "Time sinks", "Low ROI activities", "Energy drains"],
            }
        ],
        isActive: true,
        order: 5,
    },
];

export const seed2026Rules = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if operating rules already exist
        const existingRules = await ctx.db.query("operatingRules").collect();

        if (existingRules.length > 0) {
            return {
                message: "Operating rules already seeded",
                count: existingRules.length,
            };
        }

        // Seed all 2026 operating rules
        const insertedIds = [];
        for (const ruleSet of OPERATING_RULES_2026) {
            const id = await ctx.db.insert("operatingRules", {
                ...ruleSet,
                createdAt: now,
                updatedAt: now,
            });
            insertedIds.push(id);
        }

        return {
            message: "Successfully seeded 2026 operating rules",
            count: insertedIds.length,
            frameworks: [
                "Weekly Execution Rules (3 must-dos)",
                "Priority Stack (5 levels)",
                "Product Decision Filter (2 of 4 required)",
                "Kill Criteria (stop/pause rules)",
                "Monthly Review Process (4 questions)"
            ],
            ids: insertedIds,
        };
    },
});
