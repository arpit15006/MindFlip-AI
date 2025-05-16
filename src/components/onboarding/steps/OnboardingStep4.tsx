"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Award, Calendar } from 'lucide-react';

export function OnboardingStep4() {
  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-fire opacity-90 -z-10"></div>

      {/* Canvas-like background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Data visualization elements */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Animated graph line */}
          <motion.path
            d={`M0,${Math.random() * 100 + 200} ${Array.from({ length: 10 }).map((_, i) =>
              `L${(i + 1) * 100},${Math.random() * 100 + 200}`
            ).join(' ')}`}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
          />

          {/* Animated graph line 2 */}
          <motion.path
            d={`M0,${Math.random() * 100 + 300} ${Array.from({ length: 10 }).map((_, i) =>
              `L${(i + 1) * 100},${Math.random() * 100 + 300}`
            ).join(' ')}`}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "loop", repeatDelay: 0.5, delay: 2 }}
          />

          {/* Dots for data points */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={Math.random() * 800 + 100}
              cy={Math.random() * 400 + 100}
              r="3"
              fill="rgba(255, 255, 255, 0.3)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>
      </div>

      <div className="flex flex-col h-full px-8 py-16 text-white">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mr-3">
            <BarChart3 className="h-8 w-8 text-white" />
            <div className="absolute inset-0 bg-white opacity-30 blur-md rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold">Track Your Progress</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 h-full">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl mb-6">
              Visualize your learning journey with detailed statistics and gamification elements.
            </p>

            <ul className="space-y-4 mb-8">
              <ListItem delay={0.5}>
                Track your daily study streak to stay motivated
              </ListItem>
              <ListItem delay={0.7}>
                Earn XP and level up as you learn
              </ListItem>
              <ListItem delay={0.9}>
                Unlock badges and achievements for milestones
              </ListItem>
              <ListItem delay={1.1}>
                View detailed analytics of your study habits
              </ListItem>
            </ul>
          </motion.div>

          <motion.div
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StatCard
              icon={<Flame className="h-6 w-6 text-orange-400" />}
              title="Study Streak"
              value="5 Days"
              description="Keep your streak going!"
              color="bg-gradient-to-br from-orange-500 to-red-500"
              delay={0.6}
            />

            <StatCard
              icon={<Award className="h-6 w-6 text-yellow-400" />}
              title="Level Progress"
              value="Level 3"
              description="250 XP to next level"
              color="bg-gradient-to-br from-yellow-500 to-amber-600"
              delay={0.8}
              progress={65}
            />

            <StatCard
              icon={<Calendar className="h-6 w-6 text-blue-400" />}
              title="Study Heatmap"
              description="Track your daily activity"
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
              delay={1.0}
              heatmap={true}
            />

            <StatCard
              icon={<BarChart3 className="h-6 w-6 text-green-400" />}
              title="Card Mastery"
              value="68%"
              description="Cards marked as known"
              color="bg-gradient-to-br from-green-500 to-emerald-600"
              delay={1.2}
              progress={68}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ListItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.li
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="h-2 w-2 rounded-full bg-white" />
      <span>{children}</span>
    </motion.li>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
  description: string;
  color: string;
  delay: number;
  progress?: number;
  heatmap?: boolean;
}

function StatCard({ icon, title, value, description, color, delay, progress, heatmap }: StatCardProps) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>

      <div className="flex items-center mb-2">
        <div className="p-2 rounded-full bg-white/10 mr-3">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>

      {value && (
        <div className="text-2xl font-bold mb-1">{value}</div>
      )}

      <p className="text-sm text-white/70">{description}</p>

      {progress !== undefined && (
        <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      {heatmap && (
        <div className="mt-3 grid grid-cols-7 gap-1">
          {Array.from({ length: 21 }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-3 rounded-sm ${
                Math.random() > 0.5
                  ? `bg-blue-${400 + (Math.floor(Math.random() * 3) * 100)}`
                  : 'bg-white/20'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.1 + (i * 0.02) }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
