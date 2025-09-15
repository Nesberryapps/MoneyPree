'use client';

import { useState } from 'react';
import {
  generateFinancialLessons,
  type GenerateFinancialLessonsOutput,
} from '@/ai/flows/generate-financial-lessons';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FinancialLessons() {
  const [currentFinancialKnowledge, setCurrentFinancialKnowledge] = useState('');
  const [specificTopicsOfInterest, setSpecificTopicsOfInterest] = useState('');
  const [lesson, setLesson] = useState<GenerateFinancialLessonsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLesson = async () => {
    setIsLoading(true);
    setError(null);
    setLesson(null);
    try {
      const result = await generateFinancialLessons({
        currentFinancialKnowledge,
        specificTopicsOfInterest,
      });
      setLesson(result);
    } catch (e) {
      setError('Failed to generate lesson. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Financial Lessons</CardTitle>
          <CardDescription>
            Tell us what you know and what you want to learn, and we&apos;ll create a personalized lesson for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="knowledge">Your Current Financial Knowledge</Label>
            <Textarea
              id="knowledge"
              placeholder="e.g., I'm new to investing, but I'm good at budgeting."
              value={currentFinancialKnowledge}
              onChange={(e) => setCurrentFinancialKnowledge(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topics">Specific Topics of Interest</Label>
            <Textarea
              id="topics"
              placeholder="e.g., Stock market basics, retirement planning, real estate."
              value={specificTopicsOfInterest}
              onChange={(e) => setSpecificTopicsOfInterest(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateLesson} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate My Lesson
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

      {lesson && (
        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold">{lesson.lessonTitle}</AccordionTrigger>
                <AccordionContent className="prose dark:prose-invert max-w-none pt-4">
                  {lesson.lessonContent.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  <div className="flex gap-4 text-sm text-muted-foreground mt-4">
                    {lesson.lessonType && <span>Type: {lesson.lessonType}</span>}
                    {lesson.estimatedCompletionTime && <span>Time: {lesson.estimatedCompletionTime}</span>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
