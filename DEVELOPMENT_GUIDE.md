# Development Guide

## Project Overview

LearnOverse is organized as a monorepo with separate frontend and backend applications:

- **Frontend**: React + Vite + TypeScript (port 5173)
- **Backend**: Express.js + TypeScript (port 3001)

## Getting Started

### 1. Clone and Setup

```bash
# Install all dependencies
npm run install:all
```

### 2. Environment Setup

Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_API_KEY_2=your_google_api_key_2
VITE_GOOGLE_API_KEY_3=your_google_api_key_3
VITE_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
VITE_DRIVE_MAIN_FOLDER_ID=your_drive_folder_id
```

Create `backend/.env`:
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

This starts both frontend and backend. Open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Frontend Development

### Location
`frontend/` folder

### Tech Stack
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Radix UI (components)
- React Router (routing)
- React Query (data fetching)
- Zustand (state management)

### Key Folders
```
frontend/src/
├── components/     # Reusable React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

### Common Tasks

**Start dev server:**
```bash
cd frontend && npm run dev
```

**Build for production:**
```bash
cd frontend && npm run build
```

**Run linter:**
```bash
cd frontend && npm run lint
```

**Run tests:**
```bash
cd frontend && npm run test
```

**Preview production build:**
```bash
cd frontend && npm run preview
```

### Adding Dependencies

```bash
cd frontend && npm install package-name
```

## Backend Development

### Location
`backend/` folder

### Tech Stack
- Express.js
- TypeScript
- Node.js 18+
- Supabase (database)
- Google APIs

### Key Folders
```
backend/src/
├── routes/         # API route handlers
├── services/       # Business logic
├── middleware/     # Express middleware
├── config/         # Configuration files
└── index.ts        # Server entry point
```

### API Routes

**Documents:**
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all documents
- `DELETE /api/documents/:id` - Delete a document

**Chat:**
- `POST /api/chat` - Send a chat message
- `GET /api/chat/:documentId` - Get chat history

**Mindmap:**
- `POST /api/mindmap/generate` - Generate mindmap
- `GET /api/mindmap/:documentId` - Get mindmap

**Flashcards:**
- `POST /api/flashcards/generate` - Generate flashcards
- `GET /api/flashcards/:documentId` - Get flashcards

**Summary:**
- `POST /api/summary/generate` - Generate summary
- `GET /api/summary/:documentId` - Get summary

### Common Tasks

**Start dev server:**
```bash
cd backend && npm run dev
```

**Build TypeScript:**
```bash
cd backend && npm run build
```

**Run compiled code:**
```bash
cd backend && npm start
```

**Run tests:**
```bash
cd backend && npm run test
```

### Adding Dependencies

```bash
cd backend && npm install package-name
```

## Workflow

### Making Changes

1. **Frontend changes:**
   - Edit files in `frontend/src/`
   - Vite will hot-reload automatically
   - No need to restart

2. **Backend changes:**
   - Edit files in `backend/src/`
   - Dev server will auto-restart with tsx
   - No need to manually restart

### Testing

**Frontend:**
```bash
cd frontend && npm run test
```

**Backend:**
```bash
cd backend && npm run test
```

### Building

**Development build:**
```bash
npm run build
```

**Production deployment:**
- Frontend: Deploy `frontend/dist/` to static host
- Backend: Deploy `backend/dist/` to Node.js host

## Debugging

### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension
4. Check Network tab for API calls

### Backend Debugging

1. Check terminal output for logs
2. Add `console.log()` statements
3. Use VS Code debugger:
   ```json
   {
     "type": "node",
     "request": "launch",
     "program": "${workspaceFolder}/backend/src/index.ts",
     "preLaunchTask": "tsc: build",
     "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
   }
   ```

## Common Issues

### Port Already in Use

**Frontend:**
```bash
cd frontend && npm run dev -- --port 5174
```

**Backend:**
```bash
cd backend && PORT=3002 npm run dev
```

### Dependencies Not Installing

```bash
npm run install:all
```

### Environment Variables Not Loading

1. Check file location:
   - Frontend: `frontend/.env.local`
   - Backend: `backend/.env`
2. Restart dev server
3. Verify variable names are correct

### API Calls Failing

1. Check backend is running: `http://localhost:3001/health`
2. Check CORS_ORIGIN in backend `.env`
3. Check VITE_API_URL in frontend `.env.local`
4. Check browser console for errors

### Build Failures

**Frontend:**
```bash
cd frontend && npm run build
```

**Backend:**
```bash
cd backend && npm run build
```

Check error messages and fix TypeScript errors.

## Code Style

### Frontend
- Use functional components
- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind for styling

### Backend
- Use TypeScript for type safety
- Follow Express best practices
- Use middleware for cross-cutting concerns
- Validate input with Zod

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/name`
6. Create pull request

## Deployment

### Frontend
```bash
cd frontend && npm run build
# Deploy frontend/dist/ to Vercel, Netlify, etc.
```

### Backend
```bash
cd backend && npm run build
# Deploy backend/dist/ to Render, Railway, Heroku, etc.
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## Support

For issues:
1. Check existing issues
2. Create detailed bug report
3. Include error messages and steps to reproduce
