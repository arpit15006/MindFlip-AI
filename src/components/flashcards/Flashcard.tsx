
"use client";
import type { HTMLAttributes } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { FlashcardStatus } from '@/lib/types';

interface FlashcardProps extends HTMLAttributes<HTMLDivElement> {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  status?: FlashcardStatus;
  feedback?: 'known' | 'unknown' | null;
}

export function Flashcard({ frontContent, backContent, isFlipped, className, status, feedback, ...props }: FlashcardProps) {
  return (
    <div
      className={cn(
        "relative w-full h-64 perspective cursor-pointer rounded-lg shadow-xl hover-scale",
        feedback === 'known' && "ring-4 ring-green-500 ring-offset-2 ring-offset-background",
        feedback === 'unknown' && "ring-4 ring-destructive ring-offset-2 ring-offset-background",
        className
      )}
      {...props}
    >
      {/* Status indicator */}
      {status && (
        <div
          className={cn(
            "absolute top-2.5 right-2.5 w-3 h-3 rounded-full z-10 shadow animate-pulse-slow",
            status === 'known' && "bg-green-500",
            status === 'unknown' && "bg-destructive",
            status === 'new' && "bg-primary"
          )}
          title={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
        />
      )}

      {/* Front of card */}
      <Card
        className={cn(
          "absolute inset-0 w-full h-full glassmorphism-intense transition-opacity duration-300",
          isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <CardContent className="flex items-center justify-center h-full p-6 text-center">
          <div className="text-xl md:text-2xl font-medium">{frontContent}</div>
        </CardContent>
      </Card>

      {/* Back of card */}
      <Card
        className={cn(
          "absolute inset-0 w-full h-full glassmorphism-intense transition-opacity duration-300",
          isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <CardContent className="flex items-center justify-center h-full p-6 text-center">
          <div className="text-lg md:text-xl">{backContent}</div>
        </CardContent>
      </Card>

      {/* Decorative elements for visual appeal */}
      <div className="absolute -inset-0.5 bg-gradient-cosmic rounded-lg opacity-20 blur-sm -z-10"></div>
      <div className="absolute -inset-1 bg-gradient-neon rounded-lg opacity-10 blur-md -z-20 animate-pulse-slow"></div>

      {/* Animated border effect */}
      <div className="absolute -inset-0.5 rounded-lg opacity-30 -z-10 animated-border"></div>
    </div>
  );
}
