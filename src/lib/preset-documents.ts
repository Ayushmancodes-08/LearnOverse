/**
 * ⚡ SUPER EASY SETUP - Just paste your Google Drive share links!
 * 
 * HOW TO ADD DOCUMENTS:
 * 1. Right-click your PDF in Google Drive → Share → "Anyone with link"
 * 2. Copy the entire share link
 * 3. Paste it in the 'shareLink' field below
 * 4. That's it! The file ID is extracted automatically!
 * 
 * Example:
 * shareLink: 'https://drive.google.com/file/d/1XyZ123AbC456/view?usp=sharing'
 * 
 * The system automatically extracts the ID and creates the download link!
 */

export interface PresetDocument {
  id: string;
  name: string;
  driveFileId: string;
  category: 'pyq' | 'teacher' | 'senior';
  subcategory?: string; // For nested folders like "BE", "BME", "CHEM"
  description?: string;
  size?: string;
  lastUpdated?: string;
}

// Helper function to convert Drive share link to direct download link
export function getDriveDownloadUrl(fileId: string): string {
  // Use the Drive API endpoint with the API key for CORS-friendly access
  const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
}

// Helper function to extract file ID from Drive share link
export function extractDriveFileId(shareLink: string): string | null {
  // Handles multiple Drive URL formats:
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  
  // Try /d/ format first
  let match = shareLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  // Try ?id= format
  match = shareLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  // If it's already just an ID, return it
  if (/^[a-zA-Z0-9_-]+$/.test(shareLink)) {
    return shareLink;
  }
  
  return null;
}

// Helper to create document from share link
export function createDocumentFromLink(
  id: string,
  name: string,
  shareLink: string,
  category: 'pyq' | 'teacher' | 'senior',
  description?: string,
  size?: string
): PresetDocument | null {
  const fileId = extractDriveFileId(shareLink);
  
  if (!fileId) {
    return null;
  }
  
  return {
    id,
    name,
    driveFileId: fileId,
    category,
    description,
    size,
  };
}

/**
 * ⚡ SUPER EASY CONFIGURATION
 * 
 * Just paste your Google Drive share links below!
 * No need to extract IDs manually - it's done automatically!
 * 
 * Steps:
 * 1. Share your PDF (Anyone with link)
 * 2. Copy the ENTIRE share link
 * 3. Paste it in 'shareLink' below
 * 4. Done! ✅
 */

// Define documents with share links (easier!)
const documentLinks = [
  // ==================== PYQs ====================
  {
    id: 'pyq-1',
    name: 'Data Structures PYQ 2023',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'pyq' as const,
    description: 'Previous year questions for Data Structures',
    size: '2.5 MB',
  },
  {
    id: 'pyq-2',
    name: 'Algorithms PYQ 2023',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'pyq' as const,
    description: 'Previous year questions for Algorithms',
    size: '1.8 MB',
  },
  {
    id: 'pyq-3',
    name: 'Operating Systems PYQ 2022-23',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'pyq' as const,
    description: 'Two years of OS questions',
    size: '3.2 MB',
  },

  // ==================== Teacher Notes ====================
  {
    id: 'teacher-1',
    name: 'Prof. Smith - Data Structures',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'teacher' as const,
    description: 'Complete lecture notes',
    size: '5.4 MB',
  },
  {
    id: 'teacher-2',
    name: 'Prof. Johnson - Algorithms',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'teacher' as const,
    description: 'Algorithm design and analysis',
    size: '4.1 MB',
  },
  {
    id: 'teacher-3',
    name: 'Prof. Williams - OS Concepts',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'teacher' as const,
    description: 'Operating system fundamentals',
    size: '6.8 MB',
  },

  // ==================== Senior Notes ====================
  {
    id: 'senior-1',
    name: 'Senior Notes - DSA Complete',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'senior' as const,
    description: 'Comprehensive DSA notes from 2023 batch',
    size: '8.2 MB',
  },
  {
    id: 'senior-2',
    name: 'Senior Notes - Exam Tips',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'senior' as const,
    description: 'Important topics and shortcuts',
    size: '1.5 MB',
  },
  {
    id: 'senior-3',
    name: 'Senior Notes - Quick Revision',
    shareLink: 'PASTE_YOUR_DRIVE_LINK_HERE', // ← Just paste the entire link!
    category: 'senior' as const,
    description: 'Last-minute revision material',
    size: '2.1 MB',
  },
];

