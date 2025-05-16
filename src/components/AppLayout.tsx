"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import { EnhancedParticles } from '@/components/ui/enhanced-particles';
import { TopNavigation } from '@/components/ui/top-navigation';

interface AppLayoutProps {
  children: ReactNode;
}

// Simple version of the layout for server-side rendering
// This component should be as simple as possible to avoid hydration mismatches
function SimpleLayout({ children }: AppLayoutProps) {
  return (
    <div suppressHydrationWarning className="min-h-screen pt-16">
      <main suppressHydrationWarning className="pt-4">{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client-side
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're in the browser
    // and to delay the state update until after hydration
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Use a simple layout during SSR to avoid hydration mismatches
  if (typeof window === 'undefined' || !mounted) {
    return <SimpleLayout>{children}</SimpleLayout>;
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced canvas-like background */}
      <EnhancedParticles />

      {/* Top navigation */}
      <TopNavigation />

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        {children}
      </main>
    </div>
  );
}
