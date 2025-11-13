
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


// This is a simulation. In a real app, this would be determined by the user's subscription status in your database.
const useProStatus = () => {
    const [isPro, setIsPro] = useState(false);
    useEffect(() => {
        // To test, you can toggle this in the dashboard and then navigate here.
        const proStatus = localStorage.getItem('isPro');
        setIsPro(proStatus === 'true');
    }, []);
    return { isPro };
};

export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const { isVoiceInteractionEnabled, setIsVoiceInteractionEnabled } = useVoiceInteraction();
  const [mounted, setMounted] = useState(false);
  const { isPro } = useProStatus();
  const { user } = useUser();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    // In a real app, these settings would be saved to a user profile in Firestore
    console.log('Settings saved:', {
      theme,
      emailNotifications,
      pushNotifications,
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
          // In a real app, you would have the Stripe Customer ID stored against the user.
          // Here, our flow finds a test customer.
          const { url } = await createCustomerPortalSession({ userId: user.uid });
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
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get notified on your devices.
              </span>
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
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
        </Header>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <Label htmlFor="voice-interaction" className="flex flex-col space-y-1">
                <span>Voice Interaction</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Enable voice commands and text-to-speech feedback.
                </span>
                </Label>
                <Switch
                id="voice-interaction"
                checked={isVoiceInteractionEnabled}
                onCheckedChange={setIsVoiceInteractionEnabled}
                />
            </div>
        </CardContent>
      </Card>
       <div className="flex justify-end">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
    </div>
  );
}
