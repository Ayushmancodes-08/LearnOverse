import { Upload, FileText, ChevronDown, X, Check, Download, Loader2, Plus, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useRef, useEffect } from "react";
import { useMentisStore } from "@/lib/store";
import { processFile } from "@/lib/pdf-processor";
import { simpleRAG } from "@/lib/simple-rag";
import { useToast } from "@/hooks/use-toast";
import { downloadDocumentWithFetch } from "@/lib/download-manager";
import { 
  getPYQDocuments, 
  getTeacherDocuments, 
  getSeniorDocuments,
  loadPresetDocument,
  loadDocumentsFromDrive,
  isAutomaticModeAvailable,
  groupDocumentsBySubcategory,
  type PresetDocument 
} from "@/lib/preset-documents";

const MAIN_FOLDER_ID = import.meta.env.VITE_DRIVE_MAIN_FOLDER_ID;

export const UploadSection = () => {
  const [openPYQ, setOpenPYQ] = useState(false);
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openSenior, setOpenSenior] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resourceUploading, setResourceUploading] = useState(false);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set());
  const [autoLoadedDocs, setAutoLoadedDocs] = useState<PresetDocument[]>([]);
  const [autoLoading, setAutoLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [resourceOcrProgress, setResourceOcrProgress] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { setPreviewDocument: setGlobalPreviewDocument } = useMentisStore();
  
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const resourceFileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    mainDocument, 
    resources, 
    combinedText,
    setMainDocument, 
    addResource, 
    removeResource, 
    updateCombinedText,
    setRagInitialized,
    setSummary,
    resetGeneratedContent
  } = useMentisStore();
  const { toast } = useToast();

  // Initialize Simple RAG when combined text changes (instant, no API calls)
  useEffect(() => {
    if (combinedText && combinedText.length > 100) {
      simpleRAG.initialize(combinedText);
      setRagInitialized(true);
    }
  }, [combinedText, setRagInitialized]);

  // Auto-load documents from Drive folder structure
  useEffect(() => {
    if (isAutomaticModeAvailable() && MAIN_FOLDER_ID) {
      setAutoLoading(true);
      
      loadDocumentsFromDrive(MAIN_FOLDER_ID)
        .then(docs => {
          setAutoLoadedDocs(docs);
          
          // Show success toast
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

  const handleMainFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setOcrProgress(0);
    try {
      const text = await processFile(file, (progress) => {
        setOcrProgress(progress);
      });
      
      const isImageBasedWarning = text.includes('[This PDF appears to be image-based');
      
      // Create blob URL for PDF preview
      const fileUrl = file.type === 'application/pdf' ? URL.createObjectURL(file) : undefined;
      
      setMainDocument({
        id: Date.now().toString(),
        name: file.name,
        text,
        charCount: text.length,
        file: file,
        fileUrl: fileUrl,
      });
      updateCombinedText();
      resetGeneratedContent(); // Reset all generated content when main document changes
      
      if (isImageBasedWarning) {
        toast({
          title: "⚠️ Image-Based PDF",
          description: `${file.name} appears to be scanned. Text extraction may be limited. Consider using a text-based PDF.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: `${file.name} uploaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setOcrProgress(0);
    }
  };

  const handleResourceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResourceUploading(true);
    setResourceOcrProgress(0);
    try {
      const text = await processFile(file, (progress) => {
        setResourceOcrProgress(progress);
      });
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.md') ? 'md' : 'txt';
      
      const isImageBasedWarning = text.includes('[This PDF appears to be image-based');
      
      // Create blob URL for PDF preview
      const fileUrl = fileType === 'pdf' ? URL.createObjectURL(file) : undefined;
      
      addResource({
        id: Date.now().toString(),
        name: file.name,
        text,
        type: fileType,
        file: file,
        fileUrl: fileUrl,
      });
      updateCombinedText();
      resetGeneratedContent(); // Reset all generated content when resources change
      
      if (isImageBasedWarning) {
        toast({
          title: "⚠️ Image-Based PDF",
          description: `${file.name} appears to be scanned. Text extraction may be limited.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Resource Added",
          description: `${file.name} added successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setResourceUploading(false);
      setResourceOcrProgress(0);
    }
  };

  const handlePresetDocumentClick = async (document: PresetDocument) => {
    // Check if already selected
    if (selectedPresets.has(document.id)) {
      // Deselect - remove from resources
      const resourceToRemove = resources.find(r => r.id === document.id);
      if (resourceToRemove) {
        removeResource(resourceToRemove.id);
        updateCombinedText();
        resetGeneratedContent(); // Reset all generated content when document is removed
      }
      setSelectedPresets(prev => {
        const newSet = new Set(prev);
        newSet.delete(document.id);
        return newSet;
      });
      toast({
        title: "Resource Removed",
        description: `${document.name} removed`,
      });
      return;
    }

    // Load the document AUTOMATICALLY
    setLoadingPresetId(document.id);
    try {
      const blob = await loadPresetDocument(document);
      
      // Create a File object from blob (with fallback for older browsers)
      let file: File;
      try {
        file = new File([blob], `${document.name}.pdf`, { type: 'application/pdf' });
      } catch (e) {
        // Fallback for browsers that don't support File constructor
        file = blob as any;
        (file as any).name = `${document.name}.pdf`;
      }
      
      const text = await processFile(file);
      
      // Check if it's an image-based PDF warning
      const isImageBasedWarning = text.includes('[This PDF appears to be image-based');
      
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
      
      // Update combined text (triggers RAG initialization)
      updateCombinedText();
      resetGeneratedContent(); // Reset all generated content when preset document is loaded
      
      // Mark as selected
      setSelectedPresets(prev => new Set(prev).add(document.id));
      
      // Show appropriate toast
      if (isImageBasedWarning) {
        toast({
          title: "⚠️ Image-Based PDF Detected",
          description: `${document.name} appears to be scanned. Text extraction may be limited.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Document Loaded! 🎉",
          description: `${document.name} is now ready for study`,
        });
      }
    } catch (error) {
      toast({
        title: "Error Loading Document",
        description: error instanceof Error ? error.message : "Failed to load document. It may be corrupted or inaccessible.",
        variant: "destructive",
      });
    } finally {
      setLoadingPresetId(null);
    }
  };

  const handleDownloadDocument = async (doc: PresetDocument) => {
    setDownloadingId(doc.id);
    try {
      await downloadDocumentWithFetch(doc);
      toast({
        title: "Download Started",
        description: `${doc.name} is downloading`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download document",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Load Your Notes</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Upload PDFs, choose a preset, or paste a link to get started.
        </p>

        <input
          ref={mainFileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleMainFileUpload}
          className="hidden"
        />
        
        {mainDocument.name ? (
          <Card className="p-4 bg-secondary/50 border-primary/20 animate-scale-in mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{mainDocument.name}</p>
                <p className="text-xs text-muted-foreground">{mainDocument.charCount.toLocaleString()} characters</p>
              </div>
            </div>
          </Card>
        ) : null}
        
        <Button
          variant="default"
          className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
          onClick={() => mainFileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? (
            <>
              {ocrProgress > 0 ? `Processing... ${ocrProgress}%` : "Uploading..."}
            </>
          ) : mainDocument.name ? "Replace PDF" : "Upload PDF(s)"}
        </Button>
        
        {uploading && ocrProgress > 0 && (
          <div className="mb-4 space-y-2">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {ocrProgress < 100 ? "🔍 Scanning document..." : "✅ Processing complete"}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Preset Resources</h3>
        
        <div className="space-y-2">
          <Collapsible open={openPYQ} onOpenChange={setOpenPYQ}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-secondary/80 text-foreground transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>PYQ's</span>
                  {(() => {
                    const docs = autoLoadedDocs.length > 0 
                      ? autoLoadedDocs.filter(d => d.category === 'pyq')
                      : getPYQDocuments();
                    const selectedCount = docs.filter(d => selectedPresets.has(d.id)).length;
                    return selectedCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {selectedCount}
                      </span>
                    );
                  })()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openPYQ ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 py-2 space-y-3">
              {autoLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading documents from Drive...</span>
                </div>
              ) : (() => {
                const docs = autoLoadedDocs.length > 0 
                  ? autoLoadedDocs.filter(d => d.category === 'pyq')
                  : getPYQDocuments();
                
                // Group by subcategory from the docs themselves
                const grouped: Record<string, typeof docs> = {};
                docs.forEach(doc => {
                  const subcategory = doc.subcategory || 'General';
                  if (!grouped[subcategory]) {
                    grouped[subcategory] = [];
                  }
                  grouped[subcategory].push(doc);
                });
                
                const subcategories = Object.keys(grouped).sort();
                
                // If no subcategories, show flat list
                if (subcategories.length === 0 || (subcategories.length === 1 && subcategories[0] === 'General')) {
                  return docs.map((doc) => (
                    <div key={doc.id} className="flex gap-1">
                      <Button
                        variant="ghost"
                        className={`flex-1 justify-start text-left h-auto py-3 px-3 ${
                          selectedPresets.has(doc.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'
                        }`}
                        onClick={() => {
                          handlePresetDocumentClick(doc);
                          setGlobalPreviewDocument(doc);
                        }}
                        disabled={loadingPresetId === doc.id}
                      >
                        <div className="flex items-start gap-3 w-full">
                          {loadingPresetId === doc.id ? (
                            <Loader2 className="w-4 h-4 mt-0.5 animate-spin flex-shrink-0" />
                          ) : selectedPresets.has(doc.id) ? (
                            <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          ) : (
                            <Plus className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{doc.name}</p>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                            )}
                            {doc.size && (
                              <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                            )}
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 hover:bg-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadDocument(doc);
                        }}
                        disabled={downloadingId === doc.id}
                        title="Download document"
                      >
                        {downloadingId === doc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ));
                }
                
                // Show grouped by subcategory (BE, BME, CHEM, etc.)
                return subcategories.map(subcategory => (
                  <div key={subcategory} className="space-y-1">
                    {/* Subcategory Header */}
                    <div className="px-3 py-2 bg-secondary/30 rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          📚 {subcategory}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({grouped[subcategory].length} files)
                        </span>
                      </div>
                    </div>
                    
                    {/* Documents in this subcategory */}
                    <div className="ml-4 space-y-1">
                      {grouped[subcategory].map(doc => (
                        <div key={doc.id} className="flex gap-1">
                          <Button
                            variant="ghost"
                            className={`flex-1 justify-start text-left h-auto py-2 px-3 ${
                              selectedPresets.has(doc.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'
                            }`}
                            onClick={() => {
                              handlePresetDocumentClick(doc);
                              setGlobalPreviewDocument(doc);
                            }}
                            disabled={loadingPresetId === doc.id}
                          >
                            <div className="flex items-start gap-3 w-full">
                              {loadingPresetId === doc.id ? (
                                <Loader2 className="w-4 h-4 mt-0.5 animate-spin flex-shrink-0" />
                              ) : selectedPresets.has(doc.id) ? (
                                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                              ) : (
                                <Plus className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{doc.name}</p>
                                {doc.size && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                                )}
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 hover:bg-primary/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(doc);
                            }}
                            disabled={downloadingId === doc.id}
                            title="Download document"
                          >
                            {downloadingId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openTeacher} onOpenChange={setOpenTeacher}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-secondary/80 text-foreground transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Teacher Notes</span>
                  {(() => {
                    const docs = autoLoadedDocs.length > 0 
                      ? autoLoadedDocs.filter(d => d.category === 'teacher')
                      : getTeacherDocuments();
                    const selectedCount = docs.filter(d => selectedPresets.has(d.id)).length;
                    return selectedCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {selectedCount}
                      </span>
                    );
                  })()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openTeacher ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 py-2 space-y-1">
              {autoLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading documents from Drive...</span>
                </div>
              ) : (autoLoadedDocs.length > 0 
                ? autoLoadedDocs.filter(d => d.category === 'teacher')
                : getTeacherDocuments()
              ).map((doc) => (
                <div key={doc.id} className="flex gap-1">
                  <Button
                    variant="ghost"
                    className={`flex-1 justify-start text-left h-auto py-3 px-3 ${
                      selectedPresets.has(doc.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => {
                      handlePresetDocumentClick(doc);
                      setGlobalPreviewDocument(doc);
                    }}
                    disabled={loadingPresetId === doc.id}
                  >
                    <div className="flex items-start gap-3 w-full">
                      {loadingPresetId === doc.id ? (
                        <Loader2 className="w-4 h-4 mt-0.5 animate-spin flex-shrink-0" />
                      ) : selectedPresets.has(doc.id) ? (
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{doc.name}</p>
                        {doc.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                        )}
                        {doc.size && (
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                        )}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc);
                    }}
                    disabled={downloadingId === doc.id}
                    title="Download document"
                  >
                    {downloadingId === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={openSenior} onOpenChange={setOpenSenior}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-secondary/80 text-foreground transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Senior Notes</span>
                  {(() => {
                    const docs = autoLoadedDocs.length > 0 
                      ? autoLoadedDocs.filter(d => d.category === 'senior')
                      : getSeniorDocuments();
                    const selectedCount = docs.filter(d => selectedPresets.has(d.id)).length;
                    return selectedCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {selectedCount}
                      </span>
                    );
                  })()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSenior ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 py-2 space-y-1">
              {autoLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading documents from Drive...</span>
                </div>
              ) : (autoLoadedDocs.length > 0 
                ? autoLoadedDocs.filter(d => d.category === 'senior')
                : getSeniorDocuments()
              ).map((doc) => (
                <div key={doc.id} className="flex gap-1">
                  <Button
                    variant="ghost"
                    className={`flex-1 justify-start text-left h-auto py-3 px-3 ${
                      selectedPresets.has(doc.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => {
                      handlePresetDocumentClick(doc);
                      setGlobalPreviewDocument(doc);
                    }}
                    disabled={loadingPresetId === doc.id}
                  >
                    <div className="flex items-start gap-3 w-full">
                      {loadingPresetId === doc.id ? (
                        <Loader2 className="w-4 h-4 mt-0.5 animate-spin flex-shrink-0" />
                      ) : selectedPresets.has(doc.id) ? (
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{doc.name}</p>
                        {doc.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                        )}
                        {doc.size && (
                          <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
                        )}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc);
                    }}
                    disabled={downloadingId === doc.id}
                    title="Download document"
                  >
                    {downloadingId === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Additional Resources */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Loaded Resources ({resources.length})
          </h3>
          <div className="space-y-2">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-3 bg-secondary/50 border-border group hover:bg-secondary/70 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.text.length.toLocaleString()} chars</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      removeResource(resource.id);
                      updateCombinedText();
                      resetGeneratedContent(); // Reset all generated content when resource is removed
                    }}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Add More Resources</h3>
        <input
          ref={resourceFileInputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleResourceUpload}
          className="hidden"
        />
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => resourceFileInputRef.current?.click()}
          disabled={resourceUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {resourceUploading ? "Uploading..." : "Upload Additional Notes"}
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Manual Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste Google Drive link..."
            className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <Button variant="secondary" size="icon" className="hover:bg-primary hover:text-primary-foreground transition-all">
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>


    </div>
  );
};
