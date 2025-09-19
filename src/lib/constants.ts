import type { NavItem } from '@/lib/types';
import { LayoutDashboard, Wallet, Target, LineChart, BookOpen, Lightbulb } from 'lucide-react';

export const NAV_LINKS: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/budget',
    label: 'Budget',
    icon: Wallet,
  },
  {
    href: '/goals',
    label: 'Goals',
    icon: Target,
  },
  {
    href: '/invest',
    label: 'Invest',
    icon: LineChart,
  },
  {
    href: '/learn',
    label: 'Learn',
    icon: BookOpen,
  },
  {
    href: '/qa',
    label: 'Expert Q&A',
    icon: Lightbulb,
  },
];

export const BUDGET_CATEGORIES = {
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' },
  ],
  expense: [
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'other', label: 'Other' },
  ]
}
