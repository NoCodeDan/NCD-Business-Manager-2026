'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
    parentId?: string; // For subtasks
    position: number; // For ordering
}

const STORAGE_KEY = 'ncd-todos';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Add position to legacy todos that don't have it
                const withPositions = parsed.map((t: Todo, idx: number) => ({
                    ...t,
                    position: t.position ?? idx,
                }));
                setTodos(withPositions);
            } catch {
                setTodos([]);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        }
    }, [todos, isLoaded]);

    const addTodo = useCallback((title: string, priority: Todo['priority'] = 'medium', dueDate?: string, parentId?: string) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            completed: false,
            priority,
            dueDate,
            createdAt: new Date().toISOString(),
            parentId,
            position: 0, // New todos go to top
        };
        // Shift all other positions down
        setTodos(prev => [
            newTodo,
            ...prev.map(t => t.parentId === parentId ? { ...t, position: t.position + 1 } : t),
        ]);
        return newTodo.id;
    }, []);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => {
            const todo = prev.find(t => t.id === id);
            if (!todo) return prev;

            const newCompleted = !todo.completed;
            const subtaskIds = prev.filter(t => t.parentId === id).map(t => t.id);

            return prev.map(t => {
                if (t.id === id) {
                    return { ...t, completed: newCompleted };
                }
                if (subtaskIds.includes(t.id)) {
                    return { ...t, completed: newCompleted };
                }
                return t;
            });
        });
    }, []);

    const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, ...updates } : todo
        ));
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => {
            const subtaskIds = prev.filter(t => t.parentId === id).map(t => t.id);
            return prev.filter(todo => todo.id !== id && !subtaskIds.includes(todo.id));
        });
    }, []);

    const clearCompleted = useCallback(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
    }, []);

    // Reorder todos (for drag and drop)
    const reorderTodos = useCallback((dragId: string, dropId: string) => {
        setTodos(prev => {
            const dragTodo = prev.find(t => t.id === dragId);
            const dropTodo = prev.find(t => t.id === dropId);
            if (!dragTodo || !dropTodo) return prev;

            // Only allow reordering within same level (both top-level or same parent)
            if (dragTodo.parentId !== dropTodo.parentId) return prev;

            const relevantTodos = prev.filter(t => t.parentId === dragTodo.parentId);
            const otherTodos = prev.filter(t => t.parentId !== dragTodo.parentId);

            const dragIndex = relevantTodos.findIndex(t => t.id === dragId);
            const dropIndex = relevantTodos.findIndex(t => t.id === dropId);

            // Remove drag item and insert at drop position
            const reordered = [...relevantTodos];
            const [removed] = reordered.splice(dragIndex, 1);
            reordered.splice(dropIndex, 0, removed);

            // Update positions
            const withNewPositions = reordered.map((t, idx) => ({ ...t, position: idx }));

            return [...otherTodos, ...withNewPositions];
        });
    }, []);

    // Get subtasks for a parent (sorted by position)
    const getSubtasks = useCallback((parentId: string) => {
        return todos
            .filter(t => t.parentId === parentId)
            .sort((a, b) => a.position - b.position);
    }, [todos]);

    // Get top-level todos sorted by position
    const topLevelTodos = useMemo(() => {
        return todos
            .filter(t => !t.parentId)
            .sort((a, b) => a.position - b.position);
    }, [todos]);

    // Computed values
    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = todos.filter(t => !t.completed).length;
    const pendingTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    return {
        todos,
        topLevelTodos,
        isLoaded,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        getSubtasks,
        reorderTodos,
        completedCount,
        pendingCount,
        pendingTodos,
        completedTodos,
    };
}
