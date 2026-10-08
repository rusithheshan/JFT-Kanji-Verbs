import fs from "fs";
import {
  JFT_MOCK_CATEGORIES,
  JFT_FULL_MOCK_PAPERS,
  JFT_SCRIPT_VOCAB_PAPERS,
  JFT_CONVERSATION_PAPERS,
  JFT_LISTENING_PAPERS,
  JFT_READING_PAPERS
} from "../src/data/jftMockTestsData";

// Helper to sanitize non-JFT kanji into hiragana
function simplifyKanji(text: string): string {
  if (!text) return text;
  return text
    .replace(/笑います/g, "わらいます")
    .replace(/笑って/g, "わらって")
    .replace(/泣きます/g, "なきます")
    .replace(/泣いて/g, "ないて")
    .replace(/怒ります/g, "おこります")
    .replace(/怒って/g, "おこって")
    .replace(/走ります/g, "はしります")
    .replace(/走って/g, "はしって")
    .replace(/読みます/g, "よみます")
    .replace(/読んで/g, "よんで")
    .replace(/書きます/g, "かきます")
    .replace(/書いて/g, "かいて")
    .replace(/起きます/g, "おきます")
    .replace(/寝ます/g, "ねます")
    .replace(/食べます/g, "たべます")
    .replace(/飲みます/g, "のみます")
    .replace(/買います/g, "かいます")
    .replace(/会います/g, "あいます")
    .replace(/泳ぎます/g, "およぎます")
    .replace(/話します/g, "はなします")
    .replace(/歩きます/g, "あるきます")
    .replace(/待ちます/g, "まちます")
    .replace(/持ちます/g, "もちます")
    .replace(/教えて/g, "おしえて")
    .replace(/教えます/g, "おしえます");
}

const VOCAB_ILLUSTRATIONS = [
  "smile_woman",
  "reading_book",
  "running_person",
  "cry_person",
  "angry_person",
  "eating_meal",
  "drinking_water",
  "sleeping_bed",
  "waking_up",
  "writing_letter"
];

// Build 10 full mock test papers, each with 60 questions (15 SV, 15 CE, 15 LC, 15 RC)
const upgradedFullPapers = JFT_FULL_MOCK_PAPERS.map((paper, paperIdx) => {
  const svOriginal = paper.questions.filter((q) => q.section === "script_vocab");
  const ceOriginal = paper.questions.filter((q) => q.section === "conversation");
  const lcOriginal = paper.questions.filter((q) => q.section === "listening");
  const rcOriginal = paper.questions.filter((q) => q.section === "reading");

  const svExtra = (JFT_SCRIPT_VOCAB_PAPERS[paperIdx]?.questions || []).slice(0, 5);
  const ceExtra = (JFT_CONVERSATION_PAPERS[paperIdx]?.questions || []).slice(0, 5);
  const lcExtra = (JFT_LISTENING_PAPERS[paperIdx]?.questions || []).slice(0, 5);
  const rcExtra = (JFT_READING_PAPERS[paperIdx]?.questions || []).slice(0, 5);

  const sec1 = [...svOriginal, ...svExtra].slice(0, 15);
  const sec2 = [...ceOriginal, ...ceExtra].slice(0, 15);
  const sec3 = [...lcOriginal, ...lcExtra].slice(0, 15);
  const sec4 = [...rcOriginal, ...rcExtra].slice(0, 15);

  const all60 = [...sec1, ...sec2, ...sec3, ...sec4].map((q, idx) => {
    const qNum = idx + 1;
    let section: "script_vocab" | "conversation" | "listening" | "reading" = "script_vocab";
    let sectionTitleJp = "文字・語彙（もじ・ごい）";
    let sectionTitleSi = "අක්ෂර සහ වචන මාලාව";
    let instructionEn = "Look at the illustration and choose the correct word.";
    let illustrationType: string | undefined = undefined;
    let pictureChoices: string[] | undefined = undefined;

    if (qNum <= 15) {
      section = "script_vocab";
      sectionTitleJp = "文字・語彙（もじ・ごい）";
      sectionTitleSi = "අක්ෂර සහ වචන මාලාව";
      if (qNum <= 5) {
        instructionEn = "Look at the illustration and choose the correct word.";
        illustrationType = VOCAB_ILLUSTRATIONS[(qNum - 1 + paperIdx) % VOCAB_ILLUSTRATIONS.length];
      } else if (qNum <= 10) {
        instructionEn = "Read the sentence and choose the correct reading for the underlined word.";
      } else {
        instructionEn = "Choose the word that has the same meaning or correctly fills the blank.";
      }
    } else if (qNum <= 30) {
      section = "conversation";
      sectionTitleJp = "会話・表現（かいわ・ひょうげん）";
      sectionTitleSi = "සංවාද සහ ප්‍රකාශන";
      instructionEn = "Choose the most appropriate response for the conversation.";
      if (qNum % 4 === 0) {
        illustrationType = "dialogue_coworkers";
      }
    } else if (qNum <= 45) {
      section = "listening";
      sectionTitleJp = "聴解（ちょうかい・2回再生）";
      sectionTitleSi = "සවන්දීම (හඬ පටය 2 වතාවක් පමණක් වාදනය කළ හැක)";
      if (qNum === 31) {
        instructionEn = "You will hear two people talking about the New Year holidays at work. What did the man do with his friend during the New Year holidays?";
        illustrationType = "dialogue_coworkers";
        pictureChoices = ["listening_walk_street", "listening_shrine", "listening_room"];
      } else if (qNum === 32) {
        instructionEn = "You will hear an officer talking about what to do in case of fire at an emergency drill at work. What do you do first when a fire occurs?";
        illustrationType = "police_fire_officer";
        pictureChoices = ["emergency_shout", "emergency_run", "emergency_extinguish"];
      } else {
        instructionEn = "Listen to the audio conversation and choose the correct answer.";
        if (qNum % 3 === 0) {
          illustrationType = "dialogue_coworkers";
        }
      }
    } else {
      section = "reading";
      sectionTitleJp = "読解（どっかい）";
      sectionTitleSi = "කියවා තේරුම් ගැනීම";
      instructionEn = "Read the notice or message and answer the question.";
    }

    // Sanitize questionJp and options
    const cleanQuestionJp = simplifyKanji(q.questionJp);
    const cleanOptions = q.options.map((opt) => ({
      ...opt,
      textJp: simplifyKanji(opt.textJp)
    }));

    return {
      ...q,
      id: paper.setNumber * 1000 + qNum,
      questionNumber: qNum,
      section,
      sectionTitleJp,
      sectionTitleSi,
      instructionEn,
      illustrationType,
      pictureChoices,
      questionJp: cleanQuestionJp,
      options: cleanOptions
    };
  });

  return {
    ...paper,
    totalQuestions: 60,
    durationMinutes: 60,
    passingScore: 48, // 80% passing standard
    descriptionSi: "සම්පූර්ණ JFT-Basic CBT විභාගය: ප්‍රශ්න 60 (අක්ෂර/වචන 15, සංවාද 15, සවන්දීම 15, කියවීම 15). ලකුණු 250න් ගණනය කෙරේ.",
    questions: all60
  };
});

