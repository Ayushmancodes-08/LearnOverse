# Complete Deployment Guide for LearnOverse

Deploy your full-stack application (React frontend + Express backend) on Render.

## Architecture Overview

```
Your App
├── Frontend: React/Vite (Static Site)
├── Backend: Express.js (Node.js Service)
└── Database: Supabase
```

## Prerequisites

1. ✅ GitHub account with code pushed
2. ✅ Render account (https://render.com)
3. ✅ Supabase project with credentials
4. ✅ Google API keys (Gemini + Drive)

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 1.2 Verify Files Exist
- ✅ `render.yaml` - Deployment configuration
- ✅ `package.json` - Root dependencies
- ✅ `backend/package.json` - Backend dependencies
- ✅ `.env.example` - Environment template

## Step 2: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Render to access your repositories
5. Complete signup

## Step 3: Deploy Using Blueprint

### 3.1 Create New Blueprint
1. In Render dashboard, click **"New +"**
2. Select **"Blueprint"**
3. Select your GitHub repository
4. Click **"Connect"**

### 3.2 Configure Blueprint
Render will auto-detect `render.yaml` and show:
- Service name: `learnoverse`
- Build command: `npm install && npm run build:full`
- Start command: `cd backend && npm start`

Click **"Apply"** to proceed.

### 3.3 Add Environment Variables

After clicking Apply, you'll see the environment variables form.

**Add these variables:**

#### Backend Variables (for Express server)
```
SUPABASE_URL = https://dslyfoloalnivimqypyo.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_API_KEY = AIzaSyAO33s8TclLYGMG1Bj88rIWm7oxqHgFP8c
```

#### Frontend Variables (for React build)
```
VITE_SUPABASE_URL = https://dslyfoloalnivimqypyo.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_API_KEY = AIzaSyAO33s8TclLYGMG1Bj88rIWm7oxqHgFP8c
VITE_GOOGLE_API_KEY_2 = AIzaSyCxw1KSYnPQs1itF0CD2Gxd46t0e-FnpPU
VITE_GOOGLE_API_KEY_3 = AIzaSyBz_ni5qVBXo2e7Ua6pLuSukvi1YkRVaUQ
VITE_GOOGLE_DRIVE_API_KEY = AIzaSyDpVe1t0JGyui6V8NAHuBuFeFwepAtyepM
VITE_DRIVE_MAIN_FOLDER_ID = 1rUgb6S6fYMQQUV8o29X---3jJxld_xEd
```

**Note:** `VITE_API_URL=/api` is already set in `render.yaml`

### 3.4 Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (5-10 minutes)
3. Check logs for any errors
4. Once complete, you'll get a URL like: `https://learnoverse.onrender.com`

## Step 4: Verify Deployment

### 4.1 Test Frontend
1. Visit your Render URL: `https://learnoverse.onrender.com`
2. Check browser console for errors (F12)
3. Verify page loads correctly

### 4.2 Test Backend
1. Visit health endpoint: `https://learnoverse.onrender.com/api/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### 4.3 Test Features
- [ ] Upload a document
- [ ] Chat with the document
- [ ] Generate mindmap
- [ ] Generate flashcards
- [ ] Generate summary

## Step 5: Monitor Deployment

### 5.1 View Logs
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. Check for errors or warnings

### 5.2 Check Performance
1. Click **"Metrics"** tab
2. Monitor CPU, memory, and network usage

## Troubleshooting

### Build Fails
**Error:** Build command failed

**Solution:**
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Check for TypeScript errors: `npm run build`
4. Ensure `backend/package.json` has all dependencies

### API Calls Fail
**Error:** 404 or CORS errors

**Solution:**
1. Verify backend is running: Check `/api/health`
2. Check browser Network tab for actual error
3. Verify `VITE_API_URL=/api` is set
4. Check backend logs for errors

### Cold Starts
**Issue:** First request takes 30-60 seconds

**Solution:**
- This is normal on free tier
- Upgrade to Starter plan ($7/month) to avoid cold starts

### Environment Variables Not Working
**Error:** Variables undefined in code

**Solution:**
1. Verify variables are set in Render dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. For frontend: Variables must start with `VITE_`

## Environment Variables Reference

### Where to Get Values

**Supabase:**
1. Go to https://supabase.com
2. Select your project
3. Settings → API
4. Copy `Project URL` and `anon public key`

**Google API Keys:**
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable APIs: Generative AI, Google Drive
4. Create API key credentials
5. Copy the keys

**Google Drive Folder ID:**
1. Open your Google Drive folder
2. Copy ID from URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

## Local Development

For local testing before deployment:

### Terminal 1: Frontend
```bash
npm run dev
# Runs at http://localhost:5173
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
# Runs at http://localhost:3001
```

## Deployment URL

After successful deployment:
```
Frontend: https://learnoverse.onrender.com
API: https://learnoverse.onrender.com/api/*
```

## Important Notes

### Free Tier Limitations
- ⚠️ Cold starts: 30-60 seconds after 15 minutes of inactivity
- ⚠️ Limited resources
- ⚠️ Slower performance

### Upgrade to Starter Plan
- ✅ No cold starts
- ✅ Better performance
- ✅ More resources
- Cost: $7/month

## Next Steps

1. ✅ Deploy on Render
2. ✅ Test all features
3. ✅ Monitor performance
4. ✅ Set up error tracking (optional)
5. ✅ Configure custom domain (optional)

## Support

- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- Google Cloud Docs: https://cloud.google.com/docs

## Deployment Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] `render.yaml` exists in root
- [ ] `package.json` has `build:full` script
- [ ] Backend `package.json` has all dependencies
- [ ] Environment variables collected

After deploying:
- [ ] Frontend loads without errors
- [ ] `/api/health` returns status ok
- [ ] Document upload works
- [ ] Chat functionality works
- [ ] All features tested

## Summary

Your app is now deployed on Render! Both frontend and backend are running together on a single service. The frontend is served as static files, and the backend handles API requests.

**Your deployment URL:** `https://learnoverse.onrender.com`

**Questions?** Check the troubleshooting section or Render documentation.
