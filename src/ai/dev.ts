import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@/ai/genkit';

// This function will only be called when running the genkit server.
// The Next.js build process will not execute this.
export async function init() {
  if (process.env.GENKIT_ENV !== 'dev') {
    return;
  }
  
  genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
  });

  await import('@/ai/flows/generate-financial-lessons.ts');
  await import('@/ai/flows/simulate-investment-scenarios.ts');
  await import('@/ai/flows/answer-finance-questions.ts');
  await import('@/ai/flows/generate-financial-goals.ts');
  await import('@/ai/flows/generate-financial-insights.ts');
  await import('@/ai/flows/generate-quiz.ts');
  await import('@/ai/flows/parse-receipt.ts');
  await import('@/ai/flows/text-to-speech.ts');
  await import('@/ai/flows/stripe-checkout.ts');
  await import('@/ai/flows/generate-pl-report.ts');
  await import('@/ai/flows/suggest-tax-deduction.ts');
  await import('@/ai/flows/analyze-pl-report.ts');
}

init();
