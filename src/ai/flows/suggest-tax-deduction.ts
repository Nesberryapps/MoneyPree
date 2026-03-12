'use server';
/**
 * @fileOverview An AI flow to suggest if a business expense is tax-deductible.
 *
 * - suggestTaxDeduction - A function that analyzes an expense and suggests its tax-deductibility.
 * - SuggestTaxDeductionInput - The input type for the function.
 * - SuggestTaxDeductionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestTaxDeductionInputSchema = z.object({
  description: z.string().describe('The description of the business expense.'),
  category: z.string().describe('The category of the business expense.'),
});
export type SuggestTaxDeductionInput = z.infer<
  typeof SuggestTaxDeductionInputSchema
>;

const SuggestTaxDeductionOutputSchema = z.object({
  isDeductible: z
    .boolean()
    .describe(
      'Whether the expense is likely a legitimate tax-deductible business expense.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation for the suggestion. For example, "Software subscriptions for business use are typically deductible."'
    ),
});
export type SuggestTaxDeductionOutput = z.infer<
  typeof SuggestTaxDeductionOutputSchema
>;

export async function suggestTaxDeduction(
  input: SuggestTaxDeductionInput
): Promise<SuggestTaxDeductionOutput> {
  return suggestTaxDeductionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaxDeductionPrompt',
  input: { schema: SuggestTaxDeductionInputSchema },
  output: { schema: SuggestTaxDeductionOutputSchema },
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
  prompt: `You are an AI tax assistant for small businesses in the United States. Based on the expense description and category, determine if it is a common and legitimate tax-deductible business expense under IRS rules.

The expense must be both "ordinary" (common and accepted in the trade or business) and "necessary" (helpful and appropriate for the trade or business).

Do not suggest deductions for personal, living, or family expenses unless they have a clear business purpose (e.g., a home office).

Expense Description: {{{description}}}
Expense Category: {{{category}}}

Analyze the expense and provide your suggestion and a brief, one-sentence reasoning. If it's not deductible, explain why not.`,
});

const suggestTaxDeductionFlow = ai.defineFlow(
  {
    name: 'suggestTaxDeductionFlow',
    inputSchema: SuggestTaxDeductionInputSchema,
    outputSchema: SuggestTaxDeductionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
