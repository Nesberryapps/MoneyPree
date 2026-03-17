'use client';

import React, { useEffect, useRef } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  const adPushed = useRef(false);

  useEffect(() => {
    // Only push the ad if the user is verified and the ad hasn't been pushed yet.
    if (!isVerified || adPushed.current) {
      return;
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      adPushed.current = true;
    } catch (e: any) {
      if (!e.message.includes("All 'ins' elements in the DOM")) {
        console.error('AdSense push error:', e);
      }
    }
  }, [isVerified]);

  if (!isVerified) {
    // Render a placeholder to maintain layout without loading the ad script.
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }


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
