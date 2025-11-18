# Vercel Deployment Setup Summary

Your project is now configured for single-command deployment on Vercel.

## What Changed

### New Files Created
- `vercel.json` - Vercel configuration
- `api/health.ts` - Health check endpoint
- `api/chat/index.ts` - Chat API route
- `api/documents/upload.ts` - Document upload API route
- `.env.vercel` - Environment variables template
- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `API_MIGRATION_GUIDE.md` - Guide to migrate remaining routes

### Files Updated
- `package.json` - Added `@vercel/node` dependency, removed `build:full` script
- `src/lib/api-client.ts` - Changed API URL to `/api` (relative path)

## Project Structure

```
project-root/
├── src/                    # React frontend (Vite)
├── api/                    # Serverless API routes (NEW)
│   ├── documents/
│   │   └── upload.ts
│   ├── chat/
│   │   └── index.ts
│   └── health.ts
├── backend/                # Original backend (for reference)
├── dist/                   # Built frontend (generated on deploy)
├── vercel.json            # Vercel config (NEW)
└── package.json
```

## Quick Start

### 1. Commit Changes
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Add Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

**Frontend (VITE_*):**
- `VITE_API_URL=/api`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_API_KEY_2`
- `VITE_GOOGLE_API_KEY_3`
- `VITE_GOOGLE_DRIVE_API_KEY`
- `VITE_DRIVE_MAIN_FOLDER_ID`

**Backend (for API routes):**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GOOGLE_API_KEY`

### 4. Deploy
Click "Deploy" button. Done!

## How It Works

1. **Frontend**: React/Vite app built to `dist/` folder
2. **API Routes**: Files in `/api` directory become serverless functions
3. **Routing**:
   - `/` → Serves frontend
   - `/api/*` → Routes to serverless functions
4. **Environment**: Variables available to both frontend (build time) and backend (runtime)

## API Endpoints

Currently available:
- `GET /api/health` - Health check
- `POST /api/chat` - Chat endpoint
- `POST /api/documents/upload` - Document upload

## Next Steps

1. **Migrate remaining routes** from `backend/src/routes/` to `/api` directory
   - See `API_MIGRATION_GUIDE.md` for detailed instructions
   
2. **Test all endpoints** after deployment
   - Visit `/api/health` to verify backend is working
   - Test each feature in your app

3. **Monitor performance**
   - Check Vercel dashboard for function execution time
   - Optimize slow endpoints

## Deployment URL

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

Frontend: `https://your-project-name.vercel.app`
API: `https://your-project-name.vercel.app/api/*`

## Local Development

For local development:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API functions (optional)
vercel dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:3000/api` (when using `vercel dev`)

## Important Notes

- **Serverless Functions**: Each API route is a separate function
- **Execution Time**: Limited to 10 seconds (free tier)
- **Cold Starts**: First request may take 1-2 seconds
- **Stateless**: No persistent storage in functions (use database)
- **Automatic Scaling**: Vercel handles scaling automatically

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Check for TypeScript errors

### API Routes Not Working
- Verify files are in `/api` directory
- Check function logs in Vercel dashboard
- Test with: `curl https://your-app.vercel.app/api/health`

### Environment Variables Not Working
- Verify variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables

## Support

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions/serverless-functions
- Deployment Guide: See `VERCEL_DEPLOYMENT_GUIDE.md`
- API Migration: See `API_MIGRATION_GUIDE.md`

## Summary

Your project is now ready for Vercel deployment! Both frontend and backend deploy together as a single service. The frontend is served as static files, and the backend runs as serverless functions.

**To deploy**: Push to GitHub, add environment variables in Vercel dashboard, and click Deploy!
