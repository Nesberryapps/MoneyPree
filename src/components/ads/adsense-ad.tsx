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
      if (!e.message.includes("All 'ins' elements in the DOM")) {
        console.error('AdSense push error:', e);
      }
    }
  }, []);

  return (
    <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot="9200324245"
        data-ad-format="auto"
      ></ins>
    </div>
  );
}
