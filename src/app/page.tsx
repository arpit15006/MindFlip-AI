"use client";
import { FlashcardSetManager } from "@/components/flashcards/FlashcardSetManager";
import { motion } from "framer-motion";
import { CanvasBackground } from "@/components/ui/canvas-background";
import { Brain, Sparkles } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <div className="container mx-auto relative">
      {/* Canvas-like background */}
      <CanvasBackground variant="gradient1" intensity="medium" />

      {/* Hero section */}
      <section className="mb-12">
        <motion.div
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <div className="relative">
              <Brain className="w-16 h-16 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary opacity-30 blur-lg rounded-full"
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
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your Flashcard Collections
          </motion.h1>

          <motion.p
            className="text-lg text-foreground/70 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Create, organize, and study your flashcards with our powerful learning tools
          </motion.p>
        </motion.div>
      </section>

      {/* Flashcard manager */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl opacity-30 -z-10"></div>
        <FlashcardSetManager />
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-40 right-10 text-primary/20"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <Sparkles className="w-24 h-24" />
      </motion.div>
    </div>
  );
}
