'use client';

import { useMemo } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Expense } from '@/lib/types';

export function useExpenses() {
    const expensesData = useQuery(api.expenses.get);
    const createExpense = useMutation(api.expenses.create);
    const updateExpenseMutation = useMutation(api.expenses.update);
    const removeExpenseMutation = useMutation(api.expenses.remove);

    // Map Convex data to include _id as id for compatibility
    const expenses: (Expense & { _id: Id<"expenses"> })[] = (expensesData ?? []).map((expense) => ({
        ...expense,
        id: expense._id,
    }));

    const isLoaded = expensesData !== undefined;

    const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
        const id = await createExpense({
            name: expense.name,
            amount: expense.amount,
            billingCycle: expense.billingCycle,
            category: expense.category,
            renewalDate: expense.renewalDate,
            notes: expense.notes,
        });
        return id;
    };

    const updateExpense = async (id: string | Id<"expenses">, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
        await updateExpenseMutation({
            id: id as Id<"expenses">,
            name: updates.name,
            amount: updates.amount,
            billingCycle: updates.billingCycle,
            category: updates.category,
            renewalDate: updates.renewalDate,
            notes: updates.notes,
        });
    };

    const deleteExpense = async (id: string | Id<"expenses">) => {
        await removeExpenseMutation({ id: id as Id<"expenses"> });
    };

    const getExpense = (id: string | Id<"expenses">) => {
        return expenses.find((expense) => expense._id === id || expense.id === id);
    };

    // Calculate monthly totals
    const monthlyTotal = useMemo(() => {
        return expenses.reduce((total, expense) => {
            if (expense.billingCycle === 'monthly') {
                return total + expense.amount;
            }
            // Convert annual to monthly
            return total + expense.amount / 12;
        }, 0);
    }, [expenses]);

    // Calculate annual totals
    const annualTotal = useMemo(() => {
        return expenses.reduce((total, expense) => {
            if (expense.billingCycle === 'annual') {
                return total + expense.amount;
            }
            // Convert monthly to annual
            return total + expense.amount * 12;
        }, 0);
    }, [expenses]);

    // Get expenses by category
    const expensesByCategory = useMemo(() => {
        const grouped: Record<string, number> = {};
        expenses.forEach((expense) => {
            const monthlyAmount = expense.billingCycle === 'monthly'
                ? expense.amount
                : expense.amount / 12;
            grouped[expense.category] = (grouped[expense.category] || 0) + monthlyAmount;
        });
        return grouped;
    }, [expenses]);

    // Get upcoming renewals (next 30 days)
    const upcomingRenewals = useMemo(() => {
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return expenses
            .filter((expense) => {
                const renewalDate = new Date(expense.renewalDate);
                return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
            })
            .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
    }, [expenses]);

    return {
        expenses,
        isLoaded,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpense,
        monthlyTotal,
        annualTotal,
        expensesByCategory,
        upcomingRenewals,
    };
}
