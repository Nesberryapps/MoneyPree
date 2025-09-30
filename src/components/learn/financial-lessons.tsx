'use client';

import { useState } from 'react';
import {
  generateFinancialLessons,
  type GenerateFinancialLessonsOutput,
} from '@/ai/flows/generate-financial-lessons';
import {
  generateQuiz,
  type Quiz,
  type QuizQuestion,
} from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Volume2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';

type FinancialLessonsProps = {
  onQuizComplete: (score: number) => void;
};

const splitIntoSentences = (text: string): string[] => {
  if (!text) return [];
  // This regex splits by periods, question marks, and exclamation points
  // that are followed by a space or are at the end of the string.
  const sentences = text.match(/[^.!?]+[.!?]*/g);
  return sentences || [text];
};

export function FinancialLessons({ onQuizComplete }: FinancialLessonsProps) {
  const [currentFinancialKnowledge, setCurrentFinancialKnowledge] = useState('');
  const [specificTopicsOfInterest, setSpecificTopicsOfInterest] = useState('');
  const [lesson, setLesson] = useState<GenerateFinancialLessonsOutput | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { isVoiceInteractionEnabled } = useVoiceInteraction();
  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech();
  const { transcript: knowledgeTranscript, isListening: isListeningKnowledge, startListening: startListeningKnowledge, stopListening: stopListeningKnowledge } = useSpeechToText({ onTranscript: (text) => setCurrentFinancialKnowledge(prev => prev + text) });
  const { transcript: topicsTranscript, isListening: isListeningTopics, startListening: startListeningTopics, stopListening: stopListeningTopics } = useSpeechToText({ onTranscript: (text) => setSpecificTopicsOfInterest(prev => prev + text) });


  const handleGenerateLesson = async () => {
    setIsLessonLoading(true);
    setIsQuizLoading(true); // Start loading quiz at the same time
    setError(null);
    setLesson(null);
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const lessonResult = await generateFinancialLessons({
        currentFinancialKnowledge,
        specificTopicsOfInterest,
      });
      setLesson(lessonResult);
      
      // Now generate the quiz
      try {
        const quizResult = await generateQuiz({ lessonContent: lessonResult.lessonContent });
        setQuiz(quizResult);
      } catch (e) {
        setError('Failed to generate quiz. Please try generating the lesson again.');
        console.error(e);
      } finally {
        setIsQuizLoading(false);
      }

    } catch (e) {
      setError('Failed to generate lesson. Please try again.');
      console.error(e);
      setIsQuizLoading(false); // Stop quiz loading if lesson fails
    } finally {
      setIsLessonLoading(false);
    }
  };

  const handleAnswerChange = (questionText: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [questionText]: value }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    quiz?.questions.forEach(q => {
      if (userAnswers[q.questionText] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setSubmitted(true);
    onQuizComplete(correctAnswers);
  };

  const getResultVariant = (question: QuizQuestion, choice: string) => {
    if (!submitted) return 'secondary';
    if (choice === question.correctAnswer) return 'default'; // Correct answer
    if (choice === userAnswers[question.questionText]) return 'destructive'; // Incorrectly selected by user
    return 'secondary'; // Not selected
  }

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(splitIntoSentences(text));
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
            <div className="relative">
              <Textarea
                id="knowledge"
                placeholder="e.g., I'm new to investing, but I'm good at budgeting."
                value={currentFinancialKnowledge}
                onChange={(e) => setCurrentFinancialKnowledge(e.target.value)}
              />
               {isVoiceInteractionEnabled && (
                  <Button
                      size="icon"
                      variant={isListeningKnowledge ? 'destructive' : 'ghost'}
                      className="absolute bottom-2 right-2"
                      onClick={isListeningKnowledge ? stopListeningKnowledge : startListeningKnowledge}
                  >
                      <Mic className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topics">Specific Topics of Interest</Label>
            <div className="relative">
              <Textarea
                id="topics"
                placeholder="e.g., Stock market basics, retirement planning, real estate."
                value={specificTopicsOfInterest}
                onChange={(e) => setSpecificTopicsOfInterest(e.target.value)}
              />
              {isVoiceInteractionEnabled && (
                  <Button
                      size="icon"
                      variant={isListeningTopics ? 'destructive' : 'ghost'}
                      className="absolute bottom-2 right-2"
                      onClick={isListeningTopics ? stopListeningTopics : startListeningTopics}
                  >
                      <Mic className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </div>
          <Button onClick={handleGenerateLesson} disabled={isLessonLoading}>
            {isLessonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Your Personalized Lesson</CardTitle>
             {isVoiceInteractionEnabled && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleSpeak(`${lesson.lessonTitle}\n\n${lesson.lessonContent}`)}
                >
                  <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-primary' : ''}`} />
                </Button>
              )}
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

      {isQuizLoading && (
         <Card>
            <CardHeader>
                <CardTitle>Generating Quiz...</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-8">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </CardContent>
        </Card>
      )}

      {quiz && !isQuizLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Test Your Knowledge</CardTitle>
                <CardDescription>Answer the questions below to see what you've learned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quiz.questions.map((q, index) => (
                    <div key={index} className="space-y-3">
                        <Label className="font-semibold text-base">{index + 1}. {q.questionText}</Label>
                        <RadioGroup 
                            value={userAnswers[q.questionText]}
                            onValueChange={(value) => handleAnswerChange(q.questionText, value)}
                            disabled={submitted}
                        >
                            {q.choices.map((choice, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <RadioGroupItem value={choice} id={`q${index}-choice${i}`} />
                                    <Label htmlFor={`q${index}-choice${i}`} className="w-full">
                                        <Badge variant={getResultVariant(q, choice)} className="p-2 w-full text-left justify-start">
                                            {choice}
                                        </Badge>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
                {!submitted ? (
                    <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
                ) : (
                    <div className="text-xl font-bold">
                        Your Score: {score} out of {quiz.questions.length} ({((score / quiz.questions.length) * 100).toFixed(0)}%)
                    </div>
                )}
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
