# Deploying MindFlip to Vercel

This guide will help you deploy the MindFlip application to Vercel for your hackathon submission.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Your MindFlip project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Import Your Project to Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Vercel will automatically detect that it's a Next.js project

### 3. Configure Project Settings

1. **Project Name**: Enter a name for your deployment (e.g., "mindflip")
2. **Framework Preset**: Ensure "Next.js" is selected
3. **Root Directory**: Leave as default (if your project is in the root)
4. **Build and Output Settings**: Leave as default

### 4. Environment Variables

If needed, add any environment variables from your `.env.local` file.

### 5. Deploy

Click "Deploy" and wait for the build to complete.

### 6. Access Your Deployed Application

Once deployed, you'll receive a URL (e.g., `https://mindflip.vercel.app`) where your application is live.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in Vercel for specific errors
2. Ensure all dependencies are properly listed in `package.json`
3. Verify that your Next.js configuration is correct
4. Make sure any environment variables required by your app are set in Vercel

## Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain and follow the instructions

## Continuous Deployment

By default, Vercel will automatically redeploy your application whenever you push changes to your repository.

---

Good luck with your hackathon submission!