// Also make sure the individual category papers are sanitized
const sanitizeCategoryPaper = (paper: any) => ({
  ...paper,
  questions: paper.questions.map((q: any) => ({
    ...q,
    questionJp: simplifyKanji(q.questionJp),
    options: q.options.map((opt: any) => ({
      ...opt,
      textJp: simplifyKanji(opt.textJp)
    }))
  }))
});

const upgradedSvPapers = JFT_SCRIPT_VOCAB_PAPERS.map(sanitizeCategoryPaper);
const upgradedCePapers = JFT_CONVERSATION_PAPERS.map(sanitizeCategoryPaper);
const upgradedLcPapers = JFT_LISTENING_PAPERS.map(sanitizeCategoryPaper);
const upgradedRcPapers = JFT_READING_PAPERS.map(sanitizeCategoryPaper);

// Generate new TS file content
const outputTs = `// JFT-Basic (Japan Foundation Test for Basic Japanese) CBT Exam Simulator
// Official Structure matching A2 Level SSW Requirement:
// 1. Script & Vocabulary (文字・語彙 - 15 Questions)
// 2. Conversation & Expression (会話・表現 - 15 Questions)
// 3. Listening Comprehension (聴解 - 15 Questions, 2-Play Limit)
// 4. Reading Comprehension (読解 - 15 Questions)
// Full 60-Minute Comprehensive Mock Exam = 60 Questions, Scaled to 250 Points

export interface JFTMockOption {
  id: number;
  textJp: string;
  textSi: string;
}

export interface JFTMockQuestion {
  id: number;
  section: "script_vocab" | "conversation" | "listening" | "reading";
  sectionTitleJp: string;
  sectionTitleSi: string;
  category: string;
  questionNumber: number;
  instructionEn?: string;
  illustrationType?: string;
  pictureChoices?: string[];
  contextJp?: string;
  contextSi?: string;
  audioScriptJp?: string;
  audioScriptRomaji?: string;
  questionJp: string;
  questionSi: string;
  options: JFTMockOption[];
  correctOption: number;
  explanationSi: string;
  explanationJp?: string;
}

export interface JFTMockTestPaper {
  id: string;
  setNumber: number;
  type: "full" | "script_vocab" | "conversation" | "listening" | "reading";
  titleJp: string;
  titleSi: string;
  descriptionSi: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  questions: JFTMockQuestion[];
}

export interface JFTCategoryMeta {
  id: "full" | "script_vocab" | "conversation" | "listening" | "reading";
  titleSi: string;
  titleJp: string;
  icon: string;
  badge: string;
  durationMinutes: number;
  descriptionSi: string;
  playlistUrl?: string;
}

export const JFT_MOCK_CATEGORIES: JFTCategoryMeta[] = ${JSON.stringify(JFT_MOCK_CATEGORIES, null, 2)};

export const JFT_FULL_MOCK_PAPERS: JFTMockTestPaper[] = ${JSON.stringify(upgradedFullPapers, null, 2)};

export const JFT_SCRIPT_VOCAB_PAPERS: JFTMockTestPaper[] = ${JSON.stringify(upgradedSvPapers, null, 2)};

export const JFT_CONVERSATION_PAPERS: JFTMockTestPaper[] = ${JSON.stringify(upgradedCePapers, null, 2)};

export const JFT_LISTENING_PAPERS: JFTMockTestPaper[] = ${JSON.stringify(upgradedLcPapers, null, 2)};

export const JFT_READING_PAPERS: JFTMockTestPaper[] = ${JSON.stringify(upgradedRcPapers, null, 2)};

export const JFT_ALL_PAPERS_BY_CATEGORY: Record<string, JFTMockTestPaper[]> = {
  full: JFT_FULL_MOCK_PAPERS,
  script_vocab: JFT_SCRIPT_VOCAB_PAPERS,
  conversation: JFT_CONVERSATION_PAPERS,
  listening: JFT_LISTENING_PAPERS,
  reading: JFT_READING_PAPERS
};
`;

fs.writeFileSync("src/data/jftMockTestsData.ts", outputTs, "utf-8");
console.log("Successfully upgraded jftMockTestsData.ts with 60 questions per full paper!");
