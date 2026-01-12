import { mutation } from "./_generated/server";

// ==========================================
// 2026 TARGET ICP SEED DATA
// Based on NCD 2026.pdf - Adalo Content Strategy
// ==========================================

const TARGET_ICP_2026 = [
    // ==========================================
    // ICP #1: INTENTIONAL / DATA-INTENTIONAL USERS
    // ==========================================
    {
        business: "adalo" as const,
        name: "Intentional Users / Data-Intentional Users",
        description: "Users who have existing data (spreadsheet, database) and need to turn it into a functional app. They focus on real results and business outcomes, not side projects. Starting budget around $100/month.",
        characteristics: [
            "Has existing data in spreadsheets or databases",
            "Needs to turn data into a functional app",
            "Focused on real business results, not side hustles",
            "Starting budget: ~$100/month",
            "Wants practical solutions that work",
            "Values simplicity and reliability",
            "May have a small team that needs access to data",
            "Looking for no-code solutions that can handle data complexity"
        ],
        painPoints: [
            "My data is stuck in spreadsheets",
            "I need a simple interface for my team",
            "No-code seems limited for data-heavy apps",
            "I don't want to learn to code",
            "Hiring developers is too expensive",
            "I need something that works NOW, not in 6 months",
            "I tried other no-code tools but they couldn't handle my data",
            "I need to control costs while scaling"
        ],
        messaging: [
            {
                id: crypto.randomUUID(),
                message: "Turn your spreadsheet into an app in 24 hours",
                channel: "YouTube",
            },
            {
                id: crypto.randomUUID(),
                message: "Adalo is for real results, not side hustles",
                channel: "Social Media",
            },
            {
                id: crypto.randomUUID(),
                message: "Start a business with $100/month",
                channel: "Blog/Email",
            },
            {
                id: crypto.randomUUID(),
                message: "From database to deployed app - without code",
                channel: "Landing Page",
            },
            {
                id: crypto.randomUUID(),
                message: "Build data-driven apps that your team will actually use",
                channel: "Ads",
            }
        ],
        order: 1,
        isActive: true,
    },

    // ==========================================
    // ICP #2: FRUSTRATED VIBE CODING USERS
    // ==========================================
    {
        business: "adalo" as const,
        name: "Frustrated Vibe Coding Users",
        description: "Users who have tried AI coding tools (Lovable, Claude, Cursor, etc.) but got stuck with technical issues. They want to actually ship, not just prototype. Willing to trade flexibility for reliability. Moving 'from vibe to viable'.",
        characteristics: [
            "Has tried AI coding tools (Lovable, Flutterflow, Bubble, Claude, Cursor)",
            "Got stuck with technical implementation or deployment",
            "Wants to actually ship and launch, not just prototype",
            "Willing to trade some flexibility for reliability",
            "Frustrated with debugging AI-generated code",
            "Tired of being stuck between no-code and full-code",
            "Has a real product idea they want to validate",
            "Looking for a more predictable development experience"
        ],
        painPoints: [
            "AI-generated code breaks when I try to deploy",
            "I can't debug what the AI created",
            "I need something that just works",
            "I'm stuck between no-code and full-code",
            "I spent weeks on a prototype that won't launch",
            "AI tools are great for demos, terrible for production",
            "I need to actually get to market, not just build demos",
            "I'm tired of starting over every time something breaks"
        ],
        messaging: [
            {
                id: crypto.randomUUID(),
                message: "From vibe to viable",
                channel: "YouTube",
            },
            {
                id: crypto.randomUUID(),
                message: "No-code that actually ships",
                channel: "Social Media",
            },
            {
                id: crypto.randomUUID(),
                message: "Stop debugging, start launching",
                channel: "Blog/Email",
            },
            {
                id: crypto.randomUUID(),
                message: "The reliable alternative to AI coding tools",
                channel: "Landing Page",
            },
            {
                id: crypto.randomUUID(),
                message: "Build once, deploy confidently",
                channel: "Ads",
            },
            {
                id: crypto.randomUUID(),
                message: "When AI coding isn't enough (and you need to ship)",
                channel: "YouTube",
            }
        ],
        order: 2,
        isActive: true,
    },

    // ==========================================
    // ICP #3: NO-CODE EFFECT BEGINNERS
    // ==========================================
    {
        business: "no-code-effect" as const,
        name: "No-Code Beginners",
        description: "Complete beginners who want to learn no-code development. Looking for a welcoming, structured learning path from zero to their first launch.",
        characteristics: [
            "Little to no coding experience",
            "Wants to build their own products",
            "Looking for structured learning",
            "Needs beginner-friendly resources",
            "Appreciates clear explanations",
            "Values community support",
            "Has an idea but doesn't know where to start",
            "Willing to invest time in learning"
        ],
        painPoints: [
            "I don't know where to start with no-code",
            "Most tutorials assume I already know things",
            "I'm overwhelmed by all the tool options",
            "I don't want to waste time learning the wrong things",
            "I need a clear path from beginner to builder",
            "I'm afraid I'll build something that doesn't work",
            "I want to learn from someone who actually ships",
            "I need to know this will lead somewhere real"
        ],
        messaging: [
            {
                id: crypto.randomUUID(),
                message: "From zero to your first app launch",
                channel: "YouTube",
            },
            {
                id: crypto.randomUUID(),
                message: "Learn no-code the right way",
                channel: "Social Media",
            },
            {
                id: crypto.randomUUID(),
                message: "Beginner-friendly, builder-respected",
                channel: "Email",
            },
            {
                id: crypto.randomUUID(),
                message: "Clear learning path: Beginner → Builder → Founder",
                channel: "Landing Page",
            }
        ],
        order: 3,
        isActive: true,
    },

    // ==========================================
    // ICP #4: TANGIBLE IDEAS CLIENTS
    // ==========================================
    {
        business: "tangible-ideas" as const,
        name: "MVP Clients",
        description: "Founders and businesses that need fast, opinionated MVPs built. They value speed and shipping over perfection. They want a partner who actually launches, not just builds decks.",
        characteristics: [
            "Has a validated idea or business need",
            "Needs an MVP built quickly (weeks, not months)",
            "Values shipping over perfection",
            "Appreciates opinionated decisions",
            "Budget-conscious but willing to invest",
            "Wants to test ideas in market fast",
            "May have tried to build themselves and got stuck",
            "Looking for a builder-partner, not just a dev shop"
        ],
        painPoints: [
            "Traditional dev shops take too long and cost too much",
            "I need to test my idea NOW, not in 6 months",
            "I don't want endless meetings and scope creep",
            "I need someone who can make decisions and move fast",
            "I've been burned by agencies that deliver nothing",
            "I want proof, not promises",
            "I need something that actually launches",
            "I'm tired of wireframes and roadmaps - I need a real product"
        ],
        messaging: [
            {
                id: crypto.randomUUID(),
                message: "Fast, opinionated MVPs that actually launch",
                channel: "Website",
            },
            {
                id: crypto.randomUUID(),
                message: "Ship in weeks, not months",
                channel: "Social Media",
            },
            {
                id: crypto.randomUUID(),
                message: "No decks. Just shipped products.",
                channel: "LinkedIn",
            },
            {
                id: crypto.randomUUID(),
                message: "From idea to launched MVP",
                channel: "Email",
            }
        ],
        order: 4,
        isActive: true,
    },
];

export const seed2026ICP = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if ICPs already exist
        const existingICPs = await ctx.db.query("targetICP").collect();

        if (existingICPs.length > 0) {
            return {
                message: "Target ICPs already seeded",
                count: existingICPs.length,
            };
        }

        // Seed all 2026 target ICPs
        const insertedIds = [];
        for (const icp of TARGET_ICP_2026) {
            const id = await ctx.db.insert("targetICP", {
                ...icp,
                createdAt: now,
                updatedAt: now,
            });
            insertedIds.push(id);
        }

        return {
            message: "Successfully seeded 2026 target ICPs",
            count: insertedIds.length,
            profiles: [
                "Intentional Users / Data-Intentional Users (Adalo)",
                "Frustrated Vibe Coding Users (Adalo)",
                "No-Code Beginners (No-Code Effect)",
                "MVP Clients (Tangible Ideas)"
            ],
            ids: insertedIds,
        };
    },
});
