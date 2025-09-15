'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  PiggyBank,
  Target,
  BookOpen,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import type { Goal } from '@/lib/types';
import { initialGoals, initialTransactions } from '@/lib/initial-data';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const lessonsCompleted = 12;
const questionsAnswered = 5;

const quickLinks = [
    { title: 'Track a Transaction', description: 'Add a new income or expense.', href: '/budget', icon: PiggyBank},
    { title: 'Set a Goal', description: 'Define a new financial target.', href: '/goals', icon: Target},
    { title: 'Simulate an Investment', description: 'Explore potential returns.', href: '/invest', icon: BookOpen},
    { title: 'Ask an Expert', description: 'Get answers from our AI.', href: '/qa', icon: Lightbulb}
]

export function DashboardClient() {
    const [netBalance, setNetBalance] = useState(0);
    const [nextGoal, setNextGoal] = useState<Goal | null>(null);

    useEffect(() => {
        const totalIncome = initialTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = initialTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        setNetBalance(totalIncome - totalExpenses);

        const sortedGoals = [...initialGoals].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        setNextGoal(sortedGoals[0] || null);

    }, [])


  const nextGoalRemaining = nextGoal ? nextGoal.targetAmount - nextGoal.currentAmount : 0;

  return (
    <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card key={link.title} className="hover:bg-muted/50 transition-colors">
            <Link href={link.href} className="block h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{link.title}</CardTitle>
                <link.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{link.description}</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                    Go <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${netBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Your current net balance
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nextGoal?.name || 'No Goal Set'}</div>
          <p className="text-xs text-muted-foreground">
            {nextGoal ? `$${nextGoalRemaining.toLocaleString()} remaining` : 'Add a goal to get started'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{lessonsCompleted}</div>
          <p className="text-xs text-muted-foreground">+1 since last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{questionsAnswered}</div>
          <p className="text-xs text-muted-foreground">AI wisdom unlocked!</p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
