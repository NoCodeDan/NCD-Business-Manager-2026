'use client';

import { useState } from 'react';

interface ContentFormat {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    wordCount: string;
    template: string[];
}

interface SourceContent {
    id: string;
    title: string;
    description: string;
    category: string;
}

const FORMATS: ContentFormat[] = [
    {
        id: 'blog',
        name: 'Long-form Blog',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
            </svg>
        ),
        description: '1,500-3,000 words with SEO optimization',
        wordCount: '1,500-3,000 words',
        template: [
            '📌 Headline & Hook',
            '🎯 Introduction (Problem statement)',
            '📖 Main Body (3-5 key sections)',
            '💡 Key Takeaways',
            '🔗 Call-to-Action',
        ],
    },
    {
        id: 'youtube',
        name: 'YouTube Script',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
            </svg>
        ),
        description: '8-15 minute video with timestamps',
        wordCount: '1,200-2,000 words',
        template: [
            '🎬 Hook (0:00-0:30)',
            '📢 Intro & Context (0:30-1:30)',
            '📝 Main Content (1:30-12:00)',
            '🎯 Key Points Recap',
            '📣 CTA & Outro',
        ],
    },
    {
        id: 'short',
        name: '60-sec Video Script',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
            </svg>
        ),
        description: 'TikTok/Reels/Shorts format',
        wordCount: '120-180 words',
        template: [
            '⚡ Hook (0-3 sec)',
            '🎯 Problem/Setup (3-15 sec)',
            '💡 Solution/Value (15-45 sec)',
            '🔥 Punchline/CTA (45-60 sec)',
        ],
    },
    {
        id: 'thread',
        name: 'Twitter/X Thread',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        description: '5-10 tweets with engagement hooks',
        wordCount: '500-800 words',
        template: [
            '1/ 🧵 Opening hook tweet',
            '2-8/ 💡 Value tweets (key points)',
            '9/ 📊 Summary or proof',
            '10/ 🔗 CTA + retweet ask',
        ],
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Post',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
        description: 'Professional tone with storytelling',
        wordCount: '200-400 words',
        template: [
            '📌 Hook line (pattern interrupt)',
            '📖 Story or context',
            '💡 Key insights (bullet points)',
            '❓ Engagement question',
        ],
    },
];

const MOCK_SOURCES: SourceContent[] = [
    { id: '1', title: 'AI Tools Comparison: 2026 Edition', description: 'Compare Cursor, Copilot, Claude...', category: 'Video' },
    { id: '2', title: 'No-Code Automation Masterclass', description: 'Step-by-step guide to building automations...', category: 'Blog' },
    { id: '3', title: 'My Tech Stack 2026', description: 'Break down the tools and technologies...', category: 'Social' },
];

export default function RepurposePage() {
    const [selectedSource, setSelectedSource] = useState<SourceContent | null>(MOCK_SOURCES[0]);
    const [selectedFormat, setSelectedFormat] = useState<string>('blog');
    const [formatStatus, setFormatStatus] = useState<Record<string, 'not-started' | 'in-progress' | 'complete'>>({
        blog: 'not-started',
        youtube: 'not-started',
        short: 'not-started',
        thread: 'not-started',
        linkedin: 'not-started',
    });

    const currentFormat = FORMATS.find(f => f.id === selectedFormat);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'complete': return 'badge-success';
            case 'in-progress': return 'badge-warning';
            default: return 'badge-primary';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'complete': return 'Complete';
            case 'in-progress': return 'In Progress';
            default: return 'Not Started';
        }
    };

    const handleStartFormat = () => {
        setFormatStatus(prev => ({ ...prev, [selectedFormat]: 'in-progress' }));
    };

    const handleCompleteFormat = () => {
        setFormatStatus(prev => ({ ...prev, [selectedFormat]: 'complete' }));
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Repurpose Content</h1>
                    <p className="page-subtitle">Transform one idea into multiple content formats</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)' }}>
                {/* Sidebar - Source Selection */}
                <div className="flex flex-col gap-4">
                    <div className="card">
                        <h3 className="card-title mb-4">Source Content</h3>
                        <div className="repurpose-source-list">
                            {MOCK_SOURCES.map(source => (
                                <button
                                    key={source.id}
                                    className={`repurpose-source-item ${selectedSource?.id === source.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSource(source)}
                                >
                                    <span className="repurpose-source-title">{source.title}</span>
                                    <span className="repurpose-source-category">{source.category}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format Progress */}
                    <div className="card">
                        <h3 className="card-title mb-4">Format Progress</h3>
                        <div className="repurpose-progress-list">
                            {FORMATS.map(format => (
                                <div key={format.id} className="repurpose-progress-item">
                                    <span>{format.name}</span>
                                    <span className={`badge ${getStatusBadge(formatStatus[format.id])}`}>
                                        {getStatusLabel(formatStatus[format.id])}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-4">
                    {/* Format Tabs */}
                    <div className="repurpose-tabs">
                        {FORMATS.map(format => (
                            <button
                                key={format.id}
                                className={`repurpose-tab ${selectedFormat === format.id ? 'active' : ''}`}
                                onClick={() => setSelectedFormat(format.id)}
                            >
                                <span className="repurpose-tab-icon">{format.icon}</span>
                                <span className="repurpose-tab-name">{format.name}</span>
                                {formatStatus[format.id] === 'complete' && (
                                    <svg className="repurpose-tab-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Format Details Panel */}
                    {currentFormat && (
                        <div className="card repurpose-panel">
                            <div className="repurpose-panel-header">
                                <div>
                                    <h2 className="repurpose-panel-title">{currentFormat.name}</h2>
                                    <p className="repurpose-panel-description">{currentFormat.description}</p>
                                </div>
                                <span className={`badge ${getStatusBadge(formatStatus[selectedFormat])}`}>
                                    {getStatusLabel(formatStatus[selectedFormat])}
                                </span>
                            </div>

                            <div className="repurpose-panel-meta">
                                <div className="repurpose-meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                    </svg>
                                    <span>{currentFormat.wordCount}</span>
                                </div>
                            </div>

                            <div className="repurpose-template">
                                <h4 className="repurpose-template-title">Template Structure</h4>
                                <ul className="repurpose-template-list">
                                    {currentFormat.template.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Content Editor Placeholder */}
                            <div className="repurpose-editor">
                                <textarea
                                    className="form-textarea"
                                    placeholder={`Start writing your ${currentFormat.name.toLowerCase()} content here...\n\nSource: ${selectedSource?.title || 'Select a source'}`}
                                    style={{ minHeight: '200px' }}
                                />
                            </div>

                            <div className="repurpose-panel-actions">
                                {formatStatus[selectedFormat] === 'not-started' && (
                                    <button className="btn btn-primary" onClick={handleStartFormat}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        Start Writing
                                    </button>
                                )}
                                {formatStatus[selectedFormat] === 'in-progress' && (
                                    <>
                                        <button className="btn btn-secondary">Save Draft</button>
                                        <button className="btn btn-primary" onClick={handleCompleteFormat}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Mark Complete
                                        </button>
                                    </>
                                )}
                                {formatStatus[selectedFormat] === 'complete' && (
                                    <>
                                        <button className="btn btn-secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                            Copy
                                        </button>
                                        <button className="btn btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" x2="12" y1="15" y2="3" />
                                            </svg>
                                            Export
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
