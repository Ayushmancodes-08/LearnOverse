import { useState } from 'react';
import { generateFlashcards } from '@/lib/gemini';
import { createFlashcard, createFlashcardSet, generateId } from '@/lib/flashcard-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface FlashcardGeneratorProps {
  combinedText: string;
  onGenerateComplete: (setName: string, flashcards: ReturnType<typeof createFlashcard>[]) => void;
  isLoading: boolean;
  error: string | null;
}

export const FlashcardGenerator = ({
  combinedText,
  onGenerateComplete,
  isLoading,
  error,
}: FlashcardGeneratorProps) => {
  const [setName, setSetName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerateFlashcards = async () => {
    // Validation
    if (!combinedText || combinedText.trim().length === 0) {
      setLocalError('Please upload a document first');
      return;
    }

    if (combinedText.trim().length < 100) {
      setLocalError('Document is too short. Please upload a longer document (at least 100 characters)');
      return;
    }

    setLocalError(null);

    try {
      const flashcardData = await generateFlashcards(combinedText);

      if (flashcardData.length === 0) {
        setLocalError('No flashcards could be generated. Please try with different content.');
        return;
      }

      // Create flashcard objects
      const flashcards = flashcardData.map((data) =>
        createFlashcard(data.question, data.answer)
      );

      // Generate set name if not provided
      const finalSetName = setName.trim() || `Flashcard Set - ${new Date().toLocaleDateString()}`;

      // Call parent callback
      onGenerateComplete(finalSetName, flashcards);

      // Reset form
      setSetName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate flashcards';
      setLocalError(errorMessage);
    }
  };

  const displayError = error || localError;

  return (
    <div className="space-y-4">
      {/* Set Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Flashcard Set Name (Optional)
        </label>
        <Input
          placeholder="e.g., Biology Chapter 5, Spanish Vocabulary..."
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          disabled={isLoading}
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty for auto-generated name
        </p>
      </div>

      {/* Error Alert */}
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      {!displayError && (
        <Alert className="bg-blue-50 border-blue-200">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            AI will generate 5-20 flashcards based on your document content
          </AlertDescription>
        </Alert>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerateFlashcards}
        disabled={isLoading || !combinedText}
        size="lg"
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Flashcards...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Flashcards
          </>
        )}
      </Button>

      {/* Loading State Details */}
      {isLoading && (
        <Card className="p-4 bg-secondary/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Generating flashcards...
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              This may take a moment. Please wait while we analyze your document and create study cards.
            </p>
          </div>
        </Card>
      )}

      {/* Document Info */}
      {combinedText && !isLoading && (
        <Card className="p-3 bg-secondary/30">
          <p className="text-xs text-muted-foreground">
            📄 Document: {combinedText.length.toLocaleString()} characters
          </p>
        </Card>
      )}
    </div>
  );
};
