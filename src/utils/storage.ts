// src/utils/storage.ts
// Paste this into src/utils/storage.ts

import type { User, Expense } from '../types';

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem('expenses');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setExpenses(expenses: Expense[]): void {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

export function addExpense(expense: Expense): void {
  const current = getExpenses();
  current.push(expense);
  setExpenses(current);
}

export function clearSession(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('session');
}
