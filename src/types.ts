export interface KanjiCard {
  id: string;
  kanji: string;
  furigana: string;
  onyomi: string;
  kunyomi: string;
  sinhalaMeaning: string;
  englishMeaning: string;
}

export interface JFTGrammar {
  id: string;
  index: string;
  title: string;
  romaji: string;
  pattern: string;
  sinhalaExplanation: string;
  englishExplanation: string;
  oftenUsed?: string;
  notUsed?: string;
  conjugationRules?: string;
  examples: Array<{
    japanese: string;
    hiragana: string;
    sinhala: string;
  }>;
}

export type LearningStatus = "UNSTUDIED" | "OK" | "NOT_YET";


export interface CardState {
  cardId: string;
  status: LearningStatus;
  lastUpdated: string;
}

export interface UserProgress {
  [cardId: string]: LearningStatus;
}

export interface DictionaryEntry {
  id: string;
  romaji: string;
  kanji: string;
  hiragana: string;
  onyomi: string;
  kunyomi: string;
  sinhalaMeaning: string;
  englishMeaning: string;
  searchKeywords?: string[];
}
