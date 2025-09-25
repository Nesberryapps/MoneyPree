'use server';

/**
 * @fileOverview A flow for generating a multiple-choice quiz based on lesson content.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - Quiz - The output type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  lessonContent: z.string().describe('The content of the financial lesson to create a quiz from.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The text of the quiz question."),
    choices: z.array(z.string()).describe("An array of 4 possible answers for the question."),
    correctAnswer: z.string().describe("The correct answer from the choices."),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const QuizSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('A list of 3-5 quiz questions.'),
});
export type Quiz = z.infer<typeof QuizSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<Quiz> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: QuizSchema },
  prompt: `You are an expert curriculum developer. Your task is to create a multiple-choice quiz based on the provided financial lesson content. The quiz should test the user's comprehension of the key concepts in the lesson.

Generate 3-5 questions. Each question must have 4 choices, and one of those choices must be the correct answer.

Lesson Content:
{{{lessonContent}}}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: QuizSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
