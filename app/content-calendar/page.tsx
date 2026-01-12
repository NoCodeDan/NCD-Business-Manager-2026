"use client";

import { useState } from "react";
import { useActiveContentPipeline } from "@/hooks/use-content-plans";
import { Video, Zap, Calendar, Award, Target, FileText, CheckCircle2, TrendingUp } from "lucide-react";

export default function ContentCalendarPage() {
    const { activePlans, summary, groupedByBusiness } = useActiveContentPipeline();
    const [activeTab, setActiveTab] = useState<string>("all");

    if (!activePlans || !summary) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Content Calendar</h1>
                        <p className="page-subtitle">Loading your content strategy...</p>
                    </div>
                </div>
            </div>
        );
    }

    const businessLabels = {
        "tangible-ideas": "Tangible Ideas",
        "no-code-effect": "No-Code Effect",
        adalo: "Adalo",
        "personal-brand": "Personal Brand",
    };

    const typeIcons: { [key: string]: any } = {
        "long-form": Video,
        "short-form": Zap,
        series: Calendar,
        campaign: Target,
        archetype: Award,
    };

    const statusClasses = {
        planned: "badge",
        "in-progress": "badge badge-primary",
        active: "badge badge-success",
        completed: "badge badge-primary",
        paused: "badge badge-warning",
    };

    const assetStatusClasses = {
        planned: "badge",
        "in-production": "badge badge-primary",
        completed: "badge badge-success",
        published: "badge badge-success",
    };

    const calculatePlanProgress = (plan: typeof activePlans[0]) => {
        if (plan.assets.length === 0) return 0;
        const publishedCount = plan.assets.filter((a) => a.status === "published").length;
        return (publishedCount / plan.assets.length) * 100;
    };

    const plansToShow =
        activeTab === "all"
            ? activePlans
            : groupedByBusiness[activeTab as keyof typeof groupedByBusiness] || [];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Calendar</h1>
                    <p className="page-subtitle">
                        Manage your content strategy across all business areas
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-4 mb-8">
                <div className="stat-card">
                    <div className="stat-label">Total Plans</div>
                    <div className="stat-value">{summary.totalPlans}</div>
                    <div className="stat-change">{summary.byStatus.active} active</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total Assets</div>
                    <div className="stat-value">{summary.totalAssets}</div>
                    <div className="stat-change">Content pieces planned</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Published</div>
                    <div className="stat-value">{summary.publishedAssets}</div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.publishedAssets / summary.totalAssets) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Overall Progress</div>
                    <div className="stat-value">
                        {Math.round((summary.publishedAssets / summary.totalAssets) * 100)}%
                    </div>
                    <div className="progress-bar mt-3">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${(summary.publishedAssets / summary.totalAssets) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="quarter-tabs mb-6" style={{ borderBottom: "2px solid var(--color-border)" }}>
                <button
                    className={`quarter-tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    <span className="quarter-label">All Content</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "adalo" ? "active" : ""}`}
                    onClick={() => setActiveTab("adalo")}
                >
                    <span className="quarter-label">Adalo</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "tangible-ideas" ? "active" : ""}`}
                    onClick={() => setActiveTab("tangible-ideas")}
                >
                    <span className="quarter-label">Tangible Ideas</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "no-code-effect" ? "active" : ""}`}
                    onClick={() => setActiveTab("no-code-effect")}
                >
                    <span className="quarter-label">No-Code Effect</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "personal-brand" ? "active" : ""}`}
                    onClick={() => setActiveTab("personal-brand")}
                >
                    <span className="quarter-label">Personal Brand</span>
                </button>
            </div>

            {/* Content Plans */}
            <div className="flex flex-col gap-6">
                {plansToShow.length === 0 ? (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No content plans</h3>
                        <p className="empty-state-description">
                            No active content plans for this business area
                        </p>
                    </div>
                ) : (
                    plansToShow.map((plan) => {
                        const TypeIcon = typeIcons[plan.type];
                        const progress = calculatePlanProgress(plan);

                        return (
                            <div
                                key={plan._id}
                                className="card"
                                style={{ borderLeft: `4px solid ${plan.color}` }}
                            >
                                <div className="card-header">
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                background: plan.color,
                                            }}
                                        />
                                        <h3 className="card-title">{plan.name}</h3>
                                        {TypeIcon && (
                                            <TypeIcon
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    color: "var(--color-text-muted)",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="badge">{businessLabels[plan.business]}</span>
                                        <span className="badge">{plan.type}</span>
                                        <span className={statusClasses[plan.status]}>
                                            {plan.status}
                                        </span>
                                        {plan.schedule && (
                                            <span className="badge">{plan.schedule.frequency}</span>
                                        )}
                                    </div>
                                </div>

                                <p className="card-description mb-4">{plan.description}</p>

                                {/* Progress */}
                                {plan.assets.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted">Progress</span>
                                            <span className="font-semibold">
                                                {plan.assets.filter((a) => a.status === "published").length} /{" "}
                                                {plan.assets.length} published ({Math.round(progress)}%)
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                )}

                                {/* Targets */}
                                {plan.targets && (
                                    <div
                                        className="card mb-4"
                                        style={{
                                            padding: "var(--space-3)",
                                            background: "var(--color-bg-tertiary)",
                                        }}
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <Target style={{ width: "16px", height: "16px" }} />
                                            <span className="text-muted">Target:</span>
                                            <span className="badge badge-primary">
                                                {plan.targets.count} {plan.targets.cadence}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Assets */}
                                {plan.assets.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold mb-3">Assets</p>
                                        <div
                                            className="flex flex-col gap-2"
                                            style={{ maxHeight: "200px", overflowY: "auto" }}
                                        >
                                            {plan.assets.map((asset) => (
                                                <div
                                                    key={asset.id}
                                                    className="card"
                                                    style={{ padding: "var(--space-2)" }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm flex-1">{asset.title}</span>
                                                        <span className={assetStatusClasses[asset.status]}>
                                                            {asset.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {plan.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {plan.tags.map((tag) => (
                                            <span key={tag} className="badge text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
