'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInitiatives } from '@/hooks/use-initiatives';
import { Initiative, INITIATIVE_CATEGORIES, InitiativeCategory, InitiativeStatus } from '@/lib/types';

type InitativeStatusType = Initiative['status'];

export default function InitiativesPage() {
    const { initiatives, isLoaded, addInitiative, updateInitiative, deleteInitiative } = useInitiatives();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Growth' as InitiativeCategory,
        status: 'on-track' as InitiativeStatus,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'Growth',
            status: 'on-track',
        });
        setEditingId(null);
    };

    const openModal = (initiativeId?: string) => {
        if (initiativeId) {
            const initiative = initiatives.find((i) => i.id === initiativeId);
            if (initiative) {
                setFormData({
                    name: initiative.name,
                    description: initiative.description,
                    category: initiative.category,
                    status: initiative.status,
                });
                setEditingId(initiativeId);
            }
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateInitiative(editingId, formData);
        } else {
            addInitiative(formData);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this initiative?')) {
            deleteInitiative(id);
        }
    };

    const getStatusBadgeClass = (status: InitativeStatusType) => {
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

    const getStatusLabel = (status: InitativeStatusType) => {
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

    if (!isLoaded) {
        return (
            <div className="page-container">
                <div className="loading-state">Loading initiatives...</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Initiatives</h1>
                    <p className="page-subtitle">Track your 2026 goals and quarterly KPIs</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    Add Initiative
                </button>
            </header>

            {initiatives.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h3>No initiatives yet</h3>
                    <p>Create your first initiative to start tracking your 2026 goals.</p>
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        Create Initiative
                    </button>
                </div>
            ) : (
                <div className="initiatives-grid">
                    {initiatives.map((initiative) => (
                        <div
                            key={initiative.id}
                            className="initiative-card"
                            style={{ borderLeftColor: initiative.color }}
                        >
                            <div className="initiative-card-header">
                                <span className={getStatusBadgeClass(initiative.status)}>
                                    {getStatusLabel(initiative.status)}
                                </span>
                                <div className="initiative-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(initiative.id);
                                        }}
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="btn-icon btn-icon-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(initiative.id);
                                        }}
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <Link href={`/initiatives/${initiative.id}`} className="initiative-card-body">
                                <h3 className="initiative-name">{initiative.name}</h3>
                                <p className="initiative-description">{initiative.description}</p>
                                <div className="initiative-meta">
                                    <span className="initiative-category">{initiative.category}</span>
                                    <span className="initiative-kpi-count">
                                        {initiative.kpis.length} KPI{initiative.kpis.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Initiative' : 'New Initiative'}</h2>
                            <button className="btn-icon" onClick={closeModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Increase Revenue"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What is this initiative about?"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as InitiativeCategory })}
                                    >
                                        {INITIATIVE_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as InitiativeStatus })}
                                    >
                                        <option value="on-track">On Track</option>
                                        <option value="at-risk">At Risk</option>
                                        <option value="behind">Behind</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Save Changes' : 'Create Initiative'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
