# Automatic Google Drive Folder Scanning - Complete Guide

## Overview

The Automatic Drive Scanning feature allows the application to automatically discover, organize, and load documents from a structured Google Drive folder without manual configuration. Simply share one main folder, and the system handles everything else.

---

## Why Automatic Mode?

### Problems with Manual Configuration
- ❌ Must manually add each document to code
- ❌ Need to extract file IDs from share links
- ❌ Hard to maintain when documents change
- ❌ Requires code deployment for new documents
- ❌ Error-prone copy-paste process

### Benefits of Automatic Mode
- ✅ **Zero Configuration**: Just share one folder
- ✅ **Auto-Discovery**: Finds all PDFs automatically
- ✅ **Smart Organization**: Maps folders to categories
- ✅ **Nested Support**: Handles subfolders (BE, BME, CHEM, etc.)
- ✅ **Smart Naming**: Generates readable names from filenames
- ✅ **Real-Time Updates**: New files appear automatically (with cache refresh)
- ✅ **No Code Changes**: Add/remove files without touching code

---

## Setup Process

### Step 1: Get Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Drive API**
4. Create credentials → API Key
5. Restrict the key (optional but recommended):
   - API restrictions: Google Drive API only
   - Application restrictions: HTTP referrers (your domain)

### Step 2: Organize Your Drive Folder

Create a main folder with this structure:

```
📁 Study Materials (Main Folder)
├── 📁 PYQs
│   ├── 📄 ds_pyq_2023.pdf
│   ├── 📄 algo_final_2022.pdf
│   └── 📁 BE (Subfolder)
│       ├── 📄 be_midterm_2023.pdf
│       └── 📄 be_final_2023.pdf
│   └── 📁 BME (Subfolder)
│       ├── 📄 bme_quiz_2023.pdf
│       └── 📄 bme_pyq_2022.pdf
├── 📁 Teacher Notes
│   ├── 📄 prof_smith_lecture1.pdf
│   └── 📄 prof_johnson_notes.pdf
└── 📁 Senior Notes
    ├── 📄 senior_dsa_complete.pdf
    └── 📄 exam_tips_2023.pdf
```

**Folder Naming Rules:**
- Top-level folders determine category
- Use keywords: "PYQ", "Teacher", "Senior", "Professor", "Lecture"
- Subfolders become subcategories (e.g., BE, BME, CHEM)

### Step 3: Share the Main Folder

1. Right-click main folder → Share
2. Change to "Anyone with the link"
3. Set permission to "Viewer"
4. Copy the folder link
5. Extract folder ID from URL:
   ```
   https://drive.google.com/drive/folders/1XyZ123AbC456DeF789
                                          ↑
                                    This is the ID
   ```

### Step 4: Configure Environment

Add to `.env.local`:
```env
VITE_GOOGLE_DRIVE_API_KEY=AIzaSyC...your-api-key
VITE_DRIVE_MAIN_FOLDER_ID=1XyZ123AbC456DeF789
```

### Step 5: Restart Application

The system will automatically scan on startup!

---

## Technical Architecture

### Core Components

**File: `src/lib/drive-folder-scanner.ts`**

```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/drive/v3';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webContentLink?: string;
}

interface DriveFolder {
  id: string;
  name: string;
  files: DriveFile[];
  subfolders?: DriveFolder[];
}
```

---

## Scanning Algorithm

### Phase 1: Initialization

**Triggered on Component Mount:**
```typescript
useEffect(() => {
  if (isAutomaticModeAvailable() && MAIN_FOLDER_ID) {
    setAutoLoading(true);
    
    loadDocumentsFromDrive(MAIN_FOLDER_ID)
      .then(docs => {
        setAutoLoadedDocs(docs);
        toast({
          title: "Documents Loaded!",
          description: `Found ${docs.length} documents in your Drive folder`,
        });
      })
      .catch(error => {
        toast({
          title: "Warning",
          description: "Could not load preset documents from Drive. Using manual configuration.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setAutoLoading(false);
      });
  }
}, [toast]);
```

