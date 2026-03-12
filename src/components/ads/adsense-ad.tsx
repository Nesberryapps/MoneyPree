
'use client';

import React, { useEffect } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd() {
  useEffect(() => {
    try {
      // This is the standard way to push an ad request to AdSense.
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
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
