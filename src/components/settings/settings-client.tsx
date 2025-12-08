
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';
import { createCustomerPortalSession } from '@/ai/flows/stripe-checkout';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useProStatus } from '@/hooks/use-pro-status';
import { Badge } from '../ui/badge';
import { getAuth, deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { isVoiceInteractionEnabled, setIsVoiceInteractionEnabled } = useVoiceInteraction();
  const [mounted, setMounted] = useState(false);
  const { isPro } = useProStatus();
  const { user } = useUser();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProFeatureClick = () => {
    toast({
        title: 'Pro Feature',
        description: 'Please upgrade to a Pro plan to use this feature.',
        action: (
            <a href="/pricing">
                <Button>Upgrade</Button>
            </a>
        )
    });
  };

  const handleSave = () => {
    // In a real app, these settings would be saved to a user profile in Firestore
    console.log('Settings saved:', {
      theme,
      emailNotifications,
      isVoiceInteractionEnabled,
    });
    toast({
      title: 'Preferences Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  const handleManageSubscription = async () => {
      if (!user) {
          toast({ variant: 'destructive', title: 'You must be logged in.' });
          return;
      }
      setIsPortalLoading(true);
      try {
          const { url } = await createCustomerPortalSession({ 
            userId: user.uid,
            userEmail: user.email || undefined,
          });
          window.open(url, '_blank');
      } catch (error: any) {
          console.error('Error creating customer portal session:', error);
          toast({
              variant: 'destructive',
              title: 'Error',
              description: error.message || 'Could not open subscription management.',
          });
      } finally {
          setIsPortalLoading(false);
      }
  };

  if (!mounted) {
      return (
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of your application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-[74px]" />
                            <Skeleton className="h-[74px]" />
                            <Skeleton className="h-[74px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage how you receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <Skeleton className="h-10" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Accessibility</CardTitle>
                    <CardDescription>
                        Manage accessibility features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10" />
                </CardContent>
            </Card>
             <div className="flex justify-end">
                <Button disabled>Save Preferences</Button>
            </div>
        </div>
      )
  }

  const router = useRouter();
  const auth = getAuth();

  const handleDeleteAccount = async () => {
    // 1. Confirm intention
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is permanent and cannot be undone."
    );
    if (!confirmed) return;

    try {
      const user = auth.currentUser;
      if (user) {
        // 2. Delete from Firebase
        await deleteUser(user);
        // 3. Redirect to login
        router.push('/login');
        alert("Your account has been deleted.");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      // Firebase requires a recent login to delete sensitive data
      if (error.code === 'auth/requires-recent-login') {
        alert("For security, please log out and log back in before deleting your account.");
      } else {
        alert("Error deleting account. Please contact support.");
      }
    }
  };

  return (
    <div className="grid gap-8">
      {isPro && (
          <Card>
              <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                      Manage your MoneyPree Pro subscription, update payment methods, and view billing history.
                  </CardDescription>
              </CardHeader>
              <CardFooter>
                  <Button onClick={handleManageSubscription} disabled={isPortalLoading}>
                      {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Manage Subscription
                  </Button>
              </CardFooter>
          </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
                <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="peer sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    System
                  </Label>
                </div>
              </RadioGroup>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates and alerts in your inbox.
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Manage accessibility features for a better experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <Label htmlFor="voice-interaction" className="flex flex-col space-y-1 grow mr-4">
                  <div className="flex items-center gap-2">
                    <span>Voice Interaction</span>
                    {!isPro && <Badge variant="premium">Pro</Badge>}
                  </div>
                  <span className="font-normal leading-snug text-muted-foreground">
                      Enable voice commands and text-to-speech feedback.
                  </span>
                </Label>
                <Switch
                id="voice-interaction"
                checked={isVoiceInteractionEnabled}
                onCheckedChange={isPro ? setIsVoiceInteractionEnabled : handleProFeatureClick}
                disabled={!isPro}
                />
            </div>
        </CardContent>
      </Card>
       <div className="flex justify-end">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
        <div className="mt-8 pt-8 border-t border-red-100">
        <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Permanently remove your account and all data.
        </p>
        <button 
          onClick={handleDeleteAccount}
          className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 text-sm font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
