"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Layers, Sparkles, BarChart3, User, Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { OnboardingButton } from '@/components/onboarding/OnboardingProvider';

const navItems = [
  { href: '/', label: 'Flashcards', icon: Layers },
  { href: '/ai-generator', label: 'AI Generator', icon: Sparkles },
  { href: '/stats', label: 'Statistics', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
];

export function TopNavigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-background/80 backdrop-blur-md shadow-md' : 'py-4'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Brain className="w-8 h-8 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary opacity-30 blur-md rounded-full animate-pulse-slow"></div>
          </div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            MindFlip-AI
          </motion.h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                pathname === item.href
                  ? 'text-primary font-medium'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.div>

              {pathname === item.href && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  layoutId="activeNavIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <OnboardingButton />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-t"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container mx-auto py-4 px-4 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-background/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t">
              <OnboardingButton />
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
