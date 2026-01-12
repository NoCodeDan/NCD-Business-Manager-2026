'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBrandPartnersWithContacts, BrandPartnerWithContacts } from '../../../hooks/use-brand-partners';
import { useClients, Client } from '../../../hooks/use-clients';
import { Id } from '../../../convex/_generated/dataModel';

// Contact type from the Convex data
interface ContactFromDB {
    _id: Id<"contacts">;
    name: string;
    email: string;
    bio?: string;
    location?: string;
    company: {
        name: string;
        role: string;
        website?: string;
        industry?: string;
    };
    socialProfiles: Array<{
        platform: string;
        url: string;
        username: string;
    }>;
    status: "pending" | "enriched" | "failed";
    brandPartnerId?: Id<"brandPartners">;
}

export default function PartnersClientsPage() {
    const brandPartnersData = useBrandPartnersWithContacts();
    const clientsData = useClients();

    const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
    const [selectedContact, setSelectedContact] = useState<{ contact: ContactFromDB; brandName: string } | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Initialize expanded state after data loads
    useEffect(() => {
        if (brandPartnersData && brandPartnersData.length > 0 && !initialized) {
            setExpandedBrands(new Set(brandPartnersData.map(p => p._id)));
            setInitialized(true);
        }
    }, [brandPartnersData, initialized]);

    const toggleBrand = (brandId: string) => {
        setExpandedBrands(prev => {
            const next = new Set(prev);
            if (next.has(brandId)) {
                next.delete(brandId);
            } else {
                next.add(brandId);
            }
            return next;
        });
    };

    const openContactProfile = (contact: ContactFromDB, brandName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedContact({ contact, brandName });
    };

    const closeContactProfile = () => {
        setSelectedContact(null);
    };

    const getPartnerTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            affiliate: 'badge-success',
            referral: 'badge-primary',
            strategic: 'badge-warning',
            integration: 'badge-secondary',
        };
        return colors[type] || 'badge-primary';
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'badge-success',
            completed: 'badge-primary',
            prospect: 'badge-warning',
            pending: 'badge-warning',
            inactive: 'badge-secondary',
            churned: 'badge-danger',
        };
        return colors[status] || 'badge-secondary';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Loading state
    if (!brandPartnersData || !clientsData) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <div className="flex items-center gap-4">
                        <Link href="/crm" className="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Back to CRM
                        </Link>
                        <div>
                            <h1 className="page-title">Partners & Clients</h1>
                            <p className="page-subtitle">Loading...</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center" style={{ height: '300px' }}>
                    <div className="text-muted">Loading data...</div>
                </div>
            </div>
        );
    }

    const brandPartners = brandPartnersData;
    const clients = clientsData;

    const activeBrandPartners = brandPartners.filter(p => p.status === 'active').length;
    const totalContacts = brandPartners.reduce((sum, p) => sum + p.contacts.length, 0);
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalClientValue = clients.reduce((sum, c) => sum + (c.value || 0), 0);

    // Helper to get LinkedIn URL from social profiles
    const getLinkedIn = (contact: ContactFromDB) => {
        const profile = contact.socialProfiles.find(p => p.platform.toLowerCase() === 'linkedin');
        return profile?.url;
    };

    // Helper to get Twitter URL from social profiles
    const getTwitter = (contact: ContactFromDB) => {
        const profile = contact.socialProfiles.find(p => p.platform.toLowerCase().includes('twitter') || p.platform.toLowerCase() === 'x');
        return profile?.url;
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center gap-4">
                    <Link href="/crm" className="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to CRM
                    </Link>
                    <div>
                        <h1 className="page-title">Partners & Clients</h1>
                        <p className="page-subtitle">Manage your business relationships</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-4 mb-6">
                <div className="stat-card">
                    <p className="stat-label">Brand Partners</p>
                    <p className="stat-value">{activeBrandPartners}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Contacts</p>
                    <p className="stat-value">{totalContacts}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Active Clients</p>
                    <p className="stat-value">{activeClients}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Client Value</p>
                    <p className="stat-value">{formatCurrency(totalClientValue)}</p>
                </div>
            </div>

            {/* Brand Partners Section */}
            <div className="card mb-6">
                <div className="card-header">
                    <div>
                        <h3 className="card-title">🏢 Brand Partners</h3>
                        <p className="card-description">Strategic partnerships with companies</p>
                    </div>
                    <button className="btn btn-primary" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Partner
                    </button>
                </div>

                {brandPartners.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                        <p className="text-muted">No brand partners yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {brandPartners.map(brand => (
                            <div key={brand._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {/* Brand Row */}
                                <button
                                    onClick={() => toggleBrand(brand._id)}
                                    className="flex items-center justify-between"
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-4) var(--space-5)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 700,
                                            color: 'white',
                                        }}>
                                            {brand.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
                                                {brand.name}
                                            </span>
                                            <p className="text-sm text-muted">{brand.website}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`badge ${getPartnerTypeBadge(brand.partnerType)}`}>
                                            {brand.partnerType}
                                        </span>
                                        <span className={`badge ${getStatusBadge(brand.status)}`}>
                                            {brand.status}
                                        </span>
                                        <span className="text-sm text-muted">
                                            {brand.contacts.length} contact{brand.contacts.length !== 1 ? 's' : ''}
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                color: 'var(--color-text-muted)',
                                                transform: expandedBrands.has(brand._id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                            }}
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Contacts (shown when expanded) */}
                                {expandedBrands.has(brand._id) && brand.contacts.length > 0 && (
                                    <div style={{
                                        padding: '0 var(--space-5) var(--space-4)',
                                        marginLeft: '68px',
                                        borderLeft: '2px solid var(--color-border)',
                                        marginBottom: 'var(--space-3)',
                                    }}>
                                        {brand.notes && (
                                            <p className="text-sm text-muted mb-3" style={{ marginLeft: 'var(--space-4)' }}>
                                                📝 {brand.notes}
                                            </p>
                                        )}
                                        <div className="flex flex-col gap-2">
                                            {brand.contacts.map((contact: ContactFromDB) => (
                                                <div
                                                    key={contact._id}
                                                    className="flex items-center gap-3"
                                                    onClick={(e) => openContactProfile(contact, brand.name, e)}
                                                    style={{
                                                        padding: 'var(--space-3) var(--space-4)',
                                                        background: 'var(--color-bg-tertiary)',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-bg-hover)';
                                                        e.currentTarget.style.transform = 'translateX(4px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                                        e.currentTarget.style.transform = 'translateX(0)';
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 600,
                                                        color: 'white',
                                                    }}>
                                                        {contact.name.charAt(0)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                                {contact.name}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted">{contact.company.role}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                                            View Profile →
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clients Section */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h3 className="card-title">💼 Clients</h3>
                        <p className="card-description">Active projects and prospects</p>
                    </div>
                    <button className="btn btn-primary" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Client
                    </button>
                </div>

                {clients.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                        <p className="text-muted">No clients yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Client</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Project Type</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Status</th>
                                <th style={{ textAlign: 'right', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Value</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <div>
                                            <span className="font-semibold">{client.name}</span>
                                            <p className="text-sm text-muted">{client.company}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className="badge badge-primary">{client.projectType}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className={`badge ${getStatusBadge(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                                        <span className="font-semibold">
                                            {client.value ? formatCurrency(client.value) : '—'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className="text-sm text-muted">{client.notes || '—'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Contact Profile Modal */}
            {selectedContact && (
                <div
                    className="modal-overlay"
                    onClick={closeContactProfile}
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
                            <button
                                onClick={closeContactProfile}
                                className="btn-icon"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
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
                                    {selectedContact.contact.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: 600,
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-1)',
                                    }}>
                                        {selectedContact.contact.name}
                                    </h3>
                                    <p className="text-muted">
                                        {selectedContact.contact.company.role} at {selectedContact.brandName}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedContact.contact.bio && (
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
                                        {selectedContact.contact.bio}
                                    </p>
                                </div>
                            )}

                            {/* Location */}
                            {selectedContact.contact.location && (
                                <div className="flex items-center gap-2 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-muted">{selectedContact.contact.location}</span>
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
                                    href={`mailto:${selectedContact.contact.email}`}
                                    className="btn btn-primary"
                                    style={{ justifyContent: 'center' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    Email {selectedContact.contact.name.split(' ')[0]}
                                </a>

                                {getLinkedIn(selectedContact.contact) && (
                                    <a
                                        href={getLinkedIn(selectedContact.contact)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                        Connect on LinkedIn
                                    </a>
                                )}

                                {getTwitter(selectedContact.contact) && (
                                    <a
                                        href={getTwitter(selectedContact.contact)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        Follow on X
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
