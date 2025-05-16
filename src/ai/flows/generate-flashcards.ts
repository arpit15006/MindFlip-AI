// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview Flashcard generation from text using the Gemini API.
 *
 * - generateFlashcardsFromText - A function that handles the flashcard generation process.
 * - GenerateFlashcardsFromTextInput - The input type for the generateFlashcardsFromText function.
 * - GenerateFlashcardsFromTextOutput - The return type for the generateFlashcardsFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsFromTextInputSchema = z.object({
  text: z.string().describe('The text to generate flashcards from.'),
});

export type GenerateFlashcardsFromTextInput = z.infer<
  typeof GenerateFlashcardsFromTextInputSchema
>;

const GenerateFlashcardsFromTextOutputSchema = z.object({
  flashcards: z.array(
    z.object({
      front: z.string().describe('The front of the flashcard.'),
      back: z.string().describe('The back of the flashcard.'),
    })
  ).describe('The generated flashcards.'),
});

export type GenerateFlashcardsFromTextOutput = z.infer<
  typeof GenerateFlashcardsFromTextOutputSchema
>;

export async function generateFlashcardsFromText(
  input: GenerateFlashcardsFromTextInput
): Promise<GenerateFlashcardsFromTextOutput> {
  return generateFlashcardsFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsFromTextPrompt',
  input: {schema: GenerateFlashcardsFromTextInputSchema},
  output: {schema: GenerateFlashcardsFromTextOutputSchema},
  prompt: `You are a flashcard generation expert. Given a block of text, you will generate a set of flashcards.

Text: {{{text}}}

Each flashcard should have a front and a back. The front should be a question or a term, and the back should be the answer or definition.

{{outputFormatInstructions}}`,
});

const generateFlashcardsFromTextFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFromTextFlow',
    inputSchema: GenerateFlashcardsFromTextInputSchema,
    outputSchema: GenerateFlashcardsFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
