import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'QuickNotes',
  description: 'iOS-style notes app with AI text extraction',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sf bg-ios-background dark:bg-ios-background-dark min-h-screen">
        <main className="pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
