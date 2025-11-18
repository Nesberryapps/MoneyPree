

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

export type Business = {
    id: string;
    userId: string;
    name: string;
    industry: string;
    entityType: 'Sole Proprietorship' | 'LLC' | 'S-Corp' | 'C-Corp' | 'Partnership';
};

export type BusinessTransaction = {
    id: string;
    businessId: string;
    date: Date;
    description: string;
    amount: number;
    type: 'revenue' | 'expense';
    category: string;
    isTaxDeductible?: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: Date;
};
