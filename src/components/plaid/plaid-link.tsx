'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { createLinkToken, setAccessToken } from '@/ai/flows/plaid-flows';
import { Banknote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PlaidLink({ disabled = false }: { disabled?: boolean }) {
  const { user } = useUser();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getLinkToken = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const response = await createLinkToken({ userId: user.uid });
      setLinkToken(response.link_token);
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      toast({
        variant: 'destructive',
        title: 'Error Connecting to Plaid',
        description: 'Could not create a Plaid link token. Please try again later.',
      });
    } finally {
        setIsLoading(false);
    }
  }, [user?.uid, toast]);

  useEffect(() => {
    // We don't want to auto-fetch the token on every render,
    // only when the user is defined and we don't have a token.
    if (user?.uid && !linkToken) {
       // We can pre-fetch the token to make the link open faster when clicked.
       getLinkToken();
    }
  }, [user?.uid, linkToken, getLinkToken]);
  
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      if (!user?.uid) return;
      
      try {
        await setAccessToken({ public_token: public_token, userId: user.uid });
        toast({
            title: 'Bank Account Connected!',
            description: 'Your account has been successfully linked.',
        });
        // Here you would typically trigger a re-fetch of transactions
      } catch (error) {
        console.error('Error setting access token:', error);
        toast({
            variant: 'destructive',
            title: 'Connection Failed',
            description: 'Could not save the connection to your bank account.',
        });
      }
    },
    [user?.uid, toast]
  );

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (disabled) {
        toast({
            title: 'Pro Feature',
            description: 'Please upgrade to a Pro plan to connect your bank account.',
            action: (
                <a href="/pricing">
                    <Button>Upgrade</Button>
                </a>
            )
        })
        return;
    }
    open();
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!ready || isLoading || disabled}
      size="sm"
      variant="outline"
      className="h-8 gap-1"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Banknote className="h-3.5 w-3.5" />
      )}
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Connect Bank
      </span>
    </Button>
  );
};
