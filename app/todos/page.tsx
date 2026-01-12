'use client';

import { useState } from 'react';
import { useTodos, Todo } from '@/hooks/use-todos';

export default function TodosPage() {
    const {
        todos,
        isLoaded,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        completedCount,
        pendingCount,
    } = useTodos();

    const [newTodo, setNewTodo] = useState('');
    const [newPriority, setNewPriority] = useState<Todo['priority']>('medium');
    const [newDueDate, setNewDueDate] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        addTodo(newTodo.trim(), newPriority, newDueDate || undefined);
        setNewTodo('');
        setNewDueDate('');
        setNewPriority('medium');
    };

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    };

    const saveEdit = (id: string) => {
        if (editTitle.trim()) {
            updateTodo(id, { title: editTitle.trim() });
        }
        setEditingId(null);
        setEditTitle('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const getPriorityColor = (priority: Todo['priority']) => {
        switch (priority) {
            case 'high': return 'var(--color-accent-danger)';
            case 'medium': return 'var(--color-accent-warning)';
            case 'low': return 'var(--color-accent-success)';
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'pending') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Sort: pending first, then by priority, then by date
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (!isLoaded) {
        return (
            <div className="animate-fadeIn">
                <div className="page-header">
                    <h1 className="page-title">To-Do List</h1>
                    <p className="page-subtitle">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <div>
                    <h1 className="page-title">To-Do List</h1>
                    <p className="page-subtitle">Track your tasks and stay organized</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-3 mb-6">
                <div className="stat-card">
                    <p className="stat-label">Pending</p>
                    <p className="stat-value">{pendingCount}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Completed</p>
                    <p className="stat-value">{completedCount}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total</p>
                    <p className="stat-value">{todos.length}</p>
                </div>
            </div>

            {/* Add Todo Form */}
            <div className="card mb-6">
                <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="What needs to be done?"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        style={{ flex: '1 1 300px' }}
                    />
                    <select
                        className="form-select"
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as Todo['priority'])}
                        style={{ width: '130px' }}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <input
                        type="date"
                        className="form-input"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        style={{ width: '160px' }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add
                    </button>
                </form>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 items-center justify-between flex-wrap">
                <div className="flex gap-2">
                    {(['all', 'pending', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                {completedCount > 0 && (
                    <button className="btn btn-secondary" onClick={clearCompleted}>
                        Clear Completed
                    </button>
                )}
            </div>

            {/* Todo List */}
            {sortedTodos.length === 0 ? (
                <div className="empty-state">
                    <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h3 className="empty-state-title">
                        {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
                    </h3>
                    <p className="empty-state-description">
                        {filter === 'all' ? 'Add your first task above' : 'Try changing your filter'}
                    </p>
                </div>
            ) : (
                <div className="card todo-list">
                    {sortedTodos.map((todo, index) => (
                        <div
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                            style={{
                                background: index % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                            }}
                        >
                            <button
                                className="todo-checkbox"
                                onClick={() => toggleTodo(todo.id)}
                                style={{
                                    borderColor: todo.completed ? 'var(--color-accent-success)' : getPriorityColor(todo.priority),
                                    background: todo.completed ? 'var(--color-accent-success)' : 'transparent',
                                }}
                            >
                                {todo.completed && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </button>

                            <div className="todo-content">
                                {editingId === todo.id ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEdit(todo.id);
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="todo-title">{todo.title}</span>
                                )}
                                <div className="todo-meta">
                                    <span className="todo-priority" style={{ color: getPriorityColor(todo.priority) }}>
                                        {todo.priority}
                                    </span>
                                    {todo.dueDate && (
                                        <span className="todo-due">
                                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="todo-actions">
                                {editingId === todo.id ? (
                                    <>
                                        <button className="btn-icon" onClick={() => saveEdit(todo.id)} title="Save">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </button>
                                        <button className="btn-icon" onClick={cancelEdit} title="Cancel">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6 6 18M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-icon" onClick={() => startEdit(todo)} title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                            </svg>
                                        </button>
                                        <button className="btn-icon" onClick={() => deleteTodo(todo.id)} title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
