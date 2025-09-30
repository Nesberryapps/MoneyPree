'use client';

import { useState } from 'react';
import {
  simulateInvestmentScenarios,
  type SimulateInvestmentScenariosOutput,
} from '@/ai/flows/simulate-investment-scenarios';
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
import { Loader2, TrendingUp, Shield, BarChart, Mic, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';

const splitIntoSentences = (text: string): string[] => {
  if (!text) return [];
  // This regex splits by periods, question marks, and exclamation points
  // that are followed by a space and an uppercase letter, or at the end of the string.
  // It's not perfect but handles many common cases.
  const sentences = text.match(/[^.!?]+[.!?]\s*|[^.!?]+$/g);
  return sentences || [text]; // Return the original text if no sentences are found
};


export function InvestmentSimulation() {
  const [currentHoldings, setCurrentHoldings] = useState('');
  const [investmentGoals, setInvestmentGoals] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulateInvestmentScenariosOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isVoiceInteractionEnabled } = useVoiceInteraction();
  
  const { transcript: holdingsTranscript, isListening: isListeningHoldings, startListening: startListeningHoldings, stopListening: stopListeningHoldings } = useSpeechToText({ onTranscript: (text) => setCurrentHoldings(prev => prev + text) });
  const { transcript: goalsTranscript, isListening: isListeningGoals, startListening: startListeningGoals, stopListening: stopListeningGoals } = useSpeechToText({ onTranscript: (text) => setInvestmentGoals(prev => prev + text) });

  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech();

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const result = await simulateInvestmentScenarios({
        currentHoldings,
        investmentGoals,
      });
      setSimulationResult(result);
    } catch (e) {
      setError('Failed to run simulation. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle>Comprehensive Investment Analysis</CardTitle>
          <CardDescription>
            From stocks and real estate to starting a business, get AI-powered suggestions for your unique investment goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="holdings">Your Current Assets & Investments</Label>
            <div className="relative">
              <Textarea
                id="holdings"
                placeholder="e.g., 10 Apple (AAPL), Rental property in downtown, $20k in savings."
                value={currentHoldings}
                onChange={(e) => setCurrentHoldings(e.target.value)}
              />
              {isVoiceInteractionEnabled && (
                  <Button
                      size="icon"
                      variant={isListeningHoldings ? 'destructive' : 'ghost'}
                      className="absolute bottom-2 right-2"
                      onClick={isListeningHoldings ? stopListeningHoldings : startListeningHoldings}
                  >
                      <Mic className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goals">Your Investment Goals</Label>
            <div className="relative">
              <Textarea
                id="goals"
                placeholder="e.g., Retire in 10 years, buy a franchise, generate passive income from real estate."
                value={investmentGoals}
                onChange={(e) => setInvestmentGoals(e.target.value)}
              />
               {isVoiceInteractionEnabled && (
                  <Button
                      size="icon"
                      variant={isListeningGoals ? 'destructive' : 'ghost'}
                      className="absolute bottom-2 right-2"
                      onClick={isListeningGoals ? stopListeningGoals : startListeningGoals}
                  >
                      <Mic className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </div>
          <Button onClick={handleSimulate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Simulation
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

      {simulationResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Simulation Results</CardTitle>
               {isVoiceInteractionEnabled && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSpeak(Object.values(simulationResult).join('\n'))}
                  >
                    <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-primary' : ''}`} />
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><BarChart className="text-primary"/> Suggested Diversification</h3>
              <p className="text-muted-foreground">{simulationResult.suggestedDiversification}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Shield className="text-primary"/> Risk Assessment</h3>
              <p className="text-muted-foreground">{simulationResult.riskAssessment}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="text-primary"/> Potential Returns</h3>
              <p className="text-muted-foreground">{simulationResult.potentialReturns}</p>
            </div>
             {simulationResult.disclaimer && (
                <p className="text-xs text-muted-foreground pt-4 border-t">{simulationResult.disclaimer}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
