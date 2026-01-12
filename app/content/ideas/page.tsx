'use client';

import { useState } from 'react';

interface ContentIdea {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'draft' | 'ready' | 'in-progress' | 'published';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const MOCK_IDEAS: ContentIdea[] = [
    {
        id: '1',
        title: 'AI Tools Comparison: 2026 Edition',
        description: 'Compare Cursor, Copilot, Claude, and other AI coding assistants. Include pricing, features, and real-world use cases.',
        category: 'Video',
        status: 'ready',
        tags: ['AI', 'Developer Tools', 'Tutorial'],
        createdAt: new Date(2026, 0, 8),
        updatedAt: new Date(2026, 0, 11),
    },
    {
        id: '2',
        title: 'No-Code Automation Masterclass',
        description: 'Step-by-step guide to building automations with Make, Zapier, and n8n. Target audience: solopreneurs.',
        category: 'Blog',
        status: 'in-progress',
        tags: ['No-Code', 'Automation', 'Tutorial'],
        createdAt: new Date(2026, 0, 5),
        updatedAt: new Date(2026, 0, 10),
    },
    {
        id: '3',
        title: '5 Keyboard Shortcuts That Save Hours',
        description: 'Quick productivity hack video showing essential VS Code and Mac shortcuts for developers.',
        category: 'Short-form',
        status: 'published',
        tags: ['Productivity', 'Quick Tips'],
        createdAt: new Date(2026, 0, 3),
        updatedAt: new Date(2026, 0, 7),
    },
    {
        id: '4',
        title: 'Building in Public: Weekly Update',
        description: 'Share progress on NCD Business Manager build. Include metrics, challenges, and learnings.',
        category: 'Newsletter',
        status: 'draft',
        tags: ['Building in Public', 'Update'],
        createdAt: new Date(2026, 0, 10),
        updatedAt: new Date(2026, 0, 10),
    },
    {
        id: '5',
        title: 'Twitter Thread: My Tech Stack 2026',
        description: 'Break down the tools and technologies I use daily. Include why I chose each one.',
        category: 'Social',
        status: 'ready',
        tags: ['Tech Stack', 'Thread'],
        createdAt: new Date(2026, 0, 9),
        updatedAt: new Date(2026, 0, 11),
    },
];

const CATEGORIES = ['All', 'Blog', 'Video', 'Short-form', 'Social', 'Newsletter'];
const STATUSES = ['All', 'draft', 'ready', 'in-progress', 'published'];

export default function IdeasPage() {
    const [ideas] = useState<ContentIdea[]>(MOCK_IDEAS);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);

    const filteredIdeas = ideas.filter(idea => {
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || idea.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || idea.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusBadge = (status: ContentIdea['status']) => {
        switch (status) {
            case 'draft': return 'badge-warning';
            case 'ready': return 'badge-primary';
            case 'in-progress': return 'badge-primary';
            case 'published': return 'badge-success';
            default: return 'badge-primary';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Blog': return '#6366f1';
            case 'Video': return '#ef4444';
            case 'Short-form': return '#06b6d4';
            case 'Social': return '#22c55e';
            case 'Newsletter': return '#f59e0b';
            default: return '#64748b';
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Stored Ideas</h1>
                    <p className="page-subtitle">Your organized library of content ideas</p>
                </div>
                <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Idea
                </button>
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="ideas-toolbar">
                    <div className="ideas-search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="ideas-filters">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                </option>
                            ))}
                        </select>
                        <div className="view-toggle">
                            <button
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="7" x="3" y="3" rx="1" />
                                    <rect width="7" height="7" x="14" y="3" rx="1" />
                                    <rect width="7" height="7" x="14" y="14" rx="1" />
                                    <rect width="7" height="7" x="3" y="14" rx="1" />
                                </svg>
                            </button>
                            <button
                                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" x2="21" y1="6" y2="6" />
                                    <line x1="8" x2="21" y1="12" y2="12" />
                                    <line x1="8" x2="21" y1="18" y2="18" />
                                    <line x1="3" x2="3.01" y1="6" y2="6" />
                                    <line x1="3" x2="3.01" y1="12" y2="12" />
                                    <line x1="3" x2="3.01" y1="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ideas Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-3' : 'ideas-list'}>
                {filteredIdeas.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <h3 className="empty-state-title">No ideas found</h3>
                        <p className="empty-state-description">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredIdeas.map(idea => (
                        <button
                            key={idea.id}
                            className={`idea-card ${viewMode === 'list' ? 'idea-card-list' : ''}`}
                            onClick={() => setSelectedIdea(idea)}
                            style={{ '--idea-color': getCategoryColor(idea.category) } as React.CSSProperties}
                        >
                            <div className="idea-card-header">
                                <span className="idea-card-category">{idea.category}</span>
                                <span className={`badge ${getStatusBadge(idea.status)}`}>
                                    {idea.status.replace('-', ' ')}
                                </span>
                            </div>
                            <h3 className="idea-card-title">{idea.title}</h3>
                            <p className="idea-card-description">{idea.description}</p>
                            <div className="idea-card-tags">
                                {idea.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="idea-tag">{tag}</span>
                                ))}
                            </div>
                            <div className="idea-card-footer">
                                <span className="idea-card-date">
                                    Updated {idea.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Idea Detail Modal */}
            {selectedIdea && (
                <div className="modal-overlay" onClick={() => setSelectedIdea(null)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span
                                    className="idea-modal-category"
                                    style={{ color: getCategoryColor(selectedIdea.category) }}
                                >
                                    {selectedIdea.category}
                                </span>
                                <h3 className="modal-title">{selectedIdea.title}</h3>
                            </div>
                            <button className="btn-icon" onClick={() => setSelectedIdea(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`badge ${getStatusBadge(selectedIdea.status)}`}>
                                    {selectedIdea.status.replace('-', ' ')}
                                </span>
                                <span className="text-muted text-sm">
                                    Created {selectedIdea.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <p style={{ marginBottom: 'var(--space-4)', lineHeight: 1.7 }}>
                                {selectedIdea.description}
                            </p>
                            <div className="idea-card-tags">
                                {selectedIdea.tags.map(tag => (
                                    <span key={tag} className="idea-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary">Edit</button>
                            <button className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3v12M8 11l4 4 4-4" />
                                    <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
                                </svg>
                                Repurpose
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
