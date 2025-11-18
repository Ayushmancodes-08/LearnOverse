# Project Structure for Vercel Deployment

Complete project structure after Vercel setup.

## Directory Tree

```
project-root/
│
├── src/                              # React Frontend (Vite)
│   ├── components/
│   ├── lib/
│   │   └── api-client.ts            # Updated: uses /api
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── api/                              # Serverless API Routes (NEW)
│   ├── health.ts                    # GET /api/health
│   ├── chat/
│   │   └── index.ts                 # POST /api/chat
│   ├── documents/
│   │   └── upload.ts                # POST /api/documents/upload
│   ├── mindmap/
│   │   └── generate.ts              # POST /api/mindmap/generate (TODO)
│   ├── flashcards/
│   │   └── generate.ts              # POST /api/flashcards/generate (TODO)
│   └── summary/
│       └── generate.ts              # POST /api/summary/generate (TODO)
│
├── backend/                          # Original Express Backend (Reference)
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── dist/                        # Compiled backend (not used in Vercel)
│   ├── package.json
│   └── tsconfig.json
│
├── dist/                             # Built Frontend (Generated on Deploy)
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── public/                           # Static Assets
│   └── ...
│
├── node_modules/                     # Dependencies
│
├── .github/                          # GitHub Configuration
│   └── workflows/
│
├── .vscode/                          # VS Code Settings
│
├── .env.local                        # Local Development (Gitignored)
├── .env.production                   # Production Template (Gitignored)
├── .env.vercel                       # Vercel Template (Gitignored)
├── .env.example                      # Template (Committed)
│
├── .gitignore                        # Git Ignore Rules
├── .eslintrc.cjs                     # ESLint Config
├── tsconfig.json                     # TypeScript Config (Frontend)
├── vite.config.ts                    # Vite Config
├── tailwind.config.js                # Tailwind Config
├── postcss.config.js                 # PostCSS Config
│
├── vercel.json                       # Vercel Config (NEW)
├── package.json                      # Root Dependencies (Updated)
├── package-lock.json                 # Dependency Lock
│
├── README.md                         # Project README
├── DEPLOYMENT_GUIDE.md               # Render Deployment (Old)
├── DEPLOYMENT_CHECKLIST.md           # Render Checklist (Old)
├── VERCEL_DEPLOYMENT_GUIDE.md        # Vercel Deployment (NEW)
├── VERCEL_DEPLOYMENT_CHECKLIST.md    # Vercel Checklist (NEW)
├── VERCEL_SETUP_SUMMARY.md           # Vercel Summary (NEW)
├── API_MIGRATION_GUIDE.md            # API Migration (NEW)
├── ENV_VARIABLES_REFERENCE.md        # Environment Variables
└── PROJECT_STRUCTURE.md              # This File
```

## Key Files for Vercel Deployment

### Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment configuration |
| `vite.config.ts` | Frontend build configuration |
| `tsconfig.json` | TypeScript configuration |
| `package.json` | Dependencies and scripts |

### Frontend Files

| Directory | Purpose |
|-----------|---------|
| `src/` | React components and pages |
| `public/` | Static assets |
| `dist/` | Built frontend (generated) |

### Backend Files (Serverless)

| Directory | Purpose |
|-----------|---------|
| `api/` | Serverless API routes |
| `api/health.ts` | Health check endpoint |
| `api/chat/` | Chat API routes |
| `api/documents/` | Document API routes |
| `api/mindmap/` | Mindmap API routes |
| `api/flashcards/` | Flashcard API routes |
| `api/summary/` | Summary API routes |

### Documentation Files

| File | Purpose |
|------|---------|
| `VERCEL_DEPLOYMENT_GUIDE.md` | Complete deployment guide |
| `VERCEL_SETUP_SUMMARY.md` | Quick reference |
| `VERCEL_DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |
| `API_MIGRATION_GUIDE.md` | Guide to migrate routes |
| `ENV_VARIABLES_REFERENCE.md` | Environment variables |

## File Sizes (Approximate)

```
src/                    ~500 KB (React components)
api/                    ~5 KB (Serverless functions)
backend/                ~200 KB (Reference only)
dist/                   ~300 KB (Built frontend)
node_modules/           ~500 MB (Dependencies)
```

## Important Notes

### Files to Commit
- ✅ `src/` - Frontend code
- ✅ `api/` - API routes
- ✅ `public/` - Static assets
- ✅ `vercel.json` - Vercel config
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `vite.config.ts` - Vite config
- ✅ Documentation files

### Files to Ignore (Gitignored)
- ❌ `node_modules/` - Dependencies
- ❌ `dist/` - Built files
- ❌ `.env.local` - Local secrets
- ❌ `.env.production` - Production secrets
- ❌ `.env.vercel` - Vercel secrets
- ❌ `backend/dist/` - Compiled backend

### Files Not Needed for Vercel
- ❌ `backend/` - Original Express backend (reference only)
- ❌ `render.yaml` - Render configuration (old)
- ❌ `DEPLOYMENT_GUIDE.md` - Render guide (old)
- ❌ `DEPLOYMENT_CHECKLIST.md` - Render checklist (old)

## API Route Structure

### Current Routes (Implemented)
```
GET  /api/health                    → api/health.ts
POST /api/chat                      → api/chat/index.ts
POST /api/documents/upload          → api/documents/upload.ts
```

### Routes to Migrate (TODO)
```
GET  /api/documents/:id             → api/documents/[id].ts
GET  /api/chat/history/:id          → api/chat/history/[id].ts
POST /api/mindmap/generate          → api/mindmap/generate.ts
POST /api/flashcards/generate       → api/flashcards/generate.ts
POST /api/summary/generate          → api/summary/generate.ts
```

## Environment Variables

### Frontend (VITE_*)
Set during build time, available in browser:
```
VITE_API_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_API_KEY
VITE_GOOGLE_API_KEY_2
VITE_GOOGLE_API_KEY_3
VITE_GOOGLE_DRIVE_API_KEY
VITE_DRIVE_MAIN_FOLDER_ID
```

### Backend (No VITE_ prefix)
Set at runtime, available in API routes:
```
SUPABASE_URL
SUPABASE_SERVICE_KEY
GOOGLE_API_KEY
```

## Build Process

### Frontend Build
```bash
npm run build
# Outputs to: dist/
```

### API Routes
Automatically converted to serverless functions by Vercel.

### Deployment
```bash
git push origin main
# Vercel automatically:
# 1. Installs dependencies
# 2. Builds frontend
# 3. Deploys API routes
# 4. Serves everything
```

## Deployment Targets

### Vercel
- Frontend: Static site
- Backend: Serverless functions
- Database: Supabase
- Storage: Google Drive

### Alternative: Render (Old Setup)
- Frontend: Static site
- Backend: Node.js service
- Database: Supabase
- Storage: Google Drive

## Next Steps

1. **Review Structure**: Ensure all files are in correct locations
2. **Verify Configuration**: Check `vercel.json` and `package.json`
3. **Migrate Routes**: Move remaining routes from `backend/` to `api/`
4. **Test Locally**: Run `vercel dev` to test locally
5. **Deploy**: Push to GitHub and deploy on Vercel

## Support

- Vercel Docs: https://vercel.com/docs
- Project Structure: See this file
- Deployment Guide: See `VERCEL_DEPLOYMENT_GUIDE.md`
- API Migration: See `API_MIGRATION_GUIDE.md`
