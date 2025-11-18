# Preset Document Call from Google Drive - Complete Mechanism

## Overview

The preset document system allows users to load pre-configured study materials (PDFs) directly from Google Drive into the application. It supports two modes: **Manual Configuration** and **Automatic Folder Scanning**.

---

## Architecture Components

### 1. Core Files

- **`src/lib/preset-documents.ts`** - Main document management and loading logic
- **`src/lib/drive-folder-scanner.ts`** - Automatic Drive folder scanning
- **`src/lib/download-manager.ts`** - Document download functionality
- **`src/lib/pdf-processor.ts`** - PDF text extraction
- **`src/lib/smart-naming.ts`** - Intelligent document naming
- **`src/components/UploadSection.tsx`** - UI component for document selection

---

## Data Flow Architecture

```
User Clicks Document
        ↓
handlePresetDocumentClick()
        ↓
loadPresetDocument() → Fetch from Drive API
        ↓
processFile() → Extract Text from PDF
        ↓
addResource() → Add to Store
        ↓
updateCombinedText() → Merge all documents
        ↓
simpleRAG.initialize() → Enable AI features
```

---

## Detailed Mechanism

### Phase 1: Configuration & Setup

#### Environment Variables
```env
VITE_GOOGLE_DRIVE_API_KEY=your-api-key-here
VITE_DRIVE_MAIN_FOLDER_ID=your-folder-id-here (optional, for auto mode)
```

#### Document Structure
```typescript
interface PresetDocument {
  id: string;              // Unique identifier
  name: string;            // Display name
  driveFileId: string;     // Google Drive file ID
  category: 'pyq' | 'teacher' | 'senior';
  subcategory?: string;    // e.g., "BE", "BME", "CHEM"
  description?: string;    // Optional description
  size?: string;           // File size (e.g., "2.5 MB")
  lastUpdated?: string;    // Last modified date
}
```

---

### Phase 2: Document Loading (Two Modes)

#### Mode A: Manual Configuration

**Step 1: Define Documents**
```typescript
const documentLinks = [
  {
    id: 'pyq-1',
    name: 'Data Structures PYQ 2023',
    shareLink: 'https://drive.google.com/file/d/1XyZ123AbC456/view',
    category: 'pyq',
    description: 'Previous year questions',
    size: '2.5 MB',
  }
];
```

**Step 2: Extract File ID**
```typescript
function extractDriveFileId(shareLink: string): string | null {
  // Handles multiple formats:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  
  let match = shareLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  match = shareLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  return shareLink; // Already an ID
}
```

**Step 3: Create Document Objects**
```typescript
export const presetDocuments: PresetDocument[] = documentLinks
  .map(doc => createDocumentFromLink(
    doc.id,
    doc.name,
    doc.shareLink,
    doc.category,
    doc.description,
    doc.size
  ))
  .filter((doc): doc is PresetDocument => doc !== null);
```

#### Mode B: Automatic Folder Scanning

**Step 1: Initialize on Component Mount**
```typescript
useEffect(() => {
  if (isAutomaticModeAvailable() && MAIN_FOLDER_ID) {
    setAutoLoading(true);
    
    loadDocumentsFromDrive(MAIN_FOLDER_ID)
      .then(docs => {
        setAutoLoadedDocs(docs);
        toast({ title: "Documents Loaded!", description: `Found ${docs.length} documents` });
      })
      .catch(error => {
        toast({ title: "Warning", description: "Could not load from Drive" });
      })
      .finally(() => setAutoLoading(false));
  }
}, [toast]);
```

