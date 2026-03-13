'use client';

import { Pie, PieChart, Cell } from 'recharts';
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
import { BUDGET_CATEGORIES } from '@/lib/constants';

// Define a richer chart config with colors for each category.
const chartConfig = {
  housing: { label: 'Housing', color: 'hsl(var(--chart-1))' },
  transportation: { label: 'Transportation', color: 'hsl(var(--chart-2))' },
  food: { label: 'Food', color: 'hsl(var(--chart-3))' },
  utilities: { label: 'Utilities', color: 'hsl(var(--chart-4))' },
  entertainment: { label: 'Entertainment', color: 'hsl(var(--chart-5))' },
  health: { label: 'Health', color: 'hsl(var(--chart-1))' }, // Re-using colors for simplicity
  shopping: { label: 'Shopping', color: 'hsl(var(--chart-2))' },
  other: { label: 'Other', color: 'hsl(var(--muted))' },
} satisfies ChartConfig;


type BudgetSummaryChartProps = {
  transactions: Transaction[];
};

export function BudgetSummaryChart({ transactions }: BudgetSummaryChartProps) {
  const chartData = useMemo(() => {
    const expenseData: { [category: string]: number } = {};
    
    // Initialize with all possible expense categories to ensure they appear in the legend
    BUDGET_CATEGORIES.expense.forEach(cat => {
        expenseData[cat.value] = 0;
    });

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (expenseData.hasOwnProperty(transaction.category)) {
          expenseData[transaction.category] += transaction.amount;
        } else {
          // If category is not in our predefined list, group it under 'other'
          expenseData['other'] = (expenseData['other'] || 0) + transaction.amount;
        }
      });
      
    return Object.entries(expenseData)
        .map(([category, total]) => ({
            name: category,
            value: total,
            fill: chartConfig[category as keyof typeof chartConfig]?.color || chartConfig.other.color,
        }))
        .filter(item => item.value > 0); // Only show categories with expenses

  }, [transactions]);

  const totalExpenses = useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  if (totalExpenses === 0) {
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg border-2 border-dashed p-4">
        <p className="text-muted-foreground">No expense data to display.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-3xl font-bold"
        >
            ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </text>
        <text
            x="50%"
            y="50%"
            dy="1.5em"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-sm"
        >
            Total Expenses
        </text>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
