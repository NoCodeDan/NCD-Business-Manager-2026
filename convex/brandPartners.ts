import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all brand partners
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("brandPartners").collect();
    },
});

// Get brand partner by ID
export const getById = query({
    args: { id: v.id("brandPartners") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get brand partners by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("pending")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("brandPartners")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get active brand partners (convenience query)
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("brandPartners")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
    },
});

// Get brand partner with its contacts
export const getWithContacts = query({
    args: { id: v.id("brandPartners") },
    handler: async (ctx, args) => {
        const partner = await ctx.db.get(args.id);
        if (!partner) return null;

        const contacts = await ctx.db
            .query("contacts")
            .withIndex("by_brand_partner", (q) => q.eq("brandPartnerId", args.id))
            .collect();

        return { ...partner, contacts };
    },
});

// Get all brand partners with their contacts
export const getAllWithContacts = query({
    args: {},
    handler: async (ctx) => {
        const partners = await ctx.db.query("brandPartners").collect();

        const partnersWithContacts = await Promise.all(
            partners.map(async (partner) => {
                const contacts = await ctx.db
                    .query("contacts")
                    .withIndex("by_brand_partner", (q) => q.eq("brandPartnerId", partner._id))
                    .collect();
                return { ...partner, contacts };
            })
        );

        return partnersWithContacts;
    },
});

// Create brand partner
export const create = mutation({
    args: {
        name: v.string(),
        website: v.string(),
        logo: v.optional(v.string()),
        partnerType: v.union(
            v.literal("strategic"),
            v.literal("affiliate"),
            v.literal("referral"),
            v.literal("integration")
        ),
        status: v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("pending")
        ),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("brandPartners", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update brand partner
export const update = mutation({
    args: {
        id: v.id("brandPartners"),
        name: v.optional(v.string()),
        website: v.optional(v.string()),
        logo: v.optional(v.string()),
        partnerType: v.optional(v.union(
            v.literal("strategic"),
            v.literal("affiliate"),
            v.literal("referral"),
            v.literal("integration")
        )),
        status: v.optional(v.union(
            v.literal("active"),
            v.literal("inactive"),
            v.literal("pending")
        )),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Brand partner not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete brand partner (and optionally unlink contacts)
export const remove = mutation({
    args: { id: v.id("brandPartners") },
    handler: async (ctx, args) => {
        // Unlink any associated contacts
        const contacts = await ctx.db
            .query("contacts")
            .withIndex("by_brand_partner", (q) => q.eq("brandPartnerId", args.id))
            .collect();

        for (const contact of contacts) {
            await ctx.db.patch(contact._id, { brandPartnerId: undefined });
        }

        return await ctx.db.delete(args.id);
    },
});
