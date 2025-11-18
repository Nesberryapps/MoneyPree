
'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { Header } from '@/components/layout/header';
import Loading from '@/components/layout/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export default function BlogIndexPage() {
    const firestore = useFirestore();
    const postsQuery = query(collection(firestore, 'blogPosts'), orderBy('publishedAt', 'desc'));
    const { data: posts, isLoading } = useCollection<BlogPost>(postsQuery);

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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                             <Card key={i} className="flex flex-col animate-pulse">
                                <div className="bg-muted h-56 w-full"></div>
                                <CardHeader>
                                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-1/4 bg-muted rounded mt-2"></div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                     <div className="h-4 w-full bg-muted rounded"></div>
                                     <div className="h-4 w-5/6 bg-muted rounded mt-2"></div>
                                </CardContent>
                                <CardFooter>
                                    <div className="h-10 w-28 bg-muted rounded"></div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
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
                )}
            </main>
        </div>
    );
}
