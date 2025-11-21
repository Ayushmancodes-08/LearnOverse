# 🚀 Quick Start - Deploy to Render in 15 Minutes

## What You'll Deploy
```
┌─────────────────────────────────────────┐
│  GitHub Repository                       │
│  ├── Frontend (React + Vite)            │
│  └── Backend (Express + Node.js)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Render.com (Free Hosting)              │
│  ├── Static Site (Frontend)             │
│  └── Web Service (Backend)              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Live App! 🎉                           │
│  https://your-app.onrender.com          │
└─────────────────────────────────────────┘
```

---

## Prerequisites (2 minutes)

### 1. Get Your API Keys Ready

**Supabase** (Database):
- Go to: https://app.supabase.com
- Select your project
- Settings → API
- Copy:
  - `Project URL` (for SUPABASE_URL)
  - `anon public` key (for frontend)
  - `service_role` key (for backend)

**Google Gemini API** (AI):
- Go to: https://console.cloud.google.com
- APIs & Services → Credentials
- Create API Key
- Copy the key

**Google Drive API** (optional):
- Same console
- Enable Google Drive API
- Create API Key
- Create a folder in Drive and copy its ID from URL

### 2. Create Accounts
- GitHub: https://github.com (if you don't have)
- Render: https://render.com (sign up with GitHub)

---

## Step-by-Step Deployment

### 📦 Step 1: Push to GitHub (3 min)

```powershell
# Check your code is ready
git status

# If you have changes, commit them
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

**Don't have a GitHub repo yet?**
```powershell
# Create repo on GitHub first, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### 🔧 Step 2: Deploy Backend (5 min)

1. **Go to Render**: https://render.com/dashboard

2. **Create Service**:
   - Click "New +" → "Web Service"
   - Click "Connect GitHub"
   - Select your repository
   - Click "Connect"

3. **Configure**:
   ```
   Name: learnoverse-backend
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && npm start
   ```

4. **Add Environment Variables** (click "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 3001
   SUPABASE_URL = [paste your Supabase URL]
   SUPABASE_SERVICE_KEY = [paste your service key]
   GOOGLE_API_KEY = [paste your Google API key]
   CORS_ORIGIN = [leave empty for now]
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 3-5 minutes
   - Copy your backend URL (e.g., `https://learnoverse-backend.onrender.com`)

6. **Test**:
   - Open: `https://YOUR-BACKEND-URL.onrender.com/health`
   - Should see: `{"status":"ok"}`

✅ Backend Done!

---

### 🎨 Step 3: Deploy Frontend (5 min)

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Select same repository
   - Click "Connect"

2. **Configure**:
   ```
   Name: learnoverse-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Add Environment Variables**:
   ```
   VITE_API_URL = https://YOUR-BACKEND-URL.onrender.com/api
   VITE_SUPABASE_URL = [your Supabase URL]
   VITE_SUPABASE_ANON_KEY = [your anon key - NOT service key]
   VITE_GOOGLE_API_KEY = [your Google API key]
   VITE_GOOGLE_DRIVE_API_KEY = [your Drive API key]
   VITE_DRIVE_MAIN_FOLDER_ID = [your Drive folder ID]
   ```

   **Optional** (for multiple API keys):
   ```
   VITE_GOOGLE_API_KEY_2 = [second key]
   VITE_GOOGLE_API_KEY_3 = [third key]
   ```

4. **Deploy**:
   - Click "Create Static Site"
   - Wait 3-5 minutes
   - Copy your frontend URL

✅ Frontend Done!

---

### 🔗 Step 4: Connect Them (2 min)

1. Go to your **Backend Service** in Render
2. Click "Environment" tab
3. Find `CORS_ORIGIN` variable
4. Update to: `https://YOUR-FRONTEND-URL.onrender.com`
5. Click "Save Changes"
6. Wait 2 minutes for redeploy

✅ Connected!

---

### 🎉 Step 5: Test Your App

Open your frontend URL: `https://YOUR-FRONTEND-URL.onrender.com`

Try:
- [ ] Upload a document
- [ ] Chat with AI
- [ ] Generate flashcards
- [ ] Create mind map

**If something doesn't work:**
- Press F12 to open browser console
- Check for error messages
- See troubleshooting below

---

## 🎯 Your Live URLs

After deployment, you'll have:

```
Frontend: https://learnoverse-frontend.onrender.com
Backend:  https://learnoverse-backend.onrender.com
API:      https://learnoverse-backend.onrender.com/api
Health:   https://learnoverse-backend.onrender.com/health
```

---

## 🐛 Troubleshooting

### "Application Error" on Frontend
**Fix**: Check environment variables in Render dashboard

### API Calls Not Working
**Fix**: 
1. Verify `VITE_API_URL` is correct
2. Check `CORS_ORIGIN` matches frontend URL
3. Check backend logs in Render

### "No Google API keys configured"
**Fix**: Make sure `VITE_GOOGLE_API_KEY` is set in frontend environment

### Build Failed
**Fix**: 
1. Check build logs in Render
2. Verify build commands are correct
3. Try building locally: `npm run build`

### Backend Sleeping (Free Plan)
**Note**: Free services sleep after 15 min. First request takes 30-60 sec.
**Fix**: Upgrade to paid plan ($7/month) for always-on

---

## 📚 More Resources

- **Detailed Guide**: Read `RENDER_DEPLOYMENT_GUIDE.md`
- **Checklist**: Use `DEPLOYMENT_CHECKLIST.md`
- **Render Docs**: https://render.com/docs
- **Support**: https://community.render.com

---

## 🔄 Updating Your App

When you make changes:

```powershell
git add .
git commit -m "Update feature"
git push origin main
```

Render automatically rebuilds and deploys! (3-5 min)

---

## 💰 Cost

**Free Plan**:
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ❌ Services sleep after 15 min

**Paid Plan** ($7/month per service):
- ✅ Always-on (no sleeping)
- ✅ More resources
- ✅ Priority support

**Recommendation**: Start free, upgrade backend if needed.

---

## 🔒 Security Checklist

Before sharing your app:

- [ ] No API keys in GitHub code
- [ ] All secrets in Render environment variables
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS enabled
- [ ] Google API usage limits set

---

## ✨ You're Done!

Your app is now live and accessible to anyone! 🎉

Share your URL with friends, add it to your portfolio, or keep building!

**Questions?** Check the detailed guides or Render documentation.

---

**Total Time: ~15 minutes** ⏱️
**Difficulty: Easy** 😊
**Cost: Free** 💰
