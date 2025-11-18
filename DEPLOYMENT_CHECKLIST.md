# Deployment Checklist

Complete this checklist before deploying to Render.

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Latest changes pushed to `main` branch
- [ ] No uncommitted changes in working directory

## Environment Variables Collected

### Backend Variables
- [ ] `SUPABASE_URL` - From Supabase project settings
- [ ] `SUPABASE_SERVICE_KEY` - From Supabase project settings
- [ ] `GOOGLE_API_KEY` - From Google Cloud Console

### Frontend Variables
- [ ] `VITE_SUPABASE_URL` - Same as backend
- [ ] `VITE_SUPABASE_ANON_KEY` - From Supabase project settings
- [ ] `VITE_GOOGLE_API_KEY` - Primary Google API key
- [ ] `VITE_GOOGLE_API_KEY_2` - Secondary Google API key (optional)
- [ ] `VITE_GOOGLE_API_KEY_3` - Tertiary Google API key (optional)
- [ ] `VITE_GOOGLE_DRIVE_API_KEY` - From Google Cloud Console
- [ ] `VITE_DRIVE_MAIN_FOLDER_ID` - From your Google Drive folder URL

## Render Setup

- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] Service created from Blueprint (render.yaml)

## Environment Variables in Render

- [ ] All backend variables added
- [ ] All frontend variables added
- [ ] Variables marked as `sync: false` (not synced from git)

## Deployment

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check build logs for errors
- [ ] Verify deployment succeeded

## Post-Deployment Verification

- [ ] Visit your Render URL in browser
- [ ] Frontend loads without errors
- [ ] Check browser console for errors
- [ ] Test API calls work properly
- [ ] Visit `/health` endpoint returns `{"status":"ok"}`
- [ ] Test key features:
  - [ ] Document upload works
  - [ ] Chat functionality works
  - [ ] Mindmap generation works
  - [ ] Flashcard generation works
  - [ ] Summary generation works

## Troubleshooting

If deployment fails:

1. [ ] Check build logs in Render dashboard
2. [ ] Verify all environment variables are set
3. [ ] Check for TypeScript compilation errors
4. [ ] Verify GitHub repository is connected
5. [ ] Check that `render.yaml` is in root directory

If API calls fail:

1. [ ] Check browser Network tab
2. [ ] Verify API URL is `/api` (relative path)
3. [ ] Check backend logs for errors
4. [ ] Verify environment variables are correct

## Monitoring

- [ ] Set up email notifications for deployment failures
- [ ] Monitor service logs regularly
- [ ] Check resource usage in Render dashboard
- [ ] Monitor error rates and performance

## Scaling (Optional)

If you want to avoid cold starts:

- [ ] Upgrade from Free to Starter plan ($7/month)
- [ ] Benefits: No cold starts, better performance, more resources

## Maintenance

- [ ] Set up automatic deployments on git push
- [ ] Monitor logs for errors
- [ ] Update dependencies regularly
- [ ] Test new features before deploying
