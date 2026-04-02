
'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  const pathname = usePathname();
  // Create a key that is unique per-instance and changes on navigation.
  // This is crucial for forcing React to unmount and remount the component,
  // which is necessary for AdSense in a Single Page Application (SPA).
  const adKey = useMemo(() => `${pathname}-${Math.random()}`, [pathname]);

  useEffect(() => {
    if (isVerified) {
      try {
        // The push call tells AdSense to process any new ad units on the page.
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e: any) {
        // This error is expected in development and SPA environments.
        // It happens when AdSense tries to push an ad to a slot that's already been processed.
        // We can safely ignore it as the unique keying strategy should prevent most cases.
        if (!e.message.includes("already have ads in them")) {
          console.error('AdSense push error:', e);
        }
      }
    }
  }, [isVerified, adKey]); // Re-run the effect ONLY when the adKey changes.

  if (!isVerified) {
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }

  // The `key` on this div forces React to destroy the old component
  // and create a new one on every page navigation, which cleans up the old ad slot.
  return (
    <div
      key={adKey}
      className="w-full min-h-[90px] flex flex-col items-center justify-center bg-muted/20 rounded-md text-center p-4"
    >
      <ins
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
