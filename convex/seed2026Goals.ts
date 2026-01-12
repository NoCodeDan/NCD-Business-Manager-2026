import { mutation } from "./_generated/server";

// ==========================================
// 2026 GOALS SEED DATA
// Based on NCD 2026.pdf
// ==========================================

const GOALS_2026 = [
    // ==========================================
    // NORTH STAR GOAL
    // ==========================================
    {
        type: "north-star" as const,
        title: "2026 North Star",
        description: "Build a sustainable, creator-led product studio and education ecosystem that generates predictable revenue, compounds audience trust, and gives you leverage over your time.",
        category: "Vision",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "Everything ladders up to this vision",
                target: "100%",
                unit: "%",
                measureType: "milestone" as const,
                priority: "critical" as const,
                notes: "All activities must support this north star"
            }
        ],
        status: "on-track" as const,
        color: "#6366f1", // Indigo
        order: 1,
    },

    // ==========================================
    // BUSINESS & REVENUE GOALS
    // ==========================================
    {
        type: "business" as const,
        title: "Business & Revenue Goals",
        description: "Generate $300K-$500K in total annual revenue with at least 60% from non-1:1 services. Create predictable revenue streams across Tangible Ideas, education, and partnerships.",
        category: "Revenue",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "Total Annual Revenue",
                target: "$300K-$500K",
                unit: "$",
                measureType: "range" as const,
                priority: "critical" as const,
                currentValue: "$0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Non-1:1 Services Revenue",
                target: "≥60%",
                unit: "%",
                measureType: "minimum" as const,
                priority: "critical" as const,
                currentValue: "0%",
                notes: "Products, courses, memberships vs. client work"
            },
            {
                id: crypto.randomUUID(),
                metric: "Tangible Ideas Revenue (Studio + Labs)",
                target: "50-60%",
                unit: "%",
                measureType: "range" as const,
                priority: "high" as const,
                notes: "MVP builds, productized offerings, experiments"
            },
            {
                id: crypto.randomUUID(),
                metric: "Education Revenue (No-Code Effect)",
                target: "25-35%",
                unit: "%",
                measureType: "range" as const,
                priority: "high" as const,
                notes: "Courses, membership, workshops, cohorts"
            },
            {
                id: crypto.randomUUID(),
                metric: "Content/Sponsorships/Partnerships",
                target: "10-15%",
                unit: "%",
                measureType: "range" as const,
                priority: "medium" as const,
                notes: "Tool partnerships, affiliate, sponsored content"
            },
            {
                id: crypto.randomUUID(),
                metric: "Single Client Revenue Cap",
                target: "<15%",
                unit: "%",
                measureType: "minimum" as const,
                priority: "high" as const,
                notes: "No single client should be >15% of income"
            },
            {
                id: crypto.randomUUID(),
                metric: "Agency Work Becomes Optional",
                target: "Achieved",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Client work is optional, not required to survive"
            }
        ],
        status: "on-track" as const,
        color: "#22c55e", // Green
        order: 2,
    },

    // ==========================================
    // TANGIBLE IDEAS GOALS (STUDIO + LABS)
    // ==========================================
    {
        type: "tangible-ideas" as const,
        title: "Tangible Ideas Goals",
        description: "Turn Tangible Ideas into a public-facing product lab that funds itself, ships fast, and documents everything. Ship 12-18 MVPs, launch 3-5 internal products, and achieve 1 breakout product.",
        category: "Product Studio",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "MVPs Shipped (Client + Internal)",
                target: "12-18",
                unit: "MVPs",
                measureType: "range" as const,
                priority: "critical" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Internal Products Launched",
                target: "3-5",
                unit: "products",
                measureType: "range" as const,
                priority: "critical" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Breakout Product",
                target: "1",
                unit: "product",
                measureType: "exact" as const,
                priority: "high" as const,
                currentValue: "0",
                notes: "One product that justifies doubling down in 2027"
            },
            {
                id: crypto.randomUUID(),
                metric: "Build Breakdowns Published",
                target: "12-24",
                unit: "posts",
                measureType: "range" as const,
                priority: "high" as const,
                currentValue: "0",
                notes: "1-2 in-depth breakdowns per month"
            },
            {
                id: crypto.randomUUID(),
                metric: "Public Build Challenges",
                target: "2+",
                unit: "challenges",
                measureType: "minimum" as const,
                priority: "medium" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "MVP Playbook Created",
                target: "Complete",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Repeatable framework for fast MVP development"
            },
            {
                id: crypto.randomUUID(),
                metric: "Positioning Achieved",
                target: "Known for fast, opinionated MVPs that actually launch",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Not theory. Not trends. Proof."
            }
        ],
        status: "on-track" as const,
        color: "#8b5cf6", // Purple
        order: 3,
    },

    // ==========================================
    // NO-CODE EFFECT GOALS (EDUCATION + COMMUNITY)
    // ==========================================
    {
        type: "no-code-effect" as const,
        title: "No-Code Effect Goals",
        description: "Make TNC a welcoming on-ramp for builders at any level without diluting quality. Grow audience, launch courses, and build a thriving community.",
        category: "Education & Community",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "Email Subscribers",
                target: "10,000+",
                unit: "subscribers",
                measureType: "minimum" as const,
                priority: "critical" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "YouTube Subscribers",
                target: "5,000+",
                unit: "subscribers",
                measureType: "minimum" as const,
                priority: "critical" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Paying Members/Students Annually",
                target: "500+",
                unit: "people",
                measureType: "minimum" as const,
                priority: "critical" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Flagship Foundational Course",
                target: "1 launched",
                unit: "course",
                measureType: "exact" as const,
                priority: "high" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Focused Mini-Courses",
                target: "2-3 launched",
                unit: "courses",
                measureType: "range" as const,
                priority: "high" as const,
                currentValue: "0",
            },
            {
                id: crypto.randomUUID(),
                metric: "Live Workshops",
                target: "Quarterly",
                unit: "cadence",
                measureType: "milestone" as const,
                priority: "medium" as const,
                notes: "Run at least 4 workshops throughout the year"
            },
            {
                id: crypto.randomUUID(),
                metric: "Clear Learning Path",
                target: "Beginner → Builder → Founder",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Structured path from zero to launch"
            },
            {
                id: crypto.randomUUID(),
                metric: "Community Vibe",
                target: "Beginner-safe, builder-respected, founder-adjacent",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Learn here → build with Tangible Ideas"
            }
        ],
        status: "on-track" as const,
        color: "#ec4899", // Pink
        order: 4,
    },

    // ==========================================
    // PERSONAL BRAND GOALS
    // ==========================================
    {
        type: "personal-brand" as const,
        title: "Personal Brand Goals",
        description: "Be known as a credible builder-teacher, not just a commentator. Ship real things, explain complex ideas simply, and be honest about tradeoffs. No hype. No cosplay.",
        category: "Brand & Content",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "High-Quality YouTube Videos",
                target: "2-3 per week",
                unit: "videos/week",
                measureType: "range" as const,
                priority: "critical" as const,
                currentValue: "0",
                notes: "100-150 videos annually"
            },
            {
                id: crypto.randomUUID(),
                metric: "Short-Form Clips",
                target: "Daily",
                unit: "clips/day",
                measureType: "exact" as const,
                priority: "high" as const,
                currentValue: "0",
                notes: "Repurposed from long-form content"
            },
            {
                id: crypto.randomUUID(),
                metric: "Long-Form Insights",
                target: "Weekly",
                unit: "posts/week",
                measureType: "exact" as const,
                priority: "medium" as const,
                currentValue: "0",
                notes: "Thread or blog post"
            },
            {
                id: crypto.randomUUID(),
                metric: "Positioning Achieved",
                target: "Credible builder-teacher who ships",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "critical" as const,
                notes: "Known for shipping real things, explaining simply, being honest"
            },
            {
                id: crypto.randomUUID(),
                metric: "Recognition For",
                target: "Shipping + Teaching + Transparency",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "No hype, no cosplay, just real work"
            }
        ],
        status: "on-track" as const,
        color: "#f97316", // Orange
        order: 5,
    },

    // ==========================================
    // PRODUCT & IP GOALS
    // ==========================================
    {
        type: "product-ip" as const,
        title: "Product & IP Goals",
        description: "Turn your experience into repeatable intellectual property that powers courses, membership, licensing, and partnerships.",
        category: "Assets & Leverage",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "Tangible Ideas MVP Framework",
                target: "Documented",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "critical" as const,
                notes: "Complete, documented framework for MVP development"
            },
            {
                id: crypto.randomUUID(),
                metric: "No-Code Effect Learning Map",
                target: "Created",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Clear progression: Beginner → Builder → Founder"
            },
            {
                id: crypto.randomUUID(),
                metric: "Public Build Archive",
                target: "Launched",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Case studies + failures documented"
            },
            {
                id: crypto.randomUUID(),
                metric: "Reusable Templates",
                target: "Created",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "medium" as const,
                notes: "Project templates, checklists, prompts"
            },
            {
                id: crypto.randomUUID(),
                metric: "Long-Term Leverage",
                target: "Assets power courses, membership, licensing, partnerships",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "IP compounds over time"
            }
        ],
        status: "on-track" as const,
        color: "#14b8a6", // Teal
        order: 6,
    },

    // ==========================================
    // SYSTEMS & OPERATIONS GOALS
    // ==========================================
    {
        type: "systems-ops" as const,
        title: "Systems & Operations Goals",
        description: "Reduce friction so momentum is automatic. Build systems that run weekly without burnout.",
        category: "Operations & Efficiency",
        targets: [
            {
                id: crypto.randomUUID(),
                metric: "Content System",
                target: "Runs weekly without burnout",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "critical" as const,
                notes: "Automated workflow for consistent output"
            },
            {
                id: crypto.randomUUID(),
                metric: "MVP Intake + Scope System",
                target: "Clear and documented",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Standard process for evaluating and scoping MVPs"
            },
            {
                id: crypto.randomUUID(),
                metric: "Kill Criteria Defined",
                target: "For products that don't work",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "Clear rules for when to stop/pivot"
            },
            {
                id: crypto.randomUUID(),
                metric: "Monthly Review Ritual",
                target: "Established",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "What to double down on / cut"
            },
            {
                id: crypto.randomUUID(),
                metric: "Context Switches",
                target: "Fewer",
                unit: "improvement",
                measureType: "milestone" as const,
                priority: "medium" as const,
            },
            {
                id: crypto.randomUUID(),
                metric: "Deep Work Days",
                target: "More",
                unit: "improvement",
                measureType: "milestone" as const,
                priority: "medium" as const,
            },
            {
                id: crypto.randomUUID(),
                metric: "Building Without Purpose",
                target: "Eliminated",
                unit: "milestone",
                measureType: "milestone" as const,
                priority: "high" as const,
                notes: "No building things 'just because'"
            }
        ],
        status: "on-track" as const,
        color: "#eab308", // Yellow
        order: 7,
    },
];

export const seed2026Goals = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if goals already exist
        const existingGoals = await ctx.db.query("goals").collect();

        if (existingGoals.length > 0) {
            return {
                message: "Goals already seeded",
                count: existingGoals.length,
            };
        }

        // Seed all 2026 goals
        const insertedIds = [];
        for (const goal of GOALS_2026) {
            const id = await ctx.db.insert("goals", {
                ...goal,
                createdAt: now,
                updatedAt: now,
            });
            insertedIds.push(id);
        }

        return {
            message: "Successfully seeded 2026 goals",
            count: insertedIds.length,
            goals: [
                "North Star",
                "Business & Revenue",
                "Tangible Ideas",
                "No-Code Effect",
                "Personal Brand",
                "Product & IP",
                "Systems & Operations"
            ],
            ids: insertedIds,
        };
    },
});
