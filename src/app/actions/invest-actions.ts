'use server';
import {
  simulateInvestmentScenarios,
  type SimulateInvestmentScenariosInput,
  type SimulateInvestmentScenariosOutput,
} from '@/ai/flows/simulate-investment-scenarios';

export async function simulateInvestmentScenariosAction(
  input: SimulateInvestmentScenariosInput
): Promise<SimulateInvestmentScenariosOutput> {
  return await simulateInvestmentScenarios(input);
}
