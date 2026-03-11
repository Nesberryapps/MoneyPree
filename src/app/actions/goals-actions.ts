'use server';
import {
  generateFinancialGoals,
  type GenerateFinancialGoalsInput,
  type GenerateFinancialGoalsOutput,
} from '@/ai/flows/generate-financial-goals';

export async function generateFinancialGoalsAction(
  input: GenerateFinancialGoalsInput
): Promise<GenerateFinancialGoalsOutput> {
  return await generateFinancialGoals(input);
}
