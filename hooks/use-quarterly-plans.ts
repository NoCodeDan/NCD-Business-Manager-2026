import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { QuarterlyPlan, QuarterType, QuarterlyPlanStatus } from "@/lib/types";

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Get all quarterly plans
 */
export function useQuarterlyPlans() {
    return useQuery(api.quarterlyPlans.get);
}

/**
 * Get a single quarterly plan by ID
 */
export function useQuarterlyPlan(id: Id<"quarterlyPlans"> | undefined) {
    return useQuery(api.quarterlyPlans.getById, id ? { id } : "skip");
}

/**
 * Get plans by year
 */
export function useQuarterlyPlansByYear(year: number | undefined) {
    return useQuery(api.quarterlyPlans.getByYear, year ? { year } : "skip");
}

/**
 * Get a specific quarter
 */
export function useQuarterlyPlanByYearAndQuarter(
    year: number | undefined,
    quarter: QuarterType | undefined
) {
    return useQuery(
        api.quarterlyPlans.getByYearAndQuarter,
        year && quarter ? { year, quarter } : "skip"
    );
}

/**
 * Get the current quarter automatically
 */
export function useCurrentQuarter() {
    return useQuery(api.quarterlyPlans.getCurrentQuarter);
}

/**
 * Get plans by status
 */
export function useQuarterlyPlansByStatus(status: QuarterlyPlanStatus | undefined) {
    return useQuery(api.quarterlyPlans.getByStatus, status ? { status } : "skip");
}

/**
 * Search quarterly plans with filters
 */
export function useSearchQuarterlyPlans(params?: {
    query?: string;
    year?: number;
    quarter?: QuarterType;
    status?: QuarterlyPlanStatus;
}) {
    return useQuery(api.quarterlyPlans.search, params || {});
}

/**
 * Get year summary (rollup of all quarters)
 */
export function useYearSummary(year: number | undefined) {
    return useQuery(api.quarterlyPlans.getYearSummary, year ? { year } : "skip");
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create a new quarterly plan
 */
export function useCreateQuarterlyPlan() {
    return useMutation(api.quarterlyPlans.create);
}

/**
 * Update an existing quarterly plan
 */
export function useUpdateQuarterlyPlan() {
    return useMutation(api.quarterlyPlans.update);
}

/**
 * Delete a quarterly plan
 */
export function useDeleteQuarterlyPlan() {
    return useMutation(api.quarterlyPlans.remove);
}

/**
 * Toggle action completion
 */
export function useToggleQuarterlyAction() {
    return useMutation(api.quarterlyPlans.toggleAction);
}

/**
 * Update shipping targets
 */
export function useUpdateShippingTargets() {
    return useMutation(api.quarterlyPlans.updateShippingTargets);
}

/**
 * Update revenue actual
 */
export function useUpdateRevenueActual() {
    return useMutation(api.quarterlyPlans.updateRevenueActual);
}

// ==========================================
// COMBINED HOOKS FOR COMMON PATTERNS
// ==========================================

/**
 * Get all quarterly plans with mutations
 */
export function useQuarterlyPlansWithMutations() {
    const plans = useQuarterlyPlans();
    const createPlan = useCreateQuarterlyPlan();
    const updatePlan = useUpdateQuarterlyPlan();
    const deletePlan = useDeleteQuarterlyPlan();
    const toggleAction = useToggleQuarterlyAction();
    const updateShipping = useUpdateShippingTargets();
    const updateRevenue = useUpdateRevenueActual();

    return {
        plans,
        createPlan,
        updatePlan,
        deletePlan,
        toggleAction,
        updateShipping,
        updateRevenue,
    };
}

/**
 * Get a single quarterly plan with mutations
 */
export function useQuarterlyPlanWithMutations(id: Id<"quarterlyPlans"> | undefined) {
    const plan = useQuarterlyPlan(id);
    const updatePlan = useUpdateQuarterlyPlan();
    const deletePlan = useDeleteQuarterlyPlan();
    const toggleAction = useToggleQuarterlyAction();
    const updateShipping = useUpdateShippingTargets();
    const updateRevenue = useUpdateRevenueActual();

    return {
        plan,
        updatePlan,
        deletePlan,
        toggleAction,
        updateShipping,
        updateRevenue,
    };
}

/**
 * Get 2026 plans with summary
 */
export function use2026Plans() {
    const plans = useQuarterlyPlansByYear(2026);
    const summary = useYearSummary(2026);
    const currentQuarter = useCurrentQuarter();

    return {
        plans,
        summary,
        currentQuarter,
        q1: plans?.find((p) => p.quarter === "Q1"),
        q2: plans?.find((p) => p.quarter === "Q2"),
        q3: plans?.find((p) => p.quarter === "Q3"),
        q4: plans?.find((p) => p.quarter === "Q4"),
    };
}

/**
 * Get current quarter with mutations
 */
export function useCurrentQuarterWithMutations() {
    const currentQuarter = useCurrentQuarter();
    const updatePlan = useUpdateQuarterlyPlan();
    const toggleAction = useToggleQuarterlyAction();
    const updateShipping = useUpdateShippingTargets();
    const updateRevenue = useUpdateRevenueActual();

    return {
        currentQuarter,
        updatePlan,
        toggleAction,
        updateShipping,
        updateRevenue,
    };
}
