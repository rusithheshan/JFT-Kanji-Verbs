export interface ParagraphToken {
  id: string;
  text: string;
  kanji?: string;
  furigana?: string;
  type: "kanji" | "verb" | "adjective" | "particle" | "other";
  englishMeaning: string;
  sinhalaMeaning: string;
}

export interface JFTParagraph {
  id: string;
  titleSinhala: string;
  titleEnglish: string;
  tokens: ParagraphToken[];
  fullEnglishTranslation: string;
  fullSinhalaTranslation: string;
  contentType?: "paragraph" | "conversation";
  textLines?: Array<{
    speaker: string;
    japanese: string;
    english: string;
    sinhala: string;
  }>;
  questions?: Array<{
    id: string;
    questionJapanese: string;
    options: string[];
    correctOptionKey: string;
    explanationSinhala: string;
  }>;
}

import { get1000Paragraphs, get1000Conversations } from "./prebakedContent";

export const PRELOADED_PARAGRAPHS: JFTParagraph[] = [
  ...get1000Paragraphs(),
  ...get1000Conversations()
];
