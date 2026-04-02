
'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  const pathname = usePathname();
  
  // Create a unique key for the ad unit that changes on every route change.
  // This is crucial for forcing React to unmount the old ad slot and mount a new one,
  // which is the correct way to handle ads in a Single Page Application (SPA).
  const adKey = useMemo(() => pathname + Math.random(), [pathname]);

  useEffect(() => {
    if (isVerified) {
      try {
        // This tells AdSense to look for new ad units on the page and initialize them.
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e: any) {
        // AdSense throws an error if it's called on a slot that's already filled.
        // Our key-based re-mounting strategy should prevent this, but we'll log
        // other unexpected errors.
        if (!e.message.includes("already have ads in them")) {
            console.error("AdSense error:", e);
        }
      }
    }
  }, [isVerified, adKey]); // Re-run effect when verification status or the ad key changes.

  if (!isVerified) {
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }

  // By using the `adKey` here, we ensure React creates a fresh `ins` element on each navigation,
  // preventing the "slot already filled" error from AdSense.
  return (
    <div className="w-full min-h-[90px] flex flex-col items-center justify-center bg-muted/20 rounded-md text-center p-4">
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot="9200324245"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
       <p className="text-xs text-muted-foreground mt-2">
        Ad placeholder: Waiting for an ad from Google. This may be blank on new sites.
      </p>
    </div>
  );
}
