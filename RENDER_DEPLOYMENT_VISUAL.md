# Render Deployment - Visual Guide

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │   React Frontend     │      │  Express Backend     │   │
│  │   (Static Files)     │      │  (API Routes)        │   │
│  │                      │      │                      │   │
│  │  - Pages            │      │  - /api/chat         │   │
│  │  - Components       │      │  - /api/documents    │   │
│  │  - Styles           │      │  - /api/mindmap      │   │
│  │  - Assets           │      │  - /api/flashcards   │   │
│  │                      │      │  - /api/summary      │   │
│  └──────────────────────┘      └──────────────────────┘   │
│           ↓                              ↓                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Render Service (Single Service)             │  │
│  │  https://learnoverse.onrender.com                   │  │
│  └──────────────────────────────────────────────────────┘  │
│           ↓                              ↓                 │
│  ┌──────────────────────┐      ┌──────────────────────┐   │
│  │     Supabase         │      │   Google APIs        │   │
│  │   (Database)         │      │   (Gemini + Drive)   │   │
│  └──────────────────────┘      └──────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Flow

```
Step 1: Push Code
┌─────────────────┐
│  Your Computer  │
│   (Git Repo)    │
└────────┬────────┘
         │ git push
         ↓
┌─────────────────┐
│    GitHub       │
│   (Repository)  │
└────────┬────────┘
         │
Step 2: Render Detects
         │ Webhook
         ↓
┌─────────────────┐
│     Render      │
│   (Dashboard)   │
└────────┬────────┘
         │
Step 3: Build
         │ npm run build:full
         ├─ Build Frontend (Vite)
         ├─ Build Backend (TypeScript)
         ↓
Step 4: Deploy
┌─────────────────┐
│  Render Server  │
│  (Production)   │
└────────┬────────┘
         │
Step 5: Live
         ↓
┌─────────────────┐
│  Your App Live  │
│ learnoverse.com │
└─────────────────┘
```

## Step-by-Step Visual

### Step 1: GitHub
```
Your Repository
├── src/                    (React code)
├── backend/                (Express code)
├── package.json            (Root config)
├── render.yaml             (Render config)
└── .env.example            (Env template)
```

### Step 2: Render Blueprint
```
Render Dashboard
├── New +
├── Blueprint
├── Select Repository
├── Apply
└── Configure Environment Variables
```

### Step 3: Environment Variables
```
Render Dashboard → Environment Variables

Backend Variables:
├── SUPABASE_URL
├── SUPABASE_SERVICE_KEY
└── GOOGLE_API_KEY

Frontend Variables:
├── VITE_SUPABASE_URL
├── VITE_SUPABASE_ANON_KEY
├── VITE_GOOGLE_API_KEY
├── VITE_GOOGLE_API_KEY_2
├── VITE_GOOGLE_API_KEY_3
├── VITE_GOOGLE_DRIVE_API_KEY
└── VITE_DRIVE_MAIN_FOLDER_ID
```

### Step 4: Deploy
```
Click Deploy Button
        ↓
Build Phase (2-3 min)
├── Install dependencies
├── Build React frontend
└── Compile TypeScript backend
        ↓
Deploy Phase (1-2 min)
├── Upload files
├── Start Express server
└── Serve frontend
        ↓
Live! (1-2 min)
└── App accessible at URL
```

## Build Process

```
render.yaml Configuration
        ↓
buildCommand: npm install && npm run build:full
        ↓
┌─────────────────────────────────────────┐
│  npm run build:full                     │
├─────────────────────────────────────────┤
│  1. npm run build                       │
│     └─ Vite builds React to dist/       │
│                                         │
│  2. cd backend && npm install           │
│     └─ Install backend dependencies     │
│                                         │
│  3. npm run build                       │
│     └─ TypeScript compiles to dist/     │
└─────────────────────────────────────────┘
        ↓
startCommand: cd backend && npm start
        ↓
Express Server Starts
├── Serves API routes
├── Serves frontend static files
└── Listens on port 3001
```

## File Structure After Build

```
Render Server
├── dist/                   (Frontend built files)
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── backend/dist/           (Backend compiled)
│   ├── index.js
│   ├── routes/
│   └── ...
│
└── node_modules/           (Dependencies)
```

## Request Flow

```
User Browser
        ↓
GET https://learnoverse.onrender.com
        ↓
Render Server
├── Static Request (/)
│   └─ Serve dist/index.html
│
└── API Request (/api/*)
    └─ Route to Express handler
        ├── /api/chat → chatRoutes
        ├── /api/documents → documentRoutes
        ├── /api/mindmap → mindmapRoutes
        ├── /api/flashcards → flashcardRoutes
        └── /api/summary → summaryRoutes
            ↓
        Call Supabase / Google APIs
            ↓
        Return Response
```

## Monitoring

```
Render Dashboard
├── Logs
│   ├── Build logs
│   ├── Deployment logs
│   └── Runtime logs
│
├── Metrics
│   ├── CPU usage
│   ├── Memory usage
│   ├── Network I/O
│   └── Request count
│
└── Events
    ├── Deployment history
    ├── Errors
    └── Warnings
```

## Troubleshooting Flow

```
Issue Occurs
        ↓
Check Render Logs
├── Build failed?
│   └─ Check build logs
│
├── API not working?
│   └─ Check runtime logs
│
└── Env vars not set?
    └─ Check environment variables
        ↓
    Fix Issue
        ↓
    Redeploy
        ↓
    Test Again
```

## Performance Timeline

```
First Request (Cold Start)
├── 0-5 sec: Render spins up container
├── 5-30 sec: App initializes
├── 30-60 sec: First response
└── Total: 30-60 seconds

Subsequent Requests
├── 0-1 sec: Request received
├── 1-2 sec: Processing
└── Total: 100-500ms
```

## Deployment Checklist Visual

```
Before Deployment
├── ✅ Code committed
├── ✅ render.yaml exists
├── ✅ package.json has build:full
├── ✅ Environment variables ready
└── ✅ GitHub connected

During Deployment
├── ⏳ Building...
├── ⏳ Deploying...
└── ⏳ Starting...

After Deployment
├── ✅ Frontend loads
├── ✅ /api/health works
├── ✅ Features tested
└── ✅ App live!
```

## Your Deployment URL

```
┌──────────────────────────────────────┐
│  https://learnoverse.onrender.com    │
├──────────────────────────────────────┤
│  Frontend: /                         │
│  API: /api/*                         │
│  Health: /api/health                 │
└──────────────────────────────────────┘
```

## Next Steps

```
1. Read QUICK_DEPLOY.md (2 min)
        ↓
2. Push to GitHub
        ↓
3. Create Render Blueprint
        ↓
4. Add Environment Variables
        ↓
5. Click Deploy
        ↓
6. Wait 5-10 minutes
        ↓
7. Your App is Live! 🚀
```

## Support Resources

```
Documentation
├── DEPLOYMENT_STEPS.md (Full guide)
├── QUICK_DEPLOY.md (Quick reference)
├── DEPLOYMENT_SUMMARY.md (Overview)
└── This file (Visual guide)

External Resources
├── Render Docs: https://render.com/docs
├── Supabase Docs: https://supabase.com/docs
└── Google Cloud: https://cloud.google.com/docs
```
