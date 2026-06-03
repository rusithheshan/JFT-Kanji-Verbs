import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  BookOpen,
  Zap,
  Play,
  Flame,
  Check,
  X,
  VolumeX,
  Languages,
  Tags,
  Ear,
  Mic,
  Edit3,
  Shuffle
} from "lucide-react";
import { KanjiCard } from "../data/preloadedKanji";
import { JFTVerb } from "../data/preloadedVerbs";
import { JFTAdjective } from "../data/preloadedAdjectives";
import { PRELOADED_PARAGRAPHS, JFTParagraph, ParagraphToken } from "../data/paragraphTemplates";
import CheckKanjiDrawingView from "./CheckKanjiDrawingView";


export type QuizMode =
  | "kanji_reading" // Kanji -> Hiragana
  | "reading_kanji" // Hiragana -> Kanji
  | "sinhala_verb_japanese" // Sinhala Verb -> Kanji (Furigana)
  | "japanese_verb_sinhala" // Japanese Verb -> Sinhala
  | "sinhala_adj_japanese" // Sinhala Adjective -> Japanese
  | "japanese_adj_sinhala"; // Japanese Adjective -> Sinhala

interface QuizQuestion {
  prompt: string;
  correctAnswer: string;
  options: string[];
  originalItem: KanjiCard | JFTVerb | JFTAdjective;
}

interface QuizAnswerHistory {
  questionPrompt: string;
  correctAnswer: string;
  userChoice: string;
  isCorrect: boolean;
  originalItem: KanjiCard | JFTVerb | JFTAdjective;
}

interface QuizViewProps {
  kanjiCards: KanjiCard[];
  verbsList: JFTVerb[];
  adjectivesList: JFTAdjective[];
  onBackToLearn?: () => void;
}

