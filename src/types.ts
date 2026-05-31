export interface KanjiCard {
  id: string;
  kanji: string;
  furigana: string;
  onyomi: string;
  kunyomi: string;
  sinhalaMeaning: string;
  englishMeaning: string;
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
