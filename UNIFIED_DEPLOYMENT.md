# Unified Frontend + Backend Deployment Guide

Deploy both frontend and backend together on a single platform with zero complexity.

## Architecture

```
Single Platform (Railway/Render)
├── Frontend (React/Vite) → /
├── Backend (Express) → /api
└── Database (Supabase)
```

## Step 1: Prepare Project Structure

Your project is already set up correctly:
```
project-root/
├── src/                    (Frontend React code)
├── backend/                (Backend Express code)
├── package.json            (Root config)
└── backend/package.json    (Backend config)
```

## Step 2: Update API Client (Frontend)

The frontend already uses relative API paths. Verify:

```typescript
// src/lib/api-client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

This works for:
- **Local**: `http://localhost:3001/api`
- **Production**: `/api` (same domain)

## Step 3: Deploy on Railway (Recommended - Easiest)

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### 3.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Click "Deploy"

### 3.3 Configure Build Settings

Railway auto-detects your setup. Verify in project settings:

**Build Command:**
```bash
npm install && npm run build && cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

**Root Directory:** Leave empty (uses root)

### 3.4 Add Environment Variables

In Railway dashboard → Variables:

**Frontend Variables (VITE_*):**
```
VITE_API_URL=/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_GOOGLE_API_KEY_2=your-google-api-key-2
VITE_GOOGLE_API_KEY_3=your-google-api-key-3
VITE_GOOGLE_DRIVE_API_KEY=your-drive-api-key
VITE_DRIVE_MAIN_FOLDER_ID=your-folder-id
```

**Backend Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
GOOGLE_API_KEY=your-google-api-key
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app.railway.app
```

### 3.5 Deploy

1. Click "Deploy"
2. Wait 5-10 minutes
3. Get your URL: `https://your-app.railway.app`

## Step 4: Verify Deployment

### Test Frontend
```
https://your-app.railway.app
```
Should load your React app.

### Test Backend
```
https://your-app.railway.app/api/health
```
Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test Features
- Upload document
- Chat with AI
- Generate mindmap
- Generate flashcards
- Generate summary

## How It Works

```
User Browser
    ↓
https://your-app.railway.app
    ↓
Express Server (Backend)
├── Serves frontend from dist/
├── Handles /api/* routes
└── Connects to Supabase
    ↓
Frontend loads
    ↓
User clicks button
    ↓
Frontend calls /api/chat (same domain)
    ↓
Backend processes
    ↓
Response returned
    ↓
Frontend displays result
```

## Local Development

### Terminal 1: Frontend
```bash
npm run dev
# http://localhost:5173
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
# http://localhost:3001
```

Frontend automatically proxies to backend at `http://localhost:3001/api`

## Production Build

### Build Everything
```bash
npm run build
cd backend && npm run build
```

### Test Production Build
```bash
cd backend
NODE_ENV=production npm start
```

Then visit `http://localhost:3001` (backend serves frontend)

## Troubleshooting

### Frontend Won't Load
- Check Railway logs
- Verify build command succeeded
- Check `dist/` folder exists

### API Calls Fail
- Check `/api/health` endpoint
- Verify `VITE_API_URL=/api` is set
- Check backend logs for errors

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names match exactly
- Frontend variables must start with `VITE_`

## Deployment Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] `npm run build` succeeds
- [ ] `cd backend && npm run build` succeeds
- [ ] Local testing works
- [ ] Environment variables ready

After deploying:
- [ ] Frontend loads
- [ ] `/api/health` works
- [ ] Features tested
- [ ] No console errors

## Key Benefits

✅ **Single Platform** - No managing multiple services
✅ **Same Domain** - No CORS issues
✅ **Easy Deployment** - One-click deploy
✅ **Automatic Scaling** - Railway handles it
✅ **Simple Updates** - Push to GitHub, auto-deploys

## Support

- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Google Cloud: https://cloud.google.com/docs

## Summary

Your app is now deployed on a single platform!

**URL:** `https://your-app.railway.app`
**Frontend:** `/`
**API:** `/api`
**Database:** Supabase

Everything works seamlessly together. 🚀
