"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Types
export interface BrandPartner {
    _id: Id<"brandPartners">;
    name: string;
    website: string;
    logo?: string;
    partnerType: "strategic" | "affiliate" | "referral" | "integration";
    status: "active" | "inactive" | "pending";
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BrandPartnerWithContacts extends BrandPartner {
    contacts: Array<{
        _id: Id<"contacts">;
        name: string;
        email: string;
        bio?: string;
        location?: string;
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
        status: "pending" | "enriched" | "failed";
        brandPartnerId?: Id<"brandPartners">;
    }>;
}

// Queries
export function useBrandPartners() {
    return useQuery(api.brandPartners.getAll);
}

export function useBrandPartner(id: Id<"brandPartners"> | undefined) {
    return useQuery(api.brandPartners.getById, id ? { id } : "skip");
}

export function useBrandPartnersByStatus(status: BrandPartner["status"] | undefined) {
    return useQuery(api.brandPartners.getByStatus, status ? { status } : "skip");
}

export function useActiveBrandPartners() {
    return useQuery(api.brandPartners.getActive);
}

export function useBrandPartnerWithContacts(id: Id<"brandPartners"> | undefined) {
    return useQuery(api.brandPartners.getWithContacts, id ? { id } : "skip");
}

export function useBrandPartnersWithContacts() {
    return useQuery(api.brandPartners.getAllWithContacts);
}

// Mutations
export function useCreateBrandPartner() {
    return useMutation(api.brandPartners.create);
}

export function useUpdateBrandPartner() {
    return useMutation(api.brandPartners.update);
}

export function useDeleteBrandPartner() {
    return useMutation(api.brandPartners.remove);
}
