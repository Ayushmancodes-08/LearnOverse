# Mentis - Quick Reference Guide

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📝 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
GOOGLE_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

## 🔧 Common Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm test             # Run tests
npm test:watch       # Run tests in watch mode
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm test:watch       # Run tests in watch mode
npm test:ui          # Run tests with UI
```

## 📚 API Endpoints

### Documents
```
POST   /api/documents/upload      # Upload PDF
GET    /api/documents             # List documents
GET    /api/documents/:id         # Get document
```

### Chat
```
POST   /api/chat                  # Chat with document
GET    /api/chat/history/:docId   # Get chat history
```

### Mindmap
```
POST   /api/mindmap/generate      # Generate mindmap
```

### Flashcards
```
POST   /api/flashcards/generate   # Generate flashcards
```

### Summary
```
POST   /api/summary/generate      # Generate summary
```

### Health
```
GET    /api/health                # Health check
```

## 🎯 Feature Usage

### Upload Document
1. Click "Choose PDF" button
2. Select PDF file
3. Wait for upload to complete
4. Document appears in upload section

### Generate Mindmap
1. Upload document
2. Go to Mindmap tab
3. Click "Generate Mindmap"
4. Click nodes to expand/collapse
5. Use "Expand All" / "Collapse All"

### Chat with Document
1. Upload document
2. Go to Chat tab
3. Type your question
4. Press Enter or click Send
5. View AI response

### Generate Flashcards
1. Upload document
2. Go to Flashcards tab
3. Set number of cards (5-20)
4. Click "Generate Flashcards"
5. Click cards to flip
6. Use arrows to navigate

### Generate Summary
1. Upload document
2. Go to Summary tab
3. Choose style, depth, length
4. Click "Generate Summary"
5. View formatted summary

## 🐛 Debugging

### Check Backend Logs
```bash
# Terminal where backend is running
# Look for console output
```

### Check Frontend Logs
```bash
# Browser DevTools
# F12 → Console tab
```

### Test API Endpoint
```bash
curl http://localhost:3001/health
```

### Check Database
```bash
# Supabase Dashboard
# Tables → documents, generated_content, chat_messages
```

## 📦 Project Structure

```
mentis/
├── backend/              # Backend server
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── src/                  # Frontend app
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── public/               # Static assets
│   └── favicon.svg
├── index.html
├── package.json
└── Documentation
```

## 🔑 Key Files

### Backend
- `backend/src/index.ts` - Server entry point
- `backend/src/routes/` - API endpoints
- `backend/src/services/` - Business logic
- `backend/src/config/supabase.ts` - Database config

### Frontend
- `src/App.tsx` - Main app component
- `src/components/` - React components
- `src/lib/api-client.ts` - API communication
- `src/lib/store.ts` - State management

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```ts
theme: {
  colors: {
    primary: '#3b82f6',  // Change primary color
    // ...
  }
}
```

### Change Favicon
Replace `public/favicon.svg` with your icon

### Change App Title
Edit `index.html`:
```html
<title>Your App Name</title>
```

## 🚀 Deployment

### Deploy Backend
```bash
# Railway
railway up

# Heroku
git push heroku main
```

### Deploy Frontend
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod --dir=dist
```

## 📊 Monitoring

### Backend Monitoring
- Check logs in hosting dashboard
- Monitor API response times
- Track error rates
- Monitor database usage

### Frontend Monitoring
- Check browser console
- Monitor network requests
- Track performance metrics
- Collect user feedback

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check port is available
lsof -i :3001

# Check environment variables
echo $SUPABASE_URL

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Frontend Won't Start
```bash
# Check port is available
lsof -i :5173

# Clear cache
rm -rf node_modules .vite
npm install

# Check Node version
node --version  # Should be 18+
```

### API Calls Failing
- Check backend is running
- Check API URL in .env.local
- Check CORS configuration
- Check network tab in DevTools

### Database Connection Issues
- Verify Supabase URL
- Verify service key
- Check network access
- Check database schema

## 📞 Support Resources

- **Documentation**: See README.md
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **Debug Info**: See DEBUG_REPORT.md
- **Mindmap Guide**: See INTERACTIVE_MINDMAP_GUIDE.md
- **Checklist**: See COMPLETION_CHECKLIST.md

## 🎯 Performance Tips

1. **Optimize PDFs**: Use text-based PDFs, not scanned
2. **Limit Document Size**: Keep under 50MB
3. **Cache Results**: Generated content is cached 24 hours
4. **Use Context Selector**: Focus on specific documents
5. **Monitor API Usage**: Track Gemini API calls

## 🔒 Security Tips

1. **Never commit .env files**
2. **Use strong API keys**
3. **Enable CORS only for your domain**
4. **Monitor error logs**
5. **Keep dependencies updated**

## 📈 Scaling

### When to Scale
- High API latency
- Database connection limits
- High memory usage
- Many concurrent users

### How to Scale
- Increase server resources
- Add database read replicas
- Implement CDN
- Add caching layer (Redis)
- Load balancing

## 🎓 Learning Resources

- React: https://react.dev
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- Supabase: https://supabase.com/docs
- Gemini API: https://ai.google.dev

---

**Last Updated**: November 2025
**Version**: 1.0.0
