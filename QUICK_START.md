# Quick Start Guide

## New Project Structure

Your project is now organized with separate `frontend/` and `backend/` folders:

```
learnoverse/
├── frontend/    ← React + Vite app
├── backend/     ← Express.js API
└── README.md    ← Full documentation
```

## First Time Setup

### 1. Install All Dependencies

```bash
npm run install:all
```

This installs dependencies for:
- Root (concurrently package)
- Frontend
- Backend

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

Run both frontend and backend together:

```bash
npm run dev
```

Or run separately in different terminals:

```bash
# Terminal 1 - Frontend
npm run frontend:dev

# Terminal 2 - Backend
npm run backend:dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API: http://localhost:3001/api

## Common Commands

### Frontend Only
```bash
cd frontend
npm run dev          # Development
npm run build        # Production build
npm run lint         # Check code quality
npm run test         # Run tests
```

### Backend Only
```bash
cd backend
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled code
npm run test         # Run tests
```

### Root Level
```bash
npm run dev          # Run both frontend and backend
npm run build        # Build both
npm run install:all  # Install all dependencies
```

## Folder Organization

### Frontend (`frontend/`)
- `src/` - React components, pages, hooks
- `public/` - Static assets
- `vite.config.ts` - Vite configuration
- `package.json` - Frontend dependencies

### Backend (`backend/`)
- `src/` - Express routes, services, middleware
- `dist/` - Compiled JavaScript (after build)
- `package.json` - Backend dependencies
- `tsconfig.json` - TypeScript configuration

## Next Steps

1. Read the full [README.md](./README.md) for detailed documentation
2. Check `frontend/` for frontend-specific setup
3. Check `backend/` for backend-specific setup
4. Start developing!

## Troubleshooting

**Port already in use?**
```bash
# Change frontend port
cd frontend && npm run dev -- --port 5174

# Change backend port
cd backend && PORT=3002 npm run dev
```

**Dependencies not installing?**
```bash
npm run install:all
```

**Environment variables not loading?**
- Restart the dev server after changing `.env` files
- Make sure files are in the correct location:
  - Frontend: `frontend/.env.local`
  - Backend: `backend/.env`

## File Structure Summary

```
learnoverse/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── README.md
└── QUICK_START.md
```

Happy coding! 🚀
