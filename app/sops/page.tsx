'use client';

import { useState } from 'react';
import { useSOPs } from '@/hooks/use-sops';
import { SOP_CATEGORIES, SOPCategory } from '@/lib/types';

export default function SOPsPage() {
    const { sops, isLoaded, addSOP, updateSOP, deleteSOP } = useSOPs();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSOP, setEditingSOP] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<SOPCategory>('Operations');
    const [tags, setTags] = useState('');

    const resetForm = () => {
        setTitle('');
        setContent('');
        setCategory('Operations');
        setTags('');
        setEditingSOP(null);
    };

    const openModal = (sopId?: string) => {
        if (sopId) {
            const sop = sops.find(s => s.id === sopId);
            if (sop) {
                setTitle(sop.title);
                setContent(sop.content);
                setCategory(sop.category as SOPCategory);
                setTags(sop.tags.join(', '));
                setEditingSOP(sopId);
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
        const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

        if (editingSOP) {
            updateSOP(editingSOP, { title, content, category, tags: tagsArray });
        } else {
            addSOP({ title, content, category, tags: tagsArray });
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this SOP?')) {
            deleteSOP(id);
        }
    };

    const filteredSOPs = sops.filter(sop => {
        const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sop.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || sop.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">SOPs</h1>
                    <p className="page-subtitle">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">SOPs</h1>
                    <p className="page-subtitle">Standard Operating Procedures for your business</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    New SOP
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search SOPs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All Categories</option>
                    {SOP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* SOPs Grid */}
            {filteredSOPs.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    </svg>
                    <h3 className="empty-state-title">No SOPs found</h3>
                    <p className="empty-state-description">
                        {sops.length === 0
                            ? 'Create your first SOP to get started'
                            : 'Try adjusting your search or filters'}
                    </p>
                    {sops.length === 0 && (
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            Create SOP
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-2">
                    {filteredSOPs.map(sop => (
                        <div key={sop.id} className="card">
                            <div className="card-header">
                                <div>
                                    <h3 className="card-title">{sop.title}</h3>
                                    <span className="badge badge-primary mt-2">{sop.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn-icon" onClick={() => openModal(sop.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        </svg>
                                    </button>
                                    <button className="btn-icon" onClick={() => handleDelete(sop.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-muted text-sm" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {sop.content}
                            </p>
                            {sop.tags.length > 0 && (
                                <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                                    {sop.tags.map(tag => (
                                        <span key={tag} className="badge badge-secondary" style={{
                                            background: 'var(--color-bg-tertiary)',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-muted text-sm mt-4">
                                Updated {new Date(sop.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingSOP ? 'Edit SOP' : 'New SOP'}</h3>
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
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Client Onboarding Process"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as SOPCategory)}
                                    >
                                        {SOP_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Content</label>
                                    <textarea
                                        className="form-textarea"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Step-by-step procedure..."
                                        rows={8}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="e.g., clients, onboarding, important"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingSOP ? 'Save Changes' : 'Create SOP'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
