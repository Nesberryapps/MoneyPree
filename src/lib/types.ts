export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
};

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
};
