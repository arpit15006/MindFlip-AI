"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function OnboardingStep2() {
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-ocean opacity-90 -z-10"></div>

      {/* Canvas-like background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Animated shapes */}
        <motion.div
          className="absolute top-[5%] right-[10%] w-40 h-40 border border-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-[15%] left-[5%] w-64 h-64 border border-white/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute top-[30%] left-[20%] w-16 h-16 bg-white/5 rounded-lg rotate-45"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="flex flex-col h-full px-8 py-16 text-white">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mr-3">
            <Layers className="h-8 w-8 text-white" />
            <div className="absolute inset-0 bg-white opacity-30 blur-md rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold">Create Flashcard Sets</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 h-full">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl mb-6">
              Organize your learning with custom flashcard sets. Create, edit, and manage your collections with ease.
            </p>

            <ul className="space-y-4 mb-8">
              <ListItem delay={0.5}>
                Create sets for different subjects or topics
              </ListItem>
              <ListItem delay={0.7}>
                Add, edit, or remove flashcards within each set
              </ListItem>
              <ListItem delay={0.9}>
                Import and export sets to share with others
              </ListItem>
            </ul>

            <p className="text-lg font-medium mb-4">Try it out:</p>

            <div className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHoveringCreate(true)}
                onHoverEnd={() => setIsHoveringCreate(false)}
              >
                <Button
                  className="relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Set
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHoveringEdit(true)}
                onHoverEnd={() => setIsHoveringEdit(false)}
              >
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHoveringDelete(true)}
                onHoverEnd={() => setIsHoveringDelete(false)}
              >
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="relative w-full max-w-md">
              <Card className="glassmorphism relative overflow-hidden animated-border">
                <div className="absolute -inset-1 bg-gradient-aurora opacity-10 blur-xl -z-10"></div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      Biology 101
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className={`hover:bg-white/10 ${isHoveringEdit ? 'bg-white/10' : ''}`}>
                        <Edit3 className="h-4 w-4 text-white" />
                      </Button>
                      <Button variant="ghost" size="icon" className={`hover:bg-white/10 ${isHoveringDelete ? 'bg-white/10' : ''}`}>
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70 mb-4">12 cards • Last studied 2 days ago</p>

                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                    {['Cell Structure', 'Photosynthesis', 'DNA Replication'].map((item, i) => (
                      <motion.li
                        key={i}
                        className="text-xs p-2 bg-white/10 backdrop-blur-sm rounded-md border border-white/10 flex justify-between items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (i * 0.1) }}
                      >
                        <span className="text-white">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    className="mt-4"
                    animate={{ scale: isHoveringCreate ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="sm"
                      className={`w-full relative overflow-hidden group ${isHoveringCreate ? 'bg-gradient-aurora' : ''}`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center">
                        <PlusCircle className="mr-2 h-3 w-3" /> Add Card
                      </div>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
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
