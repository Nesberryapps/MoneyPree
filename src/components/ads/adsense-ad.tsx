
'use client';

import React, { useEffect } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  useEffect(() => {
    // This effect will run when the component mounts or when isVerified changes.
    // If the user is verified, we attempt to push the ad to AdSense.
    // It is safe to call this multiple times; AdSense will process any unfilled ad slots.
    if (isVerified) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e: any) {
        // This error is common and expected if AdSense has no ad to show or is blocked.
        // We avoid logging it to prevent console noise.
        if (!e.message.includes("All 'ins' elements in the DOM")) {
          console.error('AdSense push error:', e);
        }
      }
    }
  }, [isVerified]);

  if (!isVerified) {
    // Render a placeholder to maintain layout without loading the ad script
    // if the user has not passed the verification gate.
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }

  // When verified, render the ad slot.
  // The useEffect will then attempt to fill it.
  return (
    <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot="9200324245"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
