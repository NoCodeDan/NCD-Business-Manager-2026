import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { OperatingRules, RuleType } from "@/lib/types";

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Get all operating rules
 */
export function useOperatingRules() {
    return useQuery(api.operatingRules.get);
}

/**
 * Get a single operating rule set by ID
 */
export function useOperatingRuleSet(id: Id<"operatingRules"> | undefined) {
    return useQuery(api.operatingRules.getById, id ? { id } : "skip");
}

/**
 * Get rules by type
 */
export function useOperatingRulesByType(type: RuleType | undefined) {
    return useQuery(api.operatingRules.getByType, type ? { type } : "skip");
}

/**
 * Get all active rules
 */
export function useActiveOperatingRules() {
    return useQuery(api.operatingRules.getActive);
}

/**
 * Get weekly execution rules
 */
export function useWeeklyRules() {
    return useQuery(api.operatingRules.getWeeklyRules);
}

/**
 * Get priority stack
 */
export function usePriorityStack() {
    return useQuery(api.operatingRules.getPriorityStack);
}

/**
 * Get decision filter
 */
export function useDecisionFilter() {
    return useQuery(api.operatingRules.getDecisionFilter);
}

/**
 * Get kill criteria
 */
export function useKillCriteria() {
    return useQuery(api.operatingRules.getKillCriteria);
}

/**
 * Get review process
 */
export function useReviewProcess() {
    return useQuery(api.operatingRules.getReviewProcess);
}

/**
 * Search operating rules with filters
 */
export function useSearchOperatingRules(params?: {
    query?: string;
    type?: RuleType;
    isActive?: boolean;
}) {
    return useQuery(api.operatingRules.search, params || {});
}

/**
 * Get framework summary
 */
export function useFrameworkSummary() {
    return useQuery(api.operatingRules.getFrameworkSummary);
}

/**
 * Get complete operating playbook (all active rules)
 */
export function useCompletePlaybook() {
    return useQuery(api.operatingRules.getCompletePlaybook);
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create a new operating rule set
 */
export function useCreateOperatingRules() {
    return useMutation(api.operatingRules.create);
}

/**
 * Update an existing operating rule set
 */
export function useUpdateOperatingRules() {
    return useMutation(api.operatingRules.update);
}

/**
 * Delete an operating rule set
 */
export function useDeleteOperatingRules() {
    return useMutation(api.operatingRules.remove);
}

/**
 * Toggle active status
 */
export function useToggleOperatingRulesActive() {
    return useMutation(api.operatingRules.toggleActive);
}

/**
 * Add a rule to a rule set
 */
export function useAddRule() {
    return useMutation(api.operatingRules.addRule);
}

/**
 * Update a specific rule
 */
export function useUpdateRule() {
    return useMutation(api.operatingRules.updateRule);
}

/**
 * Remove a specific rule
 */
export function useRemoveRule() {
    return useMutation(api.operatingRules.removeRule);
}

// ==========================================
// COMBINED HOOKS FOR COMMON PATTERNS
// ==========================================

/**
 * Get all operating rules with mutations
 */
export function useOperatingRulesWithMutations() {
    const rules = useOperatingRules();
    const createRules = useCreateOperatingRules();
    const updateRules = useUpdateOperatingRules();
    const deleteRules = useDeleteOperatingRules();
    const toggleActive = useToggleOperatingRulesActive();
    const addRule = useAddRule();
    const updateRule = useUpdateRule();
    const removeRule = useRemoveRule();

    return {
        rules,
        createRules,
        updateRules,
        deleteRules,
        toggleActive,
        addRule,
        updateRule,
        removeRule,
    };
}

/**
 * Get a single rule set with mutations
 */
export function useOperatingRuleSetWithMutations(id: Id<"operatingRules"> | undefined) {
    const ruleSet = useOperatingRuleSet(id);
    const updateRules = useUpdateOperatingRules();
    const deleteRules = useDeleteOperatingRules();
    const toggleActive = useToggleOperatingRulesActive();
    const addRule = useAddRule();
    const updateRule = useUpdateRule();
    const removeRule = useRemoveRule();

    return {
        ruleSet,
        updateRules,
        deleteRules,
        toggleActive,
        addRule,
        updateRule,
        removeRule,
    };
}

/**
 * Get complete operating framework (all key frameworks)
 */
export function useOperatingFramework() {
    const weeklyRules = useWeeklyRules();
    const priorityStack = usePriorityStack();
    const decisionFilter = useDecisionFilter();
    const killCriteria = useKillCriteria();
    const reviewProcess = useReviewProcess();
    const summary = useFrameworkSummary();

    return {
        weeklyRules,
        priorityStack,
        decisionFilter,
        killCriteria,
        reviewProcess,
        summary,
    };
}

/**
 * Get playbook with mutations (for playbook management page)
 */
export function usePlaybookWithMutations() {
    const playbook = useCompletePlaybook();
    const updateRules = useUpdateOperatingRules();
    const toggleActive = useToggleOperatingRulesActive();
    const addRule = useAddRule();
    const updateRule = useUpdateRule();
    const removeRule = useRemoveRule();

    return {
        playbook,
        updateRules,
        toggleActive,
        addRule,
        updateRule,
        removeRule,
    };
}

/**
 * Get specific framework type with easy access
 */
export function useFramework(type: RuleType) {
    return useOperatingRulesByType(type);
}
