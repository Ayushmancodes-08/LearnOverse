import { create } from 'zustand';
import { FlashcardSet, CardState, Flashcard, calculateStats } from './flashcard-types';
import { SummaryStyle, SummaryDepth, SummaryLength, SummaryOptions, SummaryCacheEntry } from './summary-types';
import { manageCacheSize, generateCacheKey } from './cache-utils';

interface Resource {
  id: string;
  name: string;
  text: string;
  type: 'pdf' | 'txt' | 'md';
  file?: File; // Store the actual file for PDF preview
  fileUrl?: string; // Store blob URL for preview
}

interface MainDocument {
  id: string;
  name: string;
  text: string;
  charCount: number;
  file?: File; // Store the actual file for PDF preview
  fileUrl?: string; // Store blob URL for preview
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PresetDocument {
  id: string;
  name: string;
  category: 'pyq' | 'teacher' | 'senior';
  subcategory?: string;
  description?: string;
  size?: string;
  driveId?: string;
}

interface MentisStore {
  // Main document
  mainDocument: MainDocument;
  setMainDocument: (doc: Partial<MainDocument>) => void;

  // Resources
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;

  // Combined text
  combinedText: string;
  updateCombinedText: () => void;

  // Mindmap
  mindmapMarkdown: string;
  mindmapLoading: boolean;
  setMindmap: (markdown: string) => void;
  setMindmapLoading: (loading: boolean) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // Summary
  summary: string;
  summaryLoading: boolean;
  summaryError: string | null;
  setSummary: (summary: string) => void;
  setSummaryLoading: (loading: boolean) => void;
  setSummaryError: (error: string | null) => void;

  // Summary customization
  summaryStyle: SummaryStyle;
  summaryDepth: SummaryDepth;
  summaryLength: SummaryLength;
  setSummaryStyle: (style: SummaryStyle) => void;
  setSummaryDepth: (depth: SummaryDepth) => void;
  setSummaryLength: (length: SummaryLength) => void;

  // Summary cache
  summaryCache: Map<string, SummaryCacheEntry>;
  getCachedSummary: (documentHash: string, options: SummaryOptions) => string | null;
  cacheSummary: (documentHash: string, options: SummaryOptions, summary: string) => void;

  // RAG
  ragInitialized: boolean;
  setRagInitialized: (initialized: boolean) => void;

  // Flashcards
  flashcardSets: FlashcardSet[];
  currentSetId: string | null;
  currentCardIndex: number;
  generationLoading: boolean;
  generationError: string | null;
  addFlashcardSet: (set: FlashcardSet) => void;
  deleteFlashcardSet: (setId: string) => void;
  selectFlashcardSet: (setId: string) => void;
  updateCardState: (setId: string, cardId: string, newState: CardState) => void;
  setGenerationLoading: (loading: boolean) => void;
  setGenerationError: (error: string | null) => void;
  getCurrentFlashcardSet: () => FlashcardSet | undefined;
  getCurrentFlashcard: () => Flashcard | undefined;
  nextCard: () => void;
  previousCard: () => void;
  resetFlashcards: () => void;

  // Cache
  mindmapCache: Map<string, string>;
  getCachedMindmap: (text: string) => string | undefined;

  // Preview Document
  previewDocument: PresetDocument | null;
  setPreviewDocument: (doc: PresetDocument | null) => void;

  // Context Selection
  selectedContext: string;
  setSelectedContext: (contextId: string) => void;

  // Reset
  reset: () => void;
  resetGeneratedContent: () => void; // Reset summary, mindmap, flashcards when documents change
}

const initialState = {
  mainDocument: {
    id: '',
    name: '',
    text: '',
    charCount: 0,
  },
  resources: [],
  combinedText: '',
  mindmapMarkdown: '',
  mindmapLoading: false,
  chatMessages: [],
  summary: '',
  summaryLoading: false,
  summaryError: null,
  summaryStyle: 'conceptual' as SummaryStyle,
  summaryDepth: 'intermediate' as SummaryDepth,
  summaryLength: 'medium' as SummaryLength,
  summaryCache: new Map<string, SummaryCacheEntry>(),
  ragInitialized: false,
  flashcardSets: [],
  currentSetId: null,
  currentCardIndex: 0,
  generationLoading: false,
  generationError: null,
  mindmapCache: new Map<string, string>(),
  previewDocument: null,
  selectedContext: '',
};

export const useMentisStore = create<MentisStore>((set, get) => ({
  ...initialState,

  setMainDocument: (doc) =>
    set((state) => ({
      mainDocument: { ...state.mainDocument, ...doc },
    })),

  addResource: (resource) =>
    set((state) => ({
      resources: [...state.resources, resource],
    })),

  removeResource: (id) =>
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    })),

  updateCombinedText: () =>
    set((state) => {
      const mainText = state.mainDocument.text;
      const resourceTexts = state.resources.map((r) => `\n\n--- ${r.name} ---\n${r.text}`).join('');
      return {
        combinedText: mainText + resourceTexts,
      };
    }),

