"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export function OnboardingStep1() {
  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-90 -z-10"></div>

      {/* Canvas-like animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-[10%] left-[15%] w-24 h-24 rounded-full border-2 border-white/20"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, repeatType: "reverse" }
          }}
        />

        <motion.div
          className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-lg border-2 border-white/20 rotate-45"
          animate={{
            rotate: 405,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, repeatType: "reverse" }
          }}
        />

        <motion.div
          className="absolute top-[60%] left-[70%] w-16 h-16 rounded-full bg-white/5"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Animated particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-white">
        {/* Canvas-like logo animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
          className="relative mb-8"
        >
          <div className="relative">
            {/* Animated circles around the logo */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/30"
                style={{
                  width: `${(i+1) * 40 + 60}px`,
                  height: `${(i+1) * 40 + 60}px`,
                  top: `${-(i+1) * 20 - 30}px`,
                  left: `${-(i+1) * 20 - 30}px`,
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            <Brain className="w-28 h-28 text-white relative z-10" />

            <motion.div
              className="absolute inset-0 bg-white opacity-30 blur-lg rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Welcome to <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">MindFlip-AI</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-center max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Your AI-powered flashcard learning platform that automatically generates study materials and makes learning engaging, effective, and fun.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <FeatureCard
            title="AI-Generated Flashcards"
            description="Instantly create study materials from any topic with our advanced AI"
            delay={1.2}
          />
          <FeatureCard
            title="Study Smarter"
            description="Multiple study modes including spaced repetition"
            delay={1.4}
          />
          <FeatureCard
            title="Track Progress"
            description="Visualize your learning journey with detailed statistics"
            delay={1.6}
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
      }}
    >
      {/* Canvas-like decorative elements */}
      <motion.div
        className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-white/5"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.div
        className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white/5"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
      />

      <h3 className="text-lg font-semibold mb-3 relative z-10">{title}</h3>
      <p className="text-sm text-white/90 relative z-10">{description}</p>
    </motion.div>
  );
}
