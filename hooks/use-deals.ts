'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export type DealStatus = 'lead' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type BusinessArea = 'tangible-ideas' | 'no-code-effect' | 'adalo' | 'no-code-dan' | 'other';

export interface Deal {
    _id: Id<"deals">;
    name: string;
    client: string;
    amount: number;
    status: DealStatus;
    businessArea: BusinessArea;
    probability?: number;
    expectedCloseDate?: string;
    closedDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useDeals() {
    return useQuery(api.deals.get);
}

export function useDeal(id: Id<"deals"> | undefined) {
    return useQuery(api.deals.getById, id ? { id } : "skip");
}

export function useDealsByStatus(status: DealStatus) {
    return useQuery(api.deals.getByStatus, { status });
}

export function useWonDeals() {
    return useQuery(api.deals.getWonDeals);
}

export function useDealsPipeline() {
    return useQuery(api.deals.getPipeline);
}

export function useDealsByBusinessArea(businessArea: BusinessArea) {
    return useQuery(api.deals.getByBusinessArea, { businessArea });
}

export function useDealsSummary() {
    return useQuery(api.deals.getSummary);
}

// Mutations
export function useCreateDeal() {
    return useMutation(api.deals.create);
}

export function useUpdateDeal() {
    return useMutation(api.deals.update);
}

export function useRemoveDeal() {
    return useMutation(api.deals.remove);
}

export function useMarkDealAsWon() {
    return useMutation(api.deals.markAsWon);
}

export function useMarkDealAsLost() {
    return useMutation(api.deals.markAsLost);
}
