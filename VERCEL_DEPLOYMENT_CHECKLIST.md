# Vercel Deployment Checklist

Complete this checklist before deploying to Vercel.

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Latest changes pushed to `main` branch
- [ ] No uncommitted changes in working directory
- [ ] `vercel.json` exists in root directory
- [ ] `/api` directory with route files exists

## Code Verification

- [ ] `src/lib/api-client.ts` uses `/api` as base URL
- [ ] `package.json` includes `@vercel/node` dependency
- [ ] All API routes have CORS headers
- [ ] All API routes handle OPTIONS requests
- [ ] TypeScript compiles without errors

## Environment Variables Collected

### Frontend Variables (VITE_*)
- [ ] `VITE_API_URL=/api`
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_GOOGLE_API_KEY`
- [ ] `VITE_GOOGLE_API_KEY_2`
- [ ] `VITE_GOOGLE_API_KEY_3`
- [ ] `VITE_GOOGLE_DRIVE_API_KEY`
- [ ] `VITE_DRIVE_MAIN_FOLDER_ID`

### Backend Variables (for API routes)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `GOOGLE_API_KEY`

## Vercel Setup

- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported to Vercel

## Environment Variables in Vercel

- [ ] All frontend variables added (VITE_*)
- [ ] All backend variables added
- [ ] Variables set for all environments (Production, Preview, Development)

## Build Configuration

- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Framework: Vite (auto-detected)

## Deployment

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for errors
- [ ] Verify deployment succeeded

## Post-Deployment Verification

- [ ] Visit your Vercel URL in browser
- [ ] Frontend loads without errors
- [ ] Check browser console for errors
- [ ] Test API endpoints:
  - [ ] `GET /api/health` returns `{"status":"ok"}`
  - [ ] `POST /api/chat` works
  - [ ] `POST /api/documents/upload` works
- [ ] Test key features:
  - [ ] Document upload works
  - [ ] Chat functionality works
  - [ ] Mindmap generation works
  - [ ] Flashcard generation works
  - [ ] Summary generation works

## API Routes Status

- [ ] `api/health.ts` - ✅ Implemented
- [ ] `api/chat/index.ts` - ⚠️ Placeholder (needs implementation)
- [ ] `api/documents/upload.ts` - ⚠️ Placeholder (needs implementation)
- [ ] Remaining routes from backend - ⚠️ Need migration

## Troubleshooting

If deployment fails:

1. [ ] Check build logs in Vercel dashboard
2. [ ] Verify all environment variables are set
3. [ ] Check for TypeScript compilation errors
4. [ ] Verify GitHub repository is connected
5. [ ] Check that `vercel.json` is in root directory
6. [ ] Verify `package.json` has all dependencies

If API calls fail:

1. [ ] Check browser Network tab
2. [ ] Verify API URL is `/api` (relative path)
3. [ ] Check function logs in Vercel dashboard
4. [ ] Test with curl: `curl https://your-app.vercel.app/api/health`
5. [ ] Verify environment variables are correct

## Monitoring

- [ ] Set up email notifications for deployment failures
- [ ] Monitor function execution time in Vercel dashboard
- [ ] Check error rates and performance
- [ ] Monitor cold start times

## Next Steps

1. [ ] Migrate remaining backend routes to `/api` directory
   - See `API_MIGRATION_GUIDE.md`
   
2. [ ] Implement actual logic in API routes
   - Replace placeholder implementations
   - Test each endpoint thoroughly
   
3. [ ] Optimize performance
   - Reduce function execution time
   - Implement caching where appropriate
   - Monitor cold start times

4. [ ] Set up monitoring and alerts
   - Error tracking
   - Performance monitoring
   - Uptime monitoring

## Scaling (Optional)

If you need better performance:

- [ ] Upgrade to Vercel Pro ($20/month)
- [ ] Benefits:
  - Longer execution time (60 seconds)
  - Better performance
  - Priority support

## Maintenance

- [ ] Set up automatic deployments on git push
- [ ] Monitor logs regularly
- [ ] Update dependencies regularly
- [ ] Test new features before deploying
- [ ] Keep environment variables up to date

## Documentation

- [ ] Read `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions
- [ ] Read `API_MIGRATION_GUIDE.md` for migrating remaining routes
- [ ] Read `VERCEL_SETUP_SUMMARY.md` for quick reference

## Final Verification

- [ ] Frontend loads and works correctly
- [ ] All API endpoints respond correctly
- [ ] Environment variables are properly set
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs
- [ ] Performance is acceptable

## Deployment Complete! ✅

Your app is now deployed on Vercel. Both frontend and backend are running together as a single service.

**Your app URL**: `https://your-project-name.vercel.app`

**Next**: Monitor performance and migrate remaining backend routes.
