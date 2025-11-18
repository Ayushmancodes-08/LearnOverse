# Vercel Full-Stack Deployment Guide

Deploy your entire application (frontend + backend) on Vercel using serverless functions.

## Architecture

- **Frontend**: React/Vite app deployed as static site
- **Backend**: Express routes converted to Vercel serverless functions
- **API Routes**: Located in `/api` directory
- **Single Domain**: Both frontend and backend on same Vercel domain

## Prerequisites

1. GitHub account with code pushed
2. Vercel account (https://vercel.com)
3. All environment variables ready

## Project Structure

```
project-root/
├── src/                    # React frontend
├── api/                    # Serverless API routes
│   ├── documents/
│   │   └── upload.ts
│   ├── chat/
│   │   └── index.ts
│   └── health.ts
├── backend/                # Original backend (for reference)
├── dist/                   # Built frontend (generated)
├── vercel.json            # Vercel configuration
└── package.json
```

## Deployment Steps

### Step 1: Prepare Repository

Ensure all changes are committed and pushed:

```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. In Vercel dashboard, click "Add New..." → "Project"
2. Select your GitHub repository
3. Vercel auto-detects it's a Vite project
4. Click "Import"

### Step 4: Configure Build Settings

Vercel should auto-detect these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, set them manually.

### Step 5: Add Environment Variables

1. Go to project settings → "Environment Variables"
2. Add all variables:

**Frontend Variables (VITE_*):**
```
VITE_API_URL=/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_API_KEY_2=your_google_api_key_2
VITE_GOOGLE_API_KEY_3=your_google_api_key_3
VITE_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
VITE_DRIVE_MAIN_FOLDER_ID=your_drive_folder_id
```

**Backend Variables (for API routes):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_API_KEY=your_google_api_key
```

### Step 6: Deploy

1. Click "Deploy" button
2. Wait for build to complete (2-5 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 7: Verify Deployment

1. Visit your Vercel URL
2. Check browser console for errors
3. Test API endpoints:
   - `/api/health` - Should return status ok
   - `/api/chat` - Test chat functionality
   - `/api/documents/upload` - Test document upload

## How It Works

1. **Frontend Build**: Vite builds React app to `dist/`
2. **API Routes**: Vercel automatically converts `/api` files to serverless functions
3. **Deployment**: Both frontend and API deployed together
4. **Routing**: 
   - `/` → Serves frontend from `dist/`
   - `/api/*` → Routes to serverless functions

## API Routes

All API routes are in the `/api` directory:

- `api/health.ts` → `GET /api/health`
- `api/chat/index.ts` → `POST /api/chat`
- `api/documents/upload.ts` → `POST /api/documents/upload`

Add more routes by creating new files in `/api`.

## Environment Variables

### Frontend Variables (VITE_*)
Available during build time. Prefixed with `VITE_` to be exposed to frontend.

### Backend Variables
Available at runtime in API routes. No `VITE_` prefix.

## Automatic Deployments

Every push to `main` branch automatically triggers deployment.

To disable:
1. Go to project settings
2. Disable "Automatic Deployments"

## Monitoring

Monitor your deployment:
1. Check deployment logs in Vercel dashboard
2. Visit `/api/health` for backend status
3. Monitor function execution time and errors

## Scaling

Vercel automatically scales serverless functions based on demand. No manual scaling needed.

## Limitations

- Serverless functions have execution time limits (10 seconds on free tier)
- Large file uploads may timeout
- Database connections should be pooled

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Check for TypeScript errors

### API Routes Not Working
1. Verify files are in `/api` directory
2. Check function logs in Vercel dashboard
3. Verify environment variables are set

### CORS Issues
1. Check API route CORS headers
2. Verify frontend URL matches CORS origin
3. Test with curl: `curl https://your-app.vercel.app/api/health`

## Next Steps

1. Migrate remaining backend routes to `/api` directory
2. Update API route implementations with actual logic
3. Test all features thoroughly
4. Monitor performance and errors

## Support

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions/serverless-functions
- Environment Variables: https://vercel.com/docs/projects/environment-variables
