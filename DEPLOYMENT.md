# Deployment Guide

## Overview
This project consists of:
- **Frontend**: React + Vite (static site)
- **Backend**: Express.js + TypeScript (Node.js API)
- **Database**: Supabase

## Pre-Deployment Checklist

### 1. Secure Your API Keys
⚠️ **CRITICAL**: Never commit actual API keys to version control.

Your exposed keys in `.env.production` have been reset. You need to:
1. Rotate all exposed API keys immediately
2. Generate new keys from:
   - Google Cloud Console (Gemini API)
   - Supabase Dashboard
   - Google Drive API

### 2. Update Backend Configuration

Add a health check endpoint to `backend/src/index.ts`:

```typescript
// Add this before app.listen()
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## Deployment to Render

### Step 1: Prepare Repository
```bash
# Ensure .env.local and .env.production are in .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
git add .gitignore
git commit -m "Update gitignore for env files"
git push
```

### Step 2: Create Backend Service on Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `learnoverse-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm ci && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid if needed)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   GOOGLE_API_KEY=your-google-api-key
   CORS_ORIGIN=https://your-frontend-domain.onrender.com
   ```

6. Click "Create Web Service"
7. Note the backend URL (e.g., `https://learnoverse-backend.onrender.com`)

### Step 3: Create Frontend Service on Render

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `learnoverse-frontend`
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   VITE_API_URL=https://learnoverse-backend.onrender.com/api
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GOOGLE_API_KEY=your-google-api-key
   VITE_GOOGLE_API_KEY_2=your-google-api-key-2
   VITE_GOOGLE_API_KEY_3=your-google-api-key-3
   VITE_GOOGLE_DRIVE_API_KEY=your-google-drive-api-key
   VITE_DRIVE_MAIN_FOLDER_ID=your-drive-folder-id
   ```

5. Click "Create Static Site"

### Step 4: Configure CORS

Update `backend/src/index.ts` to accept your frontend domain:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://learnoverse-frontend.onrender.com', // Add your frontend URL
  process.env.CORS_ORIGIN,
].filter((origin): origin is string => typeof origin === 'string');
```

### Step 5: Verify Deployment

1. Visit your frontend URL: `https://learnoverse-frontend.onrender.com`
2. Check backend health: `https://learnoverse-backend.onrender.com/health`
3. Test API calls from frontend

## Alternative: Docker Deployment

If you want to deploy both services as one container:

### Create `Dockerfile`
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm ci
RUN cd frontend && npm ci
RUN cd backend && npm ci

# Build frontend and backend
RUN cd frontend && npm run build
RUN cd backend && npm run build

# Expose ports
EXPOSE 3001

# Start backend
CMD ["cd backend && npm start"]
```

### Create `.dockerignore`
```
node_modules
.git
.env.local
.env.production
dist
frontend/dist
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Build Failures
- Check Node version: `node --version` (should be 18+)
- Clear cache: `npm ci` instead of `npm install`
- Check for missing dependencies

### CORS Errors
- Verify `CORS_ORIGIN` environment variable matches frontend URL
- Check backend is accepting requests from frontend domain

### API Connection Issues
- Verify `VITE_API_URL` points to correct backend URL
- Check backend health endpoint: `/health`
- Review browser console for actual error messages

## Environment Variables Reference

### Frontend (.env.local / .env.production)
- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GOOGLE_API_KEY` - Google Gemini API key
- `VITE_GOOGLE_DRIVE_API_KEY` - Google Drive API key
- `VITE_DRIVE_MAIN_FOLDER_ID` - Google Drive folder ID

### Backend (.env / .env.production)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `GOOGLE_API_KEY` - Google Gemini API key
- `CORS_ORIGIN` - Frontend domain for CORS

## Security Best Practices

1. ✅ Never commit `.env.local` or `.env.production`
2. ✅ Use environment variables for all secrets
3. ✅ Rotate API keys regularly
4. ✅ Use service role keys only on backend
5. ✅ Enable HTTPS (automatic on Render)
6. ✅ Set up proper CORS policies
7. ✅ Monitor API usage and costs

## Support

For issues:
1. Check Render logs: Dashboard → Service → Logs
2. Verify all environment variables are set
3. Test locally first: `npm run dev`
4. Check API health endpoint
