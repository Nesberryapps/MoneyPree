'use client';

import { useState } from 'react';
import {
  answerFinanceQuestion,
  type AnswerFinanceQuestionOutput,
} from '@/ai/flows/answer-finance-questions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ExpertQA() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AnswerFinanceQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quickLinkImage = PlaceHolderImages.find(img => img.id === 'quick-link');

  const handleAskQuestion = async () => {
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const result = await answerFinanceQuestion({
        question,
      });
      setAnswer(result);
    } catch (e) {
      setError('Failed to get an answer. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Ask Our AI Financial Expert</CardTitle>
          <CardDescription>
            Have a question about personal finance, investing, or taxes? Ask away!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="e.g., What are the tax implications of selling stocks?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <Button onClick={handleAskQuestion} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Answer
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={quickLinkImage?.imageUrl} data-ai-hint={quickLinkImage?.imageHint} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>AI Expert's Answer</CardTitle>
                <CardDescription>Here is the response to your question.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            {answer.answer.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
