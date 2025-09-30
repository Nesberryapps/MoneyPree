
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/firebase';
import type { Transaction, Goal } from '@/lib/types';
import { initialTransactions, initialGoals } from '@/lib/initial-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { BudgetSummaryChart } from '@/components/dashboard/budget-summary-chart';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetClient } from '@/components/budget/budget-client';
import { GoalsClient } from '@/components/goals/goals-client';
import { InvestmentSimulation } from '@/components/invest/investment-simulation';
import { FinancialLessons } from '@/components/learn/financial-lessons';
import { ExpertQA } from '@/components/qa/expert-qa';
import { NAV_LINKS } from '@/lib/constants';
import Loading from '@/components/layout/loading';

export default function DashboardTabPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  // State for gamification
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const activeTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const handleQuizCompletion = (score: number) => {
    setLessonsCompleted(prev => prev + 1);
    setQuestionsAnswered(prev => prev + score);
  };

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex flex-wrap h-auto justify-start mb-4">
              {NAV_LINKS.map((link) => (
                  <TabsTrigger key={link.href} value={link.href.replace('/dashboard/', '') || 'dashboard'}>
                      {link.label}
                  </TabsTrigger>
              ))}
          </TabsList>

          <TabsContent value="dashboard">
            <div className="flex flex-1 flex-col gap-4 md:gap-8">
                <DashboardClient
                    transactions={transactions}
                    goals={goals}
                    lessonsCompleted={lessonsCompleted}
                    questionsAnswered={questionsAnswered}
                />
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Budget Overview</CardTitle>
                        <CardDescription>
                        Your income and expenses for the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <BudgetSummaryChart transactions={transactions} />
                    </CardContent>
                    </Card>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="budget">
            <BudgetClient transactions={transactions} setTransactions={setTransactions} />
          </TabsContent>
          <TabsContent value="goals">
            <GoalsClient goals={goals} setGoals={setGoals} />
          </TabsContent>
          <TabsContent value="invest"><InvestmentSimulation /></TabsContent>
          <TabsContent value="learn">
            <FinancialLessons onQuizComplete={handleQuizCompletion} />
          </TabsContent>
          <TabsContent value="qa"><ExpertQA /></TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
