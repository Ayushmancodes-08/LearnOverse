# 🚀 START HERE

Welcome to LearnOverse! This guide will help you get started quickly.

## What is LearnOverse?

LearnOverse is an AI-powered study companion that helps students:
- Upload and analyze documents
- Chat with AI about content
- Generate mindmaps
- Create flashcards
- Generate summaries

## Project Structure

```
learnoverse/
├── frontend/    ← React app (port 5173)
├── backend/     ← Express API (port 3001)
└── docs/        ← Documentation
```

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Environment Variables

**Frontend** (`frontend/.env.local`):
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GOOGLE_API_KEY=your_google_api_key
```

**Backend** (`backend/.env`):
```
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_API_KEY=your_google_api_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Development
```bash
npm run dev
```

### 4. Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Documentation Guide

Choose what you need:

### 🎯 I want to...

**Get started quickly**
→ Read [QUICK_START.md](./QUICK_START.md)

**Understand the project structure**
→ Read [README.md](./README.md)

**Start developing**
→ Read [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

**Understand what changed**
→ Read [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)

**Check project status**
→ Read [PROJECT_STATUS.md](./PROJECT_STATUS.md)

**See cleanup details**
→ Read [CLEANUP_COMPLETE.md](./CLEANUP_COMPLETE.md)

## Common Commands

```bash
# Development
npm run dev                 # Start both frontend and backend
npm run frontend:dev        # Frontend only
npm run backend:dev         # Backend only

# Building
npm run build               # Build both for production
npm run frontend:build      # Build frontend only
npm run backend:build       # Build backend only

# Installation
npm run install:all         # Install all dependencies
```

## Folder Structure

```
learnoverse/
├── frontend/
│   ├── src/               # React components, pages, hooks
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── .env.local         # Frontend environment variables
│
├── backend/
│   ├── src/               # Express routes, services, middleware
│   ├── dist/              # Compiled JavaScript
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend environment variables
│
└── docs/
    ├── README.md          # Full documentation
    ├── QUICK_START.md     # Quick reference
    ├── DEVELOPMENT_GUIDE.md
    ├── MIGRATION_SUMMARY.md
    ├── PROJECT_STATUS.md
    └── CLEANUP_COMPLETE.md
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI

### Backend
- Express.js
- TypeScript
- Node.js
- Supabase
- Google APIs

## Features

✅ Document Upload & Analysis
✅ AI Chat
✅ Mindmap Generation
✅ Flashcard Creation
✅ Summary Generation
✅ User Authentication
✅ Real-time Updates

## API Endpoints

```
GET  /health                      # Health check
POST /api/documents/upload        # Upload document
GET  /api/documents               # Get documents
POST /api/chat                    # Chat with AI
POST /api/mindmap/generate        # Generate mindmap
POST /api/flashcards/generate     # Generate flashcards
POST /api/summary/generate        # Generate summary
```

## Troubleshooting

### Port Already in Use
```bash
cd frontend && npm run dev -- --port 5174
cd backend && PORT=3002 npm run dev
```

### Dependencies Not Installing
```bash
npm run install:all
```

### Environment Variables Not Loading
1. Check file locations
2. Restart dev server
3. Verify variable names

## Next Steps

1. ✅ Read this file (you're here!)
2. ⏭️ Run `npm run install:all`
3. ⏭️ Set up environment variables
4. ⏭️ Run `npm run dev`
5. ⏭️ Open http://localhost:5173
6. ⏭️ Start developing!

## Need Help?

- **Quick Reference**: [QUICK_START.md](./QUICK_START.md)
- **Full Documentation**: [README.md](./README.md)
- **Development Guide**: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- **Project Status**: [PROJECT_STATUS.md](./PROJECT_STATUS.md)

## Project Status

✅ **Structure**: Organized with separate frontend and backend
✅ **Cleanup**: All old files removed
✅ **Documentation**: Complete and up-to-date
✅ **Ready**: Ready for development

---

**Happy coding!** 🚀

For more information, see [README.md](./README.md)
