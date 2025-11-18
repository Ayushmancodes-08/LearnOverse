import { useState, useEffect } from "react";
import { Eye, FileText, X, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMentisStore } from "@/lib/store";

export const DocumentPreview = () => {
  const { mainDocument, resources, combinedText } = useMentisStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [pdfScale, setPdfScale] = useState(1.0);

  const totalCharCount = mainDocument.charCount + resources.reduce((sum, r) => sum + r.text.length, 0);
  
  // Get all PDF documents
  const pdfDocuments = [
    ...(mainDocument.fileUrl ? [{ ...mainDocument, id: 'main', isPrimary: true }] : []),
    ...resources.filter(r => r.fileUrl)
  ];

  // Auto-select first document
  useEffect(() => {
    if (pdfDocuments.length > 0) {
      setActiveTab(pdfDocuments[0].id);
    }
  }, [mainDocument.id, resources.length]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Live Preview</h2>
        </div>
      </div>

      {/* Document Stats - Compact Info Bar */}
      {combinedText && (
        <Card className="p-3 bg-card border-border">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Main Doc</p>
              <p className="text-sm font-semibold text-foreground">
                {mainDocument.charCount.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Resources</p>
              <p className="text-sm font-semibold text-foreground">
                {resources.length}
              </p>
            </div>
            <div className="p-2 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-sm font-semibold text-primary">
                {totalCharCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Live PDF Preview */}
      {pdfDocuments.length > 0 ? (
        <Card className={`bg-card border-border transition-all ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-foreground">
                PDF Preview
              </h3>
              <span className="text-xs text-muted-foreground">
                ({pdfDocuments.length} document{pdfDocuments.length > 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPdfScale(Math.max(0.5, pdfScale - 0.1))}
                title="Zoom Out"
                className="h-8 w-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                {Math.round(pdfScale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPdfScale(Math.min(2.0, pdfScale + 0.1))}
                title="Zoom In"
                className="h-8 w-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Document Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {pdfDocuments.length > 1 && (
              <div className="px-4 pt-2 border-b border-border">
                <TabsList className="w-full justify-start overflow-x-auto bg-secondary/50">
                  {pdfDocuments.map((doc) => (
                    <TabsTrigger 
                      key={doc.id} 
                      value={doc.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <FileText className="w-3 h-3" />
                      <span className="max-w-[150px] truncate">{doc.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}

            {/* PDF Viewer Content */}
            <div className={`bg-gray-100 dark:bg-gray-900 ${isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-[600px]'} overflow-auto`}>
              {pdfDocuments.map((doc) => (
                <TabsContent 
                  key={doc.id} 
                  value={doc.id}
                  className="h-full m-0 p-0"
                >
                  {doc.fileUrl ? (
                    <iframe
                      src={`${doc.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                      className="w-full h-full border-0"
                      title={doc.name}
                      style={{ 
                        transform: `scale(${pdfScale})`,
                        transformOrigin: 'top left',
                        width: `${100 / pdfScale}%`,
                        height: `${100 / pdfScale}%`
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-2">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Text file preview not available
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.name}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>

          {/* Footer Info */}
          <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>📄 {mainDocument.name ? 1 : 0} main</span>
              <span>•</span>
              <span>📚 {resources.length} resources</span>
              <span>•</span>
              <span>📊 {totalCharCount.toLocaleString()} total chars</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {pdfDocuments.find(d => d.id === activeTab)?.name}
            </span>
          </div>
        </Card>
      ) : (
        /* Empty State - Show when no document */
        <Card className="p-8 bg-card border-border">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No Document Selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload or select a document to see live preview
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
