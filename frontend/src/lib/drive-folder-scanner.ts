/**
 * 🚀 Automatic Google Drive Folder Scanner
 * 
 * Share ONE main folder and all files are automatically organized!
 * 
 * Setup:
 * 1. Get Google Drive API key (see DRIVE_API_SETUP.md)
 * 2. Share your main Drive folder (Anyone with link)
 * 3. Add folder ID to .env.local
 * 4. Done! Files auto-organize by subfolder names
 */

const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/drive/v3';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webContentLink?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  files: DriveFile[];
  subfolders?: DriveFolder[]; // Support nested folders
}

/**
 * Extract folder ID from Drive share link
 */
export function extractFolderId(shareLink: string): string | null {
  // Handle: https://drive.google.com/drive/folders/FOLDER_ID
  const match = shareLink.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  // If it's already just an ID
  if (/^[a-zA-Z0-9_-]+$/.test(shareLink)) {
    return shareLink;
  }
  
  return null;
}

/**
 * List all subfolders in a folder
 */
async function listSubfolders(folderId: string): Promise<DriveFolder[]> {
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

/**
 * List all PDF files in a folder
 */
async function listPDFsInFolder(folderId: string): Promise<DriveFile[]> {
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

/**
 * Scan folder recursively to support nested subfolders
 */
async function scanFolderRecursive(folderId: string, depth: number = 0): Promise<DriveFolder> {
  const MAX_DEPTH = 2; // Prevent infinite recursion
  
  if (depth > MAX_DEPTH) {
    return { id: folderId, name: '', files: [], subfolders: [] };
  }

  // Get subfolders
  const subfolders = await listSubfolders(folderId);
  
  // Get PDFs in current folder
  const files = await listPDFsInFolder(folderId);
  
  // Recursively scan subfolders
  const subfoldersWithContent = await Promise.all(
    subfolders.map(async (subfolder) => {
      const content = await scanFolderRecursive(subfolder.id, depth + 1);
      return {
        ...subfolder,
        files: content.files,
        subfolders: content.subfolders,
      };
    })
  );

  return {
    id: folderId,
    name: '',
    files,
    subfolders: subfoldersWithContent,
  };
}

/**
 * Scan entire folder structure and organize files (supports nested folders)
 */
export async function scanDriveFolder(mainFolderId: string): Promise<DriveFolder[]> {
  try {
    // Get all top-level subfolders (PYQs, Teacher Notes, Senior Notes)
    const topLevelFolders = await listSubfolders(mainFolderId);

    // Scan each top-level folder recursively
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

/**
 * Map folder names to categories
 */
export function mapFolderToCategory(folderName: string): 'pyq' | 'teacher' | 'senior' | null {
  const name = folderName.toLowerCase();
  
  // PYQ variations
  if (name.includes('pyq') || name.includes('previous year') || name.includes('past paper')) {
    return 'pyq';
  }
  
  // Teacher variations
  if (name.includes('teacher') || name.includes('professor') || name.includes('lecture') || name.includes('prof')) {
    return 'teacher';
  }
  
  // Senior variations
  if (name.includes('senior') || name.includes('student note') || name.includes('batch')) {
    return 'senior';
  }
  
  return null;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: string | number): string {
  const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  if (isNaN(size)) return 'Unknown';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format date for display
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Download a file from Drive
 */
export async function downloadDriveFile(fileId: string): Promise<Blob> {
  const url = `${BASE_URL}/files/${fileId}?alt=media&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    throw error;
  }
}

/**
 * Check if API key is configured
 */
export function isDriveAPIConfigured(): boolean {
  return !!API_KEY && API_KEY !== 'your_api_key_here';
}
