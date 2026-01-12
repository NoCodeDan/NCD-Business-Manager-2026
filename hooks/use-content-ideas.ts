'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export interface ContentIdea {
    _id: Id<"contentIdeas">;
    title: string;
    description?: string;
    type: "blog" | "youtube" | "short-form" | "twitter" | "linkedin" | "newsletter" | "other";
    status: "brainstorm" | "researching" | "outlined" | "drafted" | "published" | "archived";
    priority?: "low" | "medium" | "high";
    tags: string[];
    notes?: string;
    targetDate?: string;
    publishedUrl?: string;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useContentIdeas() {
    return useQuery(api.contentIdeas.get);
}

export function useActiveContentIdeas() {
    return useQuery(api.contentIdeas.getActive);
}

export function useContentIdeasByStatus(status: ContentIdea['status']) {
    return useQuery(api.contentIdeas.getByStatus, { status });
}

export function useContentIdeasByType(type: ContentIdea['type']) {
    return useQuery(api.contentIdeas.getByType, { type });
}

// Mutations
export function useCreateContentIdea() {
    return useMutation(api.contentIdeas.create);
}

export function useUpdateContentIdea() {
    return useMutation(api.contentIdeas.update);
}

export function useRemoveContentIdea() {
    return useMutation(api.contentIdeas.remove);
}
