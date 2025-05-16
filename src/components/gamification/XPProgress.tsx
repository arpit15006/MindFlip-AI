"use client";
import { motion } from 'framer-motion';
import { useProgressStore } from '@/store/useProgressStore';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function XPProgress() {
  const { progress } = useProgressStore();
  const { level, xp, xpToNextLevel } = progress;

  const percentComplete = Math.min(100, Math.floor((xp / xpToNextLevel) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glassmorphism overflow-hidden border-2 border-white/30">
        <CardContent className="p-4 relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-blue-600/30 to-teal-600/40 -z-10"></div>
          <div className="absolute -inset-1 bg-gradient-sunset opacity-30 blur-xl -z-10"></div>

          <motion.div
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <motion.div
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  times: [0, 0.2, 0.8, 1]
                }}
              >
                <Sparkles className="h-5 w-5 text-primary mr-2" />
              </motion.div>
              <motion.span
                className="font-semibold"
                whileHover={{
                  scale: 1.05,
                  color: "hsl(var(--accent))",
                  transition: { duration: 0.2 }
                }}
              >
                Level {level}
              </motion.span>
            </div>

            <motion.div
              className="text-sm font-bold text-white px-2 py-1 rounded-md bg-gradient-to-r from-primary to-accent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {xp} / {xpToNextLevel} XP
            </motion.div>
          </motion.div>

          <div className="xp-bar-container">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percentComplete}%` }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1,
                delay: 0.1
              }}
            />
          </div>

          {/* Level up indicator */}
          {percentComplete > 80 && (
            <motion.div
              className="absolute right-4 top-4 text-xs font-bold text-accent"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Almost there!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