**Check if Available:**
```typescript
function isAutomaticModeAvailable(): boolean {
  return isDriveAPIConfigured();
}

function isDriveAPIConfigured(): boolean {
  return !!API_KEY && API_KEY !== 'your_api_key_here';
}
```

---

### Phase 2: Folder Structure Scanning

**Main Scanning Function:**
```typescript
export async function scanDriveFolder(mainFolderId: string): Promise<DriveFolder[]> {
  try {
    // Step 1: Get all top-level subfolders (PYQs, Teacher Notes, Senior Notes)
    const topLevelFolders = await listSubfolders(mainFolderId);

    // Step 2: Scan each top-level folder recursively
    const foldersWithFiles = await Promise.all(
      topLevelFolders.map(async (folder) => {
        // Get PDFs directly in this folder
        const directFiles = await listPDFsInFolder(folder.id);
        
        // Get subfolders (like BE, BME, CHEM, etc.)
        const subfolders = await listSubfolders(folder.id);
        
        // Scan each subfolder for PDFs
        const subfoldersWithFiles = await Promise.all(
          subfolders.map(async (subfolder) => {
            const files = await listPDFsInFolder(subfolder.id);
            return {
              ...subfolder,
              files,
              subfolders: [],
            };
          })
        );
        
        return {
          ...folder,
          files: directFiles,
          subfolders: subfoldersWithFiles,
        };
      })
    );

    return foldersWithFiles;
  } catch (error) {
    throw error;
  }
}
```

---

### Phase 3: API Calls

**List Subfolders:**
```typescript
async function listSubfolders(folderId: string): Promise<DriveFolder[]> {
  // Query: Get all folders inside this folder
  const query = `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const fields = 'files(id,name)';
  const url = `${BASE_URL}/files?q=${encodeURIComponent(query)}&fields=${fields}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.files || []).map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      files: [],
    }));
  } catch (error) {
    throw error;
  }
}
```

