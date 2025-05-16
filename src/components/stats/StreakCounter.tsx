"use client";
import React, { useEffect, useState } from 'react';
import type { DailyActivity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { differenceInCalendarDays, subDays, format } from 'date-fns';

interface StreakCounterProps {
  activity: DailyActivity[];
}

export function StreakCounter({ activity }: StreakCounterProps) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (activity.length === 0) {
      setStreak(0);
      return;
    }

    // Sort activity by date descending to easily check recent days
    const sortedActivity = [...activity].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');

    // Check if there was activity today or yesterday to start the streak count
    const lastActivityDate = new Date(sortedActivity[0].date);

    if (differenceInCalendarDays(today, lastActivityDate) > 1) {
      // Last activity was more than a day ago
      setStreak(0);
      return;
    }

    // If activity today or yesterday, start counting
    let expectedDate = lastActivityDate;
    if (differenceInCalendarDays(today, lastActivityDate) === 0) { // Activity today
        currentStreak = 1;
        expectedDate = subDays(today,1);
    } else if (differenceInCalendarDays(today, lastActivityDate) === 1) { // Activity yesterday
        currentStreak = 1;
        expectedDate = subDays(lastActivityDate,1);
    }


    for (let i = 1; i < sortedActivity.length; i++) {
      const activityDate = new Date(sortedActivity[i].date);
      if (differenceInCalendarDays(expectedDate, activityDate) === 0) {
        currentStreak++;
        expectedDate = subDays(activityDate, 1);
      } else {
        // Streak broken
        break;
      }
    }
    setStreak(currentStreak);

  }, [activity]);

  return (
    <Card className="glassmorphism-intense relative overflow-hidden">
      {/* Add decorative background elements */}
      <div className="absolute -inset-1 bg-gradient-cosmic opacity-10 blur-xl -z-10"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        <div className="relative">
          <Flame
            className={`h-5 w-5 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}
          />
          {streak > 2 && (
            <div className="absolute -inset-1 animate-pulse bg-orange-500/20 rounded-full blur-sm"></div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <div className="text-2xl font-bold mr-1">{streak}</div>
          <div className="text-lg font-medium">day{streak !== 1 ? 's' : ''}</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {streak > 0 ? "Keep up the great work!" : "Review cards daily to build your streak."}
        </p>

        {/* Streak visualization */}
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < streak ? 'bg-gradient-primary' : 'bg-muted/30'}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
