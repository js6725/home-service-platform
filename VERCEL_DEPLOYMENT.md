# Vercel Deployment Instructions

## Quick Setup

1. **Go to Vercel**: https://vercel.com
2. **Sign in with GitHub**
3. **Import Project**: Click "New Project" → Import from GitHub
4. **Select Repository**: `js6725/home-service-platform`
5. **Configure Project**:
   - Project Name: `home-service-project`
   - Framework Preset: Vite (should auto-detect)
   - Root Directory: `./` (default)

## Environment Variables

Add these in Vercel project settings → Environment Variables:

```
VITE_SUPABASE_URL=https://rrwfeuiwfhcvwuqpavnl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyd2ZldWl3Zmhjdnd1cXBhdm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzQ2ODMsImV4cCI6MjA2NDkxMDY4M30.CShv9ZtK8vYjOMt6BpHo22VTN8Wt-4WdlCVTTZr45a4
```

## Build Settings

Vercel should auto-detect these from `vercel.json`:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Domain

Your app will be available at:
- `home-service-project.vercel.app` (or similar)
- Custom domain can be added later

## Deployment

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Test the deployed application

## Auto-Deployment

- Every push to `master` branch will trigger automatic deployment
- Preview deployments for pull requests
- Instant rollbacks available

## Post-Deployment Testing

1. Visit the deployed URL
2. Test login with email magic link
3. Verify dashboard loads correctly
4. Check all navigation routes work

The application is configured for production deployment with proper error handling and security.

