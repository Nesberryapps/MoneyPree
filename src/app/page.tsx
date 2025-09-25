
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinwiseCompassIcon } from '@/components/icons';
import { AuthProvider } from '@/components/auth/auth-provider';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function LandingPage() {
  const router = useRouter();
  const auth = useAuth();

  const handleGuestSignIn = async () => {
    try {
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in as guest', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FinwiseCompassIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Finwise Compass</span>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Sign In
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center text-center space-y-8">
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

       <footer className="w-full py-8">
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
