import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMentisStore } from '@/lib/store';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const DocumentPreviewBackend = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const { mainDocument } = useMentisStore();

  // Load PDF when document changes
  useEffect(() => {
    if (!mainDocument.file) {
      setPdfDoc(null);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }

    const loadPDF = async () => {
      setLoading(true);
      setError(null);

      try {
        const arrayBuffer = await mainDocument.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        setPdfDoc(null);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [mainDocument.file]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (!mainDocument.file) {
    return (
      <Card className="p-8 text-center bg-muted/30">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No document loaded</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Failed to load PDF</p>
            <p className="text-sm text-red-800 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </Card>
    );
  }

  if (!pdfDoc) {
    return (
      <Card className="p-8 text-center bg-muted/30">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Unable to display PDF</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{mainDocument.name}</p>
            <p className="text-xs text-muted-foreground">
              {mainDocument.charCount.toLocaleString()} characters
            </p>
          </div>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </Card>

      {/* PDF Viewer */}
      <Card className="p-4 bg-muted/30 min-h-96 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">PDF Preview</p>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Use the buttons below to navigate
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-2 justify-between">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Info */}
      <Card className="p-3 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-900">
          💡 PDF preview shows page navigation. Full rendering requires additional setup.
        </p>
      </Card>
    </div>
  );
};
