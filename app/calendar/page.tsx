'use client';

import { useState, useMemo } from 'react';

// Mock data for two Google accounts
const ACCOUNTS = [
    { id: 'gfamceo', email: 'gfamceo@gmail.com', color: '#6366f1', name: 'GFAM CEO' },
    { id: 'nocodedan', email: 'dan@nocodedan.com', color: '#22c55e', name: 'No-Code Dan' },
];

// Mock events
const MOCK_EVENTS = [
    {
        id: '1',
        title: 'Team Standup',
        start: new Date(2026, 0, 12, 9, 0),
        end: new Date(2026, 0, 12, 9, 30),
        accountId: 'gfamceo',
    },
    {
        id: '2',
        title: 'Client Call - ACME Corp',
        start: new Date(2026, 0, 12, 14, 0),
        end: new Date(2026, 0, 12, 15, 0),
        accountId: 'nocodedan',
    },
    {
        id: '3',
        title: 'Product Review',
        start: new Date(2026, 0, 13, 11, 0),
        end: new Date(2026, 0, 13, 12, 0),
        accountId: 'gfamceo',
    },
    {
        id: '4',
        title: 'Content Planning',
        start: new Date(2026, 0, 14, 10, 0),
        end: new Date(2026, 0, 14, 11, 30),
        accountId: 'nocodedan',
    },
    {
        id: '5',
        title: 'Weekly Review',
        start: new Date(2026, 0, 17, 16, 0),
        end: new Date(2026, 0, 17, 17, 0),
        accountId: 'gfamceo',
    },
    {
        id: '6',
        title: 'Investor Meeting',
        start: new Date(2026, 0, 15, 13, 0),
        end: new Date(2026, 0, 15, 14, 0),
        accountId: 'gfamceo',
    },
    {
        id: '7',
        title: 'Podcast Recording',
        start: new Date(2026, 0, 16, 15, 0),
        end: new Date(2026, 0, 16, 16, 30),
        accountId: 'nocodedan',
    },
    {
        id: '8',
        title: 'Q1 Planning',
        start: new Date(2026, 0, 20, 9, 0),
        end: new Date(2026, 0, 20, 12, 0),
        accountId: 'gfamceo',
    },
];

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 11)); // Jan 11, 2026
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [activeAccounts, setActiveAccounts] = useState<string[]>(['gfamceo', 'nocodedan']);
    const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);

    // Filter events by active accounts
    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => activeAccounts.includes(event.accountId));
    }, [activeAccounts]);

    // Get days for month view
    const monthDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days: (Date | null)[] = [];

        // Add padding for days before month starts
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add actual days
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    }, [currentDate]);

    // Get events for a specific day
    const getEventsForDay = (date: Date) => {
        return filteredEvents.filter(event => {
            const eventDate = event.start;
            return (
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
            );
        });
    };

    // Navigation
    const navigate = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (viewMode === 'month') {
                newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            } else if (viewMode === 'week') {
                newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
            } else {
                newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date(2026, 0, 11)); // Mock "today"
    };

    const toggleAccount = (accountId: string) => {
        setActiveAccounts(prev =>
            prev.includes(accountId)
                ? prev.filter(id => id !== accountId)
                : [...prev, accountId]
        );
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const getAccountColor = (accountId: string) => {
        return ACCOUNTS.find(a => a.id === accountId)?.color || '#64748b';
    };

    const isToday = (date: Date) => {
        const today = new Date(2026, 0, 11); // Mock today
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendar</h1>
                    <p className="page-subtitle">View and manage your schedule across accounts</p>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="card mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Navigation */}
                    <div className="flex items-center gap-3">
                        <button className="btn btn-secondary" onClick={() => navigate('prev')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button className="btn btn-secondary" onClick={goToToday}>
                            Today
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('next')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginLeft: 'var(--space-2)' }}>
                            {currentDate.toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </h2>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                className={`btn ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setViewMode(mode)}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 280px', gap: 'var(--space-6)' }}>
                {/* Calendar Grid */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    {/* Day Headers */}
                    <div className="calendar-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="calendar-header-cell">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Month Grid */}
                    <div className="calendar-grid">
                        {monthDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`calendar-cell ${day ? '' : 'calendar-cell-empty'} ${day && isToday(day) ? 'calendar-cell-today' : ''}`}
                            >
                                {day && (
                                    <>
                                        <span className={`calendar-date ${isToday(day) ? 'calendar-date-today' : ''}`}>
                                            {day.getDate()}
                                        </span>
                                        <div className="calendar-events">
                                            {getEventsForDay(day).slice(0, 3).map(event => (
                                                <button
                                                    key={event.id}
                                                    className="calendar-event"
                                                    style={{
                                                        '--event-color': getAccountColor(event.accountId),
                                                    } as React.CSSProperties}
                                                    onClick={() => setSelectedEvent(event)}
                                                >
                                                    <span className="calendar-event-dot" />
                                                    <span className="calendar-event-title">{event.title}</span>
                                                </button>
                                            ))}
                                            {getEventsForDay(day).length > 3 && (
                                                <span className="calendar-more">
                                                    +{getEventsForDay(day).length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                    {/* Connected Accounts */}
                    <div className="card">
                        <h3 className="card-title mb-4">Connected Accounts</h3>
                        <div className="flex flex-col gap-3">
                            {ACCOUNTS.map(account => (
                                <button
                                    key={account.id}
                                    className={`account-toggle ${activeAccounts.includes(account.id) ? 'active' : ''}`}
                                    onClick={() => toggleAccount(account.id)}
                                    style={{
                                        '--account-color': account.color,
                                    } as React.CSSProperties}
                                >
                                    <div className="account-toggle-indicator" />
                                    <div className="account-toggle-info">
                                        <span className="account-toggle-name">{account.name}</span>
                                        <span className="account-toggle-email">{account.email}</span>
                                    </div>
                                    <div className="account-toggle-check">
                                        {activeAccounts.includes(account.id) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button className="btn btn-secondary mt-4" style={{ width: '100%' }} disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Connect Account
                        </button>
                        <p className="text-sm text-muted mt-2" style={{ textAlign: 'center' }}>
                            Backend setup required
                        </p>
                    </div>

                    {/* Upcoming Events */}
                    <div className="card">
                        <h3 className="card-title mb-4">Upcoming Events</h3>
                        <div className="flex flex-col gap-3">
                            {filteredEvents
                                .filter(e => e.start >= new Date(2026, 0, 11))
                                .sort((a, b) => a.start.getTime() - b.start.getTime())
                                .slice(0, 5)
                                .map(event => (
                                    <button
                                        key={event.id}
                                        className="upcoming-event"
                                        onClick={() => setSelectedEvent(event)}
                                        style={{
                                            '--event-color': getAccountColor(event.accountId),
                                        } as React.CSSProperties}
                                    >
                                        <div className="upcoming-event-indicator" />
                                        <div className="upcoming-event-info">
                                            <span className="upcoming-event-title">{event.title}</span>
                                            <span className="upcoming-event-time">
                                                {event.start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {formatTime(event.start)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedEvent.title}</h3>
                            <button className="btn-icon" onClick={() => setSelectedEvent(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: 'var(--radius-full)',
                                        background: getAccountColor(selectedEvent.accountId),
                                    }}
                                />
                                <span className="text-muted">
                                    {ACCOUNTS.find(a => a.id === selectedEvent.accountId)?.email}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-secondary)' }}>
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    <span>
                                        {selectedEvent.start.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-secondary)' }}>
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>
                                        {formatTime(selectedEvent.start)} — {formatTime(selectedEvent.end)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
