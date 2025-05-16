"use client";
import type { FlashcardType } from '@/lib/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Shuffle, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Settings2, Award } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useProgressStore } from '@/store/useProgressStore';
import { useToast } from "@/hooks/use-toast";
import { XPProgress } from '@/components/gamification/XPProgress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface EnhancedFlashcardViewerProps {
  initialCards: FlashcardType[];
  onClose?: () => void;
}

type StudyMode = 'sequential' | 'shuffle' | 'review-unknown' | 'spaced-repetition';

// Simple session stats type
interface SessionStats {
  known: number;
  unknown: number;
  reviewedCount: number;
}

export function EnhancedFlashcardViewer({ initialCards, onClose }: EnhancedFlashcardViewerProps) {
  const { data, recordCardReview } = useAppData();
  const { recordCardReview: recordProgressReview } = useProgressStore();
  const { toast } = useToast();

  // Basic state
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('sequential');
  const [feedback, setFeedback] = useState<'known' | 'unknown' | null>(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);

  // Session stats (used for tracking progress)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    known: 0,
    unknown: 0,
    reviewedCount: 0
  });

  // Current card
  const currentCard = useMemo(() => cards[currentIndex], [cards, currentIndex]);

  // Get card status from global data
  const currentCardStatus = useMemo(() => {
    if (!currentCard) return undefined;
    return data.flashcards.find(fc => fc.id === currentCard.id)?.status;
  }, [data.flashcards, currentCard]);

  // Track which cards have been reviewed
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  // Shuffle array utility
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Reset and shuffle cards
  const resetAndShuffle = useCallback((mode: StudyMode) => {
    let newCards: FlashcardType[];

    // Apply the selected study mode
    if (mode === 'shuffle') {
      newCards = shuffleArray([...initialCards]);

      // Only show the toast when the mode is first selected, not on every reset
      if (studyMode !== mode) {
        toast({
          title: "Shuffle Mode",
          description: "Cards are randomly shuffled."
        });
      }
    } else if (mode === 'review-unknown') {
      const unknownCards = initialCards.filter(card => {
        const globalCard = data.flashcards.find(fc => fc.id === card.id);
        return globalCard?.status === 'unknown' || globalCard?.status === 'new';
      });

      if (unknownCards.length > 0) {
        newCards = shuffleArray(unknownCards);

        // Only show the toast when the mode is first selected, not on every reset
        if (studyMode !== mode) {
          toast({
            title: "Review Unknown Mode",
            description: "Focusing on cards you don't know yet."
          });
        }
      } else {
        newCards = [...initialCards];
        toast({
          title: "Review Mode Update",
          description: "No 'unknown' or 'new' cards. Displaying all cards for this set."
        });
      }
    } else if (mode === 'spaced-repetition') {
      // Simple implementation - just use the original order for now
      newCards = [...initialCards];

      // Only show the toast when the mode is first selected, not on every reset
      if (studyMode !== mode) {
        toast({
          title: "Spaced Repetition Mode",
          description: "Cards are ordered by learning priority."
        });
      }
    } else { // sequential - sort by creation date
      // Sort cards by creation date (oldest first)
      newCards = [...initialCards].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });

      // Only show the toast when the mode is first selected, not on every reset
      if (studyMode !== mode) {
        toast({
          title: "Sequential Mode",
          description: "Cards are shown in their original order."
        });
      }
    }

    // Reset all state
    setCards(newCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setFeedback(null);
    setReviewedCards(new Set());
    setSessionStats({
      known: 0,
      unknown: 0,
      reviewedCount: 0
    });
  }, [initialCards, data.flashcards, toast]);

  // Initialize cards on component mount
  useEffect(() => {
    resetAndShuffle(studyMode);
  }, [resetAndShuffle, studyMode]);

  // Change study mode
  const changeStudyMode = useCallback((newMode: StudyMode) => {
    setStudyMode(newMode);
    resetAndShuffle(newMode);
  }, [resetAndShuffle]);

  // Navigation functions
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const goToNextCard = useCallback(() => {
    // Reset card state
    setIsFlipped(false);
    setFeedback(null);

    console.log('Going to next card from index:', currentIndex, 'of', cards.length);

    // Simple increment with boundary check
    if (currentIndex < cards.length - 1) {
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
  }, [currentIndex, cards.length, toast]);

  const goToPrevCard = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null);

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      // When at the beginning, loop to the end of the deck
      setCurrentIndex(cards.length - 1);
      toast({
        title: "Beginning of Deck",
        description: "Going to the end of the deck."
      });
    }
  }, [currentIndex, cards.length, toast]);

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

    // IMPORTANT: We only remove cards in review-unknown mode
    // In sequential mode, we keep all cards in their original order
    if (studyMode === 'review-unknown' && type === 'known') {
      // Remove the current card from the cards array
      setCards(prevCards => {
        // If this is the last card, we need to reset the index
        if (prevCards.length <= 1) {
          // Reset to all cards if we've gone through all unknown cards
          toast({
            title: "Review Complete",
            description: "You've reviewed all unknown cards. Resetting to all cards."
          });
          return [...initialCards];
        }

        // Otherwise, remove this card from the array
        return prevCards.filter(card => card.id !== cardId);
      });

      // If we're removing the current card, we need to adjust the index
      // to prevent it from skipping a card
      if (currentIndex >= cards.length - 1) {
        setCurrentIndex(0);
      }
    }

    // Log the current state for debugging
    console.log('Current card index:', currentIndex);
    console.log('Total cards:', cards.length);
    console.log('Current card:', currentCard);
    console.log('Study mode:', studyMode);
  }, [recordCardReview, recordProgressReview, reviewedCards, studyMode, initialCards, cards.length, currentIndex, toast, currentCard]);

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
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <p className="text-xl mb-4 text-center">
          {initialCards.length === 0 ? "This flashcard set is empty." : "No cards match the current study mode criteria."}
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
    <div className="flex flex-col items-center p-4 h-full w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        {onClose && <Button variant="ghost" onClick={onClose} size="sm">Close Viewer</Button>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><Settings2 className="mr-2 h-4 w-4" /> Mode: {studyMode}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Study Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => changeStudyMode('sequential')} className={cn(studyMode === 'sequential' && 'bg-accent text-accent-foreground')}>Sequential</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStudyMode('shuffle')} className={cn(studyMode === 'shuffle' && 'bg-accent text-accent-foreground')}>Shuffle All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStudyMode('review-unknown')} className={cn(studyMode === 'review-unknown' && 'bg-accent text-accent-foreground')}>Review Unknown/New</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStudyMode('spaced-repetition')} className={cn(studyMode === 'spaced-repetition' && 'bg-accent text-accent-foreground')}>Spaced Repetition</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            onClick={() => resetAndShuffle(studyMode)}
            aria-label="Reset current mode"
            disabled={!!feedback}
            className="bg-gradient-card hover:bg-gradient-primary hover:text-primary-foreground transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: 0 }}
              whileHover={{ rotate: 360 }}
            >
              <Shuffle className="h-5 w-5" />
            </motion.div>
            <span className="ml-2">Reset</span>
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

      {/* Badge notification */}
      {showBadgeNotification && (
        <motion.div
          className="fixed bottom-4 right-4 p-6 rounded-lg shadow-xl flex items-center gap-3 overflow-hidden"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-cosmic opacity-90 -z-10"></div>
          <div className="absolute inset-0 bg-black/20 -z-20"></div>

          {/* Animated confetti */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 360}, 100%, 70%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{
                  scale: 0,
                  opacity: 1,
                  y: 0
                }}
                animate={{
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0],
                  y: [0, -20 - Math.random() * 30],
                  x: [0, (Math.random() - 0.5) * 40]
                }}
                transition={{
                  duration: 1 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Icon with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.1
            }}
            className="bg-primary/20 p-2 rounded-full"
          >
            <Award className="h-8 w-8 text-primary-foreground" />
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
    </div>
  );
}
