
'use server';

/**
 * @fileOverview An AI flow to generate a blog post on a given financial topic.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the function.
 * - GenerateBlogPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The financial topic for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The catchy title of the blog post.'),
  slug: z.string().describe('The URL-friendly slug for the blog post.'),
  summary: z.string().describe('A short, one-paragraph summary of the article.'),
  content: z.string().describe('The full content of the blog post, formatted in Markdown.'),
  imageUrl: z.string().describe('A URL for a relevant feature image.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `You are an expert financial writer for the MoneyPree blog. Your task is to write an engaging, informative, and easy-to-understand blog post on the given topic.

The article should be well-structured, with a clear introduction, body, and conclusion. Use Markdown for formatting, including headings, bold text, and lists where appropriate.

The tone should be encouraging, professional, and accessible to a general audience.

Topic: {{{topic}}}

Generate a complete blog post with the following fields:
- title: A compelling and SEO-friendly title.
- slug: A URL-friendly slug based on the title (e.g., 'how-to-start-investing').
- summary: A concise one-paragraph summary to be used for previews.
- content: The full article content in Markdown format.
- imageUrl: A relevant placeholder image URL from 'https://picsum.photos/seed/...'
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    // Ensure the image URL is a valid Picsum URL
    if (output && !output.imageUrl.startsWith('https://picsum.photos')) {
        const seed = Math.floor(Math.random() * 1000);
        output.imageUrl = `https://picsum.photos/seed/${seed}/1200/800`;
    }
    
    return output!;
  }
);
