import { Header } from '@/components/layout/header';
import { InvestmentSimulation } from '@/components/invest/investment-simulation';

export default function InvestPage() {
  return (
    <div className="flex flex-col">
      <Header title="Investment Simulator" />
      <main className="flex-1 p-4 md:p-8">
        <InvestmentSimulation />
      </main>
    </div>
  );
}
