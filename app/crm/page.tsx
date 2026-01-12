'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Types for contact/dossier data
interface SocialProfile {
    platform: string;
    url: string;
    username: string;
}

interface CompanyInfo {
    name: string;
    role: string;
    website: string;
    industry: string;
}

interface ContactDossier {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    bio: string;
    location: string;
    company: CompanyInfo;
    socialProfiles: SocialProfile[];
    recentActivity: string[];
    createdAt: Date;
    status: 'pending' | 'enriched' | 'failed';
    followUpDate?: Date;
    followUpNote?: string;
}

// Mock data for existing contacts
const MOCK_CONTACTS: ContactDossier[] = [
    {
        id: '1',
        email: 'sarah.chen@techstartup.io',
        name: 'Sarah Chen',
        bio: 'Product leader passionate about AI and developer tools. Previously at Stripe and Notion.',
        location: 'San Francisco, CA',
        company: {
            name: 'TechStartup.io',
            role: 'VP of Product',
            website: 'https://techstartup.io',
            industry: 'SaaS / Developer Tools',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahchen', username: 'sarahchen' },
            { platform: 'Twitter/X', url: 'https://x.com/sarahchentech', username: '@sarahchentech' },
        ],
        recentActivity: [
            'Published article: "Building Products in the AI Era"',
            'Spoke at ProductCon 2025',
            'Promoted to VP of Product',
        ],
        createdAt: new Date(2026, 0, 8),
        status: 'enriched',
        followUpDate: new Date(2026, 0, 11), // Today
        followUpNote: 'Follow up on partnership discussion',
    },
    {
        id: '2',
        email: 'marcus.johnson@ventures.capital',
        name: 'Marcus Johnson',
        bio: 'Partner at Ventures Capital. Investing in seed-stage B2B SaaS. Former founder (2x exit).',
        location: 'New York, NY',
        company: {
            name: 'Ventures Capital',
            role: 'Partner',
            website: 'https://ventures.capital',
            industry: 'Venture Capital',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/marcusjohnsonvc', username: 'marcusjohnsonvc' },
            { platform: 'Twitter/X', url: 'https://x.com/marcusvc', username: '@marcusvc' },
        ],
        recentActivity: [
            'Led Series A for DataFlow ($12M)',
            'Published "2026 SaaS Predictions"',
            'Joined board of AI startup CloudMind',
        ],
        createdAt: new Date(2026, 0, 5),
        status: 'enriched',
        followUpDate: new Date(2026, 0, 13), // In 2 days
        followUpNote: 'Send pitch deck for review',
    },
    {
        id: '3',
        email: 'pending@example.com',
        name: '',
        bio: '',
        location: '',
        company: {
            name: '',
            role: '',
            website: '',
            industry: '',
        },
        socialProfiles: [],
        recentActivity: [],
        createdAt: new Date(2026, 0, 11),
        status: 'pending',
    },
    {
        id: '4',
        email: 'alex.rivera@designco.com',
        name: 'Alex Rivera',
        bio: 'Design Director with 10+ years experience in product design. Loves creating intuitive user experiences.',
        location: 'Austin, TX',
        company: {
            name: 'DesignCo',
            role: 'Design Director',
            website: 'https://designco.com',
            industry: 'Design Agency',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexrivera', username: 'alexrivera' },
        ],
        recentActivity: [
            'Won Awwwards Site of the Day',
            'Launched new design system',
        ],
        createdAt: new Date(2026, 0, 3),
        status: 'enriched',
        followUpDate: new Date(2026, 0, 10), // Overdue (yesterday)
        followUpNote: 'Check in about design collaboration',
    },
    // Partner Contacts
    {
        id: '5',
        email: 'james@adalo.com',
        name: 'James',
        bio: 'Partnership Lead at Adalo. Passionate about empowering creators with no-code tools and building strategic partnerships in the no-code ecosystem.',
        location: 'Remote',
        company: {
            name: 'Adalo',
            role: 'Partnership Lead',
            website: 'https://adalo.com',
            industry: 'No-Code Platform',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/james-adalo', username: 'james-adalo' },
        ],
        recentActivity: [
            'Launched partner program 2.0',
            'Spoke at No-Code Summit 2025',
        ],
        createdAt: new Date(2026, 0, 12),
        status: 'enriched',
    },
    {
        id: '6',
        email: 'jason@adalo.com',
        name: 'Jason Gilmore',
        bio: 'Partnerships team member at Adalo. Focused on growing the Adalo ecosystem through strategic collaborations with educators and content creators.',
        location: 'Remote',
        company: {
            name: 'Adalo',
            role: 'Partnerships',
            website: 'https://adalo.com',
            industry: 'No-Code Platform',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/jasongilmore', username: 'jasongilmore' },
        ],
        recentActivity: [
            'Onboarded 50+ new partner creators',
            'Coordinated Adalo community event',
        ],
        createdAt: new Date(2026, 0, 12),
        status: 'enriched',
    },
    {
        id: '7',
        email: 'kari@teamtreehouse.com',
        name: 'Kari Brooks',
        bio: 'Partnerships lead at Treehouse. Dedicated to making tech education accessible through innovative partnerships and collaboration with industry experts.',
        location: 'Portland, OR',
        company: {
            name: 'Treehouse',
            role: 'Partnerships',
            website: 'https://teamtreehouse.com',
            industry: 'EdTech / Online Learning',
        },
        socialProfiles: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/karibrooks', username: 'karibrooks' },
            { platform: 'Twitter/X', url: 'https://x.com/karibrooks', username: '@karibrooks' },
        ],
        recentActivity: [
            'Expanded Treehouse partner network',
            'Launched new curriculum partnership program',
        ],
        createdAt: new Date(2026, 0, 10),
        status: 'enriched',
    },
];

