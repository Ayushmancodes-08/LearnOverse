import { useState } from 'react';
import { Flashcard, CardState } from '@/lib/flashcard-types';
import { parseFormattedText } from '@/lib/text-formatter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './FlashcardCard.css';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onMastered: () => void;
  onNeedPractice: () => void;
}

export const FlashcardCard = ({
  flashcard,
  onMastered,
  onNeedPractice,
}: FlashcardCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getStateColor = (state: CardState): string => {
    switch (state) {
      case 'mastered':
        return 'bg-green-50 border-green-200';
      case 'learning':
        return 'bg-blue-50 border-blue-200';
      case 'new':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStateLabel = (state: CardState): string => {
    switch (state) {
      case 'mastered':
        return 'Mastered';
      case 'learning':
        return 'Learning';
      case 'new':
      default:
        return 'New';
    }
  };

  return (
    <div className="space-y-4">
      {/* Flashcard */}
      <div
        className="flashcard-container h-80 cursor-pointer perspective"
        onClick={handleFlip}
      >
        <div
          className={`flashcard-inner transition-transform duration-300 ${
            isFlipped ? 'flashcard-flipped' : ''
          }`}
        >
          {/* Front - Question */}
          <Card
            className={`flashcard-front absolute w-full h-full p-8 flex flex-col justify-center items-center text-center ${getStateColor(
              flashcard.state
            )} border-2`}
          >
            <div className="space-y-4 w-full">
              <p className="text-sm font-medium text-muted-foreground">Question</p>
              <div className="text-2xl font-semibold text-foreground leading-relaxed">
                {parseFormattedText(flashcard.question).map((segment, idx) => {
                  switch (segment.type) {
                    case 'bold':
                      return <strong key={idx}>{segment.content}</strong>;
                    case 'italic':
                      return <em key={idx}>{segment.content}</em>;
                    case 'text':
                    default:
                      return <span key={idx}>{segment.content}</span>;
                  }
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
          </Card>

          {/* Back - Answer */}
          <Card
            className={`flashcard-back absolute w-full h-full p-8 flex flex-col justify-center items-center text-center ${getStateColor(
              flashcard.state
            )} border-2 bg-gradient-to-br from-primary/5 to-primary/10`}
          >
            <div className="space-y-4 w-full">
              <p className="text-sm font-medium text-muted-foreground">Answer</p>
              <div className="text-lg text-foreground leading-relaxed">
                {parseFormattedText(flashcard.answer).map((segment, idx) => {
                  switch (segment.type) {
                    case 'bold':
                      return <strong key={idx}>{segment.content}</strong>;
                    case 'italic':
                      return <em key={idx}>{segment.content}</em>;
                    case 'text':
                    default:
                      return <span key={idx}>{segment.content}</span>;
                  }
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Click to see question</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Card Status and Actions */}
      <div className="space-y-3">
        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2">
          {flashcard.state === 'mastered' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {getStateLabel(flashcard.state)}
              </span>
            </>
          ) : flashcard.state === 'learning' ? (
            <>
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {getStateLabel(flashcard.state)}
              </span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {getStateLabel(flashcard.state)}
              </span>
            </>
          )}
          {flashcard.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground ml-2">
              ({flashcard.reviewCount} review{flashcard.reviewCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onNeedPractice}
            className="flex-1"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Need Practice
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onMastered}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mastered
          </Button>
        </div>
      </div>
    </div>
  );
};
