'use client';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

export function AuthProvider() {
  const auth = useAuth();
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} className="w-full">
      Sign in with Google
    </Button>
  );
}

    