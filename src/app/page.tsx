
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoneyPreeIcon } from '@/components/icons';
import { AuthProvider } from '@/components/auth/auth-provider';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';
import { ScanLine, Target, BookOpen, LineChart, Bot, Mic, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function LandingPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const landingHeroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const receiptScanImage = PlaceHolderImages.find(img => img.id === 'receipt-scan');
  const intelligentGoalsImage = PlaceHolderImages.find(img => img.id === 'intelligent-goals');
  const investmentSimImage = PlaceHolderImages.find(img => img.id === 'investment-simulation');
  const businessDashboardImage = PlaceHolderImages.find(img => img.id === 'business-dashboard');
  const businessAnalysisImage = PlaceHolderImages.find(img => img.id === 'business-analysis');
  const voiceInteractionImage = PlaceHolderImages.find(img => img.id === 'voice-interaction');


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

  const features = [
    {
      icon: ScanLine,
      title: 'AI Budgeting & Receipt Scan',
      description: 'Track expenses effortlessly. Scan receipts with your camera and let our AI categorize and record transactions for you, giving you a crystal-clear overview of your spending.',
      image: receiptScanImage
    },
    {
      icon: Briefcase,
      title: 'Small Business Dashboard',
      description: 'Manage your business finances with ease. Track revenue and expenses, get AI-powered tax-deduction suggestions, and generate Profit & Loss statements instantly.',
      image: businessDashboardImage
    },
    {
        icon: FileText,
        title: 'AI-Powered Business Analysis',
        description: 'Go beyond the numbers. Our AI acts as your virtual CFO, analyzing your P&L report to provide actionable insights, identify key trends, and alert you to potential risks.',
        image: businessAnalysisImage
    },
    {
      icon: Target,
      title: 'Intelligent Goal Setting',
      description: 'Describe your financial dreams, and our AI will generate specific, measurable goals to help you get there faster. From saving for a house to planning retirement, we make your ambitions achievable.',
      image: intelligentGoalsImage
    },
    {
      icon: LineChart,
      title: 'Comprehensive Investment Simulation',
      description: 'Explore different investment strategies without the risk. From stocks and bonds to real estate and starting a business, our AI analyzes your portfolio and goals to suggest diversification, assess risk, and project potential returns.',
      image: investmentSimImage
    },
    {
      icon: Mic,
      title: 'Voice-Enabled Interaction',
      description: 'Interact with the app using your voice. Dictate transactions, ask the AI expert questions, and have results read back to you for a truly hands-free financial management experience.',
      image: voiceInteractionImage
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="w-full p-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <MoneyPreeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyPree</span>
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
        <section className="relative flex flex-col items-center justify-center text-center space-y-6 p-4 py-20 md:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
                {landingHeroImage && (
                    <Image
                        src={landingHeroImage.imageUrl}
                        alt="Financial Dashboard"
                        fill
                        className="object-cover"
                        data-ai-hint={landingHeroImage.imageHint}
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                    Your Personal & Business CFO
                </h1>
                <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
                    MoneyPree is your AI-powered financial partner. From automated budgeting and goal setting to business P&L analysis and investment simulation, we provide the tools you need to achieve financial freedom.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                    <AuthProvider />
                    <Button variant="secondary" size="lg" onClick={handleGuestSignIn}>
                    Try It as a Guest
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-3 mb-16">
                    <p className="text-primary font-semibold">FEATURES</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Everything You Need, Nothing You Don't</h2>
                    <p className="max-w-2xl mx-auto text-muted-foreground">
                        Our AI-driven features are designed to be powerful, intuitive, and personalized to you.
                    </p>
                </div>

                <div className="flex flex-col gap-20">
                    {features.map((feature, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className={`md:order-${index % 2 === 0 ? '1' : '2'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                                </div>
                                <p className="text-muted-foreground text-lg">{feature.description}</p>
                            </div>
                            <div className={`md:order-${index % 2 === 0 ? '2' : '1'}`}>
                                {feature.image && (
                                     <Image
                                        src={feature.image.imageUrl}
                                        alt={feature.title}
                                        width={600}
                                        height={400}
                                        className="rounded-lg shadow-xl"
                                        data-ai-hint={feature.image.imageHint}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

       <footer className="w-full py-8 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MoneyPree. All rights reserved.</p>
            <div className="flex gap-4">
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                </Link>
            </div>
        </div>
      </footer>
    </div>
  );

    
}
