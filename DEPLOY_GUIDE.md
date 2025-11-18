# Complete Deployment Guide - 100% Working

Deploy your LearnOverse app (React Frontend + Express Backend) with zero errors.

## Project Architecture

```
LearnOverse
├── Frontend: React/Vite (Port 5173 local, served on production)
├── Backend: Express.js (Port 3001 local, served on production)
├── Database: Supabase
└── APIs: Google Gemini + Google Drive
```

## Prerequisites

✅ Node.js 18+ installed
✅ Git repository initialized
✅ GitHub account
✅ Supabase project created
✅ Google API keys (Gemini + Drive)

## Part 1: Local Development Setup

### 1.1 Install Dependencies

**Root (Frontend):**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 1.2 Environment Variables

Create `.env.local` in root:
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_GOOGLE_API_KEY_2=your-google-api-key-2
VITE_GOOGLE_API_KEY_3=your-google-api-key-3
VITE_GOOGLE_DRIVE_API_KEY=your-drive-api-key
VITE_DRIVE_MAIN_FOLDER_ID=your-folder-id
```

Create `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
GOOGLE_API_KEY=your-google-api-key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 1.3 Run Locally

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs at http://localhost:3001
```

Test: Visit http://localhost:5173 and verify app loads.

## Part 2: Prepare for Production

### 2.1 Build Frontend

```bash
npm run build
# Creates dist/ folder
```

### 2.2 Build Backend

```bash
cd backend
npm run build
# Creates dist/ folder
cd ..
```

### 2.3 Test Production Build Locally

**Terminal 1 - Backend (production mode):**
```bash
cd backend
NODE_ENV=production npm start
# Runs at http://localhost:3001
```

**Terminal 2 - Frontend (preview):**
```bash
npm run preview
# Runs at http://localhost:4173
```

Test: Visit http://localhost:4173 and verify everything works.

## Part 3: Deploy to Production

### Option A: Deploy on Railway.app (Recommended - Easiest)

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

#### Step 2: Deploy Backend First

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Select your repository
4. Choose `backend` directory
5. Add environment variables:
   ```
   SUPABASE_URL=your-value
   SUPABASE_SERVICE_KEY=your-value
   GOOGLE_API_KEY=your-value
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.com
   ```
6. Deploy

Get backend URL: `https://your-backend.railway.app`

#### Step 3: Deploy Frontend

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Select your repository
4. Choose root directory
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_SUPABASE_URL=your-value
   VITE_SUPABASE_ANON_KEY=your-value
   VITE_GOOGLE_API_KEY=your-value
   VITE_GOOGLE_API_KEY_2=your-value
   VITE_GOOGLE_API_KEY_3=your-value
   VITE_GOOGLE_DRIVE_API_KEY=your-value
   VITE_DRIVE_MAIN_FOLDER_ID=your-value
   ```
6. Build command: `npm run build`
7. Deploy

Get frontend URL: `https://your-frontend.railway.app`

#### Step 4: Update Backend CORS

Go back to backend project settings:
1. Update `CORS_ORIGIN` to your frontend URL
2. Redeploy backend

### Option B: Deploy on Heroku (Alternative)

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku Apps

**Backend:**
```bash
cd backend
heroku create your-app-backend
heroku config:set SUPABASE_URL=your-value
heroku config:set SUPABASE_SERVICE_KEY=your-value
heroku config:set GOOGLE_API_KEY=your-value
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-app-frontend.herokuapp.com
git push heroku main
cd ..
```

**Frontend:**
```bash
heroku create your-app-frontend
heroku config:set VITE_API_URL=https://your-app-backend.herokuapp.com/api
heroku config:set VITE_SUPABASE_URL=your-value
heroku config:set VITE_SUPABASE_ANON_KEY=your-value
heroku config:set VITE_GOOGLE_API_KEY=your-value
heroku config:set VITE_GOOGLE_API_KEY_2=your-value
heroku config:set VITE_GOOGLE_API_KEY_3=your-value
heroku config:set VITE_GOOGLE_DRIVE_API_KEY=your-value
heroku config:set VITE_DRIVE_MAIN_FOLDER_ID=your-value
git push heroku main
```

### Option C: Deploy on AWS (Advanced)

Use EC2 + RDS or Elastic Beanstalk. Refer to AWS documentation.

## Part 4: Verify Deployment

### 4.1 Test Backend
```bash
curl https://your-backend-url/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 4.2 Test Frontend
Visit: `https://your-frontend-url`
- Page should load
- No console errors
- All features should work

### 4.3 Test Features
- [ ] Upload document
- [ ] Chat with document
- [ ] Generate mindmap
- [ ] Generate flashcards
- [ ] Generate summary

## Troubleshooting

### Frontend Won't Load
**Error:** Blank page or 404

**Solution:**
1. Check build output: `npm run build`
2. Verify `dist/` folder exists
3. Check environment variables are set
4. Check browser console for errors

### API Calls Fail
**Error:** 404 or CORS error

**Solution:**
1. Verify backend is running
2. Check `VITE_API_URL` is correct
3. Verify backend `CORS_ORIGIN` matches frontend URL
4. Check backend logs for errors

### Environment Variables Not Working
**Error:** Variables undefined in code

**Solution:**
1. Frontend variables must start with `VITE_`
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)
4. For frontend: Variables only available at build time

### Build Fails
**Error:** Build command failed

**Solution:**
1. Check all dependencies installed: `npm install`
2. Check for TypeScript errors: `npm run build`
3. Check Node version: `node --version` (should be 18+)
4. Clear cache: `rm -rf node_modules dist && npm install`

## Environment Variables Reference

### Frontend (VITE_*)
- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GOOGLE_API_KEY` - Primary Google API key
- `VITE_GOOGLE_API_KEY_2` - Secondary Google API key
- `VITE_GOOGLE_API_KEY_3` - Tertiary Google API key
- `VITE_GOOGLE_DRIVE_API_KEY` - Google Drive API key
- `VITE_DRIVE_MAIN_FOLDER_ID` - Google Drive folder ID

### Backend
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `GOOGLE_API_KEY` - Google API key
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL for CORS

## Getting Credentials

### Supabase
1. Go to https://supabase.com
2. Create project
3. Settings → API
4. Copy `Project URL` and `anon public key`

### Google API Keys
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable APIs: Generative AI, Google Drive
4. Create API key credentials
5. Copy the keys

### Google Drive Folder ID
1. Open your Google Drive folder
2. Copy ID from URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

## Deployment Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] `.env.local` created with all variables
- [ ] `backend/.env` created with all variables
- [ ] `npm run build` succeeds
- [ ] `cd backend && npm run build` succeeds
- [ ] Local testing works (both frontend and backend)

After deploying:
- [ ] Frontend loads without errors
- [ ] Backend health check works
- [ ] API calls succeed
- [ ] All features tested
- [ ] No console errors

## Support

- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **Supabase Docs**: https://supabase.com/docs
- **Google Cloud Docs**: https://cloud.google.com/docs

## Summary

Your app is now deployed! 

**Frontend URL**: `https://your-frontend-url`
**Backend URL**: `https://your-backend-url`
**API Endpoint**: `https://your-backend-url/api`

Both frontend and backend are running in production. All features should work without errors.

**Next Steps:**
1. Monitor logs for errors
2. Set up error tracking (optional)
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments (optional)
