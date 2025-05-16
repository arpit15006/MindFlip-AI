
// Using 'use client' for context and hooks that interact with localStorage
"use client";
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { AppData, FlashcardSetType, FlashcardType, NewFlashcard, NewFlashcardSet, FlashcardStatus, DailyActivity } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed: npm install uuid @types/uuid

interface AppDataContextType {
  data: AppData;
  addFlashcardSet: (set: NewFlashcardSet) => FlashcardSetType;
  updateFlashcardSet: (setId: string, updates: Partial<Omit<FlashcardSetType, 'id'>>) => void;
  deleteFlashcardSet: (setId: string) => void;
  addFlashcard: (card: NewFlashcard) => FlashcardType;
  addMultipleFlashcards: (cards: NewFlashcard[]) => void;
  updateFlashcard: (cardId: string, updates: Partial<Omit<FlashcardType, 'id'>>) => void;
  deleteFlashcard: (cardId: string) => void;
  getFlashcardsBySetId: (setId: string) => FlashcardType[];
  recordCardReview: (cardId: string, status: FlashcardStatus) => void;
  importData: (importedData: AppData) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialAppData: AppData = {
  flashcardSets: [],
  flashcards: [],
  stats: {
    dailyActivity: [],
  },
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<AppData>('synapseSparkData', initialAppData);

  const addFlashcardSet = (set: NewFlashcardSet): FlashcardSetType => {
    const newSet: FlashcardSetType = { ...set, id: uuidv4(), createdAt: new Date().toISOString() };
    setData(prevData => ({
      ...prevData,
      flashcardSets: [...prevData.flashcardSets, newSet],
    }));
    return newSet;
  };

  const updateFlashcardSet = (setId: string, updates: Partial<Omit<FlashcardSetType, 'id'>>) => {
    setData(prevData => ({
      ...prevData,
      flashcardSets: prevData.flashcardSets.map(s => s.id === setId ? { ...s, ...updates } : s),
    }));
  };

  const deleteFlashcardSet = (setId: string) => {
    setData(prevData => ({
      ...prevData,
      flashcardSets: prevData.flashcardSets.filter(s => s.id !== setId),
      flashcards: prevData.flashcards.filter(fc => fc.setId !== setId), // Also delete associated flashcards
    }));
  };

  const addFlashcard = (card: NewFlashcard): FlashcardType => {
    const newCard: FlashcardType = {
      ...card,
      id: uuidv4(),
      status: 'new',
      createdAt: new Date().toISOString(),
      lastReviewed: undefined,
    };
    setData(prevData => ({
      ...prevData,
      flashcards: [...prevData.flashcards, newCard],
    }));
    return newCard;
  };

  const addMultipleFlashcards = (newCardsData: NewFlashcard[]) => {
    const newFlashcards: FlashcardType[] = newCardsData.map(cardData => ({
      ...cardData,
      id: uuidv4(),
      status: 'new' as FlashcardStatus,
      createdAt: new Date().toISOString(),
      lastReviewed: undefined,
    }));
    setData(prevData => ({
      ...prevData,
      flashcards: [...prevData.flashcards, ...newFlashcards],
    }));
  };

  const updateFlashcard = (cardId: string, updates: Partial<Omit<FlashcardType, 'id'>>) => {
    setData(prevData => ({
      ...prevData,
      flashcards: prevData.flashcards.map(fc => fc.id === cardId ? { ...fc, ...updates } : fc),
    }));
  };

  const deleteFlashcard = (cardId: string) => {
    setData(prevData => ({
      ...prevData,
      flashcards: prevData.flashcards.filter(fc => fc.id !== cardId),
    }));
  };

  const getFlashcardsBySetId = (setId: string): FlashcardType[] => {
    return data.flashcards.filter(fc => fc.setId === setId);
  };

  const recordCardReview = (cardId: string, status: FlashcardStatus) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log(`Recording review for card ${cardId} with status ${status}`);

    setData(prevData => {
      // Update the flashcard status
      const updatedFlashcards = prevData.flashcards.map(fc =>
        fc.id === cardId ? { ...fc, status, lastReviewed: new Date().toISOString() } : fc
      );

      // Update daily activity tracking
      let updatedDailyActivity = [...prevData.stats.dailyActivity];
      const todayActivityIndex = updatedDailyActivity.findIndex(activity => activity.date === today);

      if (todayActivityIndex > -1) {
        const currentActivity = updatedDailyActivity[todayActivityIndex];
        const flashcardIdsReviewed = new Set(currentActivity.flashcardIdsReviewed);

        // Only count as a new review if this card hasn't been reviewed today
        if (!flashcardIdsReviewed.has(cardId)) {
            flashcardIdsReviewed.add(cardId);
            const updatedActivity = {
                ...currentActivity,
                cardsReviewed: currentActivity.cardsReviewed + 1,
                flashcardIdsReviewed: Array.from(flashcardIdsReviewed),
            };
            updatedDailyActivity[todayActivityIndex] = updatedActivity;
            console.log(`Updated today's activity: ${updatedActivity.cardsReviewed} cards reviewed`);
        } else {
            console.log(`Card ${cardId} already reviewed today, not incrementing count`);
        }
      } else {
        // First review of the day
        const newActivity = {
          date: today,
          cardsReviewed: 1,
          flashcardIdsReviewed: [cardId],
        };
        updatedDailyActivity.push(newActivity);
        console.log(`Created new activity for today with 1 card reviewed`);
      }

      // Create the updated data object
      const updatedData = {
        ...prevData,
        flashcards: updatedFlashcards,
        stats: {
          ...prevData.stats,
          dailyActivity: updatedDailyActivity,
        },
      };

      // Log the updated stats for debugging
      const todayActivityAfterUpdate = updatedData.stats.dailyActivity.find(act => act.date === today);
      if (todayActivityAfterUpdate) {
        console.log(`After update: ${todayActivityAfterUpdate.cardsReviewed} cards reviewed today`);
      }

      // Return the updated data
      return updatedData;
    });
  };

  const importData = (importedData: AppData) => {
    // Basic validation could be added here
    if (importedData && importedData.flashcardSets && importedData.flashcards && importedData.stats) {
      setData(importedData);
    } else {
      console.error("Imported data is not in the expected format.");
      // Potentially show a toast notification for error
    }
  };

  // useMemo to prevent re-renders if data/setData haven't changed
  const contextValue = useMemo(() => ({
    data,
    addFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    addFlashcard,
    addMultipleFlashcards,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsBySetId,
    recordCardReview,
    importData,
  }), [data, setData]); // setData is stable from useLocalStorage

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
