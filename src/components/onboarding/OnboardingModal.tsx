"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { OnboardingStep1 } from './steps/OnboardingStep1';
import { OnboardingStep2 } from './steps/OnboardingStep2';
import { OnboardingStep3 } from './steps/OnboardingStep3';
import { OnboardingStep4 } from './steps/OnboardingStep4';
import { OnboardingStep5 } from './steps/OnboardingStep5';

export function OnboardingModal() {
  const {
    isOpen,
    currentStep,
    totalSteps,
    hasCompletedOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    closeOnboarding,
    startOnboarding
  } = useOnboardingStore();

  // Check if this is the first visit and show onboarding
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      startOnboarding();
    }
  }, [hasCompletedOnboarding, startOnboarding]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OnboardingStep1 />;
      case 1:
        return <OnboardingStep2 />;
      case 2:
        return <OnboardingStep3 />;
      case 3:
        return <OnboardingStep4 />;
      case 4:
        return <OnboardingStep5 />;
      default:
        return <OnboardingStep1 />;
    }
  };

  // Progress indicator dots
  const renderProgressDots = () => {
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentStep ? 'bg-primary' : 'bg-primary/30'
            }`}
            initial={{ scale: 0.8 }}
            animate={{
              scale: index === currentStep ? 1.2 : 0.8,
              backgroundColor: index === currentStep ? 'var(--primary)' : 'rgba(var(--primary), 0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Full-screen background overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={skipOnboarding} />

          {/* Canvas-like background with animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/30"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full max-w-4xl mx-4 rounded-xl overflow-hidden glassmorphism-intense"
              style={{ maxHeight: '90vh' }}
            >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-black/20 hover:bg-black/30"
              onClick={skipOnboarding}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Current step content */}
            {renderStep()}

            {/* Navigation buttons */}
            <div className="absolute bottom-8 w-full flex justify-between px-8">
              <div>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {currentStep < totalSteps - 1 ? (
                  <Button
                    onClick={nextStep}
                    className="relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center">
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </Button>
                ) : (
                  <Button
                    onClick={completeOnboarding}
                    className="relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center">
                      Get Started
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-0 right-0">
              {renderProgressDots()}
            </div>
          </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
