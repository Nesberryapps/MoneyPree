
'use server';

/**
 * @fileOverview An AI flow to parse transaction details from a receipt image.
 *
 * - parseReceipt - A function that handles parsing a receipt image.
 * - ParseReceiptInput - The input type for the parseReceipt function.
 * - ParseReceiptOutput - The return type for the parseReceipt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { BUDGET_CATEGORIES, EXPENSE_CATEGORIES as BUSINESS_EXPENSE_CATEGORIES } from '@/lib/constants';

const ParseReceiptInputSchema = z.object({
  receiptImage: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  isBusiness: z.boolean().optional().describe("Whether the receipt is for a business expense."),
});
export type ParseReceiptInput = z.infer<typeof ParseReceiptInputSchema>;

const personalExpenseCategories = BUDGET_CATEGORIES.expense.map(c => c.value);
const allCategories = [...new Set([...personalExpenseCategories, ...BUSINESS_EXPENSE_CATEGORIES])];


const ParseReceiptOutputSchema = z.object({
  description: z.string().optional().describe('The name of the vendor or a brief description of the purchase.'),
  amount: z.number().optional().describe('The total amount of the transaction.'),
  date: z.string().optional().describe('The date of the transaction in YYYY-MM-DD format.'),
  category: z.enum(allCategories as [string, ...string[]]).optional().describe('The suggested budget category for the expense.'),
});
export type ParseReceiptOutput = z.infer<typeof ParseReceiptOutputSchema>;

export async function parseReceipt(input: ParseReceiptInput): Promise<ParseReceiptOutput> {
  return parseReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseReceiptPrompt',
  input: { schema: z.object({
    receiptImage: ParseReceiptInputSchema.shape.receiptImage,
    categoryList: z.string(),
  }) },
  output: { schema: ParseReceiptOutputSchema },
  prompt: `You are an expert receipt-scanning AI. Analyze the provided receipt image and extract the following information:
1.  **description**: The name of the merchant/vendor.
2.  **amount**: The final total amount of the transaction.
3.  **date**: The date of the transaction. Please format it as YYYY-MM-DD.
4.  **category**: Based on the vendor name and items, suggest the most appropriate expense category from the following list: {{{categoryList}}}.

If any piece of information is unclear or not present, leave it out.

Receipt Image: {{media url=receiptImage}}`,
});

const parseReceiptFlow = ai.defineFlow(
  {
    name: 'parseReceiptFlow',
    inputSchema: ParseReceiptInputSchema,
    outputSchema: ParseReceiptOutputSchema,
  },
  async (input) => {
    const categoryList = input.isBusiness ? BUSINESS_EXPENSE_CATEGORIES.join(', ') : personalExpenseCategories.join(', ');

    const { output } = await prompt({ 
        receiptImage: input.receiptImage,
        categoryList: categoryList,
    });
    return output!;
  }
);
