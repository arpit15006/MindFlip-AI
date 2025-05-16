"use client";
import { StatsDashboardClient } from "@/components/stats/StatsDashboardClient";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="container mx-auto py-8 relative">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-gradient-ocean opacity-10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-40 left-10 w-56 h-56 bg-gradient-sunset opacity-10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
          <div className="relative mr-3">
            <BarChart3 className="h-7 w-7 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary opacity-30 blur-md rounded-full animate-pulse-slow"></div>
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Learning Progress
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="animated-border-glow"
        >
          <StatsDashboardClient />
        </motion.div>
      </motion.div>
    </div>
  );
}
