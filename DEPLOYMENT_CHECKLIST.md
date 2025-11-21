# 🚀 Render Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Render account created (https://render.com)
- [ ] Code pushed to GitHub
- [ ] Have all API keys ready

---

## Step 1: Prepare Repository (2 min)
- [ ] Check `.gitignore` includes `.env.local` and `.env.production`
- [ ] Commit all changes
- [ ] Push to GitHub: `git push origin main`

---

## Step 2: Deploy Backend (5 min)

### Create Service
- [ ] Go to https://render.com/dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Name: `learnoverse-backend`
- [ ] Build Command: `cd backend && npm ci && npm run build`
- [ ] Start Command: `cd backend && npm start`

### Add Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001`
- [ ] `SUPABASE_URL` = (your Supabase URL)
- [ ] `SUPABASE_SERVICE_KEY` = (your Supabase service key)
- [ ] `GOOGLE_API_KEY` = (your Google API key)
- [ ] `CORS_ORIGIN` = (leave empty for now)

### Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 min)
- [ ] Copy backend URL
- [ ] Test: Open `https://YOUR-BACKEND-URL/health`
- [ ] Should see: `{"status":"ok",...}`

---

## Step 3: Deploy Frontend (5 min)

### Create Service
- [ ] Click "New +" → "Static Site"
- [ ] Connect same GitHub repository
- [ ] Name: `learnoverse-frontend`
- [ ] Build Command: `cd frontend && npm ci && npm run build`
- [ ] Publish Directory: `frontend/dist`

### Add Environment Variables
- [ ] `VITE_API_URL` = `https://YOUR-BACKEND-URL/api`
- [ ] `VITE_SUPABASE_URL` = (your Supabase URL)
- [ ] `VITE_SUPABASE_ANON_KEY` = (your Supabase ANON key)
- [ ] `VITE_GOOGLE_API_KEY` = (your Google API key)
- [ ] `VITE_GOOGLE_API_KEY_2` = (optional)
- [ ] `VITE_GOOGLE_API_KEY_3` = (optional)
- [ ] `VITE_GOOGLE_DRIVE_API_KEY` = (your Drive API key)
- [ ] `VITE_DRIVE_MAIN_FOLDER_ID` = (your Drive folder ID)

### Deploy & Test
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (3-5 min)
- [ ] Copy frontend URL

---

## Step 4: Connect Services (2 min)
- [ ] Go to Backend Service → Environment tab
- [ ] Update `CORS_ORIGIN` = `https://YOUR-FRONTEND-URL`
- [ ] Save (backend will redeploy)
- [ ] Wait 2 minutes

---

## Step 5: Final Testing
- [ ] Open frontend URL
- [ ] Try uploading a document
- [ ] Try chat feature
- [ ] Check all features work
- [ ] Check browser console for errors

---

## ✅ Deployment Complete!

Your URLs:
- Frontend: `https://learnoverse-frontend.onrender.com`
- Backend: `https://learnoverse-backend.onrender.com`
- API: `https://learnoverse-backend.onrender.com/api`

---

## If Something Goes Wrong

### Frontend shows error:
1. Check environment variables in Render
2. Check browser console (F12)
3. Verify `VITE_API_URL` is correct

### Backend not responding:
1. Check backend logs in Render
2. Verify all environment variables are set
3. Test health endpoint: `/health`

### CORS errors:
1. Verify `CORS_ORIGIN` matches frontend URL exactly
2. No trailing slash in URLs
3. Backend redeployed after changing CORS

### Build failed:
1. Check build logs in Render
2. Verify build commands are correct
3. Check all dependencies in `package.json`

---

## Need Help?
- Read: `RENDER_DEPLOYMENT_GUIDE.md` (detailed guide)
- Render Docs: https://render.com/docs
- Check Logs: Service → Logs tab in Render

---

## After Deployment

### Optional Steps:
- [ ] Add custom domain
- [ ] Set up monitoring
- [ ] Enable analytics
- [ ] Upgrade to paid plan (if needed)
- [ ] Share with users!

### Security:
- [ ] Verify no secrets in GitHub
- [ ] Enable Supabase RLS
- [ ] Set API usage limits
- [ ] Monitor API costs

---

**Total Time: ~15 minutes** ⏱️
