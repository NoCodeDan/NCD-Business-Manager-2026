import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ==========================================
// Reusable validators for dossier fields
// ==========================================
const relationshipTypeValidator = v.union(
    v.literal("lead"),
    v.literal("client"),
    v.literal("partner"),
    v.literal("collaborator"),
    v.literal("creator"),
    v.literal("investor")
);

const contactStatusValidator = v.union(
    v.literal("warm"),
    v.literal("active"),
    v.literal("dormant")
);

const fitScoreValidator = v.union(
    v.literal("1"),
    v.literal("2"),
    v.literal("3"),
    v.literal("4"),
    v.literal("5")
);

const stuckAreaValidator = v.union(
    v.literal("speed"),
    v.literal("distribution"),
    v.literal("tech"),
    v.literal("design"),
    v.literal("monetization")
);

const interactionTypeValidator = v.union(
    v.literal("dm"),
    v.literal("email"),
    v.literal("call"),
    v.literal("comment"),
    v.literal("collab")
);

const decisionMakerValidator = v.union(
    v.literal("yes"),
    v.literal("influencer"),
    v.literal("no")
);

const communicationPrefValidator = v.union(
    v.literal("dm"),
    v.literal("email"),
    v.literal("async")
);

const socialProfileValidator = v.object({
    platform: v.string(),
    url: v.string(),
    username: v.string(),
    isPrimary: v.optional(v.boolean()),
});

const companyValidator = v.object({
    name: v.string(),
    role: v.string(),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
});

const activeLaunchValidator = v.object({
    active: v.boolean(),
    url: v.optional(v.string()),
    name: v.optional(v.string()),
});

const enrichmentStatusValidator = v.union(
    v.literal("pending"),
    v.literal("enriched"),
    v.literal("failed")
);

// ==========================================
// QUERIES
// ==========================================

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
    args: { status: enrichmentStatusValidator },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contacts")
            .withIndex("by_status", (q) => q.eq("status", args.status))
            .collect();
    },
});

// Get contacts by relationship type
export const getByRelationshipType = query({
    args: { relationshipType: relationshipTypeValidator },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contacts")
            .withIndex("by_relationship_type", (q) => q.eq("relationshipType", args.relationshipType))
            .collect();
    },
});

// Get contacts by contact status (warm/active/dormant)
export const getByContactStatus = query({
    args: { contactStatus: contactStatusValidator },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("contacts")
            .withIndex("by_contact_status", (q) => q.eq("contactStatus", args.contactStatus))
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
                c.company.name.toLowerCase().includes(q) ||
                (c.preferredName?.toLowerCase().includes(q) ?? false)
        );
    },
});

// ==========================================
// MUTATIONS
// ==========================================

