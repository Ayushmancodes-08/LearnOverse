# Design Document: AI-Powered Study Companion

## Overview

The AI-Powered Study Companion is a React/Vite frontend application with a Node.js/Express backend, integrated with Supabase for authentication, database, and storage. The system processes PDF documents and provides AI-powered study tools using Google Gemini API. The architecture follows a client-server model with clear separation of concerns.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React/Vite Frontend                       │
│  (Upload, Chat, Mindmap, Flashcards, Summary, Preview)     │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌──────────┐
   │Supabase │  │ Gemini  │  │Express   │
   │ Auth    │  │  API    │  │ Backend  │
   │ DB      │  │         │  │          │
   │ Storage │  │         │  │          │
   └─────────┘  └─────────┘  └──────────┘
```

### Component Architecture

```
App.tsx (Main Container)
├── UploadSection (Left Column)
│   ├── FileUploader
│   ├── PresetResources
│   └── ManualLinkInput
├── StudyTools (Middle Column - Scrollable)
│   ├── ContextSelector
│   ├── ChatInterface
│   ├── MindmapViewer
│   ├── FlashcardViewer
│   └── SummaryGenerator
└── DocumentPreview (Right Column)
    └── PDFViewer
```

## Components and Interfaces

### Frontend Components

#### 1. UploadSection Component
- **Purpose**: Handle PDF uploads and document selection
- **Props**: 
  - `onDocumentLoaded: (text: string, fileName: string) => void`
  - `onMultipleDocumentsLoaded: (documents: Document[]) => void`
- **State**: 
  - `uploadedFiles: File[]`
  - `isLoading: boolean`
  - `error: string | null`
- **Responsibilities**:
  - Accept PDF file uploads
  - Display upload progress
  - Handle errors gracefully

#### 2. ChatInterface Component
- **Purpose**: Enable RAG-based document chat
- **Props**:
  - `documentText: string`
  - `contextName: string`
- **State**:
  - `messages: Message[]`
  - `isLoading: boolean`
  - `error: string | null`
- **Responsibilities**:
  - Display chat history
  - Send queries to backend
  - Display AI responses
  - Handle errors

#### 3. MindmapViewer Component
- **Purpose**: Display interactive mindmap visualization
- **Props**:
  - `documentText: string`
  - `contextName: string`
- **State**:
  - `mindmapMarkdown: string`
  - `isLoading: boolean`
  - `error: string | null`
- **Responsibilities**:
  - Generate mindmap from document
  - Render interactive visualization
  - Cache generated mindmap

#### 4. FlashcardViewer Component
- **Purpose**: Display interactive flashcards
- **Props**:
  - `documentText: string`
  - `contextName: string`
- **State**:
  - `flashcards: Flashcard[]`
  - `currentIndex: number`
  - `isFlipped: boolean`
  - `isLoading: boolean`
- **Responsibilities**:
  - Generate flashcards from document
  - Display current card
  - Handle navigation
  - Handle flip animation

#### 5. SummaryGenerator Component
- **Purpose**: Generate customizable document summaries
- **Props**:
  - `documentText: string`
  - `contextName: string`
- **State**:
  - `summary: string`
  - `style: string`
  - `depth: string`
  - `length: string`
  - `isLoading: boolean`
- **Responsibilities**:
  - Accept customization options
  - Generate summary
  - Display formatted summary

#### 6. DocumentPreview Component
- **Purpose**: Display PDF preview
- **Props**:
  - `file: File`
  - `fileName: string`
- **Responsibilities**:
  - Render PDF using pdfjs-dist
  - Handle page navigation
  - Display loading state

### Backend API Endpoints

#### 1. POST /api/documents/upload
- **Purpose**: Upload and process PDF
- **Request**:
  ```json
  {
    "file": "binary",
    "userId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "documentId": "string",
    "fileName": "string",
    "textLength": "number",
    "extractedText": "string"
  }
  ```
- **Responsibilities**:
  - Extract text from PDF
  - Store in Supabase
  - Return extracted text

#### 2. POST /api/chat
- **Purpose**: Process chat query with RAG
- **Request**:
  ```json
  {
    "query": "string",
    "documentText": "string",
    "conversationHistory": "Message[]"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "string",
    "sources": "string[]"
  }
  ```
- **Responsibilities**:
  - Retrieve relevant chunks
  - Generate response with Gemini
  - Return answer with sources

#### 3. POST /api/mindmap/generate
- **Purpose**: Generate mindmap from document
- **Request**:
  ```json
  {
    "documentText": "string",
    "documentId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "markdown": "string",
    "cached": "boolean"
  }
  ```
- **Responsibilities**:
  - Generate markdown mindmap
  - Cache result in Supabase
  - Return markdown

#### 4. POST /api/flashcards/generate
- **Purpose**: Generate flashcards from document
- **Request**:
  ```json
  {
    "documentText": "string",
    "count": "number",
    "documentId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "flashcards": [
      {
        "id": "string",
        "question": "string",
        "answer": "string"
      }
    ],
    "cached": "boolean"
  }
  ```
- **Responsibilities**:
  - Generate flashcards with Gemini
  - Cache result in Supabase
  - Return flashcard array

#### 5. POST /api/summary/generate
- **Purpose**: Generate customized summary
- **Request**:
  ```json
  {
    "documentText": "string",
    "style": "string",
    "depth": "string",
    "length": "string",
    "documentId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "summary": "string",
    "cached": "boolean"
  }
  ```
- **Responsibilities**:
  - Generate summary with Gemini
  - Cache result in Supabase
  - Return formatted summary

## Data Models

### Document Model
```typescript
interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  extractedText: string;
  textLength: number;
  uploadedAt: Date;
  updatedAt: Date;
}
```

### Flashcard Model
```typescript
interface Flashcard {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  createdAt: Date;
}
```

### GeneratedContent Model
```typescript
interface GeneratedContent {
  id: string;
  documentId: string;
  type: 'mindmap' | 'flashcards' | 'summary';
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
  expiresAt: Date;
}
```

### Message Model
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documentId?: string;
}
```

