
import type { NavItem } from '@/lib/types';
import { LayoutDashboard, Wallet, Target, LineChart, BookOpen, Lightbulb, Sparkles, Briefcase } from 'lucide-react';

export const NAV_LINKS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/budget',
    label: 'Budget',
    icon: Wallet,
  },
  {
    href: '/dashboard/goals',
    label: 'Goals',
    icon: Target,
  },
  {
    href: '/dashboard/invest',
    label: 'Invest',
    icon: LineChart,
  },
  {
    href: '/dashboard/learn',
    label: 'Learn',
    icon: BookOpen,
  },
  {
    href: '/dashboard/qa',
    label: 'Expert Q&A',
    icon: Lightbulb,
  },
  {
    href: '/dashboard/business',
    label: 'Business',
    icon: Briefcase,
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
