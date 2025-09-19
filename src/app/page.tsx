import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { GoalsOverview } from '@/components/dashboard/goals-overview';
import { BudgetSummaryChart } from '@/components/dashboard/budget-summary-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetClient } from '@/components/budget/budget-client';
import { GoalsClient } from '@/components/goals/goals-client';
import { InvestmentSimulation } from '@/components/invest/investment-simulation';
import { FinancialLessons } from '@/components/learn/financial-lessons';
import { ExpertQA } from '@/components/qa/expert-qa';
import { NAV_LINKS } from '@/lib/constants';

export default function DashboardPage() {
  const quickLinkImage = PlaceHolderImages.find(img => img.id === 'quick-link');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            {NAV_LINKS.map((link) => (
                <TabsTrigger key={link.href} value={link.href.replace('/', '') || 'dashboard'}>
                    {link.label}
                </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <div className="flex flex-1 flex-col gap-4 md:gap-8">
                <DashboardClient />
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
            </div>
          </TabsContent>
          <TabsContent value="budget"><BudgetClient /></TabsContent>
          <TabsContent value="goals"><GoalsClient /></TabsContent>
          <TabsContent value="invest"><InvestmentSimulation /></TabsContent>
          <TabsContent value="learn"><FinancialLessons /></TabsContent>
          <TabsContent value="qa"><ExpertQA /></TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
