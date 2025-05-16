
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAppData } from '@/contexts/AppDataContext';
import type { FlashcardType, FlashcardSetType, NewFlashcard } from '@/lib/types';
import { generateFlashcardsFromText, type GenerateFlashcardsFromTextInput, type GenerateFlashcardsFromTextOutput } from '@/ai/flows/generate-flashcards';
import { Sparkles, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const generatorSchema = z.object({
  text: z.string().min(50, "Text must be at least 50 characters long."),
  setId: z.string().min(1, "Please select a set to add cards to."),
});

type GeneratorFormValues = z.infer<typeof generatorSchema>;

export function AIGeneratorForm() {
  const { data: appData, addMultipleFlashcards, addFlashcardSet } = useAppData();
  const { toast } = useToast();
  const [generatedCards, setGeneratedCards] = useState<Array<{ front: string; back: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: { text: '', setId: appData.flashcardSets.length > 0 ? appData.flashcardSets[0].id : '' },
  });

  const watchedText = form.watch("text");
  const watchedSetId = form.watch("setId");
  const isGenerateButtonDisabled = isLoading || !(watchedText && watchedText.length >= 50) || !watchedSetId || appData.flashcardSets.length === 0;

  // Update the form when the flashcard sets change or when forceRefresh changes
  useEffect(() => {
    // If there are sets but no set is selected, select the first one
    if (appData.flashcardSets.length > 0 && (!watchedSetId || !appData.flashcardSets.find(s => s.id === watchedSetId))) {
      form.setValue("setId", appData.flashcardSets[0].id);
    }

    console.log("AI Generator form updated, sets count:", appData.flashcardSets.length);
  }, [appData.flashcardSets, forceRefresh, watchedSetId, form]);


  const handleGenerate = async (values: GeneratorFormValues) => {
    setIsLoading(true);
    setGeneratedCards([]);
    try {
      const input: GenerateFlashcardsFromTextInput = { text: values.text };
      const result: GenerateFlashcardsFromTextOutput = await generateFlashcardsFromText(input);
      if (result.flashcards && result.flashcards.length > 0) {
        setGeneratedCards(result.flashcards);
        toast({ title: "Flashcards Generated", description: `${result.flashcards.length} flashcards created by AI.` });
      } else {
        toast({ title: "No Flashcards Generated", description: "The AI couldn't generate flashcards from the provided text. Try refining it.", variant: "default" });
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      toast({ title: "Generation Failed", description: "An error occurred while generating flashcards.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleAddGeneratedCardsToSet = (selectedSetId: string) => {
    if (generatedCards.length === 0 || !selectedSetId) {
      toast({ title: "Error", description: "No cards generated or no set selected.", variant: "destructive"});
      return;
    }

    const cardsToAdd: NewFlashcard[] = generatedCards.map(card => ({
      front: card.front,
      back: card.back,
      setId: selectedSetId,
    }));

    addMultipleFlashcards(cardsToAdd);

    toast({ title: "Cards Added", description: `${cardsToAdd.length} AI-generated flashcards added to the set '${appData.flashcardSets.find(s => s.id === selectedSetId)?.name || 'selected set'}.'` });
    setGeneratedCards([]);
    form.resetField("text");

    // Force a refresh to ensure the UI updates
    setForceRefresh(prev => prev + 1);
  };

  // Function to create a new set directly from the AI Generator
  const handleCreateNewSet = () => {
    // Create a dialog to get the set name
    const setName = prompt("Enter a name for your new flashcard set:");

    if (setName && setName.trim()) {
      // Create the new set
      const newSet = addFlashcardSet({ name: setName.trim() });

      // Update the form with the new set ID
      form.setValue("setId", newSet.id);

      // Show success message
      toast({ title: "Set Created", description: `Set "${setName}" has been created.` });

      // Force a refresh to ensure the UI updates
      setForceRefresh(prev => prev + 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism-intense overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -inset-1 bg-gradient-aurora opacity-10 blur-xl -z-10"></div>

      <CardHeader className="relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-neon opacity-20 rounded-full blur-xl -z-10 animate-pulse-slow"></div>
        <CardTitle className="flex items-center">
          <div className="relative">
            <Sparkles className="mr-3 h-7 w-7 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary opacity-30 blur-md rounded-full animate-pulse-slow"></div>
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Flashcard Generator
          </span>
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerate)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="animate-float-horizontal">
                  <FormLabel htmlFor="ai-text-input" className="text-primary font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                      <path d="M9 9h1" />
                      <path d="M9 13h6" />
                      <path d="M9 17h6" />
                    </svg>
                    Paste your text here to generate flashcards:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="ai-text-input"
                      placeholder="Enter text (e.g., notes, articles, book excerpts)... Minimum 50 characters."
                      rows={10}
                      className="resize-none border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="setId"
              render={({ field }) => (
                <FormItem className="animate-float-horizontal" style={{ animationDelay: "0.2s" }}>
                  <FormLabel className="text-primary font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M8 2h8" />
                      <path d="M9 2v2.789a4 4 0 0 1-1.6 3.2l-1.8 1.35A4 4 0 0 0 4 12.54V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.46a4 4 0 0 0-1.6-3.2l-1.8-1.35A4 4 0 0 1 15 4.79V2" />
                    </svg>
                    Target flashcard set
                  </FormLabel>
                   <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={appData.flashcardSets.length === 0}
                      >
                      <FormControl>
                        <SelectTrigger className="border-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                          <SelectValue placeholder="Select a set to generate cards into" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background/80 backdrop-blur-md border-primary/20">
                        {appData.flashcardSets.length === 0 ? (
                          <SelectItem value="no-sets" disabled>No sets available. Create one first.</SelectItem>
                        ) : (
                          appData.flashcardSets.map(set => (
                            <SelectItem key={set.id} value={set.id} className="hover:bg-primary/10 transition-colors">
                              {set.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCreateNewSet}
                      className="border-primary/20 hover:border-primary/50 transition-colors"
                      title="Create New Set"
                    >
                      <PlusCircle className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-primary/10 pt-6">
            <Button
              type="submit"
              disabled={isGenerateButtonDisabled}
              className="w-full sm:w-auto relative overflow-hidden group hover-glow"
            >
              <div className="absolute inset-0 bg-gradient-aurora opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse-slow" />
                )}
                <span>Generate Flashcards</span>
              </div>
            </Button>

            {generatedCards.length > 0 && (
              <Button
                type="button"
                onClick={() => handleAddGeneratedCardsToSet(form.getValues("setId"))}
                disabled={isLoading || !form.getValues("setId")}
                className="w-full sm:w-auto relative overflow-hidden group hover-glow"
              >
                <div className="absolute inset-0 bg-gradient-ocean-deep opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Add {generatedCards.length} Cards to Set</span>
                </div>
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>

      {generatedCards.length > 0 && !isLoading && (
        <div className="p-6 border-t border-primary/10 relative overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-sunset opacity-5 blur-xl -z-10"></div>

          <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
              <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
              <path d="M9 22h9a2 2 0 0 0 2-2v-7" />
              <path d="M13 6v4" />
              <path d="M15 8h-4" />
              <path d="M17.8 14c.2-.5.2-1.2.2-1.8a6 6 0 0 0-12 0c0 .6.1 1.3.2 1.8" />
              <path d="M19 16v6" />
              <path d="M22 19h-6" />
            </svg>
            Generated Flashcards Preview
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {generatedCards.map((card, index) => (
              <Card
                key={index}
                className="p-4 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover-scale"
              >
                <p className="font-medium text-sm mb-2 text-primary">
                  <strong className="mr-1">Front:</strong> {card.front}
                </p>
                <p className="text-sm">
                  <strong className="mr-1 text-accent">Back:</strong> {card.back}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
