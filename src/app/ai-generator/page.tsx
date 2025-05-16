"use client";
import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";
import { motion } from "framer-motion";

export default function AIGeneratorPage() {
  return (
    <div className="container mx-auto py-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-aurora opacity-10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-ocean-deep opacity-10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI-Powered Flashcard Generator
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="animated-border-glow"
        >
          <AIGeneratorForm />
        </motion.div>
      </motion.div>
    </div>
  );
}
