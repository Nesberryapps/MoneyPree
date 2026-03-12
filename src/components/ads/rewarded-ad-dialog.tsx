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
import { Loader2 } from 'lucide-react';

interface RewardedAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReward: () => void;
}

export function RewardedAdDialog({ open, onOpenChange, onReward }: RewardedAdDialogProps) {
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
            Our AI features are supported by ads. Your result will be ready in a moment. Thank you for your support!
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex justify-center items-center h-40 bg-muted/20 rounded-md">
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <p className="text-sm text-muted-foreground">Please wait... ({countdown})</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleContinue} disabled={!canContinue} className="w-full">
            {canContinue ? 'Continue' : `Please wait... (${countdown})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
