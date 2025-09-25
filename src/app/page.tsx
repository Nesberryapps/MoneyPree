
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinwiseCompassIcon } from '@/components/icons';
import { AuthProvider } from '@/components/auth/auth-provider';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  const handleGuestSignIn = async () => {
    if (!auth) return;
    try {
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in as guest', error);
    }
  };

  if (isUserLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FinwiseCompassIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Finwise Compass</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center text-center space-y-8 p-4">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Your Personal AI Financial Guide
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Navigate your finances with confidence. Finwise Compass uses AI to provide personalized insights, help you set goals, and teach you about investing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <AuthProvider />
          <Button variant="secondary" onClick={handleGuestSignIn}>
            Continue as Guest
          </Button>
        </div>
      </main>

       <footer className="w-full py-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get deep analysis of your spending and discover surprising trends to improve your financial health.</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Goal Setting & Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Let our AI help you define and track achievable financial goals, from saving for a vacation to planning for retirement.</p>
            </CardContent>
          </Card>
           <Card className="bg-card">
            <CardHeader>
              <CardTitle>Learn About Investing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Simulate investment scenarios and learn about different asset classes with our interactive tools.</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">© {new Date().getFullYear()} Finwise Compass. All rights reserved.</p>
      </footer>
    </div>
  );
}
