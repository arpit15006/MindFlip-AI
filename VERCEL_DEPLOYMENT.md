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

You need to set up the following environment variables in your Vercel project settings:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" tab
3. Add the following variable:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environment: Production, Preview, Development

### 3. Deploy

1. Click "Deploy" and wait for the build to complete
2. Once deployed, Vercel will provide you with a URL where your application is live

## Troubleshooting

If you encounter the error "The file '/vercel/path0/.next/routes-manifest.json' couldn't be found", it's likely due to a build configuration issue. Make sure:

1. Your `next.config.js` file doesn't specify a custom `distDir`
2. The `outputDirectory` in `vercel.json` is set to `.next`
3. The build process is completing successfully

## Additional Notes

- The application uses client-side storage (localStorage) to store flashcard data
- No database setup is required for basic functionality
- The Gemini API key is required for the AI flashcard generation feature
