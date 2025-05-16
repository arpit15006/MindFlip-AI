"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

// Simpler static particles component
export function Particles() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const count = 20; // Number of particles

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate static particles
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  // Don't render particles until client-side
  if (!mounted) return null;

  // Determine the current theme safely
  const isDarkTheme = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${isDarkTheme ? 'bg-white/20' : 'bg-black/10'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