// Create contact (minimal - for initial dossier creation)
export const create = mutation({
    args: {
        // Required
        name: v.string(),
        email: v.string(),
        company: companyValidator,
        socialProfiles: v.array(socialProfileValidator),
        recentActivity: v.array(v.string()),
        status: enrichmentStatusValidator,
        // Optional identity
        preferredName: v.optional(v.string()),
        avatar: v.optional(v.string()),
        location: v.optional(v.string()),
        timezone: v.optional(v.string()),
        relationshipType: v.optional(relationshipTypeValidator),
        firstTouchSource: v.optional(v.string()),
        // Optional social
        website: v.optional(v.string()),
        primaryPlatform: v.optional(v.string()),
        newsletter: v.optional(v.string()),
        github: v.optional(v.string()),
        // Optional credibility
        bio: v.optional(v.string()),
        previousRoles: v.optional(v.array(v.string())),
        productsBuilt: v.optional(v.array(v.string())),
        audienceSize: v.optional(v.string()),
        notableLogos: v.optional(v.array(v.string())),
        // Optional focus
        currentProjects: v.optional(v.array(v.string())),
        activeLaunch: v.optional(activeLaunchValidator),
        publicProblems: v.optional(v.array(v.string())),
        statedGoals: v.optional(v.array(v.string())),
        // Optional pain points
        statedPainPoints: v.optional(v.array(v.string())),
        inferredPainPoints: v.optional(v.array(v.string())),
        stuckAreas: v.optional(v.array(stuckAreaValidator)),
        knownTools: v.optional(v.array(v.string())),
        // Optional relationship
        firstInteractionDate: v.optional(v.string()),
        lastInteractionDate: v.optional(v.string()),
        interactionTypes: v.optional(v.array(interactionTypeValidator)),
        conversationNotes: v.optional(v.string()),
        personalContext: v.optional(v.string()),
        // Optional fit
        relevantOffers: v.optional(v.array(v.string())),
        fitScore: v.optional(fitScoreValidator),
        buyingSignals: v.optional(v.array(v.string())),
        objections: v.optional(v.array(v.string())),
        // Optional next action
        nextStep: v.optional(v.string()),
        followUpDate: v.optional(v.string()),
        followUpNote: v.optional(v.string()),
        contactStatus: v.optional(contactStatusValidator),
        // Optional power fields
        isDecisionMaker: v.optional(decisionMakerValidator),
        budgetRange: v.optional(v.string()),
        timelineUrgency: v.optional(v.string()),
        communicationPreference: v.optional(communicationPrefValidator),
        // System
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

// Update contact (all fields optional except id)
export const update = mutation({
    args: {
        id: v.id("contacts"),
        // Identity
        name: v.optional(v.string()),
        preferredName: v.optional(v.string()),
        email: v.optional(v.string()),
        avatar: v.optional(v.string()),
        location: v.optional(v.string()),
        timezone: v.optional(v.string()),
        relationshipType: v.optional(relationshipTypeValidator),
        firstTouchSource: v.optional(v.string()),
        // Social
        website: v.optional(v.string()),
        primaryPlatform: v.optional(v.string()),
        socialProfiles: v.optional(v.array(socialProfileValidator)),
        newsletter: v.optional(v.string()),
        github: v.optional(v.string()),
        // Credibility
        company: v.optional(companyValidator),
        bio: v.optional(v.string()),
        previousRoles: v.optional(v.array(v.string())),
        productsBuilt: v.optional(v.array(v.string())),
        audienceSize: v.optional(v.string()),
        notableLogos: v.optional(v.array(v.string())),
        // Focus
        currentProjects: v.optional(v.array(v.string())),
        activeLaunch: v.optional(activeLaunchValidator),
        publicProblems: v.optional(v.array(v.string())),
        statedGoals: v.optional(v.array(v.string())),
        recentActivity: v.optional(v.array(v.string())),
        // Pain points
        statedPainPoints: v.optional(v.array(v.string())),
        inferredPainPoints: v.optional(v.array(v.string())),
        stuckAreas: v.optional(v.array(stuckAreaValidator)),
        knownTools: v.optional(v.array(v.string())),
        // Relationship
        firstInteractionDate: v.optional(v.string()),
        lastInteractionDate: v.optional(v.string()),
        interactionTypes: v.optional(v.array(interactionTypeValidator)),
        conversationNotes: v.optional(v.string()),
        personalContext: v.optional(v.string()),
        // Fit
        relevantOffers: v.optional(v.array(v.string())),
        fitScore: v.optional(fitScoreValidator),
        buyingSignals: v.optional(v.array(v.string())),
        objections: v.optional(v.array(v.string())),
        // Next action
        nextStep: v.optional(v.string()),
        followUpDate: v.optional(v.string()),
        followUpNote: v.optional(v.string()),
        contactStatus: v.optional(contactStatusValidator),
        // Power fields
        isDecisionMaker: v.optional(decisionMakerValidator),
        budgetRange: v.optional(v.string()),
        timelineUrgency: v.optional(v.string()),
        communicationPreference: v.optional(communicationPrefValidator),
        // System
        status: v.optional(enrichmentStatusValidator),
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
            nextStep: undefined,
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
