
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { blogPosts } from '@/lib/blog-posts';
import { formatDate } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoneyPreeIcon } from '@/components/icons';
import { Footer } from '@/components/layout/footer';

export default function BlogPage() {
  const getImageForPost = (postId: string) => {
    return PlaceHolderImages.find(img => img.id === postId) || PlaceHolderImages.find(img => img.id === 'landing-hero');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="w-full p-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <Link href="/" className="flex items-center gap-2">
          <MoneyPreeIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">MoneyPree</span>
          </Link>
          <div className="flex gap-4">
          </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-24 text-center bg-muted/20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">The MoneyPree Blog</h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
              Bite-sized financial wisdom to help you grow your wealth and confidence.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => {
                const image = getImageForPost(post.image);
                return (
                  <Card key={post.id} className="flex flex-col">
                    {image && (
                       <Image
                        src={image.imageUrl}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="rounded-t-lg object-cover w-full h-48"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>{formatDate(post.publishedDate)}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground">{post.summary}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