**List PDF Files:**
```typescript
async function listPDFsInFolder(folderId: string): Promise<DriveFile[]> {
  // Query: Get all PDFs inside this folder
  const query = `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`;
  const fields = 'files(id,name,mimeType,size,modifiedTime,webContentLink)';
  const url = `${BASE_URL}/files?q=${encodeURIComponent(query)}&fields=${fields}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    throw error;
  }
}
```

**API Query Breakdown:**
- `'${folderId}' in parents` - Files inside this folder
- `mimeType='application/pdf'` - Only PDF files
- `trashed=false` - Exclude deleted files
- `fields=files(id,name,...)` - Specific fields to return

---

### Phase 4: Category Mapping

**Automatic Category Detection:**
```typescript
export function mapFolderToCategory(folderName: string): 'pyq' | 'teacher' | 'senior' | null {
  const name = folderName.toLowerCase();
  
  // PYQ variations
  if (name.includes('pyq') || 
      name.includes('previous year') || 
      name.includes('past paper')) {
    return 'pyq';
  }
  
  // Teacher variations
  if (name.includes('teacher') || 
      name.includes('professor') || 
      name.includes('lecture') || 
      name.includes('prof')) {
    return 'teacher';
  }
  
  // Senior variations
  if (name.includes('senior') || 
      name.includes('student note') || 
      name.includes('batch')) {
    return 'senior';
  }
  
  return null; // Unrecognized folder
}
```

**Supported Folder Names:**
- **PYQ**: "PYQs", "Previous Year Questions", "Past Papers", "PYQ 2023"
- **Teacher**: "Teacher Notes", "Professor Lectures", "Prof Smith", "Lecture Notes"
- **Senior**: "Senior Notes", "Student Notes", "2023 Batch", "Senior Resources"

---

### Phase 5: Document Creation

**Convert Scanned Data to Documents:**
```typescript
export async function loadDocumentsFromDrive(mainFolderId: string): Promise<PresetDocument[]> {
  // Check cache first
  const now = Date.now();
  if (cachedDocuments && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedDocuments;
  }
  
  try {
    const folders = await scanDriveFolder(mainFolderId);
    const documents: PresetDocument[] = [];

    folders.forEach((folder: DriveFolder) => {
      const category = mapFolderToCategory(folder.name);
      
      if (!category) {
        return; // Skip unrecognized folders
      }

      // Add files directly in the main category folder
      folder.files.forEach((file) => {
        documents.push({
          id: file.id,
          name: file.name.replace('.pdf', ''),
          driveFileId: file.id,
          category,
          size: file.size ? formatFileSize(file.size) : undefined,
          lastUpdated: formatDate(file.modifiedTime),
        });
      });

      // Add files from subfolders (like BE, BME, CHEM, etc.)
      if (folder.subfolders && folder.subfolders.length > 0) {
        folder.subfolders.forEach((subfolder) => {
          subfolder.files.forEach((file) => {
            // Generate a beautiful name from the filename
            const beautifulName = generateQuickName(file.name, subfolder.name);
            
            documents.push({
              id: file.id,
              name: beautifulName,
              driveFileId: file.id,
              category,
              subcategory: subfolder.name, // BE, BME, CHEM, etc.
              size: file.size ? formatFileSize(file.size) : undefined,
              lastUpdated: formatDate(file.modifiedTime),
            });
          });
        });
      }
    });

    // Update cache
    cachedDocuments = documents;
    cacheTimestamp = now;

    return documents;
  } catch (error) {
    throw error;
  }
}
```

---

### Phase 6: Smart Naming

**Automatic Name Generation:**
```typescript
export function generateQuickName(filename: string, subcategory?: string): string {
  const info = extractFileInfo(filename);
  const beautified = beautifyFilename(filename);
  
  const parts: string[] = [];
  
  if (subcategory) {
    parts.push(subcategory); // "BE", "BME", etc.
  }
  
  if (info.type) {
    parts.push(info.type); // "PYQ", "Midterm", "Final"
  }
  
  if (info.year) {
    parts.push(info.year); // "2023"
  }
  
  if (info.semester) {
    parts.push(`Sem ${info.semester}`); // "Sem 5"
  }
  
  // If we have enough info, use it
  if (parts.length >= 2) {
    return parts.join(' - '); // "BE - PYQ - 2023"
  }
  
  // Otherwise use beautified filename
  return beautified;
}
```

**Extract Information from Filename:**
```typescript
export function extractFileInfo(filename: string): {
  subject?: string;
  year?: string;
  type?: string;
  semester?: string;
} {
  const info: any = {};
  
  // Extract year (2020-2030)
  const yearMatch = filename.match(/20[2-3]\d/);
  if (yearMatch) {
    info.year = yearMatch[0];
  }
  
  // Extract semester
  const semMatch = filename.match(/sem(?:ester)?\s*(\d)/i);
  if (semMatch) {
    info.semester = semMatch[1];
  }
  
  // Extract type
  if (/pyq|previous year|past paper/i.test(filename)) {
    info.type = 'PYQ';
  } else if (/mid(?:term)?/i.test(filename)) {
    info.type = 'Midterm';
  } else if (/final/i.test(filename)) {
    info.type = 'Final';
  } else if (/quiz/i.test(filename)) {
    info.type = 'Quiz';
  }
  
  return info;
}
```

**Beautify Filename:**
```typescript
export function beautifyFilename(filename: string): string {
  // Remove .pdf extension
  let name = filename.replace(/\.pdf$/i, '');
  
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, ' ');
  
  // Remove common prefixes
  name = name.replace(/^(pyq|PYQ|previous year|exam|test|paper)\s*/i, '');
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Remove extra spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}
```

**Examples:**
- `be_pyq_2023_final.pdf` → `BE - PYQ - 2023`
- `ds_midterm_sem5_2022.pdf` → `Midterm - 2022 - Sem 5`
- `prof_smith_lecture_notes.pdf` → `Prof Smith Lecture Notes`

---

## Caching Mechanism

### Why Caching?

- **Performance**: Avoid repeated API calls
- **Rate Limits**: Respect Drive API quotas
- **User Experience**: Instant load on subsequent visits

### Implementation

```typescript
let cachedDocuments: PresetDocument[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function loadDocumentsFromDrive(mainFolderId: string): Promise<PresetDocument[]> {
  // Check cache
  const now = Date.now();
  if (cachedDocuments && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Using cached documents');
    return cachedDocuments;
  }
  
  console.log('🔄 Fetching fresh documents from Drive');
  
  // Fetch fresh data
  const documents = await scanDriveFolder(mainFolderId);
  
  // Update cache
  cachedDocuments = documents;
  cacheTimestamp = now;
  
  return documents;
}
```

**Cache Invalidation:**
- Automatic after 5 minutes
- Manual: Refresh page
- Future: Add "Refresh" button in UI

---

## UI Integration

### Display Grouped Documents

```typescript
// Get documents (auto-loaded or manual)
const docs = autoLoadedDocs.length > 0 
  ? autoLoadedDocs.filter(d => d.category === 'pyq')
  : getPYQDocuments();

// Group by subcategory
const grouped: Record<string, typeof docs> = {};
docs.forEach(doc => {
  const subcategory = doc.subcategory || 'General';
  if (!grouped[subcategory]) {
    grouped[subcategory] = [];
  }
  grouped[subcategory].push(doc);
});

const subcategories = Object.keys(grouped).sort();
```

### Render Nested Structure

```typescript
{subcategories.map(subcategory => (
  <div key={subcategory}>
    {/* Subcategory Header */}
    <div className="subcategory-header">
      <span>📚 {subcategory}</span>
      <span>({grouped[subcategory].length} files)</span>
    </div>
    
    {/* Documents in this subcategory */}
    <div className="documents">
      {grouped[subcategory].map(doc => (
        <Button
          key={doc.id}
          onClick={() => handlePresetDocumentClick(doc)}
          className={selectedPresets.has(doc.id) ? 'selected' : ''}
        >
          {selectedPresets.has(doc.id) ? <Check /> : <Plus />}
          <div>
            <p>{doc.name}</p>
            {doc.size && <p className="text-xs">{doc.size}</p>}
          </div>
        </Button>
      ))}
    </div>
  </div>
))}
```

### Loading State

```typescript
{autoLoading ? (
  <div className="loading">
    <Loader2 className="animate-spin" />
    <span>Loading documents from Drive...</span>
  </div>
) : (
  // Render documents
)}
```

---

## Error Handling

### API Errors

```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Drive API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.files || [];
} catch (error) {
  console.error('Failed to fetch from Drive:', error);
  throw error;
}
```

### Fallback to Manual Mode

```typescript
loadDocumentsFromDrive(MAIN_FOLDER_ID)
  .then(docs => {
    setAutoLoadedDocs(docs);
  })
  .catch(error => {
    console.warn('Auto-load failed, using manual configuration:', error);
    toast({
      title: "Warning",
      description: "Could not load preset documents from Drive. Using manual configuration.",
      variant: "destructive",
    });
    // Application continues with manual presetDocuments array
  });
