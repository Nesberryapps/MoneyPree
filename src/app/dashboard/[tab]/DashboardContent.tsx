'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';
import { BusinessDashboard } from '@/components/business/business-dashboard';
import { useLocalData } from '@/hooks/use-local-data';
import { AdsenseAd } from '@/components/ads/adsense-ad';
import { formatDate } from '@/lib/utils';
import { Wallet } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function DashboardContent({ tab }: { tab: string }) {
  const router = useRouter();
  const { 
    transactions,
    goals,
    isLoading 
  } = useLocalData();
  
  const { isVoiceInteractionEnabled } = useVoiceInteraction();

  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleTabChange = (value: string) => {
    const targetPath = value === 'dashboard' ? '/dashboard/dashboard' : `/dashboard/${value}`;
    router.push(targetPath);
  };

  const handleQuizCompletion = (score: number) => {
    setLessonsCompleted(prev => prev + 1);
    setQuestionsAnswered(prev => prev + score);
  };

  if (isLoading) {
    return <Loading />;
  }
  
  const recentTransactions = [...(transactions || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <div className="flex justify-between items-start mb-4">
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex flex-wrap h-auto justify-start mb-4">
                {NAV_LINKS.map((link) => (
                    <TabsTrigger key={link.href} value={link.href.replace('/dashboard/', '')}>
                        {link.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="dashboard">
                <div className="flex flex-1 flex-col gap-4 md:gap-8">
                    <DashboardClient
                        transactions={transactions || []}
                        goals={goals || []}
                        lessonsCompleted={lessonsCompleted}
                        questionsAnswered={questionsAnswered}
                    />
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
                        <Card>
                          <CardHeader>
                              <CardTitle>Budget Overview</CardTitle>
                              <CardDescription>
                              A summary of your recent transactions and a breakdown of your expenses.
                              </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-8 lg:grid-cols-2">
                              <div>
                                <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
                                <div className="space-y-4">
                                  {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center gap-4">
                                       <div className="bg-muted p-2 rounded-lg">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                      </div>
                                      <div className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                      </div>
                                    </div>
                                  )) : (
                                    <p className="text-sm text-muted-foreground">No transactions yet.</p>
                                  )}
                                </div>
                              </div>
                              <BudgetSummaryChart transactions={transactions || []} />
                          </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="budget">
                <BudgetClient
                    transactions={transactions || []}
                    isVoiceInteractionEnabled={isVoiceInteractionEnabled}
                />
            </TabsContent>
            <TabsContent value="goals">
                <GoalsClient goals={goals || []} />
            </TabsContent>
            <TabsContent value="invest"><InvestmentSimulation /></TabsContent>
            <TabsContent value="learn">
                <FinancialLessons onQuizComplete={handleQuizCompletion} />
            </TabsContent>
            <TabsContent value="qa"><ExpertQA /></TabsContent>
            <TabsContent value="business"><BusinessDashboard /></TabsContent>

            </Tabs>
        </div>
        <div className="mt-8">
          <AdsenseAd />
        </div>
      </main>
      <Footer />
    </div>
  );
}
