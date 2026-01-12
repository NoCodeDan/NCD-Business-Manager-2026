'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export interface Todo {
    _id: Id<"todos">;
    title: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    parentId?: Id<"todos">;
    position: number;
    createdAt: string;
    updatedAt: string;
}

// Queries
export function useTodosFromConvex() {
    return useQuery(api.todos.get);
}

export function useTopLevelTodos() {
    return useQuery(api.todos.getTopLevel);
}

export function usePendingTodos() {
    return useQuery(api.todos.getByCompleted, { completed: false });
}

export function useCompletedTodos() {
    return useQuery(api.todos.getByCompleted, { completed: true });
}

// Mutations
export function useCreateTodo() {
    return useMutation(api.todos.create);
}

export function useToggleTodo() {
    return useMutation(api.todos.toggle);
}

export function useUpdateTodo() {
    return useMutation(api.todos.update);
}

export function useRemoveTodo() {
    return useMutation(api.todos.remove);
}

export function useClearCompletedTodos() {
    return useMutation(api.todos.clearCompleted);
}
