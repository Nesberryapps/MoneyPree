
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ButterflyEffectSimulator() {
  const [dailySpending, setDailySpending] = useState(7);
  const [years, setYears] = useState(5);
  const interestRate = 0.07; // Assumed average annual return

  const futureValue = useMemo(() => {
    const dailySavings = dailySpending;
    const annualSavings = dailySavings * 365;
    
    // Future value of an annuity formula
    const fv = annualSavings * ( (Math.pow(1 + interestRate, years) - 1) / interestRate );

    return fv;
  }, [dailySpending, years, interestRate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Butterfly Effect Simulator</CardTitle>
        <CardDescription>See how small changes can create a big impact on your future.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Skipping a daily ${dailySpending} purchase for {years} years...</p>
            <p className="text-sm text-muted-foreground">...could grow into</p>
            <p className="text-4xl lg:text-5xl font-bold text-primary mt-2">
                ${futureValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">(assuming a 7% annual return)</p>
        </div>
        <div className="grid gap-4 pt-4">
            <div>
                <div className="flex justify-between mb-2">
                    <Label htmlFor="daily-spending">Small Daily Purchase</Label>
                    <span>${dailySpending}</span>
                </div>
                <Slider
                    id="daily-spending"
                    min={1}
                    max={20}
                    step={1}
                    value={[dailySpending]}
                    onValueChange={(value) => setDailySpending(value[0])}
                />
            </div>
            <div>
                 <div className="flex justify-between mb-2">
                    <Label htmlFor="years">For How Long?</Label>
                    <span>{years} {years > 1 ? 'years' : 'year'}</span>
                </div>
                <Slider
                    id="years"
                    min={1}
                    max={30}
                    step={1}
                    value={[years]}
                    onValueChange={(value) => setYears(value[0])}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
