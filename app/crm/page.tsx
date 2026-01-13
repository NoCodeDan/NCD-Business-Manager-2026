'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useContacts, useContactsNeedingFollowUp, useCreateContact, useClearFollowUp, useEnrichContact, Contact } from '../../hooks/use-contacts';
import { Id } from '../../convex/_generated/dataModel';

export default function CRMPage() {
    const contacts = useContacts();
    const followUpContactsData = useContactsNeedingFollowUp();
    const createContact = useCreateContact();
    const clearFollowUp = useClearFollowUp();

    const [emailInput, setEmailInput] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichError, setEnrichError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const enrichContact = useEnrichContact();

    // Get contacts that need follow-up (sorted by urgency)
    const followUpContacts = useMemo(() => {
        if (!followUpContactsData) return [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return followUpContactsData
            .filter(contact => contact.followUpDate)
            .map(contact => {
                const followUpDate = new Date(contact.followUpDate!);
                followUpDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return { ...contact, diffDays };
            })
            .filter(contact => contact.diffDays <= 7) // Show contacts due within 7 days
            .sort((a, b) => a.diffDays - b.diffDays);
    }, [followUpContactsData]);

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
    const markFollowUpDone = async (contactId: Id<"contacts">) => {
        await clearFollowUp({ id: contactId });
    };

    // Filter contacts by search query
    const filteredContacts = useMemo(() => {
        if (!contacts) return [];
        if (!searchQuery) return contacts;

        const query = searchQuery.toLowerCase();
        return contacts.filter(contact =>
            contact.email.toLowerCase().includes(query) ||
            contact.name.toLowerCase().includes(query) ||
            contact.company.name.toLowerCase().includes(query)
        );
    }, [contacts, searchQuery]);

    // Handle email submission for new dossier
    const handleCreateDossier = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailInput.trim()) return;

        setIsLoading(true);

        try {
            await createContact({
                name: '',
                email: emailInput.trim(),
                company: {
                    name: '',
                    role: '',
                },
                socialProfiles: [],
                recentActivity: [],
                status: 'pending',
            });
            setEmailInput('');
        } catch (error) {
            console.error('Failed to create contact:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get status badge class
    const getStatusBadge = (status: Contact['status']) => {
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

    // Loading state
    if (!contacts) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header flex justify-between items-center">
                    <div>
                        <h1 className="page-title">CRM & Dossier Creator</h1>
                        <p className="page-subtitle">Loading...</p>
                    </div>
                </div>
                <div className="flex items-center justify-center" style={{ height: '300px' }}>
                    <div className="text-muted">Loading contacts...</div>
                </div>
            </div>
        );
    }

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
                                    key={contact._id}
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
                                        {contact.name.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                {contact.name || contact.email}
                                            </span>
                                            <span className={`badge ${urgency.class}`} style={{ fontSize: '0.7rem' }}>
                                                {urgency.label}
                                            </span>
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {contact.followUpNote || 'Follow up with this contact'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => markFollowUpDone(contact._id)}
                                        className="btn btn-secondary"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Done
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Create New Dossier */}
            <div className="card mb-6">
                <h3 className="card-title mb-4">Create New Contact Dossier</h3>
                <form onSubmit={handleCreateDossier} className="flex gap-3">
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email address..."
                        className="input"
                        style={{ flex: 1 }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !emailInput.trim()}
                    >
                        {isLoading ? 'Creating...' : 'Create Dossier'}
                    </button>
                </form>
            </div>

            {/* Search and Contacts List */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title">Contacts ({contacts.length})</h3>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contacts..."
                        className="input"
                        style={{ width: '300px' }}
                    />
                </div>

                {filteredContacts.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                        <p className="text-muted">No contacts found</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredContacts.map(contact => (
                            <div
                                key={contact._id}
                                className="flex items-center gap-4"
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onClick={() => setSelectedContact(contact)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                }}
                            >
                                <div className="crm-contact-avatar" style={{
                                    width: '48px',
                                    height: '48px',
                                    flexShrink: 0,
                                    background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    fontSize: 'var(--text-lg)',
                                    fontWeight: 600,
                                    color: 'white',
                                }}>
                                    {contact.name.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                            {contact.name || 'Pending...'}
                                        </span>
                                        <span className={`badge ${getStatusBadge(contact.status)}`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted">{contact.email}</p>
                                    {contact.company.name && (
                                        <p className="text-sm text-muted">{contact.company.role} at {contact.company.name}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {contact.socialProfiles.map((profile, idx) => (
                                        <a
                                            key={idx}
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            {getPlatformIcon(profile.platform)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedContact(null)}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: 'slideUp 0.3s ease-out',
                            maxWidth: '480px',
                        }}
                    >
                        <div className="modal-header">
                            <h2 className="modal-title">Contact Profile</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        if (!selectedContact) return;
                                        setIsEnriching(true);
                                        setEnrichError(null);
                                        try {
                                            await enrichContact(selectedContact._id, selectedContact.email);
                                            // Refresh the selected contact from the updated list
                                            setSelectedContact(null);
                                        } catch (error) {
                                            setEnrichError(error instanceof Error ? error.message : 'Enrichment failed');
                                        } finally {
                                            setIsEnriching(false);
                                        }
                                    }}
                                    className="btn btn-secondary"
                                    style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' }}
                                    disabled={isEnriching}
                                >
                                    {isEnriching ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <circle cx="12" cy="12" r="10" opacity="0.3" />
                                            <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                            <path d="M16 21h5v-5" />
                                        </svg>
                                    )}
                                    {isEnriching ? 'Enriching...' : 'Refresh with AI'}
                                </button>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="btn-icon"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: 'var(--space-6)' }}>
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 700,
                                    color: 'white',
                                }}>
                                    {selectedContact.name.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 600,
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-1)',
                                    }}>
                                        {selectedContact.name || 'Pending...'}
                                    </h3>
                                    <p className="text-muted">
                                        {selectedContact.company.role ? `${selectedContact.company.role} at ` : ''}{selectedContact.company.name || selectedContact.email}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedContact.bio && (
                                <div className="mb-5">
                                    <h4 style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: 'var(--space-2)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>
                                        About
                                    </h4>
                                    <p style={{
                                        color: 'var(--color-text-primary)',
                                        lineHeight: 1.6,
                                    }}>
                                        {selectedContact.bio}
                                    </p>
                                </div>
                            )}

                            {/* Location */}
                            {selectedContact.location && (
                                <div className="flex items-center gap-2 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-muted">{selectedContact.location}</span>
                                </div>
                            )}

                            {/* Contact Actions */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-3)',
                                marginTop: 'var(--space-5)',
                                paddingTop: 'var(--space-5)',
                                borderTop: '1px solid var(--color-border)',
                            }}>
                                <a
                                    href={`mailto:${selectedContact.email}`}
                                    className="btn btn-primary"
                                    style={{ justifyContent: 'center' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    Email {selectedContact.name.split(' ')[0] || 'Contact'}
                                </a>

                                {selectedContact.socialProfiles.map((profile, idx) => (
                                    <a
                                        key={idx}
                                        href={profile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        {getPlatformIcon(profile.platform)}
                                        {profile.platform === 'LinkedIn' ? 'Connect on LinkedIn' :
                                            profile.platform.toLowerCase().includes('twitter') || profile.platform.toLowerCase() === 'x' ? 'Follow on X' :
                                                `View ${profile.platform}`}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
