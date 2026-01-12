// ==========================================
// NCD Business Manager - TypeScript Types
// ==========================================

export interface SOP {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  color: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'annual';
  category: string;
  renewalDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Tools'
  | 'Marketing'
  | 'Hosting'
  | 'Software'
  | 'Team'
  | 'Education'
  | 'Other';

export type SOPCategory =
  | 'Operations'
  | 'Marketing'
  | 'Finance'
  | 'Client Management'
  | 'Content'
  | 'Leadership'
  | 'Product Studio'
  | 'Automation'
  | 'Content Strategy'
  | 'Education'
  | 'Video Production'
  | 'UX Design'
  | 'Community'
  | 'Client Success'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Tools',
  'Marketing',
  'Hosting',
  'Software',
  'Team',
  'Education',
  'Other'
];

export const SOP_CATEGORIES: SOPCategory[] = [
  'Leadership',
  'Product Studio',
  'Automation',
  'Content Strategy',
  'Education',
  'Video Production',
  'UX Design',
  'Marketing',
  'Community',
  'Client Success',
  'Operations',
  'Finance',
  'Client Management',
  'Content',
  'Other'
];

export const PROJECT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

// ==========================================
// Initiative & KPI Types
// ==========================================

export type Quarter = 'q1' | 'q2' | 'q3' | 'q4';

export type InitiativeCategory =
  | 'Growth'
  | 'Operations'
  | 'Product'
  | 'Marketing'
  | 'Financial';

export type InitiativeStatus =
  | 'on-track'
  | 'at-risk'
  | 'behind'
  | 'completed';

export interface QuarterlyData {
  target: number;
  actual: number | null;
}

export interface KPI {
  id: string;
  name: string;
  unit: string;
  quarters: {
    q1: QuarterlyData;
    q2: QuarterlyData;
    q3: QuarterlyData;
    q4: QuarterlyData;
  };
}

export interface Initiative {
  id: string;
  name: string;
  description: string;
  category: InitiativeCategory;
  status: InitiativeStatus;
  color: string;
  kpis: KPI[];
  createdAt: string;
  updatedAt: string;
  // 2026 Framework Integration (optional)
  year?: number;                    // e.g., 2026
  goalId?: string;                  // Link to parent goal
  businessArea?: BusinessArea | 'general';
}

export const INITIATIVE_CATEGORIES: InitiativeCategory[] = [
  'Growth',
  'Operations',
  'Product',
  'Marketing',
  'Financial',
];

export const INITIATIVE_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#3b82f6', // Blue
];

// ==========================================
// 2026 Strategic Planning Types
// ==========================================

// Goals
export type GoalType =
  | 'north-star'
  | 'business'
  | 'tangible-ideas'
  | 'no-code-effect'
  | 'personal-brand'
  | 'product-ip'
  | 'systems-ops';

export type MeasureType = 'range' | 'minimum' | 'exact' | 'milestone';

export type GoalPriority = 'critical' | 'high' | 'medium' | 'low';

export type GoalStatus = 'on-track' | 'at-risk' | 'behind' | 'completed' | 'not-started';

export interface GoalTarget {
  id: string;
  metric: string;
  target: string;
  unit: string;
  measureType: MeasureType;
  priority: GoalPriority;
  currentValue?: string;
  notes?: string;
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description: string;
  category: string;
  targets: GoalTarget[];
  status: GoalStatus;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const GOAL_TYPES: GoalType[] = [
  'north-star',
  'business',
  'tangible-ideas',
  'no-code-effect',
  'personal-brand',
  'product-ip',
  'systems-ops',
];

export const GOAL_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
];

// Quarterly Plans
export type QuarterType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type QuarterlyPlanStatus = 'upcoming' | 'in-progress' | 'completed' | 'reviewed';

export interface QuarterlyAction {
  id: string;
  action: string;
  category: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
}

export interface ShippingTargets {
  mvps: { target: number; actual?: number };
  internalProducts: { target: number; actual?: number };
  buildBreakdowns: { target: number; actual?: number };
}

export interface RevenueTargets {
  min: number;
  max: number;
  actual?: number;
}

export interface AudienceTarget {
  id: string;
  metric: string;
  target: number;
  actual?: number;
}

export interface ContentTarget {
  id: string;
  type: string;
  target: number;
  actual?: number;
}

export interface QuarterlyPlan {
  id: string;
  year: number;
  quarter: QuarterType;
  theme: string;
  primaryObjective: string;
  focusAreas: string[];
  keyActions: QuarterlyAction[];
  shippingTargets: ShippingTargets;
  revenueTargets: RevenueTargets;
  audienceTargets: AudienceTarget[];
  contentTargets: ContentTarget[];
  status: QuarterlyPlanStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export const QUARTERS: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

// Content Plans
export type ContentType = 'long-form' | 'short-form' | 'series' | 'campaign' | 'archetype';

export type BusinessArea = 'tangible-ideas' | 'no-code-effect' | 'adalo' | 'personal-brand';

export type ContentStatus = 'planned' | 'in-progress' | 'active' | 'completed' | 'paused';

export type ContentAssetStatus = 'planned' | 'in-production' | 'completed' | 'published';

export interface ContentAsset {
  id: string;
  title: string;
  status: ContentAssetStatus;
  publishDate?: string;
  url?: string;
  notes?: string;
}

export interface ContentSchedule {
  frequency: string;
  startDate?: string;
  endDate?: string;
}

export interface ContentTargets {
  count: number;
  cadence: string;
}

export interface ContentPlan {
  id: string;
  name: string;
  type: ContentType;
  business: BusinessArea;
  description: string;
  status: ContentStatus;
  schedule?: ContentSchedule;
  targets?: ContentTargets;
  assets: ContentAsset[];
  tags: string[];
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const CONTENT_TYPES: ContentType[] = [
  'long-form',
  'short-form',
  'series',
  'campaign',
  'archetype',
];

export const BUSINESS_AREAS: BusinessArea[] = [
  'tangible-ideas',
  'no-code-effect',
  'adalo',
  'personal-brand',
];

export const CONTENT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#3b82f6', // Blue
];

// Operating Rules
export type RuleType =
  | 'weekly-execution'
  | 'priority-stack'
  | 'decision-filter'
  | 'kill-criteria'
  | 'review-process';

export interface OperatingRule {
  id: string;
  rule: string;
  order: number;
  isRequired: boolean;
  examples?: string[];
}

export interface OperatingRules {
  id: string;
  type: RuleType;
  title: string;
  description: string;
  rules: OperatingRule[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const RULE_TYPES: RuleType[] = [
  'weekly-execution',
  'priority-stack',
  'decision-filter',
  'kill-criteria',
  'review-process',
];

// Target ICP
export interface ICPMessaging {
  id: string;
  message: string;
  channel: string;
}

export interface TargetICP {
  id: string;
  business: BusinessArea;
  name: string;
  description: string;
  characteristics: string[];
  painPoints: string[];
  messaging: ICPMessaging[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
