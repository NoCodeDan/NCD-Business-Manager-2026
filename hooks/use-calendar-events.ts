'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export interface CalendarEvent {
    _id: Id<"calendarEvents">;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    location?: string;
    color?: string;
    source: "manual" | "google" | "imported";
    externalId?: string;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useCalendarEvents() {
    return useQuery(api.calendarEvents.get);
}

export function useUpcomingEvents() {
    return useQuery(api.calendarEvents.getUpcoming);
}

export function useTodayEvents() {
    return useQuery(api.calendarEvents.getToday);
}

export function useEventsByDateRange(startDate: string, endDate: string) {
    return useQuery(api.calendarEvents.getByDateRange, { startDate, endDate });
}

// Mutations
export function useCreateCalendarEvent() {
    return useMutation(api.calendarEvents.create);
}

export function useUpdateCalendarEvent() {
    return useMutation(api.calendarEvents.update);
}

export function useRemoveCalendarEvent() {
    return useMutation(api.calendarEvents.remove);
}
