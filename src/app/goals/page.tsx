import { Header } from '@/components/layout/header';
import { GoalsClient } from '@/components/goals/goals-client';

export default function GoalsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Financial Goals" />
      <main className="flex-1 p-4 md:p-8">
        <GoalsClient />
      </main>
    </div>
  );
}
