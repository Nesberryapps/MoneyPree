'use server';
/**
 * @fileOverview Analyzes a user's financial transactions to provide personalized insights, suggestions, and a monthly challenge.
 *
 * - generateFinancialInsights - A function that generates financial insights.
 * - GenerateFinancialInsightsInput - The input type for the generateFinancialInsights function.
 * - FinancialInsight - The output type for the generateFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Transaction } from '@/lib/types';

// We don't need to define the schema for Transaction again as it is complex and already defined in types.ts.
// We can use z.any() and trust the input from the client component.
const GenerateFinancialInsightsInputSchema = z.object({
  transactions: z
    .any()
    .describe(
      'An array of transaction objects, including date, description, amount, type (income/expense), and category.'
    ),
});
export type GenerateFinancialInsightsInput = {
    transactions: Transaction[];
};


const FinancialInsightSchema = z.object({
    spendingAnalysis: z.string().describe("A brief, high-level analysis of the user's spending and income habits based on the transactions."),
    surprisingInsight: z.string().describe("One unique, non-obvious, and surprising insight discovered from the user's spending patterns."),
    suggestions: z.array(z.string()).describe("A list of 2-3 actionable, personalized smart nudges or suggestions for improving financial health. These should be specific and data-driven."),
    monthlyChallenge: z.string().describe("A specific, achievable financial challenge for the user to try over the next month."),
});
export type FinancialInsight = z.infer<typeof FinancialInsightSchema>;

export async function generateFinancialInsights(
  input: GenerateFinancialInsightsInput
): Promise<FinancialInsight> {
  return generateFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: { schema: z.object({ transactionsJson: z.string() }) },
  output: { schema: FinancialInsightSchema },
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
  prompt: `You are a friendly and insightful AI financial analyst. Your goal is to help users understand their finances better by analyzing their transaction history. The user will provide a list of their recent transactions.

Analyze the following transactions:
{{{transactionsJson}}}

Based on your analysis, provide the following in a friendly, encouraging, and easy-to-understand tone:

1.  **Spending Analysis:** A brief, high-level analysis of the user's spending and income habits. Mention the ratio of income to expenses and the top spending categories.
2.  **Surprising Insight:** Identify one single, non-obvious, and genuinely surprising insight from their spending patterns. This should be something they might not have noticed themselves. For example, maybe they spend more on coffee on Mondays, or their transportation costs spike on weekends.
3.  **Smart Nudges & Suggestions:** Provide a list of 2-3 concrete, personalized, and actionable "smart nudges". These should be data-driven suggestions to optimize spending or increase savings. For example: "Based on your spending patterns, you could redirect $50/month into your investment goal." or "You’re $150 away from your monthly budget goal—try a 3-day no-spend challenge!"
4.  **Monthly Challenge:** Create a specific, fun, and achievable financial challenge for the user to try over the next month. For example, "Try a 'no-spend weekend' this month" or "Reduce your 'food' spending by 10% next month."
`,
});

const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: FinancialInsightSchema,
  },
  async (input) => {
    // Safely process transactions and filter out any with invalid dates
    const transactionsForPrompt = input.transactions
      .map(t => {
        const rawDate = t.date as any;
        let transactionDate: Date;

        if (rawDate instanceof Date) {
          transactionDate = rawDate;
        } else {
          transactionDate = new Date(rawDate);
        }

        if (isNaN(transactionDate.getTime())) {
          return null; // Mark for removal
        }

        return {
            ...t,
            date: transactionDate.toISOString().split('T')[0]
        };
      })
      .filter(t => t !== null);

    const { output } = await prompt({
        transactionsJson: JSON.stringify(transactionsForPrompt)
    });
    return output!;
  }
);
