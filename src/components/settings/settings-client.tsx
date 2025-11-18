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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';
import { createCustomerPortalSession } from '@/ai/flows/stripe-checkout';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useProStatus } from '@/hooks/use-pro-status';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const { isVoiceInteractionEnabled, setIsVoiceInteractionEnabled } = useVoiceInteraction();
  const [mounted, setMounted] = useState(false);
  const { isPro } = useProStatus();
  const { user } = useUser();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  // State for blog generation
  const [blogTopic, setBlogTopic] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);


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

  const handleGeneratePost = async () => {
    if (!blogTopic || !firestore) return;
    setIsGeneratingPost(true);
    try {
        const postData = await generateBlogPost({ topic: blogTopic });
        
        const blogPostsRef = collection(firestore, 'blogPosts');
        await addDoc(blogPostsRef, {
            ...postData,
            publishedAt: serverTimestamp(),
        });

        toast({
            title: 'Blog Post Published!',
            description: `"${postData.title}" is now live.`,
        });
        setBlogTopic('');

    } catch (error: any) {
        console.error('Error generating blog post:', error);
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: error.message || 'Could not generate the blog post.',
        });
    } finally {
        setIsGeneratingPost(false);
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
       <Card>
            <CardHeader>
                <CardTitle>Blog Content Generation</CardTitle>
                <CardDescription>
                    Use AI to generate and publish a new article for your blog. (Admin)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="blog-topic">Blog Post Topic</Label>
                    <Input 
                        id="blog-topic" 
                        placeholder="e.g., 'The basics of ETF investing'"
                        value={blogTopic}
                        onChange={(e) => setBlogTopic(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGeneratePost} disabled={isGeneratingPost || !blogTopic}>
                    {isGeneratingPost && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate & Publish Post
                </Button>
            </CardFooter>
        </Card>
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
        </CardHeader>
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
