import { query } from "./_generated/server";

/**
 * Agent Context Query
 * 
 * Generates a dynamic summary of the current app state for agents to read
 * at session start. Follows the context.md pattern from agent-native architecture.
 */
export const getContext = query({
    args: {},
    handler: async (ctx) => {
        // Fetch all data
        const sops = await ctx.db.query("sops").collect();
        const projects = await ctx.db.query("projects").collect();
        const expenses = await ctx.db.query("expenses").collect();
        const initiatives = await ctx.db.query("initiatives").collect();

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === "active");
        const completedProjects = projects.filter(p => p.status === "completed");
        const pausedProjects = projects.filter(p => p.status === "paused");

        const onTrackInitiatives = initiatives.filter(i => i.status === "on-track");
        const atRiskInitiatives = initiatives.filter(i => i.status === "at-risk");
        const behindInitiatives = initiatives.filter(i => i.status === "behind");

        // Calculate expense totals
        const monthlyTotal = expenses.reduce((total, expense) => {
            if (expense.billingCycle === "monthly") {
                return total + expense.amount;
            }
            return total + expense.amount / 12;
        }, 0);

        // Get expense categories
        const expenseCategories = [...new Set(expenses.map(e => e.category))];
        const sopCategories = [...new Set(sops.map(s => s.category))];

        // Calculate total tasks
        const allTasks = projects.flatMap(p => p.tasks || []);
        const completedTasks = allTasks.filter(t => t.completed);

        // Find recent activity (items updated in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString();

        const recentProjects = projects
            .filter(p => p.updatedAt > sevenDaysAgoStr)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 3);

        const recentSOPs = sops
            .filter(s => s.updatedAt > sevenDaysAgoStr)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 3);

        // Find upcoming renewals (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const upcomingRenewals = expenses
            .filter(e => {
                const renewalDate = new Date(e.renewalDate);
                return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
            .slice(0, 5);

        // Build structured context
        const context = {
            summary: {
                sops: {
                    total: sops.length,
                    categories: sopCategories,
                },
                projects: {
                    total: projects.length,
                    active: activeProjects.length,
                    completed: completedProjects.length,
                    paused: pausedProjects.length,
                },
                tasks: {
                    total: allTasks.length,
                    completed: completedTasks.length,
                    pending: allTasks.length - completedTasks.length,
                },
                expenses: {
                    total: expenses.length,
                    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
                    categories: expenseCategories,
                },
                initiatives: {
                    total: initiatives.length,
                    onTrack: onTrackInitiatives.length,
                    atRisk: atRiskInitiatives.length,
                    behind: behindInitiatives.length,
                },
            },
            recentActivity: {
                projects: recentProjects.map(p => ({
                    id: p._id,
                    name: p.name,
                    status: p.status,
                    updatedAt: p.updatedAt,
                })),
                sops: recentSOPs.map(s => ({
                    id: s._id,
                    title: s.title,
                    category: s.category,
                    updatedAt: s.updatedAt,
                })),
            },
            upcomingRenewals: upcomingRenewals.map(e => ({
                id: e._id,
                name: e.name,
                amount: e.amount,
                renewalDate: e.renewalDate,
            })),
            capabilities: [
                "Create, read, update, delete SOPs",
                "Create, read, update, delete Projects",
                "Add, toggle, delete tasks within projects",
                "Create, read, update, delete Expenses",
                "Create, read, update, delete Initiatives",
                "Update KPI data for initiatives",
                "Search across all entities",
            ],
            entities: ["sops", "projects", "expenses", "initiatives"],
        };

        return context;
    },
});

/**
 * Get context as markdown format (for agents that prefer text)
 */
export const getContextMarkdown = query({
    args: {},
    handler: async (ctx) => {
        // Fetch all data
        const sops = await ctx.db.query("sops").collect();
        const projects = await ctx.db.query("projects").collect();
        const expenses = await ctx.db.query("expenses").collect();
        const initiatives = await ctx.db.query("initiatives").collect();

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === "active");
        const onTrackInitiatives = initiatives.filter(i => i.status === "on-track");
        const atRiskInitiatives = initiatives.filter(i => i.status === "at-risk");

        const monthlyTotal = expenses.reduce((total, expense) => {
            if (expense.billingCycle === "monthly") {
                return total + expense.amount;
            }
            return total + expense.amount / 12;
        }, 0);

        const allTasks = projects.flatMap(p => p.tasks || []);
        const completedTasks = allTasks.filter(t => t.completed);

        // Build markdown
        const markdown = `# NCD Business Manager Context

## What Exists
- **${sops.length} SOPs** across ${[...new Set(sops.map(s => s.category))].length} categories
- **${projects.length} Projects** (${activeProjects.length} active)
- **${allTasks.length} Tasks** (${completedTasks.length} completed, ${allTasks.length - completedTasks.length} pending)
- **${expenses.length} Expenses** totaling $${monthlyTotal.toFixed(2)}/month
- **${initiatives.length} Initiatives** (${onTrackInitiatives.length} on-track, ${atRiskInitiatives.length} at-risk)

## Available Actions
- Create, read, update, delete: SOPs, Projects, Expenses, Initiatives
- Manage tasks within projects (add, toggle, delete)
- Track KPIs for initiatives by quarter
- Search across all entities

## Entity Types
- \`sops\` - Standard Operating Procedures with title, content, category, tags
- \`projects\` - Projects with tasks, status (active/paused/completed/archived)
- \`expenses\` - Recurring expenses with billing cycle (monthly/annual)
- \`initiatives\` - Business goals with KPIs tracked quarterly

## Current Date
${new Date().toISOString().split('T')[0]}
`;

        return markdown;
    },
});
