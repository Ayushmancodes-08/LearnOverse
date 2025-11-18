import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Network, FileText, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MindmapViewer } from "./MindmapViewer";
import { ChatInterface } from "./ChatInterface";
import { FlashcardGenerator } from "./FlashcardGenerator";
import { FlashcardViewer } from "./FlashcardViewer";
import { FlashcardSetSelector } from "./FlashcardSetSelector";
import { SummaryCustomizer } from "./SummaryCustomizer";
import { SummaryDisplay } from "./SummaryDisplay";
import { useMentisStore } from "@/lib/store";
import { generateMindmap, generateSummary } from "@/lib/gemini";
import { createFlashcardSet } from "@/lib/flashcard-types";
import { useToast } from "@/hooks/use-toast";
import { 
  validateDocumentSize, 
  createSummaryError,
  executeWithRetry as retryWithBackoff 
} from "@/lib/summary-error-handler";
import { SummaryError } from "@/lib/summary-types";
import { hashDocument } from "@/lib/cache-utils";

export const StudyTools = () => {
  const [activeTab, setActiveTab] = useState("chat");
  
  const { 
    combinedText, 
    mindmapMarkdown, 
    mindmapLoading, 
    setMindmap, 
    setMindmapLoading,
    getCachedMindmap,
    summary,
    summaryLoading,
    setSummary,
    setSummaryLoading,
    summaryStyle,
    summaryDepth,
    summaryLength,
    setSummaryStyle,
    setSummaryDepth,
    setSummaryLength,
    getCachedSummary,
    cacheSummary,
    flashcardSets,
    currentSetId,
    currentCardIndex,
    generationLoading,
    generationError,
    addFlashcardSet,
    deleteFlashcardSet,
    selectFlashcardSet,
    updateCardState,
    setGenerationLoading,
    setGenerationError,
    getCurrentFlashcardSet,
    nextCard,
    previousCard,
    resetFlashcards,
  } = useMentisStore();
  const { toast } = useToast();
  
  // Track previous combinedText to detect document changes
  const prevCombinedTextRef = useRef<string>('');
  
  // Debounce timer ref for customization changes
  const debounceTimerRef = useRef<number | null>(null);
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Detect when document changes (not just initial load)
    if (prevCombinedTextRef.current && prevCombinedTextRef.current !== combinedText) {
      toast({
        title: "Document Changed",
        description: "Previous summary, mindmap, and flashcards have been cleared. Generate new content for this document.",
        duration: 4000,
      });
    }
    prevCombinedTextRef.current = combinedText;
  }, [combinedText, toast]);

  // Debounced handlers for customization options to prevent rapid API calls
  const debouncedSetSummaryStyle = useCallback((style: typeof summaryStyle) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSummaryStyle(style);
      // Clear existing summary to prompt regeneration with new options
      if (summary) {
        setSummary('');
        toast({
          title: "Style Changed",
          description: "Generate a new summary to apply the changes",
          duration: 2000,
        });
      }
    }, 300); // 300ms debounce delay
  }, [setSummaryStyle, summary, setSummary, toast]);

  const debouncedSetSummaryDepth = useCallback((depth: typeof summaryDepth) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSummaryDepth(depth);
      // Clear existing summary to prompt regeneration with new options
      if (summary) {
        setSummary('');
        toast({
          title: "Depth Changed",
          description: "Generate a new summary to apply the changes",
          duration: 2000,
        });
      }
    }, 300);
  }, [setSummaryDepth, summary, setSummary, toast]);

  const debouncedSetSummaryLength = useCallback((length: typeof summaryLength) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSummaryLength(length);
      // Clear existing summary to prompt regeneration with new options
      if (summary) {
        setSummary('');
        toast({
          title: "Length Changed",
          description: "Generate a new summary to apply the changes",
          duration: 2000,
        });
      }
    }, 300);
  }, [setSummaryLength, summary, setSummary, toast]);

  const generateMindmapContent = async () => {
    if (!combinedText) return;

    // Check cache first
    const cachedMindmap = getCachedMindmap(combinedText);
    if (cachedMindmap) {
      setMindmap(cachedMindmap);
      return;
    }

    setMindmapLoading(true);

    try {
      const markdown = await generateMindmap(combinedText);
      setMindmap(markdown);
      toast({
        title: "Success!",
        description: "Mindmap generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate mindmap",
        variant: "destructive",
      });
      setMindmap("# Error\n\nFailed to generate mindmap. Please try again.");
    } finally {
      setMindmapLoading(false);
    }
  };

  const generateSummaryContent = async () => {
    if (!combinedText || summaryLoading) return;

    // Validate document size before proceeding
    const validationError = validateDocumentSize(combinedText);
    if (validationError && !validationError.retryable) {
      toast({
        title: "Cannot Generate Summary",
        description: validationError.message,
        variant: "destructive",
      });
      return;
    }

    // Show warning for large documents but continue
    if (validationError && validationError.retryable) {
      toast({
        title: "Large Document",
        description: validationError.message,
        duration: 5000,
      });
    }

    // Create summary options from current state
    const options = {
      style: summaryStyle,
      depth: summaryDepth,
      length: summaryLength,
    };

    // Check cache first
    const documentHash = hashDocument(combinedText);
    const cachedSummary = getCachedSummary(documentHash, options);
    
    if (cachedSummary) {
      setSummary(cachedSummary);
      toast({
        title: "Loaded from cache",
        description: "Previously generated summary loaded instantly",
      });
      return;
    }

    setSummaryLoading(true);
    let retryCount = 0;

    try {
      // Use retry logic with exponential backoff
      const summaryText = await retryWithBackoff(
        () => generateSummary(combinedText, options),
        {
          maxAttempts: 3,
          onRetry: (attempt, error) => {
            retryCount = attempt;
            const summaryError = createSummaryError(error);
            toast({
              title: `Retry Attempt ${attempt}`,
              description: `Retrying due to: ${summaryError.type}. Please wait...`,
              duration: 3000,
            });
          },
        }
      );

      setSummary(summaryText);
      
      // Cache the generated summary
      cacheSummary(documentHash, options, summaryText);
      
      toast({
        title: "Success!",
        description: retryCount > 0 
          ? `Summary generated successfully after ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}`
          : "Summary generated successfully",
      });
    } catch (error) {
      const summaryError = createSummaryError(error);
      setSummary('');
      
      toast({
        title: "Failed to Generate Summary",
        description: summaryError.message,
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateFlashcards = async (setName: string, flashcards: any[]) => {
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      const newSet = createFlashcardSet(
        setName,
        flashcards,
        combinedText.substring(0, 100) + "..."
      );

      addFlashcardSet(newSet);
      selectFlashcardSet(newSet.id);

      toast({
        title: "Success!",
        description: `Generated ${flashcards.length} flashcards`,
      });

      setActiveTab("flashcards");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate flashcards";
      setGenerationError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!mindmapMarkdown) return;

    const blob = new Blob([mindmapMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground">Study Tools</h2>
      
      <Card className="bg-card border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6 pb-3 border-b border-border">
            <TabsList className="w-full grid grid-cols-4 bg-secondary/50">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Mindmap</span>
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="hidden sm:inline">Flashcards</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="chat" className="mt-0">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="mindmap" className="mt-0">
              {mindmapLoading ? (
                <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">Generating mindmap...</p>
                  </div>
                </Card>
              ) : mindmapMarkdown ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-foreground">Document Mindmap</h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownloadMarkdown}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <MindmapViewer markdown={mindmapMarkdown} loading={false} />
                </div>
              ) : combinedText ? (
                <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Network className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Ready to Generate Mindmap</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">Click below to create an interactive mindmap</p>
                      <Button onClick={generateMindmapContent} className="mt-2">
                        <Network className="w-4 h-4 mr-2" />
                        Generate Mindmap
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Network className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No Document Loaded</p>
                      <p className="text-xs text-muted-foreground mt-1">Upload a document to generate a mindmap</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="flashcards" className="mt-0">
              {currentSetId && getCurrentFlashcardSet() ? (
                <FlashcardViewer
                  flashcardSet={getCurrentFlashcardSet()!}
                  currentCardIndex={currentCardIndex}
                  onNextCard={nextCard}
                  onPreviousCard={previousCard}
                  onUpdateCardState={(cardId, state) => {
                    if (currentSetId) {
                      updateCardState(currentSetId, cardId, state);
                    }
                  }}
                  onReset={() => {
                    resetFlashcards();
                    setActiveTab("flashcards");
                  }}
                />
              ) : flashcardSets.length > 0 ? (
                <div className="space-y-6">
                  <FlashcardSetSelector
                    sets={flashcardSets}
                    onSelectSet={(set) => selectFlashcardSet(set.id)}
                    onDeleteSet={deleteFlashcardSet}
                  />
                </div>
              ) : combinedText ? (
                <div className="space-y-4">
                  <Card className="p-6 bg-secondary/30">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Ready to Generate Flashcards</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">Create interactive study cards from your document</p>
                      </div>
                    </div>
                  </Card>
                  <FlashcardGenerator
                    combinedText={combinedText}
                    onGenerateComplete={handleGenerateFlashcards}
                    isLoading={generationLoading}
                    error={generationError}
                  />
                </div>
              ) : (
                <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No Document Loaded</p>
                      <p className="text-xs text-muted-foreground mt-1">Upload a document to generate flashcards</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              {combinedText ? (
                <div className="space-y-4">
                  {/* Summary Customizer */}
                  <SummaryCustomizer
                    style={summaryStyle}
                    depth={summaryDepth}
                    length={summaryLength}
                    onStyleChange={debouncedSetSummaryStyle}
                    onDepthChange={debouncedSetSummaryDepth}
                    onLengthChange={debouncedSetSummaryLength}
                  />
                  
                  {/* Generate Button */}
                  {!summary && !summaryLoading && (
                    <Card className="flex items-center justify-center h-[400px] bg-secondary/30">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Ready to Generate Summary</p>
                          <p className="text-xs text-muted-foreground mt-1 mb-4">Customize options above and click below</p>
                          <Button onClick={generateSummaryContent} className="mt-2">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Summary
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {/* Summary Display */}
                  {(summary || summaryLoading) && (
                    <SummaryDisplay
                      summary={summary}
                      loading={summaryLoading}
                      error={null}
                      onRetry={generateSummaryContent}
                    />
                  )}
                </div>
              ) : (
                <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No Document Loaded</p>
                      <p className="text-xs text-muted-foreground mt-1">Upload a document to generate a summary</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};