```

### Permission Issues

**Common Errors:**
- `403 Forbidden` - API key not authorized
- `404 Not Found` - Folder ID incorrect or not shared
- `401 Unauthorized` - API key invalid

**Solutions:**
1. Check API key is correct
2. Verify folder is shared "Anyone with link"
3. Ensure Drive API is enabled in Google Cloud Console
4. Check API key restrictions

---

## Performance Optimization

### Parallel Processing

```typescript
// Scan all top-level folders in parallel
const foldersWithFiles = await Promise.all(
  topLevelFolders.map(async (folder) => {
    // Each folder scanned independently
    const directFiles = await listPDFsInFolder(folder.id);
    const subfolders = await listSubfolders(folder.id);
    
    // Scan subfolders in parallel too
    const subfoldersWithFiles = await Promise.all(
      subfolders.map(async (subfolder) => {
        const files = await listPDFsInFolder(subfolder.id);
        return { ...subfolder, files };
      })
    );
    
    return { ...folder, files: directFiles, subfolders: subfoldersWithFiles };
  })
);
```

### Recursive Depth Limiting

```typescript
async function scanFolderRecursive(folderId: string, depth: number = 0): Promise<DriveFolder> {
  const MAX_DEPTH = 2; // Prevent infinite recursion
  
  if (depth > MAX_DEPTH) {
    return { id: folderId, name: '', files: [], subfolders: [] };
  }
  
  // Continue scanning...
}
```

### Field Selection

```typescript
// Only request needed fields to reduce payload size
const fields = 'files(id,name,mimeType,size,modifiedTime)';
const url = `${BASE_URL}/files?q=${query}&fields=${fields}&key=${API_KEY}`;
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION STARTS                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Check: isAutomaticModeAvailable()                          │
│  - VITE_GOOGLE_DRIVE_API_KEY exists?                        │
│  - VITE_DRIVE_MAIN_FOLDER_ID exists?                        │
└────────────┬───────────────────────────────┬────────────────┘
             │ YES                           │ NO
             ▼                               ▼
