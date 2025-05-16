"use client";
import React, { useMemo } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { KnownUnknownPieChart } from './KnownUnknownPieChart';
import { StudyHeatmap } from './StudyHeatmap';
import { StreakCounter } from './StreakCounter';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, isToday } from 'date-fns';

export function StatsDashboardClient() {
  const { data } = useAppData();

  const { knownCount, unknownCount, newCount, cardsReviewedToday, knownToday, unknownToday } = useMemo(() => {
    // Count total cards by status
    let kc = 0;
    let uc = 0;
    let nc = 0;
    data.flashcards.forEach(card => {
      if (card.status === 'known') kc++;
      else if (card.status === 'unknown') uc++;
      else nc++;
    });

    // Get today's activity
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayActivity = data.stats.dailyActivity.find(act => act.date === today);

    // Initialize today's stats
    let crt = 0; // Cards reviewed today
    let kt = 0;  // Known cards today
    let ut = 0;  // Unknown cards today

    if (todayActivity) {
      // Get the count of cards reviewed today
      crt = todayActivity.cardsReviewed;

      // Count known and unknown cards from today's reviews
      todayActivity.flashcardIdsReviewed.forEach(cardId => {
        const card = data.flashcards.find(c => c.id === cardId);
        if (card) {
          if (card.status === 'known') kt++;
          else if (card.status === 'unknown') ut++;
        }
      });
    }

    // Force re-render when data changes
    console.log(`Stats updated: ${crt} cards reviewed today (${kt} known, ${ut} unknown)`);

    return {
      knownCount: kc,
      unknownCount: uc,
      newCount: nc,
      cardsReviewedToday: crt,
      knownToday: kt,
      unknownToday: ut
    };
  }, [data.flashcards, data.stats.dailyActivity]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StreakCounter activity={data.stats.dailyActivity} />
        {/* Total Flashcards card */}
        <Card className="glassmorphism-intense relative overflow-hidden">
          {/* Add decorative background elements */}
          <div className="absolute -inset-1 bg-gradient-sunset opacity-10 blur-xl -z-10"></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flashcards</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M17 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M7 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.flashcards.length}</div>
            <p className="text-xs text-muted-foreground">
              {knownCount} known, {unknownCount} unknown, {newCount} new
            </p>

            {/* Add a small visualization */}
            <div className="mt-2 flex h-1.5 gap-0.5">
              <div
                className="h-full bg-green-500 rounded-l-full"
                style={{ width: `${data.flashcards.length > 0 ? (knownCount / data.flashcards.length) * 100 : 0}%` }}
              />
              <div
                className="h-full bg-destructive"
                style={{ width: `${data.flashcards.length > 0 ? (unknownCount / data.flashcards.length) * 100 : 0}%` }}
              />
              <div
                className="h-full bg-primary rounded-r-full"
                style={{ width: `${data.flashcards.length > 0 ? (newCount / data.flashcards.length) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism-intense relative overflow-hidden">
          {/* Add decorative background elements */}
          <div className="absolute -inset-1 bg-gradient-neon opacity-10 blur-xl -z-10"></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
              <path d="M8 2h8" />
              <path d="M9 2v2.789a4 4 0 0 1-1.6 3.2l-1.8 1.35A4 4 0 0 0 4 12.54V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.46a4 4 0 0 0-1.6-3.2l-1.8-1.35A4 4 0 0 1 15 4.79V2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.flashcardSets.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.flashcardSets.length > 0
                ? `Average ${Math.round(data.flashcards.length / data.flashcardSets.length)} cards per set`
                : "Create your first set"}
            </p>

            {/* Add a small visualization */}
            {data.flashcardSets.length > 0 && (
              <div className="mt-2 grid grid-cols-10 gap-0.5">
                {Array.from({ length: Math.min(10, data.flashcardSets.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 bg-gradient-primary rounded-full"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <KnownUnknownPieChart knownCount={knownCount} unknownCount={unknownCount} newCount={newCount} />
        <StudyHeatmap activity={data.stats.dailyActivity} numDays={180} />
      </div>
    </div>
  );
}
