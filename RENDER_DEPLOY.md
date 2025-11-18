# 🚀 Easy Render Deployment Guide

Deploy your LearnOverse app to Render in 10 minutes!

## Prerequisites

- GitHub account
- Render account (free at https://render.com)
- Code pushed to GitHub

## Step 1: Push to GitHub (2 minutes)

```bash
git add -A
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Create Render Account (1 minute)

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub
4. Authorize Render

## Step 3: Deploy with Blueprint (5 minutes)

### Option A: Automatic (Recommended)

1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click "Apply"
6. Wait 5-10 minutes for deployment

### Option B: Manual Setup

If automatic doesn't work, follow these steps:

#### Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `learnoverse-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm ci && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   GOOGLE_API_KEY=your_google_api_key
   CORS_ORIGIN=https://learnoverse-frontend.onrender.com
   ```

5. Click "Create Web Service"

#### Deploy Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `learnoverse-frontend`
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://learnoverse-backend.onrender.com/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_GOOGLE_API_KEY_2=your_google_api_key_2
   VITE_GOOGLE_API_KEY_3=your_google_api_key_3
   VITE_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
   VITE_DRIVE_MAIN_FOLDER_ID=your_drive_folder_id
   ```

5. Click "Create Static Site"

## Step 4: Update CORS (2 minutes)

After both services are deployed:

1. Go to backend service settings
2. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://learnoverse-frontend.onrender.com
   ```
3. Save and redeploy

## Step 5: Test (1 minute)

1. Visit your frontend URL: `https://learnoverse-frontend.onrender.com`
2. Test features:
   - Upload a document
   - Chat with AI
   - Generate mindmap

## Environment Variables Reference

### Backend Variables

```bash
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
GOOGLE_API_KEY=your_google_api_key_here
CORS_ORIGIN=https://learnoverse-frontend.onrender.com
```

### Frontend Variables

```bash
VITE_API_URL=https://learnoverse-backend.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_API_KEY_2=your_google_api_key_2_here
VITE_GOOGLE_API_KEY_3=your_google_api_key_3_here
VITE_GOOGLE_DRIVE_API_KEY=your_drive_api_key_here
VITE_DRIVE_MAIN_FOLDER_ID=your_folder_id_here
```

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Solution: Make sure `package.json` and `package-lock.json` are committed

**Error: "Build command failed"**
- Solution: Test build locally first:
  ```bash
  cd frontend && npm run build
  cd backend && npm run build
  ```

### Backend Won't Start

**Error: "Application failed to respond"**
- Solution: Check environment variables are set correctly
- Check logs in Render dashboard

### Frontend Shows Blank Page

**Error: "Failed to fetch"**
- Solution: Check `VITE_API_URL` points to backend URL
- Check CORS is configured correctly

### API Calls Fail

**Error: "CORS error"**
- Solution: Update backend `CORS_ORIGIN` to frontend URL
- Redeploy backend after updating

## Auto-Deploy

Render automatically deploys when you push to GitHub:

```bash
git add -A
git commit -m "Update feature"
git push origin main
```

Render will:
1. Detect the push
2. Build your app
3. Deploy automatically
4. Update live site

## Free Tier Limits

- 750 hours/month per service
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds

## Upgrade to Paid Plan

For better performance:
- No cold starts
- Dedicated resources
- $7/month per service

## URLs

After deployment, you'll have:
- **Frontend**: `https://learnoverse-frontend.onrender.com`
- **Backend**: `https://learnoverse-backend.onrender.com`
- **API**: `https://learnoverse-backend.onrender.com/api`

## Monitoring

### View Logs
1. Go to Render dashboard
2. Click on service
3. Click "Logs" tab

### View Metrics
1. Go to Render dashboard
2. Click on service
3. Click "Metrics" tab

## Custom Domain (Optional)

1. Go to service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

## Summary

✅ **Backend**: Node.js service running Express.js
✅ **Frontend**: Static site with React + Vite
✅ **Auto-deploy**: Enabled on push to GitHub
✅ **Free tier**: 750 hours/month per service
✅ **URLs**: Provided by Render

## Quick Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy to Render
git push origin main
```

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://render.com/community
- **GitHub Issues**: Create issue in your repo

---

**That's it!** Your app is now deployed on Render! 🎉

Visit your frontend URL to see it live.
