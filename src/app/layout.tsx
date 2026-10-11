import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import 'lenis/dist/lenis.css';
import '../styles/global.css';
import { geist, geistMono } from './fonts';
import Motion from '../components/Motion';

export const metadata: Metadata = {
  title: 'Lweb Interaktiv · Websites, die man betritt',
  description:
    'Interaktive Websites aus der Schweiz: Scroll-Animationen und Kamerafahrten, die Ihre Kunden staunen lassen. Für Restaurants, Hotels, Weingüter, Immobilien und Handwerk.',
  robots: 'noindex, follow',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070a14',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body className="min-h-svh overflow-x-clip">
        {children}
        <Motion />
      </body>
    </html>
  );
}