┌────────────────────────────┐   ┌─────────────────────────┐
│ loadDocumentsFromDrive()   │   │ Use Manual Config       │
└────────────┬───────────────┘   └─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Check Cache (5 min TTL)                                    │
└────────────┬───────────────────────────────┬────────────────┘
             │ MISS                          │ HIT
             ▼                               ▼
┌────────────────────────────┐   ┌─────────────────────────┐
│ scanDriveFolder()          │   │ Return Cached Docs      │
└────────────┬───────────────┘   └─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  API Call: listSubfolders(mainFolderId)                     │
│  Returns: ["PYQs", "Teacher Notes", "Senior Notes"]         │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  For Each Top-Level Folder (Parallel):                      │
│  1. listPDFsInFolder(folderId) → Direct PDFs                │
│  2. listSubfolders(folderId) → Get subfolders               │
│  3. For each subfolder: listPDFsInFolder() → Nested PDFs    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Map Folder Names to Categories                             │
│  - "PYQs" → category: 'pyq'                                 │
│  - "Teacher Notes" → category: 'teacher'                    │
│  - "Senior Notes" → category: 'senior'                      │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Generate Smart Names                                       │
│  - extractFileInfo() → year, type, semester                 │
│  - beautifyFilename() → clean up                            │
│  - generateQuickName() → "BE - PYQ - 2023"                  │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Create PresetDocument Objects                              │
│  {                                                           │
│    id: file.id,                                             │
│    name: "BE - PYQ - 2023",                                 │
│    driveFileId: file.id,                                    │
│    category: 'pyq',                                         │
│    subcategory: 'BE',                                       │
│    size: "2.5 MB",                                          │
│    lastUpdated: "Nov 18, 2025"                              │
│  }                                                           │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Update Cache & Return Documents                            │
│  - cachedDocuments = documents                              │
│  - cacheTimestamp = Date.now()                              │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Display in UI (Grouped by Category & Subcategory)          │
│  - PYQs                                                      │
│    - 📚 BE (5 files)                                        │
│    - 📚 BME (3 files)                                       │
│  - Teacher Notes (8 files)                                  │
│  - Senior Notes (6 files)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## API Request Examples

### List Subfolders

**Request:**
```
GET https://www.googleapis.com/drive/v3/files
  ?q='1XyZ123AbC456' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false
  &fields=files(id,name)
  &key=AIzaSyC...
```

**Response:**
```json
{
  "files": [
    { "id": "1ABC...", "name": "PYQs" },
    { "id": "1DEF...", "name": "Teacher Notes" },
    { "id": "1GHI...", "name": "Senior Notes" }
  ]
}
```

### List PDFs in Folder

**Request:**
```
GET https://www.googleapis.com/drive/v3/files
  ?q='1ABC...' in parents and mimeType='application/pdf' and trashed=false
  &fields=files(id,name,mimeType,size,modifiedTime,webContentLink)
  &key=AIzaSyC...
```

**Response:**
```json
{
  "files": [
    {
      "id": "1PDF123",
      "name": "be_pyq_2023.pdf",
      "mimeType": "application/pdf",
      "size": "2621440",
      "modifiedTime": "2025-11-18T10:30:00.000Z",
      "webContentLink": "https://drive.google.com/..."
    }
  ]
}
```

---

## Comparison: Manual vs Automatic

