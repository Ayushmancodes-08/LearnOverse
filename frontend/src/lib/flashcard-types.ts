/**
 * Flashcard Data Models and Types
 */

export type CardState = 'new' | 'learning' | 'mastered';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  state: CardState;
  createdAt: Date;
  lastReviewedAt?: Date;
  reviewCount: number;
}

export interface FlashcardStats {
  total: number;
  mastered: number;
  learning: number;
  new: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  flashcards: Flashcard[];
  documentSource: string;
  createdAt: Date;
  updatedAt: Date;
  stats: FlashcardStats;
}

export interface CardUIState {
  isFlipped: boolean;
  state: CardState;
  reviewCount: number;
}

export interface GeminiFlashcardResponse {
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  metadata: {
    totalCards: number;
    difficulty: string;
  };
}

/**
 * Generate unique ID for flashcards and sets
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate flashcard set statistics
 */
export function calculateStats(flashcards: Flashcard[]): FlashcardStats {
  return {
    total: flashcards.length,
    mastered: flashcards.filter((f) => f.state === 'mastered').length,
    learning: flashcards.filter((f) => f.state === 'learning').length,
    new: flashcards.filter((f) => f.state === 'new').length,
  };
}

/**
 * Create a new flashcard
 */
export function createFlashcard(
  question: string,
  answer: string,
  id?: string
): Flashcard {
  return {
    id: id || generateId(),
    question,
    answer,
    state: 'new',
    createdAt: new Date(),
    reviewCount: 0,
  };
}

/**
 * Create a new flashcard set
 */
export function createFlashcardSet(
  name: string,
  flashcards: Flashcard[],
  documentSource: string,
  id?: string
): FlashcardSet {
  return {
    id: id || generateId(),
    name,
    flashcards,
    documentSource,
    createdAt: new Date(),
    updatedAt: new Date(),
    stats: calculateStats(flashcards),
  };
}

/**
 * Update flashcard state
 */
export function updateFlashcardState(
  flashcard: Flashcard,
  newState: CardState
): Flashcard {
  return {
    ...flashcard,
    state: newState,
    lastReviewedAt: new Date(),
    reviewCount: flashcard.reviewCount + 1,
  };
}