// Automatically convert share links to documents
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

// Helper functions to get documents by category
export function getPYQDocuments(): PresetDocument[] {
  return presetDocuments.filter(doc => doc.category === 'pyq');
}

export function getTeacherDocuments(): PresetDocument[] {
  return presetDocuments.filter(doc => doc.category === 'teacher');
}

export function getSeniorDocuments(): PresetDocument[] {
  return presetDocuments.filter(doc => doc.category === 'senior');
}

export function getDocumentById(id: string): PresetDocument | undefined {
  return presetDocuments.find(doc => doc.id === id);
}

/**
 * Get unique subcategories for a category (e.g., ["BE", "BME", "CHEM"] for PYQs)
 */
export function getSubcategories(category: 'pyq' | 'teacher' | 'senior'): string[] {
  const docs = presetDocuments.filter(doc => doc.category === category);
  const subcategories = new Set(docs.map(doc => doc.subcategory).filter(Boolean));
  return Array.from(subcategories).sort();
}

/**
 * Get documents by category and subcategory
 */
export function getDocumentsBySubcategory(
  category: 'pyq' | 'teacher' | 'senior',
  subcategory: string
): PresetDocument[] {
  return presetDocuments.filter(
    doc => doc.category === category && doc.subcategory === subcategory
  );
}

/**
 * Group documents by subcategory
 */
export function groupDocumentsBySubcategory(
  category: 'pyq' | 'teacher' | 'senior'
): Record<string, PresetDocument[]> {
  const docs = presetDocuments.filter(doc => doc.category === category);
  const grouped: Record<string, PresetDocument[]> = {};
  
  // Group documents with subcategories
  docs.forEach(doc => {
    if (doc.subcategory) {
      if (!grouped[doc.subcategory]) {
        grouped[doc.subcategory] = [];
      }
      grouped[doc.subcategory].push(doc);
    } else {
      // Documents without subcategory go in "General" or "Other"
      if (!grouped['General']) {
        grouped['General'] = [];
      }
      grouped['General'].push(doc);
    }
  });
  
  return grouped;
}

/**
 * 🚀 AUTOMATIC MODE: Load documents from Drive folder structure
 * 
 * If you have a structured Drive folder, use this instead!
 * Just provide the main folder ID and it scans everything automatically.
 */
import { 
  scanDriveFolder, 
  mapFolderToCategory, 
  formatFileSize, 
  formatDate,
  isDriveAPIConfigured,
  type DriveFolder 
} from './drive-folder-scanner';
import { generateQuickName } from './smart-naming';

let cachedDocuments: PresetDocument[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Load documents automatically from Drive folder structure (supports nested folders)
 */
export async function loadDocumentsFromDrive(mainFolderId: string): Promise<PresetDocument[]> {
  // Check cache
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
        return;
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
              subcategory: subfolder.name, // Keep original subfolder name (BE, BME, etc.)
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

/**
 * Check if automatic Drive scanning is available
 */
export function isAutomaticModeAvailable(): boolean {
  return isDriveAPIConfigured();
}

/**
 * Load a preset document from Google Drive
 * Returns the file as a Blob that can be processed
 */
export async function loadPresetDocument(document: PresetDocument): Promise<Blob> {
  const url = getDriveDownloadUrl(document.driveFileId);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load document: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    throw new Error(`Failed to load ${document.name}. Make sure the file is publicly accessible and the API key is valid.`);
  }
}
