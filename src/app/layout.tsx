
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { VoiceInteractionProvider } from '@/hooks/use-voice-interaction';
import { DataProvider } from '@/hooks/use-local-data';
import { VerificationProvider, VerificationGate } from '@/hooks/use-verification';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { GA_TRACKING_ID } from '@/lib/gtag';


export const metadata: Metadata = {
  title: 'MoneyPree',
  description: 'Teach, manage, and suggest financial investments using AI.',
  other: {
    'google-adsense-account': 'ca-pub-6191158195654090',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics Scripts */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <DataProvider>
            <VoiceInteractionProvider>
              <VerificationProvider>
                <VerificationGate>
                  <GoogleAnalytics />
                  {children}
                </VerificationGate>
              </VerificationProvider>
            </VoiceInteractionProvider>
          </DataProvider>
          <Toaster />
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6191158195654090"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
