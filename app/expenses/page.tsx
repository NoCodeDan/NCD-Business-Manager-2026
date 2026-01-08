'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/lib/types';

export default function ExpensesPage() {
    const {
        expenses,
        isLoaded,
        addExpense,
        updateExpense,
        deleteExpense,
        monthlyTotal,
        annualTotal,
        expensesByCategory
    } = useExpenses();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [filterCycle, setFilterCycle] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Form state
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [category, setCategory] = useState<ExpenseCategory>('Tools');
    const [renewalDate, setRenewalDate] = useState('');
    const [notes, setNotes] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const resetForm = () => {
        setName('');
        setAmount('');
        setBillingCycle('monthly');
        setCategory('Tools');
        setRenewalDate('');
        setNotes('');
        setEditingExpense(null);
    };

    const openModal = (expenseId?: string) => {
        if (expenseId) {
            const expense = expenses.find(e => e.id === expenseId);
            if (expense) {
                setName(expense.name);
                setAmount(expense.amount.toString());
                setBillingCycle(expense.billingCycle);
                setCategory(expense.category as ExpenseCategory);
                setRenewalDate(expense.renewalDate.split('T')[0]);
                setNotes(expense.notes || '');
                setEditingExpense(expenseId);
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

        const expenseData = {
            name,
            amount: parseFloat(amount),
            billingCycle,
            category,
            renewalDate: new Date(renewalDate).toISOString(),
            notes: notes || undefined,
        };

        if (editingExpense) {
            updateExpense(editingExpense, expenseData);
        } else {
            addExpense(expenseData);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (deleteConfirmId) {
            deleteExpense(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesCycle = filterCycle === 'all' || expense.billingCycle === filterCycle;
        const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
        return matchesCycle && matchesCategory;
    });

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Expenses</h1>
                    <p className="page-subtitle">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Expenses</h1>
                    <p className="page-subtitle">Track your subscriptions and recurring costs</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    Add Subscription
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-3 mb-6">
                <div className="stat-card">
                    <p className="stat-label">Monthly Total</p>
                    <p className="stat-value">{formatCurrency(monthlyTotal)}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Annual Total</p>
                    <p className="stat-value">{formatCurrency(annualTotal)}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Active Subscriptions</p>
                    <p className="stat-value">{expenses.length}</p>
                </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(expensesByCategory).length > 0 && (
                <div className="card mb-6">
                    <h3 className="card-title mb-4">Spending by Category (Monthly)</h3>
                    <div className="grid grid-3">
                        {Object.entries(expensesByCategory)
                            .sort(([, a], [, b]) => b - a)
                            .map(([cat, amount]) => (
                                <div key={cat} className="flex justify-between items-center" style={{
                                    padding: 'var(--space-3)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <span className="font-semibold">{cat}</span>
                                    <span className="text-muted">{formatCurrency(amount)}/mo</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select
                    className="form-select"
                    value={filterCycle}
                    onChange={(e) => setFilterCycle(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All Billing Cycles</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                </select>
                <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All Categories</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 18V6" />
                    </svg>
                    <h3 className="empty-state-title">No subscriptions found</h3>
                    <p className="empty-state-description">
                        {expenses.length === 0
                            ? 'Start tracking your subscriptions and recurring expenses'
                            : 'Try adjusting your filters'}
                    </p>
                    {expenses.length === 0 && (
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            Add Subscription
                        </button>
                    )}
                </div>
            ) : (
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Category</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Cycle</th>
                                <th style={{ textAlign: 'right', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Renewal</th>
                                <th style={{ textAlign: 'right', padding: 'var(--space-4)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 'var(--text-sm)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map(expense => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className="font-semibold">{expense.name}</span>
                                        {expense.notes && (
                                            <p className="text-sm text-muted">{expense.notes}</p>
                                        )}
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className="badge badge-primary">{expense.category}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        <span className={`badge ${expense.billingCycle === 'monthly' ? 'badge-success' : 'badge-warning'}`}>
                                            {expense.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                                        <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                                    </td>
                                    <td style={{ padding: 'var(--space-4)' }}>
                                        {new Date(expense.renewalDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                                        <div className="flex gap-2 justify-end">
                                            <button className="btn-icon" onClick={() => openModal(expense.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                </svg>
                                            </button>
                                            <button className="btn-icon" onClick={() => handleDelete(expense.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingExpense ? 'Edit Subscription' : 'Add Subscription'}</h3>
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
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Netflix, Adobe CC"
                                        required
                                    />
                                </div>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Amount ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-input"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Billing Cycle</label>
                                        <select
                                            className="form-select"
                                            value={billingCycle}
                                            onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'annual')}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="annual">Annual</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                                        >
                                            {EXPENSE_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Next Renewal Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={renewalDate}
                                            onChange={(e) => setRenewalDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Notes (optional)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any additional notes..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingExpense ? 'Save Changes' : 'Add Subscription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Delete Subscription</h3>
                            <button className="btn-icon" onClick={() => setDeleteConfirmId(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this subscription? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                                Cancel
                            </button>
                            <button className="btn" style={{ background: 'var(--color-error)', color: 'white' }} onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
