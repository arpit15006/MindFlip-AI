"use client";
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FlashcardStatus } from '@/lib/types';

interface AnimatedFlashcardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  status?: FlashcardStatus;
  onClick?: () => void;
  className?: string;
  feedback?: 'known' | 'unknown' | null;
}

export function AnimatedFlashcard({
  frontContent,
  backContent,
  isFlipped,
  status,
  onClick,
  className,
  feedback
}: AnimatedFlashcardProps) {
  // Define variants for the feedback animation with more dramatic effects
  const feedbackVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
    },
    known: {
      scale: [1, 1.08, 1],
      boxShadow: [
        "0 8px 32px rgba(0, 0, 0, 0.1)",
        "0 0 30px 15px rgba(73, 255, 73, 0.4)",
        "0 8px 32px rgba(0, 0, 0, 0.1)"
      ],
      transition: {
        duration: 0.8,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    },
    unknown: {
      scale: [1, 0.92, 1],
      boxShadow: [
        "0 8px 32px rgba(0, 0, 0, 0.1)",
        "0 0 30px 15px rgba(255, 73, 73, 0.4)",
        "0 8px 32px rgba(0, 0, 0, 0.1)"
      ],
      transition: {
        duration: 0.8,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    }
  };

  // Define hover animation
  const hoverAnimation = {
    scale: 1.02,
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  return (
    <motion.div
      className={cn(
        "relative w-full h-64 perspective cursor-pointer rounded-lg bg-card/80",
        className
      )}
      onClick={onClick}
      variants={feedbackVariants}
      animate={feedback || "initial"}
      whileHover={!feedback ? hoverAnimation : undefined}
      initial={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative elements for visual appeal */}
      <div className="absolute -inset-0.5 bg-gradient-cosmic rounded-lg opacity-20 blur-sm -z-10"></div>
      <div className="absolute -inset-1 bg-gradient-neon rounded-lg opacity-10 blur-md -z-20 animate-pulse-slow"></div>

      {status && (
        <motion.div
          className={cn(
            "absolute top-2.5 right-2.5 w-4 h-4 rounded-full z-10 shadow-lg",
            status === 'known' && "bg-green-500",
            status === 'unknown' && "bg-destructive",
            status === 'new' && "bg-primary"
          )}
          title={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
            delay: 0.2
          }}
        />
      )}

      {/* Using a simpler approach with CSS transitions instead of 3D transforms */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Card
          className={cn(
            "absolute inset-0 w-full h-full glassmorphism-intense bg-card transition-opacity duration-300",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <CardContent className="flex items-center justify-center h-full p-6 text-center overflow-auto">
            <motion.div
              className="text-xl md:text-2xl font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {frontContent}
            </motion.div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "absolute inset-0 w-full h-full glassmorphism-intense bg-card transition-opacity duration-300",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
        >
          <CardContent className="flex items-center justify-center h-full p-6 text-center overflow-auto">
            <motion.div
              className="text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {backContent}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
