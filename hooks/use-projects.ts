'use client';

import { useMemo } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Project, Task, PROJECT_COLORS } from '@/lib/types';

export function useProjects() {
    const projectsData = useQuery(api.projects.get);
    const createProject = useMutation(api.projects.create);
    const updateProjectMutation = useMutation(api.projects.update);
    const removeProjectMutation = useMutation(api.projects.remove);
    const addTaskMutation = useMutation(api.projects.addTask);
    const toggleTaskMutation = useMutation(api.projects.toggleTask);
    const deleteTaskMutation = useMutation(api.projects.deleteTask);

    // Map Convex data to include _id as id for compatibility
    const projects: (Project & { _id: Id<"projects"> })[] = (projectsData ?? []).map((project) => ({
        ...project,
        id: project._id,
    }));

    const isLoaded = projectsData !== undefined;

    const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'color'>) => {
        const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
        const id = await createProject({
            name: project.name,
            description: project.description,
            status: project.status,
            color: randomColor,
            deadline: project.deadline,
        });
        return id;
    };

    const updateProject = async (id: string | Id<"projects">, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        await updateProjectMutation({
            id: id as Id<"projects">,
            name: updates.name,
            description: updates.description,
            status: updates.status,
            color: updates.color,
            deadline: updates.deadline,
        });
    };

    const deleteProject = async (id: string | Id<"projects">) => {
        await removeProjectMutation({ id: id as Id<"projects"> });
    };

    const getProject = (id: string | Id<"projects">) => {
        return projects.find((project) => project._id === id || project.id === id);
    };

    const addTask = async (projectId: string | Id<"projects">, taskTitle: string) => {
        const task = await addTaskMutation({
            projectId: projectId as Id<"projects">,
            taskTitle,
        });
        return task;
    };

    const toggleTask = async (projectId: string | Id<"projects">, taskId: string) => {
        await toggleTaskMutation({
            projectId: projectId as Id<"projects">,
            taskId,
        });
    };

    const deleteTask = async (projectId: string | Id<"projects">, taskId: string) => {
        await deleteTaskMutation({
            projectId: projectId as Id<"projects">,
            taskId,
        });
    };

    const getProgress = (project: Project) => {
        if (project.tasks.length === 0) return 0;
        const completed = project.tasks.filter((task) => task.completed).length;
        return Math.round((completed / project.tasks.length) * 100);
    };

    return {
        projects,
        isLoaded,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        addTask,
        toggleTask,
        deleteTask,
        getProgress,
    };
}
