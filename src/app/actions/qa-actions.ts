'use server';
import {
  answerFinanceQuestion,
  type AnswerFinanceQuestionInput,
  type AnswerFinanceQuestionOutput,
} from '@/ai/flows/answer-finance-questions';

export async function answerFinanceQuestionAction(
  input: AnswerFinanceQuestionInput
): Promise<AnswerFinanceQuestionOutput> {
  return await answerFinanceQuestion(input);
}
