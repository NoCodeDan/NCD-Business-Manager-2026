import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TargetICP, ICPBusinessArea } from "@/lib/types";

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Get all target ICPs
 */
export function useTargetICPs() {
    return useQuery(api.targetICP.get);
}

/**
 * Get a single target ICP by ID
 */
export function useTargetICP(id: Id<"targetICP"> | undefined) {
    return useQuery(api.targetICP.getById, id ? { id } : "skip");
}

/**
 * Get ICPs by business area
 */
export function useTargetICPsByBusiness(business: ICPBusinessArea | undefined) {
    return useQuery(api.targetICP.getByBusiness, business ? { business } : "skip");
}

/**
 * Get all active ICPs
 */
export function useActiveTargetICPs() {
    return useQuery(api.targetICP.getActive);
}

/**
 * Get active ICPs by business
 */
export function useActiveTargetICPsByBusiness(business: ICPBusinessArea | undefined) {
    return useQuery(
        api.targetICP.getActiveByBusiness,
        business ? { business } : "skip"
    );
}

/**
 * Search target ICPs with filters
 */
export function useSearchTargetICPs(params?: {
    query?: string;
    business?: ICPBusinessArea;
    isActive?: boolean;
}) {
    return useQuery(api.targetICP.search, params || {});
}

/**
 * Get ICP summary
 */
export function useICPSummary() {
    return useQuery(api.targetICP.getICPSummary);
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create a new target ICP
 */
export function useCreateTargetICP() {
    return useMutation(api.targetICP.create);
}

/**
 * Update an existing target ICP
 */
export function useUpdateTargetICP() {
    return useMutation(api.targetICP.update);
}

/**
 * Delete a target ICP
 */
export function useDeleteTargetICP() {
    return useMutation(api.targetICP.remove);
}

/**
 * Toggle active status
 */
export function useToggleTargetICPActive() {
    return useMutation(api.targetICP.toggleActive);
}

/**
 * Add a characteristic
 */
export function useAddCharacteristic() {
    return useMutation(api.targetICP.addCharacteristic);
}

/**
 * Remove a characteristic
 */
export function useRemoveCharacteristic() {
    return useMutation(api.targetICP.removeCharacteristic);
}

/**
 * Add a pain point
 */
export function useAddPainPoint() {
    return useMutation(api.targetICP.addPainPoint);
}

/**
 * Remove a pain point
 */
export function useRemovePainPoint() {
    return useMutation(api.targetICP.removePainPoint);
}

/**
 * Add messaging
 */
export function useAddMessaging() {
    return useMutation(api.targetICP.addMessaging);
}

/**
 * Update messaging
 */
export function useUpdateMessaging() {
    return useMutation(api.targetICP.updateMessaging);
}

/**
 * Remove messaging
 */
export function useRemoveMessaging() {
    return useMutation(api.targetICP.removeMessaging);
}

// ==========================================
// COMBINED HOOKS FOR COMMON PATTERNS
// ==========================================

/**
 * Get all target ICPs with mutations
 */
export function useTargetICPsWithMutations() {
    const icps = useTargetICPs();
    const createICP = useCreateTargetICP();
    const updateICP = useUpdateTargetICP();
    const deleteICP = useDeleteTargetICP();
    const toggleActive = useToggleTargetICPActive();
    const addCharacteristic = useAddCharacteristic();
    const removeCharacteristic = useRemoveCharacteristic();
    const addPainPoint = useAddPainPoint();
    const removePainPoint = useRemovePainPoint();
    const addMessaging = useAddMessaging();
    const updateMessaging = useUpdateMessaging();
    const removeMessaging = useRemoveMessaging();

    return {
        icps,
        createICP,
        updateICP,
        deleteICP,
        toggleActive,
        addCharacteristic,
        removeCharacteristic,
        addPainPoint,
        removePainPoint,
        addMessaging,
        updateMessaging,
        removeMessaging,
    };
}

/**
 * Get a single target ICP with mutations
 */
export function useTargetICPWithMutations(id: Id<"targetICP"> | undefined) {
    const icp = useTargetICP(id);
    const updateICP = useUpdateTargetICP();
    const deleteICP = useDeleteTargetICP();
    const toggleActive = useToggleTargetICPActive();
    const addCharacteristic = useAddCharacteristic();
    const removeCharacteristic = useRemoveCharacteristic();
    const addPainPoint = useAddPainPoint();
    const removePainPoint = useRemovePainPoint();
    const addMessaging = useAddMessaging();
    const updateMessaging = useUpdateMessaging();
    const removeMessaging = useRemoveMessaging();

    return {
        icp,
        updateICP,
        deleteICP,
        toggleActive,
        addCharacteristic,
        removeCharacteristic,
        addPainPoint,
        removePainPoint,
        addMessaging,
        updateMessaging,
        removeMessaging,
    };
}

/**
 * Get ICPs by business with summary
 */
export function useTargetICPsByBusinessWithSummary(business: ICPBusinessArea) {
    const icps = useTargetICPsByBusiness(business);
    const activeICPs = useActiveTargetICPsByBusiness(business);
    const summary = useICPSummary();

    return {
        icps,
        activeICPs,
        summary,
        totalICPs: icps?.length || 0,
        activeCount: activeICPs?.length || 0,
    };
}

/**
 * Get all Adalo ICPs
 */
export function useAdaloICPs() {
    return useTargetICPsByBusinessWithSummary("adalo");
}

/**
 * Get all Tangible Ideas ICPs
 */
export function useTangibleIdeasICPs() {
    return useTargetICPsByBusinessWithSummary("tangible-ideas");
}

/**
 * Get all No-Code Effect ICPs
 */
export function useNoCodeEffectICPs() {
    return useTargetICPsByBusinessWithSummary("no-code-effect");
}

/**
 * Get all active ICPs grouped by business
 */
export function useActiveICPsByBusiness() {
    const activeICPs = useActiveTargetICPs();
    const summary = useICPSummary();

    const groupedByBusiness = {
        "tangible-ideas": activeICPs?.filter((icp) => icp.business === "tangible-ideas") || [],
        "no-code-effect": activeICPs?.filter((icp) => icp.business === "no-code-effect") || [],
        adalo: activeICPs?.filter((icp) => icp.business === "adalo") || [],
    };

    return {
        activeICPs,
        summary,
        groupedByBusiness,
        totalActive: activeICPs?.length || 0,
    };
}
