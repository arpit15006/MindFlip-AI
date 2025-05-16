import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use either NEXT_PUBLIC_GEMINI_API_KEY (for Vercel) or GEMINI_API_KEY (for local development)
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Log a warning if no API key is found
if (!apiKey) {
  console.warn('No Gemini API key found. AI features will not work.');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: apiKey,
  })],
  model: 'googleai/gemini-2.0-flash',
});
