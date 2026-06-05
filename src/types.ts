// src/types.ts

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Bills'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: Category;
  note: string;
  date: string;
}