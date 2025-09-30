
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
  ShieldCheck,
} from 'lucide-react';
import type { Goal, Transaction } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

// Gamification levels
const literacyLevels = [
    { name: 'Novice', minPoints: 0 },
    { name: 'Apprentice', minPoints: 5 },
    { name: 'Adept', minPoints: 15 },
    { name: 'Expert', minPoints: 30 },
    { name: 'Master', minPoints: 50 },
];

const calculateLevel = (points: number) => {
    return (
        literacyLevels.slice().reverse().find(l => points >= l.minPoints) ||
        literacyLevels[0]
    );
};

type DashboardClientProps = {
  transactions: Transaction[];
  goals: Goal[];
  lessonsCompleted: number;
  questionsAnswered: number;
};

export function DashboardClient({ transactions, goals, lessonsCompleted, questionsAnswered }: DashboardClientProps) {
    const router = useRouter();
    const [netBalance, setNetBalance] = useState(0);
    const [nextGoal, setNextGoal] = useState<Goal | null>(null);

    // Gamification state
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(literacyLevels[0]);
    const [nextLevel, setNextLevel] = useState(literacyLevels[1]);
    const [progressToNextLevel, setProgressToNextLevel] = useState(0);

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

        // Calculate gamification stats
        // Each lesson is 1 point, each correct answer is 1 point.
        const totalPoints = lessonsCompleted + questionsAnswered;
        setPoints(totalPoints);

        const currentLevel = calculateLevel(totalPoints);
        setLevel(currentLevel);

        const currentLevelIndex = literacyLevels.findIndex(l => l.name === currentLevel.name);
        const next = literacyLevels[currentLevelIndex + 1];
        
        if (next) {
            setNextLevel(next);
            const pointsInCurrentLevel = totalPoints - currentLevel.minPoints;
            const pointsForNextLevel = next.minPoints - currentLevel.minPoints;
            setProgressToNextLevel((pointsInCurrentLevel / pointsForNextLevel) * 100);
        } else {
            // User is at max level
            setProgressToNextLevel(100);
        }

    }, [transactions, goals, lessonsCompleted, questionsAnswered]);


  const nextGoalRemaining = nextGoal ? nextGoal.targetAmount - nextGoal.currentAmount : 0;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card className="bg-green-100/10 dark:bg-green-800/20 border-green-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-muted-foreground">
            Your current net balance
          </p>
        </CardContent>
      </Card>
      <Card className="bg-blue-100/10 dark:bg-blue-800/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{nextGoal?.name || 'No Goal Set'}</div>
          <p className="text-xs text-muted-foreground">
            {nextGoal ? `$${nextGoalRemaining.toLocaleString()} remaining` : 'Add a goal to get started'}
          </p>
        </CardContent>
      </Card>
      <Card 
        className="lg:col-span-2 cursor-pointer hover:bg-muted/50 transition-colors bg-purple-100/10 dark:bg-purple-800/20 border-purple-500/30"
        onClick={() => router.push('/dashboard/learn')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Literacy Level</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-1">
                <div className="text-2xl font-bold text-purple-500">{level.name}</div>
                <div className="text-sm text-muted-foreground">{points} pts</div>
            </div>
            <Progress value={progressToNextLevel} className="w-full h-2 mb-1 [&>div]:bg-purple-500" />
            <p className="text-xs text-muted-foreground">
                {nextLevel ? `${nextLevel.minPoints - points} points to ${nextLevel.name}` : 'Max level achieved!'}
            </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
