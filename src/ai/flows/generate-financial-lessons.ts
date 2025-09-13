'use server';

/**
 * @fileOverview A flow for generating personalized financial lessons based on the user's current financial knowledge.
 *
 * - generateFinancialLessons - A function that generates personalized financial lessons.
 * - GenerateFinancialLessonsInput - The input type for the generateFinancialLessons function.
 * - GenerateFinancialLessonsOutput - The return type for the generateFinancialLessons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialLessonsInputSchema = z.object({
  currentFinancialKnowledge: z
    .string()
    .describe(
      'The user’s current financial knowledge and experience.  Include specific details such as familiarity with investing, budgeting, saving, debt management, and any previous financial education or experience.'
    ),
  preferredLearningStyle: z
    .string()
    .optional()
    .describe(
      'The user’s preferred learning style (e.g., visual, auditory, kinesthetic, or a combination).'
    ),
  specificTopicsOfInterest: z
    .string()
    .optional()
    .describe(
      'Specific financial topics the user is interested in learning about (e.g., retirement planning, stock market investing, real estate, etc.).'
    ),
  timeCommitmentPerWeek: z
    .string()
    .optional()
    .describe(
      'The amount of time per week the user is willing to dedicate to learning about personal finance.'
    ),
});
export type GenerateFinancialLessonsInput = z.infer<
  typeof GenerateFinancialLessonsInputSchema
>;

const GenerateFinancialLessonsOutputSchema = z.object({
  lessonTitle: z.string().describe('The title of the financial lesson.'),
  lessonContent: z.string().describe('The content of the financial lesson.'),
  lessonType: z
    .string()
    .optional()
    .describe(
      'The type of the lesson, such as text, video, interactive exercise, etc.'
    ),
  estimatedCompletionTime: z
    .string()
    .optional()
    .describe('The estimated time to complete the lesson.'),
});
export type GenerateFinancialLessonsOutput = z.infer<
  typeof GenerateFinancialLessonsOutputSchema
>;

export async function generateFinancialLessons(
  input: GenerateFinancialLessonsInput
): Promise<GenerateFinancialLessonsOutput> {
  return generateFinancialLessonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialLessonsPrompt',
  input: {schema: GenerateFinancialLessonsInputSchema},
  output: {schema: GenerateFinancialLessonsOutputSchema},
  prompt: `You are an AI-powered financial literacy tutor. Based on the user's current financial knowledge, create a personalized financial lesson.

Current Financial Knowledge: {{{currentFinancialKnowledge}}}
Preferred Learning Style: {{{preferredLearningStyle}}}
Specific Topics of Interest: {{{specificTopicsOfInterest}}}
Time Commitment Per Week: {{{timeCommitmentPerWeek}}}

Create a financial lesson that is tailored to the user's needs and preferences. Make sure each lesson should be interactive and engaging.
Output the lesson in a suitable format for learning, explaining the lesson title, the lesson content, the type of lesson, and the estimated completion time. 
`,
});

const generateFinancialLessonsFlow = ai.defineFlow(
  {
    name: 'generateFinancialLessonsFlow',
    inputSchema: GenerateFinancialLessonsInputSchema,
    outputSchema: GenerateFinancialLessonsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
