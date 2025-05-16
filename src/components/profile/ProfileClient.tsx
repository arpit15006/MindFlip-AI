"use client";
import { useProgressStore } from '@/store/useProgressStore';
import { XPProgress } from '@/components/gamification/XPProgress';
import { BadgeDisplay } from '@/components/gamification/BadgeDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Award, Flame, BarChart3, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OnboardingButton } from '@/components/onboarding/OnboardingProvider';

export function ProfileClient() {
  const { progress, resetProgress } = useProgressStore();
  const { toast } = useToast();

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      resetProgress();
      toast({
        title: 'Progress Reset',
        description: 'All your progress has been reset.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.level}</div>
            <p className="text-xs text-muted-foreground">
              {progress.xp} / {progress.xpToNextLevel} XP to next level
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.streakDays} day{progress.streakDays !== 1 ? 's' : ''}</div>
            <p className="text-xs text-muted-foreground">
              {progress.streakDays > 0 ? "Keep up the great work!" : "Review cards daily to build your streak."}
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Reviewed</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.cardsReviewed}</div>
            <p className="text-xs text-muted-foreground">
              {progress.cardsKnown} known ({Math.round((progress.cardsKnown / progress.cardsReviewed) * 100) || 0}% accuracy)
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
              <path d="M6 19L12 5l6 14H6z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.totalXpEarned}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime experience points
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="badges" className="mt-6">
          <BadgeDisplay />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Reset Progress</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will reset all your progress, including levels, XP, badges, and streaks. This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleResetProgress}>
                  <Trash2 className="mr-2 h-4 w-4" /> Reset All Progress
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Onboarding Tutorial</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review the app tutorial to learn about all the features of MindFlip-AI.
                </p>
                <OnboardingButton />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