**Step 2: Scan Drive Folder Structure**
```typescript
async function scanDriveFolder(mainFolderId: string): Promise<DriveFolder[]> {
  // 1. Get top-level folders (PYQs, Teacher Notes, Senior Notes)
  const topLevelFolders = await listSubfolders(mainFolderId);
  
  // 2. For each top-level folder:
  const foldersWithFiles = await Promise.all(
    topLevelFolders.map(async (folder) => {
      // Get PDFs directly in this folder
      const directFiles = await listPDFsInFolder(folder.id);
      
      // Get subfolders (BE, BME, CHEM, etc.)
      const subfolders = await listSubfolders(folder.id);
      
      // Scan each subfolder for PDFs
      const subfoldersWithFiles = await Promise.all(
        subfolders.map(async (subfolder) => {
          const files = await listPDFsInFolder(subfolder.id);
          return { ...subfolder, files, subfolders: [] };
        })
      );
      
      return { ...folder, files: directFiles, subfolders: subfoldersWithFiles };
    })
  );
  
  return foldersWithFiles;
}
```

**Step 3: Map to Categories**
```typescript
function mapFolderToCategory(folderName: string): 'pyq' | 'teacher' | 'senior' | null {
  const name = folderName.toLowerCase();
  
  if (name.includes('pyq') || name.includes('previous year')) return 'pyq';
  if (name.includes('teacher') || name.includes('professor')) return 'teacher';
  if (name.includes('senior') || name.includes('student note')) return 'senior';
  
  return null;
}
```

**Step 4: Generate Smart Names**
```typescript
function generateQuickName(filename: string, subcategory?: string): string {
  const info = extractFileInfo(filename); // Extract year, type, semester
  const beautified = beautifyFilename(filename); // Clean up filename
  
  const parts: string[] = [];
  if (subcategory) parts.push(subcategory);
  if (info.type) parts.push(info.type);
  if (info.year) parts.push(info.year);
  
  return parts.length >= 2 ? parts.join(' - ') : beautified;
}
```

---

### Phase 3: User Interaction & Document Loading

#### Step 1: User Clicks Document
```typescript
const handlePresetDocumentClick = async (document: PresetDocument) => {
  // Check if already selected
  if (selectedPresets.has(document.id)) {
    // Deselect - remove from resources
    removeResource(document.id);
    updateCombinedText();
    resetGeneratedContent();
    setSelectedPresets(prev => {
      const newSet = new Set(prev);
      newSet.delete(document.id);
      return newSet;
    });
    return;
  }
  
  // Load the document
  setLoadingPresetId(document.id);
  // ... continue to Step 2
}
```

#### Step 2: Fetch from Google Drive
```typescript
async function loadPresetDocument(document: PresetDocument): Promise<Blob> {
  const url = getDriveDownloadUrl(document.driveFileId);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/pdf' },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to load document: ${response.statusText}`);
  }
  
  return await response.blob();
}
```

**Drive API URL Construction:**
```typescript
function getDriveDownloadUrl(fileId: string): string {
  const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
}
```

#### Step 3: Convert Blob to File
```typescript
const blob = await loadPresetDocument(document);

let file: File;
try {
  file = new File([blob], `${document.name}.pdf`, { type: 'application/pdf' });
} catch (e) {
  // Fallback for older browsers
  file = blob as any;
  (file as any).name = `${document.name}.pdf`;
}
```

#### Step 4: Extract Text from PDF
```typescript
const text = await processFile(file);

// Inside processFile():
async function extractTextFromPDF(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    
    if (onProgress) {
      const progress = 30 + Math.floor((pageNum / pdf.numPages) * 60);
      onProgress(progress);
    }
  }
  
  return fullText.replace(/\s+/g, ' ').trim();
}
```

#### Step 5: Add to Application State
```typescript
// Create blob URL for PDF preview
const fileUrl = URL.createObjectURL(blob);

// Add to resources
addResource({
  id: document.id,
  name: document.name,
  text,
  type: 'pdf',
  file: file,
  fileUrl: fileUrl,
});

// Update combined text (merges all documents)
updateCombinedText();

// Reset generated content (summaries, flashcards, etc.)
resetGeneratedContent();

// Mark as selected
setSelectedPresets(prev => new Set(prev).add(document.id));
```

#### Step 6: Initialize RAG System
```typescript
useEffect(() => {
  if (combinedText && combinedText.length > 100) {
    simpleRAG.initialize(combinedText);
    setRagInitialized(true);
  }
}, [combinedText, setRagInitialized]);
```

---

### Phase 4: State Management (Zustand Store)

```typescript
interface MentisStore {
  mainDocument: Document;
  resources: Resource[];
  combinedText: string;
  
