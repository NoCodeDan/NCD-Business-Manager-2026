import { mutation, query } from "./_generated/server";

/**
 * Migration script to link existing initiatives to 2026 goals
 * 
 * This connects:
 * - "Increase Revenue" → Business & Revenue Goals
 * - "Launch Product Suite" → Tangible Ideas Goals
 * - "Streamline Operations" → Systems & Operations Goals
 * - "Build Brand Presence" → Personal Brand Goals
 */

// Query to preview the mapping before applying
export const previewInitiativeGoalMapping = query({
    args: {},
    handler: async (ctx) => {
        const initiatives = await ctx.db.query("initiatives").collect();
        const goals = await ctx.db.query("goals").collect();

        const mapping = initiatives.map((initiative) => {
            let goalType: string;
            let businessArea: string;

            // Determine which goal this initiative should link to
            if (initiative.name.toLowerCase().includes("revenue")) {
                goalType = "business";
                businessArea = "general";
            } else if (
                initiative.name.toLowerCase().includes("product") ||
                initiative.name.toLowerCase().includes("launch")
            ) {
                goalType = "tangible-ideas";
                businessArea = "tangible-ideas";
            } else if (
                initiative.name.toLowerCase().includes("operation") ||
                initiative.name.toLowerCase().includes("streamline")
            ) {
                goalType = "systems-ops";
                businessArea = "general";
            } else if (
                initiative.name.toLowerCase().includes("brand") ||
                initiative.name.toLowerCase().includes("presence")
            ) {
                goalType = "personal-brand";
                businessArea = "personal-brand";
            } else {
                goalType = "unknown";
                businessArea = "general";
            }

            const matchingGoal = goals.find((g) => g.type === goalType);

            return {
                initiative: {
                    id: initiative._id,
                    name: initiative.name,
                    category: initiative.category,
                },
                willLinkTo: matchingGoal
                    ? {
                          id: matchingGoal._id,
                          type: matchingGoal.type,
                          title: matchingGoal.title,
                      }
                    : null,
                businessArea,
                year: 2026,
            };
        });

        return {
            totalInitiatives: initiatives.length,
            totalGoals: goals.length,
            mapping,
        };
    },
});

// Mutation to apply the linking
export const linkInitiativesToGoals = mutation({
    args: {},
    handler: async (ctx) => {
        const initiatives = await ctx.db.query("initiatives").collect();
        const goals = await ctx.db.query("goals").collect();

        const results = {
            linked: [] as any[],
            errors: [] as any[],
            summary: {
                total: initiatives.length,
                linked: 0,
                alreadyLinked: 0,
                errors: 0,
            },
        };

        for (const initiative of initiatives) {
            try {
                // Skip if already linked
                if (initiative.goalId) {
                    results.summary.alreadyLinked++;
                    continue;
                }

                let goalType: string;
                let businessArea:
                    | "tangible-ideas"
                    | "no-code-effect"
                    | "adalo"
                    | "personal-brand"
                    | "general";

                // Determine which goal this initiative should link to
                if (initiative.name.toLowerCase().includes("revenue")) {
                    goalType = "business";
                    businessArea = "general";
                } else if (
                    initiative.name.toLowerCase().includes("product") ||
                    initiative.name.toLowerCase().includes("launch")
                ) {
                    goalType = "tangible-ideas";
                    businessArea = "tangible-ideas";
                } else if (
                    initiative.name.toLowerCase().includes("operation") ||
                    initiative.name.toLowerCase().includes("streamline")
                ) {
                    goalType = "systems-ops";
                    businessArea = "general";
                } else if (
                    initiative.name.toLowerCase().includes("brand") ||
                    initiative.name.toLowerCase().includes("presence")
                ) {
                    goalType = "personal-brand";
                    businessArea = "personal-brand";
                } else {
                    // Default to general if we can't determine
                    goalType = "business";
                    businessArea = "general";
                }

                const matchingGoal = goals.find((g) => g.type === goalType);

                if (matchingGoal) {
                    await ctx.db.patch(initiative._id, {
                        year: 2026,
                        goalId: matchingGoal._id,
                        businessArea: businessArea,
                        updatedAt: new Date().toISOString(),
                    });

                    results.linked.push({
                        initiative: initiative.name,
                        linkedTo: matchingGoal.title,
                        businessArea,
                    });
                    results.summary.linked++;
                } else {
                    results.errors.push({
                        initiative: initiative.name,
                        error: `No matching goal found for type: ${goalType}`,
                    });
                    results.summary.errors++;
                }
            } catch (error: any) {
                results.errors.push({
                    initiative: initiative.name,
                    error: error.message,
                });
                results.summary.errors++;
            }
        }

        console.log("\n🔗 INITIATIVE LINKING COMPLETE");
        console.log(`Total Initiatives: ${results.summary.total}`);
        console.log(`Linked: ${results.summary.linked}`);
        console.log(`Already Linked: ${results.summary.alreadyLinked}`);
        console.log(`Errors: ${results.summary.errors}`);

        return results;
    },
});

// Query to verify the links after migration
export const verifyInitiativeLinks = query({
    args: {},
    handler: async (ctx) => {
        const initiatives = await ctx.db.query("initiatives").collect();

        const verification = {
            total: initiatives.length,
            linked: 0,
            unlinked: 0,
            by2026: 0,
            details: [] as any[],
        };

        for (const initiative of initiatives) {
            const hasGoalLink = !!initiative.goalId;
            const is2026 = initiative.year === 2026;

            if (hasGoalLink) verification.linked++;
            else verification.unlinked++;

            if (is2026) verification.by2026++;

            let goalTitle = null;
            if (initiative.goalId) {
                const goal = await ctx.db.get(initiative.goalId);
                goalTitle = goal?.title || "Unknown Goal";
            }

            verification.details.push({
                initiative: initiative.name,
                year: initiative.year || "Not set",
                businessArea: initiative.businessArea || "Not set",
                linkedToGoal: goalTitle || "Not linked",
                hasLink: hasGoalLink,
            });
        }

        return verification;
    },
});

// Mutation to unlink all initiatives (rollback)
export const unlinkAllInitiatives = mutation({
    args: {},
    handler: async (ctx) => {
        const initiatives = await ctx.db.query("initiatives").collect();

        let count = 0;
        for (const initiative of initiatives) {
            if (initiative.goalId || initiative.year || initiative.businessArea) {
                await ctx.db.patch(initiative._id, {
                    year: undefined,
                    goalId: undefined,
                    businessArea: undefined,
                    updatedAt: new Date().toISOString(),
                });
                count++;
            }
        }

        console.log(`🔓 Unlinked ${count} initiatives`);

        return {
            message: "All initiatives unlinked",
            count,
        };
    },
});
