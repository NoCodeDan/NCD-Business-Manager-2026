'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { useExpenses } from '@/hooks/use-expenses';
import { useInitiatives } from '@/hooks/use-initiatives';
import { useTodos } from '@/hooks/use-todos';
import { useCalendarEvents } from '@/hooks/use-calendar-events';
import {
  DollarSign,
  FolderKanban,
  Target,
  CheckSquare,
  Calendar,
  ArrowRight,
  ExternalLink,
  FileText,
  Users,
  Lightbulb
} from 'lucide-react';

export default function Dashboard() {
  const { projects, isLoaded: projectsLoaded, getProgress } = useProjects();
  const { monthlyTotal, annualTotal, upcomingRenewals, expensesByCategory, isLoaded: expensesLoaded } = useExpenses();
  const { initiatives, isLoaded: initiativesLoaded } = useInitiatives();
  const { todos, isLoaded: todosLoaded } = useTodos();
  const events = useCalendarEvents();

  const isLoaded = projectsLoaded && expensesLoaded && initiativesLoaded && todosLoaded;

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

  // Calculate todo stats
  const todoStats = useMemo(() => {
    const pending = todos?.filter(t => !t.completed) || [];
    const completed = todos?.filter(t => t.completed) || [];
    return {
      pending: pending.length,
      completed: completed.length,
      total: todos?.length || 0,
    };
  }, [todos]);

  // Calculate initiative stats
  const initiativeStats = useMemo(() => {
    const onTrack = initiatives.filter(i => i.status === 'on-track').length;
    const atRisk = initiatives.filter(i => i.status === 'at-risk').length;
    const behind = initiatives.filter(i => i.status === 'behind').length;
    const completed = initiatives.filter(i => i.status === 'completed').length;
    return { onTrack, atRisk, behind, completed, total: initiatives.length };
  }, [initiatives]);

  // Get upcoming events for today
  const todayEvents = useMemo(() => {
    if (!events) return [];
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.startDate.startsWith(today)).slice(0, 3);
  }, [events]);

  // Get pending todos
  const pendingTodos = useMemo(() => {
    return todos?.filter(t => !t.completed && !t.parentId).slice(0, 5) || [];
  }, [todos]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title" style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Dashboard</h1>
      </div>

      {/* Stats Row - 4 Cards */}
      <div className="grid grid-4 mb-6">
        {/* Monthly Expenses */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted">Monthly Expenses</span>
            <DollarSign style={{ width: '14px', height: '14px', color: 'var(--color-text-tertiary)' }} />
          </div>
          <p className="stat-value" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
            {formatCurrency(monthlyTotal)}
          </p>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            {formatCurrency(annualTotal)} annual
          </p>
          <Link href="/expenses" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
            Open expense breakdown
          </Link>
        </div>

        {/* Active Projects */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted">Active Projects</span>
          </div>
          <p className="stat-value" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
            <span>{activeProjects.length}</span>
            <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>/{projects.length}</span>
          </p>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            {completedProjects.length} completed
          </p>
          <Link href="/projects" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
            Open projects
          </Link>
        </div>

        {/* Initiatives */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted">Initiatives</span>
          </div>
          <p className="stat-value" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
            <span>{initiativeStats.onTrack}</span>
            <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-tertiary)', fontWeight: 400 }}>/{initiatives.length}</span>
          </p>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            on track
          </p>
          <Link href="/initiatives" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
            Open initiatives
          </Link>
        </div>

        {/* Task Completion */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted">Tasks Completed</span>
          </div>
          <p className="stat-value" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
            {taskStats.percentage}%
          </p>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
            {taskStats.completed} of {taskStats.total} tasks
          </p>
          <Link href="/todos" className="text-sm" style={{ color: 'var(--color-accent-primary)' }}>
            Open task list
          </Link>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
        {/* Left Column - Main Content */}
        <div className="flex flex-col gap-6">
          {/* Active Projects Section */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="flex items-center gap-3">
                <FolderKanban style={{ width: '20px', height: '20px', color: 'var(--color-accent-primary)' }} />
                <h3 className="card-title">Active Projects</h3>
              </div>
              <Link href="/projects" className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                Go to Projects <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            {activeProjects.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                <p className="text-muted">No active projects yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activeProjects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-4"
                    style={{
                      padding: 'var(--space-4)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      border: '1px solid var(--color-border)',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: 'var(--radius-full)',
                        background: project.color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                        marginBottom: 'var(--space-2)',
                      }}>
                        {project.name}
                      </p>
                      <div className="progress-bar" style={{ height: '4px' }}>
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
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                    }}>
                      {getProgress(project)}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Expense Overview */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="flex items-center gap-3">
                <DollarSign style={{ width: '20px', height: '20px', color: 'var(--color-accent-success)' }} />
                <h3 className="card-title">Expense Overview</h3>
              </div>
              <Link href="/expenses" className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-accent-primary)' }}>
                Go to Expenses <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
              {Object.entries(expensesByCategory).slice(0, 6).map(([category, amount]) => (
                <div
                  key={category}
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-2)' }}>{category}</p>
                  <p className="font-semibold">{formatCurrency(amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="flex items-center gap-3">
                <Calendar style={{ width: '20px', height: '20px', color: 'var(--color-accent-warning)' }} />
                <h3 className="card-title">Upcoming Renewals</h3>
              </div>
            </div>

            {upcomingRenewals.length === 0 ? (
              <p className="text-muted">No upcoming renewals in the next 30 days</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingRenewals.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between"
                    style={{
                      padding: 'var(--space-3)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div>
                      <p className="font-semibold">{expense.name}</p>
                      <p className="text-sm text-muted">
                        {new Date(expense.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        </div>

        {/* Right Column - Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Your To-Do List */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Your to-do list</h3>

            <div className="flex flex-col gap-3">
              {pendingTodos.length === 0 ? (
                <p className="text-muted text-sm">All caught up! 🎉</p>
              ) : (
                pendingTodos.map((todo) => (
                  <div key={todo._id} className="flex items-start gap-3">
                    <CheckSquare
                      style={{
                        width: '16px',
                        height: '16px',
                        color: 'var(--color-text-tertiary)',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <p className="text-sm" style={{ marginBottom: 'var(--space-1)' }}>{todo.title}</p>
                      <Link href="/todos" className="text-xs" style={{ color: 'var(--color-accent-primary)' }}>
                        View in Todos
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/todos"
              className="flex items-center gap-1 text-sm mt-4"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Go to Todos <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Links</h3>

            <div className="flex flex-col gap-3">
              <Link href="/sops" className="flex items-start gap-3" style={{ textDecoration: 'none' }}>
                <FileText
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--color-accent-primary)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>SOPs & Playbook</p>
                  <p className="text-xs" style={{ color: 'var(--color-accent-primary)' }}>
                    Access your operating procedures
                  </p>
                </div>
              </Link>

              <Link href="/icp" className="flex items-start gap-3" style={{ textDecoration: 'none' }}>
                <Users
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--color-accent-secondary)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Target ICPs</p>
                  <p className="text-xs" style={{ color: 'var(--color-accent-primary)' }}>
                    View customer profiles
                  </p>
                </div>
              </Link>

              <Link href="/content" className="flex items-start gap-3" style={{ textDecoration: 'none' }}>
                <Lightbulb
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--color-accent-warning)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Content Hub</p>
                  <p className="text-xs" style={{ color: 'var(--color-accent-primary)' }}>
                    Manage your content pipeline
                  </p>
                </div>
              </Link>

              <Link href="/crm" className="flex items-start gap-3" style={{ textDecoration: 'none' }}>
                <Users
                  style={{
                    width: '16px',
                    height: '16px',
                    color: 'var(--color-accent-success)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>CRM</p>
                  <p className="text-xs" style={{ color: 'var(--color-accent-primary)' }}>
                    Manage contacts & partners
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Today's Schedule</h3>

            {todayEvents.length === 0 ? (
              <p className="text-muted text-sm">No events scheduled for today</p>
            ) : (
              <div className="flex flex-col gap-3">
                {todayEvents.map((event) => (
                  <div key={event._id} className="flex items-start gap-3">
                    <Calendar
                      style={{
                        width: '16px',
                        height: '16px',
                        color: event.color || 'var(--color-accent-primary)',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <p className="text-sm">{event.title}</p>
                      <p className="text-xs text-muted">
                        {new Date(event.startDate).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/calendar"
              className="flex items-center gap-1 text-sm mt-4"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Go to Calendar <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* Initiatives Status */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Initiative Status</h3>

            <div className="flex flex-col gap-3">
              {initiativeStats.onTrack > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-success)'
                    }} />
                    <span className="text-sm">On Track</span>
                  </div>
                  <span className="text-sm font-semibold">{initiativeStats.onTrack}</span>
                </div>
              )}
              {initiativeStats.atRisk > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-warning)'
                    }} />
                    <span className="text-sm">At Risk</span>
                  </div>
                  <span className="text-sm font-semibold">{initiativeStats.atRisk}</span>
                </div>
              )}
              {initiativeStats.behind > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-danger)'
                    }} />
                    <span className="text-sm">Behind</span>
                  </div>
                  <span className="text-sm font-semibold">{initiativeStats.behind}</span>
                </div>
              )}
              {initiativeStats.completed > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-primary)'
                    }} />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-semibold">{initiativeStats.completed}</span>
                </div>
              )}
            </div>

            <Link
              href="/initiatives"
              className="flex items-center gap-1 text-sm mt-4"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Go to Initiatives <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
