'use client';

import { useMemo } from 'react';
import type { Business, BusinessTransaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PeerBenchmarkCardProps {
  transactions: BusinessTransaction[];
  business: Business;
}

// Hardcoded benchmark data for simulation
const BENCHMARKS: Record<string, Record<string, number>> = {
  'Graphic Designer': {
    'Software': 0.15,
    'Marketing': 0.10,
  },
  'Consultant': {
    'Travel': 0.20,
    'Software': 0.10,
  },
  'Retail': {
    'Marketing': 0.18,
    'Rent': 0.25,
  },
  'Photographer': {
    'Software': 0.12,
    'Travel': 0.15,
  },
   'Developer': {
    'Software': 0.20,
    'Marketing': 0.05,
  },
  'Writer': {
    'Software': 0.08,
    'Marketing': 0.12,
  },
};

export function PeerBenchmarkCard({ transactions, business }: PeerBenchmarkCardProps) {
  const { totalExpenses, benchmarkData } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (!business.industry || !BENCHMARKS[business.industry] || total === 0) {
      return { totalExpenses: total, benchmarkData: null };
    }

    const industryBenchmarks = BENCHMARKS[business.industry];

    const userSpending: Record<string, number> = {};
    Object.keys(industryBenchmarks).forEach(category => {
      const categoryExpenses = expenses
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      userSpending[category] = categoryExpenses / total;
    });

    const insights = Object.keys(industryBenchmarks).map(category => {
      const benchmarkPercentage = industryBenchmarks[category];
      const userPercentage = userSpending[category] || 0;
      const difference = userPercentage - benchmarkPercentage;
      let status: 'high' | 'normal' | 'low' = 'normal';
      if (difference > 0.05) status = 'high';
      if (difference < -0.05) status = 'low';

      return {
        category,
        userPercentage,
        benchmarkPercentage,
        status,
      };
    });

    return { totalExpenses: total, benchmarkData: insights };
  }, [transactions, business.industry]);

  if (!business.industry || business.industry === 'Other') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Peer Benchmarking
          </CardTitle>
          <CardDescription>
            See how your spending compares to others in your field. This is the "Social Proof" feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-center p-4 rounded-lg bg-muted/50">
            <Info className="h-5 w-5 mr-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Please select an industry in your business profile to see benchmarks.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!benchmarkData || totalExpenses === 0) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Peer Benchmarking: {business.industry}
                </CardTitle>
                <CardDescription>
                    See how your spending compares to others in your field. This is the "Social Proof" feature.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center text-center p-4 rounded-lg bg-muted/50">
                    <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Add some expense transactions to see how you compare to your peers.
                    </p>
                </div>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Peer Benchmarking: {business.industry}
        </CardTitle>
        <CardDescription>
          See how your spending compares to others in your field. This is the "Social Proof" feature.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {benchmarkData.map(item => (
          <div key={item.category}>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-medium">{item.category} Spending</p>
                <p className={`text-lg font-bold ${item.status === 'high' ? 'text-destructive' : 'text-green-500'}`}>
                    {(item.userPercentage * 100).toFixed(1)}%
                </p>
            </div>
            <Progress value={item.userPercentage * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Your Spend</span>
                <span>Industry Avg: {(item.benchmarkPercentage * 100).toFixed(1)}%</span>
            </div>
             {item.status === 'high' && (
                <p className="text-xs text-amber-600 mt-2">
                    Your spending on {item.category} is higher than the average for your industry. You may want to review these expenses.
                </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
