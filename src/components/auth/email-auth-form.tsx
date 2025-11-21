
'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  type AuthError,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

type EmailAuthFormProps = {
  mode: 'signin' | 'signup';
};

export function EmailAuthForm({ mode }: EmailAuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for password reset
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (e: any) {
      const authError = e as AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use. Please sign in or use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('The password must be at least 6 characters long.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
      console.error(authError);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    setResetError(null);
    setResetSuccess(null);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        setResetSuccess('If an account exists for this email, a password reset link has been sent to your inbox.');
    } catch (e: any) {
        const authError = e as AuthError;
         if (authError.code === 'auth/invalid-email') {
            setResetError('Please enter a valid email address.');
        } else {
            // For security, don't reveal if an email doesn't exist.
            // Show a generic success message.
            setResetSuccess('If an account exists for this email, a password reset link has been sent to your inbox.');
        }
        console.error(authError);
    } finally {
        setIsResetLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
             {mode === 'signin' && (
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="link"
                            className="text-xs h-auto p-0"
                        >
                            Forgot Password?
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                                Enter your email address below and we'll send you a link to reset your password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                             {resetSuccess && <Alert><AlertDescription>{resetSuccess}</AlertDescription></Alert>}
                             {resetError && <Alert variant="destructive"><AlertDescription>{resetError}</AlertDescription></Alert>}
                             <div className="grid gap-2">
                                <Label htmlFor="reset-email">Email</Label>
                                <Input
                                id="reset-email"
                                type="email"
                                placeholder="m@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isResetLoading}>
                                    {isResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
