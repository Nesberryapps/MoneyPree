import { config } from 'dotenv';
config();

import '@/ai/flows/generate-financial-lessons.ts';
import '@/ai/flows/simulate-investment-scenarios.ts';
import '@/ai/flows/answer-finance-questions.ts';
import '@/ai/flows/generate-financial-goals.ts';
import '@/ai/flows/generate-financial-insights.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/parse-receipt.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/plaid-flows.ts';
import '@/ai/flows/stripe-checkout.ts';
import '@/ai/flows/generate-pl-report.ts';
import '@/ai/flows/suggest-tax-deduction.ts';
