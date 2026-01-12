'use client';

import { useMemo } from 'react';
import Link from 'next/link';

// Types for agenda items from different sources
interface AgendaItem {
    id: string;
    type: 'task' | 'crm' | 'calendar' | 'renewal';
    title: string;
    description?: string;
    dueDate: Date;
    link?: string;
    color?: string;
    urgent?: boolean;
}

// Mock CRM contacts with follow-ups (simplified from CRM page)
const CRM_FOLLOWUPS = [
    {
        id: 'crm-1',
        name: 'Sarah Chen',
        note: 'Follow up on partnership discussion',
        followUpDate: new Date(2026, 0, 11),
    },
    {
        id: 'crm-2',
        name: 'Marcus Johnson',
        note: 'Send pitch deck for review',
        followUpDate: new Date(2026, 0, 13),
    },
    {
        id: 'crm-3',
        name: 'Alex Rivera',
        note: 'Check in about design collaboration',
        followUpDate: new Date(2026, 0, 10),
    },
];

// Mock calendar events
const CALENDAR_EVENTS = [
    { id: 'cal-1', title: 'Team Standup', start: new Date(2026, 0, 12, 9, 0), accountId: 'gfamceo' },
    { id: 'cal-2', title: 'Client Call - ACME Corp', start: new Date(2026, 0, 12, 14, 0), accountId: 'nocodedan' },
    { id: 'cal-3', title: 'Product Review', start: new Date(2026, 0, 13, 11, 0), accountId: 'gfamceo' },
    { id: 'cal-4', title: 'Content Planning', start: new Date(2026, 0, 14, 10, 0), accountId: 'nocodedan' },
    { id: 'cal-5', title: 'Weekly Review', start: new Date(2026, 0, 17, 16, 0), accountId: 'gfamceo' },
];

interface Project {
    id: string;
    name: string;
    color: string;
    tasks: { id: string; title: string; completed: boolean; dueDate?: string }[];
}

interface Expense {
    id: string;
    name: string;
    amount: number;
    renewalDate: string;
}

interface UpcomingAgendaProps {
    projects: Project[];
    upcomingRenewals: Expense[];
}

export function UpcomingAgenda({ projects, upcomingRenewals }: UpcomingAgendaProps) {
    const today = new Date(2026, 0, 11); // Mock today
    today.setHours(0, 0, 0, 0);

    // Aggregate all items into unified agenda
    const agendaItems = useMemo(() => {
        const items: AgendaItem[] = [];

        // Add incomplete tasks with due dates from projects
        projects.forEach(project => {
            project.tasks
                .filter(task => !task.completed && task.dueDate)
                .forEach(task => {
                    items.push({
                        id: `task-${task.id}`,
                        type: 'task',
                        title: task.title,
                        description: project.name,
                        dueDate: new Date(task.dueDate!),
                        link: `/projects/${project.id}`,
                        color: project.color,
                    });
                });
        });

        // Add CRM follow-ups
        CRM_FOLLOWUPS.forEach(contact => {
            items.push({
                id: contact.id,
                type: 'crm',
                title: `Follow up: ${contact.name}`,
                description: contact.note,
                dueDate: contact.followUpDate,
                link: '/crm',
            });
        });

        // Add calendar events
        CALENDAR_EVENTS.forEach(event => {
            items.push({
                id: event.id,
                type: 'calendar',
                title: event.title,
                dueDate: event.start,
                link: '/calendar',
                color: event.accountId === 'gfamceo' ? '#6366f1' : '#22c55e',
            });
        });

        // Add upcoming renewals
        upcomingRenewals.forEach(expense => {
            items.push({
                id: `renewal-${expense.id}`,
                type: 'renewal',
                title: expense.name,
                description: `$${expense.amount.toFixed(2)} renewal`,
                dueDate: new Date(expense.renewalDate),
                link: '/expenses',
            });
        });

        // Filter to next 7 days and sort by date
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        return items
            .filter(item => {
                const itemDate = new Date(item.dueDate);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= new Date(today.getTime() - 86400000) && itemDate <= nextWeek; // Include yesterday (overdue)
            })
            .map(item => {
                const itemDate = new Date(item.dueDate);
                itemDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((itemDate.getTime() - today.getTime()) / 86400000);
                return { ...item, diffDays, urgent: diffDays < 0 || diffDays === 0 };
            })
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    }, [projects, upcomingRenewals]);

    // Group items by relative date
    const groupedItems = useMemo(() => {
        const groups: { label: string; items: (AgendaItem & { diffDays: number })[] }[] = [];

        const overdue = agendaItems.filter(i => i.diffDays < 0);
        const todayItems = agendaItems.filter(i => i.diffDays === 0);
        const tomorrow = agendaItems.filter(i => i.diffDays === 1);
        const thisWeek = agendaItems.filter(i => i.diffDays > 1);

        if (overdue.length) groups.push({ label: 'Overdue', items: overdue });
        if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
        if (tomorrow.length) groups.push({ label: 'Tomorrow', items: tomorrow });
        if (thisWeek.length) groups.push({ label: 'This Week', items: thisWeek });

        return groups;
    }, [agendaItems]);

    const getTypeIcon = (type: AgendaItem['type']) => {
        switch (type) {
            case 'task':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                );
            case 'crm':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                );
            case 'renewal':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 18V6" />
                    </svg>
                );
        }
    };

    const formatTime = (date: Date) => {
        if (date.getHours() === 0 && date.getMinutes() === 0) return '';
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    if (agendaItems.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <div>
                        <h3 className="card-title">Upcoming</h3>
                        <p className="card-description">Your agenda for the next 7 days</p>
                    </div>
                </div>
                <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                    <p className="text-muted">🎉 All caught up!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card upcoming-agenda">
            <div className="card-header">
                <div>
                    <h3 className="card-title">📋 Upcoming</h3>
                    <p className="card-description">{agendaItems.length} items in the next 7 days</p>
                </div>
            </div>
            <div className="upcoming-agenda-content">
                {groupedItems.map(group => (
                    <div key={group.label} className="agenda-group">
                        <div className={`agenda-group-label ${group.label === 'Overdue' ? 'overdue' : ''}`}>
                            {group.label}
                        </div>
                        <div className="agenda-items">
                            {group.items.map(item => (
                                <Link
                                    key={item.id}
                                    href={item.link || '#'}
                                    className={`agenda-item ${item.urgent ? 'urgent' : ''}`}
                                >
                                    <div
                                        className="agenda-item-indicator"
                                        style={{
                                            background: item.color || 'var(--color-accent-primary)',
                                        }}
                                    />
                                    <div className="agenda-item-icon">
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div className="agenda-item-content">
                                        <span className="agenda-item-title">{item.title}</span>
                                        {item.description && (
                                            <span className="agenda-item-desc">{item.description}</span>
                                        )}
                                    </div>
                                    {formatTime(item.dueDate) && (
                                        <span className="agenda-item-time">{formatTime(item.dueDate)}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
