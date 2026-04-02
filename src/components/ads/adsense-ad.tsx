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
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e: any) {
      if (!e.message.includes("already have ads in them")) {
        console.error('AdSense push error:', e);
      }
    }
  }, [pathname, isVerified]);

  if (!isVerified) {
    return (
      <div className="w-full min-h-[90px] flex items-center justify-center bg-muted/20 rounded-md text-center p-4">
        <p className="text-sm text-muted-foreground">Ad will load after verification</p>
      </div>
    );
  }

  return (
    <div
      key={pathname}
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
