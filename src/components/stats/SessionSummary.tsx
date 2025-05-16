"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { format } from 'date-fns';

// This component directly calculates today's stats from the app data
export function SessionSummary() {
  const { data } = useAppData();

  // Calculate today's stats directly in the render function to avoid hydration issues
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayActivity = data.stats.dailyActivity.find(act => act.date === today);

  // Default values
  let cardsReviewedToday = 0;
  let knownToday = 0;
  let unknownToday = 0;

  if (todayActivity) {
    // Count cards reviewed today
    cardsReviewedToday = todayActivity.cardsReviewed;

    // Count known and unknown cards from today's reviews
    todayActivity.flashcardIdsReviewed.forEach(cardId => {
      const card = data.flashcards.find(c => c.id === cardId);
      if (card) {
        if (card.status === 'known') knownToday++;
        else if (card.status === 'unknown') unknownToday++;
      }
    });
  }

  // Calculate accuracy
  const accuracyValue = cardsReviewedToday > 0
    ? Math.round((knownToday / cardsReviewedToday) * 100)
    : 0;

  return (
    <Card className="glassmorphism-intense relative overflow-hidden">
      {/* Add decorative background elements */}
      <div className="absolute -inset-1 bg-gradient-ocean opacity-10 blur-xl -z-10"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Review</CardTitle>
        <ClipboardList className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{cardsReviewedToday} cards</div>
        <p className="text-xs text-muted-foreground">
          {knownToday} known, {unknownToday} unknown. ({accuracyValue}% accuracy)
        </p>

        {/* Add a small progress bar for accuracy */}
        {cardsReviewedToday > 0 && (
          <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary"
              style={{ width: `${accuracyValue}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
