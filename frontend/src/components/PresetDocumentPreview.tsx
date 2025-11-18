import { useState, useEffect } from "react";
import { X, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type PresetDocument, loadPresetDocument } from "@/lib/preset-documents";
import { processFile } from "@/lib/pdf-processor";
import { useToast } from "@/hooks/use-toast";

interface PresetDocumentPreviewProps {
  document: PresetDocument;
  isOpen: boolean;
  onClose: () => void;
  onLoad?: (text: string) => void;
}

export const PresetDocumentPreview = ({ 
  document, 
  isOpen, 
  onClose,
  onLoad 
}: PresetDocumentPreviewProps) => {
  const [loading, setLoading] = useState(false);
  const [previewText, setPreviewText] = useState<string>("");
  const [fullText, setFullText] = useState<string>("");
  const { toast } = useToast();

  // Load preview when dialog opens
  useEffect(() => {
    if (isOpen && !previewText) {
      loadPreview();
    }
  }, [isOpen]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const blob = await loadPresetDocument(document);
      const file = new File([blob], `${document.name}.pdf`, { type: 'application/pdf' });
      const text = await processFile(file);
      
      setFullText(text);
      // Show first 2000 characters as preview
      setPreviewText(text.substring(0, 2000) + (text.length > 2000 ? '...' : ''));
    } catch (error) {
      toast({
        title: "Preview Error",
        description: "Could not load document preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDocument = () => {
    if (onLoad && fullText) {
      onLoad(fullText);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            {document.description || "Document preview"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-sm text-muted-foreground">Loading preview...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Document Info */}
            <Card className="p-4 bg-secondary/30">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-medium capitalize">{document.category}</p>
                </div>
                {document.subcategory && (
                  <div>
                    <p className="text-muted-foreground mb-1">Subcategory</p>
                    <p className="font-medium">{document.subcategory}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Size</p>
                  <p className="font-medium">{document.size || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Characters</p>
                  <p className="font-medium">{fullText.length.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Preview Text */}
            <div className="flex-1 overflow-y-auto">
              <Card className="p-4 bg-secondary/20">
                <h4 className="text-sm font-semibold mb-3 text-foreground">Preview</h4>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {previewText}
                </pre>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-2 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              {onLoad && (
                <Button onClick={handleLoadDocument}>
                  <Download className="w-4 h-4 mr-2" />
                  Load Document
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
