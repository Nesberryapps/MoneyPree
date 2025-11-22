
'use client';
import { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EmailAuthForm } from './email-auth-form';

export function AuthProvider() {
  const auth = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin');
  
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
     <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>{activeTab === 'signin' ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {activeTab === 'signin' ? 'Sign in to access your dashboard.' : 'Sign up to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <EmailAuthForm mode="signin" />
          </TabsContent>
          <TabsContent value="signup">
            <EmailAuthForm mode="signup" />
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
