"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Types - Enhanced Dossier Format
export type RelationshipType = "lead" | "client" | "partner" | "collaborator" | "creator" | "investor";
export type ContactStatus = "warm" | "active" | "dormant";
export type FitScore = "1" | "2" | "3" | "4" | "5";
export type StuckArea = "speed" | "distribution" | "tech" | "design" | "monetization";
export type InteractionType = "dm" | "email" | "call" | "comment" | "collab";
export type DecisionMaker = "yes" | "influencer" | "no";
export type CommunicationPref = "dm" | "email" | "async";

export interface Contact {
    _id: Id<"contacts">;

    // Section 1: Identity & Context
    name: string;
    preferredName?: string;
    email: string;
    avatar?: string;
    location?: string;
    timezone?: string;
    relationshipType?: RelationshipType;
    firstTouchSource?: string;

    // Section 2: Social & Online Presence
    website?: string;
    primaryPlatform?: string;
    socialProfiles: Array<{
        platform: string;
        url: string;
        username: string;
        isPrimary?: boolean;
    }>;
    newsletter?: string;
    github?: string;

    // Section 3: Work & Credibility
    company: {
        name: string;
        role: string;
        website?: string;
        industry?: string;
        description?: string;
    };
    bio?: string;
    previousRoles?: string[];
    productsBuilt?: string[];
    audienceSize?: string;
    notableLogos?: string[];

    // Section 4: Current Focus
    currentProjects?: string[];
    activeLaunch?: {
        active: boolean;
        url?: string;
        name?: string;
    };
    publicProblems?: string[];
    statedGoals?: string[];
    recentActivity: string[];

    // Section 5: Pain Points
    statedPainPoints?: string[];
    inferredPainPoints?: string[];
    stuckAreas?: StuckArea[];
    knownTools?: string[];

    // Section 6: Relationship History
    firstInteractionDate?: string;
    lastInteractionDate?: string;
    interactionTypes?: InteractionType[];
    conversationNotes?: string;
    personalContext?: string;

    // Section 7: Fit & Offers
    relevantOffers?: string[];
    fitScore?: FitScore;
    buyingSignals?: string[];
    objections?: string[];

    // Section 8: Next Action
    nextStep?: string;
    followUpDate?: string;
    followUpNote?: string;
    contactStatus?: ContactStatus;

    // Power Fields
    isDecisionMaker?: DecisionMaker;
    budgetRange?: string;
    timelineUrgency?: string;
    communicationPreference?: CommunicationPref;

    // System Fields
    status: "pending" | "enriched" | "failed";
    brandPartnerId?: Id<"brandPartners">;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useContacts() {
    return useQuery(api.contacts.getAll);
}

export function useContact(id: Id<"contacts"> | undefined) {
    return useQuery(api.contacts.getById, id ? { id } : "skip");
}

export function useContactsByStatus(status: Contact["status"] | undefined) {
    return useQuery(api.contacts.getByStatus, status ? { status } : "skip");
}

export function useContactsByBrandPartner(brandPartnerId: Id<"brandPartners"> | undefined) {
    return useQuery(api.contacts.getByBrandPartner, brandPartnerId ? { brandPartnerId } : "skip");
}

export function useContactsNeedingFollowUp() {
    return useQuery(api.contacts.getFollowUps);
}

export function useSearchContacts(query: string) {
    return useQuery(api.contacts.search, query.length > 0 ? { query } : "skip");
}

// Mutations
export function useCreateContact() {
    return useMutation(api.contacts.create);
}

export function useUpdateContact() {
    return useMutation(api.contacts.update);
}

export function useClearFollowUp() {
    return useMutation(api.contacts.clearFollowUp);
}

export function useDeleteContact() {
    return useMutation(api.contacts.remove);
}

// Enrichment hook using Firecrawl API
export function useEnrichContact() {
    const updateContact = useUpdateContact();

    const enrichContact = async (contactId: Id<"contacts">, email: string) => {
        try {
            const response = await fetch('/api/enrich-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contactId }),
            });

            const data = await response.json();

            if (!response.ok) {
                await updateContact({
                    id: contactId,
                    status: 'failed',
                });
                throw new Error(data.error || 'Enrichment failed');
            }

            // Update contact with all enriched dossier data
            await updateContact({
                id: contactId,
                // Identity
                name: data.name || undefined,
                bio: data.bio || undefined,
                location: data.location || undefined,
                timezone: data.timezone || undefined,
                avatar: data.avatar || undefined,
                // Company
                company: data.company,
                // Social
                website: data.website || undefined,
                primaryPlatform: data.primaryPlatform || undefined,
                socialProfiles: data.socialProfiles,
                newsletter: data.newsletter || undefined,
                github: data.github || undefined,
                // Credibility
                previousRoles: data.previousRoles?.length ? data.previousRoles : undefined,
                productsBuilt: data.productsBuilt?.length ? data.productsBuilt : undefined,
                audienceSize: data.audienceSize || undefined,
                notableLogos: data.notableLogos?.length ? data.notableLogos : undefined,
                // Focus
                currentProjects: data.currentProjects?.length ? data.currentProjects : undefined,
                activeLaunch: data.activeLaunch || undefined,
                publicProblems: data.publicProblems?.length ? data.publicProblems : undefined,
                statedGoals: data.statedGoals?.length ? data.statedGoals : undefined,
                recentActivity: data.recentActivity || [],
                // Tools
                knownTools: data.knownTools?.length ? data.knownTools : undefined,
                // System
                status: 'enriched',
            });

            return data;
        } catch (error) {
            console.error('Enrichment error:', error);
            throw error;
        }
    };

    return enrichContact;
}