  setMindmap: (markdown) => {
    const { combinedText, mindmapCache } = get();
    if (combinedText) {
      mindmapCache.set(combinedText, markdown);
    }
    set({ mindmapMarkdown: markdown, mindmapCache });
  },

  setMindmapLoading: (loading) => set({ mindmapLoading: loading }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  clearChat: () => set({ chatMessages: [] }),

  setSummary: (summary) => set({ summary }),

  setSummaryLoading: (loading) => set({ summaryLoading: loading }),

  setSummaryError: (error) => set({ summaryError: error }),

  setSummaryStyle: (style) => set({ summaryStyle: style }),

  setSummaryDepth: (depth) => set({ summaryDepth: depth }),

  setSummaryLength: (length) => set({ summaryLength: length }),

  getCachedSummary: (documentHash, options) => {
    const { summaryCache } = get();
    const cacheKey = generateCacheKey(
      documentHash,
      options.style,
      options.depth,
      options.length
    );
    const entry = summaryCache.get(cacheKey);
    return entry ? entry.summary : null;
  },

  cacheSummary: (documentHash, options, summary) => {
    const { summaryCache } = get();
    const cacheKey = generateCacheKey(
      documentHash,
      options.style,
      options.depth,
      options.length
    );
    
    // Optimized cache size management with LRU eviction
    if (!summaryCache.has(cacheKey)) {
      manageCacheSize(summaryCache, 5); // Limit to 5 entries
    }
    
    summaryCache.set(cacheKey, {
      documentHash,
      options,
      summary,
      timestamp: new Date(),
    });
    
    set({ summaryCache });
  },

  setRagInitialized: (initialized) => set({ ragInitialized: initialized }),

  getCachedMindmap: (text) => {
    const { mindmapCache } = get();
    return mindmapCache.get(text);
  },

  setPreviewDocument: (doc) => set({ previewDocument: doc }),

  setSelectedContext: (contextId) => set({ selectedContext: contextId }),

  addFlashcardSet: (flashcardSet) =>
    set((state) => ({
      flashcardSets: [...state.flashcardSets, flashcardSet],
    })),

  deleteFlashcardSet: (setId) =>
    set((state) => ({
      flashcardSets: state.flashcardSets.filter((s) => s.id !== setId),
      currentSetId: state.currentSetId === setId ? null : state.currentSetId,
      currentCardIndex: state.currentSetId === setId ? 0 : state.currentCardIndex,
    })),

  selectFlashcardSet: (setId) =>
    set({
      currentSetId: setId,
      currentCardIndex: 0,
    }),

  updateCardState: (setId, cardId, newState) =>
    set((state) => ({
      flashcardSets: state.flashcardSets.map((flashcardSet) => {
        if (flashcardSet.id === setId) {
          const updatedFlashcards = flashcardSet.flashcards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                state: newState,
                lastReviewedAt: new Date(),
                reviewCount: card.reviewCount + 1,
              };
            }
            return card;
          });
          return {
            ...flashcardSet,
            flashcards: updatedFlashcards,
            stats: calculateStats(updatedFlashcards),
            updatedAt: new Date(),
          };
        }
        return flashcardSet;
      }),
    })),

  setGenerationLoading: (loading) => set({ generationLoading: loading }),

  setGenerationError: (error) => set({ generationError: error }),

  getCurrentFlashcardSet: () => {
    const { flashcardSets, currentSetId } = get();
    return flashcardSets.find((s) => s.id === currentSetId);
  },

  getCurrentFlashcard: () => {
    const { flashcardSets, currentSetId, currentCardIndex } = get();
    const set = flashcardSets.find((s) => s.id === currentSetId);
    if (set && set.flashcards[currentCardIndex]) {
      return set.flashcards[currentCardIndex];
    }
    return undefined;
  },

  nextCard: () =>
    set((state) => {
      const currentSet = state.flashcardSets.find((s) => s.id === state.currentSetId);
      if (currentSet && state.currentCardIndex < currentSet.flashcards.length - 1) {
        return { currentCardIndex: state.currentCardIndex + 1 };
      }
      return state;
    }),

  previousCard: () =>
    set((state) => {
      if (state.currentCardIndex > 0) {
        return { currentCardIndex: state.currentCardIndex - 1 };
      }
      return state;
    }),

  resetFlashcards: () =>
    set({
      flashcardSets: [],
      currentSetId: null,
      currentCardIndex: 0,
      generationLoading: false,
      generationError: null,
    }),

  reset: () => set(initialState),

  resetGeneratedContent: () => {
    set({
      summary: '',
      mindmapMarkdown: '',
      flashcardSets: [],
      currentSetId: null,
      currentCardIndex: 0,
      previewDocument: null,
      chatMessages: [],
      summaryCache: new Map<string, SummaryCacheEntry>(),
    });
  },
}));
