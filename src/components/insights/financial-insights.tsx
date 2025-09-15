'use client';

import { useState } from 'react';
import { generateFinancialInsights } from '@/ai/flows/generate-financial-insights';
import type { Transaction } from '@/lib/types';
import { initialTransactions } from '@/lib/initial-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Lightbulb, TrendingUp, Sparkles, Trophy, Download } from 'lucide-react';
import type { FinancialInsight } from '@/ai/flows/generate-financial-insights';

export function FinancialInsights() {
  const [insights, setInsights] = useState<FinancialInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // In a real app, you'd fetch this from your state management or API
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    setInsights(null);
    try {
      const result = await generateFinancialInsights({ transactions });
      setInsights(result);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!insights) return;

    const reportContent = `
# Your Financial Insights Report

## Surprising Insight
${insights.surprisingInsight}

## Spending Analysis
${insights.spendingAnalysis}

## Actionable Suggestions
${insights.suggestions.map(s => `- ${s}`).join('\n')}

## Your Next Monthly Challenge
${insights.monthlyChallenge}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Financial-Insights-Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Personal AI Financial Analyst</CardTitle>
          <CardDescription>
            Get a deep analysis of your spending, saving, and income habits. Discover personalized insights and get a plan to improve your financial health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateInsights} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze My Finances
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {insights && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Your Financial Insights Report</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-primary"/> Surprising Insight</h3>
              <p className="text-muted-foreground">{insights.surprisingInsight}</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="text-primary"/> Spending Analysis</h3>
              <p className="text-muted-foreground">{insights.spendingAnalysis}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/> Actionable Suggestions</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {insights.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Trophy className="text-primary"/> Your Next Monthly Challenge</h3>
              <p className="text-muted-foreground">{insights.monthlyChallenge}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
