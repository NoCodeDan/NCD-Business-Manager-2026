'use client';

import React from 'react';

export default function DesignSystemPage() {
    const colors = {
        backgrounds: [
            { name: '--color-bg-primary', value: '#0a0a0f', desc: 'Main app background' },
            { name: '--color-bg-secondary', value: '#12121a', desc: 'Cards, sidebar' },
            { name: '--color-bg-tertiary', value: '#1a1a25', desc: 'Inputs, nested elements' },
            { name: '--color-bg-elevated', value: '#22222f', desc: 'Elevated surfaces' },
            { name: '--color-bg-hover', value: '#2a2a3a', desc: 'Hover states' },
        ],
        accents: [
            { name: '--color-accent-primary', value: '#6366f1', desc: 'Primary actions (Indigo)' },
            { name: '--color-accent-secondary', value: '#8b5cf6', desc: 'Secondary accent (Purple)' },
            { name: '--color-accent-success', value: '#10b981', desc: 'Success states' },
            { name: '--color-accent-warning', value: '#f59e0b', desc: 'Warning states' },
            { name: '--color-accent-danger', value: '#ef4444', desc: 'Danger/error states' },
        ],
        text: [
            { name: '--color-text-primary', value: '#f8fafc', desc: 'Primary text' },
            { name: '--color-text-secondary', value: '#94a3b8', desc: 'Secondary text, placeholders' },
            { name: '--color-text-muted', value: '#64748b', desc: 'Muted/disabled text' },
        ],
    };

    const spacing = [
        { name: '--space-0', value: '0', px: '0px' },
        { name: '--space-1', value: '0.25rem', px: '4px' },
        { name: '--space-2', value: '0.5rem', px: '8px' },
        { name: '--space-3', value: '0.75rem', px: '12px' },
        { name: '--space-4', value: '1rem', px: '16px' },
        { name: '--space-5', value: '1.25rem', px: '20px' },
        { name: '--space-6', value: '1.5rem', px: '24px' },
        { name: '--space-7', value: '1.75rem', px: '28px' },
        { name: '--space-8', value: '2rem', px: '32px' },
        { name: '--space-10', value: '2.5rem', px: '40px' },
        { name: '--space-12', value: '3rem', px: '48px' },
        { name: '--space-16', value: '4rem', px: '64px' },
        { name: '--space-20', value: '5rem', px: '80px' },
        { name: '--space-24', value: '6rem', px: '96px' },
    ];

    const typography = [
        { name: '--text-xs', value: '0.75rem', px: '12px' },
        { name: '--text-sm', value: '0.875rem', px: '14px' },
        { name: '--text-base', value: '1rem', px: '16px' },
        { name: '--text-lg', value: '1.125rem', px: '18px' },
        { name: '--text-xl', value: '1.25rem', px: '20px' },
        { name: '--text-2xl', value: '1.5rem', px: '24px' },
        { name: '--text-3xl', value: '2rem', px: '32px' },
        { name: '--text-4xl', value: '2.5rem', px: '40px' },
    ];

    const radii = [
        { name: '--radius-sm', value: '0.375rem', px: '6px' },
        { name: '--radius-md', value: '0.5rem', px: '8px' },
        { name: '--radius-lg', value: '0.75rem', px: '12px' },
        { name: '--radius-xl', value: '1rem', px: '16px' },
        { name: '--radius-full', value: '9999px', px: 'Full' },
    ];

    return (
        <div className="main-content" style={{ marginLeft: 0, maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header" style={{ marginBottom: 'var(--space-10)' }}>
                <h1 className="page-title" style={{
                    background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Design System
                </h1>
                <p className="page-subtitle">
                    NCD Business Manager — Component & Token Reference
                </p>
            </div>

            {/* 4pt Grid System Notice */}
            <div className="card" style={{ marginBottom: 'var(--space-8)', borderLeft: '4px solid var(--color-accent-primary)' }}>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>📐 4pt Grid System</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    All spacing values are based on a strict 4-point grid (4px = 0.25rem). Layout dimensions, icon sizes,
                    borders, and gaps must be multiples of 4px to maintain visual consistency.
                </p>
            </div>

            {/* Colors Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Colors</h2>

                {/* Backgrounds */}
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Backgrounds</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                        {colors.backgrounds.map((color) => (
                            <div key={color.name} className="card" style={{ padding: 'var(--space-4)' }}>
                                <div style={{
                                    width: '100%',
                                    height: '48px',
                                    background: color.value,
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-3)',
                                    border: '1px solid var(--color-border)'
                                }} />
                                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)' }}>{color.name}</code>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{color.desc}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{color.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accents */}
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Accent Colors</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                        {colors.accents.map((color) => (
                            <div key={color.name} className="card" style={{ padding: 'var(--space-4)' }}>
                                <div style={{
                                    width: '100%',
                                    height: '48px',
                                    background: color.value,
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-3)'
                                }} />
                                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)' }}>{color.name}</code>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{color.desc}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{color.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Text Colors */}
                <div>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Text Colors</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                        {colors.text.map((color) => (
                            <div key={color.name} className="card" style={{ padding: 'var(--space-4)' }}>
                                <div style={{
                                    width: '100%',
                                    height: '48px',
                                    background: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <span style={{ color: color.value, fontWeight: 600 }}>Aa</span>
                                </div>
                                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)' }}>{color.name}</code>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{color.desc}</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{color.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Typography Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Typography</h2>

                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Font Families</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                                Inter — Sans Serif
                            </p>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)' }}>--font-sans</code>
                        </div>
                        <div>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                                JetBrains Mono
                            </p>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)' }}>--font-mono</code>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Type Scale</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {typography.map((size) => (
                            <div key={size.name} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
                                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)', width: '100px', flexShrink: 0 }}>{size.name}</code>
                                <span style={{ fontSize: size.value, fontWeight: 500 }}>The quick brown fox</span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{size.px}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Spacing Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Spacing Scale</h2>
                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {spacing.map((space) => (
                            <div key={space.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)', width: '100px', flexShrink: 0 }}>{space.name}</code>
                                <div style={{
                                    width: space.value,
                                    height: '16px',
                                    background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))',
                                    borderRadius: 'var(--radius-sm)'
                                }} />
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{space.px}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Border Radius Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Border Radius</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
                    {radii.map((r) => (
                        <div key={r.name} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                                borderRadius: r.value,
                                margin: '0 auto var(--space-3)'
                            }} />
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)', display: 'block' }}>{r.name}</code>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.px}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Components Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Components</h2>

                {/* Buttons */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Buttons</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button className="btn btn-primary">Primary</button>
                        <button className="btn btn-secondary">Secondary</button>
                        <button className="btn btn-danger">Danger</button>
                        <button className="btn-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.btn-primary</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.btn-secondary</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.btn-danger</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.btn-icon</code>
                    </div>
                </div>

                {/* Badges */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Badges</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="badge badge-primary">Primary</span>
                        <span className="badge badge-success">Success</span>
                        <span className="badge badge-warning">Warning</span>
                        <span className="badge badge-danger">Danger</span>
                    </div>
                    <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.badge-primary</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.badge-success</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.badge-warning</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.badge-danger</code>
                    </div>
                </div>

                {/* Status Pills */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Status Pills</h4>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="status-pill status-pill-primary"><span className="status-dot"></span>Primary</span>
                        <span className="status-pill status-pill-success"><span className="status-dot"></span>On Track</span>
                        <span className="status-pill status-pill-warning"><span className="status-dot"></span>At Risk</span>
                        <span className="status-pill status-pill-danger"><span className="status-dot"></span>Behind</span>
                    </div>
                </div>

                {/* Cards */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Cards</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Card Title</div>
                                <span className="badge badge-primary">Label</span>
                            </div>
                            <p className="card-description">This is a standard card component with a header and description.</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Stat Card</div>
                            <div className="stat-value">$12,450</div>
                            <div className="stat-change positive">+12.5%</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Progress Bar</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)' }}>25%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)' }}>75%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                    <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', display: 'block' }}>.progress-bar &gt; .progress-fill</code>
                </div>

                {/* Form Elements */}
                <div className="card">
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Form Elements</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Text Input</label>
                            <input type="text" className="form-input" placeholder="Enter text..." />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Select</label>
                            <select className="form-select">
                                <option>Option 1</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <label className="form-label">Textarea</label>
                        <textarea className="form-textarea" placeholder="Enter longer text..." style={{ minHeight: '80px' }}></textarea>
                    </div>
                </div>
            </section>

            {/* Modal Pattern Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Modal Pattern</h2>

                <div className="card" style={{ borderLeft: '4px solid var(--color-accent-success)' }}>
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>✅ Preferred Modal Style</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        Contact/Profile popup modals should follow this pattern (as seen on Partners page):
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                        <div>
                            <h5 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Structure</h5>
                            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)' }}>
                                <li>Max-width: <code>480px</code></li>
                                <li>Animations: <code>fadeIn</code> overlay, <code>slideUp</code> modal</li>
                                <li>Header: Title + close button</li>
                                <li>Content padding: <code>var(--space-6)</code></li>
                            </ul>
                        </div>
                        <div>
                            <h5 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Layout</h5>
                            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)' }}>
                                <li>72px avatar with gradient background</li>
                                <li>Name + role/company subtitle</li>
                                <li>Optional: Bio, Location sections</li>
                                <li>Bottom: Full-width action buttons (stacked)</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ background: 'var(--color-bg-tertiary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                        <h5 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Action Button Pattern</h5>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            Actions appear at bottom, separated by border. Primary action (Email) first as <code>.btn-primary</code>,
                            followed by social links as <code>.btn-secondary</code>. All buttons are full-width with <code>justify-content: center</code>.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.modal-overlay</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.modal</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.modal-header</code>
                        <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>.modal-title</code>
                    </div>
                </div>
            </section>

            {/* Utility Classes Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Utility Classes</h2>

                <div className="card">
                    <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Spacing Utilities</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Margin</p>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.m-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.mt-{'{0-24}'}, .mb-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.ml-{'{0-24}'}, .mr-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.mx-{'{0-24}'}, .my-{'{0-24}'}</code>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Padding</p>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.p-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.pt-{'{0-24}'}, .pb-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.pl-{'{0-24}'}, .pr-{'{0-24}'}</code>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.px-{'{0-24}'}, .py-{'{0-24}'}</code>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Gap</p>
                            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>.gap-{'{0-24}'}</code>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-8)',
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)'
            }}>
                NCD Business Manager Design System — Built with 💜
            </div>
        </div>
    );
}
