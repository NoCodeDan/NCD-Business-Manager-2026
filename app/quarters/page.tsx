"use client";

import { use2026Plans, useToggleQuarterlyAction } from "@/hooks/use-quarterly-plans";
import { CheckCircle2, Circle, TrendingUp, DollarSign, Package, FileText } from "lucide-react";

const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(num);
};

export default function QuartersPage() {
    const { plans, summary, currentQuarter, q1, q2, q3, q4 } = use2026Plans();
    const toggleAction = useToggleQuarterlyAction();

    if (!plans || !summary) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">2026 Quarterly Execution</h1>
                        <p className="page-subtitle">Loading your quarterly plans...</p>
                    </div>
                </div>
            </div>
        );
    }

    const quarterOrder = [q1, q2, q3, q4].filter(Boolean);

    const handleToggleAction = async (planId: string, actionId: string) => {
        try {
            await toggleAction({ planId: planId as any, actionId });
        } catch (error) {
            console.error("Failed to toggle action:", error);
        }
    };

    const statusClasses = {
        upcoming: "badge",
        "in-progress": "badge badge-primary",
        completed: "badge badge-success",
        reviewed: "badge badge-warning",
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">2026 Quarterly Execution</h1>
                    <p className="page-subtitle">
                        Track your quarterly themes, actions, and targets throughout the year
                    </p>
                </div>
            </div>

            {/* Year Summary */}
            <div className="grid grid-4 mb-8">
                <div className="stat-card">
                    <div className="stat-label">Annual Revenue Target</div>
                    <div className="stat-value" style={{ fontSize: "var(--text-xl)" }}>
                        {formatCurrency(summary.totalRevenue.min)} - {formatCurrency(summary.totalRevenue.max)}
                    </div>
                    <div className="stat-change">
                        Actual: {formatCurrency(summary.totalRevenue.actual)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">MVPs Target</div>
                    <div className="stat-value">
                        {summary.totalShipping.mvps.actual} / {summary.totalShipping.mvps.target}
                    </div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.totalShipping.mvps.actual / summary.totalShipping.mvps.target) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Build Breakdowns</div>
                    <div className="stat-value">
                        {summary.totalShipping.buildBreakdowns.actual} /{" "}
                        {summary.totalShipping.buildBreakdowns.target}
                    </div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.totalShipping.buildBreakdowns.actual / summary.totalShipping.buildBreakdowns.target) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Actions Complete</div>
                    <div className="stat-value">
                        {summary.actionsCompleted} / {summary.actionsTotal}
                    </div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.actionsCompleted / summary.actionsTotal) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Current Quarter Highlight */}
            {currentQuarter && (
                <div
                    className="card mb-8"
                    style={{
                        borderLeft: "4px solid var(--color-accent-primary)",
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">
                            📍 Current: {currentQuarter.quarter} - {currentQuarter.theme}
                        </h3>
                        <span className={statusClasses[currentQuarter.status]}>
                            {currentQuarter.status}
                        </span>
                    </div>
                    <p className="text-muted">{currentQuarter.primaryObjective}</p>
                </div>
            )}

            {/* Quarterly Plans */}
            <div className="flex flex-col gap-8">
                {quarterOrder.map((quarter) => {
                    if (!quarter) return null;

                    const actionsCompleted = quarter.keyActions.filter((a) => a.completed).length;
                    const actionsProgress = (actionsCompleted / quarter.keyActions.length) * 100;
                    const isCurrent = currentQuarter?._id === quarter._id;

                    return (
                        <div
                            key={quarter._id}
                            className="card"
                            style={{
                                borderLeft: isCurrent ? "4px solid var(--color-accent-primary)" : undefined,
                            }}
                        >
                            <div className="card-header">
                                <div className="flex items-center gap-4">
                                    <h3 className="card-title" style={{ fontSize: "var(--text-2xl)" }}>
                                        {quarter.quarter}: {quarter.theme}
                                    </h3>
                                    {isCurrent && (
                                        <span className="badge badge-primary">Current Quarter</span>
                                    )}
                                    <span className={statusClasses[quarter.status]}>
                                        {quarter.status}
                                    </span>
                                </div>
                            </div>

                            <p className="card-description mb-6">{quarter.primaryObjective}</p>

                            {/* Focus Areas */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Focus Areas</h4>
                                <ul className="sop-list sop-list-bullet">
                                    {quarter.focusAreas.map((area, idx) => (
                                        <li key={idx}>{area}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Actions */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold">Key Actions</h4>
                                    <span className="text-sm text-muted">
                                        {actionsCompleted} / {quarter.keyActions.length} complete (
                                        {Math.round(actionsProgress)}%)
                                    </span>
                                </div>
                                <div className="progress-bar mb-4">
                                    <div className="progress-fill" style={{ width: `${actionsProgress}%` }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    {quarter.keyActions.map((action) => (
                                        <div
                                            key={action.id}
                                            className="card"
                                            style={{
                                                padding: "var(--space-3)",
                                                cursor: "pointer",
                                                borderLeft: action.completed
                                                    ? "3px solid var(--color-accent-success)"
                                                    : "3px solid var(--color-border)",
                                            }}
                                            onClick={() => handleToggleAction(quarter._id, action.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <button className="btn-icon" style={{ padding: "0" }}>
                                                    {action.completed ? (
                                                        <CheckCircle2
                                                            style={{
                                                                width: "20px",
                                                                height: "20px",
                                                                color: "var(--color-accent-success)",
                                                            }}
                                                        />
                                                    ) : (
                                                        <Circle
                                                            style={{
                                                                width: "20px",
                                                                height: "20px",
                                                                color: "var(--color-text-muted)",
                                                            }}
                                                        />
                                                    )}
                                                </button>
                                                <div className="flex-1">
                                                    <p
                                                        style={{
                                                            textDecoration: action.completed
                                                                ? "line-through"
                                                                : "none",
                                                            color: action.completed
                                                                ? "var(--color-text-muted)"
                                                                : "var(--color-text-primary)",
                                                        }}
                                                    >
                                                        {action.action}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="badge text-xs">{action.category}</span>
                                                        {action.completedDate && (
                                                            <span className="text-xs text-muted">
                                                                Completed:{" "}
                                                                {new Date(action.completedDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Targets Grid */}
                            <div className="grid grid-3">
                                {/* Shipping Targets */}
                                <div className="card" style={{ padding: "var(--space-4)" }}>
                                    <h5 className="font-semibold text-sm mb-3">Shipping Targets</h5>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted">MVPs</span>
                                            <span className="font-semibold">
                                                {quarter.shippingTargets.mvps.actual || 0} /{" "}
                                                {quarter.shippingTargets.mvps.target}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Products</span>
                                            <span className="font-semibold">
                                                {quarter.shippingTargets.internalProducts.actual || 0} /{" "}
                                                {quarter.shippingTargets.internalProducts.target}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Breakdowns</span>
                                            <span className="font-semibold">
                                                {quarter.shippingTargets.buildBreakdowns.actual || 0} /{" "}
                                                {quarter.shippingTargets.buildBreakdowns.target}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue */}
                                <div className="card" style={{ padding: "var(--space-4)" }}>
                                    <h5 className="font-semibold text-sm mb-3">Revenue</h5>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted">Target</span>
                                            <span className="font-semibold text-xs">
                                                {formatCurrency(quarter.revenueTargets.min)} -{" "}
                                                {formatCurrency(quarter.revenueTargets.max)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Actual</span>
                                            <span className="font-semibold">
                                                {formatCurrency(quarter.revenueTargets.actual || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Audience */}
                                <div className="card" style={{ padding: "var(--space-4)" }}>
                                    <h5 className="font-semibold text-sm mb-3">Audience</h5>
                                    <div className="flex flex-col gap-2 text-sm">
                                        {quarter.audienceTargets.slice(0, 2).map((target) => (
                                            <div key={target.id} className="flex justify-between">
                                                <span className="text-muted">{target.metric}</span>
                                                <span className="font-semibold">
                                                    {target.actual || 0} / {target.target}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
