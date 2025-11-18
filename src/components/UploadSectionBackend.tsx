import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIClient } from '@/lib/api-client';
import { useMentisStore } from '@/lib/store';

export const UploadSectionBackend = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { setMainDocument, updateCombinedText } = useMentisStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'Invalid File Type',
        description: 'Only PDF files are supported',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 50MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await APIClient.uploadDocument(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store document in app state
      setMainDocument({
        id: response.documentId,
        name: response.fileName,
        text: response.extractedText,
        charCount: response.textLength,
        file: file,
      });

      updateCombinedText();

      toast({
        title: 'Success!',
        description: `${response.fileName} uploaded successfully (${response.textLength.toLocaleString()} characters)`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { mainDocument } = useMentisStore();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Upload PDF</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a PDF document to get started with AI-powered study tools.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />

        {mainDocument.name && (
          <Card className="p-4 bg-green-50 border-green-200 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">{mainDocument.name}</p>
                <p className="text-xs text-green-700">
                  {mainDocument.charCount.toLocaleString()} characters
                </p>
              </div>
            </div>
          </Card>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full mb-4"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : mainDocument.name ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Replace PDF
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Choose PDF
            </>
          )}
        </Button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Processing document...
            </p>
          </div>
        )}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Supported Formats</p>
            <ul className="text-xs space-y-1">
              <li>• PDF files (text-based, not scanned images)</li>
              <li>• Maximum size: 50MB</li>
              <li>• Recommended: 10KB - 10MB for best results</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
