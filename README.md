# 🤯 Mentis - AI-Powered Study Companion

Transform your study materials into interactive mindmaps, summaries, and have intelligent conversations with your documents using Google Gemini AI.

## ✨ Features

- 📚 **Multi-Format Upload** - PDF, TXT, Markdown support
- 🧠 **AI Mindmaps** - Auto-generate interactive concept maps
- 📝 **Smart Summaries** - Instant document summarization
- 💬 **Document Chat** - Ask questions about your materials
- 🔄 **API Key Rotation** - Automatic failover for reliability
- ⚡ **Fast & Efficient** - Optimized with latest Gemini 2.5 Flash

## 🚀 Quick Start

### 1. Get API Key
Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key

### 2. Setup
```bash
# Clone and install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local and add your API key
```

### 3. Run
```bash
npm run dev
```

Open http://localhost:8080 in your browser

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 30-second setup guide
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Detailed setup & troubleshooting
- **[MODEL_UPDATES.md](./MODEL_UPDATES.md)** - AI model information
- **[BUG_FIX_REPORT.md](./BUG_FIX_REPORT.md)** - Technical details
- **[SOLUTION_SUMMARY.md](./SOLUTION_SUMMARY.md)** - Architecture overview

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Radix UI** - Component library

### AI & APIs
- **Gemini 2.5 Flash** - Chat model
- **Text Embedding 004** - Embeddings
- **Simple RAG** - Document retrieval
- **LangChain** - AI orchestration

### Backend (Python)
- **Streamlit** - Web framework
- **LangChain** - RAG system
- **Chroma** - Vector database
- **PyPDF2** - PDF processing

## 📦 Build & Deploy

### Development
```bash
npm run dev      # Start dev server
npm run lint     # Check code quality
```

### Production
```bash
npm run build    # Build for production
npm run preview  # Preview build
```

## 🔐 Security

- ✅ API keys never exposed in code
- ✅ Environment variables properly configured
- ✅ `.env.local` excluded from git
- ✅ Secure error handling

## 🐛 Troubleshooting

### "No API keys found"
→ Add `VITE_GOOGLE_API_KEY` to `.env.local`

### Port already in use
→ Dev server uses next available port (check console)

### PDF extraction fails
→ Use text-based PDFs (not scanned images)

### Rate limit errors
→ Add backup keys: `VITE_GOOGLE_API_KEY_2`, `VITE_GOOGLE_API_KEY_3`

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for more help.

## 📊 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Radix UI components
│   ├── UploadSection.tsx
│   ├── StudyTools.tsx
│   ├── ChatInterface.tsx
│   └── MindmapViewer.tsx
├── lib/                # Utilities
│   ├── api-key-manager.ts
│   ├── gemini.ts
│   ├── simple-rag.ts
│   ├── pdf-processor.ts
│   └── store.ts
├── hooks/              # Custom hooks
├── pages/              # Page components
└── App.tsx             # Main app
```

## 🎯 Features in Detail

### 📚 Document Upload
- Upload PDFs, TXT, or Markdown files
- Combine multiple documents
- Automatic text extraction
- Support for large files

### 🧠 Mindmap Generation
- AI-powered concept mapping
- Interactive visualization
- Zoom and pan controls
- Download as markdown

### 💬 Chat Interface
- Ask questions about documents
- Context-aware responses
- Simple RAG for instant retrieval
- Conversation history

### 📝 Summary Generation
- Automatic summarization
- Structured format
- Download as text
- Customizable length

### 🔄 API Key Rotation
- Automatic failover
- Rate limit handling
- Cooldown management
- Load balancing

## 🚀 Performance

- **Fast Inference** - Gemini 2.5 Flash optimized
- **Instant RAG** - Keyword-based retrieval
- **Efficient Caching** - Mindmap caching
- **Optimized Build** - Vite + SWC

## 📈 Future Enhancements

- [ ] Flashcard generation
- [ ] Spaced repetition
- [ ] Collaborative sessions
- [ ] Export formats
- [ ] Advanced search
- [ ] Progress tracking

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the Mentis study companion suite.

## 🆘 Support

- Check documentation files
- Review error messages
- Check browser console
- Verify API key configuration

## 🎓 About

Mentis is designed to help students:
- Understand complex topics
- Create study materials
- Review documents efficiently
- Learn interactively

---

**Status:** ✅ Production Ready  
**Last Updated:** November 15, 2025  
**Version:** 1.0.0

**Get Started:** [QUICK_START.md](./QUICK_START.md)
