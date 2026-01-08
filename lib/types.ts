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
  'Operations',
  'Marketing',
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
