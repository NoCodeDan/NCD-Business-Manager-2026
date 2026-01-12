"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Types
export interface Client {
    _id: Id<"clients">;
    name: string;
    company: string;
    email: string;
    projectType: string;
    status: "active" | "completed" | "prospect" | "churned";
    value?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useClients() {
    return useQuery(api.clients.getAll);
}

export function useClient(id: Id<"clients"> | undefined) {
    return useQuery(api.clients.getById, id ? { id } : "skip");
}

export function useClientsByStatus(status: Client["status"] | undefined) {
    return useQuery(api.clients.getByStatus, status ? { status } : "skip");
}

export function useActiveClients() {
    return useQuery(api.clients.getActive);
}

export function useSearchClients(query: string) {
    return useQuery(api.clients.search, query.length > 0 ? { query } : "skip");
}

export function useTotalClientValue() {
    return useQuery(api.clients.getTotalValue);
}

// Mutations
export function useCreateClient() {
    return useMutation(api.clients.create);
}

export function useUpdateClient() {
    return useMutation(api.clients.update);
}

export function useDeleteClient() {
    return useMutation(api.clients.remove);
}
