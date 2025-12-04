
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { MoneyPreeIcon } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutPage() {
    const team = [
        {
            name: 'Jane Doe',
            role: 'Founder & CEO',
            bio: 'Jane is a certified financial planner with over a decade of experience helping individuals and businesses achieve their financial goals. She founded MoneyPree with the mission to make expert financial guidance accessible to everyone.',
            imageUrl: 'https://picsum.photos/seed/jane/400/400',
            imageHint: 'female portrait'
        },
        {
            name: 'John Smith',
            role: 'Lead AI Engineer',
            bio: 'John leads the development of our powerful AI engine. With a background in machine learning and financial technology, he is passionate about using AI to solve real-world financial challenges.',
            imageUrl: 'https://picsum.photos/seed/john/400/400',
            imageHint: 'male portrait'
        }
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

                {/* Team Section */}
                <section className="py-20 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center space-y-3 mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold">Meet the Team</h2>
                            <p className="max-w-2xl mx-auto text-muted-foreground">
                                We are a passionate team of financial experts and technologists dedicated to your success.
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                            {team.map((member) => (
                                <div key={member.name} className="flex flex-col items-center text-center">
                                    <Avatar className="w-32 h-32 mb-4">
                                        <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint={member.imageHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary font-semibold">{member.role}</p>
                                    <p className="mt-2 text-muted-foreground">{member.bio}</p>
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
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                            About Us
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
