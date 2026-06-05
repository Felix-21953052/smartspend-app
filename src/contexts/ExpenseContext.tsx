import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, getExpenses, saveExpenses } from '../utils/storage';
import type { User, Expense } from '../types';

type ExpenseContextValue = {
  currentUser: User | null;
  expenses: Expense[];
  setCurrentUser: (u: User | null) => void;
  addExpense: (expense: Expense) => void;
  logout: () => void;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrUser] = useState<User | null>(null);
  const [expenses, setExpensesState] = useState<Expense[]>([]);

  useEffect(() => {
    setCurrUser(getCurrentUser());
    setExpensesState(getExpenses());
  }, []);

  const setCurrentUser = (u: User | null) => {
    setCurrUser(u);
  };

  const addExpense = (expense: Expense) => {
    const updated = [...expenses, expense];
    setExpensesState(updated);
    saveExpenses(updated);
  };

  const logout = () => {
    setCurrUser(null);
  };

  const value = { currentUser, expenses, setCurrentUser, addExpense, logout };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenseContext = (): ExpenseContextValue => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenseContext must be used within ExpenseProvider');
  return ctx;
};

export default ExpenseContext;