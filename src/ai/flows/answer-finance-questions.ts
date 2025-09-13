'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions about personal finance.
 *
 * The flow takes a question as input and returns an AI-generated response with relevant investment, accounting, and tax considerations and advice.
 *
 * @exports {
 *   answerFinanceQuestion,
 *   AnswerFinanceQuestionInput,
 *   AnswerFinanceQuestionOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFinanceQuestionInputSchema = z.object({
  question: z.string().describe('The user question about personal finance.'),
});

export type AnswerFinanceQuestionInput = z.infer<
  typeof AnswerFinanceQuestionInputSchema
>;

const AnswerFinanceQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});

export type AnswerFinanceQuestionOutput = z.infer<
  typeof AnswerFinanceQuestionOutputSchema
>;

export async function answerFinanceQuestion(
  input: AnswerFinanceQuestionInput
): Promise<AnswerFinanceQuestionOutput> {
  return answerFinanceQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFinanceQuestionPrompt',
  input: {schema: AnswerFinanceQuestionInputSchema},
  output: {schema: AnswerFinanceQuestionOutputSchema},
  prompt: `You are a personal finance expert. Please answer the following question, providing relevant investment, accounting, and tax considerations and advice.\n\nQuestion: {{{question}}}`,
});

const answerFinanceQuestionFlow = ai.defineFlow(
  {
    name: 'answerFinanceQuestionFlow',
    inputSchema: AnswerFinanceQuestionInputSchema,
    outputSchema: AnswerFinanceQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
