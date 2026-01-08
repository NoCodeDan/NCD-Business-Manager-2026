'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { Project } from '@/lib/types';

type ProjectStatus = Project['status'];

export default function ProjectsPage() {
    const { projects, isLoaded, addProject, updateProject, deleteProject, getProgress } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProjectStatus>('active');
    const [deadline, setDeadline] = useState('');

    const resetForm = () => {
        setName('');
        setDescription('');
        setStatus('active');
        setDeadline('');
        setEditingProject(null);
    };

    const openModal = (projectId?: string) => {
        if (projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                setName(project.name);
                setDescription(project.description);
                setStatus(project.status);
                setDeadline(project.deadline || '');
                setEditingProject(projectId);
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

        if (editingProject) {
            updateProject(editingProject, { name, description, status, deadline: deadline || undefined });
        } else {
            addProject({ name, description, status, deadline: deadline || undefined });
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    const getStatusBadgeClass = (status: ProjectStatus) => {
        switch (status) {
            case 'active': return 'badge-success';
            case 'paused': return 'badge-warning';
            case 'completed': return 'badge-primary';
            case 'archived': return 'badge-secondary';
            default: return '';
        }
    };

    const filteredProjects = projects.filter(project => {
        return filterStatus === 'all' || project.status === filterStatus;
    });

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Manage your active and archived projects</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    New Project
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <h3 className="empty-state-title">No projects found</h3>
                    <p className="empty-state-description">
                        {projects.length === 0
                            ? 'Create your first project to get started'
                            : 'Try adjusting your filters'}
                    </p>
                    {projects.length === 0 && (
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            Create Project
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-3">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="card">
                            <div className="card-header">
                                <div className="flex items-center gap-3">
                                    <div
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: 'var(--radius-full)',
                                            background: project.color,
                                        }}
                                    />
                                    <h3 className="card-title">{project.name}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn-icon" onClick={() => openModal(project.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        </svg>
                                    </button>
                                    <button className="btn-icon" onClick={() => handleDelete(project.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <p className="text-muted text-sm mb-4" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {project.description || 'No description'}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                                <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                                {project.deadline && (
                                    <span className="text-sm text-muted">
                                        Due: {new Date(project.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-muted">Progress</span>
                                    <span className="text-sm font-semibold">{getProgress(project)}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${getProgress(project)}%` }} />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted">
                                    {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
                                </span>
                                <Link href={`/projects/${project.id}`} className="btn btn-secondary" style={{ padding: 'var(--space-2) var(--space-4)' }}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                            <button className="btn-icon" onClick={closeModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Website Redesign"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the project..."
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline (optional)</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProject ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
