// This is a server-side file.
'use server';

/**
 * @fileOverview Simulates investment scenarios and suggests portfolio diversification.
 *
 * - simulateInvestmentScenarios - A function that takes investment holdings and goals to suggest diversification options.
 * - SimulateInvestmentScenariosInput - The input type for the simulateInvestmentScenarios function.
 * - SimulateInvestmentScenariosOutput - The return type for the simulateInvestmentScenarios function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateInvestmentScenariosInputSchema = z.object({
  currentHoldings: z
    .string()
    .describe('A list of current investment holdings, including asset name and quantity.'),
  investmentGoals: z
    .string()
    .describe('The investment goals, timeline, and risk tolerance of the user.'),
  marketData: z
    .string()
    .optional()
    .describe(
      'Optional current market data for various assets. If not provided, the AI will use general knowledge.'
    ),
});
export type SimulateInvestmentScenariosInput = z.infer<
  typeof SimulateInvestmentScenariosInputSchema
>;

const SimulateInvestmentScenariosOutputSchema = z.object({
  suggestedDiversification: z
    .string()
    .describe(
      'Suggestions for portfolio diversification, including specific assets and allocation percentages.'
    ),
  riskAssessment: z
    .string()
    .describe('An assessment of the risk associated with the current and suggested portfolios.'),
  potentialReturns: z
    .string()
    .describe('Estimated potential returns for the suggested portfolio diversification.'),
  disclaimer: z.string().optional().describe(
    'A disclaimer stating that the results are not financial advice and are for educational purposes only.'
  ),
});
export type SimulateInvestmentScenariosOutput = z.infer<
  typeof SimulateInvestmentScenariosOutputSchema
>;

export async function simulateInvestmentScenarios(
  input: SimulateInvestmentScenariosInput
): Promise<SimulateInvestmentScenariosOutput> {
  return simulateInvestmentScenariosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateInvestmentScenariosPrompt',
  input: {schema: SimulateInvestmentScenariosInputSchema},
  output: {schema: SimulateInvestmentScenariosOutputSchema},
  prompt: `You are an AI financial advisor specializing in portfolio diversification and investment strategy.

Given the user's current investment holdings, investment goals, and optional current market data, suggest a portfolio diversification strategy.

Current Investment Holdings: {{{currentHoldings}}}
Investment Goals: {{{investmentGoals}}}
Market Data: {{{marketData}}}

Consider a wide range of asset classes, including traditional stocks, bonds, and ETFs, as well as alternative investments like real estate, starting a business, or buying a franchise, if relevant to the user's goals. Provide specific, actionable recommendations and allocation percentages where applicable.
Also include a risk assessment of the current and suggested portfolios, and estimate potential returns for the suggested diversification. Be brief and to the point.
Include the following disclaimer in your response: "The results provided are for educational purposes only and do not constitute financial advice."

Format your response as follows:

Suggested Diversification: [Diversification Strategy]
Risk Assessment: [Risk Assessment]
Potential Returns: [Estimated Returns]
Disclaimer: The results provided are for educational purposes only and do not constitute financial advice.
`,
});

const simulateInvestmentScenariosFlow = ai.defineFlow(
  {
    name: 'simulateInvestmentScenariosFlow',
    inputSchema: SimulateInvestmentScenariosInputSchema,
    outputSchema: SimulateInvestmentScenariosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
