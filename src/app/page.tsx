import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lightbulb, PiggyBank, Target } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { GoalsOverview } from '@/components/dashboard/goals-overview';
import { BudgetSummaryChart } from '@/components/dashboard/budget-summary-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const quickLinkImage = PlaceHolderImages.find(img => img.id === 'quick-link');

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Goal
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">New Car</div>
              <p className="text-xs text-muted-foreground">
                $2,350 remaining
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lessons Completed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">
                +1 since last week
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Questions Answered
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5</div>
              <p className="text-xs text-muted-foreground">
                AI wisdom unlocked!
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>
                Your income and expenses for the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BudgetSummaryChart />
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            <GoalsOverview />
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center gap-4">
                   <Avatar className="hidden h-9 w-9 sm:flex">
                     <AvatarImage src={quickLinkImage?.imageUrl} alt="Avatar" data-ai-hint={quickLinkImage?.imageHint} />
                     <AvatarFallback>AI</AvatarFallback>
                   </Avatar>
                   <div className="grid gap-1">
                     <p className="text-sm font-medium leading-none">Investment Simulation</p>
                     <p className="text-sm text-muted-foreground">You ran a new portfolio simulation.</p>
                   </div>
                   <div className="ml-auto font-medium text-sm">5m ago</div>
                </div>
                <div className="flex items-center gap-4">
                   <Avatar className="hidden h-9 w-9 sm:flex">
                     <AvatarImage src={quickLinkImage?.imageUrl} alt="Avatar" data-ai-hint={quickLinkImage?.imageHint} />
                     <AvatarFallback>AI</AvatarFallback>
                   </Avatar>
                   <div className="grid gap-1">
                     <p className="text-sm font-medium leading-none">New Lesson</p>
                     <p className="text-sm text-muted-foreground">AI created a lesson on "Advanced ETFs".</p>
                   </div>
                   <div className="ml-auto font-medium text-sm">2h ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
