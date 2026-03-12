'use server';
/**
 * @fileOverview An AI flow to generate a Profit & Loss (P&L) statement from a list of business transactions.
 *
 * - generatePLReport - A function that handles generating the P&L report.
 * - GeneratePLReportInput - The input type for the generatePLReport function.
 * - PLReport - The return type for the generatePLReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { BusinessTransaction } from '@/lib/types';

// We use z.any() for the input schema to keep it simple,
// but use the actual type in the function signature for type safety.
const GeneratePLReportInputSchema = z.object({
  transactions: z
    .any()
    .describe(
      'An array of business transaction objects, including date, description, amount, type (revenue/expense), and category.'
    ),
});
export type GeneratePLReportInput = {
    transactions: BusinessTransaction[];
};

const PLReportSchema = z.object({
    title: z.string().describe("The title of the report, e.g., 'Profit & Loss Statement'."),
    period: z.string().describe("The date range covered by the report, e.g., 'January 1, 2024 - March 31, 2024'."),
    totalRevenue: z.number().describe("The sum of all 'revenue' transactions."),
    totalExpenses: z.number().describe("The sum of all 'expense' transactions."),
    netProfit: z.number().describe("The calculated net profit (totalRevenue - totalExpenses)."),
});
export type PLReport = z.infer<typeof PLReportSchema>;

export async function generatePLReport(
  input: GeneratePLReportInput
): Promise<PLReport> {
  return generatePLReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePLReportPrompt',
  input: { schema: z.object({ transactionsJson: z.string() }) },
  output: { schema: PLReportSchema },
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
  prompt: `You are an expert AI accountant. Your task is to generate a simple Profit & Loss (P&L) statement from the provided list of business transactions.

Analyze the following JSON array of transactions:
{{{transactionsJson}}}

Based on the transactions, perform the following calculations:
1.  Determine the start and end date from the transactions to define the reporting period.
2.  Calculate Total Revenue by summing the 'amount' of all transactions where 'type' is 'revenue'.
3.  Calculate Total Expenses by summing the 'amount' of all transactions where 'type' is 'expense'.
4.  Calculate Net Profit by subtracting Total Expenses from Total Revenue.

Return the result in the specified JSON format.
`,
});

const generatePLReportFlow = ai.defineFlow(
  {
    name: 'generatePLReportFlow',
    inputSchema: GeneratePLReportInputSchema,
    outputSchema: PLReportSchema,
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