## Error Handling

### Error Types

1. **PDF Extraction Errors**
   - Invalid PDF format
   - Corrupted file
   - Unsupported encoding
   - **Handling**: Display user-friendly message, suggest file validation

2. **API Errors**
   - Rate limiting (429)
   - Authentication failure (401)
   - Server errors (500)
   - **Handling**: Retry logic with exponential backoff, user notification

3. **Supabase Errors**
   - Database connection failures
   - Storage upload failures
   - Authentication errors
   - **Handling**: Fallback to session storage, retry mechanism

4. **Gemini API Errors**
   - Invalid API key
   - Rate limits exceeded
   - Content policy violations
   - **Handling**: Graceful degradation, error logging

### Error Recovery Strategy

```
User Action
    ↓
Try Operation
    ↓
Success? → Return Result
    ↓ No
Retry with Backoff (3 attempts)
    ↓
Success? → Return Result
    ↓ No
Fallback Strategy (if available)
    ↓
Success? → Return Result
    ↓ No
Display Error to User + Log
```

## Testing Strategy

### Unit Tests
- PDF text extraction functions
- RAG chunk retrieval logic
- Markdown generation for mindmaps
- Flashcard JSON parsing
- Summary formatting

### Integration Tests
- Document upload → text extraction → storage
- Chat query → RAG retrieval → Gemini response
- Mindmap generation → caching → retrieval
- Flashcard generation → storage → display

### E2E Tests
- Complete user flow: upload → chat → mindmap → flashcards → summary
- Multi-document context switching
- Error scenarios (invalid PDF, API failures)
- Cache invalidation on document change

### Performance Tests
- PDF extraction time for large files (>10MB)
- RAG retrieval latency
- Mindmap generation time
- API response times

## Caching Strategy

### Cache Layers

1. **Client-Side (React State)**
   - Extracted document text
   - Generated mindmaps
   - Generated flashcards
   - Chat history

2. **Server-Side (Supabase)**
   - Generated content (mindmaps, flashcards, summaries)
   - Document metadata
   - User preferences

3. **Cache Invalidation**
   - Clear on document change
   - Clear on context switch
   - Expire after 24 hours
   - Manual refresh option

## Security Considerations

1. **Data Privacy**
   - API keys stored in environment variables
   - No sensitive data in logs
   - Secure error messages without exposing internals

2. **API Security**
   - Rate limiting to prevent abuse
   - Input validation on all endpoints
   - CORS configuration
   - HTTPS only
   - Request size limits

## Deployment Architecture

### Frontend
- Vite build output deployed to Vercel/Netlify
- Environment variables for API endpoints
- CDN for static assets

### Backend
- Node.js/Express deployed to Heroku/Railway
- Environment variables for API keys
- Database migrations managed

### Supabase
- PostgreSQL database
- Storage buckets for PDFs
- Real-time subscriptions (optional)

## Performance Optimization

1. **Frontend**
   - Code splitting for components
   - Lazy loading of study tools
   - Memoization of expensive computations
   - Image optimization

2. **Backend**
   - Connection pooling for database
   - Caching of generated content
   - Async processing for heavy operations
   - Request batching

3. **API**
   - Pagination for large result sets
   - Compression of responses
   - CDN for static content
   - Rate limiting to prevent abuse
