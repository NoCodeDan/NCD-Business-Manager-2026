'use client';

import Link from 'next/link';

const contentModules = [
    {
        href: '/content/brainstorm',
        title: 'Brainstorm',
        description: 'Capture ideas quickly with sticky notes and rapid ideation tools',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        color: 'var(--color-accent-warning)', // #f59e0b
        stats: '12 ideas this week',
    },
    {
        href: '/content/ideas',
        title: 'Stored Ideas',
        description: 'Browse and organize your saved content ideas by category and status',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
            </svg>
        ),
        color: 'var(--color-accent-primary)', // #6366f1
        stats: '47 ideas saved',
    },
    {
        href: '/content/repurpose',
        title: 'Repurpose',
        description: 'Transform content into blogs, scripts, threads, and more formats',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m8 11 4 4 4-4" />
                <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
            </svg>
        ),
        color: 'var(--color-accent-secondary)', // #8b5cf6
        stats: '5 formats available',
    },
    {
        href: '/content/schedule',
        title: 'Schedule',
        description: 'Plan and schedule your content calendar across all platforms',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="m9 16 2 2 4-4" />
            </svg>
        ),
        color: 'var(--color-accent-success)', // #10b981
        stats: '8 scheduled this month',
    },
];

const recentActivity = [
    { action: 'Created idea', item: 'AI Tools Comparison Video', time: '2 hours ago' },
    { action: 'Scheduled', item: 'Weekly Newsletter #12', time: '5 hours ago' },
    { action: 'Repurposed', item: 'Productivity Tips → Thread', time: '1 day ago' },
    { action: 'Published', item: 'No-Code Tutorial Blog', time: '2 days ago' },
];

export default function ContentPage() {
    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Creation</h1>
                    <p className="page-subtitle">Your hub for brainstorming, creating, and scheduling content</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <div className="stat-label">Total Ideas</div>
                    <div className="stat-value">47</div>
                    <div className="stat-change positive">+12 this week</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Scheduled</div>
                    <div className="stat-value">8</div>
                    <div className="stat-change positive">4 this week</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Published</div>
                    <div className="stat-value">23</div>
                    <div className="stat-change positive">+3 this month</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Repurposed</div>
                    <div className="stat-value">15</div>
                    <div className="stat-change positive">5 formats used</div>
                </div>
            </div>

            {/* Module Navigation Cards */}
            <div className="grid grid-2 mb-6">
                {contentModules.map((module) => (
                    <Link
                        key={module.href}
                        href={module.href}
                        className="content-hub-card"
                        style={{ '--card-accent': module.color } as React.CSSProperties}
                    >
                        <div className="content-hub-card-icon">
                            {module.icon}
                        </div>
                        <div className="content-hub-card-content">
                            <h3 className="content-hub-card-title">{module.title}</h3>
                            <p className="content-hub-card-description">{module.description}</p>
                            <span className="content-hub-card-stats">{module.stats}</span>
                        </div>
                        <div className="content-hub-card-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 className="card-title mb-4">Recent Activity</h3>
                <div className="activity-list">
                    {recentActivity.map((item, idx) => (
                        <div key={idx} className="activity-item">
                            <div className="activity-dot" />
                            <div className="activity-content">
                                <span className="activity-action">{item.action}</span>
                                <span className="activity-item-name">{item.item}</span>
                            </div>
                            <span className="activity-time">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
