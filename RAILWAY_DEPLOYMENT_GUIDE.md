# Complete Railway Deployment Guide

Deploy your full-stack app (React + Express) on Railway in 15 minutes.

## What is Railway?

Railway is a modern deployment platform that:
- ✅ Deploys from GitHub automatically
- ✅ Manages environment variables
- ✅ Auto-scales your app
- ✅ Provides free tier
- ✅ No credit card required initially

## Prerequisites

1. **GitHub Account** - Code must be on GitHub
2. **Railway Account** - Free at https://railway.app
3. **Environment Variables** - Collected and ready
4. **Code Committed** - All changes pushed to GitHub

## Part 1: Prepare Your Code

### Step 1.1: Verify Project Structure

Your project should have:
```
project-root/
├── src/                    ✅ Frontend code
├── backend/                ✅ Backend code
├── package.json            ✅ Root config
├── backend/package.json    ✅ Backend config
└── vite.config.ts          ✅ Frontend build config
```

### Step 1.2: Commit All Changes

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

Verify on GitHub that all files are pushed.

### Step 1.3: Collect Environment Variables

Create a list of all variables you need:

**Frontend Variables (VITE_*):**
- `VITE_API_URL` = `/api`
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
- `VITE_GOOGLE_API_KEY` = Your Google API key
- `VITE_GOOGLE_API_KEY_2` = Your Google API key 2
- `VITE_GOOGLE_API_KEY_3` = Your Google API key 3
- `VITE_GOOGLE_DRIVE_API_KEY` = Your Google Drive API key
- `VITE_DRIVE_MAIN_FOLDER_ID` = Your Drive folder ID

**Backend Variables:**
- `SUPABASE_URL` = Your Supabase URL
- `SUPABASE_SERVICE_KEY` = Your Supabase service key
- `GOOGLE_API_KEY` = Your Google API key
- `PORT` = `3000`
- `NODE_ENV` = `production`
- `CORS_ORIGIN` = Will be set after deployment

## Part 2: Create Railway Account

### Step 2.1: Sign Up

1. Go to https://railway.app
2. Click "Start Free"
3. Choose "Sign up with GitHub"
4. Authorize Railway to acces`  our GitHub account
5. Complete signup

### Step 2.2: Verify Email

Check your email and verify your Railway account.

## Part 3: Deploy on Railway

### Step 3.1: Create New Project

1. After login, you'll see Railway dashboard
2. Click **"New Project"** button (top right)
3. Select **"Deploy from GitHub"**

### Step 3.2: Connect GitHub Repository

1. You'll see a list of your GitHub repositories
2. Find your project repository
3. Click on it to select
4. Railway will ask for permission - click **"Authorize"**

### Step 3.3: Configure Build Settings

Railway auto-detects your setup. Verify these settings:

**In the deployment screen, look for:**

- **Build Command**: Should be auto-detected
  - If not, set to: `npm install && npm run build && cd backend && npm install && npm run build`

- **Start Command**: Should be auto-detected
  - If not, set to: `cd backend && npm start`

- **Root Directory**: Leave empty (uses root)

- **Node Version**: Should be 18+ (auto-detected)

### Step 3.4: Add Environment Variables

**IMPORTANT: Do this BEFORE deploying**

1. In the deployment screen, look for **"Variables"** section
2. Click **"Add Variable"** for each variable

**Add Frontend Variables (VITE_*):**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `/api` |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your anon key |
| `VITE_GOOGLE_API_KEY` | Your API key |
| `VITE_GOOGLE_API_KEY_2` | Your API key 2 |
| `VITE_GOOGLE_API_KEY_3` | Your API key 3 |
| `VITE_GOOGLE_DRIVE_API_KEY` | Your Drive API key |
| `VITE_DRIVE_MAIN_FOLDER_ID` | Your folder ID |

**Add Backend Variables:**

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Your service key |
| `GOOGLE_API_KEY` | Your API key |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | Leave empty for now |

### Step 3.5: Deploy

1. Click **"Deploy"** button
2. Railway will start building your app
3. Watch the build logs (should take 5-10 minutes)
4. When complete, you'll see a green checkmark

## Part 4: Get Your Deployment URL

### Step 4.1: Find Your URL

1. After deployment completes, go to your project dashboard
2. Click on your service/project
3. Look for **"Domains"** section
4. You'll see a URL like: `https://your-app-production.up.railway.app`

### Step 4.2: Update CORS_ORIGIN

1. Go back to Variables
2. Add/Update `CORS_ORIGIN` with your Railway URL
3. Example: `https://your-app-production.up.railway.app`
4. Click **"Redeploy"** to apply changes

## Part 5: Verify Deployment

### Step 5.1: Test Frontend

1. Visit your Railway URL: `https://your-app-production.up.railway.app`
2. Your React app should load
3. Check browser console (F12) for errors

### Step 5.2: Test Backend Health

