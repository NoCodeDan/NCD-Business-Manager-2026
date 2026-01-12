"use client";

import { useState } from "react";
import { useActiveICPsByBusiness } from "@/hooks/use-target-icp";
import { Users, AlertCircle, MessageSquare } from "lucide-react";

export default function ICPPage() {
    const { activeICPs, summary, groupedByBusiness } = useActiveICPsByBusiness();
    const [activeTab, setActiveTab] = useState<string>("all");

    if (!activeICPs || !summary) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Target Customer Profiles (ICP)</h1>
                        <p className="page-subtitle">Loading your ICP data...</p>
                    </div>
                </div>
            </div>
        );
    }

    const businessLabels = {
        "tangible-ideas": "Tangible Ideas",
        "no-code-effect": "No-Code Effect",
        adalo: "Adalo",
    };

    const businessColors = {
        "tangible-ideas": "#8b5cf6",
        "no-code-effect": "#ec4899",
        adalo: "#6366f1",
    };

    const icpsToShow =
        activeTab === "all"
            ? activeICPs
            : groupedByBusiness[activeTab as keyof typeof groupedByBusiness] || [];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Target Customer Profiles (ICP)</h1>
                    <p className="page-subtitle">
                        Know your customers - their needs, pain points, and how to reach them
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-4 mb-8">
                <div className="stat-card">
                    <div className="stat-label">Total Profiles</div>
                    <div className="stat-value">{summary.active}</div>
                    <div className="stat-change">Active customer segments</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Characteristics</div>
                    <div className="stat-value">{summary.totalCharacteristics}</div>
                    <div className="stat-change">Customer attributes tracked</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Pain Points</div>
                    <div className="stat-value">{summary.totalPainPoints}</div>
                    <div className="stat-change">Problems to solve</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Messaging</div>
                    <div className="stat-value">{summary.totalMessaging}</div>
                    <div className="stat-change">Messaging strategies</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="quarter-tabs mb-6" style={{ borderBottom: "2px solid var(--color-border)" }}>
                <button
                    className={`quarter-tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    <span className="quarter-label">All Profiles</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "adalo" ? "active" : ""}`}
                    onClick={() => setActiveTab("adalo")}
                >
                    <span className="quarter-label">Adalo ({groupedByBusiness.adalo.length})</span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "tangible-ideas" ? "active" : ""}`}
                    onClick={() => setActiveTab("tangible-ideas")}
                >
                    <span className="quarter-label">
                        Tangible Ideas ({groupedByBusiness["tangible-ideas"].length})
                    </span>
                </button>
                <button
                    className={`quarter-tab ${activeTab === "no-code-effect" ? "active" : ""}`}
                    onClick={() => setActiveTab("no-code-effect")}
                >
                    <span className="quarter-label">
                        No-Code Effect ({groupedByBusiness["no-code-effect"].length})
                    </span>
                </button>
            </div>

            {/* ICPs */}
            <div className="flex flex-col gap-6">
                {icpsToShow.length === 0 ? (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No customer profiles</h3>
                        <p className="empty-state-description">
                            No active ICPs for this business area
                        </p>
                    </div>
                ) : (
                    icpsToShow.map((icp) => {
                        const businessColor = businessColors[icp.business];

                        return (
                            <div
                                key={icp._id}
                                className="card"
                                style={{ borderLeft: `4px solid ${businessColor}` }}
                            >
                                <div className="card-header">
                                    <div className="flex items-center gap-3">
                                        <h3 className="card-title">{icp.name}</h3>
                                        <span
                                            className="badge"
                                            style={{
                                                background: `${businessColor}20`,
                                                color: businessColor,
                                            }}
                                        >
                                            {businessLabels[icp.business]}
                                        </span>
                                    </div>
                                </div>

                                <p className="card-description mb-6">{icp.description}</p>

                                {/* Characteristics */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users style={{ width: "16px", height: "16px" }} />
                                        <h4 className="font-semibold">Characteristics</h4>
                                    </div>
                                    <div className="grid grid-2">
                                        {icp.characteristics.map((char, idx) => (
                                            <div
                                                key={idx}
                                                className="card"
                                                style={{
                                                    padding: "var(--space-3)",
                                                    background: "var(--color-bg-tertiary)",
                                                }}
                                            >
                                                <div className="flex items-start gap-2 text-sm">
                                                    <div
                                                        style={{
                                                            width: "6px",
                                                            height: "6px",
                                                            borderRadius: "50%",
                                                            background: businessColor,
                                                            marginTop: "6px",
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <span>{char}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pain Points */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                color: "var(--color-accent-danger)",
                                            }}
                                        />
                                        <h4 className="font-semibold">Pain Points</h4>
                                    </div>
                                    <div className="grid grid-2">
                                        {icp.painPoints.map((pain, idx) => (
                                            <div
                                                key={idx}
                                                className="card"
                                                style={{
                                                    padding: "var(--space-3)",
                                                    background: "rgba(239, 68, 68, 0.05)",
                                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                                }}
                                            >
                                                <div className="flex items-start gap-2 text-sm">
                                                    <span style={{ color: "var(--color-accent-danger)" }}>
                                                        "
                                                    </span>
                                                    <span className="flex-1" style={{ fontStyle: "italic" }}>
                                                        {pain}
                                                    </span>
                                                    <span style={{ color: "var(--color-accent-danger)" }}>
                                                        "
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Messaging */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                color: "var(--color-accent-success)",
                                            }}
                                        />
                                        <h4 className="font-semibold">Messaging & Positioning</h4>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {icp.messaging.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className="card"
                                                style={{
                                                    padding: "var(--space-3)",
                                                    background: "rgba(34, 197, 94, 0.05)",
                                                    borderLeft: "3px solid var(--color-accent-success)",
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{msg.message}</p>
                                                        <span className="badge text-xs mt-2">
                                                            {msg.channel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
