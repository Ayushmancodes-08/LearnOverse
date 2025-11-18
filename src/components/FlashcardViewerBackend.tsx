import { Loader2, AlertCircle, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { APIClient } from '@/lib/api-client';
import { useMentisStore } from '@/lib/store';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export const FlashcardViewerBackend = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardCount, setCardCount] = useState(10);
  const [cached, setCached] = useState(false);
  const { toast } = useToast();
  const { mainDocument } = useMentisStore();

  const handleGenerateFlashcards = async () => {
    if (!mainDocument.text) {
      toast({
        title: 'No Document',
        description: 'Please upload a PDF first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await APIClient.generateFlashcards(mainDocument.text, cardCount, mainDocument.id);
      setFlashcards(response.flashcards);
      setCached(response.cached);
      setCurrentIndex(0);
      setIsFlipped(false);

      toast({
        title: 'Success!',
        description: `Generated ${response.flashcards.length} flashcards`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate flashcards';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  if (!mainDocument.text) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Upload a PDF to generate flashcards</p>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium">Number of Cards: {cardCount}</label>
            <Slider
              value={[cardCount]}
              onValueChange={value => setCardCount(value[0])}
              min={5}
              max={20}
              step={1}
              disabled={loading || flashcards.length > 0}
              className="mt-2"
            />
          </div>
        </div>

        <Button onClick={handleGenerateFlashcards} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>

      {cached && (
        <Card className="p-2 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-900">📦 Loaded from cache</p>
        </Card>
      )}

      {/* Flashcard Display */}
      {flashcards.length > 0 && (
        <div className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </div>

          {/* Card */}
          <Card
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-8 min-h-64 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/10 to-primary/5"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {isFlipped ? '✅ Answer' : '❓ Question'}
              </p>
              <p className="text-lg font-semibold">
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
              <p className="text-xs text-muted-foreground mt-4">Click to flip</p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex gap-2 justify-between">
            <Button
              onClick={handlePrev}
              disabled={flashcards.length <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              variant="outline"
              className="flex-1"
            >
              {isFlipped ? 'Hide Answer' : 'Show Answer'}
            </Button>

            <Button
              onClick={handleNext}
              disabled={flashcards.length <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
