import { Header } from '@/components/layout/header';
import { BudgetClient } from '@/components/budget/budget-client';

export default function BudgetPage() {
  return (
    <div className="flex flex-col">
      <Header title="Budget Tracker" />
      <main className="flex-1 p-4 md:p-8">
        <BudgetClient />
      </main>
    </div>
  );
}
