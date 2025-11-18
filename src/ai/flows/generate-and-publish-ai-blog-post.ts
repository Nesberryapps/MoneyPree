
'use server';

/**
 * @fileOverview A flow to have an AI brainstorm, select, and write a blog post, then save it.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateBlogPost, type GenerateBlogPostOutput } from './generate-blog-post';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';


const BrainstormTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe("A list of 5 interesting and relevant financial blog post topics suitable for a general audience."),
});

const selectTopicPrompt = ai.definePrompt({
    name: 'selectTopicPrompt',
    input: { schema: z.object({ topics: z.array(z.string()) }) },
    output: { schema: z.object({ chosenTopic: z.string() }) },
    prompt: `From the following list of topics, choose the one that is most interesting and engaging for a general audience interested in personal finance.

Topics:
{{#each topics}}
- {{{this}}}
{{/each}}

Return only the chosen topic.`,
});


export async function generateAndPublishAiBlogPost(): Promise<GenerateBlogPostOutput> {
    
    // 1. Brainstorm topics
    const { output: brainstormOutput } = await ai.generate({
        prompt: `Brainstorm a list of 5 interesting and relevant financial blog post topics suitable for a general audience. The topics should be a mix of beginner-friendly guides, current financial trends, and timeless advice.`,
        output: { schema: BrainstormTopicsOutputSchema },
    });
    
    if (!brainstormOutput || brainstormOutput.topics.length === 0) {
        throw new Error('AI failed to brainstorm any topics.');
    }
    
    // 2. Select the best topic
    const { output: selectOutput } = await selectTopicPrompt({
        topics: brainstormOutput.topics,
    });
    
    if (!selectOutput?.chosenTopic) {
        throw new Error('AI failed to select a topic.');
    }
    
    const chosenTopic = selectOutput.chosenTopic;

    // 3. Generate the blog post for the chosen topic
    const postData = await generateBlogPost({ topic: chosenTopic });

    // 4. Save the blog post to Firestore
    // We need to initialize firebase here because this is a server-side flow
    const { firestore } = initializeFirebase();
    const blogPostsRef = collection(firestore, 'blogPosts');
    await addDoc(blogPostsRef, {
        ...postData,
        publishedAt: serverTimestamp(),
    });

    return postData;
}
