export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  timestamp: number;
  isReversed: boolean;
}

export interface TranslatedItem {
  primary: string;
  alternatives: string[];
}

export interface TranslationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: TranslationHistoryItem[];
  onHistoryItemClick: (item: TranslationHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (id: string) => void;
}
