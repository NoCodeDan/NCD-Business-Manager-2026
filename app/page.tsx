'use client';

import Link from 'next/link';
import { useSOPs } from '@/hooks/use-sops';
import { useProjects } from '@/hooks/use-projects';
import { useExpenses } from '@/hooks/use-expenses';

export default function Dashboard() {
  const { sops, isLoaded: sopsLoaded } = useSOPs();
  const { projects, isLoaded: projectsLoaded, getProgress } = useProjects();
  const { expenses, monthlyTotal, annualTotal, upcomingRenewals, isLoaded: expensesLoaded } = useExpenses();

  const isLoaded = sopsLoaded && projectsLoaded && expensesLoaded;

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isLoaded) {
    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Loading your business overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4 mb-6">
        <div className="stat-card">
          <p className="stat-label">Total SOPs</p>
          <p className="stat-value">{sops.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Projects</p>
          <p className="stat-value">{activeProjects.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Monthly Expenses</p>
          <p className="stat-value">{formatCurrency(monthlyTotal)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Annual Expenses</p>
          <p className="stat-value">{formatCurrency(annualTotal)}</p>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Active Projects</h3>
              <p className="card-description">Your current work in progress</p>
            </div>
            <Link href="/projects" className="btn btn-secondary">
              View All
            </Link>
          </div>
          {activeProjects.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No active projects yet</p>
              <Link href="/projects" className="btn btn-primary mt-4">
                Create Project
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeProjects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="card"
                  style={{ padding: 'var(--space-4)', marginBottom: 0 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--radius-full)',
                        background: project.color,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p className="font-semibold">{project.name}</p>
                      <div className="progress-bar mt-2" style={{ height: '4px' }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${getProgress(project)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted">{getProgress(project)}%</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Renewals */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Upcoming Renewals</h3>
              <p className="card-description">Next 30 days</p>
            </div>
            <Link href="/expenses" className="btn btn-secondary">
              View All
            </Link>
          </div>
          {upcomingRenewals.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No upcoming renewals</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingRenewals.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: 'var(--space-3)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <p className="font-semibold">{expense.name}</p>
                    <p className="text-sm text-muted">
                      {new Date(expense.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge badge-warning">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent SOPs */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent SOPs</h3>
              <p className="card-description">Standard operating procedures</p>
            </div>
            <Link href="/sops" className="btn btn-secondary">
              View All
            </Link>
          </div>
          {sops.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No SOPs created yet</p>
              <Link href="/sops" className="btn btn-primary mt-4">
                Create SOP
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sops.slice(0, 4).map((sop) => (
                <div
                  key={sop.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: 'var(--space-3)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <p className="font-semibold">{sop.title}</p>
                    <span className="badge badge-primary">{sop.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Quick Stats</h3>
              <p className="card-description">At a glance</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-muted">Completed Projects</span>
              <span className="font-semibold">{completedProjects.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Total Subscriptions</span>
              <span className="font-semibold">{expenses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Monthly Subscriptions</span>
              <span className="font-semibold">
                {expenses.filter(e => e.billingCycle === 'monthly').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Annual Subscriptions</span>
              <span className="font-semibold">
                {expenses.filter(e => e.billingCycle === 'annual').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
