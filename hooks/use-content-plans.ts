import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { ContentPlan, ContentType, BusinessArea, ContentStatus } from "@/lib/types";

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Get all content plans
 */
export function useContentPlans() {
    return useQuery(api.contentPlans.get);
}

/**
 * Get a single content plan by ID
 */
export function useContentPlan(id: Id<"contentPlans"> | undefined) {
    return useQuery(api.contentPlans.getById, id ? { id } : "skip");
}

/**
 * Get content plans by business area
 */
export function useContentPlansByBusiness(business: BusinessArea | undefined) {
    return useQuery(api.contentPlans.getByBusiness, business ? { business } : "skip");
}

/**
 * Get content plans by type
 */
export function useContentPlansByType(type: ContentType | undefined) {
    return useQuery(api.contentPlans.getByType, type ? { type } : "skip");
}

/**
 * Get content plans by status
 */
export function useContentPlansByStatus(status: ContentStatus | undefined) {
    return useQuery(api.contentPlans.getByStatus, status ? { status } : "skip");
}

/**
 * Get active content plans
 */
export function useActiveContentPlans() {
    return useQuery(api.contentPlans.getActive);
}

/**
 * Search content plans with filters
 */
export function useSearchContentPlans(params?: {
    query?: string;
    business?: BusinessArea;
    type?: ContentType;
    status?: ContentStatus;
}) {
    return useQuery(api.contentPlans.search, params || {});
}

/**
 * Get content summary
 */
export function useContentSummary() {
    return useQuery(api.contentPlans.getContentSummary);
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create a new content plan
 */
export function useCreateContentPlan() {
    return useMutation(api.contentPlans.create);
}

/**
 * Update an existing content plan
 */
export function useUpdateContentPlan() {
    return useMutation(api.contentPlans.update);
}

/**
 * Delete a content plan
 */
export function useDeleteContentPlan() {
    return useMutation(api.contentPlans.remove);
}

/**
 * Add an asset to a content plan
 */
export function useAddContentAsset() {
    return useMutation(api.contentPlans.addAsset);
}

/**
 * Update a content asset
 */
export function useUpdateContentAsset() {
    return useMutation(api.contentPlans.updateAsset);
}

/**
 * Remove a content asset
 */
export function useRemoveContentAsset() {
    return useMutation(api.contentPlans.removeAsset);
}

// ==========================================
// COMBINED HOOKS FOR COMMON PATTERNS
// ==========================================

/**
 * Get all content plans with mutations
 */
export function useContentPlansWithMutations() {
    const plans = useContentPlans();
    const createPlan = useCreateContentPlan();
    const updatePlan = useUpdateContentPlan();
    const deletePlan = useDeleteContentPlan();
    const addAsset = useAddContentAsset();
    const updateAsset = useUpdateContentAsset();
    const removeAsset = useRemoveContentAsset();

    return {
        plans,
        createPlan,
        updatePlan,
        deletePlan,
        addAsset,
        updateAsset,
        removeAsset,
    };
}

/**
 * Get a single content plan with mutations
 */
export function useContentPlanWithMutations(id: Id<"contentPlans"> | undefined) {
    const plan = useContentPlan(id);
    const updatePlan = useUpdateContentPlan();
    const deletePlan = useDeleteContentPlan();
    const addAsset = useAddContentAsset();
    const updateAsset = useUpdateContentAsset();
    const removeAsset = useRemoveContentAsset();

    return {
        plan,
        updatePlan,
        deletePlan,
        addAsset,
        updateAsset,
        removeAsset,
    };
}

/**
 * Get content plans by business with summary
 */
export function useContentPlansByBusinessWithSummary(business: BusinessArea) {
    const plans = useContentPlansByBusiness(business);
    const summary = useContentSummary();

    const activePlans = plans?.filter((p) => p.status === "active") || [];
    const totalAssets = plans?.reduce((sum, p) => sum + p.assets.length, 0) || 0;
    const publishedAssets =
        plans?.reduce(
            (sum, p) => sum + p.assets.filter((a) => a.status === "published").length,
            0
        ) || 0;

    return {
        plans,
        summary,
        activePlans,
        totalAssets,
        publishedAssets,
    };
}

/**
 * Get all Adalo content
 */
export function useAdaloContent() {
    return useContentPlansByBusinessWithSummary("adalo");
}

/**
 * Get all Tangible Ideas content
 */
export function useTangibleIdeasContent() {
    return useContentPlansByBusinessWithSummary("tangible-ideas");
}

/**
 * Get all No-Code Effect content
 */
export function useNoCodeEffectContent() {
    return useContentPlansByBusinessWithSummary("no-code-effect");
}

/**
 * Get all Personal Brand content
 */
export function usePersonalBrandContent() {
    return useContentPlansByBusinessWithSummary("personal-brand");
}

/**
 * Get active content pipeline (all active plans across all businesses)
 */
export function useActiveContentPipeline() {
    const activePlans = useActiveContentPlans();
    const summary = useContentSummary();

    const groupedByBusiness = {
        "tangible-ideas": activePlans?.filter((p) => p.business === "tangible-ideas") || [],
        "no-code-effect": activePlans?.filter((p) => p.business === "no-code-effect") || [],
        adalo: activePlans?.filter((p) => p.business === "adalo") || [],
        "personal-brand": activePlans?.filter((p) => p.business === "personal-brand") || [],
    };

    const groupedByType = {
        "long-form": activePlans?.filter((p) => p.type === "long-form") || [],
        "short-form": activePlans?.filter((p) => p.type === "short-form") || [],
        series: activePlans?.filter((p) => p.type === "series") || [],
        campaign: activePlans?.filter((p) => p.type === "campaign") || [],
        archetype: activePlans?.filter((p) => p.type === "archetype") || [],
    };

    return {
        activePlans,
        summary,
        groupedByBusiness,
        groupedByType,
    };
}
