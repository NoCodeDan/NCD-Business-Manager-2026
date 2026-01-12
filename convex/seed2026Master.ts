import { mutation } from "./_generated/server";
// import { internal } from "./_generated/api";

// ==========================================
// MASTER SEED ORCHESTRATOR FOR 2026 DATA
// ==========================================
// This file coordinates seeding all 2026 strategic planning data
// Call this mutation once to populate the entire 2026 framework

export const seedAll2026Data = mutation({
    args: {},
    handler: async (ctx) => {
        return {
            message: "Please run each seed function individually:",
            functions: [
                "seed2026Goals:seed2026Goals",
                "seed2026Quarters:seed2026Quarters",
                "seed2026Content:seed2026Content",
                "seed2026Rules:seed2026Rules",
                "seed2026ICP:seed2026ICP"
            ]
        };
    },
});

// Temporary: Commented out until all seed files are properly compiled
// export const seedAll2026Data = mutation({
//     args: {},
//     handler: async (ctx) => {
//         const startTime = Date.now();
//         const results: any = {
//             status: "success",
//             timestamp: new Date().toISOString(),
//             duration: 0,
//             seeded: {},
//             errors: [],
//         };

//         try {
//             // Step 1: Seed Goals
//             console.log("Seeding 2026 Goals...");
//             const goalsResult = await ctx.runMutation(internal.seed2026Goals.seed2026Goals, {});
//             results.seeded.goals = goalsResult;
//             console.log(`✓ Goals seeded: ${goalsResult.count} goals`);

//             // Step 2: Seed Quarterly Plans
//             console.log("Seeding 2026 Quarterly Plans...");
//             const quartersResult = await ctx.runMutation(internal.seed2026Quarters.seed2026Quarters, {});
//             results.seeded.quarters = quartersResult;
//             console.log(`✓ Quarterly Plans seeded: ${quartersResult.count} quarters`);

//             // Step 3: Seed Content Plans
//             console.log("Seeding 2026 Content Plans...");
//             const contentResult = await ctx.runMutation(internal.seed2026Content.seed2026Content, {});
//             results.seeded.content = contentResult;
//             console.log(`✓ Content Plans seeded: ${contentResult.count} plans`);

//             // Step 4: Seed Operating Rules
//             console.log("Seeding 2026 Operating Rules...");
//             const rulesResult = await ctx.runMutation(internal.seed2026Rules.seed2026Rules, {});
//             results.seeded.rules = rulesResult;
//             console.log(`✓ Operating Rules seeded: ${rulesResult.count} rule sets`);

//             // Step 5: Seed Target ICPs
//             console.log("Seeding 2026 Target ICPs...");
//             const icpResult = await ctx.runMutation(internal.seed2026ICP.seed2026ICP, {});
//             results.seeded.icp = icpResult;
//             console.log(`✓ Target ICPs seeded: ${icpResult.count} profiles`);

//             // Calculate duration
//             results.duration = Date.now() - startTime;

//             // Success summary
//             console.log("\n🎉 2026 DATA SEEDING COMPLETE!");
//             console.log(`Duration: ${results.duration}ms`);
//             console.log("\nSeeded:");
//             console.log(`  - Goals: ${goalsResult.count}`);
//             console.log(`  - Quarterly Plans: ${quartersResult.count}`);
//             console.log(`  - Content Plans: ${contentResult.count}`);
//             console.log(`  - Operating Rules: ${rulesResult.count}`);
//             console.log(`  - Target ICPs: ${icpResult.count}`);

//             return results;

//         } catch (error: any) {
//             results.status = "error";
//             results.duration = Date.now() - startTime;
//             results.errors.push({
//                 message: error.message || "Unknown error occurred",
//                 stack: error.stack,
//             });
//             console.error("❌ Error seeding 2026 data:", error);
//             throw error;
//         }
//     },
// });

// ==========================================
// INDIVIDUAL RESET FUNCTIONS
// ==========================================
// Use these to reset specific data sets if needed

export const resetGoals = mutation({
    args: {},
    handler: async (ctx) => {
        const goals = await ctx.db.query("goals").collect();
        for (const goal of goals) {
            await ctx.db.delete(goal._id);
        }
        return { message: "All goals deleted", count: goals.length };
    },
});

export const resetQuarterlyPlans = mutation({
    args: {},
    handler: async (ctx) => {
        const plans = await ctx.db.query("quarterlyPlans").collect();
        for (const plan of plans) {
            await ctx.db.delete(plan._id);
        }
        return { message: "All quarterly plans deleted", count: plans.length };
    },
});

export const resetContentPlans = mutation({
    args: {},
    handler: async (ctx) => {
        const plans = await ctx.db.query("contentPlans").collect();
        for (const plan of plans) {
            await ctx.db.delete(plan._id);
        }
        return { message: "All content plans deleted", count: plans.length };
    },
});

export const resetOperatingRules = mutation({
    args: {},
    handler: async (ctx) => {
        const rules = await ctx.db.query("operatingRules").collect();
        for (const rule of rules) {
            await ctx.db.delete(rule._id);
        }
        return { message: "All operating rules deleted", count: rules.length };
    },
});

export const resetTargetICP = mutation({
    args: {},
    handler: async (ctx) => {
        const icps = await ctx.db.query("targetICP").collect();
        for (const icp of icps) {
            await ctx.db.delete(icp._id);
        }
        return { message: "All target ICPs deleted", count: icps.length };
    },
});

// ==========================================
// RESET ALL 2026 DATA
// ==========================================
// DANGER: This will delete ALL 2026 strategic planning data
// Use only if you need to completely reset and re-seed

export const resetAll2026Data = mutation({
    args: {},
    handler: async (ctx) => {
        const results = {
            goals: 0,
            quarters: 0,
            content: 0,
            rules: 0,
            icp: 0,
        };

        // Delete all goals
        const goals = await ctx.db.query("goals").collect();
        for (const goal of goals) {
            await ctx.db.delete(goal._id);
        }
        results.goals = goals.length;

        // Delete all quarterly plans
        const quarters = await ctx.db.query("quarterlyPlans").collect();
        for (const quarter of quarters) {
            await ctx.db.delete(quarter._id);
        }
        results.quarters = quarters.length;

        // Delete all content plans
        const content = await ctx.db.query("contentPlans").collect();
        for (const plan of content) {
            await ctx.db.delete(plan._id);
        }
        results.content = content.length;

        // Delete all operating rules
        const rules = await ctx.db.query("operatingRules").collect();
        for (const rule of rules) {
            await ctx.db.delete(rule._id);
        }
        results.rules = rules.length;

        // Delete all target ICPs
        const icps = await ctx.db.query("targetICP").collect();
        for (const icp of icps) {
            await ctx.db.delete(icp._id);
        }
        results.icp = icps.length;

        console.log("🗑️  ALL 2026 DATA RESET");
        console.log(`Deleted: ${results.goals} goals, ${results.quarters} quarters, ${results.content} content plans, ${results.rules} rule sets, ${results.icp} ICPs`);

        return {
            message: "All 2026 data deleted",
            deleted: results,
            total: results.goals + results.quarters + results.content + results.rules + results.icp,
        };
    },
});
