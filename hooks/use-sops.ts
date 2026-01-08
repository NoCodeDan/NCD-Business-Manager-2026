'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SOP } from '@/lib/types';

export function useSOPs() {
    const sopsData = useQuery(api.sops.get);
    const createSOP = useMutation(api.sops.create);
    const updateSOPMutation = useMutation(api.sops.update);
    const removeSOPMutation = useMutation(api.sops.remove);

    // Map Convex data to include _id as id for compatibility
    const sops: (SOP & { _id: Id<"sops"> })[] = (sopsData ?? []).map((sop) => ({
        ...sop,
        id: sop._id,
    }));

    const isLoaded = sopsData !== undefined;

    const addSOP = async (sop: Omit<SOP, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = await createSOP({
            title: sop.title,
            content: sop.content,
            category: sop.category,
            tags: sop.tags,
        });
        return id;
    };

    const updateSOP = async (id: string | Id<"sops">, updates: Partial<Omit<SOP, 'id' | 'createdAt'>>) => {
        await updateSOPMutation({
            id: id as Id<"sops">,
            title: updates.title,
            content: updates.content,
            category: updates.category,
            tags: updates.tags,
        });
    };

    const deleteSOP = async (id: string | Id<"sops">) => {
        await removeSOPMutation({ id: id as Id<"sops"> });
    };

    const getSOP = (id: string | Id<"sops">) => {
        return sops.find((sop) => sop._id === id || sop.id === id);
    };

    return {
        sops,
        isLoaded,
        addSOP,
        updateSOP,
        deleteSOP,
        getSOP,
    };
}
