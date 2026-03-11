'use server';
import {
  generatePLReport,
  type GeneratePLReportInput,
  type PLReport,
} from '@/ai/flows/generate-pl-report';

import {
  suggestTaxDeduction,
  type SuggestTaxDeductionInput,
  type SuggestTaxDeductionOutput,
} from '@/ai/flows/suggest-tax-deduction';

import {
  analyzePLReport,
  type AnalyzePLReportInput,
  type PLReportAnalysis,
} from '@/ai/flows/analyze-pl-report';

import {
    parseReceipt,
    type ParseReceiptInput,
    type ParseReceiptOutput,
} from '@/ai/flows/parse-receipt';

export async function generatePLReportAction(
  input: GeneratePLReportInput
): Promise<PLReport> {
  return await generatePLReport(input);
}

export async function suggestTaxDeductionAction(
  input: SuggestTaxDeductionInput
): Promise<SuggestTaxDeductionOutput> {
    return await suggestTaxDeduction(input);
}

export async function analyzePLReportAction(
  input: AnalyzePLReportInput
): Promise<PLReportAnalysis> {
    return await analyzePLReport(input);
}

export async function parseBusinessReceiptAction(
  input: ParseReceiptInput
): Promise<ParseReceiptOutput> {
    return await parseReceipt(input);
}
