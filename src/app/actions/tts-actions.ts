'use server';
import {
  textToSpeech,
  type TextToSpeechInput,
  type TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';

export async function textToSpeechAction(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return await textToSpeech(input);
}
