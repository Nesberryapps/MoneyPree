import type { Transaction, Goal } from '@/lib/types';

export const initialTransactions: Transaction[] = [
  { id: '1', date: new Date('2024-05-01'), description: 'Salary', amount: 5000, type: 'income', category: 'salary' },
  { id: '2', date: new Date('2024-05-01'), description: 'Rent', amount: 1500, type: 'expense', category: 'housing' },
  { id: '3', date: new Date('2024-05-05'), description: 'Groceries', amount: 300, type: 'expense', category: 'food' },
  { id: '4', date: new Date('2024-05-10'), description: 'Gas', amount: 50, type: 'expense', category: 'transportation' },
  { id: '5', date: new Date('2024-05-15'), description: 'Freelance Project', amount: 750, type: 'income', category: 'freelance' },
];

export const initialGoals: Goal[] = [
  { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000, deadline: new Date('2025-12-31') },
  { id: '2', name: 'New Car Down Payment', targetAmount: 5000, currentAmount: 1200, deadline: new Date('2025-06-30') },
  { id: '3', name: 'Vacation to Japan', targetAmount: 8000, currentAmount: 6000, deadline: new Date('2024-11-01') },
];