export default function QuizView({ kanjiCards, verbsList, adjectivesList, onBackToLearn }: QuizViewProps) {
  // Setup States
  const [activeQuizSubMode, setActiveQuizSubMode] = useState<"standard" | "paragraph" | "drawing">("standard");
  const [quizMode, setQuizMode] = useState<QuizMode>("kanji_reading");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<"setup" | "playing" | "summary">("setup");

  // Paragraph trainer states
  const [paragraphs, setParagraphs] = useState<JFTParagraph[]>(() => {
    try {
      const saved = localStorage.getItem("jft_custom_paragraphs");
      if (saved) {
        return [...JSON.parse(saved), ...PRELOADED_PARAGRAPHS];
      }
    } catch (e) {}
    return PRELOADED_PARAGRAPHS;
  });
  const [activeParagraphIdx, setActiveParagraphIdx] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>("");
  const [isSpeakingResultShown, setIsSpeakingResultShown] = useState<boolean>(false);
  const [selectedWordToken, setSelectedWordToken] = useState<ParagraphToken | null>(null);
  const [recognitionError, setRecognitionError] = useState<string>("");
  const [isGeneratingParagraph, setIsGeneratingParagraph] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string>("");

  const [kanjiOKSet, setKanjiOKSet] = useState<Set<string>>(new Set());
  const [verbsOKSet, setVerbsOKSet] = useState<Set<string>>(new Set());
  const [adjOKSet, setAdjOKSet] = useState<Set<string>>(new Set());

  // Dynamic practice filters
  const [vocabularyFilter, setVocabularyFilter] = useState<"all" | "ok" | "not_yet">("all");
  const [contentType, setContentType] = useState<"paragraph" | "conversation">("paragraph");
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  const [shuffleTrigger, setShuffleTrigger] = useState<number>(0);

  // Filter & shuffle scenarios reactively using highly-optimized Fisher-Yates and stored history logic
  const filteredParagraphs = useMemo(() => {
    let list = paragraphs.filter(p => {
      if (contentType === "paragraph") {
        return p.contentType !== "conversation";
      } else {
        return p.contentType === "conversation";
      }
    });

    list = list.filter(para => {
      if (vocabularyFilter === "all") return true;

      const okKanjis = Array.from(kanjiOKSet).map(id => kanjiCards.find(c => c.id === id)?.kanji).filter(Boolean);
      const okVerbs = Array.from(verbsOKSet).map(id => verbsList.find(v => v.id === id)?.dictionary).filter(Boolean);
      const okAdjectives = Array.from(adjOKSet).map(id => adjectivesList.find(a => a.id === id)?.kanji).filter(Boolean);

      let hasOkVocab = false;
      let hasNotYetVocab = false;

      for (const token of para.tokens) {
        if (!token.kanji) continue;
        const cleanK = token.kanji;
        const isOk = okKanjis.includes(cleanK) || okVerbs.includes(cleanK) || okAdjectives.includes(cleanK);

        const inK = kanjiCards.some(c => c.kanji === cleanK);
        const inV = verbsList.some(v => v.dictionary === cleanK);
        const inA = adjectivesList.some(a => a.kanji === cleanK);

        if (inK || inV || inA) {
          if (isOk) {
            hasOkVocab = true;
          } else {
            hasNotYetVocab = true;
          }
        }
      }

      if (vocabularyFilter === "ok") {
        return hasOkVocab || !hasNotYetVocab;
      } else if (vocabularyFilter === "not_yet") {
        return hasNotYetVocab || !hasOkVocab;
      }
      return true;
    });

    // Fallback if empty to avoid blank screen
    if (list.length === 0) {
      list = paragraphs.filter(p => {
        if (contentType === "paragraph") {
          return p.contentType !== "conversation";
        } else {
          return p.contentType === "conversation";
        }
      });
    }

    // Play Fisher-Yates shuffle
    const shuffledList = [...list];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledList[i];
      shuffledList[i] = shuffledList[j];
      shuffledList[j] = temp;
    }

    // Try to prevent immediate consecutive repeats of the last viewed paragraph across resets
    try {
      const lastId = localStorage.getItem("jft_last_viewed_paragraph_id");
      if (lastId && shuffledList.length > 1 && shuffledList[0].id === lastId) {
        const temp = shuffledList[0];
        shuffledList[0] = shuffledList[1];
        shuffledList[1] = temp;
      }
    } catch (e) {}

    return shuffledList;
  }, [paragraphs, contentType, vocabularyFilter, kanjiOKSet, verbsOKSet, adjOKSet, shuffleTrigger]);

  // Dynamically shuffle and correct multiple-choice questions per visual presentation
  const displayedParagraph = useMemo(() => {
    const rawPara = filteredParagraphs[activeParagraphIdx];
    if (!rawPara) return null;

    // Deep clone to safely keep transformations inside React's unidirectional limits
    const cloned: JFTParagraph = JSON.parse(JSON.stringify(rawPara));

    if (cloned.questions) {
      cloned.questions = cloned.questions.map((q) => {
        const optionKeys = ["a", "b", "c", "d"];
        const origOptions = q.options.map((opt, i) => ({
          text: opt,
          originalKey: optionKeys[i] || "a"
        }));

        // Shuffle the options
        const shuffledOpts = [...origOptions];
        for (let i = shuffledOpts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffledOpts[i];
          shuffledOpts[i] = shuffledOpts[j];
          shuffledOpts[j] = temp;
        }

        // Map correct key to match new shuffle position
        const correctOptIdx = shuffledOpts.findIndex(o => o.originalKey === q.correctOptionKey);
        const newCorrectKey = optionKeys[correctOptIdx] || "a";

        return {
          ...q,
          options: shuffledOpts.map(o => o.text),
          correctOptionKey: newCorrectKey
        };
      });
    }

    return cloned;
  }, [filteredParagraphs, activeParagraphIdx]);

  // Reset indices and spoken words when filters or shuffle triggers fire
  useEffect(() => {
    setActiveParagraphIdx(0);
    setSpokenText("");
    setIsSpeakingResultShown(false);
    setSelectedWordToken(null);
    setQuizAnswers({});
    setShowTranslations(false);
  }, [contentType, vocabularyFilter, shuffleTrigger]);

  // Record viewed ID to ensure no repeats next time
  useEffect(() => {
    const currentPara = filteredParagraphs[activeParagraphIdx];
    if (currentPara) {
      try {
        localStorage.setItem("jft_last_viewed_paragraph_id", currentPara.id);
      } catch (e) {}
    }
  }, [filteredParagraphs, activeParagraphIdx]);

  // Trigger dynamic AI paragraph or conversation generation
  const handleGenerateAIParagraph = async () => {
    setIsGeneratingParagraph(true);
    setGenerationError("");
    setSpokenText("");
    setIsSpeakingResultShown(false);
    setSelectedWordToken(null);
    setQuizAnswers({});

    try {
      const okKanjis = Array.from(kanjiOKSet)
        .map((id) => kanjiCards.find((c) => c.id === id)?.kanji)
        .filter(Boolean);
      const okVerbs = Array.from(verbsOKSet)
        .map((id) => verbsList.find((v) => v.id === id)?.dictionary)
        .filter(Boolean);
      const okAdjectives = Array.from(adjOKSet)
        .map((id) => adjectivesList.find((a) => a.id === id)?.kanji)
        .filter(Boolean);

      const notYetKanjis = kanjiCards
        .filter((c) => !kanjiOKSet.has(c.id))
        .map((c) => c.kanji);
      const notYetVerbs = verbsList
        .filter((v) => !verbsOKSet.has(v.id))
        .map((v) => v.dictionary);
      const notYetAdjectives = adjectivesList
        .filter((a) => !adjOKSet.has(a.id))
        .map((a) => a.kanji);

      const response = await fetch("/api/generate-paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          okKanjis, 
          okVerbs, 
          okAdjectives,
          notYetKanjis,
          notYetVerbs,
          notYetAdjectives,
          vocabularyFilter,
          contentType
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate custom paragraph. Please make sure the Gemini API key is configured.");
      }

      const data: JFTParagraph = await response.json();
      data.id = `ai_para_${Date.now()}`;

      setParagraphs((prev) => {
        const filtered = prev.filter((p) => p.id !== data.id);
        const updated = [data, ...filtered];
        // Save only AI paragraphs to localStorage to persist generated lessons
        const aiOnly = updated.filter((p) => p.id.startsWith("ai_para_"));
        localStorage.setItem("jft_custom_paragraphs", JSON.stringify(aiOnly));
        return updated;
      });
      setActiveParagraphIdx(0);
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate AI paragraph.");
    } finally {
      setIsGeneratingParagraph(false);
    }
  };

  // Load OK checklists reactively
  useEffect(() => {
    try {
      const kSaved = localStorage.getItem("jft_kanji_progress");
      const vSaved = localStorage.getItem("jft_verbs_progress");
      const aSaved = localStorage.getItem("jft_adjectives_progress");

      const kProgress = kSaved ? JSON.parse(kSaved) : {};
      const vProgress = vSaved ? JSON.parse(vSaved) : {};
      const aProgress = aSaved ? JSON.parse(aSaved) : {};

      const kOK = new Set<string>();
      const vOK = new Set<string>();
      const aOK = new Set<string>();

      Object.entries(kProgress).forEach(([id, status]) => { if (status === "OK") kOK.add(id); });
      Object.entries(vProgress).forEach(([id, status]) => { if (status === "OK") vOK.add(id); });
      Object.entries(aProgress).forEach(([id, status]) => { if (status === "OK") aOK.add(id); });

      setKanjiOKSet(kOK);
      setVerbsOKSet(vOK);
      setAdjOKSet(aOK);
    } catch (e) {
      console.error("Error loading JFT progress metrics:", e);
    }
  }, [gameState, activeQuizSubMode]);


  // Game States
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [history, setHistory] = useState<QuizAnswerHistory[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Audio mute/unmute option
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);


  // Pronounce helper
  const speakJapanese = (text: string) => {
    if (!soundEnabled) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Remove any helper Sinhala text or brackets for speech if necessary
      const cleanText = text.split("(")[0].split("（")[0].trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Voice Recognition to compare speech
  const startSpeechRecognition = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setRecognitionError("කණගාටුයි! ඔබගේ බ්‍රවුසරයේ කථන හඳුනාගැනීම (Speech Recognition) සහය නොදක්වයි. කරුණාකර Google Chrome හෝ Microsoft Edge භාවිත කරන්න.");
      return;
    }

    try {
      setRecognitionError("");
      const rec = new SpeechRecognitionAPI();
      rec.lang = "ja-JP";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setSpokenText("");
        setIsSpeakingResultShown(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition error:", event);
        if (event.error === "not-allowed") {
          setRecognitionError("මයික්‍රෆෝනයට අවසර ලැබී නොමැත. කරුණාකර browser settings මඟින් මයික්‍රෆෝන අවසර ලබා දෙන්න.");
        } else {
          setRecognitionError(`කථන හඳුනා ගැනීමේ දෝෂයකි: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setSpokenText(resultText);
        setIsSpeakingResultShown(true);
      };

      rec.start();
    } catch (e: any) {
      console.error(e);
      setRecognitionError("මයික්‍රෆෝන සන්නිවේදනය අසාර්ථකයි.");
    }
  };

  // Speaks hiragana letter-by-letter slowly
  const spellWordSlowly = (furigana: string) => {
    if (!furigana) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // First speak normally but slightly slow
      const u1 = new SpeechSynthesisUtterance(furigana);
      u1.lang = "ja-JP";
      u1.rate = 0.55;
      window.speechSynthesis.speak(u1);

      // Speak each character separately after 1.5 seconds
      const characters = furigana.split("");
      characters.forEach((char, idx) => {
        if (char.trim() === "") return;
        setTimeout(() => {
          const uChar = new SpeechSynthesisUtterance(char);
          uChar.lang = "ja-JP";
          uChar.rate = 0.45;
          window.speechSynthesis.speak(uChar);
        }, 1300 + idx * 800);
      });
    }
  };

  // Speaks entire paragraph text
  const speakParagraphText = (paragraph: JFTParagraph) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (paragraph.contentType === "conversation" && paragraph.textLines && paragraph.textLines.length > 0) {
        // Fetch any Japanese voices to distinguish characters further if available
        const voices = window.speechSynthesis.getVoices();
        const jaVoices = voices.filter(v => v.lang.toLowerCase().includes("ja"));

        paragraph.textLines.forEach((line, index) => {
          const isA = line.speaker === "A" || index % 2 === 0;
          const cleanText = line.japanese.split("(")[0].split("（")[0].trim();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = "ja-JP";

          // Differentiate tone
          if (isA) {
            utterance.pitch = 1.15; // Higher, brighter tone
            utterance.rate = 0.85; // Faster natural speed
            if (jaVoices.length > 0) {
              utterance.voice = jaVoices[0];
            }
          } else {
            utterance.pitch = 0.80; // Deeper, lower tone
            utterance.rate = 0.78; // Slightly slower, different pacing
            if (jaVoices.length > 1) {
              utterance.voice = jaVoices[1];
            } else if (jaVoices.length > 0) {
              utterance.voice = jaVoices[0];
            }
          }

          window.speechSynthesis.speak(utterance);
        });
      } else {
        const stringText = paragraph.tokens.map(t => t.text).join("");
        const utterance = new SpeechSynthesisUtterance(stringText);
        utterance.lang = "ja-JP";
        utterance.rate = 0.78;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Checks if user has marked this database element as OK (Learned)
  const isTokenLearned = (token: ParagraphToken) => {
    if (token.type === "kanji") {
      const match = kanjiCards.find(c => c.kanji === token.kanji || c.kanji === token.text);
      return match ? kanjiOKSet.has(match.id) : false;
    }
    if (token.type === "verb") {
      const match = verbsList.find(v => v.kanji === token.kanji || v.dictionary === token.text || v.masu === token.text);
      return match ? verbsOKSet.has(match.id) : false;
    }
    if (token.type === "adjective") {
      const match = adjectivesList.find(a => a.kanji === token.kanji || a.kanji === token.text);
      return match ? adjOKSet.has(match.id) : false;
    }
    return false;
  };

  // High quality overlap comparison for speaker
  const matchToken = (token: ParagraphToken, spoken: string) => {
    if (!spoken) return false;
    const cleanSpoken = spoken.toLowerCase().replace(/[\s、。！？\?\!]/g, "");
    const tText = token.text.toLowerCase().replace(/[\s、。！？\?\!]/g, "");
    const tKanji = token.kanji ? token.kanji.toLowerCase().replace(/[\s、。！？\?\!]/g, "") : "";
    const tFurigana = token.furigana ? token.furigana.toLowerCase().replace(/[\s、。！？\?\!]/g, "") : "";
    return (
      (tText && cleanSpoken.includes(tText)) ||
      (tKanji && cleanSpoken.includes(tKanji)) ||
      (tFurigana && cleanSpoken.includes(tFurigana))
    );
  };


  // Generate the Quiz Questions
  const startQuiz = () => {
    let pool: Array<KanjiCard | JFTVerb | JFTAdjective> = [];
    let isVerbsMode = quizMode === "sinhala_verb_japanese" || quizMode === "japanese_verb_sinhala";
    let isAdjectivesMode = quizMode === "sinhala_adj_japanese" || quizMode === "japanese_adj_sinhala";

    if (isVerbsMode) {
      pool = [...verbsList];
    } else if (isAdjectivesMode) {
      pool = [...adjectivesList];
    } else {
      pool = [...kanjiCards];
    }

    if (pool.length === 0) {
      alert("No items in pool to construct a quiz!");
      return;
    }

    // Shuffle pool
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedCount = Math.min(questionCount, shuffledPool.length);
    const activeItems = shuffledPool.slice(0, selectedCount);

    // Build questions
    const generatedQuestions: QuizQuestion[] = activeItems.map((item) => {
      let prompt = "";
      let correctAnswer = "";
      let allPossibleAnswers: string[] = [];

      if (!isVerbsMode && !isAdjectivesMode) {
        // Kanji mode
        const kanjiCard = item as KanjiCard;
        if (quizMode === "kanji_reading") {
          prompt = kanjiCard.kanji;
          correctAnswer = kanjiCard.furigana;
          allPossibleAnswers = kanjiCards.map((c) => c.furigana);
        } else {
          prompt = kanjiCard.furigana;
          correctAnswer = kanjiCard.kanji;
          allPossibleAnswers = kanjiCards.map((c) => c.kanji);
        }
      } else if (isVerbsMode) {
        // Verbs mode
        const jftVerb = item as JFTVerb;
        if (quizMode === "sinhala_verb_japanese") {
          prompt = jftVerb.sinhalaMeaning;
          // Format with Kanji and furigana, e.g. "書く (かく)"
          correctAnswer = `${jftVerb.kanji} (${jftVerb.furigana})`;
          allPossibleAnswers = verbsList.map((v) => `${v.kanji} (${v.furigana})`);
        } else {
          prompt = `${jftVerb.kanji} (${jftVerb.furigana})`;
          correctAnswer = jftVerb.sinhalaMeaning;
          allPossibleAnswers = verbsList.map((v) => v.sinhalaMeaning);
        }
      } else {
        // Adjectives mode
        const jftAdj = item as JFTAdjective;
        if (quizMode === "sinhala_adj_japanese") {
          prompt = jftAdj.sinhalaMeaning;
          correctAnswer = `${jftAdj.kanji} (${jftAdj.hiragana})`;
          allPossibleAnswers = adjectivesList.map((a) => `${a.kanji} (${a.hiragana})`);
        } else {
          prompt = `${jftAdj.kanji} (${jftAdj.hiragana})`;
          correctAnswer = jftAdj.sinhalaMeaning;
          allPossibleAnswers = adjectivesList.map((a) => a.sinhalaMeaning);
        }
      }

      // Generate options: 1 correct + 3 wrong
      const otherAnswers = Array.from(new Set(allPossibleAnswers)).filter(
        (ans) => ans !== correctAnswer
      );
      const shuffledOthers = [...otherAnswers].sort(() => 0.5 - Math.random());
      const selectedOthers = shuffledOthers.slice(0, 3);

      // Final choices shuffled
      const options = [...selectedOthers, correctAnswer].sort(() => 0.5 - Math.random());

      return {
        prompt,
        correctAnswer,
        options,
        originalItem: item,
      };
    });

    setQuestions(generatedQuestions);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setHistory([]);
    setStreak(0);
    setMaxStreak(0);
    setGameState("playing");

    // Pronounce first question if relevant (Japanese prompt or option in Japanese)
    setTimeout(() => {
      if (quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading" || quizMode === "japanese_adj_sinhala") {
        speakJapanese(generatedQuestions[0].prompt);
      }
    }, 200);
  };

  // Submit Answer
  const selectAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const question = questions[currentIdx];
    const correct = option === question.correctAnswer;

    if (correct) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const next = st + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      // Optionally pronounce correct voice if Japanese option was chosen
      if (quizMode === "sinhala_verb_japanese" || quizMode === "reading_kanji" || quizMode === "sinhala_adj_japanese") {
        speakJapanese(question.correctAnswer);
      }
    } else {
      setStreak(0);
    }

    setHistory((prev) => [
      ...prev,
      {
        questionPrompt: question.prompt,
        correctAnswer: question.correctAnswer,
        userChoice: option,
        isCorrect: correct,
        originalItem: question.originalItem,
      },
    ]);
  };

  // Go to Next Question
  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);

      // Speak text for next card
      const nextQ = questions[currentIdx + 1];
      if (quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading" || quizMode === "japanese_adj_sinhala") {
        setTimeout(() => speakJapanese(nextQ.prompt), 100);
      }
    } else {
      setGameState("summary");
    }
  };

  const getAccuracyRate = () => {
    if (questions.length === 0) return 0;
    return Math.round((score / questions.length) * 100);
  };

  const getSinhalaMotivationMessage = (accuracy: number) => {
    if (accuracy === 100) return "විශිෂ්ටයි! ඔබ සියලුම ප්‍රශ්න නිවැරදිව තෝරාගත්තා! (Perfect Score!) 🏆✨";
    if (accuracy >= 80) return "සුපිරි වැඩක් මචං! ඔබ ඉතා ඉහළ ලකුණු ප්‍රමාණයක් ලබාගත්තා. (Excellent Job!) 🔥🌟";
    if (accuracy >= 50) return "හොඳ උත්සාහයක්! තව ටිකක් පුහුණු වුණොත් මීට වඩා හොඳට කරන්න පුළුවන්. (Good effort!) 👍📖";
    return "කමක් නැහැ, ආයෙ උත්සාහ කරමු! වැරදුණු තැන් බලාගෙන තව ටිකක් පාඩම් කරමු. (Keep practice!) 💪❤️";
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div className="w-full space-y-6" id="super-quiz-wrapper">
      {/* Subtab selection header for Quiz views */}
      {gameState === "setup" && (
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-2 p-1.5 bg-[#f0ede6] rounded-2xl border border-[#e9e2d7]">
          <button
            type="button"
            onClick={() => setActiveQuizSubMode("standard")}
            className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeQuizSubMode === "standard"
                ? "bg-white text-[#52796f] shadow-xs"
                : "text-[#84a98c] hover:text-[#52796f] hover:bg-white/40"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#bc6c25]" /> බහුවරණ ප්‍රශ්නාවලිය (Standard MCQ Quiz)
          </button>
          <button
            type="button"
            onClick={() => setActiveQuizSubMode("paragraph")}
            className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeQuizSubMode === "paragraph"
                ? "bg-white text-[#52796f] shadow-xs"
                : "text-[#84a98c] hover:text-[#52796f] hover:bg-white/40"
            }`}
          >
            <Mic className="w-4 h-4 text-[#bc6c25]" /> ඡේද සවන්දීම සහ කථනය (Paragraph Speech Arena)
          </button>
          <button
            type="button"
            onClick={() => setActiveQuizSubMode("drawing")}
            className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeQuizSubMode === "drawing"
                ? "bg-white text-[#52796f] shadow-xs"
                : "text-[#84a98c] hover:text-[#52796f] hover:bg-white/40"
            }`}
          >
            <Edit3 className="w-4 h-4 text-[#bc6c25]" /> කන්ජි ලිවීමේ පරීක්ෂණය (Check Kanji Drawing)
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* --- 1. SETUP / CONFIGURATION SCREEN --- */}
        {gameState === "setup" && activeQuizSubMode === "standard" && (
          <motion.div
            key="quiz-setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto bg-white rounded-[32px] border border-[#e9e2d7] p-8 shadow-sm space-y-8"
          >
            {/* Header intro */}
            <div className="text-center space-y-2 border-b border-[#f0ede6] pb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#bc6c25] text-white flex items-center justify-center mx-auto shadow-md">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black font-display text-[#354f52] mt-4">
                JFT-Basic Super Quiz (ප්‍රශ්නාවලිය)
              </h2>
              <p className="text-sm text-[#84a98c]">
                Kanji, ක්‍රියාපද (Verbs) සහ විශේෂණ පද (Adjectives) සඳහා විකල්ප 4කින් යුත් බහුවරණ ප්‍රශ්නාවලිය ජපන් සහ සිංහලෙන් පුහුණු වෙන්න.
              </p>
            </div>

            {/* Quiz Modes Selector */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-[#52796f] uppercase tracking-wider flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#bc6c25]" /> පරීක්ෂණ ක්‍රමය තෝරන්න (Select Quiz Mode)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Mode 1: Kanji -> Reading */}
                <button
                  type="button"
                  onClick={() => setQuizMode("kanji_reading")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "kanji_reading"
                      ? "border-[#52796f] bg-[#cad2c5]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cad2c5] text-[#2f3e46]">KANJI DECK</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#52796f] transition-colors">
                      Kanji ➔ Hiragana Reading
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      ප්‍රශ්නය ලෙස Kanji ಪෙන්වන අතර නිවැරදි හිරගනා ශබ්දය තෝරාගත යුතුය.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#52796f] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Mode 2: Reading -> Kanji */}
                <button
                  type="button"
                  onClick={() => setQuizMode("reading_kanji")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "reading_kanji"
                      ? "border-[#52796f] bg-[#cad2c5]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cad2c5] text-[#2f3e46]">KANJI DECK</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#52796f] transition-colors">
                      Hiragana ➔ Kanji Match
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      ප්‍රශ්නය ලෙස හිරගනා ශබ්දය පෙන්වන අතර නිවැරදි Kanji වචනය තෝරන්න.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#52796f] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Mode 3: Sinhala Verb -> Japanese Verb */}
                <button
                  type="button"
                  onClick={() => setQuizMode("sinhala_verb_japanese")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "sinhala_verb_japanese"
                      ? "border-[#bc6c25] bg-[#ece2d0]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ece2d0] text-[#bc6c25]">VERB DECK (ක්‍රියාපද)</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#bc6c25] transition-colors">
                      Sinhala ➔ Japanese Verb
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      සිංහල තේරුම ලබා දෙන අතර නිවැරදි ජපන් ක්‍රියාපදය (Kanji + Furigana) තෝරන්න.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#bc6c25] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Mode 4: Japanese Verb -> Sinhala Verb */}
                <button
                  type="button"
                  onClick={() => setQuizMode("japanese_verb_sinhala")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "japanese_verb_sinhala"
                      ? "border-[#bc6c25] bg-[#ece2d0]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ece2d0] text-[#bc6c25]">VERB DECK (ක්‍රියාපද)</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#bc6c25] transition-colors">
                      Japanese Verb ➔ Sinhala Meaning
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      ජපන් ක්‍රියාපදය (Kanji + Furigana) දෙන අතර, නිවැරදි සිංහල අර්ථය තෝරන්න.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#bc6c25] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Mode 5: Sinhala Adjective -> Japanese Adjective */}
                <button
                  type="button"
                  onClick={() => setQuizMode("sinhala_adj_japanese")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "sinhala_adj_japanese"
                      ? "border-[#52796f] bg-[#cad2c5]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cad2c5] text-[#2f3e46]">ADJECTIVE DECK (විශේෂණ)</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#52796f] transition-colors">
                      Sinhala ➔ Japanese Adjective
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      සිංහල තේරුම ලබා දෙන අතර නිවැරදි ජපන් විශේෂණ පදය (Kanji + Hiragana) තෝරන්න.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#52796f] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Mode 6: Japanese Adjective -> Sinhala */}
                <button
                  type="button"
                  onClick={() => setQuizMode("japanese_adj_sinhala")}
                  className={`p-5 rounded-[20px] text-left border-2 transition-all duration-200 flex flex-col justify-between h-40 group ${
                    quizMode === "japanese_adj_sinhala"
                      ? "border-[#52796f] bg-[#cad2c5]/25"
                      : "border-[#e9e2d7] bg-white hover:border-[#84a98c]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cad2c5] text-[#2f3e46]">ADJECTIVE DECK (විශේෂණ)</span>
                    <h4 className="font-extrabold text-[#354f52] text-sm group-hover:text-[#52796f] transition-colors">
                      Japanese Adjective ➔ Sinhala Meaning
                    </h4>
                    <p className="text-xs text-[#84a98c] leading-relaxed">
                      ජපන් විශේෂණ පදය (Kanji + Hiragana) දෙන අතර නිවැරදි සිංහල අර්ථය තෝරන්න.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#52796f] self-end flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    තෝරන්න <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>

              </div>
            </div>

            {/* Questions count choice */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-[#52796f] uppercase tracking-wider">
                ප්‍රශ්න ගණන තෝරන්න (Select Question Volume)
              </h3>
              <div className="flex gap-2">
                {[10, 20, 30, 50, 100].map((num) => {
                  let maxAvailable = 
                    quizMode === "sinhala_verb_japanese" || quizMode === "japanese_verb_sinhala" 
                      ? verbsList.length 
                      : quizMode === "sinhala_adj_japanese" || quizMode === "japanese_adj_sinhala"
                      ? adjectivesList.length
                      : kanjiCards.length;
                  if (num > maxAvailable) return null;

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 border ${
                        questionCount === num
                          ? "bg-[#354f52] text-white border-[#354f52] shadow-xs"
                          : "bg-[#fdfbf7] text-[#52796f] border-[#e9e2d7] hover:bg-[#f0ede6]"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-[#f0ede6]">
              {onBackToLearn && (
                <button
                  type="button"
                  onClick={onBackToLearn}
                  className="flex-1 py-3 border border-[#e9e2d7] hover:bg-[#fdfbf7] text-slate-500 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  ආපසු යන්න (Back to Course)
                </button>
              )}
              <button
                type="button"
                onClick={startQuiz}
                className="flex-3 py-3 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl font-black text-xs transition inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> ප්‍රශ්නාවලිය ආරම්භ කරන්න (Start Super Quiz)
              </button>
            </div>
          </motion.div>
        )}

        {/* --- 1B. PARAGRAPH SPEECH & LISTENING ARENA --- */}
        {gameState === "setup" && activeQuizSubMode === "paragraph" && (
          <motion.div
            key="paragraph-trainer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto space-y-6 text-left"
          >
            {/* Paragraph/Conversation study selector card banner */}
            <div className="bg-white rounded-[28px] border border-[#e9e2d7] p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#ece2d0] text-[#bc6c25]">
                  <Ear className="w-3.5 h-3.5" /> JFT STUDY BOARD & COMPREHENSION ARENA
                </span>
                <h3 className="text-lg font-black text-[#354f52]">
                  කියවීම, සවන්දීම සහ කථන පුහුණුව (Reading, Listening & Speaking Arena)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Kanji, Verbs, Adjectives සහ Grammar උපයෝගී කරගෙන සාදන ලද ආකර්ෂණීය ඡේද හෝ සංවාද කියවීම, සවන්දීම සහ කථනය මඟින් පුහුණු වන්න.
                </p>
              </div>

              {/* Advanced configuration controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#f0ede6]">
                {/* 1. Content Format Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#52796f] uppercase tracking-wider">
                    🇱🇰 පෙළෙහි ආකෘතිය තෝරන්න (Text Format Type)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setContentType("paragraph")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                        contentType === "paragraph"
                          ? "bg-[#354f52] text-white border-transparent shadow-xs"
                          : "bg-slate-50 text-slate-600 border-[#e9e2d7] hover:bg-slate-100"
                      }`}
                    >
                      📘 ඡේදය (Paragraph)
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType("conversation")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                        contentType === "conversation"
                          ? "bg-[#354f52] text-white border-transparent shadow-xs"
                          : "bg-slate-50 text-slate-600 border-[#e9e2d7] hover:bg-slate-100"
                      }`}
                    >
                      💬 සංවාදය (Conversation Dialogue)
                    </button>
                  </div>
                </div>

                {/* 2. Vocabulary Filter Level Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#52796f] uppercase tracking-wider">
                    🇱🇰 වචන මාලා පෙරහන තෝරන්න (Vocabulary Filter)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setVocabularyFilter("all")}
                      className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-bold border transition cursor-pointer ${
                        vocabularyFilter === "all"
                          ? "bg-[#bc6c25] text-white border-transparent shadow-xs"
                          : "bg-slate-50 text-slate-600 border-[#e9e2d7] hover:bg-slate-100"
                      }`}
                      title="සියලුම වචන මිශ්‍ර කර සාදන්න"
                    >
                      🌎 සියල්ල (All)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVocabularyFilter("ok")}
                      className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-bold border transition cursor-pointer ${
                        vocabularyFilter === "ok"
                          ? "bg-[#bc6c25] text-white border-transparent shadow-xs"
                          : "bg-slate-50 text-slate-600 border-[#e9e2d7] hover:bg-slate-100"
                      }`}
                      title="ඔබ 'OK' ලෙස ලකුණු කළ දේ පමණක්"
                    >
                      ✔️ OK පමණි
                    </button>
                    <button
                      type="button"
                      onClick={() => setVocabularyFilter("not_yet")}
                      className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-bold border transition cursor-pointer ${
                        vocabularyFilter === "not_yet"
                          ? "bg-[#bc6c25] text-white border-transparent shadow-xs"
                          : "bg-slate-50 text-slate-600 border-[#e9e2d7] hover:bg-slate-100"
                      }`}
                      title="ඔබ තවම ඉගෙනගෙන නොමැති දේ පුහුණු වීමට"
                    >
                      ❌ Not Yet Focus
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic trigger and navigation section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#f0ede6]">
                {/* Generation triggering button with descriptive indicator */}
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setShuffleTrigger(prev => prev + 1)}
                    className="w-full sm:w-auto px-5 py-3 bg-[#bc6c25] hover:bg-[#8f521b] text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Shuffle className="w-4.5 h-4.5 animate-pulse" />
                    🔄 ඡේද සහ සංවාද ශෆල් කරන්න (Shuffle matched scenarios)
                  </button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">
                    📂 STUDY LOGS:
                  </span>
                  {/* Selector controllers */}
                  <div className="flex items-center gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveParagraphIdx((prev) => (prev > 0 ? prev - 1 : filteredParagraphs.length - 1));
                        setSpokenText("");
                        setIsSpeakingResultShown(false);
                        setSelectedWordToken(null);
                        setQuizAnswers({}); // reset current quiz state
                        setShowTranslations(false);
                      }}
                      className="py-1 px-2.5 cursor-pointer bg-white text-[#bc6c25] hover:bg-[#fdfbf7] rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      ◀ Prev
                    </button>
                    <span className="font-mono font-black text-xs text-[#354f52] px-3">
                      {filteredParagraphs.length > 0 ? activeParagraphIdx + 1 : 0} / {filteredParagraphs.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveParagraphIdx((prev) => (prev < filteredParagraphs.length - 1 ? prev + 1 : 0));
                        setSpokenText("");
                        setIsSpeakingResultShown(false);
                        setSelectedWordToken(null);
                        setQuizAnswers({}); // reset current quiz state
                        setShowTranslations(false);
                      }}
                      className="py-1 px-2.5 cursor-pointer bg-white text-[#bc6c25] hover:bg-[#fdfbf7] rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              </div>

              {generationError && (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 mt-2">
                  ⚠️ {generationError}
                </div>
              )}
            </div>

            {/* Paragraph display container */}
            {filteredParagraphs.length > 0 && (() => {
              const para = displayedParagraph;
              if (!para) return null;
              const matchedCount = para.tokens.filter(t => isListening || spokenText ? matchToken(t, spokenText) : false).length;
              const matchingPercentage = para.tokens.length > 0 ? Math.round((matchedCount / para.tokens.length) * 100) : 0;

              return (
                <div className="space-y-6">
                  {/* Paragraph cardboard */}
                  <div className="bg-white rounded-[32px] border border-[#e9e2d7] p-8 shadow-sm space-y-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#f0ede6] pb-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#84a98c] font-black uppercase tracking-wider block">
                          SCENARIO {activeParagraphIdx + 1}
                        </span>
                        <h4 className="font-extrabold text-[#354f52] text-md">
                          🇱🇰 {para.titleSinhala} • <span className="text-[#bc6c25]">{para.titleEnglish}</span>
                        </h4>
                      </div>

                      {/* Speaks total text */}
                      <button
                        type="button"
                        onClick={() => speakParagraphText(para)}
                        className="py-1.5 px-3 bg-[#cad2c5]/40 hover:bg-[#cad2c5] text-[#354f52] transition-colors rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                        title="මුළු ඡේදයටම සවන් දෙන්න"
                      >
                        <Volume2 className="w-4 h-4 text-[#52796f]" /> Listen (ඡේදයට සවන්දීම)
                      </button>
                    </div>

                    {/* Speech Practicer Panel (Start Recording option) - moved above the conversation/paragraph content */}
                    <div className="bg-[#fcfaf2] rounded-2xl border border-[#ece2d0] p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white border border-[#e9e2d7]/60 rounded-xl">
                        <div className="space-y-1">
                          <p className="text-xs text-[#bc6c25] font-black flex items-center gap-1.5 uppercase tracking-wider">
                            🎙️ Oral Practice & Speech Comparison (කථන පුහුණුව)
                          </p>
                          <p className="text-xs text-slate-700 font-bold leading-relaxed">
                            මයික්‍රෆෝනය සක්‍රීය කර ඉහත ජපන් ඡේදය හෝ සංවාදය ශබ්ද නඟා කියවන්න.
                          </p>
                          <p className="text-[11.5px] text-[#52796f] font-bold leading-relaxed">
                            ඔබ නිවැරදිව ශබ්ද කළ වචන පහත ඡේදය/සංවාදය තුළ <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">කොළ පැහැයෙන්</strong> උද්දීපනය වනු ඇත!
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={startSpeechRecognition}
                          disabled={isListening}
                          className={`py-2.5 px-4.5 rounded-xl font-black text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                            isListening
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-[#bc6c25] hover:bg-[#8f521b] text-white"
                          }`}
                        >
                          {isListening ? (
                            <>
                              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                              Listening... (කියවන්න...)
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 text-white" />
                              කථනය අරඹන්න (Start Recording)
                            </>
                          )}
                        </button>
                      </div>

                      {recognitionError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1">
                          ⚠️ <span>Error: {recognitionError}</span>
                        </div>
                      )}

                      {/* Results Checker overlay */}
                      {isSpeakingResultShown && (
                        <div className="p-4 rounded-xl bg-[#cad2c5]/20 border border-[#cad2c5]/40 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-[#52796f] uppercase tracking-wider">
                              🎙️ Spoken Recognition Transcript (ඔබ පැවසූ දෙය):
                            </span>
                            <span className="font-extrabold text-[#354f52]">
                              Matched: {matchedCount} / {para.tokens.length} words ({matchingPercentage}%)
                            </span>
                          </div>

                          <p className="p-3 bg-white border border-[#e9e2d7] rounded-xl text-sm font-extrabold text-[#2f3e46] font-mono leading-relaxed italic">
                            " {spokenText || "කිසිදු ශබ්දයක් හඳුනාගත නොහැකි විය. කරුණාකර මයික්‍රෆෝනය අසල සෙමෙන් නැවත උත්සාහ කරන්න."} "
                          </p>

                          <div className="w-full bg-[#f0ede6] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#52796f] h-full rounded-full transition-all duration-300"
                              style={{ width: `${matchingPercentage}%` }}
                            ></div>
                          </div>

                          <p className="text-xs font-bold text-[#354f52] leading-relaxed">
                            {matchingPercentage === 100
                              ? "නියමයි මචං! ඔබ මුළු ඡේදයේම වචන 100%ක්ම නිවැරදිව උච්චාරණය කළා! (100% Correct Match!) 🏆💖"
                              : matchingPercentage >= 60
                              ? "ඉතා විශිෂ්ටයි! වචන බොහෝමයක් නිවැරදිව ශබ්ද කළා. නොගැලපෙන වචන මත ක්ලික් කර නැවත අකුරු කියවා පුහුණු වන්න. 👍🔥"
                              : "හොඳ උත්සාහයක්! වචන මත ක්ලික් කර හඬ සවන් දී, සෙමෙන් නැවත ශබ්ද නඟා උත්සාහ කරන්න. (Good effort, retry!) 💪✨"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Render either Alternating Chat Bubbles (for conversations) or Token Word Container (for paragraphs) */}
                    {para.contentType === "conversation" && para.textLines && para.textLines.length > 0 ? (
                      <div className="space-y-5 my-4">
                        {para.textLines.map((line, lIdx) => {
                          const isSpeakerA = line.speaker === "A" || lIdx % 2 === 0;
                          return (
                            <div
                              key={lIdx}
                              className={`flex flex-col ${isSpeakerA ? "items-start text-left" : "items-end text-right"} space-y-1`}
                            >
                              <div className="flex items-center gap-1.5 px-1">
                                <span className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-full text-[10px] font-mono font-black shadow-xs ${
                                  isSpeakerA 
                                    ? "bg-[#52796f] text-white" 
                                    : "bg-[#bc6c25] text-white"
                                }`}>
                                  {line.speaker || (isSpeakerA ? "A" : "B")}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  Speaker {line.speaker || (isSpeakerA ? "A" : "B")}
                                </span>
                              </div>

                              <div className={`p-4 rounded-2xl max-w-[85%] border shadow-xs transition hover:shadow-xs space-y-1.5 ${
                                isSpeakerA 
                                  ? "bg-[#fdfbf7] border-[#e9e2d7] rounded-tl-none text-[#2f3e46]" 
                                  : "bg-[#cad2c5]/10 border-[#cad2c5]/35 rounded-tr-none text-[#2f3e46]"
                              }`}>
                                <p className="font-extrabold text-lg md:text-xl tracking-wide leading-relaxed">
                                  {line.japanese}
                                </p>
                                {showTranslations && (
                                  <>
                                    <div className="border-t border-slate-200/50 pt-1 text-[11px] font-medium text-slate-500 italic">
                                      "{line.english}"
                                    </div>
                                    <div className="text-[11px] font-bold text-[#bc6c25] flex items-center gap-1">
                                      🇱🇰 {line.sinhala}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Conversational Interactive Word Collector */}
                        <div className="space-y-2 pt-6 border-t border-dashed border-[#e9e2d7]">
                          <span className="text-[10px] font-black tracking-widest text-[#52796f] uppercase block">
                            💡 DIALOGUE VOCABULARY ACCELERATOR (වචන මාලා විශ්ලේෂණය)
                          </span>
                          <p className="text-[11px] text-slate-400 font-bold block">
                            සංවාදයේ ඇති වචන තනි තනිව අධ්‍යයනය කිරීමට පහත ඕනෑම වචනයක් මත ක්ලික් කරන්න:
                          </p>
                          <div className="p-5 bg-amber-50/5 border border-dashed border-[#e9e2d7] rounded-[24px] min-h-[100px] flex flex-wrap gap-x-3 gap-y-5 items-end justify-center text-center">
                            {para.tokens.map((token) => {
                              const learned = isTokenLearned(token);
                              const correctMatched = isListening || spokenText ? matchToken(token, spokenText) : false;
                              const isKanjiChar = (char: string) => /[\u4e00-\u9faf]/.test(char);

                              let displayedText = token.text;
                              if (token.type === "kanji") {
                                const matchCard = kanjiCards.find(c => c.kanji === token.kanji || c.kanji === token.text);
                                const isOk = matchCard ? kanjiOKSet.has(matchCard.id) : false;
                                if (isOk) {
                                  displayedText = token.kanji || token.text;
                                } else {
                                  displayedText = token.furigana || (token as any).hiragana || token.text;
                                }
                              } else if (token.type === "verb" || token.type === "adjective") {
                                if (learned) {
                                  const wordToTest = token.kanji || token.text || "";
                                  const kanjisInWord = [...wordToTest].filter(isKanjiChar);
                                  const allKanjisLearned = kanjisInWord.length > 0 && kanjisInWord.every(char => {
                                    const card = kanjiCards.find(c => c.kanji.includes(char));
                                    return card ? kanjiOKSet.has(card.id) : false;
                                  });

                                  if (allKanjisLearned) {
                                    displayedText = token.kanji || token.text;
                                  } else {
                                    displayedText = (token as any).hiragana || token.furigana || token.text;
                                  }
                                } else {
                                  displayedText = (token as any).hiragana || token.furigana || token.text;
                                }
                              }

                              let tokenStyle = "text-[#2f3e46] hover:text-[#bc6c25]";
                              if (correctMatched) {
                                tokenStyle = "text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs px-2 py-0.5 rounded-lg font-extrabold";
                              } else if (learned) {
                                tokenStyle = "text-[#52796f] underline decoration-dashed decoration-[#cad2c5] decoration-2 font-semibold";
                              }

                              return (
                                <div
                                  key={token.id}
                                  onClick={() => {
                                    setSelectedWordToken(token);
                                    if (token.furigana) {
                                      spellWordSlowly(token.furigana);
                                    } else {
                                      speakJapanese(token.text);
                                    }
                                  }}
                                  className={`cursor-pointer transition duration-150 select-none ${tokenStyle}`}
                                  title={`ක්ලික් කරන්න: ${token.englishMeaning}`}
                                >
                                  <span className="font-extrabold text-lg md:text-xl">
                                    {displayedText}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Styled Paragraph tokens box */
                      <div className="p-6 md:p-8 bg-amber-50/15 border-2 border-dashed border-[#e9e2d7] rounded-[24px] min-h-[160px] flex flex-wrap gap-x-3.5 gap-y-7 items-end justify-center text-center">
                        {para.tokens.map((token) => {
                          const learned = isTokenLearned(token);
                          const correctMatched = isListening || spokenText ? matchToken(token, spokenText) : false;

                          const isKanjiChar = (char: string) => /[\u4e00-\u9faf]/.test(char);

                          let displayedText = token.text;
                          if (token.type === "kanji") {
                            const matchCard = kanjiCards.find(c => c.kanji === token.kanji || c.kanji === token.text);
                            const isOk = matchCard ? kanjiOKSet.has(matchCard.id) : false;
                            if (isOk) {
                              displayedText = token.kanji || token.text;
                            } else {
                              displayedText = token.furigana || (token as any).hiragana || token.text;
                            }
                          } else if (token.type === "verb" || token.type === "adjective") {
                            if (learned) {
                              const wordToTest = token.kanji || token.text || "";
                              const kanjisInWord = [...wordToTest].filter(isKanjiChar);
                              const allKanjisLearned = kanjisInWord.length > 0 && kanjisInWord.every(char => {
                                const card = kanjiCards.find(c => c.kanji.includes(char));
                                return card ? kanjiOKSet.has(card.id) : false;
                              });

                              if (allKanjisLearned) {
                                displayedText = token.kanji || token.text;
                              } else {
                                displayedText = (token as any).hiragana || token.furigana || token.text;
                              }
                            } else {
                              displayedText = (token as any).hiragana || token.furigana || token.text;
                            }
                          }

                          let tokenStyle = "text-[#2f3e46] hover:text-[#bc6c25]";
                          if (correctMatched) {
                            tokenStyle = "text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs px-2.5 py-1 rounded-xl -my-1 font-extrabold scale-102";
                          } else if (learned) {
                            tokenStyle = "text-[#52796f] underline decoration-dashed decoration-[#cad2c5] decoration-2 font-semibold";
                          }

                          return (
                            <div
                              key={token.id}
                              onClick={() => {
                                setSelectedWordToken(token);
                                if (token.furigana) {
                                  spellWordSlowly(token.furigana);
                                } else {
                                  speakJapanese(token.text);
                                }
                              }}
                              className={`cursor-pointer transition duration-150 select-none ${tokenStyle}`}
                              title={`ක්ලික් කරන්න: ${token.englishMeaning}`}
                            >
                              <span className="font-extrabold text-xl md:text-2xl">
                                {displayedText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {para.contentType !== "conversation" && (
                      <p className="text-[10px] text-slate-400 font-bold block text-center">
                        💡 ඡේදයේ ඇති ඕනෑම වචනයක් මත ක්ලික් කර එහි අකුරු කියවන ආකාරය (Hiragana Spelling) නැවත සෙමින් සවන් දෙන්න!
                      </p>
                    )}

                    {/* Show Translations centered toggle button under paragraph or conversation content */}
                    <div className="flex justify-center pt-5 pb-1 border-t border-dashed border-[#e9e2d7]">
                      <button
                        type="button"
                        onClick={() => setShowTranslations(prev => !prev)}
                        className={`px-6 py-2.5 rounded-full text-xs font-black shadow-md flex items-center gap-2 transition duration-200 cursor-pointer hover:scale-103 active:scale-97 ${
                          showTranslations
                            ? "bg-[#52796f] text-white hover:bg-[#354f52]"
                            : "bg-[#ede0d4] text-[#bc6c25] hover:bg-[#e6ccb2]"
                        }`}
                      >
                        <Languages className="w-4 h-4" />
                        {showTranslations ? "🙈 පරිවර්තන සඟවන්න (Hide Translations)" : "👁️ පරිවර්තන පෙන්වන්න (Show Translations)"}
                      </button>
                    </div>

                    {/* Conditional Translates container */}
                    {showTranslations && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#f0ede6]">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                          <span className="font-extrabold text-slate-400 block text-[9px] tracking-wider uppercase">ENGLISH TRANSLATION:</span>
                          <p className="text-slate-600 font-medium leading-relaxed italic">"{para.fullEnglishTranslation}"</p>
                        </div>
                        <div className="p-4 bg-[#cad2c5]/10 border border-[#cad2c5]/35 rounded-xl space-y-1.5">
                          <span className="font-extrabold text-[#52796f] block text-[9px] tracking-wider uppercase">🇱🇰 සිංහල පරිවර්තනය:</span>
                          <p className="text-[#354f52] font-semibold leading-relaxed">"{para.fullSinhalaTranslation}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* MCQ Reading Comprehension Challenge */}
                  {para.questions && para.questions.length > 0 && (
                    <div className="bg-white rounded-[28px] border border-[#e9e2d7] p-6 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#ede0d4] text-[#bc6c25]">
                          📝 READING COMPREHENSION TEST
                        </span>
                        <h4 className="font-extrabold text-[#354f52] text-sm">
                          ඡේද අවබෝධතා පරික්ෂණය (Interactive Comprehension Quiz - MCQ)
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          ඉහත ජපන් ඡේදය/සංවාදය කියවා තේරුම් ගනිමින් පහත ප්‍රශ්න 5 සඳහා නිවැරදි පිළිතුර තෝරන්න.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {para.questions.map((q, idx) => {
                          const selectedKey = quizAnswers[q.id];
                          const isAnswered = !!selectedKey;
                          return (
                            <div key={q.id || idx} className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                              <div className="flex items-start gap-2.5">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#52796f] text-white text-xs font-black shrink-0 mt-0.5 font-mono">
                                  {idx + 1}
                                </span>
                                <h5 className="font-extrabold text-slate-800 text-sm leading-relaxed tracking-wide">
                                  {q.questionJapanese}
                                </h5>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8.5">
                                {q.options.map((option, optIdx) => {
                                  const optionKeys = ["a", "b", "c", "d"];
                                  const opKey = optionKeys[optIdx] || "a";
                                  const isSelected = selectedKey === opKey;
                                  const isCorrectOption = opKey === q.correctOptionKey;

                                  let btnStyle = "bg-white border-[#e9e2d7] text-slate-600 hover:bg-slate-50";
                                  if (isAnswered) {
                                    if (isSelected) {
                                      btnStyle = isCorrectOption 
                                        ? "bg-emerald-600 text-white border-transparent" 
                                        : "bg-rose-500 text-white border-transparent";
                                    } else if (isCorrectOption) {
                                      btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold";
                                    }
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      type="button"
                                      disabled={isAnswered}
                                      onClick={() => {
                                        setQuizAnswers(prev => ({ ...prev, [q.id]: opKey }));
                                      }}
                                      className={`py-3 px-4 rounded-xl text-left text-xs font-bold border transition flex items-start gap-2.5 shadow-2xs ${btnStyle} ${isAnswered ? "" : "cursor-pointer active:scale-98"}`}
                                    >
                                      <span className="font-mono font-black text-[10px] px-1.5 py-0.5 bg-slate-100 rounded-md text-slate-600 shrink-0">
                                        {opKey.toUpperCase()}
                                      </span>
                                      <span className="leading-relaxed">{option}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanations block in Sinhala */}
                              {isAnswered && (
                                <div className={`ml-8.5 p-4 rounded-xl text-xs space-y-1.5 border transition duration-250 ${
                                  selectedKey === q.correctOptionKey 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                    : "bg-rose-50 border-rose-200 text-rose-800"
                                }`}>
                                  <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-wide">
                                    <span>
                                      {selectedKey === q.correctOptionKey ? "✔️ නිවැරදියි! (Correct!)" : "❌ වැරදියි! (Incorrect!)"}
                                    </span>
                                    •
                                    <span>නිවැරදි පිළිතුර: Option {q.correctOptionKey.toUpperCase()}</span>
                                  </div>
                                  <p className="leading-relaxed font-bold">
                                    🇱🇰 හැදින්වීම සහ විග්‍රහය: {q.explanationSinhala}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}



                  {/* Word Explorer popup card */}
                  {selectedWordToken && (
                    <motion.div
                      key={selectedWordToken.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[28px] border-2 border-[#bc6c25] p-5 shadow-sm relative text-left"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedWordToken(null)}
                        className="absolute right-4 top-4 p-1 rounded-lg hover:bg-[#f0ede6] text-[#84a98c] hover:text-slate-700 transition"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        {/* Audio spelling */}
                        <div className="md:col-span-4 text-center p-4 bg-[#fcfaf2] border border-[#e9e2d7] rounded-xl flex flex-col items-center justify-center space-y-2">
                          <span className="text-[9px] font-black tracking-widest text-[#bc6c25] uppercase pb-1 border-b border-dashed border-[#e9e2d7] w-full">WORD DISCOVERY</span>
                          
                          <h4 className="font-extrabold text-xl text-[#2f3e46]">{selectedWordToken.text}</h4>
                          {selectedWordToken.furigana && (
                            <p className="font-mono font-bold text-xs text-[#bc6c25] bg-[#ece2d0] px-2.5 py-0.5 rounded-full">
                              {selectedWordToken.furigana}
                            </p>
                          )}
                          <div className="flex gap-2 w-full pt-1.5">
                            <button
                              type="button"
                              onClick={() => speakJapanese(selectedWordToken.text)}
                              className="flex-1 py-1.5 bg-[#f0ede6] hover:bg-[#e9e2d7] text-[#52796f] font-extrabold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Pronounce
                            </button>
                            {selectedWordToken.furigana && (
                              <button
                                type="button"
                                onClick={() => spellWordSlowly(selectedWordToken.furigana)}
                                className="flex-1 py-1.5 bg-[#ece2d0] hover:bg-[#ece2d0]/80 text-[#bc6c25] font-extrabold text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 focus:scale-95" /> Spelling
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Meanings */}
                        <div className="md:col-span-8 space-y-3.5">
                          <h4 className="text-xs font-black text-[#52796f] uppercase border-b border-[#f0ede6] pb-1">
                            Sinhala & English Translations (අර්ථය සහ උච්චාරණය)
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-[#cad2c5]/20 border border-[#cad2c5]/40 rounded-xl">
                              <span className="text-[9px] font-black text-[#354f52] block mb-0.5">🇱🇰 සිංහල අර්ථය:</span>
                              <p className="font-bold text-[#2f3e46]">{selectedWordToken.sinhalaMeaning || "අර්ථය සපයා නැත"}</p>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <span className="text-[9px] font-black text-slate-400 block mb-0.5">English meaning:</span>
                              <p className="font-bold text-slate-600">{selectedWordToken.englishMeaning || "Not provided"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-100 text-slate-500 font-mono">
                              Type: {selectedWordToken.type}
                            </span>
                            {isTokenLearned(selectedWordToken) && (
                              <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Checked OK (මතකයි)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* --- 1C. KANJI DRAWING TEST WORKSPACE --- */}
        {gameState === "setup" && activeQuizSubMode === "drawing" && (
          <CheckKanjiDrawingView
            kanjiCards={kanjiCards}
            onBackToSetup={() => setActiveQuizSubMode("standard")}
          />
        )}

        {/* --- 2. PLAYING / ACTIVE QUIZ SCREEN --- */}
        {gameState === "playing" && currentQuestion && (
          <motion.div
            key="quiz-playing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-xl mx-auto space-y-6"
          >
            {/* Top Bar metrics */}
            <div className="bg-white p-4 px-5 rounded-2xl border border-[#e9e2d7] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-[#52796f] bg-[#f0ede6] px-3 py-1 rounded-lg">
                  Q: {currentIdx + 1} / {questions.length}
                </span>
                
                {streak >= 3 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ece2d0]/60 border border-[#bc6c25]/30 text-xs font-black text-[#bc6c25] animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-[#bc6c25]" /> {streak} STREAK
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 font-mono">
                {/* Sound toggle button */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 px-1.5 bg-[#f0ede6] hover:bg-[#e9e2d7] rounded-lg text-[#52796f] transition-colors"
                  title={soundEnabled ? "Mute Pronunciation" : "Enable Pronunciation"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block font-bold text-[10px]">CURRENT SCORE</span>
                  <span className="font-extrabold text-[#354f52]">{score} correct</span>
                </div>
              </div>
            </div>

            {/* Question Progress track bar */}
            <div className="w-full bg-[#f0ede6] h-2 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-[#bc6c25] h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Prompt Presentation Card */}
            <div className="bg-white rounded-[32px] border border-[#e9e2d7] shadow-sm p-8 text-center flex flex-col justify-center items-center min-h-[220px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/40 to-transparent pointer-events-none"></div>
              
              <div className="space-y-4 z-10 w-full">
                <span className="text-[10px] font-black uppercase text-[#84a98c] tracking-widest block">
                  {quizMode === "kanji_reading" && "පහත කන්ජි වචනයේ නිවැරදි කියවීම තෝරන්න (Select Pronunciation)"}
                  {quizMode === "reading_kanji" && "පහත හිරගනා ශබ්දයට ගැළපෙන කන්ජි වචනය (Select Kanji)"}
                  {quizMode === "sinhala_verb_japanese" && "පහත සිංහල ක්‍රියාපදයේ නිවැරදි ජපන් වචනය තෝරන්න (Select Japanese Verb)"}
                  {quizMode === "japanese_verb_sinhala" && "පහත ජපන් ක්‍රියාපදයට ගැළපෙන සිංහල තේරුම (Select Sinhala Meaning)"}
                  {quizMode === "sinhala_adj_japanese" && "පහත සිංහල විශේෂණ පදයේ නිවැරදි ජපන් වචනය තෝරන්න (Select Japanese Adjective)"}
                  {quizMode === "japanese_adj_sinhala" && "පහත ජපන් විශේෂණ පදයට ගැළපෙන සිංහල තේරුම (Select Sinhala Meaning)"}
                </span>

                <motion.h3 
                  key={currentIdx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`font-black tracking-tight text-[#2f3e46] ${
                    currentQuestion.prompt.length > 8 ? "text-3xl" : "text-5xl"
                  }`}
                >
                  {currentQuestion.prompt}
                </motion.h3>

                {/* Pronounce voice assistant prompt if relevant */}
                {(quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading" || quizMode === "japanese_adj_sinhala") && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(currentQuestion.prompt)}
                    className="mx-auto mt-2 p-2 bg-[#f0ede6] hover:bg-[#e9e2d7]/80 rounded-xl flex items-center gap-1.5 text-xs font-bold text-[#52796f] transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Pronounce Prompt
                  </button>
                )}
              </div>
            </div>

            {/* Answers Choice Matrix (4 Options) */}
            <div className="grid grid-cols-1 gap-3.5">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;
                
                let btnStyle = "bg-white border-[#e9e2d7] text-[#354f52] hover:border-[#84a98c]";
                let iconEl = null;

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-[#cad2c5]/40 border-[#52796f] text-[#2f3e46] font-bold";
                    iconEl = <Check className="w-4 h-4 text-[#52796f] font-bold" />;
                  } else if (isSelected) {
                    btnStyle = "bg-[#ece2d0]/60 border-[#bc6c25] text-[#bc6c25] font-bold";
                    iconEl = <X className="w-4 h-4 text-[#bc6c25] font-bold" />;
                  } else {
                    btnStyle = "bg-slate-50 border-[#e9e2d7] text-slate-400 opacity-60 pointer-events-none";
                  }
                }

                return (
                  <motion.button
                    key={`${currentIdx}-${oIdx}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => selectAnswer(option)}
                    whileHover={{ scale: isAnswered ? 1 : 1.01 }}
                    className={`p-4 px-6 rounded-2xl border-2 text-left text-sm font-semibold transition-all duration-150 flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono">{option}</span>
                    {iconEl && (
                      <span className="p-1 rounded-full bg-white/70 border border-inherit">
                        {iconEl}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanatory footer when answered */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white p-5 rounded-2xl border border-[#e9e2d7] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-2"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#84a98c] block">CORRECT TRANSLATION INFO</span>
                    <p className="text-xs text-[#52796f] font-bold leading-relaxed">
                      {"englishMeaning" in currentQuestion.originalItem ? (
                        <>
                          <strong>English Meaning:</strong> {(currentQuestion.originalItem as KanjiCard).englishMeaning} | <strong>Sinhala:</strong> {(currentQuestion.originalItem as KanjiCard).sinhalaMeaning}
                        </>
                      ) : "masu" in currentQuestion.originalItem ? (
                        <>
                          <strong>Conjugation:</strong> Masu form is <code>{(currentQuestion.originalItem as JFTVerb).masu}</code> and Dictionary form is <code>{(currentQuestion.originalItem as JFTVerb).dictionary}</code>.
                        </>
                      ) : (
                        <>
                          <strong>Type:</strong> {(currentQuestion.originalItem as JFTAdjective).type === "i" ? "i-Adjective (ඉ-විශේෂණය)" : "na-Adjective (න-විශේෂණය)"} | <strong>Hiragana:</strong> {(currentQuestion.originalItem as JFTAdjective).hiragana}
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-2.5 px-5 bg-[#bc6c25] hover:bg-[#a65618] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    {currentIdx + 1 < questions.length ? (
                      <>
                        Next Question <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Finish Quiz <Award className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* --- 3. COMPLETED SUMMARY DASHBOARD --- */}
        {gameState === "summary" && (
          <motion.div
            key="quiz-summary"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Top Score Overview Card */}
            <div className="bg-white p-8 rounded-[32px] border border-[#e9e2d7] shadow-sm text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#cad2c5]/10 animate-pulse pointer-events-none"></div>
              
              <div className="space-y-4 z-10 relative">
                <div className="w-16 h-16 rounded-full bg-[#52796f] text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#84a98c]">
                    ප්‍රශ්නාවලිය සම්පූර්ණයි (QUIZ COMPLETED)
                  </span>
                  <h2 className="text-3xl font-black text-[#354f52]">
                    Course Score: {score} / {questions.length}
                  </h2>
                </div>

                {/* Score Ratio Gauge */}
                <div className="flex justify-center py-2">
                  <div className="bg-[#f0ede6]/40 border border-[#e9e2d7] rounded-2xl p-4.5 px-8 text-center">
                    <span className="text-4xl font-black text-[#bc6c25] block">
                      {getAccuracyRate()}%
                    </span>
                    <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                      Accuracy Target
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-[#52796f] max-w-lg mx-auto bg-[#fdfbf7] p-3.5 border border-[#e9e2d7] rounded-xl leading-relaxed">
                  {getSinhalaMotivationMessage(getAccuracyRate())}
                </p>

                {maxStreak >= 4 && (
                  <p className="text-xs text-[#bc6c25] font-bold">
                    🔥 Max Streak: <strong>{maxStreak} consecutive</strong> correct answers! Excellent focus!
                  </p>
                )}
              </div>
            </div>

            {/* Answer Breakdown Details (Accordion style with incorrect answers) */}
            <div className="bg-white p-6 rounded-[24px] border border-[#e9e2d7] shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-[#354f52] border-b border-[#f0ede6] pb-3 flex items-center gap-2">
                📝 Questions Review breakdown (වැරදුණු ප්‍රශ්න නැවත බැලීම)
              </h3>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {history.map((record, hIdx) => (
                  <div
                    key={hIdx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3.5 ${
                      record.isCorrect
                        ? "bg-[#cad2c5]/20 border-[#52796f]/30"
                        : "bg-[#ece2d0]/40 border-[#bc6c25]/30"
                    }`}
                  >
                    <span className="mt-0.5">
                      {record.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#52796f]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#bc6c25]" />
                      )}
                    </span>

                    <div className="flex-1 text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#354f52]">Q{hIdx + 1}: {record.questionPrompt}</span>
                        {/* Pronunciation for Japanese */}
                        {(quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading" || quizMode === "japanese_adj_sinhala") && (
                          <button
                            type="button"
                            onClick={() => speakJapanese(record.questionPrompt)}
                            className="p-0.5 text-[#52796f] hover:bg-white rounded"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px] leading-relaxed">
                        <p className="text-slate-500">
                          Your Choice: <strong className={record.isCorrect ? "text-[#52796f]" : "text-[#bc6c25]"}>{record.userChoice}</strong>
                        </p>
                        <p className="text-[#52796f] font-semibold">
                          Correct Answer: <strong>{record.correctAnswer}</strong>
                        </p>
                      </div>

                      {/* Add meanings */}
                      <p className="text-[10px] text-slate-400">
                        {"englishMeaning" in record.originalItem ? (
                          <>
                            Sinhala: {(record.originalItem as KanjiCard).sinhalaMeaning} | Furigana: {(record.originalItem as KanjiCard).furigana}
                          </>
                        ) : "masu" in record.originalItem ? (
                          <>
                            Masu: {(record.originalItem as JFTVerb).masu} | Dict: {(record.originalItem as JFTVerb).dictionary}
                          </>
                        ) : (
                          <>
                            Type: {(record.originalItem as JFTAdjective).type === "i" ? "i-Adjective" : "na-Adjective"} | Hiragana: {(record.originalItem as JFTAdjective).hiragana}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back action controls */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGameState("setup")}
                className="py-3 bg-white border border-[#e9e2d7] hover:bg-[#fdfbf7] text-[#52796f] font-black rounded-xl text-xs transition inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Change Quiz Mode
              </button>
              
              <button
                type="button"
                onClick={startQuiz}
                className="py-3 bg-[#52796f] hover:bg-[#354f52] text-white font-black rounded-xl text-xs transition inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Try Again (නැවත කරන්න)
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
