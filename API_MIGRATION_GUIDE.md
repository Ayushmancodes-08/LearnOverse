# API Migration Guide: Express to Vercel Serverless

Guide to migrate your Express backend routes to Vercel serverless functions.

## Overview

Your Express routes in `backend/src/routes/` need to be converted to Vercel serverless functions in the `/api` directory.

## Express Route → Vercel Function Mapping

### Express Route Structure
```typescript
// backend/src/routes/documents.ts
import express from 'express';

export const documentRoutes = express.Router();

documentRoutes.post('/upload', async (req, res) => {
  // Handle request
  res.json({ status: 'success' });
});
```

### Vercel Function Structure
```typescript
// api/documents/upload.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Handle request
  res.json({ status: 'success' });
}
```

## Migration Steps

### 1. Create API Route File

For each Express route, create a corresponding Vercel function:

```
Express: POST /api/documents/upload
Vercel: api/documents/upload.ts
```

### 2. Add CORS Headers

All Vercel functions need CORS headers:

```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Your handler logic
}
```

### 3. Handle HTTP Methods

```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Handle POST
  } else if (req.method === 'GET') {
    // Handle GET
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 4. Access Request Data

```typescript
// Query parameters
const { id } = req.query;

// Request body
const { data } = req.body;

// Headers
const token = req.headers.authorization;
```

## Routes to Migrate

### From backend/src/routes/documents.ts

- `POST /api/documents/upload` → `api/documents/upload.ts`
- `GET /api/documents/:id` → `api/documents/[id].ts`

### From backend/src/routes/chat.ts

- `POST /api/chat` → `api/chat/index.ts`
- `GET /api/chat/history/:id` → `api/chat/history/[id].ts`

### From backend/src/routes/mindmap.ts

- `POST /api/mindmap/generate` → `api/mindmap/generate.ts`

### From backend/src/routes/flashcards.ts

- `POST /api/flashcards/generate` → `api/flashcards/generate.ts`

### From backend/src/routes/summary.ts

- `POST /api/summary/generate` → `api/summary/generate.ts`

## Example: Migrating Chat Route

### Original Express Route
```typescript
// backend/src/routes/chat.ts
chatRoutes.post('/', async (req, res) => {
  const { query, documentText, documentId } = req.body;
  
  if (!query || !documentText) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  try {
    const answer = await generateChatResponse(query, documentText);
    res.json({ status: 'success', answer, sources: [] });
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});
```

### Vercel Serverless Function
```typescript
// api/chat/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, documentText, documentId } = req.body;
  
  if (!query || !documentText) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  try {
    const answer = await generateChatResponse(query, documentText);
    res.json({ status: 'success', answer, sources: [] });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
}
```

## Dynamic Routes

For routes with parameters, use bracket notation:

```
Express: GET /api/documents/:id
Vercel: api/documents/[id].ts
```

Access the parameter:
```typescript
const { id } = req.query;
```

## Environment Variables

Access environment variables in API routes:

```typescript
const supabaseUrl = process.env.SUPABASE_URL;
const apiKey = process.env.GOOGLE_API_KEY;
```

## Testing Locally

Test Vercel functions locally:

```bash
npm install -g vercel
vercel dev
```

This runs your functions locally at `http://localhost:3000/api/*`

## Deployment

Once all routes are migrated:

1. Push to GitHub
2. Vercel automatically deploys
3. All functions available at `https://your-app.vercel.app/api/*`

## Performance Tips

- Keep functions under 10 seconds execution time
- Use connection pooling for databases
- Cache responses when possible
- Minimize cold start time by reducing dependencies

## Limitations

- Max execution time: 10 seconds (free tier), 60 seconds (pro)
- Max payload size: 4.5 MB
- No persistent storage (use database)
- Stateless execution

## Next Steps

1. Migrate all routes to `/api` directory
2. Test each endpoint thoroughly
3. Monitor function execution time
4. Optimize for performance
