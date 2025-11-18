# Quick Start Guide

## 30-Second Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add your key
# VITE_GOOGLE_API_KEY=your-key-here
```

### 3. Get Your Key
Visit: https://aistudio.google.com/app/apikey

### 4. Run
```bash
npm run dev
```

### 5. Open
http://localhost:8080

---

## Common Issues

### "No Google API keys found"
→ Add `VITE_GOOGLE_API_KEY` to `.env.local`

### Port 8080 in use
→ Dev server uses next available port (check console)

### PDF extraction fails
→ Use text-based PDFs (not scanned images)

### Rate limit errors
→ Add backup keys: `VITE_GOOGLE_API_KEY_2`, `VITE_GOOGLE_API_KEY_3`

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Check code quality
npm run preview  # Preview production build
```

---

## Features

- 📚 Upload PDFs, TXT, or Markdown
- 🧠 Generate interactive mindmaps
- 💬 Chat with your documents
- 📝 Auto-generate summaries
- 🔄 Automatic API key rotation

---

## Security

⚠️ **Never commit `.env.local`**
- It contains your API keys
- It's in `.gitignore` for a reason
- Use `.env.example` as template

---

## Need Help?

- See `SETUP_INSTRUCTIONS.md` for detailed guide
- See `BUG_FIX_REPORT.md` for technical details
- See `SOLUTION_SUMMARY.md` for architecture overview

---

**Status:** Ready to use ✅
