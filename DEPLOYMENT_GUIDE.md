# Render Full-Stack Deployment Guide

This guide walks you through deploying both frontend and backend together on Render as a single service.

## Architecture

- **Single Node.js Service** running Express backend
- **Frontend** built as static files and served by Express
- **API Routes** available at `/api/*`
- **Single Domain** for both frontend and backend

## Prerequisites

1. GitHub account with your code pushed
2. Render account (https://render.com)
3. All environment variables ready:
   - Supabase URL and Anon Key
   - Google API Keys (1-3)

## Deployment Steps

### Step 1: Prepare Your Repository

Ensure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Deploy Using Blueprint (Recommended)

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Select your GitHub repository
3. Render will auto-detect `render.yaml`
4. Click **"Apply"**
5. Render will create the service automatically

### Step 4: Add Environment Variables

After the service is created:

1. Go to your service dashboard
2. Click **"Environment"** tab
3. Add these variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_API_KEY=your_google_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_API_KEY_2=your_google_api_key_2
VITE_GOOGLE_API_KEY_3=your_google_api_key_3
```

**Note:** `VITE_API_URL=/api` is already set in render.yaml

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (5-10 minutes)
3. You'll get a URL like: `https://learnoverse.onrender.com`

### Step 6: Verify Deployment

1. Visit your Render URL
2. Check browser console for errors
3. Test API calls work properly
4. Visit `/health` endpoint to verify backend is running

## Build Process

The deployment runs these commands in order:

```bash
# Install root dependencies
npm install

# Build frontend (creates dist/ folder)
npm run build

# Build backend
cd backend && npm install && npm run build
```

Then starts the server:

```bash
cd backend && npm start
```

## How It Works

1. **Frontend Build**: Vite builds React app to `dist/` folder
2. **Backend Build**: TypeScript compiles to `backend/dist/`
3. **Server Start**: Express starts and:
   - Serves API routes at `/api/*`
   - Serves static frontend files from `dist/`
   - Falls back to `index.html` for SPA routing

## Troubleshooting

### Build Fails

Check the build logs in Render dashboard:
1. Go to service → "Logs" tab
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - TypeScript compilation errors
   - Missing dependencies

### API Calls Fail

1. Check browser Network tab
2. Verify API URL is `/api` (relative path)
3. Check backend logs for errors
4. Verify environment variables are set

### Cold Starts

Free tier services spin down after 15 minutes of inactivity:
- First request takes 30-60 seconds
- Upgrade to Starter plan ($7/month) to avoid this

### CORS Issues

CORS is configured to allow:
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (local dev)
- Any origin set in `CORS_ORIGIN` env var

## Local Development

For local development, use:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

Frontend will be at `http://localhost:5173`
Backend will be at `http://localhost:3001`

## Automatic Deployments

Every push to `main` branch automatically triggers a new deployment.

To disable auto-deploy:
1. Go to service settings
2. Disable "Auto-Deploy"

## Monitoring

Monitor your deployment:
1. Check service logs in Render dashboard
2. Visit `/health` endpoint for backend status
3. Monitor resource usage in service metrics

## Scaling

To upgrade from free tier:
1. Go to service settings
2. Click "Change Plan"
3. Select Starter or higher
4. Benefits:
   - No cold starts
   - More resources
   - Better performance

## Support

For issues:
1. Check Render documentation: https://render.com/docs
2. Review build logs in dashboard
3. Check environment variables are correct
4. Verify GitHub repository is connected
