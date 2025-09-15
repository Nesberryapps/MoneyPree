'use server';

/**
 * @fileOverview Analyzes a user's financial transactions to provide personalized insights, suggestions, and a monthly challenge.
 *
 * - generateFinancialInsights - A function that generates financial insights.
 * - GenerateFinancialInsightsInput - The input type for the generateFinancialInsights function.
 * - FinancialInsight - The output type for the generateFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
    suggestions: z.array(z.string()).describe("A list of 2-3 actionable, personalized suggestions for improving financial health."),
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
  prompt: `You are a friendly and insightful AI financial analyst. Your goal is to help users understand their finances better by analyzing their transaction history. The user will provide a list of their recent transactions.

Analyze the following transactions:
{{{transactionsJson}}}

Based on your analysis, provide the following in a friendly, encouraging, and easy-to-understand tone:

1.  **Spending Analysis:** A brief, high-level analysis of the user's spending and income habits. Mention the ratio of income to expenses and the top spending categories.
2.  **Surprising Insight:** Identify one single, non-obvious, and genuinely surprising insight from their spending patterns. This should be something they might not have noticed themselves. For example, maybe they spend more on coffee on Mondays, or their transportation costs spike on weekends.
3.  **Actionable Suggestions:** Provide a list of 2-3 concrete, personalized, and actionable suggestions for how they could optimize their spending or increase their savings.
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
    // Convert transactions to a simpler format for the prompt if needed, or just stringify
    const transactionsForPrompt = input.transactions.map(t => ({
        ...t,
        date: t.date.toISOString().split('T')[0] // Format date for better readability in the prompt
    }));

    const { output } = await prompt({
        transactionsJson: JSON.stringify(transactionsForPrompt)
    });
    return output!;
  }
);
