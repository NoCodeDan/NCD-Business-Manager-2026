'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { projects, isLoaded, getProject, updateProject, addTask, toggleTask, deleteTask, getProgress } = useProjects();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const projectId = params.id as string;
    const project = getProject(projectId);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(projectId, newTaskTitle.trim());
            setNewTaskTitle('');
        }
    };

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Loading...</h1>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">Project Not Found</h1>
                    <p className="page-subtitle">The project you&apos;re looking for doesn&apos;t exist.</p>
                </div>
                <Link href="/projects" className="btn btn-primary">
                    Back to Projects
                </Link>
            </div>
        );
    }

    const progress = getProgress(project);
    const completedTasks = project.tasks.filter(t => t.completed).length;

    return (
        <div className="animate-fadeIn">
            {/* Back Link */}
            <Link href="/projects" className="flex items-center gap-2 text-muted mb-6" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                Back to Projects
            </Link>

            {/* Header */}
            <div className="page-header flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--radius-full)',
                            background: project.color,
                        }}
                    />
                    <div>
                        <h1 className="page-title">{project.name}</h1>
                        <p className="page-subtitle">{project.description || 'No description'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select
                        className="form-select"
                        value={project.status}
                        onChange={(e) => updateProject(projectId, { status: e.target.value as typeof project.status })}
                        style={{ width: 'auto' }}
                    >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Progress Card */}
            <div className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="card-title">Progress</h3>
                        <p className="text-muted text-sm">{completedTasks} of {project.tasks.length} tasks completed</p>
                    </div>
                    <span className="stat-value">{progress}%</span>
                </div>
                <div className="progress-bar" style={{ height: '12px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="grid grid-2">
                {/* Tasks */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Tasks</h3>
                    </div>

                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Add a new task..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>

                    {/* Task List */}
                    {project.tasks.length === 0 ? (
                        <p className="text-muted text-center" style={{ padding: 'var(--space-8)' }}>
                            No tasks yet. Add one above!
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {project.tasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-md)',
                                    }}
                                >
                                    <label className="flex items-center gap-3" style={{ cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(projectId, task.id)}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                accentColor: 'var(--color-accent-primary)',
                                            }}
                                        />
                                        <span style={{
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                                        }}>
                                            {task.title}
                                        </span>
                                    </label>
                                    <button
                                        className="btn-icon"
                                        onClick={() => deleteTask(projectId, task.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Project Info */}
                <div className="card">
                    <h3 className="card-title mb-4">Project Details</h3>

                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-muted text-sm">Status</p>
                            <span
                                className={`badge ${project.status === 'active' ? 'badge-success' :
                                        project.status === 'paused' ? 'badge-warning' :
                                            project.status === 'completed' ? 'badge-primary' :
                                                'badge-secondary'
                                    }`}
                            >
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                        </div>

                        {project.deadline && (
                            <div>
                                <p className="text-muted text-sm">Deadline</p>
                                <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-muted text-sm">Created</p>
                            <p className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div>
                            <p className="text-muted text-sm">Last Updated</p>
                            <p className="font-semibold">{new Date(project.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
