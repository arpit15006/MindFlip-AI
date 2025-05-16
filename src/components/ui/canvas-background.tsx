"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface CanvasBackgroundProps {
  variant?: 'default' | 'gradient1' | 'gradient2' | 'gradient3';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export function CanvasBackground({
  variant = 'default',
  intensity = 'medium',
  animated = true,
  className = '',
}: CanvasBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);

    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Handle window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'low': return isDark ? 0.05 : 0.02;
      case 'high': return isDark ? 0.15 : 0.08;
      default: return isDark ? 0.1 : 0.05;
    }
  };

  // Get gradient based on variant
  const getGradient = () => {
    switch (variant) {
      case 'gradient1':
        return 'bg-gradient-ocean';
      case 'gradient2':
        return 'bg-gradient-sunset';
      case 'gradient3':
        return 'bg-gradient-fire';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
      {/* Base gradient */}
      <div
        className={`absolute inset-0 ${getGradient()}`}
        style={{ opacity: getOpacity() }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.5
        }}
      />

      {/* Animated elements - only render on client side */}
      {animated && isMounted && (
        <>
          {/* Floating circles */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(70, 167, 179, 0.1) 0%, rgba(70, 167, 179, 0) 70%)'
                : 'radial-gradient(circle, rgba(70, 167, 179, 0.05) 0%, rgba(70, 167, 179, 0) 70%)',
              top: '10%',
              left: '5%'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(148, 179, 0, 0.1) 0%, rgba(148, 179, 0, 0) 70%)'
                : 'radial-gradient(circle, rgba(148, 179, 0, 0.05) 0%, rgba(148, 179, 0, 0) 70%)',
              bottom: '5%',
              right: '10%'
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />

          {/* Animated lines - only render on client side */}
          {isMounted && (
            <svg className="absolute inset-0 w-full h-full">
              <motion.path
                d={`M0,${dimensions.height * 0.3} C${dimensions.width * 0.3},${dimensions.height * 0.1} ${dimensions.width * 0.6},${dimensions.height * 0.5} ${dimensions.width},${dimensions.height * 0.4}`}
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"}
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "loop", repeatDelay: 2 }}
              />

              <motion.path
                d={`M0,${dimensions.height * 0.7} C${dimensions.width * 0.4},${dimensions.height * 0.9} ${dimensions.width * 0.7},${dimensions.height * 0.6} ${dimensions.width},${dimensions.height * 0.8}`}
                stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"}
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "loop", repeatDelay: 1, delay: 2 }}
              />
            </svg>
          )}
        </>
      )}
    </div>
  );
}
