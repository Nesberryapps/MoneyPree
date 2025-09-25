'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';
import { subMonths, format, startOfMonth } from 'date-fns';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type BudgetSummaryChartProps = {
  transactions: Transaction[];
};

export function BudgetSummaryChart({ transactions }: BudgetSummaryChartProps) {
  const chartData = useMemo(() => {
    const data: { [key: string]: { month: string; income: number; expenses: number } } = {};
    const today = new Date();

    // Initialize data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(date, 'yyyy-MM');
      data[monthKey] = {
        month: format(date, 'MMMM'),
        income: 0,
        expenses: 0,
      };
    }

    // Process transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = format(transactionDate, 'yyyy-MM');
      
      if (data[monthKey]) {
        if (transaction.type === 'income') {
          data[monthKey].income += transaction.amount;
        } else {
          data[monthKey].expenses += transaction.amount;
        }
      }
    });

    return Object.values(data);
  }, [transactions]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value}`}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
