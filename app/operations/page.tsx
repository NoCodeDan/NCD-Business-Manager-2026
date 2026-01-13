'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSOPs } from '@/hooks/use-sops';
import { useActiveICPsByBusiness } from '@/hooks/use-target-icp';
import {
    FileText,
    BookOpen,
    Users,
    ArrowRight,
    FolderOpen,
    Target,
    Lightbulb,
    Flame
} from 'lucide-react';

// GitHub-style contribution graph component
function ContributionGraph() {
    // Generate 52 weeks of mock data (will be replaced with real data from Convex)
    const contributionData = useMemo(() => {
        const weeks: { date: Date; level: number; completed: number; total: number }[][] = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // Go back ~52 weeks

        // Align to start of week (Sunday)
        startDate.setDate(startDate.getDate() - startDate.getDay());

        let currentDate = new Date(startDate);

        for (let week = 0; week < 53; week++) {
            const weekData: { date: Date; level: number; completed: number; total: number }[] = [];
            for (let day = 0; day < 7; day++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const isPast = currentDate <= today;

                // Mock data - simulate completion patterns
                // In production, this would come from a Convex query
                let completed = 0;
                let total = 5; // 5 non-negotiables per day

                if (isPast && currentDate.getDay() !== 0) { // Not Sunday
                    const randomSeed = currentDate.getTime();
                    const pseudoRandom = Math.sin(randomSeed) * 10000;
                    completed = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * 6);

                    // Add some patterns - weekdays higher completion
                    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
                        completed = Math.min(5, completed + 2);
                    }
                }

                let level = 0;
                if (isPast && currentDate.getDay() !== 0) {
                    if (completed === total) level = 4;
                    else if (completed >= 4) level = 3;
                    else if (completed >= 3) level = 2;
                    else if (completed >= 1) level = 1;
                    else level = 0;
                }

                weekData.push({
                    date: new Date(currentDate),
                    level,
                    completed,
                    total,
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(weekData);
        }

        return weeks;
    }, []);

    // Calculate stats
    const stats = useMemo(() => {
        let totalCompleted = 0;
        let perfectDays = 0;
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        const allDays = contributionData.flat().filter(d => d.date <= today && d.date.getDay() !== 0);

        allDays.forEach((day) => {
            totalCompleted += day.completed;
            if (day.completed === day.total) {
                perfectDays++;
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        });

        // Calculate current streak from today backwards
        const reversedDays = [...allDays].reverse();
        for (const day of reversedDays) {
            if (day.completed === day.total) {
                currentStreak++;
            } else {
                break;
            }
        }

        return { totalCompleted, perfectDays, currentStreak, longestStreak };
    }, [contributionData]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    // Get month labels with positions
    const monthLabels = useMemo(() => {
        const labels: { month: string; position: number }[] = [];
        let lastMonth = -1;

        contributionData.forEach((week, weekIndex) => {
            const firstDayOfWeek = week[0].date;
            const month = firstDayOfWeek.getMonth();
            if (month !== lastMonth) {
                labels.push({ month: months[month], position: weekIndex });
                lastMonth = month;
            }
        });

        return labels;
    }, [contributionData]);

    const levelColors = [
        'var(--color-bg-tertiary)',           // 0 - no activity
        'rgba(34, 197, 94, 0.3)',              // 1 - low
        'rgba(34, 197, 94, 0.5)',              // 2 - medium-low
        'rgba(34, 197, 94, 0.7)',              // 3 - medium-high
        'var(--color-accent-success)',         // 4 - high (perfect)
    ];

    const [hoveredDay, setHoveredDay] = useState<{ date: Date; completed: number; total: number } | null>(null);

    return (
        <div
            className="card mb-8"
            style={{ padding: 'var(--space-6)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Flame style={{ width: '24px', height: '24px', color: 'var(--color-accent-success)' }} />
                    <div>
                        <h3 className="text-lg font-semibold">Non-Negotiables Tracker</h3>
                        <p className="text-sm text-muted">Daily habits that drive success</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-success)' }}>
                            {stats.currentStreak}
                        </p>
                        <p className="text-xs text-muted">Current Streak</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{stats.perfectDays}</p>
                        <p className="text-xs text-muted">Perfect Days</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{stats.longestStreak}</p>
                        <p className="text-xs text-muted">Longest Streak</p>
                    </div>
                </div>
            </div>

            {/* Graph Container */}
            <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '800px' }}>
                    {/* Month labels */}
                    <div
                        className="flex"
                        style={{
                            marginLeft: '32px',
                            marginBottom: 'var(--space-1)',
                            position: 'relative',
                            height: '20px',
                        }}
                    >
                        {monthLabels.map((label, i) => (
                            <span
                                key={i}
                                className="text-xs text-muted"
                                style={{
                                    position: 'absolute',
                                    left: `${label.position * 14}px`,
                                }}
                            >
                                {label.month}
                            </span>
                        ))}
                    </div>

                    {/* Graph */}
                    <div className="flex">
                        {/* Day labels */}
                        <div
                            className="flex flex-col"
                            style={{
                                marginRight: 'var(--space-2)',
                                gap: '2px',
                            }}
                        >
                            {days.map((day, i) => (
                                <span
                                    key={i}
                                    className="text-xs text-muted"
                                    style={{
                                        height: '12px',
                                        lineHeight: '12px',
                                        width: '24px',
                                    }}
                                >
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Contribution squares */}
                        <div className="flex" style={{ gap: '3px' }}>
                            {contributionData.map((week, weekIndex) => (
                                <div
                                    key={weekIndex}
                                    className="flex flex-col"
                                    style={{ gap: '3px' }}
                                >
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            onMouseEnter={() => setHoveredDay(day)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            style={{
                                                width: '11px',
                                                height: '11px',
                                                borderRadius: '2px',
                                                background: levelColors[day.level],
                                                cursor: 'pointer',
                                                transition: 'transform 0.1s',
                                            }}
                                            title={`${day.date.toDateString()}: ${day.completed}/${day.total}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div
                        className="flex items-center justify-end gap-2 mt-4"
                        style={{ marginRight: 'var(--space-2)' }}
                    >
                        <span className="text-xs text-muted">Less</span>
                        {levelColors.map((color, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '11px',
                                    height: '11px',
                                    borderRadius: '2px',
                                    background: color,
                                }}
                            />
                        ))}
                        <span className="text-xs text-muted">More</span>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div
                    className="text-sm mt-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    <strong>{hoveredDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                    : {hoveredDay.completed}/{hoveredDay.total} non-negotiables completed
                </div>
            )}
        </div>
    );
}

export default function OperationsPage() {
    const { sops, isLoaded: sopsLoaded } = useSOPs();
    const { activeICPs, groupedByBusiness } = useActiveICPsByBusiness();

    const isLoaded = sopsLoaded && activeICPs !== undefined;

    // Get SOP categories
    const sopCategories = sops.reduce((acc, sop) => {
        acc[sop.category] = (acc[sop.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get ICP counts by business
    const icpCounts = {
        'tangible-ideas': groupedByBusiness?.['tangible-ideas']?.length || 0,
        'no-code-effect': groupedByBusiness?.['no-code-effect']?.length || 0,
        'adalo': groupedByBusiness?.['adalo']?.length || 0,
        'no-code-dan': groupedByBusiness?.['no-code-dan']?.length || 0,
    };
    const totalIcps = Object.values(icpCounts).reduce((sum, count) => sum + count, 0);

    // Playbook modules - using design system accent colors
    const playbookModules = [
        { name: 'Sales', color: 'var(--color-accent-warning)' },
        { name: 'Marketing', color: 'var(--color-accent-primary)' },
        { name: 'Product', color: 'var(--color-accent-secondary)' },
        { name: 'Operations', color: 'var(--color-accent-success)' },
    ];

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Operations</h1>
                    <p className="page-subtitle">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Operations</h1>
                    <p className="page-subtitle">SOPs, playbooks, and target customer profiles to run your business</p>
                </div>
            </div>

            {/* Contribution Graph */}
            <ContributionGraph />

            {/* Main Cards Grid */}
            <div className="grid grid-3 mb-8">
                {/* SOPs Card */}
                <Link
                    href="/sops"
                    className="ops-card-link"
                >
                    <div className="flex items-center justify-between">
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--color-accent-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FileText style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <ArrowRight style={{ width: '20px', height: '20px', color: 'var(--color-text-tertiary)' }} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                            Standard Operating Procedures
                        </h3>
                        <p className="text-sm text-muted">
                            Document and standardize your business processes
                        </p>
                    </div>

                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">Total SOPs</span>
                            <span className="font-semibold">{sops.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted">Categories</span>
                            <span className="font-semibold">{Object.keys(sopCategories).length}</span>
                        </div>
                    </div>

                    {Object.keys(sopCategories).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(sopCategories).slice(0, 3).map(([category, count]) => (
                                <span
                                    key={category}
                                    className="badge"
                                >
                                    {category} ({count})
                                </span>
                            ))}
                            {Object.keys(sopCategories).length > 3 && (
                                <span className="text-xs text-muted">
                                    +{Object.keys(sopCategories).length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </Link>

                {/* Playbook Card */}
                <Link
                    href="/playbook"
                    className="ops-card-link"
                >
                    <div className="flex items-center justify-between">
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--color-accent-success)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <BookOpen style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <ArrowRight style={{ width: '20px', height: '20px', color: 'var(--color-text-tertiary)' }} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                            Playbook
                        </h3>
                        <p className="text-sm text-muted">
                            Strategic guides and frameworks for growth
                        </p>
                    </div>

                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        <span className="text-sm text-muted">Modules</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {playbookModules.map((module) => (
                                <div
                                    key={module.name}
                                    className="flex items-center gap-2"
                                    style={{
                                        padding: 'var(--space-1) var(--space-2)',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: module.color
                                        }}
                                    />
                                    <span className="text-xs">{module.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                        <Lightbulb style={{ width: '14px', height: '14px' }} />
                        <span>View strategic playbooks</span>
                    </div>
                </Link>

                {/* Target ICPs Card */}
                <Link
                    href="/icp"
                    className="ops-card-link"
                >
                    <div className="flex items-center justify-between">
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--color-accent-danger)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Users style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <ArrowRight style={{ width: '20px', height: '20px', color: 'var(--color-text-tertiary)' }} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                            Target ICPs
                        </h3>
                        <p className="text-sm text-muted">
                            Ideal customer profiles for each business
                        </p>
                    </div>

                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted">Total Profiles</span>
                            <span className="font-semibold">{totalIcps}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {Object.entries(icpCounts).map(([business, count]) => (
                                count > 0 && (
                                    <div key={business} className="flex items-center justify-between">
                                        <span className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>
                                            {business.replace(/-/g, ' ')}
                                        </span>
                                        <span className="text-xs font-semibold">{count}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                        <Target style={{ width: '14px', height: '14px' }} />
                        <span>Define your ideal customers</span>
                    </div>
                </Link>
            </div>

            {/* Quick Stats */}
            <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
            <div className="grid grid-4 mb-8">
                <div className="stat-card">
                    <div className="stat-label">
                        <FileText style={{ width: '16px', height: '16px', marginRight: 'var(--space-2)' }} />
                        SOPs
                    </div>
                    <div className="stat-value">{sops.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <FolderOpen style={{ width: '16px', height: '16px', marginRight: 'var(--space-2)' }} />
                        Categories
                    </div>
                    <div className="stat-value">{Object.keys(sopCategories).length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <Users style={{ width: '16px', height: '16px', marginRight: 'var(--space-2)' }} />
                        Customer Profiles
                    </div>
                    <div className="stat-value">{totalIcps}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <BookOpen style={{ width: '16px', height: '16px', marginRight: 'var(--space-2)' }} />
                        Playbook Modules
                    </div>
                    <div className="stat-value">{playbookModules.length}</div>
                </div>
            </div>

            {/* Recent SOPs */}
            {sops.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent SOPs</h3>
                        <Link href="/sops" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                            View all →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        {sops.slice(0, 5).map((sop) => (
                            <Link
                                key={sop.id}
                                href={`/sops/${sop.id}`}
                                className="ops-item-link"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText style={{ width: '16px', height: '16px', color: 'var(--color-text-secondary)' }} />
                                    <span className="text-sm">{sop.title}</span>
                                </div>
                                <span className="badge">{sop.category}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
