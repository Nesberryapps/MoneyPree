
'use client';

import { useState } from 'react';
import { createCheckoutSession } from '@/ai/flows/stripe-checkout';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function PricingPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to subscribe.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
      if (!priceId) {
        throw new Error('Stripe Price ID is not configured.');
      }

      // 1. Create the checkout session and get the URL
      const { url } = await createCheckoutSession({
        priceId,
        userId: user.uid,
        userEmail: user.email || undefined, // Pass user's email
      });

      if (!url) {
        throw new Error("Could not retrieve Stripe checkout URL.");
      }
      
      // 2. Open the URL in a new tab
      window.open(url, '_blank');
      
      toast({
        title: 'Redirecting to Checkout',
        description: 'Your Stripe checkout page has been opened in a new tab.',
      });


    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to start the subscription process. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const proFeatures = [
    'Full Business Dashboard',
    'AI-Powered P&L Generation & Analysis',
    'AI Tax Deduction Suggestions',
    'AI-Powered Goal Generation',
    'AI Receipt Scanning',
    'Comprehensive Investment Scenarios',
    'Personalized Financial Lessons & Quizzes',
    'Unlimited AI Expert Q&A',
    'Voice-Enabled Interaction',
  ];

  const freeFeatures = [
      'Manual Transaction Entry',
      'Basic Budget Creation',
      'Manual Goal Tracking',
      'Limited AI interactions'
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Choose Your Plan
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            Get started for free or unlock powerful AI features with MoneyPree Pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Free Tier Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>
                For getting started with the basics of budgeting.
              </CardDescription>
              <div className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {freeFeatures.map(feature => (
                     <div key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Tier Card */}
          <Card className="flex flex-col border-primary shadow-lg">
             <CardHeader>
              <CardTitle className="text-2xl">MoneyPree Pro</CardTitle>
              <CardDescription>
                For comprehensive, AI-powered financial management for you and your business.
              </CardDescription>
              <div className="text-4xl font-bold pt-4">$7 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                 {proFeatures.map(feature => (
                     <div key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscribe} className="w-full" disabled={isLoading || !user}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {user ? 'Upgrade to Pro' : 'Sign in to Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
