import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all contacts
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contacts").collect();
    },
});

// Get contact by ID
export const getById = query({
    args: { id: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get contacts by status
export const getByStatus = query({
    args: {
        status: v.union(
            v.literal("pending"),
            v.literal("enriched"),
            v.literal("failed")
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contacts")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get contacts by brand partner
export const getByBrandPartner = query({
    args: { brandPartnerId: v.id("brandPartners") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contacts")
            .withIndex("by_brand_partner", (q) => q.eq("brandPartnerId", args.brandPartnerId))
            .collect();
    },
});

// Get contacts needing follow-up
export const getFollowUps = query({
    args: {},
    handler: async (ctx) => {
        const contacts = await ctx.db
            .query("contacts")
            .withIndex("by_status", (q) => q.eq("status", "enriched"))
            .collect();

        return contacts.filter(c => c.followUpDate);
    },
});

// Search contacts
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const contacts = await ctx.db.query("contacts").collect();
        const q = args.query.toLowerCase();
        return contacts.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.company.name.toLowerCase().includes(q)
        );
    },
});

// Create contact
export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        avatar: v.optional(v.string()),
        company: v.object({
            name: v.string(),
            role: v.string(),
            website: v.optional(v.string()),
            industry: v.optional(v.string()),
        }),
        socialProfiles: v.array(v.object({
            platform: v.string(),
            url: v.string(),
            username: v.string(),
        })),
        recentActivity: v.array(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("enriched"),
            v.literal("failed")
        ),
        followUpDate: v.optional(v.string()),
        followUpNote: v.optional(v.string()),
        brandPartnerId: v.optional(v.id("brandPartners")),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("contacts", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update contact
export const update = mutation({
    args: {
        id: v.id("contacts"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        avatar: v.optional(v.string()),
        company: v.optional(v.object({
            name: v.string(),
            role: v.string(),
            website: v.optional(v.string()),
            industry: v.optional(v.string()),
        })),
        socialProfiles: v.optional(v.array(v.object({
            platform: v.string(),
            url: v.string(),
            username: v.string(),
        }))),
        recentActivity: v.optional(v.array(v.string())),
        status: v.optional(v.union(
            v.literal("pending"),
            v.literal("enriched"),
            v.literal("failed")
        )),
        followUpDate: v.optional(v.string()),
        followUpNote: v.optional(v.string()),
        brandPartnerId: v.optional(v.id("brandPartners")),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Contact not found");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Mark follow-up as done
export const clearFollowUp = mutation({
    args: { id: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            followUpDate: undefined,
            followUpNote: undefined,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete contact
export const remove = mutation({
    args: { id: v.id("contacts") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});