| Feature | Manual Mode | Automatic Mode |
|---------|-------------|----------------|
| **Setup Time** | 5-10 min per document | 2 minutes one-time |
| **Add New Document** | Edit code + deploy | Just upload to Drive |
| **Remove Document** | Edit code + deploy | Delete from Drive |
| **Rename Document** | Edit code + deploy | Rename in Drive |
| **Organization** | Manual categorization | Auto-detected |
| **Subcategories** | Manual configuration | Auto-discovered |
| **File Names** | Manual entry | Auto-generated |
| **Maintenance** | High | Zero |
| **Error Prone** | Yes (copy-paste) | No |
| **Scalability** | Poor (100+ docs) | Excellent |
| **Real-time Updates** | No | Yes (with cache refresh) |

---

## Best Practices

### Folder Organization

1. **Use Clear Names**: "PYQs", "Teacher Notes", "Senior Notes"
2. **Consistent Structure**: Same depth for all categories
3. **Meaningful Subfolders**: "BE", "BME", "CHEM" (not "Folder1", "Folder2")
4. **Clean Filenames**: Include year, type, subject in filename

### File Naming Conventions

**Good:**
- `be_pyq_2023_final.pdf`
- `ds_midterm_sem5_2022.pdf`
- `prof_smith_algorithms_lecture.pdf`

**Bad:**
- `document1.pdf`
- `untitled.pdf`
- `scan_20231118_001.pdf`

### Security

1. **API Key**: Use environment variables, never commit to git
2. **Folder Permissions**: "Anyone with link" is sufficient
3. **API Restrictions**: Restrict key to your domain
4. **Rate Limits**: Cache helps avoid hitting limits

### Performance

1. **Limit Depth**: Max 2 levels of nesting
2. **File Count**: Keep under 100 PDFs per folder
3. **File Size**: Optimize PDFs (compress if needed)
4. **Cache Duration**: 5 minutes is optimal

---

## Troubleshooting

### Documents Not Loading

**Check:**
1. API key is correct in `.env.local`
2. Folder ID is correct
3. Folder is shared "Anyone with link"
4. Drive API is enabled in Google Cloud Console
5. Check browser console for errors

### Wrong Categories

**Solution:**
- Rename folders to include keywords: "PYQ", "Teacher", "Senior"
- Check `mapFolderToCategory()` function

### Missing Subfolders

**Check:**
- Subfolders are inside category folders (not main folder)
- Subfolders contain PDF files
- Folder depth is not too deep (max 2 levels)

### Slow Loading

**Optimize:**
- Reduce number of files
- Check internet connection
- Verify API key quota
- Cache should help on subsequent loads

---

## Future Enhancements

### Planned Features

1. **Manual Refresh Button**: Force cache invalidation
2. **Real-time Sync**: WebSocket updates when Drive changes
3. **Folder Watching**: Detect new files automatically
4. **Advanced Filtering**: Search, sort, filter documents
5. **Batch Operations**: Select multiple documents at once
6. **Custom Categories**: User-defined categories
7. **Metadata Extraction**: Auto-extract subject, year from PDF content
8. **AI-Powered Naming**: Use Gemini to generate better names
9. **Offline Support**: Cache documents locally
10. **Analytics**: Track most-used documents

### Potential Improvements

- **Pagination**: Handle 1000+ documents
- **Lazy Loading**: Load documents on-demand
- **Progressive Enhancement**: Show partial results while loading
- **Error Recovery**: Retry failed API calls
- **Background Sync**: Update cache in background

---

## Summary

The Automatic Drive Scanning feature transforms document management from a tedious manual process into a seamless, zero-maintenance system. By simply organizing files in Google Drive, the application automatically discovers, categorizes, and presents them to users with intelligent naming and grouping.

**Key Benefits:**
- ✅ Zero code changes for new documents
- ✅ Automatic organization and naming
- ✅ Support for nested folder structures
- ✅ Smart caching for performance
- ✅ Graceful fallback to manual mode
- ✅ Real-time updates (with cache refresh)

This feature is perfect for educational platforms, document libraries, and any application that needs to manage large collections of files from Google Drive.
