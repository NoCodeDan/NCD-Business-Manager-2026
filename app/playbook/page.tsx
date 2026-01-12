"use client";

import { useOperatingFramework } from "@/hooks/use-operating-rules";
import { CalendarCheck, ListOrdered, Filter, XCircle, ClipboardCheck } from "lucide-react";

export default function PlaybookPage() {
    const { weeklyRules, priorityStack, decisionFilter, killCriteria, reviewProcess } =
        useOperatingFramework();

    if (!weeklyRules || !priorityStack || !decisionFilter || !killCriteria || !reviewProcess) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Operating Playbook</h1>
                        <p className="page-subtitle">Loading your decision framework...</p>
                    </div>
                </div>
            </div>
        );
    }

    const frameworks = [
        {
            data: weeklyRules,
            icon: CalendarCheck,
            color: "#6366f1",
        },
        {
            data: priorityStack,
            icon: ListOrdered,
            color: "#8b5cf6",
        },
        {
            data: decisionFilter,
            icon: Filter,
            color: "#22c55e",
        },
        {
            data: killCriteria,
            icon: XCircle,
            color: "#ef4444",
        },
        {
            data: reviewProcess,
            icon: ClipboardCheck,
            color: "#f97316",
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Operating Playbook</h1>
                    <p className="page-subtitle">
                        Your decision framework for staying focused and shipping consistently
                    </p>
                </div>
            </div>

            {/* Introduction */}
            <div
                className="card mb-8"
                style={{
                    borderLeft: "4px solid var(--color-accent-primary)",
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
                }}
            >
                <h3 className="card-title mb-3">How to Use This Playbook</h3>
                <p className="card-description mb-4">
                    This playbook guides every decision you make in 2026. When in doubt, refer back to
                    these frameworks.
                </p>
                <div className="flex flex-col gap-2 text-sm">
                    <p>
                        📅 <strong>Weekly Execution:</strong> Non-negotiable outputs every week
                    </p>
                    <p>
                        📊 <strong>Priority Stack:</strong> What to work on first (in order)
                    </p>
                    <p>
                        ✅ <strong>Decision Filter:</strong> Should you build this? (2 of 4 required)
                    </p>
                    <p>
                        🛑 <strong>Kill Criteria:</strong> When to stop or pause
                    </p>
                    <p>
                        🔍 <strong>Review Process:</strong> Monthly check-in questions
                    </p>
                </div>
            </div>

            {/* Frameworks */}
            <div className="flex flex-col gap-6">
                {frameworks.map(({ data, icon: Icon, color }) => {
                    if (!data) return null;

                    return (
                        <div key={data._id} className="card" style={{ borderLeft: `4px solid ${color}` }}>
                            <div className="card-header">
                                <div className="flex items-start gap-4">
                                    <div
                                        style={{
                                            padding: "var(--space-3)",
                                            borderRadius: "var(--radius-lg)",
                                            background: `${color}15`,
                                        }}
                                    >
                                        <Icon style={{ width: "24px", height: "24px", color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="card-title">{data.title}</h3>
                                        <p className="card-description mt-2">{data.description}</p>
                                    </div>
                                    <span
                                        className={`badge ${data.isActive ? "badge-success" : "badge"}`}
                                    >
                                        {data.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                {data.rules
                                    .sort((a, b) => a.order - b.order)
                                    .map((rule) => (
                                        <div
                                            key={rule.id}
                                            className="card"
                                            style={{
                                                padding: "var(--space-4)",
                                                background: "var(--color-bg-tertiary)",
                                            }}
                                        >
                                            <div className="flex gap-4">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "50%",
                                                        background: `${color}20`,
                                                        color: color,
                                                        fontWeight: "600",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {rule.order}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{rule.rule}</p>
                                                        {rule.isRequired && (
                                                            <span className="badge badge-danger text-xs">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                    {rule.examples && rule.examples.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-xs text-muted mb-2">
                                                                Examples:
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {rule.examples.map((example, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="badge text-xs"
                                                                    >
                                                                        {example}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Reference */}
            <div className="card mt-8" style={{ background: "var(--color-bg-tertiary)" }}>
                <h3 className="card-title mb-3">Quick Reference</h3>
                <p className="card-description mb-6">Key principles to remember every day</p>
                <div className="grid grid-2">
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold">Every Week Must Have:</h4>
                        <ul className="sop-list sop-list-bullet">
                            {weeklyRules.rules.map((rule) => (
                                <li key={rule.id}>{rule.rule}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold">Work On (In Order):</h4>
                        <ol className="sop-list sop-list-numbered">
                            {priorityStack.rules.map((rule) => (
                                <li key={rule.id}>{rule.rule}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
