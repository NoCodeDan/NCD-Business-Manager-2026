'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSOPs } from '@/hooks/use-sops';
import { useProjects } from '@/hooks/use-projects';
import { useExpenses } from '@/hooks/use-expenses';
import { useInitiatives } from '@/hooks/use-initiatives';
import { UpcomingAgenda } from '@/components/dashboard/UpcomingAgenda';

// Colors for the donut chart categories
const CATEGORY_COLORS: Record<string, string> = {
  'Tools': '#6366f1',
  'Marketing': '#ec4899',
  'Hosting': '#14b8a6',
  'Software': '#8b5cf6',
  'Team': '#f97316',
  'Education': '#22c55e',
  'Other': '#64748b',
};

export default function Dashboard() {
  const { sops, isLoaded: sopsLoaded } = useSOPs();
  const { projects, isLoaded: projectsLoaded, getProgress } = useProjects();
  const { expenses, monthlyTotal, annualTotal, upcomingRenewals, expensesByCategory, isLoaded: expensesLoaded } = useExpenses();
  const { initiatives, isLoaded: initiativesLoaded } = useInitiatives();

  const isLoaded = sopsLoaded && projectsLoaded && expensesLoaded && initiativesLoaded;

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Calculate task completion stats
  const taskStats = useMemo(() => {
    const allTasks = projects.flatMap(p => p.tasks);
    const completedTasks = allTasks.filter(t => t.completed);
    return {
      total: allTasks.length,
      completed: completedTasks.length,
      percentage: allTasks.length > 0
        ? Math.round((completedTasks.length / allTasks.length) * 100)
        : 0,
    };
  }, [projects]);

  // Calculate initiative stats
  const initiativeStats = useMemo(() => {
    const onTrack = initiatives.filter(i => i.status === 'on-track').length;
    const atRisk = initiatives.filter(i => i.status === 'at-risk').length;
    const behind = initiatives.filter(i => i.status === 'behind').length;
    const completed = initiatives.filter(i => i.status === 'completed').length;
    return { onTrack, atRisk, behind, completed, total: initiatives.length };
  }, [initiatives]);

  // Generate donut chart segments
  const donutSegments = useMemo(() => {
    const entries = Object.entries(expensesByCategory);
    if (entries.length === 0) return [];

    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);
    let currentAngle = 0;

    return entries.map(([category, amount]) => {
      const percentage = (amount / total) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        category,
        amount,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: CATEGORY_COLORS[category] || '#64748b',
      };
      currentAngle += angle;
      return segment;
    });
  }, [expensesByCategory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper to create SVG arc path
  const createArcPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);

    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
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
          <p className="stat-label">Initiatives</p>
          <p className="stat-value">{initiatives.length}</p>
        </div>
      </div>

      {/* Upcoming Agenda - Full Width */}
      <div className="mb-6">
        <UpcomingAgenda projects={projects} upcomingRenewals={upcomingRenewals} />
      </div>

      <div className="grid grid-2">
        {/* Active Projects */}
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
                  className="card project-card-link"
                  style={{ padding: 'var(--space-4)', marginBottom: 0 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--radius-full)',
                        background: project.color,
                        boxShadow: `0 0 8px ${project.color}50`,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}>
                        {project.name}
                      </p>
                      <div className="progress-bar mt-2" style={{ height: '4px' }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${getProgress(project)}%`,
                            background: project.color,
                          }}
                        />
                      </div>
                    </div>
                    <span style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}>
                      {getProgress(project)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Expense Breakdown - NEW */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Expense Breakdown</h3>
              <p className="card-description">Monthly spend by category</p>
            </div>
            <Link href="/expenses" className="btn btn-secondary">
              View All
            </Link>
          </div>
          {donutSegments.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No expenses tracked yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Donut Chart */}
              <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  {donutSegments.map((segment, idx) => (
                    <path
                      key={idx}
                      d={createArcPath(segment.startAngle, segment.endAngle, 45, 28)}
                      fill={segment.color}
                      style={{ transition: 'opacity 0.2s' }}
                    />
                  ))}
                  {/* Center text */}
                  <text x="50" y="46" textAnchor="middle" fill="var(--color-text-primary)" fontSize="10" fontWeight="600">
                    {formatCurrency(monthlyTotal).replace('.00', '')}
                  </text>
                  <text x="50" y="58" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="6">
                    /month
                  </text>
                </svg>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-2" style={{ flex: 1 }}>
                {donutSegments.slice(0, 5).map((segment) => (
                  <div key={segment.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        background: segment.color,
                      }} />
                      <span className="text-sm">{segment.category}</span>
                    </div>
                    <span className="text-sm text-muted">{formatCurrency(segment.amount)}</span>
                  </div>
                ))}
              </div>
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

        {/* Initiatives Overview - NEW */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Initiatives Overview</h3>
              <p className="card-description">2026 business goals</p>
            </div>
            <Link href="/initiatives" className="btn btn-secondary">
              View All
            </Link>
          </div>
          {initiatives.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <p className="text-muted">No initiatives yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Status Pills */}
              <div className="flex gap-3 flex-wrap">
                {initiativeStats.onTrack > 0 && (
                  <div className="status-pill status-pill-success">
                    <span className="status-dot" />
                    On Track: {initiativeStats.onTrack}
                  </div>
                )}
                {initiativeStats.atRisk > 0 && (
                  <div className="status-pill status-pill-warning">
                    <span className="status-dot" />
                    At Risk: {initiativeStats.atRisk}
                  </div>
                )}
                {initiativeStats.behind > 0 && (
                  <div className="status-pill status-pill-danger">
                    <span className="status-dot" />
                    Behind: {initiativeStats.behind}
                  </div>
                )}
                {initiativeStats.completed > 0 && (
                  <div className="status-pill status-pill-primary">
                    <span className="status-dot" />
                    Completed: {initiativeStats.completed}
                  </div>
                )}
              </div>

              {/* Initiative List */}
              <div className="flex flex-col gap-2">
                {initiatives.slice(0, 3).map((initiative) => (
                  <Link
                    key={initiative.id}
                    href={`/initiatives/${initiative.id}`}
                    className="flex items-center justify-between"
                    style={{
                      padding: 'var(--space-3)',
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: initiative.color,
                      }} />
                      <span style={{ color: 'var(--color-text-primary)' }}>{initiative.name}</span>
                    </div>
                    <span className={`badge ${initiative.status === 'on-track' ? 'badge-success' :
                      initiative.status === 'at-risk' ? 'badge-warning' :
                        initiative.status === 'behind' ? 'badge-danger' :
                          'badge-primary'
                      }`}>
                      {initiative.status.replace('-', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
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

        {/* Task Completion - NEW */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Task Completion</h3>
              <p className="card-description">Across all projects</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="stat-value" style={{ fontSize: 'var(--text-3xl)' }}>
                  {taskStats.completed}
                </p>
                <p className="text-muted text-sm">of {taskStats.total} tasks completed</p>
              </div>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: taskStats.percentage >= 75 ? 'var(--color-accent-success)' :
                  taskStats.percentage >= 50 ? 'var(--color-accent-warning)' :
                    'var(--color-text-secondary)',
              }}>
                {taskStats.percentage}%
              </span>
            </div>
            <div className="progress-bar" style={{ height: '12px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${taskStats.percentage}%`,
                  background: taskStats.percentage >= 75 ? 'var(--color-accent-success)' :
                    taskStats.percentage >= 50 ? 'linear-gradient(90deg, var(--color-accent-warning), var(--color-accent-success))' :
                      'var(--color-accent-primary)',
                }}
              />
            </div>

            {/* Project breakdown */}
            <div className="flex flex-col gap-2 mt-2">
              {projects.slice(0, 3).map((project) => {
                const progress = getProgress(project);
                return (
                  <div key={project.id} className="flex items-center gap-3">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: project.color,
                    }} />
                    <span className="text-sm" style={{ flex: 1 }}>{project.name}</span>
                    <span className="text-sm text-muted">{progress}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
