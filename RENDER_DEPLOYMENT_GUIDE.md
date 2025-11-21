# Complete Render Deployment Guide (GitHub)

## 🚀 Deploy Your App to Render in 15 Minutes

### Prerequisites
- GitHub account
- Render account (free at https://render.com)
- Your code pushed to GitHub
- API keys ready (Google, Supabase)

---

## Part 1: Prepare Your Repository (5 minutes)

### Step 1: Update .gitignore
Make sure sensitive files are NOT committed:

```bash
# Check if .env files are ignored
type .gitignore
```

Your `.gitignore` should include:
```
.env.local
.env.production
node_modules
dist
```

### Step 2: Commit and Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

If you don't have a GitHub repo yet:
```bash
# Create repo on GitHub first, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Part 2: Deploy Backend to Render (5 minutes)

### Step 1: Create Backend Service

1. Go to https://render.com/dashboard
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Click **"Connect GitHub"** (if first time)
5. Find and select your repository
6. Click **"Connect"**

### Step 2: Configure Backend Service

Fill in these settings:

**Basic Settings:**
- **Name**: `learnoverse-backend` (or any name you want)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  cd backend && npm ci && npm run build
  ```
- **Start Command**: 
  ```
  cd backend && npm start
  ```

**Instance Type:**
- Select **"Free"** (or paid if you need)

### Step 3: Add Backend Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**.

Add these one by one:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | production |
| `PORT` | `3001` | 3001 |
| `SUPABASE_URL` | Your Supabase URL | https://xxx.supabase.co |
| `SUPABASE_SERVICE_KEY` | Your Supabase service key | eyJhbGc... |
| `GOOGLE_API_KEY` | Your Google API key | AIzaSy... |
| `CORS_ORIGIN` | Leave empty for now | (we'll add later) |

**Where to get these keys:**
- Supabase: https://app.supabase.com → Your Project → Settings → API
- Google API: https://console.cloud.google.com → APIs & Services → Credentials

### Step 4: Deploy Backend

1. Click **"Create Web Service"** (bottom)
2. Wait 3-5 minutes for deployment
3. Once deployed, you'll see: **"Your service is live 🎉"**
4. Copy your backend URL (e.g., `https://learnoverse-backend.onrender.com`)

### Step 5: Test Backend

Open in browser:
```
https://YOUR-BACKEND-URL.onrender.com/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

✅ Backend is ready!

---

## Part 3: Deploy Frontend to Render (5 minutes)

### Step 1: Create Frontend Service

1. Go back to Render Dashboard
2. Click **"New +"** button
3. Select **"Static Site"**
4. Select your same repository
5. Click **"Connect"**

### Step 2: Configure Frontend Service

**Basic Settings:**
- **Name**: `learnoverse-frontend` (or any name)
- **Branch**: `main`
- **Root Directory**: Leave empty

**Build & Deploy:**
- **Build Command**: 
  ```
  cd frontend && npm ci && npm run build
  ```
- **Publish Directory**: 
  ```
  frontend/dist
  ```

### Step 3: Add Frontend Environment Variables

Add these environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (NOT service key) |
| `VITE_GOOGLE_API_KEY` | Your Google API key |
| `VITE_GOOGLE_API_KEY_2` | Your Google API key 2 (optional) |
| `VITE_GOOGLE_API_KEY_3` | Your Google API key 3 (optional) |
| `VITE_GOOGLE_DRIVE_API_KEY` | Your Google Drive API key |
| `VITE_DRIVE_MAIN_FOLDER_ID` | Your Google Drive folder ID |

**Important:** 
- Replace `YOUR-BACKEND-URL` with actual backend URL from Step 4
- Use **anon key** for frontend, NOT service key

### Step 4: Deploy Frontend

1. Click **"Create Static Site"**
2. Wait 3-5 minutes for deployment
3. Once deployed, copy your frontend URL (e.g., `https://learnoverse-frontend.onrender.com`)

✅ Frontend is ready!

---

## Part 4: Connect Frontend & Backend (2 minutes)

### Step 1: Update Backend CORS

1. Go to your **Backend Service** in Render
2. Click **"Environment"** tab
3. Find `CORS_ORIGIN` variable
4. Update value to your frontend URL: `https://learnoverse-frontend.onrender.com`
5. Click **"Save Changes"**
6. Backend will automatically redeploy (1-2 minutes)

### Step 2: Test Your App

1. Open your frontend URL: `https://learnoverse-frontend.onrender.com`
2. Try uploading a document
3. Try chatting with AI
4. Check if everything works!

---

## 🎉 You're Live!

Your app is now deployed:
- **Frontend**: https://learnoverse-frontend.onrender.com
- **Backend**: https://learnoverse-backend.onrender.com
- **API**: https://learnoverse-backend.onrender.com/api
- **Health**: https://learnoverse-backend.onrender.com/health

---

## Common Issues & Solutions

### Issue 1: "Application Error" on Frontend
**Solution:** Check environment variables are set correctly in Render dashboard.

### Issue 2: API Calls Failing
**Solution:** 
1. Verify `VITE_API_URL` points to correct backend URL
2. Check `CORS_ORIGIN` in backend matches frontend URL
3. Check backend logs: Backend Service → Logs tab

### Issue 3: "No Google API keys configured"
**Solution:** Make sure all `VITE_GOOGLE_API_KEY` variables are set in frontend environment.

### Issue 4: Build Failed
**Solution:**
1. Check build logs in Render
2. Verify build commands are correct
3. Make sure `package.json` has all dependencies

### Issue 5: Backend Sleeping (Free Plan)
**Note:** Free tier services sleep after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

**Solution:** Upgrade to paid plan ($7/month) for always-on service.

---

## Updating Your App

### When you make code changes:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will automatically:
1. Detect the push
2. Rebuild your services
3. Deploy new version
4. Takes 3-5 minutes

---

## Monitoring & Logs

### View Logs:
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time logs

### View Metrics:
1. Click **"Metrics"** tab
2. See CPU, memory, bandwidth usage

---

## Cost Breakdown

### Free Plan (What you get):
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ✅ Automatic deploys from GitHub
- ✅ Custom domains
- ❌ Services sleep after 15 min inactivity
- ❌ Limited bandwidth

### Paid Plan ($7/month per service):
- ✅ Always-on (no sleeping)
- ✅ More resources
- ✅ Priority support
- ✅ More bandwidth

**Recommendation:** Start with free, upgrade backend to paid if needed.

---

## Security Checklist

Before going live:

- [ ] All API keys are in Render environment variables (NOT in code)
- [ ] `.env.local` and `.env.production` are in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] CORS is configured correctly
- [ ] Supabase Row Level Security (RLS) is enabled
- [ ] Google API keys have usage limits set

---

## Custom Domain (Optional)

### Add your own domain:

1. Go to your Frontend service in Render
2. Click **"Settings"** tab
3. Scroll to **"Custom Domain"**
4. Click **"Add Custom Domain"**
5. Enter your domain (e.g., `learnoverse.com`)
6. Follow DNS instructions
7. Wait for SSL certificate (automatic)

---

## Backup & Rollback

### Rollback to previous version:
1. Go to service in Render
2. Click **"Events"** tab
3. Find previous successful deploy
4. Click **"Rollback"**

### Manual Backup:
```bash
# Backup your database (Supabase)
# Go to Supabase Dashboard → Database → Backups
```

---

## Support

### Need Help?

1. **Render Docs**: https://render.com/docs
2. **Render Community**: https://community.render.com
3. **Check Logs**: Service → Logs tab
4. **Status Page**: https://status.render.com

### Common Commands

```bash
# View local logs
npm run dev

# Test build locally
cd frontend && npm run build
cd backend && npm run build

# Check for errors
npm run lint
```

---

## Next Steps

After deployment:

1. ✅ Test all features thoroughly
2. ✅ Set up monitoring/alerts
3. ✅ Add custom domain
4. ✅ Enable analytics
5. ✅ Share with users!

---

## Quick Reference

### Backend Service
- **Build**: `cd backend && npm ci && npm run build`
- **Start**: `cd backend && npm start`
- **Health**: `/health`

### Frontend Service
- **Build**: `cd frontend && npm ci && npm run build`
- **Publish**: `frontend/dist`

### Environment Variables
- Backend: `NODE_ENV`, `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `GOOGLE_API_KEY`, `CORS_ORIGIN`
- Frontend: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_API_KEY`

---

**That's it! Your app is live on Render! 🚀**
