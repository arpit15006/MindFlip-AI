"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Sparkles, Brain, Lightbulb, Laptop, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export function OnboardingStep5() {
  const { completeOnboarding } = useOnboardingStore();

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-aurora opacity-90 -z-10"></div>

      {/* Canvas-like background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Animated geometric shapes */}
        <motion.div
          className="absolute top-[10%] right-[15%] w-40 h-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            <motion.path
              d="M80 10 L150 80 L80 150 L10 80 Z"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[15%] left-[10%] w-60 h-60"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <svg width="240" height="240" viewBox="0 0 240 240">
            <motion.circle
              cx="120"
              cy="120"
              r="100"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
          className="relative mb-6"
        >
          <Rocket className="w-16 h-16 text-white" />
          <motion.div
            className="absolute inset-0 bg-white opacity-30 blur-lg rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          You're Ready to <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Get Started!</span>
        </motion.h1>

        <motion.p
          className="text-xl text-center max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Start your learning journey with MindFlip-AI and transform the way you study.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-purple-300" />}
            title="AI Flashcard Generation"
            description="Instantly create complete flashcard sets from any topic with our advanced AI"
            delay={1.0}
          />

          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-300" />}
            title="Spaced Repetition"
            description="Study smarter with scientifically-proven methods"
            delay={1.2}
          />

          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-blue-300" />}
            title="Gamified Experience"
            description="Earn XP, unlock achievements, and stay motivated"
            delay={1.4}
          />
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <p className="text-lg mb-4 text-center">Available on all your devices</p>

          <div className="flex gap-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <div className="flex items-center gap-2 text-white/80">
                <Laptop className="h-5 w-5" />
                <span>Desktop</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <div className="flex items-center gap-2 text-white/80">
                <Smartphone className="h-5 w-5" />
                <span>Mobile</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={completeOnboarding}
            className="relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-cosmic opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Start Learning Now
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-full bg-white/10 mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-white/80">{description}</p>
    </motion.div>
  );
}
