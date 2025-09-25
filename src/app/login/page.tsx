'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AuthProvider } from '@/components/auth/auth-provider';
import { FinwiseCompassIcon } from '@/components/icons';
import Loading from '@/components/layout/loading';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    // Show a loading indicator while checking auth state or during redirection
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-2">
          <FinwiseCompassIcon className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">Finwise Compass</span>
        </div>
        <p className="text-center text-muted-foreground">
          Your AI-powered guide to financial literacy and success.
        </p>
        <AuthProvider />
      </div>
    </div>
  );
}
