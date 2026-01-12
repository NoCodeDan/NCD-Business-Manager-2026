'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface Partner {
    id: string;
    name: string;
    company: string;
    email: string;
    role: string;
    partnerType: 'affiliate' | 'referral' | 'strategic' | 'integration';
    status: 'active' | 'inactive' | 'pending';
    notes?: string;
    createdAt: string;
}

interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    projectType: string;
    status: 'active' | 'completed' | 'prospect' | 'churned';
    value?: number;
    notes?: string;
    createdAt: string;
}

// Mock data
const MOCK_PARTNERS: Partner[] = [
    {
        id: '1',
        name: 'Jordan Lee',
        company: 'TechFlow Solutions',
        email: 'jordan@techflow.io',
        role: 'Partnerships Lead',
        partnerType: 'strategic',
        status: 'active',
        notes: 'Co-marketing agreement in place',
        createdAt: '2026-01-05',
    },
    {
        id: '2',
        name: 'Priya Sharma',
        company: 'Affiliate Pro',
        email: 'priya@affiliatepro.com',
        role: 'Affiliate Manager',
        partnerType: 'affiliate',
        status: 'active',
        notes: '15% commission on referrals',
        createdAt: '2026-01-02',
    },
    {
        id: '3',
        name: 'Mike Chen',
        company: 'DevTools Inc',
        email: 'mike@devtools.co',
        role: 'Integration Lead',
        partnerType: 'integration',
        status: 'pending',
        notes: 'API integration discussion',
        createdAt: '2026-01-10',
    },
];

const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        company: 'Startup Labs',
        email: 'sarah@startuplabs.io',
        projectType: 'Web Development',
        status: 'active',
        value: 15000,
        notes: 'MVP development in progress',
        createdAt: '2026-01-08',
    },
    {
        id: '2',
        name: 'David Kim',
        company: 'E-Commerce Plus',
        email: 'david@ecomplus.com',
        projectType: 'Automation',
        status: 'active',
        value: 8500,
        notes: 'Zapier integrations',
        createdAt: '2026-01-03',
    },
    {
        id: '3',
        name: 'Emily Brown',
        company: 'Creative Agency',
        email: 'emily@creativeco.design',
        projectType: 'Consulting',
        status: 'completed',
        value: 5000,
        createdAt: '2025-12-15',
    },
    {
        id: '4',
        name: 'Alex Turner',
        company: 'NextGen Apps',
        email: 'alex@nextgenapps.io',
        projectType: 'Mobile App',
        status: 'prospect',
        value: 25000,
        notes: 'Proposal sent, awaiting response',
        createdAt: '2026-01-11',
    },
];

export default function PartnersClientsPage() {
    const [partners] = useState<Partner[]>(MOCK_PARTNERS);
    const [clients] = useState<Client[]>(MOCK_CLIENTS);

    const getPartnerTypeBadge = (type: Partner['partnerType']) => {
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

    const activePartners = partners.filter(p => p.status === 'active').length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalClientValue = clients.reduce((sum, c) => sum + (c.value || 0), 0);

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
                    <p className="stat-label">Active Partners</p>
                    <p className="stat-value">{activePartners}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Partners</p>
                    <p className="stat-value">{partners.length}</p>
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

            {/* Partners Section */}
            <div className="card mb-6">
                <div className="card-header">
                    <div>
                        <h3 className="card-title">🤝 Partners</h3>
                        <p className="card-description">Affiliates, referrals, and strategic partners</p>
                    </div>
                    <button className="btn btn-primary" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Partner
                    </button>
                </div>

                {partners.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                        <p className="text-muted">No partners yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Partner</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map(partner => (
                                <tr key={partner.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <div>
                                            <span className="font-semibold">{partner.name}</span>
                                            <p className="text-sm text-muted">{partner.role} at {partner.company}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className={`badge ${getPartnerTypeBadge(partner.partnerType)}`}>
                                            {partner.partnerType}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className={`badge ${getStatusBadge(partner.status)}`}>
                                            {partner.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className="text-sm text-muted">{partner.notes || '—'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                <tr key={client.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
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
        </div>
    );
}
