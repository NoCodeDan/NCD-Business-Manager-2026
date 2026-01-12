"use client";

import { useGoals, useGoalProgressSummary } from "@/hooks/use-goals";
import { useInitiatives } from "@/hooks/use-initiatives";
import { Target, TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function GoalsPage() {
    const goals = useGoals();
    const summary = useGoalProgressSummary();
    const { initiatives } = useInitiatives();

    if (!goals || !summary) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">2026 Goals</h1>
                        <p className="page-subtitle">Loading your strategic framework...</p>
                    </div>
                </div>
            </div>
        );
    }

    const northStar = goals.find((g) => g.type === "north-star");
    const otherGoals = goals.filter((g) => g.type !== "north-star").sort((a, b) => a.order - b.order);

    const statusConfig = {
        "on-track": { icon: CheckCircle2, className: "badge-success", label: "On Track" },
        "at-risk": { icon: AlertCircle, className: "badge-warning", label: "At Risk" },
        behind: { icon: Clock, className: "badge-danger", label: "Behind" },
        completed: { icon: CheckCircle2, className: "badge-primary", label: "Completed" },
        "not-started": { icon: Clock, className: "badge", label: "Not Started" },
    };

    const getLinkedInitiatives = (goalId: string) => {
        return initiatives?.filter((i) => i.goalId === goalId) || [];
    };

    const calculateProgress = (goal: typeof goals[0]) => {
        const targetsWithProgress = goal.targets.filter((t) => t.currentValue).length;
        return (targetsWithProgress / goal.targets.length) * 100;
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">2026 Goals</h1>
                    <p className="page-subtitle">
                        Your strategic framework for building a sustainable, creator-led product studio
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-4 mb-8">
                <div className="stat-card">
                    <div className="stat-label">Total Goals</div>
                    <div className="stat-value">{summary.total}</div>
                    <div className="stat-change">
                        {summary.byType["north-star"]} north star + {summary.total - 1} strategic
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">On Track</div>
                    <div className="stat-value">{summary.byStatus["on-track"]}</div>
                    <div className="stat-change positive">
                        {Math.round((summary.byStatus["on-track"] / summary.total) * 100)}% of goals
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total Targets</div>
                    <div className="stat-value">{summary.totalTargets}</div>
                    <div className="stat-change">
                        {summary.targetsWithProgress} with progress tracked
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Overall Progress</div>
                    <div className="stat-value">
                        {Math.round((summary.targetsWithProgress / summary.totalTargets) * 100)}%
                    </div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.targetsWithProgress / summary.totalTargets) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* North Star Goal */}
            {northStar && (
                <div
                    className="card mb-8"
                    style={{
                        borderLeft: `4px solid ${northStar.color}`,
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
                    }}
                >
                    <div className="card-header">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold">⭐ {northStar.title}</h2>
                            <span className={`badge ${statusConfig[northStar.status].className}`}>
                                {statusConfig[northStar.status].label}
                            </span>
                        </div>
                    </div>
                    <p className="text-muted mb-4">{northStar.description}</p>
                    <div className="flex flex-col gap-3">
                        {northStar.targets.map((target) => (
                            <div
                                key={target.id}
                                className="card"
                                style={{ padding: "var(--space-4)" }}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{target.metric}</p>
                                    <span className="badge badge-primary">{target.target}</span>
                                </div>
                                {target.notes && (
                                    <p className="text-sm text-muted mt-2">{target.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Strategic Goals */}
            <div>
                <h2 className="text-2xl font-semibold mb-6">Strategic Goals</h2>
                <div className="grid grid-2">
                    {otherGoals.map((goal) => {
                        const StatusIcon = statusConfig[goal.status].icon;
                        const linkedInits = getLinkedInitiatives(goal._id);
                        const progress = calculateProgress(goal);

                        return (
                            <div
                                key={goal._id}
                                className="card"
                                style={{ borderLeft: `4px solid ${goal.color}` }}
                            >
                                <div className="card-header">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                background: goal.color,
                                            }}
                                        />
                                        <h3 className="card-title">{goal.title}</h3>
                                    </div>
                                    <span className={`badge ${statusConfig[goal.status].className}`}>
                                        <StatusIcon style={{ width: "12px", height: "12px", marginRight: "4px" }} />
                                        {statusConfig[goal.status].label}
                                    </span>
                                </div>

                                <p className="card-description mb-4">{goal.description}</p>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted">Progress</span>
                                        <span className="font-semibold">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>

                                {/* Key Targets */}
                                <div className="mb-4">
                                    <p className="text-sm font-semibold mb-3">Key Targets</p>
                                    <div className="flex flex-col gap-2">
                                        {goal.targets.slice(0, 3).map((target) => (
                                            <div key={target.id} className="flex items-center justify-between text-sm">
                                                <span className="text-muted">{target.metric}</span>
                                                <span className="font-semibold">
                                                    {target.currentValue || target.target} {target.unit}
                                                </span>
                                            </div>
                                        ))}
                                        {goal.targets.length > 3 && (
                                            <p className="text-xs text-muted">
                                                +{goal.targets.length - 3} more targets
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Linked Initiatives */}
                                {linkedInits.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Supporting Initiatives</p>
                                        <div className="flex flex-col gap-2">
                                            {linkedInits.map((init) => (
                                                <div key={init._id} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        style={{
                                                            width: "8px",
                                                            height: "8px",
                                                            borderRadius: "50%",
                                                            background: init.color,
                                                        }}
                                                    />
                                                    <span className="flex-1">{init.name}</span>
                                                    <span className="badge badge-success text-xs">
                                                        {init.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
