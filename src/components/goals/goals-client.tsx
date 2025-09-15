'use client';

import { useState } from 'react';
import { generateFinancialGoals } from '@/ai/flows/generate-financial-goals';
import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { initialGoals } from '@/lib/initial-data';


export function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [prompt, setPrompt] = useState('');
  const [generatedGoals, setGeneratedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for new goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleGenerateGoals = async () => {
    setIsLoading(true);
    setGeneratedGoals([]);
    try {
      const result = await generateFinancialGoals({ prompt });
      setGeneratedGoals(result.goals);
    } catch (error) {
      console.error('Error generating financial goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: (goals.length + 1).toString(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: new Date(deadline),
    };
    setGoals([newGoal, ...goals]);
    setIsDialogOpen(false);
    // Reset form
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>My Financial Goals</CardTitle>
          <CardDescription>Track your progress towards your financial objectives.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Deadline: {goal.deadline.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${goal.currentAmount.toLocaleString()} / <span className="text-muted-foreground">${goal.targetAmount.toLocaleString()}</span></p>
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New Goal
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input id="targetAmount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="currentAmount">Current Amount</Label>
                    <Input id="currentAmount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddGoal}>Save Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Goal Generator</CardTitle>
          <CardDescription>
            Describe your financial dreams, and let our AI create actionable goals for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="dream">My financial dream is...</Label>
            <Textarea
              id="dream"
              placeholder="e.g., to retire early, buy a house, or travel the world."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={handleGenerateGoals} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Goals
            </Button>
          </div>
          {generatedGoals.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Suggested Goals:</h3>
              <ul className="list-disc list-inside space-y-2">
                {generatedGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
