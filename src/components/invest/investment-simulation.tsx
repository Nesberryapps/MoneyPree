'use client';

import { useState } from 'react';
import {
  simulateInvestmentScenarios,
  type SimulateInvestmentScenariosOutput,
} from '@/ai/flows/simulate-investment-scenarios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, Shield, BarChart } from 'lucide-react';

export function InvestmentSimulation() {
  const [currentHoldings, setCurrentHoldings] = useState('');
  const [investmentGoals, setInvestmentGoals] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulateInvestmentScenariosOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const result = await simulateInvestmentScenarios({
        currentHoldings,
        investmentGoals,
      });
      setSimulationResult(result);
    } catch (e) {
      setError('Failed to run simulation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Investment Scenario Simulator</CardTitle>
          <CardDescription>
            Enter your current portfolio and goals to get AI-powered diversification suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="holdings">Current Holdings</Label>
            <Textarea
              id="holdings"
              placeholder="e.g., 10 Apple (AAPL), 50 Vanguard S&P 500 ETF (VOO)"
              value={currentHoldings}
              onChange={(e) => setCurrentHoldings(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">Investment Goals</Label>
            <Textarea
              id="goals"
              placeholder="e.g., Long-term growth, moderate risk tolerance, 10-year horizon"
              value={investmentGoals}
              onChange={(e) => setInvestmentGoals(e.target.value)}
            />
          </div>
          <Button onClick={handleSimulate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Simulation
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

      {simulationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><BarChart className="text-primary"/> Suggested Diversification</h3>
              <p className="text-muted-foreground">{simulationResult.suggestedDiversification}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Shield className="text-primary"/> Risk Assessment</h3>
              <p className="text-muted-foreground">{simulationResult.riskAssessment}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="text-primary"/> Potential Returns</h3>
              <p className="text-muted-foreground">{simulationResult.potentialReturns}</p>
            </div>
             {simulationResult.disclaimer && (
                <p className="text-xs text-muted-foreground pt-4 border-t">{simulationResult.disclaimer}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