1. Visit: `https://your-app-production.up.railway.app/api/health`
2. Should return: `{"status":"ok","timestamp":"..."}`

### Step 5.3: Test Features

- [ ] Upload a document
- [ ] Chat with AI
- [ ] Generate mindmap
- [ ] Generate flashcards
- [ ] Generate summary

## Part 6: Monitor Your App

### Step 6.1: View Logs

1. In Railway dashboard, click your project
2. Click **"Logs"** tab
3. See real-time logs of your app

### Step 6.2: Check Metrics

1. Click **"Metrics"** tab
2. Monitor CPU, memory, network usage
3. Check for errors or warnings

### Step 6.3: View Deployments

1. Click **"Deployments"** tab
2. See deployment history
3. Rollback if needed

## Part 7: Auto-Deployment Setup

### Step 7.1: Enable Auto-Deploy

Railway automatically deploys when you push to GitHub!

Every time you:
```bash
git push origin main
```

Railway will:
1. Detect the change
2. Build your app
3. Deploy automatically
4. Update your live app

### Step 7.2: Disable Auto-Deploy (Optional)

If you want manual deployments:
1. Go to project settings
2. Find "Auto-Deploy" option
3. Toggle OFF

## Troubleshooting

### Build Fails

**Error: "npm: command not found"**
- Solution: Node.js not installed. Railway should handle this automatically.

**Error: "Cannot find module"**
- Solution: Missing dependencies. Run `npm install` locally and commit `package-lock.json`

**Error: "TypeScript compilation failed"**
- Solution: Fix TypeScript errors locally first

### App Won't Start

**Error: "Port already in use"**
- Solution: Make sure `PORT` environment variable is set to `3000`

**Error: "Cannot connect to database"**
- Solution: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct

### API Calls Fail

**Error: "404 Not Found"**
- Solution: Check `/api/health` endpoint first
- Verify backend is running

**Error: "CORS error"**
- Solution: Update `CORS_ORIGIN` environment variable
- Redeploy after updating

**Error: "API key invalid"**
- Solution: Verify `GOOGLE_API_KEY` is correct
- Check it's not expired

### Frontend Won't Load

**Error: "Blank page"**
- Solution: Check browser console (F12)
- Check Railway logs

**Error: "404 on root"**
- Solution: Verify build succeeded
- Check `dist/` folder was created

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

## Deployment Checklist

### Before Deployment
- [ ] All code committed to GitHub
- [ ] `npm run build:full` succeeds locally
- [ ] All environment variables collected
- [ ] Railway account created
- [ ] GitHub connected to Railway

### During Deployment
- [ ] Build command set correctly
- [ ] Start command set correctly
- [ ] All environment variables added
- [ ] Deployment completes successfully

### After Deployment
- [ ] Frontend loads at root URL
- [ ] `/api/health` returns status ok
- [ ] Features work (upload, chat, etc.)
- [ ] No console errors
- [ ] Logs show no errors

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build takes too long | Normal (5-10 min first time) |
| App crashes on startup | Check logs, verify env vars |
| API calls return 404 | Verify backend is running |
| CORS errors | Update CORS_ORIGIN env var |
| Frontend shows blank page | Check browser console |
| Database connection fails | Verify Supabase credentials |

## Performance Tips

1. **Monitor Logs** - Check for errors regularly
2. **Update Dependencies** - Keep packages up to date
3. **Optimize Images** - Reduce frontend bundle size
4. **Cache Responses** - Use caching headers
5. **Monitor Metrics** - Watch CPU and memory usage

## Scaling Your App

### Free Tier Limits
- 500 hours/month
- Shared resources
- Good for development

### Upgrade to Paid
- Unlimited hours
- Dedicated resources
- Better performance
- Priority support

To upgrade:
1. Go to Railway account settings
2. Click "Billing"
3. Add payment method
4. Select plan

## Next Steps

1. **Monitor Your App** - Check logs regularly
2. **Set Up Alerts** - Get notified of issues
3. **Optimize Performance** - Monitor metrics
4. **Plan Updates** - Push changes to GitHub
5. **Scale When Needed** - Upgrade plan if needed

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Community**: https://railway.app/community
- **GitHub Issues**: Create issue in your repo
- **Email Support**: support@railway.app

## Summary

Your app is now deployed on Railway!

**URL**: `https://your-app-production.up.railway.app`
**Frontend**: `/`
**API**: `/api`
**Database**: Supabase
**Auto-Deploy**: Enabled (push to GitHub to update)

Everything is live and ready to use! 🚀

## Quick Reference

```bash
# Local development
npm run dev                    # Frontend
cd backend && npm run dev      # Backend

# Build for production
npm run build:full

# Deploy
git push origin main           # Auto-deploys to Railway

# View logs
# Go to Railway dashboard → Logs tab

# Update environment variables
# Go to Railway dashboard → Variables tab → Redeploy
```

That's it! Your app is deployed and ready! 🎉
