
import type { NavItem } from '@/lib/types';
import { LayoutDashboard, Wallet, Target, TrendingUp, BookOpen, MessageCircle, Briefcase, Settings, HelpCircle } from 'lucide-react';

export const NAV_LINKS: NavItem[] = [
  {
    href: '/dashboard/dashboard',
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
    icon: TrendingUp,
  },
  {
    href: '/dashboard/learn',
    label: 'Learn',
    icon: BookOpen,
  },
  {
    href: '/dashboard/qa',
    label: 'CFO Chat',
    icon: MessageCircle,
  },
  {
    href: '/dashboard/business',
    label: 'Business',
    icon: Briefcase,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    href: '/dashboard/help',
    label: 'Help',
    icon: HelpCircle,
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
};

export const REVENUE_CATEGORIES = ['Sales', 'Services', 'Other'];
export const EXPENSE_CATEGORIES = ['Marketing', 'Software', 'Travel', 'Office Supplies', 'Rent', 'Salaries', 'Other'];

export const INDUSTRIES = ['Graphic Designer', 'Consultant', 'Retail', 'Photographer', 'Developer', 'Writer', 'Other'];
