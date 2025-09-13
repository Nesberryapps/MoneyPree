import { Header } from '@/components/layout/header';
import { FinancialLessons } from '@/components/learn/financial-lessons';

export default function LearnPage() {
  return (
    <div className="flex flex-col">
      <Header title="Financial Lessons" />
      <main className="flex-1 p-4 md:p-8">
        <FinancialLessons />
      </main>
    </div>
  );
}
