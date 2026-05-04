import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/auth-provider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'A modern schedule management app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
          }}
        />
        <LoadingOverlay />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
