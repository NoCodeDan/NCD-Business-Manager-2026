'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useInitiatives } from '@/hooks/use-initiatives';
import { Quarter, KPI } from '@/lib/types';

const QUARTERS: { key: Quarter; label: string; period: string }[] = [
    { key: 'q1', label: 'Q1', period: 'Jan - Mar 2026' },
    { key: 'q2', label: 'Q2', period: 'Apr - Jun 2026' },
    { key: 'q3', label: 'Q3', period: 'Jul - Sep 2026' },
    { key: 'q4', label: 'Q4', period: 'Oct - Dec 2026' },
];

export default function InitiativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getInitiative, addKPI, updateKPI, updateKPIActual, deleteKPI, getKPIProgress, isLoaded } = useInitiatives();
    const [activeQuarter, setActiveQuarter] = useState<Quarter>('q1');
    const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
    const [editingKPIId, setEditingKPIId] = useState<string | null>(null);
    const [kpiForm, setKpiForm] = useState({
        name: '',
        unit: '',
        q1Target: 0,
        q2Target: 0,
        q3Target: 0,
        q4Target: 0,
    });

    const initiative = getInitiative(id);

    const resetKPIForm = () => {
        setKpiForm({
            name: '',
            unit: '',
            q1Target: 0,
            q2Target: 0,
            q3Target: 0,
            q4Target: 0,
        });
        setEditingKPIId(null);
    };

    const openKPIModal = (kpi?: KPI) => {
        if (kpi) {
            setKpiForm({
                name: kpi.name,
                unit: kpi.unit,
                q1Target: kpi.quarters.q1.target,
                q2Target: kpi.quarters.q2.target,
                q3Target: kpi.quarters.q3.target,
                q4Target: kpi.quarters.q4.target,
            });
            setEditingKPIId(kpi.id);
        } else {
            resetKPIForm();
        }
        setIsKPIModalOpen(true);
    };

    const closeKPIModal = () => {
        setIsKPIModalOpen(false);
        resetKPIForm();
    };

    const handleKPISubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingKPIId && initiative) {
            // Preserve existing actuals when updating
            const existingKPI = initiative.kpis.find(k => k.id === editingKPIId);
            const kpiData = {
                name: kpiForm.name,
                unit: kpiForm.unit,
                quarters: {
                    q1: { target: kpiForm.q1Target, actual: existingKPI?.quarters.q1.actual ?? null },
                    q2: { target: kpiForm.q2Target, actual: existingKPI?.quarters.q2.actual ?? null },
                    q3: { target: kpiForm.q3Target, actual: existingKPI?.quarters.q3.actual ?? null },
                    q4: { target: kpiForm.q4Target, actual: existingKPI?.quarters.q4.actual ?? null },
                },
            };
            updateKPI(id, editingKPIId, kpiData);
        } else {
            const kpiData = {
                name: kpiForm.name,
                unit: kpiForm.unit,
                quarters: {
                    q1: { target: kpiForm.q1Target, actual: null },
                    q2: { target: kpiForm.q2Target, actual: null },
                    q3: { target: kpiForm.q3Target, actual: null },
                    q4: { target: kpiForm.q4Target, actual: null },
                },
            };
            addKPI(id, kpiData);
        }
        closeKPIModal();
    };

    const handleActualUpdate = (kpiId: string, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        updateKPIActual(id, kpiId, activeQuarter, numValue);
    };

    const handleDeleteKPI = (kpiId: string) => {
        if (confirm('Are you sure you want to delete this KPI?')) {
            deleteKPI(id, kpiId);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'on-track':
                return 'initiative-status on-track';
            case 'at-risk':
                return 'initiative-status at-risk';
            case 'behind':
                return 'initiative-status behind';
            case 'completed':
                return 'initiative-status completed';
            default:
                return 'initiative-status';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'on-track':
                return 'On Track';
            case 'at-risk':
                return 'At Risk';
            case 'behind':
                return 'Behind';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    const formatValue = (value: number | null, unit: string) => {
        if (value === null) return '—';
        if (unit === '$') return `$${value.toLocaleString()}`;
        if (unit === '%') return `${value}%`;
        return `${value.toLocaleString()} ${unit}`;
    };

    if (!isLoaded) {
        return (
            <div className="page-container">
                <div className="loading-state">Loading initiative...</div>
            </div>
        );
    }

    if (!initiative) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <h3>Initiative not found</h3>
                    <p>The initiative you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/initiatives" className="btn btn-primary">
                        Back to Initiatives
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-header-nav">
                    <Link href="/initiatives" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Initiatives
                    </Link>
                </div>
                <div className="initiative-detail-header" style={{ borderLeftColor: initiative.color }}>
                    <div className="initiative-detail-info">
                        <div className="initiative-detail-title-row">
                            <h1 className="page-title">{initiative.name}</h1>
                            <span className={getStatusBadgeClass(initiative.status)}>
                                {getStatusLabel(initiative.status)}
                            </span>
                        </div>
                        <p className="page-subtitle">{initiative.description}</p>
                        <span className="initiative-category">{initiative.category}</span>
                    </div>
                </div>
            </header>

            {/* Quarter Tabs */}
            <div className="quarter-tabs">
                {QUARTERS.map((quarter) => (
                    <button
                        key={quarter.key}
                        className={`quarter-tab ${activeQuarter === quarter.key ? 'active' : ''}`}
                        onClick={() => setActiveQuarter(quarter.key)}
                    >
                        <span className="quarter-label">{quarter.label}</span>
                        <span className="quarter-period">{quarter.period}</span>
                    </button>
                ))}
            </div>

            {/* KPIs Section */}
            <div className="kpis-section">
                <div className="kpis-header">
                    <h2>Key Performance Indicators</h2>
                    <button className="btn btn-primary" onClick={() => openKPIModal()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                        </svg>
                        Add KPI
                    </button>
                </div>

                {initiative.kpis.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No KPIs defined yet. Add your first KPI to track progress.</p>
                    </div>
                ) : (
                    <div className="kpis-grid">
                        {initiative.kpis.map((kpi) => {
                            const quarterData = kpi.quarters[activeQuarter];
                            const progress = getKPIProgress(kpi, activeQuarter);
                            const hasActual = quarterData.actual !== null;

                            return (
                                <div key={kpi.id} className="kpi-card">
                                    <div className="kpi-card-header">
                                        <h3 className="kpi-name">{kpi.name}</h3>
                                        <div className="kpi-actions">
                                            <button
                                                className="btn-icon"
                                                onClick={() => openKPIModal(kpi)}
                                                title="Edit KPI"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn-icon btn-icon-danger"
                                                onClick={() => handleDeleteKPI(kpi.id)}
                                                title="Delete KPI"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="kpi-values">
                                        <div className="kpi-value-group">
                                            <span className="kpi-value-label">Target</span>
                                            <span className="kpi-value-number">
                                                {formatValue(quarterData.target, kpi.unit)}
                                            </span>
                                        </div>
                                        <div className="kpi-value-group">
                                            <span className="kpi-value-label">Actual</span>
                                            <input
                                                type="number"
                                                className="kpi-actual-input"
                                                value={quarterData.actual ?? ''}
                                                onChange={(e) => handleActualUpdate(kpi.id, e.target.value)}
                                                placeholder="Enter value"
                                            />
                                        </div>
                                    </div>

                                    <div className="kpi-progress">
                                        <div className="kpi-progress-bar">
                                            <div
                                                className="kpi-progress-fill"
                                                style={{
                                                    width: `${progress}%`,
                                                    backgroundColor: progress >= 100 ? '#22c55e' : progress >= 70 ? '#eab308' : '#ef4444',
                                                }}
                                            />
                                        </div>
                                        <span className="kpi-progress-text">
                                            {hasActual ? `${progress}%` : 'No data'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* KPI Modal */}
            {isKPIModalOpen && (
                <div className="modal-overlay" onClick={closeKPIModal}>
                    <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingKPIId ? 'Edit KPI' : 'New KPI'}</h2>
                            <button className="btn-icon" onClick={closeKPIModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleKPISubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="kpi-name">KPI Name</label>
                                    <input
                                        type="text"
                                        id="kpi-name"
                                        value={kpiForm.name}
                                        onChange={(e) => setKpiForm({ ...kpiForm, name: e.target.value })}
                                        placeholder="e.g., Monthly Revenue"
                                        required
                                    />
                                </div>
                                <div className="form-group form-group-small">
                                    <label htmlFor="kpi-unit">Unit</label>
                                    <input
                                        type="text"
                                        id="kpi-unit"
                                        value={kpiForm.unit}
                                        onChange={(e) => setKpiForm({ ...kpiForm, unit: e.target.value })}
                                        placeholder="e.g., $, %, users"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Quarterly Targets</h3>
                                <div className="form-row-4">
                                    <div className="form-group">
                                        <label htmlFor="q1-target">Q1 Target</label>
                                        <input
                                            type="number"
                                            id="q1-target"
                                            value={kpiForm.q1Target}
                                            onChange={(e) => setKpiForm({ ...kpiForm, q1Target: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="q2-target">Q2 Target</label>
                                        <input
                                            type="number"
                                            id="q2-target"
                                            value={kpiForm.q2Target}
                                            onChange={(e) => setKpiForm({ ...kpiForm, q2Target: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="q3-target">Q3 Target</label>
                                        <input
                                            type="number"
                                            id="q3-target"
                                            value={kpiForm.q3Target}
                                            onChange={(e) => setKpiForm({ ...kpiForm, q3Target: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="q4-target">Q4 Target</label>
                                        <input
                                            type="number"
                                            id="q4-target"
                                            value={kpiForm.q4Target}
                                            onChange={(e) => setKpiForm({ ...kpiForm, q4Target: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeKPIModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingKPIId ? 'Save Changes' : 'Create KPI'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
