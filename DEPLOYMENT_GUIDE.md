# Deployment Guide: AI-Powered Study Companion

## Overview

This guide covers deploying both the frontend (React/Vite) and backend (Express.js) to production.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Supabase account and project
- Google Gemini API key
- Hosting accounts (Vercel/Netlify for frontend, Railway/Heroku for backend)

## Backend Deployment

### 1. Prepare Backend

```bash
cd backend
npm install
npm run build
```

### 2. Set Environment Variables

Create `.env` in backend root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
GOOGLE_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_KEY=your_key
heroku config:set GOOGLE_API_KEY=your_key
heroku config:set CORS_ORIGIN=https://your-frontend.com

# Deploy
git push heroku main
```

## Frontend Deployment

### 1. Prepare Frontend

```bash
npm install
npm run build
```

### 2. Set Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 4. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Database Setup

### Create Supabase Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  char_count INTEGER NOT NULL,
  extracted_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated content cache
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mindmap', 'flashcards', 'summary')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_generated_content_document_id ON generated_content(document_id);
CREATE INDEX idx_generated_content_type ON generated_content(type);
CREATE INDEX idx_chat_messages_document_id ON chat_messages(document_id);
```

## Monitoring & Logging

### Backend Monitoring

- Use Railway/Heroku dashboard for logs
- Set up error tracking with Sentry:

```bash
npm install @sentry/node
```

### Frontend Monitoring

- Use Vercel/Netlify analytics
- Set up error tracking with Sentry:

```bash
npm install @sentry/react
```

## Performance Optimization

### Backend

- Enable gzip compression
- Use connection pooling for database
- Implement rate limiting
- Cache frequently accessed data

### Frontend

- Enable code splitting
- Optimize images
- Use service workers for offline support
- Enable HTTP/2 push

## Security Checklist

- [ ] API keys stored in environment variables
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Sensitive data not logged
- [ ] Regular security updates

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

**Database connection failed:**
- Check Supabase URL and keys
- Verify network access
- Check firewall rules

### Frontend Issues

**API calls failing:**
- Check CORS configuration
- Verify API URL in environment variables
- Check network tab in browser DevTools

**Build errors:**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Review build logs

## Rollback Procedure

### Railway/Heroku

```bash
# View deployment history
heroku releases

# Rollback to previous version
heroku rollback
```

### Vercel/Netlify

- Use dashboard to select previous deployment
- Click "Redeploy" on desired version

## Maintenance

### Regular Tasks

- Monitor error logs
- Update dependencies monthly
- Review and optimize database queries
- Check API rate limits
- Backup database regularly

### Scaling

- Increase backend resources if CPU/memory high
- Enable database read replicas
- Use CDN for static assets
- Implement caching layer (Redis)

## Support

For issues or questions:
1. Check logs in hosting dashboard
2. Review error messages in browser console
3. Check backend API responses
4. Verify environment variables
5. Contact hosting provider support
