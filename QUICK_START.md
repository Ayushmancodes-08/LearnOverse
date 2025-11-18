# Quick Start - Unified Deployment

Get your app deployed in 5 minutes!

## Prerequisites

✅ GitHub account
✅ Railway account (https://railway.app)
✅ Environment variables ready

## 5-Minute Deployment

### Step 1: Push to GitHub (1 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Railway Project (1 min)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Click "Deploy"

### Step 3: Add Environment Variables (2 min)

In Railway dashboard → Variables, add:

```
VITE_API_URL=/api
VITE_SUPABASE_URL=your-value
VITE_SUPABASE_ANON_KEY=your-value
VITE_GOOGLE_API_KEY=your-value
VITE_GOOGLE_API_KEY_2=your-value
VITE_GOOGLE_API_KEY_3=your-value
VITE_GOOGLE_DRIVE_API_KEY=your-value
VITE_DRIVE_MAIN_FOLDER_ID=your-value
SUPABASE_URL=your-value
SUPABASE_SERVICE_KEY=your-value
GOOGLE_API_KEY=your-value
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app.railway.app
```

### Step 4: Wait for Deployment (1 min)
Railway automatically builds and deploys.

### Step 5: Test (1 min)
Visit: `https://your-app.railway.app`

## Done! 🚀

Your app is now live with:
- ✅ Frontend at `/`
- ✅ Backend at `/api`
- ✅ Database connected
- ✅ Auto-scaling enabled

## Local Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

## Troubleshooting

**Frontend won't load?**
- Check Railway logs
- Verify build succeeded

**API calls fail?**
- Test `/api/health`
- Check environment variables

**Need help?**
- See `UNIFIED_DEPLOYMENT.md` for detailed guide
- Check Railway docs: https://docs.railway.app

## That's It!

Your app is deployed and ready to use. 🎉
