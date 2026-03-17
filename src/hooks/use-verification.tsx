
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

const SESSION_STORAGE_KEY = 'user_verified';

interface VerificationContextType {
  isVerified: boolean;
  verify: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerifiedState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (item === 'true') {
        setIsVerifiedState(true);
      }
    } catch (error) {
      console.error("Could not read verification status from sessionStorage", error);
    }
  }, []);

  const verify = useCallback(() => {
    try {
      // Set the flag in sessionStorage first
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      // Then force a reload. After reload, the useEffect will read the new value.
      window.location.reload();
    } catch (error) {
      // Fallback for private browsing or other issues
      console.error("Could not save verification status to sessionStorage", error);
      setIsVerifiedState(true); // Manually set state if storage fails
    }
  }, []);

  const value = {
    isVerified: isMounted ? isVerified : false,
    verify,
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}

function VerificationScreen({ onVerify }: { onVerify: () => void }) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        generateProblem();
    }, []);

    const generateProblem = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setAnswer('');
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(answer, 10) === num1 + num2) {
            onVerify();
        } else {
            setError('Incorrect answer. Please try again.');
            generateProblem();
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Quick Verification</CardTitle>
                    <CardDescription>To protect our advertisers from bot traffic and keep our AI features free, please solve this simple problem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <Label htmlFor="answer" className="text-lg font-semibold">
                                What is {num1} + {num2}?
                            </Label>
                            <Input
                                id="answer"
                                type="number"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="mt-2 text-center text-lg h-12"
                                required
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-sm text-center text-destructive">{error}</p>}
                        <Button type="submit" className="w-full">
                            Verify
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


export function VerificationGate({ children }: { children: React.ReactNode }) {
  const { isVerified, verify } = useVerification();

  if (!isVerified) {
    return <VerificationScreen onVerify={verify} />;
  }

  return <>{children}</>;
}
