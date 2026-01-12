'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
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

    const addTodo = useCallback((title: string, priority: Todo['priority'] = 'medium', dueDate?: string) => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            completed: false,
            priority,
            dueDate,
            createdAt: new Date().toISOString(),
        };
        setTodos(prev => [newTodo, ...prev]);
    }, []);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    }, []);

    const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, ...updates } : todo
        ));
    }, []);

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    const clearCompleted = useCallback(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
    }, []);

    // Computed values
    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = todos.filter(t => !t.completed).length;
    const pendingTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    return {
        todos,
        isLoaded,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        clearCompleted,
        completedCount,
        pendingCount,
        pendingTodos,
        completedTodos,
    };
}
