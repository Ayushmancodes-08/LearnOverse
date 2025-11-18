# Mentis Setup Guide

Complete guide to set up and run Mentis locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud account (for Gemini API)
- Supabase account (optional, for cloud storage)

## Step 1: Install Dependencies

```bash
cd wishful-ui-canvas
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env.local
```

2. Edit `.env.local` and add your API keys:

```env
# Supabase Configuration (Optional - for cloud storage)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API (Required)
VITE_GOOGLE_API_KEY=your_google_gemini_api_key
```

### Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in `.env.local`

### Getting Supabase Credentials (Optional)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key
5. Paste them in `.env.local`

## Step 3: Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080)

## Step 4: Build for Production

```bash
npm run build
npm run preview
```

## Features

### 1. Document Upload & Processing
- Upload main PDF document
- Add additional resources (PDF, TXT, MD files)
- Automatic text extraction
- Combined context for AI processing

### 2. Interactive Mindmap
- AI-generated hierarchical mindmaps
- Interactive, zoomable visualization
- Download as Markdown
- Cached for performance

### 3. AI Chat
- Ask questions about your documents
- Context-aware responses using RAG
- Chat history maintained
- Powered by Google Gemini

### 4. Document Summary
- Generate structured summaries
- AI-powered key points extraction
- View full document text
- Export capabilities

## Project Structure

```
wishful-ui-canvas/
├── src/
│   ├── components/
│   │   ├── UploadSection.tsx      # File upload & resource management
│   │   ├── StudyTools.tsx         # Main tools interface
│   │   ├── DocumentPreview.tsx    # Document stats & summary
│   │   ├── MindmapViewer.tsx      # Interactive mindmap
│   │   ├── ChatInterface.tsx      # AI chat interface
│   │   └── ui/                    # Reusable UI components
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── gemini.ts             # Gemini AI integration
│   │   ├── pdf-processor.ts      # PDF text extraction
│   │   ├── store.ts              # Zustand state management
│   │   └── utils.ts              # Utility functions
│   ├── pages/
│   │   └── Index.tsx             # Main page
│   └── main.tsx                  # Entry point
├── .env.example                  # Environment template
├── .env.local                    # Your environment (gitignored)
└── package.json
```

## Troubleshooting

### PDF Text Extraction Issues

The current PDF processor uses a simplified extraction method. For better results:

1. Use text-based PDFs (not scanned images)
2. Ensure PDFs are not encrypted
3. For image-based PDFs, consider using OCR preprocessing

### API Rate Limits

Google Gemini free tier has rate limits:
- 60 requests per minute
- Consider implementing request queuing for heavy usage

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

## Development Tips

### Hot Reload

The development server supports hot module replacement (HMR). Changes to components will reflect immediately without full page reload.

### State Management

The app uses Zustand for state management. The store is located in `src/lib/store.ts`.

### Adding New Features

1. Create component in `src/components/`
2. Add state to `src/lib/store.ts` if needed
3. Integrate with existing UI
4. Test with sample documents

## Performance Optimization

### Caching

- Mindmaps are cached based on document content
- Prevents regeneration for same content
- Cache is in-memory (resets on page reload)

### Code Splitting

- Heavy components (Markmap) are lazy-loaded
- Reduces initial bundle size
- Improves first paint time

## Security Notes

- Never commit `.env.local` to version control
- API keys are exposed in browser (use backend proxy for production)
- Supabase RLS policies should be configured for multi-user apps

## Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Verify API keys are correct
4. Ensure all dependencies are installed

## License

MIT License
