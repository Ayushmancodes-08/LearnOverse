# Mentis Backend

Express.js backend for the AI-Powered Study Companion.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Fill in your environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key
- `GOOGLE_API_KEY` - Your Google Gemini API key
- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:5173)

## Development

```bash
npm run dev
```

Server will run on `http://localhost:3001`

## Build

```bash
npm run build
```

## Production

```bash
npm run start
```

## API Endpoints

- `POST /api/documents/upload` - Upload and extract PDF
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `POST /api/chat` - Chat with document
- `POST /api/mindmap/generate` - Generate mindmap
- `POST /api/flashcards/generate` - Generate flashcards
- `POST /api/summary/generate` - Generate summary
- `GET /health` - Health check

## Database Schema

Run these SQL commands in Supabase to create the required tables:

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
