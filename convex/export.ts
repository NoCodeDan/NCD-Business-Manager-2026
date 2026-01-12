import { query } from "./_generated/server";

/**
 * Export Module
 * 
 * Enables bulk data export for file-based agent workflows.
 * Agents can fetch all data and write to files if needed.
 */

// Export all data in a structured format
export const exportAll = query({
    args: {},
    handler: async (ctx) => {
        const [sops, projects, expenses, initiatives] = await Promise.all([
            ctx.db.query("sops").collect(),
            ctx.db.query("projects").collect(),
            ctx.db.query("expenses").collect(),
            ctx.db.query("initiatives").collect(),
        ]);

        return {
            exportedAt: new Date().toISOString(),
            data: {
                sops: sops.map(s => ({
                    id: s._id,
                    title: s.title,
                    content: s.content,
                    category: s.category,
                    tags: s.tags,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                })),
                projects: projects.map(p => ({
                    id: p._id,
                    name: p.name,
                    description: p.description,
                    status: p.status,
                    tasks: p.tasks,
                    color: p.color,
                    deadline: p.deadline,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                })),
                expenses: expenses.map(e => ({
                    id: e._id,
                    name: e.name,
                    amount: e.amount,
                    billingCycle: e.billingCycle,
                    category: e.category,
                    renewalDate: e.renewalDate,
                    notes: e.notes,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt,
                })),
                initiatives: initiatives.map(i => ({
                    id: i._id,
                    name: i.name,
                    description: i.description,
                    category: i.category,
                    status: i.status,
                    color: i.color,
                    kpis: i.kpis,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt,
                })),
            },
            counts: {
                sops: sops.length,
                projects: projects.length,
                expenses: expenses.length,
                initiatives: initiatives.length,
            },
        };
    },
});

// Export a specific entity type
export const exportEntity = query({
    args: {},
    handler: async (ctx) => {
        // This returns available entity types and their endpoints
        return {
            availableTypes: ["sops", "projects", "expenses", "initiatives"],
            instructions: "Use the specific query for each entity type: api.sops.get, api.projects.get, etc.",
        };
    },
});
