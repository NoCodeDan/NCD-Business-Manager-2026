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
                setTodos(JSON.parse(stored));
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
        };
        setTodos(prev => [newTodo, ...prev]);
        return newTodo.id;
    }, []);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => {
            const todo = prev.find(t => t.id === id);
            if (!todo) return prev;

            const newCompleted = !todo.completed;

            // If completing a parent, also complete all subtasks
            // If uncompleting a parent, also uncomplete all subtasks
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
            // Also delete all subtasks when deleting a parent
            const subtaskIds = prev.filter(t => t.parentId === id).map(t => t.id);
            return prev.filter(todo => todo.id !== id && !subtaskIds.includes(todo.id));
        });
    }, []);

    const clearCompleted = useCallback(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
    }, []);

    // Get subtasks for a parent
    const getSubtasks = useCallback((parentId: string) => {
        return todos.filter(t => t.parentId === parentId);
    }, [todos]);

    // Get top-level todos (no parent)
    const topLevelTodos = useMemo(() => {
        return todos.filter(t => !t.parentId);
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
        completedCount,
        pendingCount,
        pendingTodos,
        completedTodos,
    };
}
