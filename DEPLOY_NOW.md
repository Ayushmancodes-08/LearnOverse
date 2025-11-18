# 🚀 Deploy to Render NOW (10 Minutes)

## Step 1: Push to GitHub (2 min)

```bash
git add -A
git commit -m "Deploy to Render"
git push origin main
```

## Step 2: Go to Render (1 min)

1. Visit https://render.com
2. Sign up with GitHub (if not already)

## Step 3: Deploy with Blueprint (5 min)

1. Click **"New"** → **"Blueprint"**
2. Select your GitHub repository
3. Render detects `render.yaml` automatically
4. Click **"Apply"**
5. Wait 5-10 minutes ⏳

## Step 4: Add Environment Variables (2 min)

### Backend Service

Go to backend service → Environment → Add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
GOOGLE_API_KEY=your_google_api_key
CORS_ORIGIN=https://learnoverse-frontend.onrender.com
```

### Frontend Service

Go to frontend service → Environment → Add:

```
VITE_API_URL=https://learnoverse-backend.onrender.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_API_KEY_2=your_google_api_key_2
VITE_GOOGLE_API_KEY_3=your_google_api_key_3
VITE_GOOGLE_DRIVE_API_KEY=your_drive_api_key
VITE_DRIVE_MAIN_FOLDER_ID=your_folder_id
```

## Step 5: Done! ✅

Visit: `https://learnoverse-frontend.onrender.com`

---

## If Blueprint Doesn't Work

### Deploy Backend Manually

1. **New** → **Web Service**
2. **Build Command**: `cd backend && npm ci && npm run build`
3. **Start Command**: `cd backend && npm start`
4. Add environment variables (see above)
5. **Create Web Service**

### Deploy Frontend Manually

1. **New** → **Static Site**
2. **Build Command**: `cd frontend && npm ci && npm run build`
3. **Publish Directory**: `frontend/dist`
4. Add environment variables (see above)
5. **Create Static Site**

---

## Quick Troubleshooting

**Build fails?**
→ Check logs in Render dashboard

**Blank page?**
→ Check `VITE_API_URL` in frontend env vars

**API errors?**
→ Check `CORS_ORIGIN` in backend env vars

**Need help?**
→ Read [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

---

## Auto-Deploy Enabled! 🎉

Every time you push to GitHub, Render automatically deploys:

```bash
git push origin main
```

---

**That's it! Your app is live!** 🚀
