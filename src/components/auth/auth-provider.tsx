
'use client';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export function AuthProvider() {
  const auth = useAuth();
  const router = useRouter();
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
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
