# LearnOverse - AI-Powered Study Companion

A full-stack application with separate frontend and backend folders for better organization and scalability.

## Project Structure

```
learnoverse/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React components, pages, hooks
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── vite.config.ts
├── backend/          # Express.js backend API
│   ├── src/          # API routes, services, middleware
│   ├── package.json  # Backend dependencies
│   └── tsconfig.json
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

Install dependencies for all packages:

```bash
npm run install:all
```

Or install individually:

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

## 🚀 Deploy to Render (10 Minutes)

**Quick Deploy**: See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for 10-minute deployment guide

**Detailed Guide**: See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for complete instructions

### Quick Deploy Steps

1. Push to GitHub: `git push origin main`
2. Go to https://render.com
3. Click "New" → "Blueprint"
4. Select your repo
5. Click "Apply"
6. Add environment variables
7. Done! ✅

Your app will be live at:
- Frontend: `https://learnoverse-frontend.onrender.com`
- Backend: `https://learnoverse-backend.onrender.com`

Or run them separately:

```bash
# Terminal 1 - Frontend (runs on http://localhost:5173)
npm run frontend:dev

# Terminal 2 - Backend (runs on http://localhost:3001)
npm run backend:dev
```

### Building

Build both frontend and backend:

```bash
npm run build
```

Or build individually:

```bash
npm run frontend:build
npm run backend:build
```

## Frontend

Located in `frontend/` folder.

**Tech Stack:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI

**Commands:**
```bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

**Environment Variables:**
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GOOGLE_API_KEY=your_google_api_key
```

## Backend

Located in `backend/` folder.

**Tech Stack:**
- Express.js
- TypeScript
- Node.js
- Supabase

**Commands:**
```bash
cd backend

npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run compiled backend
npm run test         # Run tests
```

**Environment Variables:**
Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_API_KEY=your_google_api_key
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Health Check
```
GET /health
```

### Documents
```
POST /api/documents/upload
GET /api/documents
DELETE /api/documents/:id
```

### Chat
```
POST /api/chat
GET /api/chat/:documentId
```

### Mindmap
```
POST /api/mindmap/generate
GET /api/mindmap/:documentId
```

### Flashcards
```
POST /api/flashcards/generate
GET /api/flashcards/:documentId
```

### Summary
```
POST /api/summary/generate
GET /api/summary/:documentId
```

## Development Workflow

1. **Frontend Development:**
   - Make changes in `frontend/src/`
   - Vite will hot-reload automatically
   - Run `npm run lint` to check code quality

2. **Backend Development:**
   - Make changes in `backend/src/`
   - Use `npm run dev` for hot reload with tsx
   - Changes will automatically restart the server

3. **Testing:**
   - Frontend: `cd frontend && npm run test`
   - Backend: `cd backend && npm run test`

## Deployment

### Frontend
- Build: `npm run frontend:build`
- Output: `frontend/dist/`
- Deploy to: Vercel, Netlify, or any static host

### Backend
- Build: `npm run backend:build`
- Output: `backend/dist/`
- Deploy to: Render, Railway, Heroku, or any Node.js host

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is already in use:

**Frontend:**
```bash
cd frontend && npm run dev -- --port 5174
```

**Backend:**
```bash
cd backend && PORT=3002 npm run dev
```

### Module Not Found
Make sure you've installed dependencies:
```bash
npm run install:all
```

### Environment Variables Not Loading
- Frontend: Check `frontend/.env.local`
- Backend: Check `backend/.env`
- Restart the dev server after changing env vars

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Commit and push
5. Create a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
