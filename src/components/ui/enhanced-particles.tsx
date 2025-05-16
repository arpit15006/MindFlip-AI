"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export function EnhancedParticles() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const particleCount = 30; // Increased number of particles
  const lineCount = 15; // Number of connecting lines

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate particles with more properties
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1
  }));

  // Generate connecting lines between random particles
  const lines = Array.from({ length: lineCount }).map((_, i) => {
    const startParticle = particles[Math.floor(Math.random() * particles.length)];
    const endParticle = particles[Math.floor(Math.random() * particles.length)];
    return {
      id: i,
      startX: startParticle.x,
      startY: startParticle.y,
      endX: endParticle.x,
      endY: endParticle.y,
      opacity: Math.random() * 0.15 + 0.05,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    };
  });

  // Don't render particles until client-side
  if (!mounted) return null;

  // Determine the current theme safely
  const isDarkTheme = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Canvas-like grid pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: isDarkTheme 
            ? 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          className={`absolute w-[500px] h-[500px] rounded-full ${isDarkTheme ? 'bg-primary/5' : 'bg-primary/5'} blur-[100px]`}
          style={{ top: '10%', left: '5%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className={`absolute w-[600px] h-[600px] rounded-full ${isDarkTheme ? 'bg-accent/5' : 'bg-accent/5'} blur-[120px]`}
          style={{ bottom: '5%', right: '10%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line) => (
          <motion.line
            key={`line-${line.id}`}
            x1={`${line.startX}%`}
            y1={`${line.startY}%`}
            x2={`${line.endX}%`}
            y2={`${line.endY}%`}
            stroke={isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: line.opacity,
              x1: [`${line.startX}%`, `${line.startX + (Math.random() * 5 - 2.5)}%`],
              y1: [`${line.startY}%`, `${line.startY + (Math.random() * 5 - 2.5)}%`],
              x2: [`${line.endX}%`, `${line.endX + (Math.random() * 5 - 2.5)}%`],
              y2: [`${line.endY}%`, `${line.endY + (Math.random() * 5 - 2.5)}%`],
            }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: line.delay
            }}
          />
        ))}
      </svg>
      
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className={`absolute rounded-full ${isDarkTheme ? 'bg-white' : 'bg-black'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5]
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
