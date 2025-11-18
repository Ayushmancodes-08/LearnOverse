# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment to Render.

## Pre-Deployment

### Code Ready
- [ ] All changes committed
- [ ] Code tested locally (`npm run dev`)
- [ ] Build works locally (`npm run build`)
- [ ] No console errors
- [ ] All features working

### Environment Variables Collected
- [ ] Supabase URL
- [ ] Supabase Service Key
- [ ] Supabase Anon Key
- [ ] Google API Keys (1, 2, 3)
- [ ] Google Drive API Key
- [ ] Google Drive Folder ID

### GitHub Ready
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] `render.yaml` file exists in root
- [ ] All files committed (check `git status`)

## Deployment Steps

### Step 1: Push to GitHub
- [ ] Run `git add -A`
- [ ] Run `git commit -m "Deploy to Render"`
- [ ] Run `git push origin main`
- [ ] Verify on GitHub that files are pushed

### Step 2: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render to access GitHub
- [ ] Verify email

### Step 3: Deploy with Blueprint
- [ ] Click "New" → "Blueprint"
- [ ] Select your GitHub repository
- [ ] Verify `render.yaml` is detected
- [ ] Click "Apply"
- [ ] Wait for services to be created

### Step 4: Configure Backend
- [ ] Go to backend service
- [ ] Click "Environment" tab
- [ ] Add `SUPABASE_URL`
- [ ] Add `SUPABASE_SERVICE_KEY`
- [ ] Add `GOOGLE_API_KEY`
- [ ] Add `CORS_ORIGIN` (frontend URL)
- [ ] Save changes
- [ ] Wait for redeploy

### Step 5: Configure Frontend
- [ ] Go to frontend service
- [ ] Click "Environment" tab
- [ ] Add `VITE_API_URL` (backend URL + /api)
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Add `VITE_GOOGLE_API_KEY`
- [ ] Add `VITE_GOOGLE_API_KEY_2`
- [ ] Add `VITE_GOOGLE_API_KEY_3`
- [ ] Add `VITE_GOOGLE_DRIVE_API_KEY`
- [ ] Add `VITE_DRIVE_MAIN_FOLDER_ID`
- [ ] Save changes
- [ ] Wait for redeploy

### Step 6: Update CORS
- [ ] Copy frontend URL from Render
- [ ] Go to backend service
- [ ] Update `CORS_ORIGIN` to frontend URL
- [ ] Save and redeploy

## Post-Deployment

### Verify Backend
- [ ] Visit backend URL + `/health`
- [ ] Should return `{"status":"ok","timestamp":"..."}`
- [ ] Check logs for errors
- [ ] Verify no startup errors

### Verify Frontend
- [ ] Visit frontend URL
- [ ] Page loads without errors
- [ ] Check browser console (F12)
- [ ] No CORS errors
- [ ] No API errors

### Test Features
- [ ] Upload a document
- [ ] Chat with AI
- [ ] Generate mindmap
- [ ] Generate flashcards
- [ ] Generate summary
- [ ] All features work

### Monitor
- [ ] Check backend logs
- [ ] Check frontend logs
- [ ] Monitor for errors
- [ ] Test on different browsers
- [ ] Test on mobile

## Troubleshooting

### Build Fails
- [ ] Check build logs in Render
- [ ] Verify `package.json` is committed
- [ ] Verify `package-lock.json` is committed
- [ ] Test build locally: `npm run build`

### Backend Won't Start
- [ ] Check environment variables are set
- [ ] Check logs for errors
- [ ] Verify Supabase credentials
- [ ] Check health endpoint

### Frontend Shows Blank Page
- [ ] Check browser console for errors
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check network tab for failed requests
- [ ] Verify build succeeded

### API Calls Fail
- [ ] Check CORS configuration
- [ ] Verify backend URL in frontend env
- [ ] Check backend logs
- [ ] Test API endpoints directly

## Environment Variables Reference

### Backend
```
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
GOOGLE_API_KEY=your_google_api_key
CORS_ORIGIN=https://learnoverse-frontend.onrender.com
```

### Frontend
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

## URLs After Deployment

- [ ] Frontend: `https://learnoverse-frontend.onrender.com`
- [ ] Backend: `https://learnoverse-backend.onrender.com`
- [ ] API: `https://learnoverse-backend.onrender.com/api`
- [ ] Health: `https://learnoverse-backend.onrender.com/health`

## Auto-Deploy Enabled

- [ ] Verify auto-deploy is enabled
- [ ] Test by pushing a small change
- [ ] Verify Render rebuilds automatically

## Final Checks

- [ ] All features working
- [ ] No console errors
- [ ] No API errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Share URL with team

## Success! 🎉

Your app is now deployed and live on Render!

- Frontend: https://learnoverse-frontend.onrender.com
- Backend: https://learnoverse-backend.onrender.com

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Monitor logs regularly
- [ ] Set up error tracking
- [ ] Plan for scaling if needed
- [ ] Document deployment process for team

---

**Deployment Complete!** 🚀

For issues, see [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) troubleshooting section.
