import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Goal, GoalType, GoalStatus } from "@/lib/types";

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Get all goals
 */
export function useGoals() {
    return useQuery(api.goals.get);
}

/**
 * Get a single goal by ID
 */
export function useGoal(id: Id<"goals"> | undefined) {
    return useQuery(api.goals.getById, id ? { id } : "skip");
}

/**
 * Get goals by type
 */
export function useGoalsByType(type: GoalType | undefined) {
    return useQuery(api.goals.getByType, type ? { type } : "skip");
}

/**
 * Get goals by status
 */
export function useGoalsByStatus(status: GoalStatus | undefined) {
    return useQuery(api.goals.getByStatus, status ? { status } : "skip");
}

/**
 * Get the North Star goal
 */
export function useNorthStarGoal() {
    return useQuery(api.goals.getNorthStar);
}

/**
 * Search goals with filters
 */
export function useSearchGoals(params?: {
    query?: string;
    type?: GoalType;
    status?: GoalStatus;
}) {
    return useQuery(api.goals.search, params || {});
}

/**
 * Get goal progress summary
 */
export function useGoalProgressSummary() {
    return useQuery(api.goals.getProgressSummary);
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create a new goal
 */
export function useCreateGoal() {
    return useMutation(api.goals.create);
}

/**
 * Update an existing goal
 */
export function useUpdateGoal() {
    return useMutation(api.goals.update);
}

/**
 * Delete a goal
 */
export function useDeleteGoal() {
    return useMutation(api.goals.remove);
}

/**
 * Update a specific target within a goal
 */
export function useUpdateGoalTarget() {
    return useMutation(api.goals.updateTarget);
}

/**
 * Update goal status
 */
export function useUpdateGoalStatus() {
    return useMutation(api.goals.updateStatus);
}

// ==========================================
// COMBINED HOOKS FOR COMMON PATTERNS
// ==========================================

/**
 * Get all goals with mutations
 * Returns both data and mutation functions
 */
export function useGoalsWithMutations() {
    const goals = useGoals();
    const createGoal = useCreateGoal();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();
    const updateTarget = useUpdateGoalTarget();
    const updateStatus = useUpdateGoalStatus();

    return {
        goals,
        createGoal,
        updateGoal,
        deleteGoal,
        updateTarget,
        updateStatus,
    };
}

/**
 * Get a single goal with mutations
 */
export function useGoalWithMutations(id: Id<"goals"> | undefined) {
    const goal = useGoal(id);
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();
    const updateTarget = useUpdateGoalTarget();
    const updateStatus = useUpdateGoalStatus();

    return {
        goal,
        updateGoal,
        deleteGoal,
        updateTarget,
        updateStatus,
    };
}

/**
 * Get goals by type with easy type switching
 */
export function useGoalsByTypeWithSummary() {
    const goals = useGoals();
    const summary = useGoalProgressSummary();

    const getGoalsByType = (type: GoalType) => {
        return goals?.filter((g) => g.type === type) || [];
    };

    const getGoalsByStatus = (status: GoalStatus) => {
        return goals?.filter((g) => g.status === status) || [];
    };

    return {
        goals,
        summary,
        getGoalsByType,
        getGoalsByStatus,
    };
}
