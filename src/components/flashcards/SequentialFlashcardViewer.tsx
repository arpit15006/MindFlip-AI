"use client";
import type { FlashcardType } from '@/lib/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useProgressStore } from '@/store/useProgressStore';
import { useToast } from "@/hooks/use-toast";
import { XPProgress } from '@/components/gamification/XPProgress';
import { cn } from '@/lib/utils';

interface SequentialFlashcardViewerProps {
  initialCards: FlashcardType[];
  onClose?: () => void;
}

// Simple session stats type
interface SessionStats {
  known: number;
  unknown: number;
  reviewedCount: number;
}

export function SequentialFlashcardViewer({ initialCards, onClose }: SequentialFlashcardViewerProps) {
  const { data, recordCardReview } = useAppData();
  const { recordCardReview: recordProgressReview } = useProgressStore();
  const { toast } = useToast();

  // Basic state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<'known' | 'unknown' | null>(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);

  // Session stats (used for tracking progress)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    known: 0,
    unknown: 0,
    reviewedCount: 0
  });

  // Sort cards by creation date (oldest first)
  const sortedCards = useMemo(() => {
    return [...initialCards].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  }, [initialCards]);

  // Current card
  const currentCard = useMemo(() => sortedCards[currentIndex], [sortedCards, currentIndex]);

  // Get card status from global data
  const currentCardStatus = useMemo(() => {
    if (!currentCard) return undefined;
    return data.flashcards.find(fc => fc.id === currentCard.id)?.status;
  }, [data.flashcards, currentCard]);

  // Track which cards have been reviewed
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  // Track previously earned badges to detect new ones
  const [previouslyEarnedBadgeCount, setPreviouslyEarnedBadgeCount] = useState(() => {
    // Initialize with the current count of earned badges
    const { progress } = useProgressStore.getState();
    return progress.badges.filter(badge => badge.earned).length;
  });

  // Check for new badges - only show notification if a new badge was earned
  const checkForNewBadges = useCallback(() => {
    const { progress } = useProgressStore.getState();
    const earnedBadges = progress.badges.filter(badge => badge.earned);

    // Only show notification if the number of earned badges has increased
    if (earnedBadges.length > previouslyEarnedBadgeCount) {
      console.log(`New badge earned! Previous: ${previouslyEarnedBadgeCount}, Current: ${earnedBadges.length}`);
      setShowBadgeNotification(true);
      setTimeout(() => setShowBadgeNotification(false), 3000);

      // Update the count of previously earned badges
      setPreviouslyEarnedBadgeCount(earnedBadges.length);
    }
  }, [previouslyEarnedBadgeCount]);

  // Handle flipping the card
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Go to next card
  const goToNextCard = useCallback(() => {
    // Reset card state
    setIsFlipped(false);
    setFeedback(null);

    console.log('Going to next card from index:', currentIndex, 'of', sortedCards.length);

    // Simple increment with boundary check
    if (currentIndex < sortedCards.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('Moving to next card at index:', nextIndex);
      setCurrentIndex(nextIndex);
    } else {
      // When we reach the end of the deck, loop back to the beginning
      console.log('Reached end of deck, looping back to index 0');
      setCurrentIndex(0);
      toast({
        title: "End of Deck",
        description: "Starting from the beginning of the deck."
      });
    }
  }, [currentIndex, sortedCards.length, toast]);

  // Go to previous card
  const goToPrevCard = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null);

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      // When at the beginning, loop to the end of the deck
      setCurrentIndex(sortedCards.length - 1);
      toast({
        title: "Beginning of Deck",
        description: "Going to the end of the deck."
      });
    }
  }, [currentIndex, sortedCards.length, toast]);

  // Handle card review
  const handleCardReview = useCallback((cardId: string, type: 'known' | 'unknown') => {
    // Check if this card has already been reviewed
    const alreadyReviewed = reviewedCards.has(cardId);

    // Only update the reviewedCount if this is a new card
    setSessionStats(prev => {
      const newStats = {
        ...prev,
        [type]: prev[type] + 1,
        // Only increment reviewedCount if this is a new card
        reviewedCount: alreadyReviewed ? prev.reviewedCount : prev.reviewedCount + 1
      };

      return newStats;
    });

    // Add to reviewed cards set (if not already there)
    if (!alreadyReviewed) {
      setReviewedCards(prev => {
        const newSet = new Set(prev);
        newSet.add(cardId);
        return newSet;
      });
    }

    // Record in global state
    recordCardReview(cardId, type);
    recordProgressReview(type === 'known');

    // Log the current state for debugging
    console.log('Current card index:', currentIndex);
    console.log('Total cards:', sortedCards.length);
    console.log('Current card:', currentCard);
  }, [recordCardReview, recordProgressReview, reviewedCards, currentIndex, sortedCards.length, currentCard]);

  // Button handlers
  const handleKnow = useCallback(() => {
    if (currentCard) {
      console.log('Marking card as known:', currentCard.id, 'at index:', currentIndex);
      setFeedback('known');
      handleCardReview(currentCard.id, 'known');
      checkForNewBadges();

      setTimeout(() => {
        console.log('Timeout completed, going to next card from index:', currentIndex);
        setFeedback(null);
        goToNextCard();
      }, 500);
    }
  }, [currentCard, handleCardReview, checkForNewBadges, goToNextCard, currentIndex]);

  const handleDontKnow = useCallback(() => {
    if (currentCard) {
      console.log('Marking card as unknown:', currentCard.id, 'at index:', currentIndex);
      setFeedback('unknown');
      handleCardReview(currentCard.id, 'unknown');
      checkForNewBadges();

      setTimeout(() => {
        console.log('Timeout completed, going to next card from index:', currentIndex);
        setFeedback(null);
        goToNextCard();
      }, 500);
    }
  }, [currentCard, handleCardReview, checkForNewBadges, goToNextCard, currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentCard || feedback) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handleFlip();
          break;
        case 'ArrowRight':
          goToNextCard();
          break;
        case 'ArrowLeft':
          goToPrevCard();
          break;
        case 'k':
        case 'Enter':
          handleKnow();
          break;
        case 'd':
        case 'Backspace':
          handleDontKnow();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, feedback, handleFlip, goToNextCard, goToPrevCard, handleKnow, handleDontKnow]);

  // Loading states
  if (sortedCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <p className="text-xl mb-4 text-center">
          This flashcard set is empty.
        </p>
        {onClose && <Button onClick={onClose}>Back to Sets</Button>}
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-xl mb-4">Loading cards...</p>
        {onClose && <Button onClick={onClose}>Back to Sets</Button>}
      </div>
    );
  }

  // Calculate progress
  const totalCards = initialCards.length;
  const reviewedCount = reviewedCards.size;
  const progressPercentage = totalCards > 0 ? Math.min((reviewedCount / totalCards) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center p-4 h-full w-full max-w-2xl mx-auto relative">
      {/* Achievement notification */}
      {showBadgeNotification && (
        <motion.div
          className="absolute top-4 right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {/* Trophy icon with animation */}
          <motion.div
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 1 }}
          >
            🏆
          </motion.div>

          {/* Text with animation */}
          <div className="flex flex-col">
            <motion.span
              className="text-primary-foreground font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Achievement Unlocked!
            </motion.span>
            <motion.span
              className="text-primary-foreground/80 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              New badge earned! Check your profile.
            </motion.span>
          </div>
        </motion.div>
      )}

      <div className="w-full flex justify-between items-center mb-4">
        {onClose && <Button variant="ghost" onClick={onClose} size="sm">Close Viewer</Button>}
        <div className="text-sm text-muted-foreground">
          Sequential Mode: Card {currentIndex + 1} of {sortedCards.length}
        </div>
      </div>

      <div className="w-full mb-4">
        <XPProgress />
      </div>

      <Flashcard
        frontContent={currentCard.front}
        backContent={currentCard.back}
        isFlipped={isFlipped}
        onClick={handleFlip}
        status={currentCardStatus}
        className="mb-6 flex-grow w-full"
        feedback={feedback}
      />

      <div className="w-full mb-4">
        <Progress value={progressPercentage} className="w-full h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant="destructive"
            size="lg"
            onClick={handleDontKnow}
            disabled={!!feedback}
            className="w-full h-14 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: feedback === 'unknown' ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <XCircle className="mr-2 h-5 w-5" />
              </motion.div>
              <span className="font-medium">Don't Know</span>
            </div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant="default"
            size="lg"
            onClick={handleKnow}
            className="w-full h-14 relative overflow-hidden group bg-green-600 hover:bg-green-700 text-primary-foreground focus-visible:ring-green-500"
            disabled={!!feedback}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: feedback === 'known' ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
              </motion.div>
              <span className="font-medium">Know</span>
            </div>
          </Button>
        </motion.div>
      </div>

      <div className="flex justify-center items-center gap-4 w-full">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            onClick={goToPrevCard}
            aria-label="Previous card"
            disabled={!!feedback}
            className="bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            onClick={handleFlip}
            aria-label="Flip card"
            disabled={!!feedback}
            className="bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <RotateCcw className="h-5 w-5" />
            </motion.div>
            <span className="ml-2">Flip</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            onClick={goToNextCard}
            aria-label="Next card"
            disabled={!!feedback}
            className="bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
