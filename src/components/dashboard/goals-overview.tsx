'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const goals = [
  {
    name: 'Vacation Fund',
    progress: 75,
    description: '$3,750 of $5,000 saved',
  },
  {
    name: 'Emergency Fund',
    progress: 50,
    description: '$5,000 of $10,000 saved',
  },
  {
    name: 'New Car',
    progress: 20,
    description: '$4,000 of $20,000 saved',
  },
];

export function GoalsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals Progress</CardTitle>
        <CardDescription>
          You&apos;re making great progress towards your financial goals!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.name} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium">{goal.name}</p>
                <p className="text-xs text-muted-foreground">{goal.progress}%</p>
              </div>
              <Progress value={goal.progress} aria-label={`${goal.name} progress`} />
              <p className="text-xs text-muted-foreground">{goal.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
