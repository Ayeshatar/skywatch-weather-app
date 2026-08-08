import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SkyWatch — Real-time weather at your fingertips',
    template: '%s | SkyWatch',
  },
  description:
    'SkyWatch delivers accurate, real-time weather updates, 7-day forecasts, and air quality tracking in a clean, modern interface.',
  keywords: ['weather app', 'forecast', 'real-time weather', 'SkyWatch', 'air quality'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'SkyWatch — Real-time weather at your fingertips',
    description: 'Accurate forecasts, beautiful UI, and real-time data to help you plan your day better.',
    siteName: 'SkyWatch',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2F6FED',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background font-sans text-gray-800 dark:bg-[#0B1120] dark:text-gray-100">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
