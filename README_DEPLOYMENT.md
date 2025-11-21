# 📖 Deployment Documentation

This folder contains everything you need to deploy your app to Render.

## 📁 Files Overview

### 🚀 Start Here
- **`QUICK_START.md`** - Deploy in 15 minutes (recommended for beginners)
- **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step checklist

### 📚 Detailed Guides
- **`RENDER_DEPLOYMENT_GUIDE.md`** - Complete guide with troubleshooting
- **`DEPLOYMENT.md`** - General deployment information

### 🛠️ Scripts
- **`scripts/prepare-deployment.ps1`** - Pre-deployment checks (Windows)

## 🎯 Which File Should I Use?

### If you're new to deployment:
→ Start with **`QUICK_START.md`**

### If you want a checklist:
→ Use **`DEPLOYMENT_CHECKLIST.md`**

### If you need detailed explanations:
→ Read **`RENDER_DEPLOYMENT_GUIDE.md`**

### If you're having issues:
→ Check troubleshooting in **`RENDER_DEPLOYMENT_GUIDE.md`**

## ⚡ Quick Commands

### Prepare for deployment:
```powershell
# Run pre-deployment checks
.\scripts\prepare-deployment.ps1

# Commit and push
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Test locally before deploying:
```powershell
# Start both frontend and backend
npm run dev

# Build to test production
cd frontend && npm run build
cd ../backend && npm run build
```

## 🔑 Environment Variables You'll Need

### Backend (Render Web Service):
```
NODE_ENV=production
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
GOOGLE_API_KEY=your-google-api-key
CORS_ORIGIN=your-frontend-url
```

### Frontend (Render Static Site):
```
VITE_API_URL=your-backend-url/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_GOOGLE_DRIVE_API_KEY=your-drive-api-key
VITE_DRIVE_MAIN_FOLDER_ID=your-folder-id
```

## 🎯 Deployment Flow

```
1. Push to GitHub
   ↓
2. Deploy Backend on Render
   ↓
3. Deploy Frontend on Render
   ↓
4. Connect them (update CORS)
   ↓
5. Test your live app!
```

## 📞 Need Help?

1. Check the troubleshooting section in `RENDER_DEPLOYMENT_GUIDE.md`
2. Review Render logs: Dashboard → Service → Logs
3. Visit Render docs: https://render.com/docs
4. Check Render community: https://community.render.com

## ✅ Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] `.env.local` and `.env.production` in `.gitignore`
- [ ] No secrets in code
- [ ] Have all API keys ready
- [ ] Render account created
- [ ] GitHub connected to Render

## 🎉 After Deployment

Your app will be live at:
- Frontend: `https://your-app.onrender.com`
- Backend: `https://your-backend.onrender.com`
- API: `https://your-backend.onrender.com/api`

## 🔄 Updating Your Deployed App

Just push to GitHub:
```powershell
git add .
git commit -m "Update feature"
git push origin main
```

Render will automatically rebuild and deploy!

## 💡 Tips

- Start with free plan, upgrade if needed
- Backend sleeps on free plan (first request takes 30-60s)
- Check logs if something goes wrong
- Test locally before deploying
- Keep API keys secure

---

**Ready to deploy? Open `QUICK_START.md` and let's go! 🚀**
