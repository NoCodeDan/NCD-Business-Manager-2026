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
        const todos = await ctx.db.query("todos").collect();
        const calendarEvents = await ctx.db.query("calendarEvents").collect();
        const contentIdeas = await ctx.db.query("contentIdeas").collect();
        const brandPartners = await ctx.db.query("brandPartners").collect();
        const contacts = await ctx.db.query("contacts").collect();
        const clients = await ctx.db.query("clients").collect();

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === "active");
        const completedProjects = projects.filter(p => p.status === "completed");
        const pausedProjects = projects.filter(p => p.status === "paused");

        const onTrackInitiatives = initiatives.filter(i => i.status === "on-track");
        const atRiskInitiatives = initiatives.filter(i => i.status === "at-risk");
        const behindInitiatives = initiatives.filter(i => i.status === "behind");

        // Todo stats
        const pendingTodos = todos.filter(t => !t.completed);
        const completedTodos = todos.filter(t => t.completed);
        const highPriorityTodos = pendingTodos.filter(t => t.priority === "high");

        // Calendar stats
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        const todayEvents = calendarEvents.filter(e => e.startDate.startsWith(todayStr));
        const upcomingEvents = calendarEvents.filter(e => {
            const eventDate = new Date(e.startDate);
            return eventDate >= now && eventDate <= weekFromNow;
        });

        // Content ideas stats
        const activeIdeas = contentIdeas.filter(i => i.status !== "archived" && i.status !== "published");
        const ideaTypes = contentIdeas.reduce((acc: Record<string, number>, i) => {
            acc[i.type] = (acc[i.type] || 0) + 1;
            return acc;
        }, {});

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

        // Calculate total project tasks
        const allTasks = projects.flatMap(p => p.tasks || []);
        const completedProjectTasks = allTasks.filter(t => t.completed);

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
                projectTasks: {
                    total: allTasks.length,
                    completed: completedProjectTasks.length,
                    pending: allTasks.length - completedProjectTasks.length,
                },
                todos: {
                    total: todos.length,
                    pending: pendingTodos.length,
                    completed: completedTodos.length,
                    highPriority: highPriorityTodos.length,
                },
                calendar: {
                    total: calendarEvents.length,
                    today: todayEvents.length,
                    upcoming7Days: upcomingEvents.length,
                },
                contentIdeas: {
                    total: contentIdeas.length,
                    active: activeIdeas.length,
                    byType: ideaTypes,
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
                crm: {
                    brandPartners: brandPartners.length,
                    contacts: contacts.length,
                    clients: clients.length,
                    activePartners: brandPartners.filter(p => p.status === "active").length,
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
            todayEvents: todayEvents.map(e => ({
                id: e._id,
                title: e.title,
                startDate: e.startDate,
                location: e.location,
            })),
            highPriorityTodos: highPriorityTodos.slice(0, 5).map(t => ({
                id: t._id,
                title: t.title,
                dueDate: t.dueDate,
            })),
            capabilities: [
                "Create, read, update, delete SOPs",
                "Create, read, update, delete Projects",
                "Add, toggle, delete tasks within projects",
                "Create, read, update, delete Todos",
                "Create, read, update, delete Calendar Events",
                "Create, read, update, delete Content Ideas",
                "Create, read, update, delete Expenses",
                "Create, read, update, delete Initiatives",
                "Manage CRM contacts, brand partners, clients",
                "Update KPI data for initiatives",
                "Search across all entities",
            ],
            entities: [
                "sops",
                "projects",
                "todos",
                "calendarEvents",
                "contentIdeas",
                "expenses",
                "initiatives",
                "brandPartners",
                "contacts",
                "clients",
            ],
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
        const todos = await ctx.db.query("todos").collect();
        const calendarEvents = await ctx.db.query("calendarEvents").collect();
        const contentIdeas = await ctx.db.query("contentIdeas").collect();
        const brandPartners = await ctx.db.query("brandPartners").collect();
        const contacts = await ctx.db.query("contacts").collect();
        const clients = await ctx.db.query("clients").collect();

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === "active");
        const onTrackInitiatives = initiatives.filter(i => i.status === "on-track");
        const atRiskInitiatives = initiatives.filter(i => i.status === "at-risk");
        const pendingTodos = todos.filter(t => !t.completed);
        const activeIdeas = contentIdeas.filter(i => i.status !== "archived" && i.status !== "published");

        const monthlyTotal = expenses.reduce((total, expense) => {
            if (expense.billingCycle === "monthly") {
                return total + expense.amount;
            }
            return total + expense.amount / 12;
        }, 0);

        const allTasks = projects.flatMap(p => p.tasks || []);
        const completedTasks = allTasks.filter(t => t.completed);

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const todayEvents = calendarEvents.filter(e => e.startDate.startsWith(todayStr));

        // Build markdown
        const markdown = `# NCD Business Manager Context

## Current State
- **${sops.length} SOPs** across ${[...new Set(sops.map(s => s.category))].length} categories
- **${projects.length} Projects** (${activeProjects.length} active)
- **${allTasks.length} Project Tasks** (${completedTasks.length} completed, ${allTasks.length - completedTasks.length} pending)
- **${todos.length} Todos** (${pendingTodos.length} pending)
- **${calendarEvents.length} Calendar Events** (${todayEvents.length} today)
- **${contentIdeas.length} Content Ideas** (${activeIdeas.length} active)
- **${expenses.length} Expenses** totaling $${monthlyTotal.toFixed(2)}/month
- **${initiatives.length} Initiatives** (${onTrackInitiatives.length} on-track, ${atRiskInitiatives.length} at-risk)
- **${brandPartners.length} Brand Partners**, ${contacts.length} Contacts, ${clients.length} Clients

## Available Actions
- **Todos**: Create, toggle, delete tasks
- **Calendar**: Create, view events
- **Content Ideas**: Create, update, search ideas
- **SOPs**: Create, read, update, delete Standard Operating Procedures
- **Projects**: Create projects, add tasks, update status
- **Expenses**: View and search recurring expenses
- **Initiatives**: Track business goals with KPIs

## Entity Types
- \`todos\` - Tasks with title, priority, due date
- \`calendarEvents\` - Events with start/end dates, location
- \`contentIdeas\` - Content brainstorms with type, status, tags
- \`sops\` - Standard Operating Procedures with category, tags
- \`projects\` - Projects with tasks, status, deadlines
- \`expenses\` - Recurring expenses with billing cycle
- \`initiatives\` - Business goals with KPIs tracked quarterly
- \`brandPartners\` - Partner companies with contacts
- \`contacts\` - People in the CRM
- \`clients\` - Client relationships

## Current Date
${new Date().toISOString().split('T')[0]}
`;

        return markdown;
    },
});
