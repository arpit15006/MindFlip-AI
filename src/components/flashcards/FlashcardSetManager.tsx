
"use client";
import React, { useState, useEffect } from 'react';
import type { FlashcardSetType, FlashcardType, NewFlashcard, NewFlashcardSet } from '@/lib/types';
import { useAppData } from '@/contexts/AppDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, BookOpen, Upload, Download, Loader2, Sparkles } from 'lucide-react';
import { FlashcardForm } from './FlashcardForm';
import { EnhancedFlashcardViewer } from './EnhancedFlashcardViewer';
import { SequentialFlashcardViewer } from './SequentialFlashcardViewer';
import { useToast } from "@/hooks/use-toast";
import { ImportExportButtons } from './ImportExportButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export function FlashcardSetManager() {
  const { data, addFlashcardSet, updateFlashcardSet, deleteFlashcardSet, addFlashcard, updateFlashcard, deleteFlashcard, getFlashcardsBySetId } = useAppData();
  const { toast } = useToast();

  const [isSetFormOpen, setIsSetFormOpen] = useState(false);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSetType | null>(null);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);
  const [newSetName, setNewSetName] = useState('');
  const [selectedSetForNewCard, setSelectedSetForNewCard] = useState<string | undefined>(undefined);

  const [viewingSet, setViewingSet] = useState<FlashcardSetType | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'sequential' | 'custom' | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSetSubmit = () => {
    if (!newSetName.trim()) {
      toast({ title: "Error", description: "Set name cannot be empty.", variant: "destructive" });
      return;
    }
    if (editingSet) {
      updateFlashcardSet(editingSet.id, { name: newSetName });
      toast({ title: "Set Updated", description: `Set "${newSetName}" has been updated.` });
    } else {
      // Create the new set and force a UI refresh
      const newSet = addFlashcardSet({ name: newSetName });
      toast({
        title: "Set Created",
        description: `Set "${newSetName}" has been created. Please 'Refresh' to view changes.`,
        className: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
      });

      // Force a re-render by setting a state
      setForceRefresh(prev => prev + 1);
    }
    setNewSetName('');
    setEditingSet(null);
    setIsSetFormOpen(false);
  };

  const openSetForm = (set?: FlashcardSetType) => {
    setEditingSet(set || null);
    setNewSetName(set ? set.name : '');
    setIsSetFormOpen(true);
  };

  const openCardForm = (set?: FlashcardSetType, card?: FlashcardType) => {
    setSelectedSetForNewCard(set?.id);
    setEditingCard(card || null);
    setIsCardFormOpen(true);
  };

  const handleCardSubmit = (cardData: NewFlashcard) => {
    if (editingCard) {
      updateFlashcard(editingCard.id, cardData);
      toast({ title: "Flashcard Updated", description: "Flashcard has been updated." });
    } else {
      addFlashcard(cardData);
      toast({ title: "Flashcard Created", description: "New flashcard added to set." });
    }
    setEditingCard(null);
    setIsCardFormOpen(false);
  };

  const handleDeleteSet = (setId: string, setName: string) => {
    if (window.confirm(`Are you sure you want to delete the set "${setName}" and all its cards?`)) {
      deleteFlashcardSet(setId);
      toast({ title: "Set Deleted", description: `Set "${setName}" and its cards have been deleted.`, variant: "destructive" });
    }
  };

  const handleDeleteCard = (cardId: string, cardFront: string) => {
     if (window.confirm(`Are you sure you want to delete the flashcard "${cardFront}"?`)) {
      deleteFlashcard(cardId);
      toast({ title: "Flashcard Deleted", description: `Flashcard "${cardFront}" has been deleted.`, variant: "destructive" });
    }
  }

  // Handle opening a flashcard set for viewing
  useEffect(() => {
    if (viewingSet && !showModeSelector && selectedMode === null) {
      setShowModeSelector(true);
    }
  }, [viewingSet, showModeSelector, selectedMode]);

  // This effect will run whenever forceRefresh changes, ensuring the component re-renders
  useEffect(() => {
    // This is just to force a re-render when forceRefresh changes
    console.log("Refreshing FlashcardSetManager, sets count:", data.flashcardSets.length);
  }, [forceRefresh, data.flashcardSets.length]);

  // Render the appropriate viewer based on the selected mode
  if (viewingSet && selectedMode) {
    const cardsForViewer = getFlashcardsBySetId(viewingSet.id);

    if (selectedMode === 'sequential') {
      return <SequentialFlashcardViewer
        initialCards={cardsForViewer}
        onClose={() => {
          setViewingSet(null);
          setSelectedMode(null);
        }}
      />;
    } else if (selectedMode === 'custom') {
      return <EnhancedFlashcardViewer
        initialCards={cardsForViewer}
        onClose={() => {
          setViewingSet(null);
          setSelectedMode(null);
        }}
      />;
    }
  }

  // Show the mode selector dialog
  if (showModeSelector && viewingSet) {
    const cardsForViewer = getFlashcardsBySetId(viewingSet.id);

    return (
      <Dialog
        open={showModeSelector}
        onOpenChange={(open) => {
          if (!open) {
            setShowModeSelector(false);
            setViewingSet(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Choose Study Mode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => {
                  setSelectedMode('sequential');
                  setShowModeSelector(false);
                }}
                className="flex items-center justify-start gap-2 h-auto py-3 bg-sky-500 hover:bg-sky-600 text-white"
              >
                <div className="bg-primary/20 p-2 rounded-full">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">Sequential Mode</div>
                  <div className="text-sm text-white/80">Study cards in their original order</div>
                </div>
              </Button>

              <Button
                onClick={() => {
                  setSelectedMode('custom');
                  setShowModeSelector(false);
                }}
                className="flex items-center justify-start gap-2 h-auto py-3 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <div className="bg-primary/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">Custom Mode</div>
                  <div className="text-sm text-white/80">Embrace the challenge with different modes.</div>
                </div>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModeSelector(false);
                setViewingSet(null);
              }}
              className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 bg-background/30 backdrop-blur-sm p-6 rounded-xl border border-primary/10 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Canvas-like decorative elements */}
        <div className="absolute inset-0 canvas-grid opacity-30"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-aurora opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-ocean opacity-5 blur-3xl"></div>

        {/* Animated dots */}
        {hasMounted && Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`header-dot-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <h2 className="text-2xl md:text-3xl font-bold flex items-center">
          <div className="relative mr-3">
            <BookOpen className="h-7 w-7 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary opacity-30 blur-md rounded-full animate-pulse-slow"></div>
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flashcard Collections
          </span>
        </h2>

        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ImportExportButtons />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => openSetForm()}
              className="relative overflow-hidden group hover-glow"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Set
              </div>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {!hasMounted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="flex flex-col glassmorphism">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : data.flashcardSets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center py-12 glassmorphism-intense relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-sunset opacity-5 blur-xl -z-10"></div>
            <CardContent className="flex flex-col items-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="mb-4"
              >
                <Sparkles className="h-16 w-16 text-primary opacity-50" />
              </motion.div>
              <p className="text-muted-foreground mb-6">No flashcard sets yet. Create your first set to get started!</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => openSetForm()}
                  className="relative overflow-hidden group hover-glow"
                >
                  <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Set
                  </div>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {data.flashcardSets.map((set, index) => {
              const cardsInSet = getFlashcardsBySetId(set.id);
              return (
                <motion.div
                  key={set.id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="flex flex-col h-full glassmorphism relative overflow-hidden animated-border">
                    <div className={`absolute -inset-1 opacity-10 blur-xl -z-10 ${
                      index % 4 === 0 ? 'bg-gradient-aurora' :
                      index % 4 === 1 ? 'bg-gradient-ocean-deep' :
                      index % 4 === 2 ? 'bg-gradient-fire' :
                      'bg-gradient-candy'
                    }`}></div>

                    {/* Canvas-like decorative elements */}
                    <div className="absolute inset-0 canvas-grid opacity-20 pointer-events-none"></div>

                    {/* Animated dots */}
                    {hasMounted && Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={`dot-${set.id}-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-primary/30 pointer-events-none"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}

                    <CardHeader className="relative">
                      <CardTitle className="flex justify-between items-center">
                        <motion.span
                          className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-xl"
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                        >
                          {set.name}
                        </motion.span>
                        <div className="flex gap-1">
                          <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => openSetForm(set)} aria-label="Edit set" className="hover:bg-primary/10 relative overflow-hidden">
                              <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity rounded-full"></div>
                              <Edit3 className="h-4 w-4 text-primary" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSet(set.id, set.name)} aria-label="Delete set" className="hover:bg-destructive/10 relative overflow-hidden">
                              <div className="absolute inset-0 bg-destructive/5 opacity-0 hover:opacity-100 transition-opacity rounded-full"></div>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow relative">
                      <div className="flex items-center mb-3 bg-primary/5 px-3 py-1.5 rounded-full">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2 animate-pulse-slow"></div>
                        <p className="text-sm font-medium">{cardsInSet.length} card{cardsInSet.length !== 1 ? 's' : ''}</p>
                      </div>

                      {cardsInSet.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                          {cardsInSet.slice(0, 5).map((card, cardIndex) => (
                            <motion.li
                              key={card.id}
                              className="text-xs p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-primary/10 flex justify-between items-center hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * cardIndex }}
                              whileHover={{
                                y: -2,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "rgba(var(--primary), 0.05)"
                              }}
                            >
                              {/* Canvas-like decorative element */}
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                              <span className="text-primary font-medium">{card.front.length > 30 ? card.front.substring(0,27) + "..." : card.front}</span>
                              <div className="flex">
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 relative overflow-hidden" onClick={() => openCardForm(set, card)} aria-label="Edit card">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity rounded-full"></div>
                                    <Edit3 className="h-3 w-3 text-primary" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-destructive/10 relative overflow-hidden" onClick={() => handleDeleteCard(card.id, card.front)} aria-label="Delete card">
                                    <div className="absolute inset-0 bg-destructive/5 opacity-0 hover:opacity-100 transition-opacity rounded-full"></div>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.li>
                          ))}
                          {cardsInSet.length > 5 && (
                            <motion.li
                              className="text-xs text-center p-1 bg-primary/5 rounded-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              ...and {cardsInSet.length - 5} more
                            </motion.li>
                          )}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 bg-muted/10 rounded-lg border border-dashed border-primary/20 p-4 relative overflow-hidden">
                          {/* Canvas-like grid background */}
                          <div className="absolute inset-0 canvas-grid opacity-10"></div>

                          {/* Animated gradient */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-accent/5 opacity-30 blur-xl"></div>

                          <p className="text-sm text-muted-foreground text-center mb-3 relative z-10">No cards in this set yet.</p>
                          <motion.div
                            animate={{
                              y: [0, -8, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="relative z-10"
                          >
                            <PlusCircle className="h-8 w-8 text-primary/30" />
                          </motion.div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between gap-3 pt-4 border-t border-primary/10 relative">
                      {/* Canvas-like decorative element */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCardForm(set)}
                          className="w-full border-primary/20 hover:border-primary/50 transition-colors relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center justify-center">
                            <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                            <span>Add Card</span>
                          </div>
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          onClick={() => setViewingSet(set)}
                          disabled={cardsInSet.length === 0}
                          className="w-full relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-primary opacity-80 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center justify-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Study Set</span>
                          </div>

                          {/* Animated glow effect */}
                          {cardsInSet.length > 0 && hasMounted && (
                            <motion.div
                              className="absolute inset-0 bg-white/10 rounded-md"
                              animate={{
                                opacity: [0, 0.5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            />
                          )}
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Set Creation/Editing Dialog */}
      <Dialog open={isSetFormOpen} onOpenChange={setIsSetFormOpen}>
        <DialogContent className="glassmorphism-intense relative overflow-hidden fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="absolute -inset-1 bg-gradient-aurora opacity-10 blur-xl -z-10"></div>

          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {editingSet ? 'Edit Set Name' : 'Create New Set'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Input
              type="text"
              placeholder="Enter set name"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              autoFocus
              className="border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-primary/20 hover:border-primary/50 transition-colors">
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleSetSubmit}
              className="relative overflow-hidden group hover-glow"
            >
              <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center">
                {editingSet ? 'Save Changes' : 'Create Set'}
              </div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Creation/Editing Form */}
      <FlashcardForm
        isOpen={isCardFormOpen}
        onOpenChange={setIsCardFormOpen}
        onSubmit={handleCardSubmit}
        initialData={editingCard || undefined}
        availableSets={data.flashcardSets}
        defaultSetId={selectedSetForNewCard || (editingCard ? editingCard.setId : undefined)}
      />
    </div>
  );
}
