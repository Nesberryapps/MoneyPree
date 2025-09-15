import { Header } from '@/components/layout/header';
import { FinancialInsights } from '@/components/insights/financial-insights';

export default function InsightsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Financial Insights" />
      <main className="flex-1 p-4 md:p-8">
        <FinancialInsights />
      </main>
    </div>
  );
}
