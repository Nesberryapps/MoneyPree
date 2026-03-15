
export type BlogPost = {
  id: string;
  title: string;
  publishedDate: string;
  summary: string;
  image: string; // Corresponds to an ID in placeholder-images.json
};

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The 50/30/20 Budgeting Rule Explained',
    publishedDate: '2024-07-28',
    summary: 'A simple, effective rule for managing your money. Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment. It\'s a great starting point for taking control of your finances.',
    image: 'blog-budgeting',
  },
  {
    id: '2',
    title: 'The Magic of Compound Interest',
    publishedDate: '2024-07-21',
    summary: 'Compound interest is your money making money for you. The earlier you start investing, the more time your money has to grow exponentially. It\'s the most powerful force in finance!',
    image: 'blog-compound-interest',
  },
  {
    id: '3',
    title: 'Why an Emergency Fund is Non-Negotiable',
    publishedDate: '2024-07-14',
    summary: 'An emergency fund is your financial safety net. Aim to save 3-6 months of living expenses to cover unexpected events like job loss or medical bills without derailing your financial goals.',
    image: 'blog-emergency-fund',
  },
  {
    id: '4',
    title: 'Simple Tips to Improve Your Credit Score',
    publishedDate: '2024-07-07',
    summary: 'A good credit score opens doors to better loan rates. Pay your bills on time, keep credit card balances low, and avoid opening too many new accounts at once to see your score climb.',
    image: 'blog-credit-score',
  },
];
