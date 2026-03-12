'use client';

import React, { useEffect, useRef } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd() {
  const adPushed = useRef(false);

  useEffect(() => {
    // This check ensures that adsbygoogle.push() is only called once per
    // component mount, which is crucial for preventing errors in React's
    // Strict Mode (used in Next.js development).
    if (adPushed.current) {
      return;
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      adPushed.current = true;
    } catch (e: any) {
      // The "All 'ins' elements..." error is expected in some development scenarios,
      // so we can safely log it as a warning instead of a critical error.
      console.warn('AdSense push error:', e);
    }
  }, []);

  // IMPORTANT: You need to replace 'YOUR_AD_SLOT_ID' with an actual ad slot ID from your AdSense account.
  // This is a placeholder and will not display a real ad until you provide a valid ad slot ID.
  return (
    <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot="YOUR_AD_SLOT_ID" // <-- REPLACE THIS WITH YOUR ADSLOT ID
        data-ad-format="auto"
      ></ins>
    </div>
  );
}
