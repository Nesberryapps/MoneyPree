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
import type { Goal, Transaction } from '@/lib/types';
import { useEffect, useState } from 'react';

const lessonsCompleted = 12;
const questionsAnswered = 5;

type DashboardClientProps = {
  transactions: Transaction[];
  goals: Goal[];
};

export function DashboardClient({ transactions, goals }: DashboardClientProps) {
    const [netBalance, setNetBalance] = useState(0);
    const [nextGoal, setNextGoal] = useState<Goal | null>(null);

    useEffect(() => {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        setNetBalance(totalIncome - totalExpenses);

        if (goals.length > 0) {
            const sortedGoals = [...goals].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
            setNextGoal(sortedGoals[0] || null);
        } else {
            setNextGoal(null);
        }

    }, [transactions, goals]);


  const nextGoalRemaining = nextGoal ? nextGoal.targetAmount - nextGoal.currentAmount : 0;

  return (
    <>
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
