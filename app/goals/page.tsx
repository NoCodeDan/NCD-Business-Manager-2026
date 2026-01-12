"use client";

import { useState } from "react";
import { useGoals, useGoalProgressSummary } from "@/hooks/use-goals";
import { useInitiatives } from "@/hooks/use-initiatives";
import { Target, TrendingUp, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function GoalsPage() {
    const goals = useGoals();
    const summary = useGoalProgressSummary();
    const { initiatives } = useInitiatives();
    const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

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
    const currentGoal = otherGoals[currentGoalIndex];

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

    const goToNext = () => {
        setCurrentGoalIndex((prev) => (prev + 1) % otherGoals.length);
    };

    const goToPrev = () => {
        setCurrentGoalIndex((prev) => (prev - 1 + otherGoals.length) % otherGoals.length);
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

            {/* Strategic Goals - Slider */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Strategic Goals</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">
                            {currentGoalIndex + 1} of {otherGoals.length}
                        </span>
                    </div>
                </div>

                {currentGoal && (() => {
                    const StatusIcon = statusConfig[currentGoal.status].icon;
                    const linkedInits = getLinkedInitiatives(currentGoal._id);
                    const progress = calculateProgress(currentGoal);

                    return (
                        <div
                            className="card"
                            style={{
                                borderLeft: `4px solid ${currentGoal.color}`,
                                minHeight: "400px",
                            }}
                        >
                            {/* Goal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "var(--radius-lg)",
                                            background: currentGoal.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Target style={{ width: "24px", height: "24px", color: "white" }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold" style={{ marginBottom: "4px" }}>
                                            {currentGoal.title}
                                        </h3>
                                        <span className={`badge ${statusConfig[currentGoal.status].className}`}>
                                            <StatusIcon style={{ width: "12px", height: "12px", marginRight: "4px" }} />
                                            {statusConfig[currentGoal.status].label}
                                        </span>
                                    </div>
                                </div>

                                {/* Navigation Arrows */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goToPrev}
                                        className="btn btn-secondary"
                                        style={{
                                            padding: "var(--space-2) var(--space-3)",
                                            minWidth: "auto",
                                        }}
                                    >
                                        <ChevronLeft style={{ width: "20px", height: "20px" }} />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="btn btn-secondary"
                                        style={{
                                            padding: "var(--space-2) var(--space-3)",
                                            minWidth: "auto",
                                        }}
                                    >
                                        <ChevronRight style={{ width: "20px", height: "20px" }} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-muted mb-6" style={{ fontSize: "var(--text-lg)" }}>
                                {currentGoal.description}
                            </p>

                            {/* Progress Section */}
                            <div
                                className="mb-6"
                                style={{
                                    padding: "var(--space-5)",
                                    background: "var(--color-bg-tertiary)",
                                    borderRadius: "var(--radius-lg)",
                                }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold">Overall Progress</span>
                                    <span
                                        className="font-bold"
                                        style={{
                                            fontSize: "var(--text-2xl)",
                                            color: "var(--color-accent-primary)",
                                        }}
                                    >
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ height: "12px" }}>
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${progress}%`,
                                            background: currentGoal.color,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Key Targets Grid */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">Key Targets</h4>
                                <div className="grid grid-2 gap-3">
                                    {currentGoal.targets.map((target) => (
                                        <div
                                            key={target.id}
                                            style={{
                                                padding: "var(--space-4)",
                                                background: "var(--color-bg-secondary)",
                                                borderRadius: "var(--radius-md)",
                                                border: "1px solid var(--color-border)",
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-muted">{target.metric}</span>
                                                {target.currentValue && (
                                                    <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className="font-bold"
                                                style={{
                                                    fontSize: "var(--text-xl)",
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                {target.currentValue || target.target}{" "}
                                                <span
                                                    className="font-normal"
                                                    style={{
                                                        fontSize: "var(--text-sm)",
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {target.unit}
                                                </span>
                                            </div>
                                            {target.notes && (
                                                <p
                                                    className="text-xs text-muted mt-2"
                                                    style={{ lineHeight: 1.4 }}
                                                >
                                                    {target.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Linked Initiatives */}
                            {linkedInits.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3">Supporting Initiatives</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedInits.map((init) => (
                                            <div
                                                key={init._id}
                                                className="flex items-center gap-2"
                                                style={{
                                                    padding: "var(--space-2) var(--space-3)",
                                                    background: "var(--color-bg-secondary)",
                                                    borderRadius: "var(--radius-full)",
                                                    border: "1px solid var(--color-border)",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        background: init.color,
                                                    }}
                                                />
                                                <span className="text-sm">{init.name}</span>
                                                <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>
                                                    {init.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Goal Indicators (Dots) */}
                {otherGoals.length > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                        {otherGoals.map((goal, index) => (
                            <button
                                key={goal._id}
                                onClick={() => setCurrentGoalIndex(index)}
                                style={{
                                    width: index === currentGoalIndex ? "32px" : "12px",
                                    height: "12px",
                                    borderRadius: "var(--radius-full)",
                                    background: index === currentGoalIndex ? goal.color : "var(--color-bg-tertiary)",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                aria-label={`Go to goal: ${goal.title}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
