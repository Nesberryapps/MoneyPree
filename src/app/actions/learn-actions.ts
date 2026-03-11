'use server';
import {
  generateFinancialLessons,
  type GenerateFinancialLessonsInput,
  type GenerateFinancialLessonsOutput,
} from '@/ai/flows/generate-financial-lessons';

import {
  generateQuiz,
  type GenerateQuizInput,
  type Quiz,
} from '@/ai/flows/generate-quiz';


export async function generateFinancialLessonsAction(
  input: GenerateFinancialLessonsInput
): Promise<GenerateFinancialLessonsOutput> {
  return await generateFinancialLessons(input);
}

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<Quiz> {
  return await generateQuiz(input);
}
