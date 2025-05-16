"use client";
import React, { useEffect, useState } from 'react';
import type { DailyActivity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, addDays, getDay, isSameDay } from 'date-fns';

interface StudyHeatmapProps {
  activity: DailyActivity[];
  numDays?: number; // Number of past days to show
}

const getIntensityColor = (count: number): string => {
  if (count === 0) return 'bg-muted/20'; // Very light, almost transparent
  if (count <= 2) return 'bg-primary/20';
  if (count <= 5) return 'bg-primary/40';
  if (count <= 10) return 'bg-primary/70';
  return 'bg-primary'; // Darkest for high activity
};

export function StudyHeatmap({ activity, numDays = 90 }: StudyHeatmapProps) {
  // All hooks must be declared at the top level of the component
  const [days, setDays] = useState<Array<{ date: Date; count: number }>>([]);
  // Fix hydration issues by ensuring consistent rendering between server and client
  const [isMounted, setIsMounted] = useState(false);

  // First useEffect for loading days data
  useEffect(() => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(endDate, numDays -1); // -1 because we include today

    const activityMap = new Map(activity.map(a => [a.date, a.cardsReviewed]));

    const dayArray = [];
    for (let i = 0; i < numDays; i++) {
      const date = subDays(endDate, i); // Iterate backwards from today
      const dateString = format(date, 'yyyy-MM-dd');
      dayArray.push({
        date: date,
        count: activityMap.get(dateString) || 0,
      });
    }
    setDays(dayArray.reverse()); // Reverse to have oldest date first for rendering logic
  }, [activity, numDays]);

  // Second useEffect for client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (days.length === 0) {
    return (
       <Card>
        <CardHeader><CardTitle>Study Activity Heatmap</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">No activity data to display.</p></CardContent>
      </Card>
    );
  }

  // Create a grid structure, typically 7 days (columns) per week
  // This is a simplified version, a full calendar heatmap is more complex
  // For this example, we'll show a list of squares
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const cells = [];
  const startDate = days[0]?.date ? startOfWeek(days[0].date, { weekStartsOn: 0 }) : startOfWeek(subDays(today, numDays - 1), { weekStartsOn: 0 });


  // Generate placeholder cells for the beginning of the first week if needed
  const firstDayOfData = days[0]?.date;
  if(firstDayOfData){
    const dayOfWeekOffset = getDay(firstDayOfData); // 0 for Sun, 1 for Mon...
    for (let i = 0; i < dayOfWeekOffset; i++) {
        cells.push(<div key={`empty-start-${i}`} className="w-4 h-4 bg-muted/10 rounded-sm" />);
    }
  }


  days.forEach((day) => {
    cells.push(
      <TooltipProvider key={day.date.toISOString()} delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "w-4 h-4 rounded-sm cursor-default",
                getIntensityColor(day.count),
                isSameDay(day.date, today) && "ring-2 ring-accent ring-offset-1 ring-offset-background"
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{format(day.date, 'MMM d, yyyy')}: {day.count} cards</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });

  // This is a very basic heatmap, a proper one would align days into columns by week
  // For a quick version, we'll just display them in a wrapped flex container

  return (
    <Card className="glassmorphism-intense relative overflow-hidden">
      {/* Add decorative background elements */}
      <div className="absolute -inset-1 bg-gradient-sunset opacity-10 blur-xl -z-10"></div>

      <CardHeader>
        <CardTitle className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-primary">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <path d="M2 10h20" />
          </svg>
          Study Activity ({numDays} days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end text-xs text-muted-foreground mb-2">
            <span>Less</span>
            <div className="w-3 h-3 bg-primary/20 rounded-sm mx-0.5"></div>
            <div className="w-3 h-3 bg-primary/40 rounded-sm mx-0.5"></div>
            <div className="w-3 h-3 bg-primary/70 rounded-sm mx-0.5"></div>
            <div className="w-3 h-3 bg-primary rounded-sm mx-0.5"></div>
            <span>More</span>
        </div>

        {/* Day of week labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-xs text-center text-muted-foreground">
              {day[0]}
            </div>
          ))}
        </div>

        {isMounted ? (
          <div className="grid grid-rows-7 grid-flow-col gap-1">
              {cells}
          </div>
        ) : (
          <div className="h-[150px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading heatmap...</p>
          </div>
        )}

        {/* Add a summary of activity */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">Total Activity</div>
              <div className="text-lg font-bold">
                {days.reduce((sum, day) => sum + day.count, 0)} cards reviewed
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Active Days</div>
              <div className="text-lg font-bold">
                {days.filter(day => day.count > 0).length} days
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
