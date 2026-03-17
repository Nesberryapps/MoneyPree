
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BudgetClient } from '@/components/budget/budget-client';
import { GoalsClient } from '@/components/goals/goals-client';
import { InvestmentSimulation } from '@/components/invest/investment-simulation';
import { FinancialLessons } from '@/components/learn/financial-lessons';
import { ExpertQA } from '@/components/qa/expert-qa';
import { BusinessDashboard } from '@/components/business/business-dashboard';
import Loading from '@/components/layout/loading';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';
import { useLocalData } from '@/hooks/use-local-data';
import { AdsenseAd } from '@/components/ads/adsense-ad';
import { Building, Building2, Home, Landmark, Link, Wallet, Target, TrendingUp, BookOpen, Lightbulb, Briefcase, Settings, HelpCircle, Tent } from 'lucide-react';
import { ButterflyEffectSimulator } from '@/components/dashboard/butterfly-simulator';
import { useRouter } from 'next/navigation';
import { SettingsClient } from '@/components/settings/settings-client';
import HelpPage from '@/app/help/page';
import { useVerification } from '@/hooks/use-verification';

function FinancialAvatar({ netWorth }: { netWorth: number }) {
  const getAvatar = () => {
    if (netWorth < 1000) {
      return { icon: Tent, label: 'Getting Started' };
    }
    if (netWorth < 10000) {
      return { icon: Home, label: 'Solid Foundation' };
    }
    if (netWorth < 50000) {
      return { icon: Building, label: 'Growing Strong' };
    }
    if (netWorth < 100000) {
        return { icon: Building2, label: 'City Builder' };
    }
    return { icon: Landmark, label: 'Financial Fortress' };
  };

  const { icon: Icon, label } = getAvatar();

  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center">
        <Icon className="h-16 w-16 text-primary mb-2" />
        <p className="font-semibold text-lg">{label}</p>
        <p className="text-sm text-muted-foreground">Your Financial Twin</p>
    </Card>
  );
}


function PulseDashboard({ isVerified }: { isVerified: boolean }) {
    const { transactions, goals } = useLocalData();
    const router = useRouter();

    const { totalIncome, totalExpenses, safeToSpend } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        // A simple "Safe to Spend" might just be the net balance. More complex logic can be added.
        const safe = income - expenses;
        return { totalIncome: income, totalExpenses: expenses, safeToSpend: safe };
    }, [transactions]);
    
    const quickActions = [
        { title: 'Manage Budget', href: '/dashboard/budget', icon: Wallet },
        { title: 'Review Goals', href: '/dashboard/goals', icon: Target },
        { title: 'Simulate Investments', href: '/dashboard/invest', icon: TrendingUp },
        { title: 'Learn & Grow', href: '/dashboard/learn', icon: BookOpen },
        { title: 'Ask an Expert', href: '/dashboard/qa', icon: Lightbulb },
        { title: 'Business Hub', href: '/dashboard/business', icon: Briefcase },
    ];

    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Safe-to-Spend Balance</CardTitle>
                        <CardDescription>Your current estimated disposable income.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-5xl font-bold ${safeToSpend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${safeToSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <FinancialAvatar netWorth={safeToSpend} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {quickActions.map(action => (
                        <button key={action.href} onClick={() => router.push(action.href)} className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors">
                            <action.icon className="h-8 w-8 mb-2 text-primary" />
                            <span className="text-sm font-medium text-center">{action.title}</span>
                        </button>
                    ))}
                </CardContent>
            </Card>

            <ButterflyEffectSimulator />
            
            <div className="mt-8">
              <AdsenseAd isVerified={isVerified} />
            </div>
        </div>
    );
}

export default function DashboardContent({ tab }: { tab: string }) {
  const { isVoiceInteractionEnabled } = useVoiceInteraction();
  const { isLoading, transactions, goals } = useLocalData();
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const { isVerified } = useVerification();

  if (isLoading) {
    return <Loading />;
  }

  const handleQuizCompletion = (score: number) => {
    setLessonsCompleted(prev => prev + 1);
  };
  
  const renderContent = () => {
    switch (tab) {
        case 'dashboard':
            return <PulseDashboard isVerified={isVerified} />;
        case 'budget':
            return <BudgetClient transactions={transactions || []} isVoiceInteractionEnabled={isVoiceInteractionEnabled} />;
        case 'goals':
            return <GoalsClient goals={goals || []} />;
        case 'invest':
            return <InvestmentSimulation />;
        case 'learn':
            return <FinancialLessons onQuizComplete={handleQuizCompletion} />;
        case 'qa':
            return <ExpertQA />;
        case 'business':
            return <BusinessDashboard />;
        case 'settings':
            return <SettingsClient />;
        case 'help':
            return <HelpPage />;
        default:
            return <PulseDashboard isVerified={isVerified} />;
    }
  }

  return (
    <main className="flex-1 p-4 md:p-8">
        {renderContent()}
    </main>
  );
}
