import { useProgressStore } from '../useProgressStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useProgressStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    localStorage.clear();
    useProgressStore.getState().resetProgress();
  });
  
  test('initial state is correct', () => {
    const { progress } = useProgressStore.getState();
    
    expect(progress.level).toBe(1);
    expect(progress.xp).toBe(0);
    expect(progress.streakDays).toBe(0);
    expect(progress.cardsReviewed).toBe(0);
    expect(progress.cardsKnown).toBe(0);
    expect(progress.badges.length).toBeGreaterThan(0);
    expect(progress.badges.every(badge => !badge.earned)).toBe(true);
  });
  
  test('addXp increases xp and levels up when threshold is reached', () => {
    const { addXp } = useProgressStore.getState();
    const initialXpToNextLevel = useProgressStore.getState().progress.xpToNextLevel;
    
    // Add XP just below the threshold
    addXp(initialXpToNextLevel - 1);
    
    let { progress } = useProgressStore.getState();
    expect(progress.level).toBe(1);
    expect(progress.xp).toBe(initialXpToNextLevel - 1);
    
    // Add 1 more XP to trigger level up
    addXp(1);
    
    progress = useProgressStore.getState().progress;
    expect(progress.level).toBe(2);
    expect(progress.xp).toBe(0);
  });
  
  test('recordCardReview updates stats and adds XP', () => {
    const { recordCardReview } = useProgressStore.getState();
    
    // Record a known card
    recordCardReview(true);
    
    let { progress } = useProgressStore.getState();
    expect(progress.cardsReviewed).toBe(1);
    expect(progress.cardsKnown).toBe(1);
    expect(progress.xp).toBeGreaterThan(0);
    
    // Record an unknown card
    recordCardReview(false);
    
    progress = useProgressStore.getState().progress;
    expect(progress.cardsReviewed).toBe(2);
    expect(progress.cardsKnown).toBe(1);
  });
  
  test('updateStreak increments streak for consecutive days', () => {
    const { updateStreak } = useProgressStore.getState();
    
    // First day
    updateStreak();
    
    let { progress } = useProgressStore.getState();
    expect(progress.streakDays).toBe(1);
    expect(progress.lastStudyDate).toBeDefined();
    
    // Mock the date to be the next day
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    jest.spyOn(global.Date, 'now').mockImplementation(() => nextDay.getTime());
    
    // Second day
    updateStreak();
    
    progress = useProgressStore.getState().progress;
    expect(progress.streakDays).toBe(2);
  });
  
  test('checkForBadges awards badges when conditions are met', () => {
    const { recordCardReview, checkForBadges } = useProgressStore.getState();
    
    // Record a review to earn the first badge
    recordCardReview(true);
    checkForBadges();
    
    const { progress } = useProgressStore.getState();
    const firstReviewBadge = progress.badges.find(badge => badge.id === 'first-review');
    
    expect(firstReviewBadge).toBeDefined();
    expect(firstReviewBadge?.earned).toBe(true);
  });
});
