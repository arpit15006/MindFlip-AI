export type FlashcardStatus = 'known' | 'unknown' | 'new';

export interface FlashcardType {
  id: string;
  front: string;
  back: string;
  setId: string;
  status: FlashcardStatus;
  lastReviewed?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface FlashcardSetType {
  id: string;
  name: string;
  createdAt: string; // ISO date string
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  cardsReviewed: number;
  flashcardIdsReviewed: string[]; // To avoid double counting if a card is reviewed multiple times in a day for streak
}

export interface AppStats {
  dailyActivity: DailyActivity[];
  // other aggregated stats can be added here if needed
}

export interface AppData {
  flashcardSets: FlashcardSetType[];
  flashcards: FlashcardType[];
  stats: AppStats;
}

export type NewFlashcard = Omit<FlashcardType, 'id' | 'status' | 'createdAt' | 'lastReviewed'>;
export type NewFlashcardSet = Omit<FlashcardSetType, 'id' | 'createdAt'>;