  setMainDocument: (doc: Document) => void;
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  updateCombinedText: () => void;
  resetGeneratedContent: () => void;
}

// Update combined text
updateCombinedText: () => {
  const texts: string[] = [];
  
  if (get().mainDocument.text) {
    texts.push(`=== MAIN DOCUMENT: ${get().mainDocument.name} ===\n${get().mainDocument.text}`);
  }
  
  get().resources.forEach(resource => {
    texts.push(`\n\n=== RESOURCE: ${resource.name} ===\n${resource.text}`);
  });
  
  set({ combinedText: texts.join('\n\n') });
}
```

---

## UI Components & User Experience

### Document Display (Collapsible Sections)

```typescript
<Collapsible open={openPYQ} onOpenChange={setOpenPYQ}>
  <CollapsibleTrigger>
    <div className="flex items-center gap-2">
      <FileText className="w-4 h-4" />
      <span>PYQ's</span>
      {selectedCount > 0 && (
        <span className="badge">{selectedCount}</span>
      )}
    </div>
  </CollapsibleTrigger>
  
  <CollapsibleContent>
    {/* Grouped by subcategory */}
    {subcategories.map(subcategory => (
      <div key={subcategory}>
        <div className="subcategory-header">
          📚 {subcategory} ({docs.length} files)
        </div>
        
        {docs.map(doc => (
          <Button onClick={() => handlePresetDocumentClick(doc)}>
            {selectedPresets.has(doc.id) ? <Check /> : <Plus />}
            {doc.name}
          </Button>
        ))}
      </div>
    ))}
  </CollapsibleContent>
