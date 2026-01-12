'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSOPs } from '@/hooks/use-sops';
import { useState } from 'react';
import { SOP_CATEGORIES, SOPCategory } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

export default function SOPDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { sops, isLoaded, updateSOP, deleteSOP } = useSOPs();
    const [isEditing, setIsEditing] = useState(false);

    // Form state for editing
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<SOPCategory>('Operations');
    const [tags, setTags] = useState('');

    const sopId = params.id as string;
    const sop = sops.find(s => s.id === sopId);

    const startEditing = () => {
        if (sop) {
            setTitle(sop.title);
            setContent(sop.content);
            setCategory(sop.category as SOPCategory);
            setTags(sop.tags.join(', '));
            setIsEditing(true);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        updateSOP(sopId, { title, content, category, tags: tagsArray });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this SOP? This cannot be undone.')) {
            deleteSOP(sopId);
            router.push('/sops');
        }
    };

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="sop-detail-header">
                    <button className="btn btn-secondary" onClick={() => router.push('/sops')}>
                        ← Back to SOPs
                    </button>
                </div>
                <div className="sop-detail-content">
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (!sop) {
        return (
            <div className="animate-fadeIn">
                <div className="sop-detail-header">
                    <button className="btn btn-secondary" onClick={() => router.push('/sops')}>
                        ← Back to SOPs
                    </button>
                </div>
                <div className="empty-state">
                    <h3 className="empty-state-title">SOP not found</h3>
                    <p className="empty-state-description">This SOP may have been deleted.</p>
                    <button className="btn btn-primary" onClick={() => router.push('/sops')}>
                        View All SOPs
                    </button>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="animate-fadeIn">
                <div className="sop-detail-header">
                    <button className="btn btn-secondary" onClick={cancelEditing}>
                        ← Cancel
                    </button>
                    <h1 className="sop-detail-title">Edit SOP</h1>
                </div>

                <form onSubmit={handleSave} className="sop-edit-form">
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
                        <label className="form-label">Tags (comma-separated)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g., clients, onboarding, important"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content (Markdown supported)</label>
                        <p className="text-muted text-sm mb-2">
                            Use # for headings, **bold**, *italic*, - or 1. for lists
                        </p>
                        <textarea
                            className="form-textarea sop-content-editor"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Step-by-step procedure..."
                            rows={20}
                            required
                        />
                    </div>

                    <div className="sop-edit-actions">
                        <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="sop-detail-header">
                <button className="btn btn-secondary" onClick={() => router.push('/sops')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to SOPs
                </button>
                <div className="sop-detail-actions">
                    <button className="btn btn-secondary" onClick={startEditing}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            {/* Article Content */}
            <article className="sop-article">
                {/* Meta */}
                <div className="sop-meta">
                    <span className="badge badge-primary">{sop.category}</span>
                    <span className="sop-date">
                        Last updated: {new Date(sop.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Title */}
                <h1 className="sop-article-title">{sop.title}</h1>

                {/* Tags */}
                {sop.tags.length > 0 && (
                    <div className="sop-tags">
                        {sop.tags.map(tag => (
                            <span key={tag} className="sop-tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Divider */}
                <hr className="sop-divider" />

                {/* Content */}
                <div className="sop-body sop-markdown">
                    <ReactMarkdown>{sop.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
}
