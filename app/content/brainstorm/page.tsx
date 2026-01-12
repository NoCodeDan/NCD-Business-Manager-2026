'use client';

import { useState } from 'react';

interface BrainstormIdea {
    id: string;
    content: string;
    category: string;
    color: string;
    createdAt: Date;
}

const CATEGORIES = [
    { name: 'Blog', color: '#6366f1' },
    { name: 'Video', color: '#ef4444' },
    { name: 'Short-form', color: '#06b6d4' },
    { name: 'Social', color: '#22c55e' },
    { name: 'Newsletter', color: '#f59e0b' },
];

const MOCK_IDEAS: BrainstormIdea[] = [
    { id: '1', content: 'Compare top 5 AI coding assistants', category: 'Video', color: '#ef4444', createdAt: new Date(2026, 0, 11) },
    { id: '2', content: 'No-code automation workflow tutorial', category: 'Blog', color: '#6366f1', createdAt: new Date(2026, 0, 11) },
    { id: '3', content: '60-sec productivity hack: Keyboard shortcuts', category: 'Short-form', color: '#06b6d4', createdAt: new Date(2026, 0, 10) },
    { id: '4', content: 'Weekly tech news roundup thread', category: 'Social', color: '#22c55e', createdAt: new Date(2026, 0, 10) },
    { id: '5', content: 'Behind the scenes: My content workflow', category: 'Video', color: '#ef4444', createdAt: new Date(2026, 0, 9) },
    { id: '6', content: 'Building in public: January update', category: 'Newsletter', color: '#f59e0b', createdAt: new Date(2026, 0, 9) },
];

export default function BrainstormPage() {
    const [ideas, setIdeas] = useState<BrainstormIdea[]>(MOCK_IDEAS);
    const [newIdea, setNewIdea] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Blog');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdea.trim()) return;

        const category = CATEGORIES.find(c => c.name === selectedCategory);
        const idea: BrainstormIdea = {
            id: Date.now().toString(),
            content: newIdea.trim(),
            category: selectedCategory,
            color: category?.color || '#6366f1',
            createdAt: new Date(),
        };

        setIdeas([idea, ...ideas]);
        setNewIdea('');
    };

    const handleDeleteIdea = (id: string) => {
        setIdeas(ideas.filter(i => i.id !== id));
    };

    const handlePromoteIdea = (idea: BrainstormIdea) => {
        // In future: Move to stored ideas
        alert(`"${idea.content}" promoted to Stored Ideas!`);
    };

    const filteredIdeas = filterCategory
        ? ideas.filter(i => i.category === filterCategory)
        : ideas;

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Brainstorm</h1>
                    <p className="page-subtitle">Capture ideas quickly — no judgment, just flow</p>
                </div>
            </div>

            {/* Quick Capture */}
            <div className="card mb-6">
                <h3 className="card-title mb-4">Quick Capture</h3>
                <form onSubmit={handleAddIdea} className="brainstorm-form">
                    <div className="brainstorm-input-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="What's on your mind? Capture that idea..."
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ width: '140px', flexShrink: 0 }}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary" disabled={!newIdea.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter Pills */}
            <div className="brainstorm-filters mb-6">
                <button
                    className={`filter-pill ${filterCategory === null ? 'active' : ''}`}
                    onClick={() => setFilterCategory(null)}
                >
                    All
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.name}
                        className={`filter-pill ${filterCategory === cat.name ? 'active' : ''}`}
                        onClick={() => setFilterCategory(cat.name)}
                        style={{ '--pill-color': cat.color } as React.CSSProperties}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Sticky Notes Grid */}
            <div className="sticky-notes-grid">
                {filteredIdeas.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div className="empty-state-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">No ideas yet</h3>
                        <p className="empty-state-description">Start capturing your thoughts above!</p>
                    </div>
                ) : (
                    filteredIdeas.map(idea => (
                        <div
                            key={idea.id}
                            className="sticky-note"
                            style={{ '--note-color': idea.color } as React.CSSProperties}
                        >
                            <div className="sticky-note-header">
                                <span className="sticky-note-category">{idea.category}</span>
                                <button
                                    className="sticky-note-delete"
                                    onClick={() => handleDeleteIdea(idea.id)}
                                    title="Delete idea"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="sticky-note-content">{idea.content}</p>
                            <div className="sticky-note-footer">
                                <span className="sticky-note-date">
                                    {idea.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <button
                                    className="sticky-note-promote"
                                    onClick={() => handlePromoteIdea(idea)}
                                    title="Promote to Stored Ideas"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 19V5M5 12l7-7 7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
