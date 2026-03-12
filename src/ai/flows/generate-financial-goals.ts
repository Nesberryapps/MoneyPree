'use server';
/**
 * @fileOverview Generates a list of specific and measurable financial goals based on a user-provided prompt.
 *
 * - generateFinancialGoals - A function that generates financial goals based on a prompt.
 * - GenerateFinancialGoalsInput - The input type for the generateFinancialGoals function.
 * - GenerateFinancialGoalsOutput - The return type for the generateFinancialGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateFinancialGoalsInputSchema = z.object({
  prompt: z
    .string()
    .describe('A description of the desired financial goals.'),
});
export type GenerateFinancialGoalsInput = z.infer<typeof GenerateFinancialGoalsInputSchema>;

const GenerateFinancialGoalsOutputSchema = z.object({
  goals: z
    .array(z.string())
    .describe('A list of specific and measurable financial goals.'),
});
export type GenerateFinancialGoalsOutput = z.infer<typeof GenerateFinancialGoalsOutputSchema>;

export async function generateFinancialGoals(
  input: GenerateFinancialGoalsInput
): Promise<GenerateFinancialGoalsOutput> {
  return generateFinancialGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialGoalsPrompt',
  input: {schema: GenerateFinancialGoalsInputSchema},
  output: {schema: GenerateFinancialGoalsOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are a financial advisor who is excellent at creating specific and measurable goals based on a user's desired outcomes.  The user will provide a description of their financial aspirations, and you will return a list of goals that will help them achieve their dreams.

User Description: {{{prompt}}}

Goals:`,
});

const generateFinancialGoalsFlow = ai.defineFlow(
  {
    name: 'generateFinancialGoalsFlow',
    inputSchema: GenerateFinancialGoalsInputSchema,
    outputSchema: GenerateFinancialGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
