"use client";
import React from 'react';
import { OnboardingModal } from './OnboardingModal';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { HelpCircle } from 'lucide-react';

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  return (
    <>
      {children}
      <OnboardingModal />
    </>
  );
}

export function OnboardingButton() {
  const { openOnboarding } = useOnboardingStore();

  return (
    <button
      onClick={openOnboarding}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all hover:shadow-md"
    >
      <HelpCircle className="h-4 w-4" />
      <span>Show Tutorial</span>
    </button>
  );
}
