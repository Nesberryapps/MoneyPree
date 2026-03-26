'use client';

import React, { useEffect, useRef } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  const adPushed = useRef(false);

  useEffect(() => {
    // We only want to push the ad once after verification.
    if (isVerified && !adPushed.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        // Mark that the ad has been pushed to prevent this from running again.
        adPushed.current = true;
      } catch (e: any) {
        // This error can happen in some development environments (like with hot-reloading)
        // or other race conditions. It's benign, so we can safely ignore it.
        if (!e.message.includes("already have ads in them")) {
          console.error('AdSense push error:', e);
        }
      }
    }
  }, [isVerified]); // Rerun effect if verification status changes

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
