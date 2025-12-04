
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MoneyPreeIcon } from '@/components/icons';
import { ScanLine, Briefcase, FileText, Target, LineChart, BookOpen } from 'lucide-react';

export default function AboutPage() {
    const features = [
        {
            icon: ScanLine,
            title: 'Automated Budgeting',
            description: 'Effortlessly track your personal finances. Our AI can categorize transactions, and Pro users can scan receipts to automate expense entry, providing a crystal-clear overview of spending.',
        },
        {
            icon: Briefcase,
            title: 'Small Business Management',
            description: 'A dedicated dashboard for entrepreneurs. Manage revenue, track expenses, get AI-powered tax deduction suggestions, and generate Profit & Loss statements instantly.',
        },
        {
            icon: FileText,
            title: 'AI-Powered Analysis',
            description: 'Go beyond the numbers. Our AI acts as your virtual CFO, analyzing your P&L report to provide actionable insights, identify key trends, and alert you to potential risks.',
        },
        {
            icon: Target,
            title: 'Intelligent Goal Setting',
            description: 'Describe your financial dreams, and our AI will help you craft specific, measurable goals to make your ambitions achievable, from saving for a house to planning for retirement.',
        },
        {
            icon: LineChart,
            title: 'Investment Simulation',
            description: 'Explore various investment strategies without the risk. Our simulator analyzes your portfolio and goals to suggest diversification, assess risk, and project potential returns.',
        },
        {
            icon: BookOpen,
            title: 'Personalized Financial Learning',
            description: 'Grow your financial knowledge with lessons and quizzes tailored to you. Whether you\'re a novice or an expert, our platform helps you learn at your own pace.',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="w-full p-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <Link href="/" className="flex items-center gap-2">
                <MoneyPreeIcon className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold">MoneyPree</span>
                </Link>
                <div className="flex gap-4">
                    <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Pricing
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Blog
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 text-center bg-muted/20">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Our Mission</h1>
                        <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
                            To empower individuals and small businesses with intelligent, accessible, and personalized financial tools, turning complex financial data into clear, actionable insights for a brighter financial future.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center space-y-3 mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold">What is MoneyPree?</h2>
                            <p className="max-w-3xl mx-auto text-muted-foreground">
                                MoneyPree is an all-in-one financial co-pilot, designed to simplify both personal and business finance through the power of artificial intelligence. We believe that financial clarity and confidence should be accessible to everyone.
                            </p>
                        </div>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <Card key={feature.title} className="text-center">
                                    <CardHeader>
                                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="pt-2">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-8 px-4 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MoneyPree. All rights reserved.</p>
                     <div className="flex gap-4">
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                            Contact
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
