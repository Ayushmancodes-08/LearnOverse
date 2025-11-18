# Environment Variables Reference

Complete list of all environment variables needed for deployment.

## Backend Variables (Node.js/Express)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGc...` |
| `GOOGLE_API_KEY` | Google Gemini API key | `AIzaSy...` |

## Frontend Variables (React/Vite)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (production) or `http://localhost:3001/api` (dev) |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `VITE_GOOGLE_API_KEY` | Primary Google Gemini API key | `AIzaSy...` |
| `VITE_GOOGLE_API_KEY_2` | Secondary Google API key (failover) | `AIzaSy...` |
| `VITE_GOOGLE_API_KEY_3` | Tertiary Google API key (failover) | `AIzaSy...` |
| `VITE_GOOGLE_DRIVE_API_KEY` | Google Drive API key | `AIzaSy...` |
| `VITE_DRIVE_MAIN_FOLDER_ID` | Google Drive folder ID | `1rUgb6S6fYMQQUV8o29X...` |

## Environment Files

### Local Development (.env.local)
Used when running `npm run dev` locally. Contains all variables with local values.

### Production (.env.production)
Used during production build. Variables are set in Render dashboard, not in this file.

### Example (.env.example)
Template file showing all available variables. Safe to commit to git.

## Where to Get Values

### Supabase
1. Go to https://supabase.com
2. Select your project
3. Settings → API
4. Copy `Project URL` and `anon public key`

### Google API Keys
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable APIs:
   - Google Generative AI API (for Gemini)
   - Google Drive API
4. Create API key credentials
5. Copy the keys

### Google Drive Folder ID
1. Open your Google Drive folder
2. Copy the ID from the URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

## Render Deployment

When deploying to Render:

1. All `VITE_*` variables are available to frontend during build
2. All non-`VITE_*` variables are available to backend at runtime
3. Set all variables in Render dashboard under "Environment"
4. Render automatically injects them during build and runtime

## Local Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in all values from your services
3. Run `npm run dev` for frontend
4. Run `cd backend && npm run dev` for backend

## Production Deployment Setup

1. Create service on Render
2. Add all variables in Render dashboard
3. Render automatically uses them during build and runtime
4. No need to commit `.env.production` with actual values
