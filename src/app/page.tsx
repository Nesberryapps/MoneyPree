
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoneyWizeIcon } from '@/components/icons';
import { AuthProvider } from '@/components/auth/auth-provider';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';
import { LayoutDashboard, ScanLine, Target, BookOpen, LineChart, Lightbulb, Bot } from 'lucide-react';
import Link from 'next/link';

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
      <header className="w-full p-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <MoneyWizeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyWize</span>
        </Link>
        <div className="flex items-center gap-2">
            <AuthProvider />
            <Button variant="secondary" onClick={handleGuestSignIn}>
                Guest
            </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-6 p-4 py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            The Smartest Way to Manage Your Money
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            MoneyWize is your AI-powered financial partner. From budgeting and goals to investing and learning, we provide the tools you need to achieve financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AuthProvider />
            <Button variant="secondary" size="lg" onClick={handleGuestSignIn}>
              Try It as a Guest
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-3 mb-12">
                    <p className="text-primary font-semibold">FEATURES</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Everything You Need, Nothing You Don't</h2>
                    <p className="max-w-2xl mx-auto text-muted-foreground">
                        Our AI-driven features are designed to be powerful, intuitive, and personalized to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <ScanLine className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>AI Budgeting & Receipt Scan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Track expenses effortlessly. Scan receipts with your camera and let our AI categorize and record transactions for you.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Intelligent Goal Setting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Describe your financial dreams, and our AI will generate specific, measurable goals to help you get there faster.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-full">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Personalized Learning</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Receive custom-tailored financial lessons based on your knowledge and interests, complete with quizzes to test your skills.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-full">
                                <LineChart className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Investment Simulation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Explore different investment strategies. Our AI analyzes your portfolio and goals to suggest diversification and assess risk.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <div className="p-3 bg-primary/10 rounded-full">
                                <Lightbulb className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Expert Q&A</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Have a question about taxes, stocks, or anything in between? Get instant, detailed answers from our AI financial expert.</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Voice-Enabled Interaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Interact with the app using your voice. Dictate questions, fill out forms, and have results read back to you for a hands-free experience.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>

       <footer className="w-full py-8 px-4">
        <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MoneyWize. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

    