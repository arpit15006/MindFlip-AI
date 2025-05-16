"use client";
import type { FlashcardType, NewFlashcard, FlashcardSetType } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { BookOpen, Edit3, PenLine } from 'lucide-react';

const flashcardSchema = z.object({
  front: z.string().min(1, "Front content cannot be empty."),
  back: z.string().min(1, "Back content cannot be empty."),
  setId: z.string().min(1, "A set must be selected."),
});

type FlashcardFormValues = z.infer<typeof flashcardSchema>;

interface FlashcardFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: NewFlashcard) => void;
  initialData?: FlashcardType; // For editing
  availableSets: FlashcardSetType[];
  defaultSetId?: string;
}

export function FlashcardForm({ isOpen, onOpenChange, onSubmit, initialData, availableSets, defaultSetId }: FlashcardFormProps) {
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: initialData
      ? { front: initialData.front, back: initialData.back, setId: initialData.setId }
      : { front: '', back: '', setId: defaultSetId || (availableSets.length > 0 ? availableSets[0].id : '') },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(initialData
        ? { front: initialData.front, back: initialData.back, setId: initialData.setId }
        : { front: '', back: '', setId: defaultSetId || (availableSets.length > 0 ? availableSets[0].id : '') });
    }
  }, [isOpen, initialData, defaultSetId, availableSets, form]);


  const handleSubmit = (values: FlashcardFormValues) => {
    onSubmit(values as NewFlashcard); // Type assertion: NewFlashcard structure matches FlashcardFormValues
    form.reset();
    onOpenChange(false);
  };

  // Simple animation variants
  const formControls = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glassmorphism-intense relative overflow-hidden fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        {/* Background gradient elements */}
        <div className="absolute -inset-1 bg-gradient-aurora opacity-10 blur-xl -z-10"></div>

        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="relative mr-2">
              {initialData ? (
                <Edit3 className="h-5 w-5 text-primary animate-pulse-slow" />
              ) : (
                <PenLine className="h-5 w-5 text-primary animate-pulse-slow" />
              )}
              <div className="absolute inset-0 bg-primary opacity-30 blur-md rounded-full animate-pulse-slow"></div>
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {initialData ? 'Edit Flashcard' : 'Create Flashcard'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 py-4">
            <div>
              <FormField
                control={form.control}
                name="front"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      Front
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter front content (question, term)"
                        {...field}
                        className="border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="back"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="15" x2="21" y2="15" />
                        <line x1="15" y1="3" x2="15" y2="15" />
                      </svg>
                      Back
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter back content (answer, definition)"
                        {...field}
                        className="border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="setId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Set
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                          <SelectValue placeholder="Select a set" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background/80 backdrop-blur-md border-primary/20">
                        {availableSets.length === 0 ? (
                          <SelectItem value="no-sets" disabled>No sets available. Create one first.</SelectItem>
                        ) : (
                          availableSets.map(set => (
                            <SelectItem key={set.id} value={set.id} className="hover:bg-primary/10 transition-colors">
                              {set.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <DialogFooter className="pt-2 gap-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary/20 hover:border-primary/50 transition-colors"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  disabled={availableSets.length === 0}
                  className="relative overflow-hidden group hover-glow"
                >
                  <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center">
                    {initialData ? 'Save Changes' : 'Create Card'}
                  </div>
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Need to ensure useEffect is imported from react
import { useEffect } from 'react';
