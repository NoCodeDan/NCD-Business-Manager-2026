'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/hooks/use-expenses';
import { useDealsSummary, useWonDeals, useDealsPipeline } from '@/hooks/use-deals';
import { useInvoicesSummary, usePaidInvoices, usePendingInvoices } from '@/hooks/use-invoices';
import {
    Calendar,
    TrendingDown,
    TrendingUp,
    DollarSign,
    ArrowRight,
    CreditCard,
    Receipt,
    PieChart,
    Briefcase,
    FileText,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

// Simple sparkline component
function Sparkline({ data, color = 'var(--color-accent-primary)', height = 40 }: { data: number[], color?: string, height?: number }) {
    if (data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${height} ${points} 100,${height}`;

    return (
        <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={areaPoints}
                fill={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
            />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

// Donut chart component
function DonutChart({ segments, total, centerLabel }: {
    segments: { label: string; value: number; color: string }[],
    total: number,
    centerLabel: string
}) {
    let currentAngle = -90; // Start from top

    const createArcPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
        const startRad = (startAngle) * (Math.PI / 180);
        const endRad = (endAngle) * (Math.PI / 180);

        const x1 = 50 + radius * Math.cos(startRad);
        const y1 = 50 + radius * Math.sin(startRad);
        const x2 = 50 + radius * Math.cos(endRad);
        const y2 = 50 + radius * Math.sin(endRad);

        const x3 = 50 + innerRadius * Math.cos(endRad);
        const y3 = 50 + innerRadius * Math.sin(endRad);
        const x4 = 50 + innerRadius * Math.cos(startRad);
        const y4 = 50 + innerRadius * Math.sin(startRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    };

    return (
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                {segments.length > 0 ? segments.map((segment, idx) => {
                    const angle = (segment.value / total) * 360;
                    const path = createArcPath(currentAngle, currentAngle + angle, 45, 32);
                    currentAngle += angle;
                    return (
                        <path
                            key={idx}
                            d={path}
                            fill={segment.color}
                            style={{ transition: 'opacity 0.2s' }}
                        />
                    );
                }) : (
                    <circle cx="50" cy="50" r="38.5" fill="none" stroke="var(--color-border)" strokeWidth="13" />
                )}
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {centerLabel}
                </div>
            </div>
        </div>
    );
}

const BUSINESS_COLORS: Record<string, string> = {
    'tangible-ideas': '#8b5cf6',
    'no-code-effect': '#ec4899',
    'adalo': '#6366f1',
    'no-code-dan': '#10b981',
    'other': '#64748b',
};

const BUSINESS_LABELS: Record<string, string> = {
    'tangible-ideas': 'Tangible Ideas',
    'no-code-effect': 'No-Code Effect',
    'adalo': 'Adalo',
    'no-code-dan': 'No-Code Dan',
    'other': 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
    'Tools': '#6366f1',
    'Marketing': '#ec4899',
    'Hosting': '#14b8a6',
    'Software': '#8b5cf6',
    'Team': '#f97316',
    'Education': '#22c55e',
    'Other': '#64748b',
};

export default function FinancesPage() {
    const {
        expenses,
        isLoaded: expensesLoaded,
        monthlyTotal,
        annualTotal,
        expensesByCategory,
        upcomingRenewals
    } = useExpenses();

    const dealsSummary = useDealsSummary();
    const wonDeals = useWonDeals();
    const pipelineDeals = useDealsPipeline();

    const invoicesSummary = useInvoicesSummary();
    const paidInvoices = usePaidInvoices();
    const pendingInvoices = usePendingInvoices();

    const [dateRange, setDateRange] = useState('30d');

    const isLoaded = expensesLoaded && dealsSummary !== undefined && invoicesSummary !== undefined;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate net profit/loss
    const netProfit = useMemo(() => {
        const revenue = invoicesSummary?.totalReceived || 0;
        const expenses = annualTotal || 0;
        return revenue - expenses;
    }, [invoicesSummary, annualTotal]);

    // Calculate gross margin
    const grossMargin = useMemo(() => {
        const revenue = invoicesSummary?.totalReceived || 0;
        if (revenue === 0) return 0;
        return ((revenue - (annualTotal || 0)) / revenue) * 100;
    }, [invoicesSummary, annualTotal]);

    // Generate sparkline data
    const revenueSparkline = useMemo(() => {
        const baseValue = invoicesSummary?.totalReceived || 1000;
        return Array.from({ length: 12 }, (_, i) => {
            const variance = (Math.random() - 0.3) * 0.4;
            return Math.max(0, (baseValue / 12) * (1 + variance + (i * 0.05)));
        });
    }, [invoicesSummary]);

    const expenseSparkline = useMemo(() => {
        const baseValue = monthlyTotal || 100;
        return Array.from({ length: 12 }, (_, i) => {
            const variance = (Math.random() - 0.5) * 0.2;
            return Math.max(0, baseValue * (1 + variance));
        });
    }, [monthlyTotal]);

    // Revenue by business area segments
    const revenueSegments = useMemo(() => {
        if (!invoicesSummary?.revenueByArea) return [];
        return Object.entries(invoicesSummary.revenueByArea)
            .filter(([, amount]) => amount > 0)
            .map(([area, amount]) => ({
                label: BUSINESS_LABELS[area] || area,
                value: amount,
                color: BUSINESS_COLORS[area] || '#64748b',
            }));
    }, [invoicesSummary]);

    // Expense category segments
    const expenseSegments = useMemo(() => {
        return Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => ({
                label: category,
                value: amount,
                color: CATEGORY_COLORS[category] || '#64748b',
            }));
    }, [expensesByCategory]);

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Finances</h1>
                    <p className="page-subtitle">Loading financial data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
                <h1 className="page-title" style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Finances</h1>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="flex items-center gap-2"
                    style={{
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                    }}
                >
                    <Calendar style={{ width: '16px', height: '16px', color: 'var(--color-text-secondary)' }} />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="12m">Last 12 months</option>
                        <option value="ytd">Year to date</option>
                    </select>
                </div>
                <span className="text-sm text-muted">compared to previous period</span>
            </div>

            {/* Top Stats Cards - Like Shopify */}
            <div className="grid grid-3 mb-6">
                {/* Total Revenue */}
                <div
                    className="card"
                    style={{
                        padding: 'var(--space-5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Total Revenue</span>
                        <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--color-accent-success)' }} />
                    </div>
                    <div className="stat-value" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-accent-success)' }}>
                        {formatCurrency(invoicesSummary?.totalReceived || 0)}
                    </div>
                    <p className="text-xs text-muted">
                        {formatCurrency(invoicesSummary?.totalPending || 0)} pending
                    </p>
                    <div style={{ height: '40px', marginTop: 'var(--space-2)' }}>
                        <Sparkline data={revenueSparkline} color="var(--color-accent-success)" />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                        Open revenue breakdown
                    </span>
                </div>

                {/* Total Expenses */}
                <div
                    className="card"
                    style={{
                        padding: 'var(--space-5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Total Expenses</span>
                        <TrendingDown style={{ width: '16px', height: '16px', color: 'var(--color-accent-danger)' }} />
                    </div>
                    <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>
                        {formatCurrency(annualTotal)}
                    </div>
                    <p className="text-xs text-muted">
                        {formatCurrency(monthlyTotal)}/month
                    </p>
                    <div style={{ height: '40px', marginTop: 'var(--space-2)' }}>
                        <Sparkline data={expenseSparkline} color="var(--color-accent-primary)" />
                    </div>
                    <Link href="/expenses" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                        Open expense breakdown
                    </Link>
                </div>

                {/* Gross Margin */}
                <div
                    className="card"
                    style={{
                        padding: 'var(--space-5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Net Profit</span>
                        <DollarSign style={{ width: '16px', height: '16px', color: 'var(--color-text-tertiary)' }} />
                    </div>
                    <div
                        className="stat-value"
                        style={{
                            fontSize: 'var(--text-2xl)',
                            color: netProfit >= 0 ? 'var(--color-accent-success)' : 'var(--color-accent-danger)',
                        }}
                    >
                        {formatCurrency(netProfit)}
                    </div>
                    <p className="text-xs text-muted">
                        {grossMargin.toFixed(1)}% margin
                    </p>
                    <div
                        className="flex items-center gap-2 mt-2"
                        style={{
                            padding: 'var(--space-2) var(--space-3)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        {netProfit >= 0 ? (
                            <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--color-accent-success)' }} />
                        ) : (
                            <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--color-accent-danger)' }} />
                        )}
                        <span className="text-xs">
                            {netProfit >= 0 ? 'Profitable' : 'Operating at a loss'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Finances Breakdown */}
            <h3
                className="font-semibold mb-4"
                style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}
            >
                Finances breakdown
            </h3>

            <div className="grid mb-6" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Revenue by Business */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 className="card-title">Revenue by Business</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <DonutChart
                            segments={revenueSegments}
                            total={invoicesSummary?.totalReceived || 1}
                            centerLabel={formatCurrency(invoicesSummary?.totalReceived || 0)}
                        />

                        <div className="flex flex-col gap-3" style={{ flex: 1 }}>
                            {revenueSegments.length > 0 ? revenueSegments.map((segment) => (
                                <div key={segment.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: segment.color
                                            }}
                                        />
                                        <span className="text-sm">{segment.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{formatCurrency(segment.value)}</span>
                                </div>
                            )) : (
                                <p className="text-sm text-muted">No revenue data yet. Add invoices to track income.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expenses by Category */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 className="card-title">Expenses by Category</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <DonutChart
                            segments={expenseSegments}
                            total={monthlyTotal || 1}
                            centerLabel={formatCurrency(monthlyTotal)}
                        />

                        <div className="flex flex-col gap-3" style={{ flex: 1 }}>
                            {expenseSegments.slice(0, 5).map((segment) => (
                                <div key={segment.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: segment.color
                                            }}
                                        />
                                        <span className="text-sm">{segment.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{formatCurrency(segment.value)}</span>
                                </div>
                            ))}

                            <Link
                                href="/expenses"
                                className="text-sm mt-1"
                                style={{ color: 'var(--color-accent-primary)' }}
                            >
                                View all categories →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Deals & Invoices */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
                {/* Deals Pipeline */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <div className="flex items-center gap-3">
                            <Briefcase style={{ width: '20px', height: '20px', color: 'var(--color-accent-primary)' }} />
                            <h3 className="card-title">Deals Pipeline</h3>
                        </div>
                        <span className="badge">{dealsSummary?.pipelineDeals || 0} active</span>
                    </div>

                    <div className="grid grid-4 mb-4" style={{ gap: 'var(--space-3)' }}>
                        <div
                            style={{
                                padding: 'var(--space-3)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            <p className="text-xs text-muted mb-1">Won Deals</p>
                            <p className="font-semibold">{dealsSummary?.wonDeals || 0}</p>
                        </div>
                        <div
                            style={{
                                padding: 'var(--space-3)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            <p className="text-xs text-muted mb-1">Total Revenue</p>
                            <p className="font-semibold" style={{ color: 'var(--color-accent-success)' }}>
                                {formatCurrency(dealsSummary?.totalRevenue || 0)}
                            </p>
                        </div>
                        <div
                            style={{
                                padding: 'var(--space-3)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            <p className="text-xs text-muted mb-1">Pipeline</p>
                            <p className="font-semibold">{dealsSummary?.pipelineDeals || 0}</p>
                        </div>
                        <div
                            style={{
                                padding: 'var(--space-3)',
                                background: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}
                        >
                            <p className="text-xs text-muted mb-1">Weighted Value</p>
                            <p className="font-semibold">{formatCurrency(dealsSummary?.pipelineValue || 0)}</p>
                        </div>
                    </div>

                    {pipelineDeals && pipelineDeals.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {pipelineDeals.slice(0, 4).map((deal) => (
                                <div
                                    key={deal._id}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: 'var(--space-3)',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: BUSINESS_COLORS[deal.businessArea] || '#64748b'
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold">{deal.name}</p>
                                            <p className="text-xs text-muted">{deal.client}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">{formatCurrency(deal.amount)}</p>
                                        <span className={`badge badge-sm ${deal.status === 'negotiation' ? 'badge-warning' :
                                                deal.status === 'proposal' ? 'badge-primary' : ''
                                            }`}>
                                            {deal.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted">No active deals in pipeline</p>
                    )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                    {/* Pending Invoices */}
                    <div className="card" style={{ padding: 'var(--space-5)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FileText style={{ width: '16px', height: '16px', color: 'var(--color-accent-warning)' }} />
                                <h4 className="font-semibold">Pending Invoices</h4>
                            </div>
                            <span className="badge badge-warning">{invoicesSummary?.pendingCount || 0}</span>
                        </div>

                        <p className="stat-value" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                            {formatCurrency(invoicesSummary?.totalPending || 0)}
                        </p>
                        <p className="text-xs text-muted mb-3">
                            awaiting payment
                        </p>

                        {(invoicesSummary?.overdueCount || 0) > 0 && (
                            <div
                                className="flex items-center gap-2"
                                style={{
                                    padding: 'var(--space-2) var(--space-3)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                }}
                            >
                                <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--color-accent-danger)' }} />
                                <span className="text-xs" style={{ color: 'var(--color-accent-danger)' }}>
                                    {invoicesSummary?.overdueCount} overdue ({formatCurrency(invoicesSummary?.totalOverdue || 0)})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Invoice Summary */}
                    <div className="card" style={{ padding: 'var(--space-5)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Receipt style={{ width: '16px', height: '16px', color: 'var(--color-text-secondary)' }} />
                            <h4 className="font-semibold">Invoice Summary</h4>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle style={{ width: '14px', height: '14px', color: 'var(--color-accent-success)' }} />
                                    <span className="text-sm">Paid</span>
                                </div>
                                <span className="text-sm font-semibold">{invoicesSummary?.paidCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock style={{ width: '14px', height: '14px', color: 'var(--color-accent-warning)' }} />
                                    <span className="text-sm">Pending</span>
                                </div>
                                <span className="text-sm font-semibold">{invoicesSummary?.pendingCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--color-accent-danger)' }} />
                                    <span className="text-sm">Overdue</span>
                                </div>
                                <span className="text-sm font-semibold">{invoicesSummary?.overdueCount || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Renewals */}
                    <div className="card" style={{ padding: 'var(--space-5)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar style={{ width: '16px', height: '16px', color: 'var(--color-text-secondary)' }} />
                                <h4 className="font-semibold">Upcoming Expenses</h4>
                            </div>
                            <span className="badge">{upcomingRenewals.length}</span>
                        </div>

                        {upcomingRenewals.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {upcomingRenewals.slice(0, 3).map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between"
                                        style={{
                                            padding: 'var(--space-2)',
                                            background: 'var(--color-bg-tertiary)',
                                            borderRadius: 'var(--radius-sm)',
                                        }}
                                    >
                                        <span className="text-sm">{expense.name}</span>
                                        <span className="text-sm font-semibold">{formatCurrency(expense.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted">No upcoming expenses</p>
                        )}

                        <Link
                            href="/expenses"
                            className="text-sm mt-3 block"
                            style={{ color: 'var(--color-accent-primary)' }}
                        >
                            View all expenses →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
