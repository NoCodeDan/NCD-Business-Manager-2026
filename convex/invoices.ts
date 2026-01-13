import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// QUERIES
// ==========================================

// Get all invoices
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("invoices").collect();
    },
});

// Get invoice by ID
export const getById = query({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get invoices by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get paid invoices
export const getPaidInvoices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("invoices")
            .withIndex("by_status", (q) => q.eq("status", "paid"))
            .collect();
    },
});

// Get pending invoices (sent + overdue)
export const getPendingInvoices = query({
    args: {},
    handler: async (ctx) => {
        const allInvoices = await ctx.db.query("invoices").collect();
        return allInvoices.filter(i =>
            i.status === "sent" || i.status === "overdue"
        );
    },
});

// Get invoices by business area
export const getByBusinessArea = query({
    args: {
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invoices")
            .withIndex("by_business_area", (q) => q.eq("businessArea", args.businessArea))
            .collect();
    },
});

// Get invoices summary
export const getSummary = query({
    args: {},
    handler: async (ctx) => {
        const invoices = await ctx.db.query("invoices").collect();

        const paidInvoices = invoices.filter(i => i.status === "paid");
        const pendingInvoices = invoices.filter(i =>
            i.status === "sent" || i.status === "overdue"
        );
        const overdueInvoices = invoices.filter(i => i.status === "overdue");

        const totalReceived = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
        const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
        const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

        // Revenue by business area
        const revenueByArea: Record<string, number> = {};
        paidInvoices.forEach(i => {
            revenueByArea[i.businessArea] = (revenueByArea[i.businessArea] || 0) + i.amount;
        });

        // Revenue by month (for trends)
        const revenueByMonth: Record<string, number> = {};
        paidInvoices.forEach(i => {
            if (i.paidDate) {
                const month = i.paidDate.substring(0, 7); // YYYY-MM
                revenueByMonth[month] = (revenueByMonth[month] || 0) + i.amount;
            }
        });

        return {
            totalInvoices: invoices.length,
            paidCount: paidInvoices.length,
            pendingCount: pendingInvoices.length,
            overdueCount: overdueInvoices.length,
            totalReceived,
            totalPending,
            totalOverdue,
            revenueByArea,
            revenueByMonth,
        };
    },
});

// ==========================================
// MUTATIONS
// ==========================================

// Create a new invoice
export const create = mutation({
    args: {
        invoiceNumber: v.string(),
        client: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        businessArea: v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        ),
        issueDate: v.string(),
        dueDate: v.string(),
        description: v.optional(v.string()),
        dealId: v.optional(v.id("deals")),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("invoices", {
            ...args,
            paidDate: undefined,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an invoice
export const update = mutation({
    args: {
        id: v.id("invoices"),
        invoiceNumber: v.optional(v.string()),
        client: v.optional(v.string()),
        amount: v.optional(v.number()),
        status: v.optional(v.union(
            v.literal("draft"),
            v.literal("sent"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        )),
        businessArea: v.optional(v.union(
            v.literal("tangible-ideas"),
            v.literal("no-code-effect"),
            v.literal("adalo"),
            v.literal("no-code-dan"),
            v.literal("other")
        )),
        issueDate: v.optional(v.string()),
        dueDate: v.optional(v.string()),
        paidDate: v.optional(v.string()),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Invoice not found");

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete an invoice
export const remove = mutation({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Mark invoice as paid
export const markAsPaid = mutation({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        await ctx.db.patch(args.id, {
            status: "paid",
            paidDate: now,
            updatedAt: now,
        });
    },
});

// Mark invoice as sent
export const markAsSent = mutation({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: "sent",
            updatedAt: new Date().toISOString(),
        });
    },
});

// Check and update overdue invoices
export const checkOverdue = mutation({
    args: {},
    handler: async (ctx) => {
        const now = new Date().toISOString();
        const invoices = await ctx.db
            .query("invoices")
            .withIndex("by_status", (q) => q.eq("status", "sent"))
            .collect();

        const overdueIds: string[] = [];
        for (const invoice of invoices) {
            if (invoice.dueDate < now) {
                await ctx.db.patch(invoice._id, {
                    status: "overdue",
                    updatedAt: now,
                });
                overdueIds.push(invoice._id);
            }
        }

        return overdueIds;
    },
});
