import { mutation } from "./_generated/server";

// ==========================================
// 2026 CONTENT PLANS SEED DATA
// Based on NCD 2026.pdf + Adalo Content Strategy
// ==========================================

const CONTENT_PLANS_2026 = [
    // ==========================================
    // ADALO: LONG-FORM TUTORIALS
    // ==========================================
    {
        name: "Adalo App Clone Tutorials",
        type: "long-form" as const,
        business: "adalo" as const,
        description: "Complete series of 12 app clone tutorials released bi-weekly. Each tutorial shows how to build a complete, functional app from scratch using Adalo.",
        status: "active" as const,
        schedule: {
            frequency: "bi-weekly",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 12,
            cadence: "every two weeks",
        },
        assets: [
            {
                id: crypto.randomUUID(),
                title: "RideWave - Uber Clone",
                status: "planned" as const,
                notes: "Full ride-sharing app with driver/rider views, real-time tracking, payments"
            },
            {
                id: crypto.randomUUID(),
                title: "StayNest - Airbnb Clone",
                status: "planned" as const,
                notes: "Property listing, booking system, host/guest management"
            },
            {
                id: crypto.randomUUID(),
                title: "CalTrack - Calorie Counter App",
                status: "planned" as const,
                notes: "Food logging, nutrition tracking, daily goals, meal planning"
            },
            {
                id: crypto.randomUUID(),
                title: "FitConnect - Social Fitness App",
                status: "planned" as const,
                notes: "Workout tracking + social network for finding workout buddies"
            },
            {
                id: crypto.randomUUID(),
                title: "SnowPeak - Ski Resort App",
                status: "planned" as const,
                notes: "Plan trips, select locations, book stays, rent gear, book lessons"
            },
            {
                id: crypto.randomUUID(),
                title: "DateNight - Date Planning App",
                status: "planned" as const,
                notes: "Get date ideas, find events, book activities, plan group dates"
            },
            {
                id: crypto.randomUUID(),
                title: "SoloSound - Musician Platform",
                status: "planned" as const,
                notes: "Artist website/app hybrid, music player, community for independent artists"
            },
            {
                id: crypto.randomUUID(),
                title: "MindJournal - AI Journaling App",
                status: "planned" as const,
                notes: "Voice/text entries, AI analyzes mood trends and patterns"
            },
            {
                id: crypto.randomUUID(),
                title: "CourseHub - Online Course Platform",
                status: "planned" as const,
                notes: "For independent course creators to host and sell courses"
            },
            {
                id: crypto.randomUUID(),
                title: "TechSummit - Conference App",
                status: "planned" as const,
                notes: "Event info, speaker bios, schedule, maps, registration"
            },
            {
                id: crypto.randomUUID(),
                title: "ZenFlow - Meditation App",
                status: "planned" as const,
                notes: "Guided meditations, sleep sounds, progress tracking, reminders"
            },
            {
                id: crypto.randomUUID(),
                title: "TruckTrack - Food Truck App",
                status: "planned" as const,
                notes: "Customer ordering + admin backend for inventory, menu, location"
            }
        ],
        tags: ["adalo", "tutorials", "long-form", "app-clones"],
        color: "#6366f1",
        order: 1,
    },

    // ==========================================
    // ADALO: 30-DAY SHORT-FORM BLITZ
    // ==========================================
    {
        name: "Adalo 30-Day Blitz (January 2026)",
        type: "campaign" as const,
        business: "adalo" as const,
        description: "Experimental 30-day daily short-form content blitz to increase brand awareness, warm up YouTube algorithm, and drive engagement. Proven strategy for smaller creators to get hundreds of thousands to millions of views.",
        status: "in-progress" as const,
        schedule: {
            frequency: "daily",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-01-31T23:59:59.999Z",
        },
        targets: {
            count: 30,
            cadence: "daily for 30 days",
        },
        assets: [
            {
                id: crypto.randomUUID(),
                title: "Making Your Dream App in 2026 with Adalo",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Finding App Design Inspiration with Mobbin",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Using AI to Create App Mockups",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Common Pitfall: Not Knowing How to Design",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Turning Your Spreadsheet into an App",
                status: "planned" as const,
            },
            // Note: 25 more videos to be planned
        ],
        tags: ["adalo", "short-form", "campaign", "blitz", "engagement"],
        color: "#ec4899",
        order: 2,
    },

    // ==========================================
    // ADALO: WEEKLY UPDATES
    // ==========================================
    {
        name: "Adalo Weekly Changes & Updates",
        type: "series" as const,
        business: "adalo" as const,
        description: "Weekly short-form content highlighting new features, updates, tips, and best practices. Keeps audience informed and engaged.",
        status: "planned" as const,
        schedule: {
            frequency: "weekly",
            startDate: "2026-02-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 48,
            cadence: "weekly",
        },
        assets: [],
        tags: ["adalo", "short-form", "weekly", "updates"],
        color: "#3b82f6",
        order: 3,
    },

    // ==========================================
    // TANGIBLE IDEAS: BUILD BREAKDOWNS
    // ==========================================
    {
        name: "Tangible Ideas Build Breakdowns",
        type: "series" as const,
        business: "tangible-ideas" as const,
        description: "In-depth case studies of MVPs built, including decisions made, tradeoffs, tech stack, and outcomes. 1-2 per month.",
        status: "active" as const,
        schedule: {
            frequency: "1-2 per month",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 18,
            cadence: "1-2 per month",
        },
        assets: [],
        tags: ["tangible-ideas", "case-studies", "mvp", "build-breakdowns"],
        color: "#8b5cf6",
        order: 4,
    },

    // ==========================================
    // TANGIBLE IDEAS: PUBLIC BUILD CHALLENGES
    // ==========================================
    {
        name: "Public Build Challenges",
        type: "campaign" as const,
        business: "tangible-ideas" as const,
        description: "Quarterly live build challenges where you build an MVP publicly and document everything. Engages community and proves expertise.",
        status: "planned" as const,
        schedule: {
            frequency: "quarterly",
            startDate: "2026-03-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 4,
            cadence: "quarterly",
        },
        assets: [
            {
                id: crypto.randomUUID(),
                title: "Q1 Build Challenge",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Q2 Build Challenge",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Q3 Build Challenge",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Q4 Build Challenge",
                status: "planned" as const,
            }
        ],
        tags: ["tangible-ideas", "live", "challenge", "community"],
        color: "#f97316",
        order: 5,
    },

    // ==========================================
    // NO-CODE EFFECT: FOUNDATIONAL TUTORIALS
    // ==========================================
    {
        name: "No-Code Effect Weekly Tutorials",
        type: "long-form" as const,
        business: "no-code-effect" as const,
        description: "Weekly educational tutorials teaching no-code fundamentals, tools, and best practices. Beginner-friendly but builder-respected.",
        status: "planned" as const,
        schedule: {
            frequency: "weekly",
            startDate: "2026-04-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 40,
            cadence: "weekly",
        },
        assets: [],
        tags: ["no-code-effect", "tutorials", "education", "beginner-friendly"],
        color: "#22c55e",
        order: 6,
    },

    // ==========================================
    // NO-CODE EFFECT: FLAGSHIP COURSE
    // ==========================================
    {
        name: "No-Code Effect Flagship Course",
        type: "series" as const,
        business: "no-code-effect" as const,
        description: "Complete foundational course taking students from beginner to builder. Clear learning path with structured modules.",
        status: "planned" as const,
        schedule: {
            frequency: "one-time",
            startDate: "2026-05-01T00:00:00.000Z",
        },
        targets: {
            count: 1,
            cadence: "one-time launch",
        },
        assets: [
            {
                id: crypto.randomUUID(),
                title: "Course Module Planning",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Content Creation",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Platform Setup",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Launch Campaign",
                status: "planned" as const,
            }
        ],
        tags: ["no-code-effect", "course", "flagship", "education"],
        color: "#14b8a6",
        order: 7,
    },

    // ==========================================
    // NO-CODE EFFECT: MINI-COURSES
    // ==========================================
    {
        name: "No-Code Effect Mini-Courses",
        type: "series" as const,
        business: "no-code-effect" as const,
        description: "2-3 focused mini-courses on specific topics or tools. Quick wins for students.",
        status: "planned" as const,
        schedule: {
            frequency: "ad-hoc",
            startDate: "2026-07-01T00:00:00.000Z",
        },
        targets: {
            count: 3,
            cadence: "3 total throughout year",
        },
        assets: [
            {
                id: crypto.randomUUID(),
                title: "Mini-Course 1",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Mini-Course 2",
                status: "planned" as const,
            },
            {
                id: crypto.randomUUID(),
                title: "Mini-Course 3",
                status: "planned" as const,
            }
        ],
        tags: ["no-code-effect", "mini-course", "education"],
        color: "#eab308",
        order: 8,
    },

    // ==========================================
    // PERSONAL BRAND: WEEKLY YOUTUBE VIDEOS
    // ==========================================
    {
        name: "Personal Brand YouTube Videos",
        type: "long-form" as const,
        business: "personal-brand" as const,
        description: "2-3 high-quality YouTube videos per week. Mix of deep dives, lessons learned, and thought leadership. Shows real work, not theory.",
        status: "active" as const,
        schedule: {
            frequency: "2-3 per week",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 130,
            cadence: "2-3 per week (130 annually)",
        },
        assets: [],
        tags: ["personal-brand", "youtube", "thought-leadership"],
        color: "#f43f5e",
        order: 9,
    },

    // ==========================================
    // PERSONAL BRAND: DAILY SHORT-FORM CLIPS
    // ==========================================
    {
        name: "Daily Short-Form Clips",
        type: "short-form" as const,
        business: "personal-brand" as const,
        description: "Daily short-form clips repurposed from long-form content. Maximizes reach and algorithm engagement.",
        status: "active" as const,
        schedule: {
            frequency: "daily",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-12-31T23:59:59.999Z",
        },
        targets: {
            count: 365,
            cadence: "daily",
        },
        assets: [],
        tags: ["personal-brand", "short-form", "repurposed", "clips"],
        color: "#06b6d4",
        order: 10,
    },

    // ==========================================
    // CONTENT ARCHETYPES
    // ==========================================
    {
        name: "The Expert Archetype",
        type: "archetype" as const,
        business: "personal-brand" as const,
        description: "Authority-first content. Tell intricate stories that educate people on your world. Position as credible expert.",
        status: "active" as const,
        schedule: {
            frequency: "ongoing",
        },
        assets: [],
        tags: ["archetype", "expert", "authority", "education"],
        color: "#6366f1",
        order: 11,
    },
    {
        name: "The Artist Archetype",
        type: "archetype" as const,
        business: "personal-brand" as const,
        description: "Social-optimized, creatively directed content. Conceptual and visually exciting. Ideas-first approach.",
        status: "planned" as const,
        schedule: {
            frequency: "ongoing",
        },
        assets: [],
        tags: ["archetype", "artist", "creative", "conceptual"],
        color: "#8b5cf6",
        order: 12,
    },
    {
        name: "The Wild Card Archetype",
        type: "archetype" as const,
        business: "personal-brand" as const,
        description: "Humor, memes, skits, unexpected choices. Attention-first content. Use sparingly alongside core content.",
        status: "planned" as const,
        schedule: {
            frequency: "ongoing",
        },
        assets: [],
        tags: ["archetype", "wild-card", "humor", "attention"],
        color: "#ec4899",
        order: 13,
    },
    {
        name: "The World Builder Archetype",
        type: "archetype" as const,
        business: "tangible-ideas" as const,
        description: "Enable creators, affiliates, and influencers to tell your story at scale. Distribution beats organic.",
        status: "planned" as const,
        schedule: {
            frequency: "ongoing",
        },
        assets: [],
        tags: ["archetype", "world-builder", "distribution", "collaboration"],
        color: "#22c55e",
        order: 14,
    },
];

export const seed2026Content = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();

        // Check if content plans already exist
        const existingPlans = await ctx.db.query("contentPlans").collect();

        if (existingPlans.length > 0) {
            return {
                message: "Content plans already seeded",
                count: existingPlans.length,
            };
        }

        // Seed all 2026 content plans
        const insertedIds = [];
        for (const plan of CONTENT_PLANS_2026) {
            const id = await ctx.db.insert("contentPlans", {
                ...plan,
                createdAt: now,
                updatedAt: now,
            });
            insertedIds.push(id);
        }

        return {
            message: "Successfully seeded 2026 content plans",
            count: insertedIds.length,
            breakdown: {
                adalo: 3,
                tangibleIdeas: 2,
                noCodeEffect: 3,
                personalBrand: 2,
                archetypes: 4,
            },
            totalAssets: {
                adaloProgrammes: 12,
                blitzVideos: 30,
                weeklyUpdates: 48,
                buildBreakdowns: 18,
                tutorials: 40,
                courses: 4,
                youtubeVideos: 130,
                dailyClips: 365,
            },
            ids: insertedIds,
        };
    },
});
