import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFlashcards } from './gemini';
import { createFlashcardSet, createFlashcard } from './flashcard-types';
import { useMentisStore } from './store';

// Mock the Gemini API
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class MockGoogleGenerativeAI {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify([
                { question: 'What is photosynthesis?', answer: 'The process by which plants convert light energy into chemical energy.' },
                { question: 'What is the powerhouse of the cell?', answer: 'The mitochondria.' },
                { question: 'What is DNA?', answer: 'Deoxyribonucleic acid, the molecule that carries genetic information.' }
              ])
            }
          })
        };
      }
    }
  };
});

// Mock the API key manager
vi.mock('./api-key-manager', () => ({
  apiKeyManager: {
    getCurrentKey: vi.fn().mockReturnValue('test-api-key'),
    markCurrentKeySuccess: vi.fn(),
    markCurrentKeyFailed: vi.fn()
  }
}));

describe('Flashcard Generation Workflow', () => {
  const sampleDocument = `
    Photosynthesis is the process by which plants convert light energy into chemical energy.
    The mitochondria is known as the powerhouse of the cell.
    DNA stands for Deoxyribonucleic acid and carries genetic information.
  `;

  beforeEach(() => {
    vi.clearAllMocks();
    useMentisStore.getState().reset();
  });

  describe('Complete Generation Workflow', () => {
    it('should generate flashcards from document text', async () => {
      const flashcards = await generateFlashcards(sampleDocument);

      expect(flashcards).toBeDefined();
      expect(Array.isArray(flashcards)).toBe(true);
      expect(flashcards.length).toBeGreaterThan(0);
      expect(flashcards[0]).toHaveProperty('question');
      expect(flashcards[0]).toHaveProperty('answer');
    });

    it('should create flashcard set and store in state', async () => {
      const store = useMentisStore.getState();
      
      // Generate flashcards
      const flashcardData = await generateFlashcards(sampleDocument);
      const flashcards = flashcardData.map(data => 
        createFlashcard(data.question, data.answer)
      );

      // Create and add flashcard set
      const flashcardSet = createFlashcardSet(
        'Test Set',
        flashcards,
        sampleDocument.substring(0, 100)
      );
      store.addFlashcardSet(flashcardSet);

      // Verify state
      const state = useMentisStore.getState();
      expect(state.flashcardSets).toHaveLength(1);
      expect(state.flashcardSets[0].name).toBe('Test Set');
      expect(state.flashcardSets[0].flashcards.length).toBe(flashcards.length);
    });

    it('should select flashcard set and navigate cards', () => {
      const store = useMentisStore.getState();
      
      // Create flashcards
      const flashcards = [
        createFlashcard('Question 1', 'Answer 1'),
        createFlashcard('Question 2', 'Answer 2'),
        createFlashcard('Question 3', 'Answer 3')
      ];

      // Create and add set
      const set = createFlashcardSet('Test Set', flashcards, 'source');
      store.addFlashcardSet(set);
      store.selectFlashcardSet(set.id);

      // Verify selection
      let state = useMentisStore.getState();
      expect(state.currentSetId).toBe(set.id);
      expect(state.currentCardIndex).toBe(0);

      // Navigate forward
      store.nextCard();
      state = useMentisStore.getState();
      expect(state.currentCardIndex).toBe(1);

      // Navigate backward
      store.previousCard();
      state = useMentisStore.getState();
      expect(state.currentCardIndex).toBe(0);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should validate flashcard response structure', async () => {
      const flashcards = await generateFlashcards(sampleDocument);
      
      // Verify each flashcard has required fields
      flashcards.forEach(card => {
        expect(card).toHaveProperty('question');
        expect(card).toHaveProperty('answer');
        expect(typeof card.question).toBe('string');
        expect(typeof card.answer).toBe('string');
        expect(card.question.length).toBeGreaterThan(0);
        expect(card.answer.length).toBeGreaterThan(0);
      });
    });

    it('should handle generation errors in component workflow', () => {
      const store = useMentisStore.getState();
      
      // Set error state
      store.setGenerationError('API Error');
      
      // Verify error state
      const state = useMentisStore.getState();
      expect(state.generationError).toBe('API Error');
      
      // Clear error
      store.setGenerationError(null);
      expect(useMentisStore.getState().generationError).toBeNull();
    });
  });

  describe('State Persistence and Retrieval', () => {
    it('should persist flashcard state updates', () => {
      const store = useMentisStore.getState();
      
      // Create and add flashcard set
      const flashcards = [createFlashcard('Q1', 'A1')];
      const set = createFlashcardSet('Test', flashcards, 'source');
      store.addFlashcardSet(set);

      // Update card state
      const cardId = flashcards[0].id;
      store.updateCardState(set.id, cardId, 'mastered');

      // Verify state update
      const state = useMentisStore.getState();
      const updatedSet = state.flashcardSets.find(s => s.id === set.id);
      expect(updatedSet).toBeDefined();
      expect(updatedSet!.flashcards[0].state).toBe('mastered');
      expect(updatedSet!.flashcards[0].reviewCount).toBe(1);
      expect(updatedSet!.stats.mastered).toBe(1);
    });

    it('should delete flashcard sets', () => {
      const store = useMentisStore.getState();
      
      // Add multiple sets
      const set1 = createFlashcardSet('Set 1', [createFlashcard('Q1', 'A1')], 'source');
      const set2 = createFlashcardSet('Set 2', [createFlashcard('Q2', 'A2')], 'source');
      store.addFlashcardSet(set1);
      store.addFlashcardSet(set2);

      // Delete one set
      store.deleteFlashcardSet(set1.id);

      // Verify deletion
      const state = useMentisStore.getState();
      expect(state.flashcardSets).toHaveLength(1);
      expect(state.flashcardSets[0].id).toBe(set2.id);
    });

    it('should retrieve current flashcard set', () => {
      const store = useMentisStore.getState();
      
      // Add and select set
      const flashcards = [createFlashcard('Q1', 'A1')];
      const set = createFlashcardSet('Test', flashcards, 'source');
      store.addFlashcardSet(set);
      store.selectFlashcardSet(set.id);

      // Retrieve current set
      const currentSet = store.getCurrentFlashcardSet();
      expect(currentSet).toBeDefined();
      expect(currentSet!.id).toBe(set.id);
      expect(currentSet!.name).toBe('Test');
    });

    it('should retrieve current flashcard', () => {
      const store = useMentisStore.getState();
      
      // Add and select set
      const flashcards = [
        createFlashcard('Q1', 'A1'),
        createFlashcard('Q2', 'A2')
      ];
      const set = createFlashcardSet('Test', flashcards, 'source');
      store.addFlashcardSet(set);
      store.selectFlashcardSet(set.id);

      // Get current card
      const currentCard = store.getCurrentFlashcard();
      expect(currentCard).toBeDefined();
      expect(currentCard!.question).toBe('Q1');

      // Navigate and get next card
      store.nextCard();
      const nextCard = store.getCurrentFlashcard();
      expect(nextCard!.question).toBe('Q2');
    });
  });
});
