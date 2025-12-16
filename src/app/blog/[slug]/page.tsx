'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Header } from '@/components/layout/header';
import Loading from '@/components/layout/loading';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ALL_POSTS } from '@/lib/blog-content';


// A simple Markdown renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    // This is a very basic renderer. For a real app, a library like 'react-markdown' would be better.
    const sections = content.split('\n\n');

    return (
        <div className="prose dark:prose-invert max-w-none space-y-6">
            {sections.map((section, index) => {
                if (section.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-semibold">{section.replace('### ', '')}</h3>;
                }
                if (section.startsWith('## ')) {
                    return <h2 key={index} className="text-3xl font-bold border-b pb-2">{section.replace('## ', '')}</h2>;
                }
                if (section.startsWith('# ')) {
                    return <h1 key={index} className="text-4xl font-extrabold tracking-tight">{section.replace('# ', '')}</h1>;
                }
                 if (section.startsWith('* ')) {
                    const items = section.split('\n* ').map(item => item.replace('* ', ''));
                    return (
                        <ul key={index} className="list-disc list-inside space-y-2">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    );
                }
                // Handle paragraphs with escaped newlines from AI
                const paragraphs = section.split(/\\n/g).map((p, i) => <p key={i}>{p}</p>);
                return <div key={index}>{paragraphs}</div>;
            })}
        </div>
    );
};


export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
    
    useEffect(() => {
        if (slug) {
            const foundPost = ALL_POSTS.find(p => p.slug === slug);
            setPost(foundPost || null);
        }
    }, [slug]);

    if (post === undefined) {
        return <Loading />;
    }

    if (!post) {
        return (
            <>
                <Header />
                <main className="container mx-auto max-w-4xl py-12 px-4 text-center">
                    <h1 className="text-4xl font-bold">Post Not Found</h1>
                    <p className="mt-4 text-muted-foreground">The blog post you're looking for doesn't exist.</p>
                </main>
            </>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto max-w-4xl py-12 px-4">
                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
                        <p className="text-muted-foreground">Published on {formatDate(post.publishedAt)}</p>
                    </header>

                    <Card className="overflow-hidden mb-8">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </Card>

                    <MarkdownRenderer content={post.content} />

                </article>
            </main>
        </div>
    );
}
