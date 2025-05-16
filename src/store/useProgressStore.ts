"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
  streakDays: number;
  lastStudyDate?: string;
  cardsReviewed: number;
  cardsKnown: number;
  badges: Badge[];
}

interface ProgressStore {
  progress: UserProgress;
  addXp: (amount: number) => void;
  updateStreak: () => void;
  recordCardReview: (isKnown: boolean) => void;
  checkForBadges: () => void;
  resetProgress: () => void;
}

// Calculate XP needed for next level using a simple formula
const calculateXpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Initial badges
const initialBadges: Badge[] = [
  {
    id: 'first-review',
    name: 'First Steps',
    description: 'Review your first flashcard',
    icon: '🎯',
    earned: false,
  },
  {
    id: 'ten-cards',
    name: 'Getting Started',
    description: 'Review 10 flashcards',
    icon: '🔟',
    earned: false,
  },
  {
    id: 'fifty-cards',
    name: 'Dedicated Learner',
    description: 'Review 50 flashcards',
    icon: '🧠',
    earned: false,
  },
  {
    id: 'hundred-cards',
    name: 'Knowledge Master',
    description: 'Review 100 flashcards',
    icon: '🏆',
    earned: false,
  },
  {
    id: 'three-day-streak',
    name: 'Consistent',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    earned: false,
  },
  {
    id: 'seven-day-streak',
    name: 'Dedicated',
    description: 'Maintain a 7-day study streak',
    icon: '⚡',
    earned: false,
  },
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    earned: false,
  },
  {
    id: 'level-10',
    name: 'Learning Expert',
    description: 'Reach level 10',
    icon: '🌟',
    earned: false,
  },
];

// Initial state
const initialState: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: calculateXpForLevel(1),
  totalXpEarned: 0,
  streakDays: 0,
  cardsReviewed: 0,
  cardsKnown: 0,
  badges: initialBadges,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: initialState,
      
      addXp: (amount: number) => {
        set((state) => {
          const { progress } = state;
          let { xp, level, xpToNextLevel, totalXpEarned } = progress;
          
          xp += amount;
          totalXpEarned += amount;
          
          // Level up if enough XP
          while (xp >= xpToNextLevel) {
            xp -= xpToNextLevel;
            level += 1;
            xpToNextLevel = calculateXpForLevel(level);
          }
          
          return {
            progress: {
              ...progress,
              xp,
              level,
              xpToNextLevel,
              totalXpEarned,
            },
          };
        });
        
        // Check for level-based badges
        get().checkForBadges();
      },
      
      updateStreak: () => {
        set((state) => {
          const { progress } = state;
          const today = new Date().toISOString().split('T')[0];
          
          // If this is the first study session ever
          if (!progress.lastStudyDate) {
            return {
              progress: {
                ...progress,
                streakDays: 1,
                lastStudyDate: today,
              },
            };
          }
          
          const lastDate = new Date(progress.lastStudyDate);
          const todayDate = new Date(today);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // If studied today already, no change
          if (progress.lastStudyDate === today) {
            return { progress };
          }
          
          // If studied yesterday, increment streak
          if (diffDays === 1) {
            return {
              progress: {
                ...progress,
                streakDays: progress.streakDays + 1,
                lastStudyDate: today,
              },
            };
          }
          
          // If missed a day, reset streak
          return {
            progress: {
              ...progress,
              streakDays: 1,
              lastStudyDate: today,
            },
          };
        });
        
        // Check for streak-based badges
        get().checkForBadges();
      },
      
      recordCardReview: (isKnown: boolean) => {
        set((state) => {
          const { progress } = state;
          return {
            progress: {
              ...progress,
              cardsReviewed: progress.cardsReviewed + 1,
              cardsKnown: isKnown ? progress.cardsKnown + 1 : progress.cardsKnown,
            },
          };
        });
        
        // Add XP for reviewing a card
        get().addXp(isKnown ? 10 : 5);
        get().updateStreak();
        get().checkForBadges();
      },
      
      checkForBadges: () => {
        set((state) => {
          const { progress } = state;
          const { cardsReviewed, streakDays, level, badges } = progress;
          
          const updatedBadges = [...badges];
          let badgeEarned = false;
          
          // Check each badge condition
          updatedBadges.forEach((badge) => {
            if (badge.earned) return;
            
            let shouldEarn = false;
            
            switch (badge.id) {
              case 'first-review':
                shouldEarn = cardsReviewed >= 1;
                break;
              case 'ten-cards':
                shouldEarn = cardsReviewed >= 10;
                break;
              case 'fifty-cards':
                shouldEarn = cardsReviewed >= 50;
                break;
              case 'hundred-cards':
                shouldEarn = cardsReviewed >= 100;
                break;
              case 'three-day-streak':
                shouldEarn = streakDays >= 3;
                break;
              case 'seven-day-streak':
                shouldEarn = streakDays >= 7;
                break;
              case 'level-5':
                shouldEarn = level >= 5;
                break;
              case 'level-10':
                shouldEarn = level >= 10;
                break;
            }
            
            if (shouldEarn) {
              badge.earned = true;
              badge.earnedAt = new Date().toISOString();
              badgeEarned = true;
            }
          });
          
          return {
            progress: {
              ...progress,
              badges: updatedBadges,
            },
          };
        });
      },
      
      resetProgress: () => {
        set({ progress: initialState });
      },
    }),
    {
      name: 'mindflip-progress',
    }
  )
);
