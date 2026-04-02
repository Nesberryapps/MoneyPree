'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdsenseAd } from './adsense-ad';
import { useVerification } from '@/hooks/use-verification';

interface RewardedAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReward: () => void;
}

export function RewardedAdDialog({ open, onOpenChange, onReward }: RewardedAdDialogProps) {
  const { isVerified } = useVerification();
  const [canContinue, setCanContinue] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (open) {
      setCanContinue(false);
      setCountdown(5);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCanContinue(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on component unmount or when dialog is closed
      return () => clearInterval(countdownInterval);
    }
  }, [open]);

  const handleContinue = () => {
    onReward();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>One Moment Please</DialogTitle>
          <DialogDescription>
            To keep our AI features free, please view this brief ad. Your result is being generated.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex justify-center items-center rounded-md">
          <AdsenseAd isVerified={isVerified} />
        </div>
        <DialogFooter>
          <Button onClick={handleContinue} disabled={!canContinue} className="w-full">
            {canContinue ? 'Continue to Result' : `Please wait... (${countdown})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
