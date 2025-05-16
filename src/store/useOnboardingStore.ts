"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  isOpen: boolean;
  totalSteps: number;
  
  // Actions
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      isOpen: false,
      totalSteps: 5,
      
      startOnboarding: () => set({ isOpen: true, currentStep: 0 }),
      
      completeOnboarding: () => set({ 
        hasCompletedOnboarding: true, 
        isOpen: false 
      }),
      
      skipOnboarding: () => set({ 
        hasCompletedOnboarding: true, 
        isOpen: false 
      }),
      
      nextStep: () => set((state) => {
        const nextStep = state.currentStep + 1;
        const isComplete = nextStep >= state.totalSteps;
        
        if (isComplete) {
          return {
            hasCompletedOnboarding: true,
            isOpen: false,
          };
        }
        
        return { currentStep: nextStep };
      }),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
      })),
      
      goToStep: (step: number) => set((state) => ({
        currentStep: Math.min(Math.max(0, step), state.totalSteps - 1)
      })),
      
      openOnboarding: () => set({ isOpen: true }),
      
      closeOnboarding: () => set({ isOpen: false }),
    }),
    {
      name: 'mindflip-onboarding',
    }
  )
);