</Collapsible>
```

### Loading States

```typescript
{loadingPresetId === doc.id ? (
  <Loader2 className="animate-spin" />
) : selectedPresets.has(doc.id) ? (
  <Check className="text-primary" />
) : (
  <Plus className="text-muted-foreground" />
)}
```

### Progress Indicators

```typescript
{uploading && ocrProgress > 0 && (
  <div className="progress-bar">
    <div style={{ width: `${ocrProgress}%` }} />
    <p>{ocrProgress < 100 ? "🔍 Scanning..." : "✅ Complete"}</p>
  </div>
)}
```

---

## Error Handling

### 1. Image-Based PDF Detection
```typescript
if (fullText.length < 50) {
  return `[This PDF appears to be image-based or contains very little extractable text]
  
To use this document:
1. Use a PDF with text layer (not scanned images)
2. Or use OCR software to convert it first
3. Or manually type/paste the content`;
}
```

### 2. API Failures
```typescript
try {
  const blob = await loadPresetDocument(document);
  // ... process
} catch (error) {
  toast({
    title: "Error Loading Document",
    description: error instanceof Error 
      ? error.message 
      : "Failed to load document. It may be corrupted or inaccessible.",
    variant: "destructive",
  });
}
```

### 3. Drive API Errors
```typescript
if (!response.ok) {
  throw new Error(`Failed to load document: ${response.statusText}`);
}
```

---

## Caching Strategy

```typescript
let cachedDocuments: PresetDocument[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function loadDocumentsFromDrive(mainFolderId: string): Promise<PresetDocument[]> {
  const now = Date.now();
  if (cachedDocuments && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedDocuments;
  }
  
  // Fetch fresh data
  const documents = await scanDriveFolder(mainFolderId);
  
  cachedDocuments = documents;
  cacheTimestamp = now;
  
  return documents;
}
```

---

## Download Functionality

```typescript
async function downloadDocumentWithFetch(document: PresetDocument): Promise<void> {
  const url = getDriveDownloadUrl(document.driveFileId);
  
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${document.name}.pdf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
}
```

---

## Security & Permissions

### Required Drive Permissions
1. **File Sharing**: Files must be set to "Anyone with link can view"
2. **API Key**: Must have Drive API enabled
3. **CORS**: Using `googleapis.com` endpoint for CORS-friendly access

### API Key Configuration
```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/drive/v3';

// Check if configured
function isDriveAPIConfigured(): boolean {
  return !!API_KEY && API_KEY !== 'your_api_key_here';
}
```

---

## Performance Optimizations

### 1. Lazy Loading
- Documents are only fetched when clicked
- Text extraction happens on-demand

### 2. Progress Tracking
```typescript
const [ocrProgress, setOcrProgress] = useState(0);

await processFile(file, (progress) => {
  setOcrProgress(progress);
});
```

### 3. Parallel Processing
```typescript
const subfoldersWithFiles = await Promise.all(
  subfolders.map(async (subfolder) => {
    const files = await listPDFsInFolder(subfolder.id);
    return { ...subfolder, files };
  })
);
```

### 4. Blob URL Management
```typescript
// Create URL for preview
const fileUrl = URL.createObjectURL(blob);

// Clean up when done
setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
```

---

## Integration with AI Features

### RAG (Retrieval-Augmented Generation)
```typescript
// Initialize when combined text changes
useEffect(() => {
  if (combinedText && combinedText.length > 100) {
    simpleRAG.initialize(combinedText);
    setRagInitialized(true);
  }
}, [combinedText]);
```

### Content Reset on Document Change
```typescript
resetGeneratedContent(); // Clears:
// - Summary
// - Flashcards
// - Mind maps
// - Practice questions
// - Chat history
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION START                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Check if Automatic Mode Available                          │
│  (VITE_DRIVE_MAIN_FOLDER_ID exists?)                        │
└────────────┬────────────────────────────────┬───────────────┘
             │ YES                            │ NO
             ▼                                ▼
┌────────────────────────────┐   ┌──────────────────────────┐
│ loadDocumentsFromDrive()   │   │ Use Manual Configuration │
│ - Scan folder structure    │   │ - Load from preset array │
│ - Map to categories        │   │ - Extract file IDs       │
│ - Generate smart names     │   │ - Create documents       │
└────────────┬───────────────┘   └──────────┬───────────────┘
             │                               │
             └───────────────┬───────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              DISPLAY DOCUMENTS IN UI                         │
│  - Grouped by category (PYQ, Teacher, Senior)               │
│  - Nested by subcategory (BE, BME, CHEM, etc.)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ USER CLICKS DOCUMENT
┌─────────────────────────────────────────────────────────────┐
│           handlePresetDocumentClick()                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  loadPresetDocument() - Fetch from Drive API                │
│  URL: googleapis.com/drive/v3/files/{id}?alt=media&key=KEY  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Convert Blob → File Object                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  processFile() - Extract Text                               │
│  - Load PDF with pdf.js                                     │
│  - Extract text from each page                              │
│  - Clean and format text                                    │
│  - Detect image-based PDFs                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  addResource() - Add to Store                               │
│  - Store file, text, metadata                               │
│  - Create blob URL for preview                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  updateCombinedText() - Merge All Documents                 │
│  - Combine main document + all resources                    │
│  - Format with headers                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  simpleRAG.initialize() - Enable AI Features                │
│  - Index combined text                                      │
│  - Enable semantic search                                   │
│  - Ready for Q&A, summaries, etc.                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Two Modes**: Manual configuration or automatic folder scanning
2. **Drive API**: Uses Google Drive API v3 with API key authentication
3. **Text Extraction**: Uses pdf.js for client-side PDF processing
4. **Smart Naming**: Automatically generates readable names from filenames
5. **State Management**: Zustand store manages all document state
6. **RAG Integration**: Extracted text feeds into AI features
7. **Error Handling**: Graceful fallbacks for image-based PDFs and API failures
8. **Caching**: 5-minute cache for Drive folder scans
9. **Progress Tracking**: Real-time feedback during PDF processing
10. **Blob Management**: Proper cleanup of object URLs

This system provides a seamless experience for loading study materials from Google Drive with minimal configuration required.
