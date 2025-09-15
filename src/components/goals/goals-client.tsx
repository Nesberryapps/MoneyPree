'use client';

import { useState, useEffect } from 'react';
import { generateFinancialGoals } from '@/ai/flows/generate-financial-goals';
import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initialGoals } from '@/lib/initial-data';
import { formatDate } from '@/lib/utils';


export function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [prompt, setPrompt] = useState('');
  const [generatedGoals, setGeneratedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // Form state for new/editing goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setEditingGoal(null);
  };
  
  const handleOpenDialog = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setName(goal.name);
      setTargetAmount(String(goal.targetAmount));
      setCurrentAmount(String(goal.currentAmount));
      setDeadline(goal.deadline.toISOString().split('T')[0]); // Format for date input
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  }

  const handleSaveGoal = () => {
    if (!name || !targetAmount || !currentAmount || !deadline) {
      // Basic validation
      return;
    }
    
    if (editingGoal) {
      // Edit existing goal
      const updatedGoals = goals.map(g =>
        g.id === editingGoal.id ? { ...g, name, targetAmount: parseFloat(targetAmount), currentAmount: parseFloat(currentAmount), deadline: new Date(deadline) } : g
      );
      setGoals(updatedGoals);

    } else {
      // Add new goal
       const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        deadline: new Date(deadline),
      };
      setGoals([newGoal, ...goals]);
    }
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    setGoalToDelete(null);
    setIsDeleteAlertOpen(false);
  }

  const openDeleteDialog = (id: string) => {
    setGoalToDelete(id);
    setIsDeleteAlertOpen(true);
  }


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
                      Deadline: {isClient ? formatDate(goal.deadline) : ''}
                    </p>
                  </div>
                   <div className="flex items-center gap-2">
                     <div className="text-right">
                        <p className="font-semibold text-lg">${goal.currentAmount.toLocaleString()} / <span className="text-muted-foreground">${goal.targetAmount.toLocaleString()}</span></p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(goal)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(goal.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
           <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenDialog()}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add New Goal
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingGoal ? 'Edit' : 'Add'} Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Goal Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vacation Fund" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input id="targetAmount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="e.g. 5000" />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="currentAmount">Current Amount</Label>
                    <Input id="currentAmount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="e.g. 1200" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveGoal}>Save Goal</Button>
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
            <Button onClick={handleGenerateGoals} disabled={isLoading || !prompt}>
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
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this financial goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGoalToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                if (goalToDelete) {
                    handleDeleteGoal(goalToDelete);
                }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
