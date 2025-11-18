import { useEffect } from 'react';
import { Flashcard, FlashcardSet, CardState } from '@/lib/flashcard-types';
import { FlashcardCard } from './FlashcardCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardViewerProps {
  flashcardSet: FlashcardSet;
  currentCardIndex: number;
  onNextCard: () => void;
  onPreviousCard: () => void;
  onUpdateCardState: (cardId: string, state: CardState) => void;
  onReset: () => void;
}

export const FlashcardViewer = ({
  flashcardSet,
  currentCardIndex,
  onNextCard,
  onPreviousCard,
  onUpdateCardState,
  onReset,
}: FlashcardViewerProps) => {
  const currentCard = flashcardSet.flashcards[currentCardIndex];
  const totalCards = flashcardSet.flashcards.length;
  const progressPercentage = ((currentCardIndex + 1) / totalCards) * 100;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNextCard();
      } else if (e.key === 'ArrowLeft') {
        onPreviousCard();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNextCard, onPreviousCard]);

  if (!currentCard) {
    return (
      <Card className="flex items-center justify-center h-[600px] bg-secondary/30">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium text-foreground">No flashcards available</p>
          <p className="text-xs text-muted-foreground">
            Generate flashcards to get started
          </p>
        </div>
      </Card>
    );
  }

  const isFirstCard = currentCardIndex === 0;
  const isLastCard = currentCardIndex === totalCards - 1;

  return (
    <div className="space-y-6">
      {/* Header with Set Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {flashcardSet.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {totalCards}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-3 text-center bg-secondary/50">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-semibold text-foreground">
            {flashcardSet.stats.total}
          </p>
        </Card>
        <Card className="p-3 text-center bg-green-50 border-green-200">
          <p className="text-xs text-green-700">Mastered</p>
          <p className="text-lg font-semibold text-green-700">
            {flashcardSet.stats.mastered}
          </p>
        </Card>
        <Card className="p-3 text-center bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-700">Learning</p>
          <p className="text-lg font-semibold text-blue-700">
            {flashcardSet.stats.learning}
          </p>
        </Card>
        <Card className="p-3 text-center bg-gray-50 border-gray-200">
          <p className="text-xs text-gray-700">New</p>
          <p className="text-lg font-semibold text-gray-700">
            {flashcardSet.stats.new}
          </p>
        </Card>
      </div>

      {/* Flashcard */}
      <FlashcardCard
        flashcard={currentCard}
        onMastered={() => onUpdateCardState(currentCard.id, 'mastered')}
        onNeedPractice={() => onUpdateCardState(currentCard.id, 'learning')}
      />

      {/* Navigation Controls */}
      <div className="flex gap-3 justify-between items-center">
        <Button
          variant="outline"
          size="lg"
          onClick={onPreviousCard}
          disabled={isFirstCard}
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-center text-sm text-muted-foreground px-4">
          {currentCardIndex + 1} / {totalCards}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onNextCard}
          disabled={isLastCard}
          className="flex-1 gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Completion Message */}
      {isLastCard && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-900">
            You've reviewed all flashcards! Great job! 🎉
          </p>
          <p className="text-xs text-green-700 mt-1">
            Mastered: {flashcardSet.stats.mastered} | Learning: {flashcardSet.stats.learning} | New: {flashcardSet.stats.new}
          </p>
        </Card>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="text-xs text-muted-foreground text-center">
        💡 Use arrow keys (← →) to navigate between cards
      </div>
    </div>
  );
};
