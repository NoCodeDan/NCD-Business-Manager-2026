'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Initiative, KPI, INITIATIVE_COLORS, Quarter } from '@/lib/types';

export function useInitiatives() {
    const initiativesData = useQuery(api.initiatives.get);
    const createInitiative = useMutation(api.initiatives.create);
    const updateInitiativeMutation = useMutation(api.initiatives.update);
    const removeInitiativeMutation = useMutation(api.initiatives.remove);
    const updateKPIMutation = useMutation(api.initiatives.updateKPI);

    // Map Convex data to include _id as id for compatibility
    const initiatives: (Initiative & { _id: Id<"initiatives"> })[] = (initiativesData ?? []).map((initiative) => ({
        ...initiative,
        id: initiative._id,
        category: initiative.category as Initiative['category'],
        status: initiative.status as Initiative['status'],
    }));

    const isLoaded = initiativesData !== undefined;

    const addInitiative = async (
        initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt' | 'kpis' | 'color'>
    ) => {
        const randomColor = INITIATIVE_COLORS[Math.floor(Math.random() * INITIATIVE_COLORS.length)];
        const id = await createInitiative({
            name: initiative.name,
            description: initiative.description,
            category: initiative.category,
            status: initiative.status,
            color: randomColor,
            kpis: [],
        });
        return id;
    };

    const updateInitiative = async (
        id: string | Id<"initiatives">,
        updates: Partial<Omit<Initiative, 'id' | 'createdAt'>>
    ) => {
        await updateInitiativeMutation({
            id: id as Id<"initiatives">,
            name: updates.name,
            description: updates.description,
            category: updates.category,
            status: updates.status,
            color: updates.color,
            kpis: updates.kpis,
        });
    };

    const deleteInitiative = async (id: string | Id<"initiatives">) => {
        await removeInitiativeMutation({ id: id as Id<"initiatives"> });
    };

    const getInitiative = (id: string | Id<"initiatives">) => {
        return initiatives.find((initiative) => initiative._id === id || initiative.id === id);
    };

    const addKPI = async (initiativeId: string | Id<"initiatives">, kpi: Omit<KPI, 'id'>) => {
        const initiative = getInitiative(initiativeId);
        if (!initiative) return;

        const newKPI: KPI = {
            ...kpi,
            id: crypto.randomUUID(),
        };

        await updateInitiativeMutation({
            id: initiativeId as Id<"initiatives">,
            kpis: [...initiative.kpis, newKPI],
        });

        return newKPI;
    };

    const updateKPI = async (
        initiativeId: string | Id<"initiatives">,
        kpiId: string,
        updates: Partial<Omit<KPI, 'id'>>
    ) => {
        const initiative = getInitiative(initiativeId);
        if (!initiative) return;

        const updatedKpis = initiative.kpis.map((kpi) =>
            kpi.id === kpiId ? { ...kpi, ...updates } : kpi
        );

        await updateInitiativeMutation({
            id: initiativeId as Id<"initiatives">,
            kpis: updatedKpis,
        });
    };

    const updateKPIActual = async (
        initiativeId: string | Id<"initiatives">,
        kpiId: string,
        quarter: Quarter,
        actual: number | null
    ) => {
        await updateKPIMutation({
            initiativeId: initiativeId as Id<"initiatives">,
            kpiId,
            quarter,
            actual,
        });
    };

    const deleteKPI = async (initiativeId: string | Id<"initiatives">, kpiId: string) => {
        const initiative = getInitiative(initiativeId);
        if (!initiative) return;

        const updatedKpis = initiative.kpis.filter((kpi) => kpi.id !== kpiId);

        await updateInitiativeMutation({
            id: initiativeId as Id<"initiatives">,
            kpis: updatedKpis,
        });
    };

    const getKPIProgress = (kpi: KPI, quarter: Quarter): number => {
        const { target, actual } = kpi.quarters[quarter];
        if (actual === null || target === 0) return 0;
        return Math.min(100, Math.round((actual / target) * 100));
    };

    return {
        initiatives,
        isLoaded,
        addInitiative,
        updateInitiative,
        deleteInitiative,
        getInitiative,
        addKPI,
        updateKPI,
        updateKPIActual,
        deleteKPI,
        getKPIProgress,
    };
}
