"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OnboardingStep3() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<'known' | 'unknown' | null>(null);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKnow = () => {
    setFeedback('known');
    setTimeout(() => {
      setFeedback(null);
      setIsFlipped(false);
    }, 1000);
  };

  const handleDontKnow = () => {
    setFeedback('unknown');
    setTimeout(() => {
      setFeedback(null);
      setIsFlipped(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-sunset opacity-90 -z-10"></div>

      {/* Canvas-like background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-white/20"
            style={{
              width: `${Math.random() * 30 + 20}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 70}%`,
              transformOrigin: 'left',
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -Math.random() * 50 - 20],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col h-full px-8 py-16 text-white">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mr-3">
            <Sparkles className="h-8 w-8 text-white" />
            <div className="absolute inset-0 bg-white opacity-30 blur-md rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold">Study with Interactive Flashcards</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 h-full">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl mb-6">
              Flip through your flashcards with beautiful animations and track your progress as you study.
            </p>

            <ul className="space-y-4 mb-8">
              <ListItem delay={0.5}>
                Multiple study modes including shuffle and spaced repetition
              </ListItem>
              <ListItem delay={0.7}>
                Mark cards as "Known" or "Don't Know" to track your progress
              </ListItem>
              <ListItem delay={0.9}>
                Keyboard shortcuts for efficient studying
              </ListItem>
            </ul>

            <p className="text-lg font-medium mb-4">Try it out:</p>

            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handleFlip}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <motion.div
                    animate={{ rotate: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                  </motion.div>
                  Flip Card
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-full max-w-md">
              <motion.div
                className={`relative w-full h-64 rounded-xl cursor-pointer perspective-1000 ${feedback === 'known' ? 'bg-green-500/20' : feedback === 'unknown' ? 'bg-red-500/20' : ''}`}
                animate={{
                  scale: feedback ? [1, 1.05, 1] : 1,
                  transition: { duration: 0.5 }
                }}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-all duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Card Front */}
                  <div
                    className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center text-center bg-white/10 backdrop-blur-md border border-white/20"
                    onClick={handleFlip}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-cosmic rounded-lg opacity-20 blur-sm -z-10"></div>
                    <div className="absolute -inset-1 bg-gradient-neon rounded-lg opacity-10 blur-md -z-20 animate-pulse-slow"></div>

                    <motion.h3
                      className="text-2xl font-bold mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      What is photosynthesis?
                    </motion.h3>
                    <p className="text-white/70 text-sm">Click to flip</p>
                  </div>

                  {/* Card Back */}
                  <div
                    className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-center items-center text-center bg-white/10 backdrop-blur-md border border-white/20 rotateY-180"
                    onClick={handleFlip}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-cosmic rounded-lg opacity-20 blur-sm -z-10"></div>
                    <div className="absolute -inset-1 bg-gradient-neon rounded-lg opacity-10 blur-md -z-20 animate-pulse-slow"></div>

                    <motion.p
                      className="text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isFlipped ? 1 : 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.
                    </motion.p>
                  </div>
                </motion.div>

                {/* Feedback buttons */}
                {isFlipped && (
                  <motion.div
                    className="absolute bottom-4 left-0 right-0 flex justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDontKnow}
                        className="relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center justify-center">
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Don't Know</span>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        onClick={handleKnow}
                        className="relative overflow-hidden group bg-green-600 hover:bg-green-700 text-white"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center justify-center">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          <span>Know</span>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ListItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.li
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="h-2 w-2 rounded-full bg-white" />
      <span>{children}</span>
    </motion.li>
  );
}
