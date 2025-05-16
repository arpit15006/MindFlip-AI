import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppDataProvider } from '@/contexts/AppDataContext';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/AppLayout';
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MindFlip-AI',
  description: 'AI-Powered Flashcard Learning Game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <div suppressHydrationWarning>
            <AppDataProvider>
              <OnboardingProvider>
                <AppLayout>
                  {children}
                </AppLayout>
                <Toaster />
              </OnboardingProvider>
            </AppDataProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
