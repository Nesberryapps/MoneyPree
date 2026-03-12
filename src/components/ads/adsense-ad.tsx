
'use client';

import React, { useEffect } from 'react';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd() {
  // Use a unique key for each ad instance to help React and AdSense
  // distinguish between different ad slots.
  const adKey = React.useId();

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e: any) {
      // AdSense will throw an error if it's called multiple times on a page
      // with no new ad slots to fill. This is common in React with Strict Mode
      // or when components re-render. We can safely ignore this specific error.
      if (e.message && e.message.includes("All 'ins' elements")) {
        // This is an expected error in a dynamic environment, do not log it.
        return;
      }
      console.error('AdSense error:', e);
    }
  }, []);

  // IMPORTANT: You need to replace 'YOUR_AD_SLOT_ID' with an actual ad slot ID from your AdSense account.
  // This is a placeholder and will not display a real ad until you provide a valid ad slot ID.
  return (
    <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
      <ins
        key={adKey} // Add a unique key
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot="YOUR_AD_SLOT_ID" // <-- REPLACE THIS WITH YOUR ADSLOT ID
        data-ad-format="auto"
      ></ins>
    </div>
  );
}
