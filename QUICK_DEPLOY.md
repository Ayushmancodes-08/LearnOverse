# Quick Deployment Reference

## 3-Minute Deployment Summary

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Step 2: Create Render Service
1. Go to https://render.com
2. Click "New +" → "Blueprint"
3. Select your GitHub repo
4. Click "Apply"

### Step 3: Add Environment Variables
Copy and paste these in Render dashboard:

```
SUPABASE_URL=https://dslyfoloalnivimqypyo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_API_KEY=AIzaSyAO33s8TclLYGMG1Bj88rIWm7oxqHgFP8c
VITE_SUPABASE_URL=https://dslyfoloalnivimqypyo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_API_KEY=AIzaSyAO33s8TclLYGMG1Bj88rIWm7oxqHgFP8c
VITE_GOOGLE_API_KEY_2=AIzaSyCxw1KSYnPQs1itF0CD2Gxd46t0e-FnpPU
VITE_GOOGLE_API_KEY_3=AIzaSyBz_ni5qVBXo2e7Ua6pLuSukvi1YkRVaUQ
VITE_GOOGLE_DRIVE_API_KEY=AIzaSyDpVe1t0JGyui6V8NAHuBuFeFwepAtyepM
VITE_DRIVE_MAIN_FOLDER_ID=1rUgb6S6fYMQQUV8o29X---3jJxld_xEd
```

### Step 4: Deploy
Click "Deploy" button. Wait 5-10 minutes.

### Step 5: Verify
Visit: `https://learnoverse.onrender.com/api/health`

Should return: `{"status":"ok"}`

## Your Deployment URL
```
https://learnoverse.onrender.com
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, verify env vars |
| API 404 | Check `/api/health` endpoint |
| Cold start slow | Normal on free tier (30-60 sec) |
| Env vars not working | Redeploy after adding vars |

## Full Guide
See `DEPLOYMENT_STEPS.md` for complete instructions.
