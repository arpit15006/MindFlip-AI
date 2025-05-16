
"use client";
import type { FlashcardType, FlashcardStatus } from '@/lib/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shuffle, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Settings2 } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface FlashcardViewerProps {
  initialCards: FlashcardType[];
  onClose?: () => void;
}

type StudyMode = 'sequential' | 'shuffle' | 'review-unknown';

export function FlashcardViewer({ initialCards, onClose }: FlashcardViewerProps) {
  const { data, recordCardReview } = useAppData();
  const { toast } = useToast();

  // sessionInitialCards stores the set of cards for the current study session.
  // It only updates if the underlying set of card IDs changes.
  const [sessionInitialCards, setSessionInitialCards] = useState<FlashcardType[]>(initialCards);
  
  // Create a stable string of IDs from the initialCards prop to detect actual changes in the set of cards.
  const initialCardIdsString = useMemo(() => initialCards.map(c => c.id).sort().join(','), [initialCards]);

  useEffect(() => {
    // Update sessionInitialCards only when the actual set of cards (by ID) from props changes.
    setSessionInitialCards(initialCards);
  }, [initialCardIdsString, initialCards]);


  const [cards, setCards] = useState<FlashcardType[]>([]); // Current cards being studied, derived from sessionInitialCards and mode
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('sequential');
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0, reviewedCount: 0 });
  const [feedback, setFeedback] = useState<'known' | 'unknown' | null>(null);

  const currentCard = useMemo(() => cards[currentIndex], [cards, currentIndex]);
  
  const globalCardData = useMemo(() => data.flashcards.find(fc => fc.id === currentCard?.id), [data.flashcards, currentCard]);
  const currentGlobalStatus = globalCardData?.status;


  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const resetAndShuffle = useCallback((mode: StudyMode) => {
    // Uses `sessionInitialCards` (stable unless card ID set changes)
    // and `data.flashcards` (for up-to-date statuses for filtering).
    let cardsToStudyFromSession = [...sessionInitialCards];
    let newCardsForSession: FlashcardType[];

    if (mode === 'shuffle') {
      newCardsForSession = shuffleArray(cardsToStudyFromSession);
    } else if (mode === 'review-unknown') {
      newCardsForSession = shuffleArray(
        cardsToStudyFromSession.filter(propCard => {
          const globalCard = data.flashcards.find(fc => fc.id === propCard.id); // Uses latest global data
          return globalCard?.status === 'unknown' || globalCard?.status === 'new';
        })
      );
      if (newCardsForSession.length === 0 && cardsToStudyFromSession.length > 0) {
        newCardsForSession = cardsToStudyFromSession; // Fallback to all cards
        toast({ title: "Review Mode Update", description: "No 'unknown' or 'new' cards. Displaying all cards for this set."});
      } else if (newCardsForSession.length === 0 && cardsToStudyFromSession.length === 0) {
        // This means sessionInitialCards was empty. Handled by the main "No cards" message.
      }
    } else { // 'sequential' mode
      newCardsForSession = cardsToStudyFromSession;
    }
    
    setCards(newCardsForSession);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ known: 0, unknown: 0, reviewedCount: 0 });
  }, [sessionInitialCards, data.flashcards, toast]); // `toast` is stable

  useEffect(() => {
    // This effect runs when studyMode or sessionInitialCards (the stable set for the session) changes.
    // `resetAndShuffle`'s identity changes if `sessionInitialCards` or `data.flashcards` changes.
    // We want this to re-run if the *identity* of resetAndShuffle changes due to its dependencies.
    resetAndShuffle(studyMode);
  }, [studyMode, sessionInitialCards, resetAndShuffle]);


  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const goToNextCard = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null); // Clear feedback when manually navigating
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Optionally, toast when looping or finished
      // toast({ title: "End of set", description: "You've reviewed all cards in this mode." });
      setCurrentIndex(0); // Loop for now
    }
  }, [currentIndex, cards.length]);
  
  const goToPrevCard = useCallback(() => {
    setIsFlipped(false);
    setFeedback(null); // Clear feedback when manually navigating
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(cards.length - 1); // Loop to end
    }
  }, [currentIndex, cards.length]);


  const handleKnow = () => {
    if (currentCard) {
      setFeedback('known');
      recordCardReview(currentCard.id, 'known');
      setSessionStats(s => ({ ...s, known: s.known + 1, reviewedCount: s.reviewedCount + 1 }));
      setTimeout(() => {
        setFeedback(null); // Clear visual feedback
        goToNextCard();    // Then go to next
      }, 300);
    }
  };

  const handleDontKnow = () => {
    if (currentCard) {
      setFeedback('unknown');
      recordCardReview(currentCard.id, 'unknown');
      setSessionStats(s => ({ ...s, unknown: s.unknown + 1, reviewedCount: s.reviewedCount + 1 }));
      setTimeout(() => {
        setFeedback(null); // Clear visual feedback
        goToNextCard();    // Then go to next
      }, 300);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentCard || feedback) return; // Ignore keydown if feedback animation is active
      switch (event.key) {
        case ' ': event.preventDefault(); handleFlip(); break;
        case 'ArrowRight': goToNextCard(); break;
        case 'ArrowLeft': goToPrevCard(); break;
        case 'k': case 'Enter': handleKnow(); break;
        case 'd': case 'Backspace': handleDontKnow(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, feedback, handleFlip, goToNextCard, goToPrevCard, handleKnow, handleDontKnow]);


  if (cards.length === 0) {
    // This covers cases where initialCards was empty, or filtering resulted in no cards for the mode.
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <p className="text-xl mb-4 text-center">
          {sessionInitialCards.length === 0 ? "This flashcard set is empty." : "No cards match the current study mode criteria."}
        </p>
        {onClose && <Button onClick={onClose}>Back to Sets</Button>}
      </div>
    );
  }
  
  if (!currentCard) {
     // This might happen briefly if cards is populated slightly after initial render
     return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-xl mb-4">Loading cards...</p>
         {onClose && <Button onClick={onClose}>Back to Sets</Button>}
      </div>
    );
  }

  const progressPercentage = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

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
            <DropdownMenuItem onClick={() => setStudyMode('sequential')} className={cn(studyMode === 'sequential' && 'bg-accent text-accent-foreground')}>Sequential</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStudyMode('shuffle')} className={cn(studyMode === 'shuffle' && 'bg-accent text-accent-foreground')}>Shuffle All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStudyMode('review-unknown')} className={cn(studyMode === 'review-unknown' && 'bg-accent text-accent-foreground')}>Review Unknown/New</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Flashcard
        frontContent={currentCard.front}
        backContent={currentCard.back}
        isFlipped={isFlipped}
        onClick={handleFlip}
        status={currentGlobalStatus} // Display fresh status from global data
        className={cn(
            "mb-6 flex-grow w-full transition-all duration-200",
            feedback === 'known' && 'ring-4 ring-green-500 ring-offset-2 ring-offset-background',
            feedback === 'unknown' && 'ring-4 ring-destructive ring-offset-2 ring-offset-background'
        )}
      />
      
      <div className="w-full mb-4">
        <Progress value={progressPercentage} className="w-full h-2" />
        <p className="text-sm text-muted-foreground text-center mt-1">{currentIndex + 1} / {cards.length}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <Button variant="destructive" size="lg" onClick={handleDontKnow} disabled={!!feedback}>
          <XCircle className="mr-2 h-5 w-5" /> Don't Know
        </Button>
        <Button 
          variant="default" 
          size="lg" 
          onClick={handleKnow} 
          className="bg-green-600 hover:bg-green-700 text-primary-foreground focus-visible:ring-green-500"
          disabled={!!feedback}
        >
          <CheckCircle2 className="mr-2 h-5 w-5" /> Know
        </Button>
      </div>

      <div className="flex justify-center items-center gap-4 w-full">
        <Button variant="outline" onClick={goToPrevCard} aria-label="Previous card" disabled={!!feedback}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={handleFlip} aria-label="Flip card" disabled={!!feedback}>
          <RotateCcw className="h-5 w-5" /> Flip
        </Button>
         <Button variant="outline" onClick={() => resetAndShuffle(studyMode)} aria-label="Reset current mode" disabled={!!feedback}>
          <Shuffle className="h-5 w-5" /> Reset Deck
        </Button>
        <Button variant="outline" onClick={goToNextCard} aria-label="Next card" disabled={!!feedback}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Session: {sessionStats.reviewedCount} reviewed ({sessionStats.known} known, {sessionStats.unknown} unknown)
      </div>
    </div>
  );
}

