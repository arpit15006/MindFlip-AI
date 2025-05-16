"use client";
import { motion } from 'framer-motion';
import { useProgressStore, type Badge } from '@/store/useProgressStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

export function BadgeDisplay() {
  const { progress } = useProgressStore();
  const { badges } = progress;

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glassmorphism-intense overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-cosmic opacity-10 blur-xl -z-10"></div>

        <CardHeader className="relative">
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-neon opacity-20 rounded-full blur-xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-xl flex items-center">
              <motion.span
                animate={{
                  color: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary))"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mr-2"
              >
                🏆
              </motion.span>
              Your Achievements
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent>
          <motion.h3
            className="text-lg font-medium mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Earned Badges
          </motion.h3>

          {earnedBadges.length === 0 ? (
            <motion.p
              className="text-muted-foreground text-sm p-4 bg-muted/30 rounded-lg border border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Complete activities to earn badges! Your achievements will be displayed here.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {earnedBadges.map((badge, index) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  earned={true}
                />
              ))}
            </motion.div>
          )}

          {unearnedBadges.length > 0 && (
            <>
              <motion.h3
                className="text-lg font-medium mt-8 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Badges to Earn
              </motion.h3>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {unearnedBadges.map((badge) => (
                  <BadgeItem key={badge.id} badge={badge} earned={false} />
                ))}
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface BadgeItemProps {
  badge: Badge;
  earned: boolean;
}

function BadgeItem({ badge, earned }: BadgeItemProps) {
  // Define the item animation variants here instead of using the parent's
  const itemAnimation = {
    hidden: { scale: 0.8, opacity: 0, rotateY: 90 },
    show: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {earned ? (
            <motion.div
              className="flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer relative overflow-hidden"
              variants={itemAnimation}
              whileHover={{
                scale: 1.08,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              {/* Background gradient with animation */}
              <div className="absolute inset-0 bg-gradient-cosmic opacity-80 -z-10"></div>

              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-primary opacity-40 blur-sm -z-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />

              {/* Badge icon with animation */}
              <motion.div
                className="text-3xl mb-2 bg-background/20 p-2 rounded-full"
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {badge.icon}
              </motion.div>

              {/* Badge name */}
              <span className="text-xs font-medium text-center text-primary-foreground">
                {badge.name}
              </span>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-white opacity-0 -z-10"
                animate={{
                  opacity: [0, 0.1, 0],
                  left: ["-100%", "100%", "100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 opacity-50 border border-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5 }}
              whileHover={{ opacity: 0.7 }}
            >
              <span className="text-2xl mb-1 opacity-70">{badge.icon}</span>
              <span className="text-xs font-medium text-center">{badge.name}</span>
            </motion.div>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="p-4 max-w-[200px]">
          <motion.div
            className="text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-semibold text-primary mb-1">{badge.name}</p>
            <p>{badge.description}</p>
            {earned && badge.earnedAt && (
              <p className="text-xs bg-muted/50 p-1 rounded mt-2 text-center">
                Earned on {format(new Date(badge.earnedAt), 'MMM d, yyyy')}
              </p>
            )}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
