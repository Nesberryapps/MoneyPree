'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { ALL_POSTS } from '@/lib/blog-content';

export default function BlogIndexPage() {
    const posts = ALL_POSTS.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto py-12 px-4">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight">The MoneyPree Blog</h1>
                    <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
                        Your source for financial insights, tips, and strategies for success.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <Card key={post.id} className="flex flex-col overflow-hidden">
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-56 object-cover"
                                    />
                                </Link>
                                <CardHeader>
                                    <CardTitle className="leading-tight">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </CardTitle>
                                    <CardDescription>{formatDate(post.publishedAt)}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="secondary">
                                        <Link href={`/blog/${post.slug}`}>Read More</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-muted-foreground">
                            No blog posts have been published yet.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
