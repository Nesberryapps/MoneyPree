'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PiggyBank,
  Target,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import type { Goal } from '@/lib/types';
import { initialGoals } from '@/lib/initial-data';
import { useEffect, useState } from 'react';

// These would typically come from a data store or API
const initialTransactions: any[] = [
    { id: '1', date: new Date('2024-05-01'), description: 'Salary', amount: 5000, type: 'income', category: 'salary' },
    { id: '2', date: new Date('2024-05-01'), description: 'Rent', amount: 1500, type: 'expense', category: 'housing' },
    { id: '3', date: new Date('2024-05-05'), description: 'Groceries', amount: 300, type: 'expense', category: 'food' },
    { id: '4', date: new Date('2024-05-10'), description: 'Gas', amount: 50, type: 'expense', category: 'transportation' },
    { id: '5', date: new Date('2024-05-15'), description: 'Freelance Project', amount: 750, type: 'income', category: 'freelance' },
  ];
const lessonsCompleted = 12;
const questionsAnswered = 5;

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
  );
}
