'use client';

import { useState, useMemo } from 'react';

interface ScheduledContent {
    id: string;
    title: string;
    platform: string;
    date: Date;
    time: string;
    status: 'scheduled' | 'published' | 'draft';
}

const PLATFORMS = [
    { id: 'blog', name: 'Blog', color: '#6366f1' },
    { id: 'youtube', name: 'YouTube', color: '#ef4444' },
    { id: 'tiktok', name: 'TikTok', color: '#06b6d4' },
    { id: 'twitter', name: 'Twitter/X', color: '#1d9bf0' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2' },
    { id: 'newsletter', name: 'Newsletter', color: '#f59e0b' },
];

const MOCK_SCHEDULED: ScheduledContent[] = [
    { id: '1', title: 'AI Tools Comparison Video', platform: 'youtube', date: new Date(2026, 0, 14), time: '10:00 AM', status: 'scheduled' },
    { id: '2', title: 'Weekly Newsletter #12', platform: 'newsletter', date: new Date(2026, 0, 12), time: '9:00 AM', status: 'scheduled' },
    { id: '3', title: 'Productivity Tips Thread', platform: 'twitter', date: new Date(2026, 0, 15), time: '2:00 PM', status: 'scheduled' },
    { id: '4', title: 'No-Code Tutorial', platform: 'blog', date: new Date(2026, 0, 13), time: '8:00 AM', status: 'scheduled' },
    { id: '5', title: '60-sec Keyboard Shortcuts', platform: 'tiktok', date: new Date(2026, 0, 16), time: '6:00 PM', status: 'draft' },
    { id: '6', title: 'Building in Public Update', platform: 'linkedin', date: new Date(2026, 0, 17), time: '11:00 AM', status: 'scheduled' },
    { id: '7', title: 'Tech Stack Breakdown', platform: 'blog', date: new Date(2026, 0, 20), time: '9:00 AM', status: 'draft' },
];

const UNSCHEDULED = [
    { id: 'u1', title: 'Behind the Scenes Video', platform: 'youtube' },
    { id: 'u2', title: 'Tool Review: Cursor AI', platform: 'blog' },
    { id: 'u3', title: 'Hot Take Thread', platform: 'twitter' },
];

type ViewMode = 'month' | 'week';

export default function SchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 11));
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null);
    const [activePlatforms, setActivePlatforms] = useState<string[]>(PLATFORMS.map(p => p.id));

    const scheduled = MOCK_SCHEDULED.filter(c => activePlatforms.includes(c.platform));

    const monthDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days: (Date | null)[] = [];

        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    }, [currentDate]);

    const getContentForDay = (date: Date) => {
        return scheduled.filter(c => {
            return (
                c.date.getFullYear() === date.getFullYear() &&
                c.date.getMonth() === date.getMonth() &&
                c.date.getDate() === date.getDate()
            );
        });
    };

    const getPlatformColor = (platformId: string) => {
        return PLATFORMS.find(p => p.id === platformId)?.color || '#64748b';
    };

    const getPlatformName = (platformId: string) => {
        return PLATFORMS.find(p => p.id === platformId)?.name || platformId;
    };

    const navigate = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (viewMode === 'month') {
                newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            } else {
                newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date(2026, 0, 11));
    };

    const isToday = (date: Date) => {
        const today = new Date(2026, 0, 11);
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const togglePlatform = (platformId: string) => {
        setActivePlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Schedule</h1>
                    <p className="page-subtitle">Plan and manage your content calendar</p>
                </div>
                <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Schedule Content
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="card mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
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
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {(['month', 'week'] as ViewMode[]).map(mode => (
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

            <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)' }}>
                {/* Calendar Grid */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="calendar-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="calendar-header-cell">
                                {day}
                            </div>
                        ))}
                    </div>
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
                                            {getContentForDay(day).slice(0, 3).map(content => (
                                                <button
                                                    key={content.id}
                                                    className="schedule-item"
                                                    style={{ '--event-color': getPlatformColor(content.platform) } as React.CSSProperties}
                                                    onClick={() => setSelectedContent(content)}
                                                >
                                                    <span className="schedule-item-dot" />
                                                    <span className="schedule-item-title">{content.title}</span>
                                                </button>
                                            ))}
                                            {getContentForDay(day).length > 3 && (
                                                <span className="calendar-more">
                                                    +{getContentForDay(day).length - 3} more
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
                    {/* Platform Filters */}
                    <div className="card">
                        <h3 className="card-title mb-4">Platforms</h3>
                        <div className="flex flex-col gap-3">
                            {PLATFORMS.map(platform => (
                                <button
                                    key={platform.id}
                                    className={`platform-toggle ${activePlatforms.includes(platform.id) ? 'active' : ''}`}
                                    onClick={() => togglePlatform(platform.id)}
                                    style={{ '--platform-color': platform.color } as React.CSSProperties}
                                >
                                    <div className="platform-toggle-indicator" />
                                    <span className="platform-toggle-name">{platform.name}</span>
                                    <div className="platform-toggle-check">
                                        {activePlatforms.includes(platform.id) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="card">
                        <h3 className="card-title mb-4">Upcoming</h3>
                        <div className="flex flex-col gap-3">
                            {scheduled
                                .filter(c => c.date >= new Date(2026, 0, 11) && c.status === 'scheduled')
                                .sort((a, b) => a.date.getTime() - b.date.getTime())
                                .slice(0, 5)
                                .map(content => (
                                    <button
                                        key={content.id}
                                        className="upcoming-content"
                                        onClick={() => setSelectedContent(content)}
                                        style={{ '--event-color': getPlatformColor(content.platform) } as React.CSSProperties}
                                    >
                                        <div className="upcoming-content-indicator" />
                                        <div className="upcoming-content-info">
                                            <span className="upcoming-content-title">{content.title}</span>
                                            <span className="upcoming-content-time">
                                                {content.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {content.time}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Unscheduled Queue */}
                    <div className="card">
                        <h3 className="card-title mb-4">Unscheduled</h3>
                        <div className="flex flex-col gap-3">
                            {UNSCHEDULED.map(item => (
                                <div
                                    key={item.id}
                                    className="unscheduled-item"
                                    style={{ '--event-color': getPlatformColor(item.platform) } as React.CSSProperties}
                                >
                                    <div className="unscheduled-item-indicator" />
                                    <div className="unscheduled-item-info">
                                        <span className="unscheduled-item-title">{item.title}</span>
                                        <span className="unscheduled-item-platform">{getPlatformName(item.platform)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Detail Modal */}
            {selectedContent && (
                <div className="modal-overlay" onClick={() => setSelectedContent(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedContent.title}</h3>
                            <button className="btn-icon" onClick={() => setSelectedContent(null)}>
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
                                        background: getPlatformColor(selectedContent.platform),
                                    }}
                                />
                                <span>{getPlatformName(selectedContent.platform)}</span>
                                <span className={`badge ${selectedContent.status === 'scheduled' ? 'badge-success' : 'badge-warning'}`}>
                                    {selectedContent.status}
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
                                        {selectedContent.date.toLocaleDateString('en-US', {
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
                                    <span>{selectedContent.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary">Edit</button>
                            <button className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2 11 13" />
                                    <path d="m22 2-7 20-4-9-9-4 20-7z" />
                                </svg>
                                Publish Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
