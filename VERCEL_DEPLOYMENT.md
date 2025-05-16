# Deploying MindFlip-AI to Vercel

This guide will help you deploy the MindFlip-AI application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Your MindFlip-AI project code

## Deployment Steps

### 1. Set Up Your Project on Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your project repository or upload your files
4. Vercel will automatically detect that it's a Next.js project

### 2. Configure Environment Variables

You need to set up the following environment variables directly in your Vercel project settings:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add the following variable:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: Your Gemini API key (paste the actual API key here)
   - Environment: Production, Preview, Development

IMPORTANT: Do NOT use Vercel secrets for this variable. Enter the actual API key value directly in the environment variable field.

Example:
```
Name: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyC1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
Environments: Production, Preview, Development
```

### 3. Deploy

1. Click "Deploy" and wait for the build to complete
2. Once deployed, Vercel will provide you with a URL where your application is live

## Troubleshooting

### Error: "The file '/vercel/path0/.next/routes-manifest.json' couldn't be found"

If you encounter this error, it's likely due to a build configuration issue. Make sure:

1. Your `next.config.js` file doesn't specify a custom `distDir`
2. The `outputDirectory` in `vercel.json` is set to `.next`
3. The build process is completing successfully

### Error: "Environment Variable 'NEXT_PUBLIC_GEMINI_API_KEY' references Secret 'gemini-api-key', which does not exist"

If you see this error, it means you've configured the environment variable incorrectly:

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" tab
3. Make sure you've added the `NEXT_PUBLIC_GEMINI_API_KEY` variable directly with the actual API key value
4. Do NOT use the `@gemini-api-key` reference format - enter the actual API key instead
5. Redeploy your application after fixing the environment variable

## Additional Notes

- The application uses client-side storage (localStorage) to store flashcard data
- No database setup is required for basic functionality
- The Gemini API key is required for the AI flashcard generation feature
