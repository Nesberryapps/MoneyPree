'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// This component is responsible for loading an AdSense ad unit.
export function AdsenseAd({ isVerified }: { isVerified: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only proceed if the user is verified
    if (!isVerified) {
      return;
    }

    try {
      // The push call tells AdSense to process any new ad units on the page.
      // This is safe to call multiple times on navigation because the `key` prop
      // on the div below ensures we get a fresh, unprocessed ad slot.
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e: any) {
      // It's common to get an error if you push too many times, especially in dev.
      // We can safely ignore the benign "already have ads" error.
      if (!e.message.includes("already have ads in them")) {
        console.error('AdSense push error:', e);
      }
    }
  }, [pathname, isVerified]); // Re-run when the path or verification status changes.

  if (!isVerified) {
    // Render a placeholder before verification to maintain layout.
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }

  // When verified, render the ad slot.
  // The `key={pathname}` is the crucial part. It forces React to destroy the old
  // component and create a new one whenever the user navigates to a new page.
  // This gives AdSense a fresh <ins> tag to inject an ad into.
  return (
    <div
      key={pathname}
      className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4"
    >
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
