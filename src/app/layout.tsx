import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const anthropicLocal = localFont({
  src: '../assets/fonts/anthropic.woff2',
});

export const metadata: Metadata = {
  title: 'My Timetable',
  description:
    'Your personal class timetable — view and manage your schedule by day, week, or month.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anthropicLocal.className} antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
