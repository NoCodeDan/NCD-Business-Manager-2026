'use client';

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
    Lightbulb
} from 'lucide-react';

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
