import { PresetDocument, getDriveDownloadUrl } from './preset-documents';

/**
 * Download a document from Google Drive with proper error handling
 */
export async function downloadDocument(document: PresetDocument): Promise<void> {
  try {
    const url = getDriveDownloadUrl(document.driveFileId);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${document.name}.pdf`;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(`Failed to download ${document.name}`);
  }
}

/**
 * Download with fetch (for CORS-protected files)
 */
export async function downloadDocumentWithFetch(document: PresetDocument): Promise<void> {
  try {
    const url = getDriveDownloadUrl(document.driveFileId);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${document.name}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    throw new Error(`Failed to download ${document.name}`);
  }
}
