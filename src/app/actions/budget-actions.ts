'use server';
import {
  generateFinancialInsights,
  type GenerateFinancialInsightsInput,
  type FinancialInsight,
} from '@/ai/flows/generate-financial-insights';

import {
  parseReceipt,
  type ParseReceiptInput,
  type ParseReceiptOutput,
} from '@/ai/flows/parse-receipt';


export async function generateFinancialInsightsAction(
  input: GenerateFinancialInsightsInput
): Promise<FinancialInsight> {
  return await generateFinancialInsights(input);
}

export async function parseReceiptAction(
  input: ParseReceiptInput
): Promise<ParseReceiptOutput> {
    return await parseReceipt(input);
}
