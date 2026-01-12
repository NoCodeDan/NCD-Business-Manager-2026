"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Types
export interface Contact {
    _id: Id<"contacts">;
    name: string;
    email: string;
    bio?: string;
    location?: string;
    avatar?: string;
    company: {
        name: string;
        role: string;
        website?: string;
        industry?: string;
    };
    socialProfiles: Array<{
        platform: string;
        url: string;
        username: string;
    }>;
    recentActivity: string[];
    status: "pending" | "enriched" | "failed";
    followUpDate?: string;
    followUpNote?: string;
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
