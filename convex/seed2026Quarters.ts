import { mutation } from "./_generated/server";

// ==========================================
// 2026 QUARTERLY PLANS SEED DATA
// Based on NCD 2026.pdf - Q1-Q4 Execution
// ==========================================

const QUARTERLY_PLANS_2026 = [
    // ==========================================
    // Q1 (JAN-MAR): FOUNDATION & POSITIONING
    // ==========================================
    {
        year: 2026,
        quarter: "Q1" as const,
        theme: "Foundation & Positioning",
        primaryObjective: "Set the machine up to run - create clarity, systems, and a predictable shipping rhythm",
        focusAreas: [
            "Finalize Tangible Ideas positioning (Studio + Labs unified)",
            "Define No-Code Effect learning paths",
            "Lock in weekly execution cadence",
            "Create MVP build framework",
            "Establish content production system"
        ],
        keyActions: [
            {
                id: crypto.randomUUID(),
                action: "Formalize MVP build framework (internal doc)",
                category: "Formalize",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Formalize Product decision filter + kill criteria",
                category: "Formalize",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Launch updated Tangible Ideas site/messaging",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Launch No-Code Effect core promise + onboarding",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish 6-10 public build breakdowns",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish foundational content explaining how you build",
                category: "Publish",
                completed: false,
            }
        ],
        shippingTargets: {
            mvps: { target: 4, actual: 0 },
            internalProducts: { target: 1, actual: 0 },
            buildBreakdowns: { target: 8, actual: 0 },
        },
        revenueTargets: {
            min: 60000,
            max: 100000,
            actual: 0,
        },
        audienceTargets: [
            { id: crypto.randomUUID(), metric: "Email Subscribers", target: 2000, actual: 0 },
            { id: crypto.randomUUID(), metric: "YouTube Subscribers", target: 1000, actual: 0 },
        ],
        contentTargets: [
            { id: crypto.randomUUID(), type: "Adalo Tutorials", target: 3, actual: 0 },
            { id: crypto.randomUUID(), type: "Personal YouTube Videos", target: 30, actual: 0 },
            { id: crypto.randomUUID(), type: "30-Day Blitz (January)", target: 30, actual: 0 },
        ],
        status: "in-progress" as const,
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-03-31T23:59:59.999Z",
    },

    // ==========================================
    // Q2 (APR-JUN): MOMENTUM & GROWTH
    // ==========================================
    {
        year: 2026,
        quarter: "Q2" as const,
        theme: "Momentum & Growth",
        primaryObjective: "Prove it works, then amplify - launch flagship course and first breakout product",
        focusAreas: [
            "Launch No-Code Effect flagship course",
            "Ship first breakout internal product",
            "Scale content production",
            "Grow audience significantly",
            "Optimize revenue mix"
        ],
        keyActions: [
            {
                id: crypto.randomUUID(),
                action: "Launch No-Code Effect flagship course",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Ship 1-2 internal products to market",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Run first cohort or live workshop",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish 6-8 build breakdowns",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Double content distribution channels",
                category: "Scale",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Establish partnership revenue stream",
                category: "Launch",
                completed: false,
            }
        ],
        shippingTargets: {
            mvps: { target: 4, actual: 0 },
            internalProducts: { target: 2, actual: 0 },
            buildBreakdowns: { target: 7, actual: 0 },
        },
        revenueTargets: {
            min: 75000,
            max: 125000,
            actual: 0,
        },
        audienceTargets: [
            { id: crypto.randomUUID(), metric: "Email Subscribers", target: 4000, actual: 0 },
            { id: crypto.randomUUID(), metric: "YouTube Subscribers", target: 2000, actual: 0 },
            { id: crypto.randomUUID(), metric: "Course Students", target: 100, actual: 0 },
        ],
        contentTargets: [
            { id: crypto.randomUUID(), type: "Adalo Tutorials", target: 3, actual: 0 },
            { id: crypto.randomUUID(), type: "Personal YouTube Videos", target: 33, actual: 0 },
            { id: crypto.randomUUID(), type: "Course Content", target: 20, actual: 0 },
        ],
        status: "upcoming" as const,
        startDate: "2026-04-01T00:00:00.000Z",
        endDate: "2026-06-30T23:59:59.999Z",
    },

    // ==========================================
    // Q3 (JUL-SEP): SCALE & OPTIMIZE
    // ==========================================
    {
        year: 2026,
        quarter: "Q3" as const,
        theme: "Scale & Optimize",
        primaryObjective: "Do more of what works - double down on winning products and systematize content",
        focusAreas: [
            "Double down on winning products",
            "Systematize content machine",
            "Build reusable IP assets",
            "Optimize operations for efficiency",
            "Scale revenue without scaling hours"
        ],
        keyActions: [
            {
                id: crypto.randomUUID(),
                action: "Document and publish MVP Framework",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Launch 1-2 more internal products",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Create No-Code Effect Learning Map",
                category: "Create",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Run public build challenge",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish 6-8 build breakdowns",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Launch 2-3 mini-courses",
                category: "Launch",
                completed: false,
            }
        ],
        shippingTargets: {
            mvps: { target: 4, actual: 0 },
            internalProducts: { target: 2, actual: 0 },
            buildBreakdowns: { target: 7, actual: 0 },
        },
        revenueTargets: {
            min: 80000,
            max: 150000,
            actual: 0,
        },
        audienceTargets: [
            { id: crypto.randomUUID(), metric: "Email Subscribers", target: 7000, actual: 0 },
            { id: crypto.randomUUID(), metric: "YouTube Subscribers", target: 3500, actual: 0 },
            { id: crypto.randomUUID(), metric: "Total Students", target: 300, actual: 0 },
        ],
        contentTargets: [
            { id: crypto.randomUUID(), type: "Adalo Tutorials", target: 3, actual: 0 },
            { id: crypto.randomUUID(), type: "Personal YouTube Videos", target: 33, actual: 0 },
            { id: crypto.randomUUID(), type: "IP Documentation", target: 5, actual: 0 },
        ],
        status: "upcoming" as const,
        startDate: "2026-07-01T00:00:00.000Z",
        endDate: "2026-09-30T23:59:59.999Z",
    },

    // ==========================================
    // Q4 (OCT-DEC): COMPOUND & LAUNCH
    // ==========================================
    {
        year: 2026,
        quarter: "Q4" as const,
        theme: "Compound & Launch",
        primaryObjective: "Momentum is compounding, set up 2027 - launch major product/partnership and prepare roadmap",
        focusAreas: [
            "Launch major product or partnership",
            "Prepare 2027 roadmap",
            "Scale what's proven",
            "Wrap up IP documentation",
            "Review and optimize full year"
        ],
        keyActions: [
            {
                id: crypto.randomUUID(),
                action: "Launch major product or significant partnership",
                category: "Launch",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Complete all 12 Adalo tutorials",
                category: "Complete",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish Public Build Archive",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Create 2027 strategic plan",
                category: "Create",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Publish 4-6 build breakdowns",
                category: "Publish",
                completed: false,
            },
            {
                id: crypto.randomUUID(),
                action: "Run year-in-review content campaign",
                category: "Launch",
                completed: false,
            }
        ],
        shippingTargets: {
            mvps: { target: 4, actual: 0 },
            internalProducts: { target: 1, actual: 0 },
            buildBreakdowns: { target: 5, actual: 0 },
        },
        revenueTargets: {
            min: 85000,
            max: 125000,
            actual: 0,
        },
        audienceTargets: [
            { id: crypto.randomUUID(), metric: "Email Subscribers", target: 10000, actual: 0 },
            { id: crypto.randomUUID(), metric: "YouTube Subscribers", target: 5000, actual: 0 },
            { id: crypto.randomUUID(), metric: "Total Students", target: 500, actual: 0 },
        ],
        contentTargets: [
            { id: crypto.randomUUID(), type: "Adalo Tutorials", target: 3, actual: 0 },
            { id: crypto.randomUUID(), type: "Personal YouTube Videos", target: 30, actual: 0 },
            { id: crypto.randomUUID(), type: "Year in Review Content", target: 10, actual: 0 },
        ],
        status: "upcoming" as const,
        startDate: "2026-10-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.999Z",
    },
];

export const seed2026Quarters = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if quarterly plans already exist
        const existingPlans = await ctx.db.query("quarterlyPlans").collect();

        if (existingPlans.length > 0) {
            return {
                message: "Quarterly plans already seeded",
                count: existingPlans.length,
            };
        }

        // Seed all 2026 quarterly plans
        const insertedIds = [];
        for (const plan of QUARTERLY_PLANS_2026) {
            const id = await ctx.db.insert("quarterlyPlans", {
                ...plan,
                createdAt: now,
                updatedAt: now,
            });
            insertedIds.push(id);
        }

        return {
            message: "Successfully seeded 2026 quarterly plans",
            count: insertedIds.length,
            quarters: ["Q1: Foundation & Positioning", "Q2: Momentum & Growth", "Q3: Scale & Optimize", "Q4: Compound & Launch"],
            totalRevenue: {
                min: 300000,
                max: 500000,
                note: "Matches annual revenue goal"
            },
            ids: insertedIds,
        };
    },
});