export default function CRMPage() {
    const [contacts, setContacts] = useState<ContactDossier[]>(MOCK_CONTACTS);
    const [emailInput, setEmailInput] = useState('');
    const [selectedContact, setSelectedContact] = useState<ContactDossier | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get contacts that need follow-up (sorted by urgency)
    const followUpContacts = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return contacts
            .filter(contact => contact.followUpDate && contact.status === 'enriched')
            .map(contact => {
                const followUpDate = new Date(contact.followUpDate!);
                followUpDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return { ...contact, diffDays };
            })
            .filter(contact => contact.diffDays <= 7) // Show contacts due within 7 days
            .sort((a, b) => a.diffDays - b.diffDays);
    }, [contacts]);

    // Get urgency label and style
    const getUrgencyInfo = (diffDays: number) => {
        if (diffDays < 0) {
            return { label: `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`, class: 'badge-danger', urgent: true };
        } else if (diffDays === 0) {
            return { label: 'Today', class: 'badge-warning', urgent: true };
        } else if (diffDays === 1) {
            return { label: 'Tomorrow', class: 'badge-warning', urgent: false };
        } else {
            return { label: `In ${diffDays} days`, class: 'badge-primary', urgent: false };
        }
    };

    // Mark follow-up as done
    const markFollowUpDone = (contactId: string) => {
        setContacts(prev => prev.map(contact =>
            contact.id === contactId
                ? { ...contact, followUpDate: undefined, followUpNote: undefined }
                : contact
        ));
    };

    // Filter contacts by search query
    const filteredContacts = contacts.filter(contact => {
        const query = searchQuery.toLowerCase();
        return (
            contact.email.toLowerCase().includes(query) ||
            contact.name.toLowerCase().includes(query) ||
            contact.company.name.toLowerCase().includes(query)
        );
    });

    // Handle email submission for new dossier
    const handleCreateDossier = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailInput.trim()) return;

        // Create placeholder contact
        const newContact: ContactDossier = {
            id: Date.now().toString(),
            email: emailInput.trim(),
            name: '',
            bio: '',
            location: '',
            company: {
                name: '',
                role: '',
                website: '',
                industry: '',
            },
            socialProfiles: [],
            recentActivity: [],
            createdAt: new Date(),
            status: 'pending',
        };

        setContacts(prev => [newContact, ...prev]);
        setEmailInput('');

        // Simulate API call (will be replaced with Firecrawl integration)
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // In future: Call Firecrawl API here
        }, 1500);
    };

    // Get status badge class
    const getStatusBadge = (status: ContactDossier['status']) => {
        switch (status) {
            case 'enriched':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'failed':
                return 'badge-danger';
            default:
                return 'badge-primary';
        }
    };

    // Get platform icon
    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'linkedin':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                );
            case 'twitter/x':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                );
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">CRM & Dossier Creator</h1>
                    <p className="page-subtitle">Build rich contact profiles from email addresses using Firecrawl</p>
                </div>
                <Link href="/crm/partners-clients" className="btn btn-secondary">
                    🤝 Partners & Clients
                </Link>
            </div>

            {/* CRM To-Dos Section */}
            {followUpContacts.length > 0 && (
                <div className="card mb-6" style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, #8b5cf6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="card-title" style={{ marginBottom: '2px' }}>To-Do: Follow Up</h3>
                            <p className="text-sm text-muted">{followUpContacts.length} contact{followUpContacts.length > 1 ? 's' : ''} need{followUpContacts.length === 1 ? 's' : ''} attention</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {followUpContacts.map(contact => {
                            const urgency = getUrgencyInfo(contact.diffDays);
                            return (
                                <div
                                    key={contact.id}
                                    className="flex items-center gap-4"
                                    style={{
                                        padding: 'var(--space-4)',
                                        background: urgency.urgent ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: urgency.urgent ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--color-border)',
                                    }}
                                >
                                    <div className="crm-contact-avatar" style={{
                                        width: '44px',
                                        height: '44px',
                                        flexShrink: 0,
                                    }}>
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                {contact.name}
                                            </span>
                                            <span className={`badge ${urgency.class}`} style={{ fontSize: '0.7rem' }}>
                                                {urgency.label}
                                            </span>
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {contact.followUpNote || 'Follow up with this contact'}
                                        </p>
                                        <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                                            {contact.company.role} at {contact.company.name}
                                        </p>
                                    </div>
                                    <div className="flex gap-2" style={{ flexShrink: 0 }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.8rem' }}
                                            onClick={() => setSelectedContact(contact)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.8rem' }}
                                            onClick={() => markFollowUpDone(contact.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Done
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Email Input Card */}
            <div className="card mb-6">
                <h3 className="card-title mb-4">Create New Dossier</h3>
                <form onSubmit={handleCreateDossier} className="flex gap-4">
                    <div style={{ flex: 1 }}>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter email address to research..."
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !emailInput.trim()}
                    >
                        {isLoading ? (
                            <>
                                <svg className="spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Researching...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                                Research Contact
                            </>
                        )}
                    </button>
                </form>
                <p className="text-sm text-muted mt-2">
                    Powered by Firecrawl API — Automatically enriches contact data from public sources
                </p>
            </div>

            {/* Main Layout */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 400px', gap: 'var(--space-6)' }}>
                {/* Contact List */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="crm-list-header">
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Contacts</h3>
                        <div className="crm-search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="crm-list">
                        {filteredContacts.length === 0 ? (
                            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                                <p className="text-muted">No contacts found</p>
                            </div>
                        ) : (
                            filteredContacts.map(contact => (
                                <button
                                    key={contact.id}
                                    className={`crm-contact-row ${selectedContact?.id === contact.id ? 'active' : ''}`}
                                    onClick={() => setSelectedContact(contact)}
                                >
                                    <div className="crm-contact-avatar">
                                        {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="crm-contact-info">
                                        <span className="crm-contact-name">
                                            {contact.name || contact.email}
                                        </span>
                                        <span className="crm-contact-email">
                                            {contact.name ? contact.email : 'Pending enrichment...'}
                                        </span>
                                    </div>
                                    <span className={`badge ${getStatusBadge(contact.status)}`}>
                                        {contact.status}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Dossier Panel */}
                <div className="card dossier-panel">
                    {selectedContact ? (
                        selectedContact.status === 'enriched' ? (
                            <>
                                {/* Contact Header */}
                                <div className="dossier-header">
                                    <div className="dossier-avatar">
                                        {selectedContact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="dossier-name">{selectedContact.name}</h2>
                                        <p className="dossier-email">{selectedContact.email}</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="dossier-section">
                                    <h4 className="dossier-section-title">About</h4>
                                    <p className="dossier-bio">{selectedContact.bio}</p>
                                    <div className="dossier-location">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {selectedContact.location}
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="dossier-section">
                                    <h4 className="dossier-section-title">Company</h4>
                                    <div className="dossier-company-card">
                                        <div className="dossier-company-name">{selectedContact.company.name}</div>
                                        <div className="dossier-company-role">{selectedContact.company.role}</div>
                                        <div className="dossier-company-meta">
                                            <span className="badge badge-primary">{selectedContact.company.industry}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Profiles */}
                                <div className="dossier-section">
                                    <h4 className="dossier-section-title">Social Profiles</h4>
                                    <div className="dossier-social-list">
                                        {selectedContact.socialProfiles.map((profile, idx) => (
                                            <a
                                                key={idx}
                                                href={profile.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="dossier-social-link"
                                            >
                                                {getPlatformIcon(profile.platform)}
                                                <span>{profile.username}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" x2="21" y1="14" y2="3" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="dossier-section">
                                    <h4 className="dossier-section-title">Recent Activity</h4>
                                    <ul className="dossier-activity-list">
                                        {selectedContact.recentActivity.map((activity, idx) => (
                                            <li key={idx}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="dossier-actions">
                                    <button className="btn btn-primary" style={{ flex: 1 }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" x2="12" y1="15" y2="3" />
                                        </svg>
                                        Export Dossier
                                    </button>
                                    <button className="btn btn-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                        </svg>
                                        Refresh
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="dossier-pending">
                                <div className="dossier-pending-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <h3>Enrichment Pending</h3>
                                <p className="text-muted">{selectedContact.email}</p>
                                <p className="text-sm text-muted mt-4">
                                    This contact is queued for data enrichment via Firecrawl API.
                                </p>
                                <button className="btn btn-primary mt-4" disabled>
                                    <svg className="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Processing...
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="dossier-empty">
                            <div className="dossier-empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3>Select a Contact</h3>
                            <p className="text-muted">Choose a contact from the list to view their dossier</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
