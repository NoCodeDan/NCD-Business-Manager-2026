'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type BusinessArea = 'tangible-ideas' | 'no-code-effect' | 'adalo' | 'no-code-dan' | 'other';

export interface Invoice {
    _id: Id<"invoices">;
    invoiceNumber: string;
    client: string;
    amount: number;
    status: InvoiceStatus;
    businessArea: BusinessArea;
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    description?: string;
    dealId?: Id<"deals">;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useInvoices() {
    return useQuery(api.invoices.get);
}

export function useInvoice(id: Id<"invoices"> | undefined) {
    return useQuery(api.invoices.getById, id ? { id } : "skip");
}

export function useInvoicesByStatus(status: InvoiceStatus) {
    return useQuery(api.invoices.getByStatus, { status });
}

export function usePaidInvoices() {
    return useQuery(api.invoices.getPaidInvoices);
}

export function usePendingInvoices() {
    return useQuery(api.invoices.getPendingInvoices);
}

export function useInvoicesByBusinessArea(businessArea: BusinessArea) {
    return useQuery(api.invoices.getByBusinessArea, { businessArea });
}

export function useInvoicesSummary() {
    return useQuery(api.invoices.getSummary);
}

// Mutations
export function useCreateInvoice() {
    return useMutation(api.invoices.create);
}

export function useUpdateInvoice() {
    return useMutation(api.invoices.update);
}

export function useRemoveInvoice() {
    return useMutation(api.invoices.remove);
}

export function useMarkInvoiceAsPaid() {
    return useMutation(api.invoices.markAsPaid);
}

export function useMarkInvoiceAsSent() {
    return useMutation(api.invoices.markAsSent);
}

export function useCheckOverdueInvoices() {
    return useMutation(api.invoices.checkOverdue);
}
