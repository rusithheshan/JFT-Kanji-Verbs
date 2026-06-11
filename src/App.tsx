import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  FileText,
  Plus,
  RotateCcw,
  Search,
  Upload,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertCircle,
  Zap,
  Languages,
  HelpCircle,
  BookMarked,
  BarChart4,
  Timer,
  Play,
  Pause,
  Award,
  Coffee,
  Brain,
  Sun,
  Moon,
  Trophy,
  Download,
  Users,
  Hash
} from "lucide-react";
import { PRELOADED_KANJI, KanjiCard } from "./data/preloadedKanji";
import { LearningStatus, UserProgress } from "./types";
import KanjiCardView from "./components/KanjiCardView";
import { PRELOADED_VERBS, JFTVerb } from "./data/preloadedVerbs";
import VerbCardView from "./components/VerbCardView";
import { PRELOADED_ADJECTIVES, JFTAdjective } from "./data/preloadedAdjectives";
import AdjectiveCardView from "./components/AdjectiveCardView";
import QuizView from "./components/QuizView";
import { PRELOADED_GRAMMAR } from "./data/preloadedGrammar";
import { JFTGrammar } from "./types";
import GrammarCardView from "./components/GrammarCardView";
import DictionaryView from "./components/DictionaryView";
import StatisticsView from "./components/StatisticsView";
import AlphabetView from "./components/AlphabetView";
import { preloadedCounters, CounterItem } from "./data/preloadedCounters";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"alphabet" | "learn" | "test" | "verbs" | "adjectives" | "grammar" | "quiz" | "dictionary" | "stats" | "counters">("alphabet");

  // Supporting unified nested Study vs Test mode for JFT Kanji (matching Verbs/Adjectives)
  const [kanjiViewMode, setKanjiViewMode] = useState<"learn" | "test">("learn");

  // Always use cozy light theme based on user requirements "Kalin thibba widiya thamai set wenne"
  const theme = "light";

  // Verbs and Adjectives course view formats (learn lists vs. SRS test decks)
  const [verbsViewMode, setVerbsViewMode] = useState<"learn" | "test">("learn");
  const [verbTestDeck, setVerbTestDeck] = useState<JFTVerb[]>([]);
  const [currentVerbTestIndex, setCurrentVerbTestIndex] = useState(0);
  const [isVerbTestCardRevealed, setIsVerbTestCardRevealed] = useState(false);

  const [adjectivesViewMode, setAdjectivesViewMode] = useState<"learn" | "test">("learn");
  const [adjTestDeck, setAdjTestDeck] = useState<JFTAdjective[]>([]);
  const [currentAdjTestIndex, setCurrentAdjTestIndex] = useState(0);
  const [isAdjTestCardRevealed, setIsAdjTestCardRevealed] = useState(false);

  // Pomodoro study timer states
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(() => {
    return Number(localStorage.getItem("jft_focus_duration") || "60");
  });
  
  const [pomodoroSeconds, setPomodoroSeconds] = useState(() => {
    const mins = Number(localStorage.getItem("jft_focus_duration") || "60");
    return mins * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [totalSessionStudyTime, setTotalSessionStudyTime] = useState(() => {
    return Number(sessionStorage.getItem("jft_total_session_study_time") || "0");
  });

  // Mobile navigation menu show/hide toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Daily study progress & targets and sync status
  const [dailyGoalToggle, setDailyGoalToggle] = useState(() => {
    return Number(localStorage.getItem("jft_daily_study_goal") || "20");
  });
  const [studiedTodayCount, setStudiedTodayCount] = useState(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem("jft_study_activity_log");
      if (saved) {
        const log = JSON.parse(saved);
        return log[today] || 0;
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  // Pomodoro ticking effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            const nextMode = pomodoroMode === "focus" ? "break" : "focus";
            setPomodoroMode(nextMode);
            return nextMode === "focus" ? focusDurationMinutes * 60 : 5 * 60;
          }
          return prev - 1;
        });

        // Increment session focus study seconds
        if (pomodoroMode === "focus") {
          setTotalSessionStudyTime((prevTime) => {
            const newTime = prevTime + 1;
            sessionStorage.setItem("jft_total_session_study_time", String(newTime));
            return newTime;
          });
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, pomodoroMode, focusDurationMinutes]);

  // Sync daily study settings across views and storage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGoal = Number(localStorage.getItem("jft_daily_study_goal") || "20");
      setDailyGoalToggle(savedGoal);
      
      const today = new Date().toISOString().split("T")[0];
      try {
        const savedLog = localStorage.getItem("jft_study_activity_log");
        if (savedLog) {
          const log = JSON.parse(savedLog);
          setStudiedTodayCount(log[today] || 0);
        }
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("jft_goal_changed", handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("jft_goal_changed", handleStorageChange as EventListener);
    };
  }, []);

  // Main Kanji Deck State (Preloaded base cards + any PDF parsed results + custom AI generated ones)
  const [cards, setCards] = useState<KanjiCard[]>(() => {
    const saved = localStorage.getItem("jft_kanji_cards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= PRELOADED_KANJI.length) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved cards, reverting to preloaded base.");
      }
    }
    return PRELOADED_KANJI;
  });

  // Learning Progress mapping card ID -> Tracking Status ("OK" | "NOT_YET" | "UNSTUDIED")
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("jft_kanji_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // SRS (SM-2) algorithm tracking records
  const [srsRecords, setSrsRecords] = useState<{
    [key: string]: { repetitions: number; interval: number; efactor: number; incorrectCount: number };
  }>(() => {
    try {
      const saved = localStorage.getItem("jft_kanji_srs");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {};
  });

  // Search, Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");
  const [visibleKanjiCount, setVisibleKanjiCount] = useState(16);

  // Focus Modes / Focus Overlay
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  // Testing/Assess Mode states
  const [testDeck, setTestDeck] = useState<KanjiCard[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isTestCardRevealed, setIsTestCardRevealed] = useState(false);

  // Core Custom Kanji adding form input state
  const [customKanjiInput, setCustomKanjiInput] = useState("");
  const [isGeneratingCustomCard, setIsGeneratingCustomCard] = useState(false);

  // PDF Parser drag and drop upload states
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfParsingError, setPdfParsingError] = useState("");
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState("");

  // JFT Verbs State
  const [verbs] = useState<JFTVerb[]>(PRELOADED_VERBS);
  const [verbsProgress, setVerbsProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("jft_verbs_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Verbs search, filter states
  const [verbsSearchQuery, setVerbsSearchQuery] = useState("");
  const [activeVerbsFilter, setActiveVerbsFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");
  const [verbsPracticePerspective, setVerbsPracticePerspective] = useState<"sinhala" | "japanese">("japanese");
  const [visibleVerbsCount, setVisibleVerbsCount] = useState(16);

  // JFT Adjectives State
  const [adjectives] = useState<JFTAdjective[]>(PRELOADED_ADJECTIVES);
  const [adjectivesProgress, setAdjectivesProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("jft_adjectives_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Adjectives search, filter states
  const [adjectivesSearchQuery, setAdjectivesSearchQuery] = useState("");
  const [activeAdjectivesFilter, setActiveAdjectivesFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");
  const [activeAdjectiveTypeFilter, setActiveAdjectiveTypeFilter] = useState<"ALL" | "I" | "NA">("ALL");
  const [adjectivesPracticePerspective, setAdjectivesPracticePerspective] = useState<"sinhala" | "japanese">("japanese");

  // JFT Counting Systems / Counters State
  const [counters] = useState<CounterItem[]>(preloadedCounters);
  const [countersProgress, setCountersProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("jft_counters_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  const [countersViewMode, setCountersViewMode] = useState<"learn" | "test">("learn");
  const [countersSearchQuery, setCountersSearchQuery] = useState("");
  const [activeCountersFilter, setActiveCountersFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");

  // counters quiz session states
  const [countersQuizOption, setCountersQuizOption] = useState<"sinhala" | "japanese" | "relationship">("sinhala");
  const [countersQuizDeck, setCountersQuizDeck] = useState<ControlQuizQuestion[]>([]);
  interface ControlQuizQuestion {
    counterId: string;
    description: string;
    correctAnswer: string;
    choices: string[];
  }
  const [currentCountersQuizIndex, setCurrentCountersQuizIndex] = useState(0);
  const [selectedCountersChoice, setSelectedCountersChoice] = useState<string | null>(null);
  const [hasSubmittedCountersQuiz, setHasSubmittedCountersQuiz] = useState(false);
  const [countersQuizScore, setCountersQuizScore] = useState(0);

  // JFT Grammar State
  const [grammarList] = useState<JFTGrammar[]>(PRELOADED_GRAMMAR);
  const [grammarProgress, setGrammarProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("jft_grammar_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Grammar search, filter states
  const [grammarSearchQuery, setGrammarSearchQuery] = useState("");
  const [activeGrammarFilter, setActiveGrammarFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");

  useEffect(() => {
    setVisibleKanjiCount(16);
  }, [searchQuery, activeFilter, activeTab]);

  useEffect(() => {
    setVisibleVerbsCount(16);
  }, [verbsSearchQuery, activeVerbsFilter, activeTab]);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem("jft_kanji_cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("jft_kanji_progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("jft_verbs_progress", JSON.stringify(verbsProgress));
  }, [verbsProgress]);

  useEffect(() => {
    localStorage.setItem("jft_adjectives_progress", JSON.stringify(adjectivesProgress));
  }, [adjectivesProgress]);

  useEffect(() => {
    localStorage.setItem("jft_grammar_progress", JSON.stringify(grammarProgress));
  }, [grammarProgress]);

  useEffect(() => {
    localStorage.setItem("jft_counters_progress", JSON.stringify(countersProgress));
  }, [countersProgress]);

  useEffect(() => {
    localStorage.setItem("jft_kanji_srs", JSON.stringify(srsRecords));
  }, [srsRecords]);

  // Set up testing/shuffled deck whenever we enter knowledge check mode or cards list updates
  useEffect(() => {
    if (activeTab === "test" || (activeTab === "learn" && kanjiViewMode === "test")) {
      shuffleTestDeck();
    }
  }, [activeTab, kanjiViewMode]);

  const shuffleTestDeck = () => {
    // 1. Random shuffle all loaded cards first using Fisher-Yates
    const deck = [...cards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // 2. Sort the shuffled array by SRS-priority index (descending priority)
    // This biases cards the user struggles with or gets wrong to show up much earlier
    deck.sort((a, b) => {
      const srsA = srsRecords[a.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      const srsB = srsRecords[b.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      
      const statusA = progress[a.id] || "UNSTUDIED";
      const statusB = progress[b.id] || "UNSTUDIED";

      // Higher weight to problematic status
      const statusWeightA = statusA === "NOT_YET" ? 150 : statusA === "UNSTUDIED" ? 50 : 0;
      const statusWeightB = statusB === "NOT_YET" ? 150 : statusB === "UNSTUDIED" ? 50 : 0;

      // Score formula combining user mistakes, lower easiness (efactor), higher weight, and lower repetitions
      const scoreA = statusWeightA + 
                     (srsA.incorrectCount * 60) + 
                     ((3.0 - srsA.efactor) * 80) - 
                     (srsA.repetitions * 15) - 
                     (srsA.interval * 5) + 
                     (Math.random() * 40); // 40pts of random jitter to keep deck shuffling fresh

      const scoreB = statusWeightB + 
                     (srsB.incorrectCount * 60) + 
                     ((3.0 - srsB.efactor) * 80) - 
                     (srsB.repetitions * 15) - 
                     (srsB.interval * 5) + 
                     (Math.random() * 40);

      return scoreB - scoreA; // Descending sort
    });

    setTestDeck(deck);
    setCurrentTestIndex(0);
    setIsTestCardRevealed(false);
  };

  // Set up testing/shuffled deck whenever we enter verbs test mode
  useEffect(() => {
    if (activeTab === "verbs" && verbsViewMode === "test") {
      shuffleVerbTestDeck();
    }
  }, [activeTab, verbsViewMode]);

  const shuffleVerbTestDeck = () => {
    const deck = [...verbs];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    deck.sort((a, b) => {
      const srsA = srsRecords[a.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      const srsB = srsRecords[b.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      
      const statusA = verbsProgress[a.id] || "UNSTUDIED";
      const statusB = verbsProgress[b.id] || "UNSTUDIED";

      const statusWeightA = statusA === "NOT_YET" ? 150 : statusA === "UNSTUDIED" ? 50 : 0;
      const statusWeightB = statusB === "NOT_YET" ? 150 : statusB === "UNSTUDIED" ? 50 : 0;

      const scoreA = statusWeightA + 
                     (srsA.incorrectCount * 60) + 
                     ((3.0 - srsA.efactor) * 80) - 
                     (srsA.repetitions * 15) - 
                     (srsA.interval * 5) + 
                     (Math.random() * 40);

      const scoreB = statusWeightB + 
                     (srsB.incorrectCount * 60) + 
                     ((3.0 - srsB.efactor) * 80) - 
                     (srsB.repetitions * 15) - 
                     (srsB.interval * 5) + 
                     (Math.random() * 40);

      return scoreB - scoreA;
    });

    setVerbTestDeck(deck);
    setCurrentVerbTestIndex(0);
    setIsVerbTestCardRevealed(false);
  };

  // Set up testing/shuffled deck whenever we enter adjectives test mode
  useEffect(() => {
    if (activeTab === "adjectives" && adjectivesViewMode === "test") {
      shuffleAdjTestDeck();
    }
  }, [activeTab, adjectivesViewMode]);

  const shuffleAdjTestDeck = () => {
    const deck = [...adjectives];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    deck.sort((a, b) => {
      const srsA = srsRecords[a.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      const srsB = srsRecords[b.id] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      
      const statusA = adjectivesProgress[a.id] || "UNSTUDIED";
      const statusB = adjectivesProgress[b.id] || "UNSTUDIED";

      const statusWeightA = statusA === "NOT_YET" ? 150 : statusA === "UNSTUDIED" ? 50 : 0;
      const statusWeightB = statusB === "NOT_YET" ? 150 : statusB === "UNSTUDIED" ? 50 : 0;

      const scoreA = statusWeightA + 
                     (srsA.incorrectCount * 60) + 
                     ((3.0 - srsA.efactor) * 80) - 
                     (srsA.repetitions * 15) - 
                     (srsA.interval * 5) + 
                     (Math.random() * 40);

      const scoreB = statusWeightB + 
                     (srsB.incorrectCount * 60) + 
                     ((3.0 - srsB.efactor) * 80) - 
                     (srsB.repetitions * 15) - 
                     (srsB.interval * 5) + 
                     (Math.random() * 40);

      return scoreB - scoreA;
    });

    setAdjTestDeck(deck);
    setCurrentAdjTestIndex(0);
    setIsAdjTestCardRevealed(false);
  };

  const handleUpdateCounterStatus = (id: string, status: "OK" | "NOT_YET") => {
    setCountersProgress((prev) => {
      const updated = { ...prev, [id]: status };
      return updated;
    });
  };

  const handleStartCountersQuiz = (option = countersQuizOption) => {
    const deck: ControlQuizQuestion[] = [];
    
    // For each of the 18 counters:
    for (let i = 0; i < counters.length; i++) {
      const c = counters[i];
      // Pick a random count 1 to 10 or "question"
      // Let's bias: 80% chance of 1-10 count, 20% chance of "question word"
      const isQuestionWord = Math.random() < 0.2;
      let randCount = 1;
      if (isQuestionWord) {
        randCount = 0; // represent questionWord
      } else {
        randCount = Math.floor(Math.random() * 10) + 1; // 1 to 10
      }

      let questionText = "";
      let correctAns = "";
      const allChoicesSet = new Set<string>();

      if (option === "sinhala") {
        // Sinhala Meaning Mode
        if (randCount === 0) {
          questionText = `"${c.questionWordJapanese}" යන්නෙහි නිවැරදි සිංහල තේරුම තෝරන්න.`;
          correctAns = `${c.categorySinhala} (${c.questionWordSinhala})`;
          allChoicesSet.add(correctAns);
          // Distractors: other question words or counter names
          while (allChoicesSet.size < 4) {
            const alternate = counters[Math.floor(Math.random() * counters.length)];
            allChoicesSet.add(`${alternate.categorySinhala} (${alternate.questionWordSinhala})`);
          }
        } else {
          const itemVal = c.numbers[randCount] || c.numbers[1];
          questionText = `ජපන් බසින් "${itemVal.japanese}" යන්නෙහි නිවැරදි සිංහල තේරුම කුමක්ද?`;
          correctAns = `${c.categorySinhala} - ${randCount}ක්`;
          allChoicesSet.add(correctAns);
          while (allChoicesSet.size < 4) {
            const alternate = counters[Math.floor(Math.random() * counters.length)];
            allChoicesSet.add(`${alternate.categorySinhala} - ${randCount}ක්`);
          }
        }
      } else if (option === "japanese") {
        // Japanese Counter Word Mode
        if (randCount === 0) {
          questionText = `"${c.categorySinhala} (${c.categoryEnglish})" සඳහා කීයක්ද / කීදෙනෙක්ද කියා ඇසීමට යොදාගන්නා Question Word එක කුමක්ද?`;
          correctAns = `${c.questionWordJapanese} (${c.questionWordRomaji})`;
          allChoicesSet.add(correctAns);
          while (allChoicesSet.size < 4) {
            const alternate = counters[Math.floor(Math.random() * counters.length)];
            allChoicesSet.add(`${alternate.questionWordJapanese} (${alternate.questionWordRomaji})`);
          }
        } else {
          const itemVal = c.numbers[randCount] || c.numbers[1];
          questionText = `"${c.categorySinhala} ${randCount}ක්" සඳහා නිවැරදි ජපන් පසු යෙදුම් පදය කුමක්ද?`;
          correctAns = `${itemVal.japanese} (${itemVal.romaji})`;
          allChoicesSet.add(correctAns);
          while (allChoicesSet.size < 4) {
            const alternate = counters[Math.floor(Math.random() * counters.length)];
            const randAltNum = Math.floor(Math.random() * 10) + 1;
            const altVal = alternate.numbers[randAltNum] || alternate.numbers[randCount] || alternate.numbers[1];
            allChoicesSet.add(`${altVal.japanese} (${altVal.romaji})`);
          }
        }
      } else {
        // Relationship Mode
        questionText = `පහත සඳහන් ජපන් පසු යෙදුම (Counter Character) "${c.counterChar}" (${c.hiraganaChar}) භාවිතා කරන්නේ කුමක් සඳහාද?`;
        correctAns = `${c.categorySinhala} (${c.categoryEnglish})`;
        allChoicesSet.add(correctAns);
        while (allChoicesSet.size < 4) {
          const alternate = counters[Math.floor(Math.random() * counters.length)];
          allChoicesSet.add(`${alternate.categorySinhala} (${alternate.categoryEnglish})`);
        }
      }

      const choicesArr = Array.from(allChoicesSet);
      // Shuffle choices array using standard Fisher-Yates
      for (let k = choicesArr.length - 1; k > 0; k--) {
        const rIndex = Math.floor(Math.random() * (k + 1));
        [choicesArr[k], choicesArr[rIndex]] = [choicesArr[rIndex], choicesArr[k]];
      }

      deck.push({
        counterId: c.id,
        description: questionText,
        correctAnswer: correctAns,
        choices: choicesArr
      });
    }

    // Shuffle the entire deck of 18 questions so it's beautifully mixed
    for (let k = deck.length - 1; k > 0; k--) {
      const rIndex = Math.floor(Math.random() * (k + 1));
      [deck[k], deck[rIndex]] = [deck[rIndex], deck[k]];
    }

    setCountersQuizDeck(deck);
    setCurrentCountersQuizIndex(0);
    setSelectedCountersChoice(null);
    setHasSubmittedCountersQuiz(false);
    setCountersQuizScore(0);
  };

  useEffect(() => {
    if (activeTab === "counters" && countersViewMode === "test") {
      handleStartCountersQuiz(countersQuizOption);
    }
  }, [activeTab, countersViewMode, countersQuizOption]);

  // SM-2 Spaced Repetition core updater
  const updateCardSRS = (cardId: string, gotCorrect: boolean) => {
    setSrsRecords((prev) => {
      const current = prev[cardId] || { repetitions: 0, interval: 1, efactor: 2.5, incorrectCount: 0 };
      let reps = current.repetitions;
      let interval = current.interval;
      let ef = current.efactor;
      let incorrectVal = current.incorrectCount;

      if (gotCorrect) {
        const q = 5;
        if (reps === 0) {
          interval = 1;
        } else if (reps === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * ef);
        }
        reps += 1;
        ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      } else {
        const q = 1;
        reps = 0;
        interval = 1;
        incorrectVal += 1;
        ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      }

      if (ef < 1.3) ef = 1.3;
      if (ef > 3.0) ef = 3.0;

      return {
        ...prev,
        [cardId]: {
          repetitions: reps,
          interval: interval,
          efactor: Number(ef.toFixed(3)),
          incorrectCount: incorrectVal
        }
      };
    });
  };

  // Track study interactions in activity log
  const recordStudyActivity = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem("jft_study_activity_log");
      let log: { [key: string]: number } = {};
      if (saved) {
        log = JSON.parse(saved);
      }
      const newCount = (log[today] || 0) + 1;
      log[today] = newCount;
      localStorage.setItem("jft_study_activity_log", JSON.stringify(log));

      // Update active state triggers
      setStudiedTodayCount(newCount);

      // Trigger standard count inside current session
      const currentSessionCount = Number(sessionStorage.getItem("jft_current_session_count") || "0") + 1;
      sessionStorage.setItem("jft_current_session_count", String(currentSessionCount));
    } catch (e) {
      console.error("Failed to record study activity", e);
    }
  };

  // --- Client JWT parser for Google authentication ---
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // --- User Profile & Scoreboard Leaderboard States ---
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    avatar: string;
    joinedAt: string;
  } | null>(() => {
    const saved = localStorage.getItem("jft_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  // Load backend shared leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setIsLeaderboardLoading(true);
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Error loaded leaderboard:", e);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  const loadProfileAndProgressFromServer = async (email: string) => {
    try {
      const res = await fetch(`/api/profile/get?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.profile) {
          const prof = data.profile;
          if (prof.kanjiProgressMap) {
            setProgress(prof.kanjiProgressMap);
            localStorage.setItem("jft_kanji_progress", JSON.stringify(prof.kanjiProgressMap));
          }
          if (prof.verbsProgressMap) {
            setVerbsProgress(prof.verbsProgressMap);
            localStorage.setItem("jft_verbs_progress", JSON.stringify(prof.verbsProgressMap));
          }
          if (prof.adjectivesProgressMap) {
            setAdjectivesProgress(prof.adjectivesProgressMap);
            localStorage.setItem("jft_adjectives_progress", JSON.stringify(prof.adjectivesProgressMap));
          }
          if (prof.grammarProgressMap) {
            setGrammarProgress(prof.grammarProgressMap);
            localStorage.setItem("jft_grammar_progress", JSON.stringify(prof.grammarProgressMap));
          }
          if (prof.countersProgressMap) {
            setCountersProgress(prof.countersProgressMap);
            localStorage.setItem("jft_counters_progress", JSON.stringify(prof.countersProgressMap));
          }
          return prof;
        }
      }
    } catch (e) {
      console.error("Failed to fetch profile saved progress:", e);
    }
    return null;
  };

  // Sync profile progress counts and full maps with server database
  const syncProfileWithServer = async (
    profile = userProfile,
    kanjis = progress,
    vProgress = verbsProgress,
    aProgress = adjectivesProgress,
    gProgress = grammarProgress,
    cProgress = countersProgress
  ) => {
    if (!profile) return;
    try {
      const kCount = Object.values(kanjis).filter((s) => s === "OK").length;
      const vCount = Object.values(vProgress).filter((s) => s === "OK").length;
      const aCount = Object.values(aProgress).filter((s) => s === "OK").length;
      const gCount = Object.values(gProgress).filter((s) => s === "OK").length;
      const cCount = Object.values(cProgress).filter((s) => s === "OK").length;

      await fetch("/api/profile/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          username: profile.username,
          avatar: profile.avatar,
          kanjiProgress: kCount,
          verbsProgress: vCount,
          adjectivesProgress: aCount,
          grammarProgress: gCount,
          countersProgress: cCount,
          kanjiProgressMap: kanjis,
          verbsProgressMap: vProgress,
          adjectivesProgressMap: aProgress,
          grammarProgressMap: gProgress,
          countersProgressMap: cProgress
        }),
      });
      // Fetch latest leaderboard
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Failed to sync progress with leaderboard:", e);
    }
  };

  // Sync profile state changes to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("jft_user_profile", JSON.stringify(userProfile));
      syncProfileWithServer(userProfile);
    } else {
      localStorage.removeItem("jft_user_profile");
    }
  }, [userProfile]);

  const [authError, setAuthError] = useState<string | null>(null);

  // Safe helper to hash email to hide it from DevTools/public payload while keeping comparisons working
  const hashEmailSafe = (email: string): string => {
    if (!email) return "anonymous";
    let hash = 0;
    const lower = email.trim().toLowerCase();
    for (let i = 0; i < lower.length; i++) {
      hash = (hash << 5) - hash + lower.charCodeAt(i);
      hash |= 0;
    }
    return "u_" + Math.abs(hash);
  };

  // Handle backend initialization
  useEffect(() => {
    fetchLeaderboard();
    if (userProfile && userProfile.email) {
      loadProfileAndProgressFromServer(userProfile.email);
    }
  }, []);

  // Sync progress shifts with leaderboard server after slight delays
  useEffect(() => {
    if (userProfile) {
      const timer = setTimeout(() => {
        syncProfileWithServer(userProfile);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress, verbsProgress, adjectivesProgress, grammarProgress, countersProgress]);

  // Export full study records to a backup file
  const downloadProgressJSON = () => {
    try {
      const backupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        userProfile,
        progress,
        verbsProgress,
        adjectivesProgress,
        grammarProgress,
        srsRecords,
        cards,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jft_japanese_progress_${userProfile ? userProfile.username.replace(/\s+/g, "_") : "guest"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("දත්ත බාගත කිරීමට නොහැකි විය. Backup failed.");
    }
  };

  // Import full progress from backup file
  const handleRestoreProgressJSON = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        if (!backup || typeof backup !== "object") {
          throw new Error("Invalid backup format");
        }

        if (backup.userProfile) setUserProfile(backup.userProfile);
        if (backup.progress) setProgress(backup.progress);
        if (backup.verbsProgress) setVerbsProgress(backup.verbsProgress);
        if (backup.adjectivesProgress) setAdjectivesProgress(backup.adjectivesProgress);
        if (backup.grammarProgress) setGrammarProgress(backup.grammarProgress);
        if (backup.srsRecords) setSrsRecords(backup.srsRecords);
        if (backup.cards) setCards(backup.cards);

        alert("🎉 ඔබගේ දත්ත සාර්ථකව ප්‍රතිෂ්ඨාපනය (Restored) කරන ලදී!");

        if (backup.userProfile) {
          syncProfileWithServer(
            backup.userProfile,
            backup.progress || {},
            backup.verbsProgress || {},
            backup.adjectivesProgress || {},
            backup.grammarProgress || {}
          );
        }
      } catch (err) {
        alert("❌ වලංගු නොවන උපස්ථ ගොනුවකි (Invalid JSON file).");
      }
    };
    reader.readAsText(file);
  };

  // Update a card progress status
  const [lastSrsUpdate, setLastSrsUpdate] = useState<{ [key: string]: number }>({});

  const handleUpdateStatus = (cardId: string, status: LearningStatus) => {
    setProgress((prev) => ({
      ...prev,
      [cardId]: status,
    }));
    recordStudyActivity();

    // Prevent duplicate updates within a short frame
    const now = Date.now();
    if (status !== "UNSTUDIED") {
      setLastSrsUpdate((prevMap) => {
        const lastTime = prevMap[cardId] || 0;
        if (now - lastTime > 600) {
          updateCardSRS(cardId, status === "OK");
          return { ...prevMap, [cardId]: now };
        }
        return prevMap;
      });
    }
  };

  // Update a verb progress status
  const handleUpdateVerbStatus = (verbId: string, status: LearningStatus) => {
    setVerbsProgress((prev) => ({
      ...prev,
      [verbId]: status,
    }));
    recordStudyActivity();

    // Prevent duplicate updates within a short frame
    const now = Date.now();
    if (status !== "UNSTUDIED") {
      setLastSrsUpdate((prevMap) => {
        const lastTime = prevMap[verbId] || 0;
        if (now - lastTime > 600) {
          updateCardSRS(verbId, status === "OK");
          return { ...prevMap, [verbId]: now };
        }
        return prevMap;
      });
    }
  };

  // Update an adjective progress status
  const handleUpdateAdjectiveStatus = (adjId: string, status: LearningStatus) => {
    setAdjectivesProgress((prev) => ({
      ...prev,
      [adjId]: status,
    }));
    recordStudyActivity();

    // Prevent duplicate updates within a short frame
    const now = Date.now();
    if (status !== "UNSTUDIED") {
      setLastSrsUpdate((prevMap) => {
        const lastTime = prevMap[adjId] || 0;
        if (now - lastTime > 600) {
          updateCardSRS(adjId, status === "OK");
          return { ...prevMap, [adjId]: now };
        }
        return prevMap;
      });
    }
  };

  // Update a grammar progress status
  const handleUpdateGrammarStatus = (grammarId: string, status: LearningStatus) => {
    setGrammarProgress((prev) => ({
      ...prev,
      [grammarId]: status,
    }));
    recordStudyActivity();
  };

  // Quick reset metrics
  const handleResetProgress = () => {
    if (window.confirm("සැබවින්ම දත්ත මකාදමා නැවත මුල සිට ආරම්භ කිරීමට අවශ්‍ය ද? Reset learning progress data?")) {
      setProgress({});
    }
  };

  // Reset verbs learning progress
  const handleResetVerbsProgress = () => {
    if (window.confirm("සැබවින්ම ක්‍රියාපද ප්‍රගති දත්ත මකාදමා නැවත මුල සිට ආරම්භ කිරීමට අවශ්‍ය ද? Reset verbs learning progress data?")) {
      setVerbsProgress({});
      localStorage.removeItem("jft_verbs_progress");
    }
  };

  // Reset adjectives learning progress
  const handleResetAdjectivesProgress = () => {
    if (window.confirm("සැබවින්ම විශේෂණ පද ප්‍රගති දත්ත මකාදමා නැවත මුල සිට ආරම්භ කිරීමට අවශ්‍ය ද? Reset adjectives learning progress data?")) {
      setAdjectivesProgress({});
      localStorage.removeItem("jft_adjectives_progress");
    }
  };

  // Reset grammar learning progress
  const handleResetGrammarProgress = () => {
    if (window.confirm("සැබවින්ම ව්‍යාකරණ ප්‍රගති දත්ත මකාදමා නැවත මුල සිට ආරම්භ කිරීමට අවශ්‍ය ද? Reset grammar learning progress data?")) {
      setGrammarProgress({});
      localStorage.removeItem("jft_grammar_progress");
    }
  };

  // Reset counters learning progress
  const handleResetCountersProgress = () => {
    if (window.confirm("සැබවින්ම ගණන් කිරීමේ පසු යෙදුම් ප්‍රගති දත්ත මකාදමා නැවත මුල සිට ආරම්භ කිරීමට අවශ්‍ය ද? Reset counting systems learning progress data?")) {
      setCountersProgress({});
      localStorage.removeItem("jft_counters_progress");
    }
  };

  // Reset entire card list to factory base
  const handleResetAllToFactory = () => {
    if (window.confirm("නැවත ප්‍රධාන JFT-Basic Kanji 450 කාඩ්පත් ලැයිස්තුව ලෝඩ් කිරීමට ඔබට අවශ්‍ය ද? Reset to base 450 Kanji list? (Custom changes will be cleared)")) {
      setCards(PRELOADED_KANJI);
      setProgress({});
      localStorage.removeItem("jft_kanji_cards");
      localStorage.removeItem("jft_kanji_progress");
    }
  };

  // Trigger individual Kanji extraction via Gemini AI
  const handleAddCustomKanji = async (e: FormEvent) => {
    e.preventDefault();
    if (!customKanjiInput.trim()) return;

    setIsGeneratingCustomCard(true);
    setPdfParsingError("");
    setPdfSuccessMessage("");

    try {
      const response = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanji: customKanjiInput.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate custom card");
      }

      const newCard: KanjiCard = await response.json();

      // Check if duplicate
      if (cards.some((c) => c.kanji === newCard.kanji)) {
        throw new Error(`Kanji "${newCard.kanji}" is already in your study deck.`);
      }

      setCards((prev) => [newCard, ...prev]);
      setCustomKanjiInput("");
      setPdfSuccessMessage(`Successfully created high quality card for "${newCard.kanji}"!`);
      
      // Auto highlight new card
      setActiveFilter("ALL");
      setSearchQuery(newCard.kanji);
    } catch (err: any) {
      setPdfParsingError(err.message || "Something went wrong during Kanji detail extraction.");
    } finally {
      setIsGeneratingCustomCard(false);
    }
  };

  // PDF drag and drop handler using base64 extraction & Express proxy
  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdfParsingError("Please select a valid PDF file (.pdf extensions only).");
      return;
    }

    setIsUploadingPdf(true);
    setPdfParsingError("");
    setPdfSuccessMessage("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        // Trim standard base64 meta header
        const rawBase64 = base64Data.split(",")[1];

        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: rawBase64 }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "PDF parsing failed");
        }

        const data = await response.json();
        if (data.cards && data.cards.length > 0) {
          // Merge parsed cards
          setCards((prev) => {
            const existingKanjis = new Set(prev.map((c) => c.kanji));
            const uniqueNew = data.cards.filter((newCard: KanjiCard) => !existingKanjis.has(newCard.kanji));
            return [...prev, ...uniqueNew];
          });
          setPdfSuccessMessage(`Gemini parsed successfully! Added ${data.cards.length} structured Kanji cards into your dashboard context.`);
        } else {
          throw new Error("No readable study cards were parsed by the Gemini model.");
        }
      };
    } catch (err: any) {
      setPdfParsingError(err.message || "Failed to parse study PDF list.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Filtering criteria (optimized via useMemo)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const cardStatus = progress[card.id] || "UNSTUDIED";
      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "NOT_YET" && cardStatus === "NOT_YET") ||
        (activeFilter === "OK" && cardStatus === "OK");

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        card.kanji.toLowerCase().includes(query) ||
        card.furigana.toLowerCase().includes(query) ||
        card.englishMeaning.toLowerCase().includes(query) ||
        card.sinhalaMeaning.toLowerCase().includes(query) ||
        card.onyomi.toLowerCase().includes(query) ||
        card.kunyomi.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [cards, progress, activeFilter, searchQuery]);

  // Calculate scores/ratios (optimized via useMemo)
  const { okCount, notYetCount, percentComplete } = useMemo(() => {
    const ok = cards.reduce((sum, card) => (progress[card.id] === "OK" ? sum + 1 : sum), 0);
    const notYet = cards.reduce((sum, card) => (progress[card.id] === "NOT_YET" ? sum + 1 : sum), 0);
    const percent = cards.length > 0 ? Math.round((ok / cards.length) * 100) : 0;
    return { okCount: ok, notYetCount: notYet, percentComplete: percent };
  }, [cards, progress]);

  // Verb scores/ratios and filtering (optimized via useMemo)
  const { okVerbsCount, notYetVerbsCount, percentVerbsComplete } = useMemo(() => {
    const ok = verbs.reduce((sum, v) => (verbsProgress[v.id] === "OK" ? sum + 1 : sum), 0);
    const notYet = verbs.reduce((sum, v) => (verbsProgress[v.id] === "NOT_YET" ? sum + 1 : sum), 0);
    const percent = verbs.length > 0 ? Math.round((ok / verbs.length) * 100) : 0;
    return { okVerbsCount: ok, notYetVerbsCount: notYet, percentVerbsComplete: percent };
  }, [verbs, verbsProgress]);

  const filteredVerbs = useMemo(() => {
    return verbs.filter((verb) => {
      const cardStatus = verbsProgress[verb.id] || "UNSTUDIED";
      const matchesFilter =
        activeVerbsFilter === "ALL" ||
        (activeVerbsFilter === "NOT_YET" && cardStatus === "NOT_YET") ||
        (activeVerbsFilter === "OK" && cardStatus === "OK");

      const query = verbsSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        verb.sinhalaMeaning.toLowerCase().includes(query) ||
        verb.kanji.toLowerCase().includes(query) ||
        verb.furigana.toLowerCase().includes(query) ||
        verb.masu.toLowerCase().includes(query) ||
        verb.dictionary.toLowerCase().includes(query) ||
        verb.te.toLowerCase().includes(query) ||
        verb.ta.toLowerCase().includes(query) ||
        verb.nai.toLowerCase().includes(query) ||
        verb.nakatta.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [verbs, verbsProgress, activeVerbsFilter, verbsSearchQuery]);

  // Adjective scores/ratios and filtering (optimized via useMemo)
  const { okAdjectivesCount, notYetAdjectivesCount, percentAdjectivesComplete } = useMemo(() => {
    const ok = adjectives.reduce((sum, a) => (adjectivesProgress[a.id] === "OK" ? sum + 1 : sum), 0);
    const notYet = adjectives.reduce((sum, a) => (adjectivesProgress[a.id] === "NOT_YET" ? sum + 1 : sum), 0);
    const percent = adjectives.length > 0 ? Math.round((ok / adjectives.length) * 100) : 0;
    return { okAdjectivesCount: ok, notYetAdjectivesCount: notYet, percentAdjectivesComplete: percent };
  }, [adjectives, adjectivesProgress]);

  const filteredAdjectives = useMemo(() => {
    return adjectives.filter((adj) => {
      const cardStatus = adjectivesProgress[adj.id] || "UNSTUDIED";
      const matchesStatus =
        activeAdjectivesFilter === "ALL" ||
        (activeAdjectivesFilter === "NOT_YET" && cardStatus === "NOT_YET") ||
        (activeAdjectivesFilter === "OK" && cardStatus === "OK");

      const matchesType =
        activeAdjectiveTypeFilter === "ALL" ||
        (activeAdjectiveTypeFilter === "I" && adj.type === "i") ||
        (activeAdjectiveTypeFilter === "NA" && adj.type === "na");

      const query = adjectivesSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        adj.sinhalaMeaning.toLowerCase().includes(query) ||
        adj.kanji.toLowerCase().includes(query) ||
        adj.hiragana.toLowerCase().includes(query);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [adjectives, adjectivesProgress, activeAdjectivesFilter, activeAdjectiveTypeFilter, adjectivesSearchQuery]);

  // Grammar scores/ratios and filtering (optimized via useMemo)
  const { okGrammarCount, notYetGrammarCount, percentGrammarComplete } = useMemo(() => {
    const ok = grammarList.reduce((sum, g) => (grammarProgress[g.id] === "OK" ? sum + 1 : sum), 0);
    const notYet = grammarList.reduce((sum, g) => (grammarProgress[g.id] === "NOT_YET" ? sum + 1 : sum), 0);
    const percent = grammarList.length > 0 ? Math.round((ok / grammarList.length) * 100) : 0;
    return { okGrammarCount: ok, notYetGrammarCount: notYet, percentGrammarComplete: percent };
  }, [grammarList, grammarProgress]);

  const filteredGrammars = useMemo(() => {
    return grammarList.filter((grammar) => {
      const cardStatus = grammarProgress[grammar.id] || "UNSTUDIED";
      const matchesFilter =
        activeGrammarFilter === "ALL" ||
        (activeGrammarFilter === "NOT_YET" && cardStatus === "NOT_YET") ||
        (activeGrammarFilter === "OK" && cardStatus === "OK");

      const query = grammarSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        grammar.index.toLowerCase().includes(query) ||
        grammar.title.toLowerCase().includes(query) ||
        grammar.romaji.toLowerCase().includes(query) ||
        grammar.pattern.toLowerCase().includes(query) ||
        grammar.sinhalaExplanation.toLowerCase().includes(query) ||
        grammar.englishExplanation.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [grammarList, grammarProgress, activeGrammarFilter, grammarSearchQuery]);

  // Counters scores/ratios and filtering (optimized via useMemo)
  const { okCountersCount, notYetCountersCount, percentCountersComplete } = useMemo(() => {
    const ok = counters.reduce((sum, c) => (countersProgress[c.id] === "OK" ? sum + 1 : sum), 0);
    const notYet = counters.reduce((sum, c) => (countersProgress[c.id] === "NOT_YET" ? sum + 1 : sum), 0);
    const percent = counters.length > 0 ? Math.round((ok / counters.length) * 100) : 0;
    return { okCountersCount: ok, notYetCountersCount: notYet, percentCountersComplete: percent };
  }, [counters, countersProgress]);

  const filteredCounters = useMemo(() => {
    return counters.filter((c) => {
      const cardStatus = countersProgress[c.id] || "UNSTUDIED";
      const matchesStatus =
        activeCountersFilter === "ALL" ||
        (activeCountersFilter === "NOT_YET" && cardStatus === "NOT_YET") ||
        (activeCountersFilter === "OK" && cardStatus === "OK");

      const query = countersSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.categorySinhala.toLowerCase().includes(query) ||
        c.categoryEnglish.toLowerCase().includes(query) ||
        c.questionWordJapanese.toLowerCase().includes(query) ||
        c.questionWordRomaji.toLowerCase().includes(query) ||
        c.counterChar.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [counters, countersProgress, activeCountersFilter, countersSearchQuery]);

  if (!userProfile) {
    const handleSimpleEnterSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAuthError(null);
      
      const formData = new FormData(e.currentTarget);
      const username = (formData.get("username") as string || "").trim();
      const targetExam = formData.get("targetExam") as string;
      const avatar = formData.get("avatar") as string;

      if (!username) {
        setAuthError("කරුණාකර ඔබගේ නම ඇතුළත් කරන්න. (Please enter your name).");
        return;
      }

      try {
        const res = await fetch("/api/auth/enter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, targetExam, avatar }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Standard progress maps will start empty on a new session as requested
          setProgress({});
          setVerbsProgress({});
          setAdjectivesProgress({});
          setGrammarProgress({});
          setCountersProgress({});
          localStorage.removeItem("jft_kanji_progress");
          localStorage.removeItem("jft_verbs_progress");
          localStorage.removeItem("jft_adjectives_progress");
          localStorage.removeItem("jft_grammar_progress");
          localStorage.removeItem("jft_counters_progress");

          setUserProfile(data.profile);
          await loadProfileAndProgressFromServer(data.profile.email);
        } else {
          setAuthError(data.error || "ඇතුල් වීමේ දෝෂයකි. (Entry error).");
        }
      } catch (err) {
        console.error("Simple enter error:", err);
        setAuthError("සම්බන්ධතාවය අසාර්ථකයි. (Connection failed).");
      }
    };

    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#fdfbf7] p-4 text-[#352d28]" id="login-gate-container">
        <div className="w-full max-w-md bg-white border border-[#e9e2d7] rounded-[32px] p-8 shadow-md relative overflow-hidden space-y-6 animate-fade-in">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#52796f]/10 rounded-bl-full pointer-events-none"></div>

          {/* Palace Icon Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#52796f] flex items-center justify-center text-white font-black text-2xl shadow-md shadow-[#52796f]/20 scale-105">
              漢字
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-[#354f52]">
                JFT & N4 Learning Palace
              </h2>
              <span className="text-[10px] font-black text-white bg-[#bc6c25] px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1.5 inline-block">
                නම සහ විභාගය ඇතුළත් කරන්න (Enter Name & Exam)
              </span>
              <p className="text-xs text-[#84a98c] mt-2.5 font-medium leading-relaxed max-w-xs mx-auto">
                වැඩසටහනට ඇතුල් වීමට ඔබගේ නම සහ විභාගය තෝරා පහත බොත්තම ඔබන්න. ඔබගේ ප්‍රගතිය සජීවී ලකුණු පුවරුවේ (Leaderboard) දිස්වනු ඇත.
              </p>
            </div>
          </div>

          {/* Error message banner */}
          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-bold leading-relaxed text-center">
              ❌ {authError}
            </div>
          )}

          <form onSubmit={handleSimpleEnterSubmit} className="space-y-4 pt-1">
            {/* Name Input Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider">
                ඔබගේ නම (Your Name)
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="e.g. Ruwan Silva"
                className="w-full text-xs rounded-xl border border-[#e9e2d7] px-3.5 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f] font-semibold text-slate-800"
              />
            </div>

            {/* Exam Selection Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider">
                ඉලක්කගත විභාගය (Select Target Exam)
              </label>
              <select
                name="targetExam"
                defaultValue="JFT-Basic"
                className="w-full text-xs rounded-xl border border-[#e9e2d7] px-3.5 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f] font-bold text-[#354f52] cursor-pointer"
              >
                <option value="JLPT N5">JLPT N5</option>
                <option value="JLPT N4">JLPT N4</option>
                <option value="JLPT N3">JLPT N3</option>
                <option value="JLPT N2">JLPT N2</option>
                <option value="JLPT N1">JLPT N1</option>
                <option value="JFT-Basic">JFT-Basic</option>
                <option value="NAT-TEST">NAT-TEST</option>
                <option value="OTHER">OTHER (වෙනත්)</option>
              </select>
            </div>

            {/* Avatar picker */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider mb-1">
                අවතාරයක් තෝරන්න (Choose Avatar Icon)
              </label>
              <div className="grid grid-cols-5 gap-1.5 bg-[#fdfbf7] p-2 rounded-xl border border-[#e9e2d7] text-center">
                {["🦊", "🐼", "🚀", "🎓", "🗻", "🍣", "🌸", "🎏", "💡", "🥋"].map((emoji) => (
                  <label
                    key={emoji}
                    className="flex items-center justify-center p-1.5 rounded-lg cursor-pointer hover:bg-white hover:scale-105 active:scale-95 transition-all text-base shadow-3xs"
                  >
                    <input
                      type="radio"
                      name="avatar"
                      value={emoji}
                      defaultChecked={emoji === "🦊"}
                      className="sr-only peer"
                    />
                    <span className="peer-checked:bg-[#bc6c25]/15 peer-checked:ring-2 peer-checked:ring-[#bc6c25]/40 px-2 py-0.5 rounded-md transition duration-150">
                      {emoji}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-black tracking-wide transition shadow-md cursor-pointer text-center"
            >
              🚀 ඉගෙනුම ආරම්භ කරන්න (Start Learning)
            </button>
          </form>
        </div>

        {/* Global Footer info inside login gate */}
        <p className="text-[10px] text-slate-400 font-bold mt-6">
          Developed by: H.D. Rusith Heshan Induwara • JFT-Basic Exam Companion
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#fdfbf7] text-[#352d28]" id="main-jft-container">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e9e2d7] shadow-sm transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#52796f] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#52796f]/15">
              漢字
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-display tracking-tight text-[#52796f]">
                JFT & N4 Learning Helper
              </h1>
              <p className="text-xs text-[#bc6c25] font-semibold">
                Sinhala & English Translations with Real-time Assessor
              </p>
            </div>
          </div>

          {/* Header Widgets panel */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            
            {/* Widget 1: Pomodoro-style study timer */}
            <div className="flex items-center gap-2.5 bg-[#fcfaf5] border border-[#e9dfcc] rounded-xl p-1.5 px-3 shadow-3xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className={`p-1 rounded-lg ${pomodoroMode === "focus" ? "bg-amber-100 text-[#52796f] animate-pulse" : "bg-[#cad2c5]/40 text-[#52796f]"}`}>
                  {pomodoroMode === "focus" ? <Brain className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-extrabold text-[#84a98c] uppercase tracking-wider block leading-none mb-0.5">
                    {pomodoroMode === "focus" ? "Focus" : "Break"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black font-mono text-[#354f52] block leading-none">
                      {(() => {
                        const mins = Math.floor(pomodoroSeconds / 60);
                        const secs = pomodoroSeconds % 60;
                        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
                      })()}
                    </span>
                    {pomodoroMode === "focus" && (
                      <select
                        value={focusDurationMinutes}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFocusDurationMinutes(val);
                          localStorage.setItem("jft_focus_duration", String(val));
                          if (!isTimerRunning) {
                            setPomodoroSeconds(val * 60);
                          }
                        }}
                        className="text-[9px] bg-[#eae3df] hover:bg-[#ebdcc7]/60 border-0 rounded-md font-bold text-[#354f52] p-0.5 px-1 ml-1 cursor-pointer outline-none shrink-0"
                        title="Set focus minutes"
                      >
                        {[15, 25, 30, 45, 60, 90, 120].map((m) => (
                          <option key={m} value={m} className="bg-white text-slate-700 font-bold">
                            {m}m
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-1 border-l border-[#e9dfcc] pl-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`p-1 rounded transition cursor-pointer ${isTimerRunning ? "bg-[#354f52] text-white" : "bg-[#eae3df] text-[#52796f] hover:bg-[#ebdcc7]"}`}
                  title={isTimerRunning ? "Pause timer" : "Start study timer"}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setPomodoroSeconds(pomodoroMode === "focus" ? focusDurationMinutes * 60 : 5 * 60);
                  }}
                  className="p-1 bg-[#eae3df] hover:bg-[#ebdcc7] text-slate-600 rounded cursor-pointer transition"
                  title="Reset clock"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Total Active Session display */}
              {totalSessionStudyTime > 0 && (
                <div className="border-l border-[#e9dfcc] pl-1.5 text-right shrink-0">
                  <span className="text-[8px] font-bold text-[#84a98c] block uppercase leading-none">Studied</span>
                  <span className="text-[10px] font-black text-[#52796f] block mt-0.5">
                    {(() => {
                      const mins = Math.floor(totalSessionStudyTime / 60);
                      const secs = totalSessionStudyTime % 60;
                      return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                    })()}
                  </span>
                </div>
              )}
            </div>

            {/* Widget 2: Daily Study Goal */}
            <div className="flex items-center gap-2 bg-[#fcfaf5] border border-[#e9dfcc] rounded-xl p-1.5 px-3 shadow-3xs">
              <div className="p-1 bg-[#cad2c5]/40 text-[#52796f] rounded-lg">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="shrink-0">
                <div className="flex items-center justify-between gap-1 leading-none">
                  <span className="text-[8px] font-extrabold text-[#84a98c] uppercase tracking-wider block">Daily Goal</span>
                  <span className="text-[9px] font-black text-[#52796f]">
                    {studiedTodayCount}/{dailyGoalToggle}
                  </span>
                </div>
                <div className="w-16 bg-[#eae3df] rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className="bg-[#52796f] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(Math.round((studiedTodayCount / dailyGoalToggle) * 100), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Original Progress score */}
            <div className="flex items-center gap-2 bg-[#fcfaf5] border border-[#e9dfcc] rounded-xl p-1.5 px-3 shadow-3xs">
              <div className="flex flex-col shrink-0">
                <div className="flex items-center gap-1 leading-none">
                  <span className="text-[8px] font-bold text-[#84a98c] tracking-wider uppercase block">
                    Mastery
                  </span>
                  <span className="text-[10px] font-black text-[#52796f]">{percentComplete}%</span>
                </div>
                <div className="w-14 bg-[#eae3df] rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className="bg-[#52796f] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>
              <div className="border-l border-[#e9dfcc] pl-1.5 text-[10px] font-extrabold text-[#354f52]">
                ✔️ {okCount}
              </div>
            </div>

            {/* Dedicated Active Students Counter Widget */}
            {leaderboard.length > 0 && (
              <div className="flex items-center gap-2 bg-[#fcfaf5] border border-[#e9dfcc] rounded-xl p-1.5 px-3 shadow-3xs">
                <div className="p-1 bg-[#cad2c5]/40 text-[#52796f] rounded-lg">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[8px] font-extrabold text-[#84a98c] uppercase tracking-wider block leading-none">Students</span>
                  <span className="text-[10px] font-black text-[#52796f] block mt-0.5">
                    {leaderboard.length} Active
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Unified full-width tab switcher responsive bar */}
        <div className="bg-transparent border-t border-[#e9dfcc] px-4 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Mobile View Toggle Bar: Displays active tab cleanly and offers a toggle button */}
            <div className="md:hidden flex items-center justify-between w-full bg-[#faf8f5] p-2.5 px-4 rounded-2xl border border-[#e9dfcc] shadow-3xs">
              <span className="text-xs font-black text-[#52796f] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE: <span className="font-extrabold pr-1 text-[#52796f]">{activeTab.toUpperCase()}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="px-4 py-2 bg-[#84a98c]/30 hover:bg-[#84a98c]/45 text-[#354f52] rounded-xl text-xs font-black shadow-3xs flex items-center gap-1.5 transition duration-150 cursor-pointer"
              >
                {isMobileMenuOpen ? "Hide Menu ✕" : "Show Menu ☰"}
              </button>
            </div>

            {/* Switcher Grid: hidden on mobile by default unless isMobileMenuOpen is true */}
            <div className={`${isMobileMenuOpen ? "grid" : "hidden md:grid"} grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-[#faf8f5] border border-[#e9e2d7]/80 p-2 rounded-2xl w-full shadow-3xs transition-all duration-300`}>
              
              {/* Tab 1: Alphabet */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("alphabet");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "alphabet"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <BookOpen className={`w-4 h-4 ${activeTab === "alphabet" ? "text-white" : "text-[#52796f]"}`} /> Alphabet
              </button>

              {/* Tab 2: JFT Kanji */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("learn");
                  setKanjiViewMode("learn");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "learn" && kanjiViewMode === "learn"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${activeTab === "learn" && kanjiViewMode === "learn" ? "text-white" : "text-[#52796f]"}`} /> JFT Kanji
              </button>

              {/* Tab 3: Verbs (ක්‍රියාපද) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("verbs");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "verbs"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <Zap className={`w-4 h-4 ${activeTab === "verbs" ? "text-white animate-bounce" : "text-orange-500"}`} /> Verbs
              </button>

              {/* Tab 5: Adjectives (විශේෂණ) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("adjectives");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "adjectives"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <Languages className={`w-4 h-4 ${activeTab === "adjectives" ? "text-white" : "text-teal-600"}`} /> Adjectives
              </button>

              {/* Tab 5.5: Counting Systems (ගණන් කිරීමේ පසු යෙදුම්) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("counters");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "counters"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <Hash className={`w-4 h-4 ${activeTab === "counters" ? "text-white animate-pulse" : "text-[#bc6c25]"}`} /> Counters
              </button>

              {/* Tab 6: Grammar (ව්‍යාකරණ) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("grammar");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "grammar"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <BookOpen className={`w-4 h-4 ${activeTab === "grammar" ? "text-white" : "text-[#52796f]"}`} /> Grammar
              </button>

              {/* Tab 7: Dictionary (ශබ්දකෝෂය) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dictionary");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "dictionary"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <BookMarked className={`w-4 h-4 ${activeTab === "dictionary" ? "text-white" : "text-[#52796f]"}`} /> Dictionary
              </button>

              {/* Tab 8: Statistics / Progress (ප්‍රගතිය) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("stats");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "stats"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <BarChart4 className={`w-4 h-4 ${activeTab === "stats" ? "text-white" : "text-[#52796f]"}`} /> Progress
              </button>

              {/* Tab 9: JFT Quiz (ප්‍රශ්නාවලිය) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("quiz");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "quiz"
                    ? "bg-[#52796f] text-white shadow-md border-0 ring-4 ring-[#52796f]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <HelpCircle className={`w-4 h-4 ${activeTab === "quiz" ? "text-white animate-spin" : "text-emerald-600"}`} /> Quiz
              </button>

              {/* Tab 10: Profile & Leaderboard (ප්‍රොෆයිල් සහ ලීඩර්බෝඩ්) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-3 rounded-xl text-xs font-black transition-all duration-150 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer w-full ${
                  activeTab === "profile"
                    ? "bg-[#bc6c25] text-white shadow-md border-0 ring-4 ring-[#bc6c25]/15"
                    : "text-[#354f52] hover:bg-white hover:text-[#bc6c25] border border-[#e9e2d7]/50"
                }`}
              >
                <Trophy className={`w-4 h-4 ${activeTab === "profile" ? "text-white" : "text-amber-500 animate-pulse"}`} /> Leaders
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* TAB 0: ALPHABET */}
        {activeTab === "alphabet" && (
          <div id="tab-panel-alphabet">
            <AlphabetView />
          </div>
        )}

        {/* TAB 1: LEARN JFT KANJI */}
        {activeTab === "learn" && (
          <div className="space-y-6" id="tab-panel-learn">
            <div className="space-y-6">
            
            {/* Elegant Study vs Test Mode Switcher */}
            <div className="flex gap-1 bg-[#ece2d0]/30 p-1.5 rounded-2xl border border-[#e9e2d7] max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setKanjiViewMode("learn")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  kanjiViewMode === "learn"
                    ? "bg-[#52796f] text-white shadow-xs font-black"
                    : "text-[#52796f] hover:bg-[#ece2d0]/60"
                }`}
              >
                📚 Study List (ලැයිස්තුව)
              </button>
              <button
                type="button"
                onClick={() => setKanjiViewMode("test")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  kanjiViewMode === "test"
                    ? "bg-[#52796f] text-white shadow-xs font-black"
                    : "text-[#52796f] hover:bg-[#ece2d0]/60"
                }`}
              >
                🧠 Kanji Test (පරීක්‍ෂණය)
              </button>
            </div>

            {kanjiViewMode === "learn" ? (
              <div className="space-y-6 block">
                {/* Workspace Config Reset Options */}
                <div className="max-w-xl mx-auto bg-[#ece2d0]/25 border border-[#e9e2d7] p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#bc6c25] flex items-center gap-1.5 justify-center">
                      <Info className="w-4 h-4" /> Info & Workspace Reset
                    </h3>
                    <p className="text-xs text-[#2f3e46] mt-2 text-center leading-relaxed font-semibold">
                      Loaded {cards.length} total Kanji cards. Marked: {okCount} learned checks. You can reset learning matrices or reload default definitions at any time.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                    <button
                      onClick={handleResetProgress}
                      className="w-full py-2.5 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#bc6c25] transition cursor-pointer"
                    >
                      🧹 Clear Progress Tracking Data
                    </button>
                    <button
                      onClick={handleResetAllToFactory}
                      className="w-full py-2.5 bg-white border border-[#84a98c] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#52796f] transition cursor-pointer"
                    >
                      🔄 Reset Deck list to Factory Base
                    </button>
                  </div>
                </div>

            {/* Filtering and Search controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-[24px] border border-[#e9e2d7] shadow-sm">
              
              {/* Tabs filter buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-[#f0ede6] rounded-xl border border-[#e9e2d7] self-start">
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                    activeFilter === "ALL"
                      ? "bg-white text-[#52796f] shadow-xs font-extrabold"
                      : "text-[#84a98c] hover:text-[#52796f]"
                  }`}
                >
                  📖 All ({cards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("NOT_YET")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 ${
                    activeFilter === "NOT_YET"
                      ? "bg-white text-[#bc6c25] shadow-xs font-extrabold"
                      : "text-[#84a98c] hover:text-[#bc6c25]"
                  }`}
                >
                  ❌ Not Yet ({cards.length - okCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("OK")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 ${
                    activeFilter === "OK"
                      ? "bg-white text-[#52796f] shadow-xs font-extrabold"
                      : "text-[#84a98c] hover:text-[#52796f]"
                  }`}
                >
                  ✔️ OK ({okCount})
                </button>
              </div>

              {/* Text Search element Input */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84a98c]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="සොයන්න (e.g. කනවා, Water, にち...)"
                  className="w-full text-xs rounded-xl border border-[#e9e2d7] pl-10 pr-4 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                />
              </div>
            </div>

            {/* Kanji Card Grid list */}
            {filteredCards.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="kanji-deck-layout">
                  {filteredCards.slice(0, visibleKanjiCount).map((card) => (
                    <KanjiCardView
                      key={card.id}
                      card={card}
                      status={progress[card.id] || "UNSTUDIED"}
                      mode="learn"
                      onStatusChange={(status) => handleUpdateStatus(card.id, status)}
                    />
                  ))}
                </div>
                {filteredCards.length > visibleKanjiCount && (
                  <div className="flex justify-center pt-3">
                    <button
                      type="button"
                      onClick={() => setVisibleKanjiCount((prev) => prev + 24)}
                      className="px-8 py-3.5 bg-[#84a98c]/25 hover:bg-[#84a98c]/40 text-[#2f3e46] hover:text-[#111] rounded-2xl text-xs font-black tracking-wide shadow-3xs hover:shadow-2xs transition-all duration-250 flex items-center gap-2 cursor-pointer"
                    >
                      🚀 Load More Kanji (තවත් කන්ජි පෙන්වන්න)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-sm font-semibold text-slate-400">No Kanji cards found matching filters or search query.</p>
                <p className="text-xs text-slate-300 mt-1">ඔබ ඇතුළත් කළ සෙවුම් වචන නැවත පරීක්ෂා කර බලන්න.</p>
              </div>
            )}
              </div>
            ) : (
              <div className="max-w-xl mx-auto space-y-6">
                {/* Context/Assessment description box */}
                <div className="bg-white rounded-[24px] border border-[#e9e2d7] p-5 shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#354f52] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#bc6c25] animate-spin" /> Self Assessment Deck
                    </h3>
                    <p className="text-xs text-[#84a98c] mt-1 leading-relaxed">
                      The deck is shuffled automatically. Card displays only the core Kanji character. Try recalling its translation, then click the card to flip it and reveal detailed translation options.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={shuffleTestDeck}
                    className="p-2.5 bg-[#f0ede6] hover:bg-[#cad2c5]/40 border border-[#e9e2d7] hover:border-[#84a98c] text-[#52796f] rounded-xl transition duration-150 inline-flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs cursor-pointer"
                    title="Shuffle Deck"
                  >
                    <Shuffle className="w-3.5 h-3.5" /> Shuffle
                  </button>
                </div>

                {testDeck.length > 0 ? (
                  <div className="space-y-6">
                    {/* Visual Tracker numbers progress */}
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-[#84a98c] tracking-wider">
                        DECK POSITION: <span className="font-mono text-[#2f3e46] bg-[#f0ede6] px-2 py-0.5 rounded-md font-extrabold">{currentTestIndex + 1}</span> / {testDeck.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-wider">
                          Learned Status:
                        </span>
                        <span className="font-mono text-xs font-bold py-0.5 px-2 bg-[#f0ede6] text-[#2f3e46] rounded-md">
                          {progress[testDeck[currentTestIndex]?.id] || "UNSTUDIED"}
                        </span>
                      </div>
                    </div>

                    {/* Main animated check card container */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testDeck[currentTestIndex].id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <KanjiCardView
                          card={testDeck[currentTestIndex]}
                          status={progress[testDeck[currentTestIndex].id] || "UNSTUDIED"}
                          mode="test"
                          isRevealed={isTestCardRevealed}
                          onReveal={() => setIsTestCardRevealed(true)}
                          onStatusChange={(status) => handleUpdateStatus(testDeck[currentTestIndex].id, status)}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Prev, Next controls deck navigation buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        disabled={currentTestIndex === 0}
                        onClick={() => {
                          if (currentTestIndex > 0) {
                            setCurrentTestIndex(currentTestIndex - 1);
                            setIsTestCardRevealed(false);
                          }
                        }}
                        className="py-3 px-4 bg-white hover:bg-[#f0ede6] disabled:bg-[#fdfbf7] disabled:text-[#cad2c5] border border-[#e9e2d7] rounded-xl font-sans font-bold text-xs text-[#52796f] transition inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> PREVIOUS
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (currentTestIndex < testDeck.length - 1) {
                            setCurrentTestIndex(currentTestIndex + 1);
                            setIsTestCardRevealed(false);
                          } else {
                            // End of deck, reshuffle
                            if (window.confirm("ඔබ අවසන් කාඩ්පත වෙත ළඟා වී ඇත! නැවත shuffle කිරීමට අවශ්‍ය ද? You reached the end. Re-shuffle the cards?")) {
                              shuffleTestDeck();
                            }
                          }
                        }}
                        className="py-3 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl font-sans font-bold text-xs transition inline-flex items-center justify-center gap-2 shadow-md shadow-[#52796f]/10 cursor-pointer"
                      >
                        NEXT <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Additional Quick Action buttons if card has been revealed */}
                    {isTestCardRevealed && (
                      <div className="p-4 bg-white border border-[#e9e2d7] rounded-2xl shadow-sm text-center">
                        <p className="text-xs font-bold text-[#52796f] mb-2 font-semibold">Did you recall this Kanji correctly?</p>
                        <div className="flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(testDeck[currentTestIndex].id, "NOT_YET");
                              // Auto advance
                              if (currentTestIndex < testDeck.length - 1) {
                                setTimeout(() => {
                                  setCurrentTestIndex(prev => prev + 1);
                                  setIsTestCardRevealed(false);
                                }, 350);
                              }
                            }}
                            className="py-2.5 px-4 bg-[#bc6c25] hover:bg-[#bc6c25]/90 text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> No, forgot it
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(testDeck[currentTestIndex].id, "OK");
                              // Auto advance
                              if (currentTestIndex < testDeck.length - 1) {
                                setTimeout(() => {
                                  setCurrentTestIndex(prev => prev + 1);
                                  setIsTestCardRevealed(false);
                                }, 350);
                              }
                            }}
                            className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Yes, remembered!
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7]">
                    <p className="text-sm font-semibold text-[#84a98c]">Your study deck is currently empty.</p>
                    <p className="text-xs text-[#84a98c] mt-1">Go to "Learn JFT Kanji" tab to upload or add cards first.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>)}

        {/* TAB 3: LEARN & PRACTICE JFT VERBS */}
        {activeTab === "verbs" && (
          <div className="space-y-6" id="tab-panel-verbs">
            <div className="space-y-6">
            
            {/* Elegant Study vs Test Mode Switcher */}
            <div className="flex gap-1.5 bg-[#f0ede6] p-1.5 rounded-2xl border border-[#e9e2d7] max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setVerbsViewMode("learn")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  verbsViewMode === "learn"
                    ? "bg-[#52796f] text-white shadow-md font-black"
                    : "text-[#52796f] hover:text-[#bc6c25] hover:bg-white/70"
                }`}
              >
                📚 Study List (ලැයිස්තුව)
              </button>
              <button
                type="button"
                onClick={() => setVerbsViewMode("test")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  verbsViewMode === "test"
                    ? "bg-[#52796f] text-white shadow-md font-black"
                    : "text-[#52796f] hover:text-[#bc6c25] hover:bg-white/70"
                }`}
              >
                🧠 Test Practice (පරීක්ෂණය)
              </button>
            </div>

            {verbsViewMode === "learn" ? (
              <div className="space-y-6">
                
                {/* Verbs Progress Header & Reset Options bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Box 1: Verb Progress Metrics */}
              <div className="lg:col-span-8 bg-white p-6 rounded-[24px] border border-[#e9e2d7] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#354f52] flex items-center gap-2" id="verbs-header-title">
                    <Zap className="w-5 h-5 text-[#bc6c25]" /> JFT-Basic Verbs Course (ජේ.එෆ්.ටී. ක්‍රියාපද)
                  </h3>
                  <p className="text-xs text-[#84a98c] mt-1.5 leading-relaxed">
                    මෙම කොටසෙන් ඔබට JFT-Basic විභාගයට අත්‍යවශ්‍ය වන ක්‍රියාපද (Verbs) 113ම ඒවායේ විවිධ ව්‍යාකරණ රටා (Conjugations) සමඟ අධ්‍යයනය කළ හැක. 
                    පහතින් <strong>සිංහල</strong> හෝ <strong>ජපන්</strong> ක්‍රමය තෝරාගෙන ප්‍රගතිය පරීක්ෂා කරන්න.
                  </p>
                </div>

                {/* Progress bar info */}
                <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-[#f0ede6]">
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#52796f] uppercase tracking-wider">ක්‍රියාපද ප්‍රගතිය (Verbs Study Score)</span>
                      <span className="text-sm font-extrabold text-[#354f52]">{percentVerbsComplete}%</span>
                    </div>
                    <div className="w-full bg-[#f0ede6] rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-[#52796f] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentVerbsComplete}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4 shrink-0 bg-[#fdfbf7] border border-[#e9e2d7] rounded-xl p-2.5 px-4">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">OK</span>
                      <span className="text-sm font-extrabold text-[#52796f]">✔️ {okVerbsCount}</span>
                    </div>
                    <div className="border-l border-[#e9e2d7] pl-4 text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">NOT YET</span>
                      <span className="text-sm font-extrabold text-[#bc6c25]">❌ {notYetVerbsCount}</span>
                    </div>
                    <div className="border-l border-[#e9e2d7] pl-4 text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">මුළු එකතුව</span>
                      <span className="text-sm font-extrabold text-[#354f52]">📋 {verbs.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Actions & Configuration Panel */}
              <div className="lg:col-span-4 bg-[#ece2d0]/25 border border-[#e9e2d7] p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-[#bc6c25] uppercase tracking-widest flex items-center gap-1.5" id="verbs-config-title">
                    ⚙️ Settings & Performance
                  </h4>
                  <p className="text-xs text-[#2f3e46] mt-1.5 leading-relaxed">
                    සෑම කාඩ්පතක්ම ක්ලික් කර එහි අනෙක් පැත්ත හරවා ව්‍යාකරණ වගුව බලාගන්න. (masu form, dictionary form, te, ta, nai, nakatta)
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleResetVerbsProgress}
                    className="w-full py-2.5 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#bc6c25] transition shadow-xs cursor-pointer"
                  >
                    🧹 Clear Verbs Progress Data
                  </button>
                  <div className="p-3 bg-white border border-[#e9e2d7] rounded-xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                    💡 <strong>Pronunciation support</strong>: Click the speaker button inside any card to hear the natural audio pronunciation.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Practice Mode Toggle & Search Filter controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 bg-white rounded-[24px] border border-[#e9e2d7] shadow-sm">
              
              {/* Practice Toggle (Sinhala Front vs Japanese Front) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Practice Deck View (ප්‍රශ්නය පෙන්වන භාෂාව)
                </span>
                <div className="flex gap-1 bg-[#f0ede6] p-1 rounded-xl self-start border border-[#e9e2d7]">
                  <button
                    type="button"
                    onClick={() => setVerbsPracticePerspective("sinhala")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      verbsPracticePerspective === "sinhala"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    🇱🇰 <strong>Sinhala Practice</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerbsPracticePerspective("japanese")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      verbsPracticePerspective === "japanese"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    🇯🇵 <strong>Japanese Practice</strong>
                  </button>
                </div>
              </div>

              {/* Status Filter Toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Status Filtering (පෙරහන්)
                </span>
                <div className="flex items-center gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7] self-start">
                  <button
                    type="button"
                    onClick={() => setActiveVerbsFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeVerbsFilter === "ALL"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    📖 All ({verbs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVerbsFilter("NOT_YET")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeVerbsFilter === "NOT_YET"
                        ? "bg-white text-[#bc6c25] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#bc6c25]"
                    }`}
                  >
                    ❌ Not Yet ({notYetVerbsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVerbsFilter("OK")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeVerbsFilter === "OK"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    ✔️ OK ({okVerbsCount})
                  </button>
                </div>
              </div>

              {/* Text Search Element */}
              <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Search Verbs (ක්‍රියාපද සොයන්න)
                </span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84a98c]" />
                  <input
                    type="text"
                    value={verbsSearchQuery}
                    onChange={(e) => setVerbsSearchQuery(e.target.value)}
                    placeholder="සොයන්න (e.g. ලියනවා, 書く, かきます...)"
                    className="w-full text-xs rounded-xl border border-[#e9e2d7] pl-10 pr-4 py-2 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                  />
                </div>
              </div>
            </div>

            {/* Verbs Card grid layout */}
            {filteredVerbs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="verbs-deck-layout">
                {filteredVerbs.map((verb) => (
                  <VerbCardView
                    key={verb.id}
                    verb={verb}
                    practiceMode={verbsPracticePerspective}
                    status={verbsProgress[verb.id] || "UNSTUDIED"}
                    onStatusChange={(status) => handleUpdateVerbStatus(verb.id, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7] shadow-sm">
                <p className="text-sm font-semibold text-slate-400">ක්‍රියාපද කිසිවක් හමු නොවීය. Select other search criteria.</p>
                <p className="text-xs text-slate-300 mt-1">සෙවුම් පද නැවත පරීක්ෂා කර බැලීමට උත්සාහ කරන්න.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-6">
                
            {/* Context/Assessment description box */}
            <div className="bg-white rounded-[24px] border border-[#e9e2d7] p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-medium text-sm text-[#354f52] flex items-center gap-1.5" id="verb-test-mode-title">
                  <Sparkles className="w-4 h-4 text-[#bc6c25] animate-spin" /> Verbs SRS Evaluation Deck (ක්‍රියාපද පරීක්ෂණය)
                </h3>
                <p className="text-xs text-[#84a98c] mt-1 leading-relaxed">
                  This deck is sorted based on Spaced Repetition weights. Click the card to flip and reveal all conjugation states and translation. Mark "Yes" if you remembered it correctly, or "No" to review it more often.
                </p>
              </div>

              <button
                type="button"
                onClick={shuffleVerbTestDeck}
                className="p-2.5 bg-[#f0ede6] hover:bg-[#cad2c5]/45 border border-[#e9e2d7] hover:border-[#84a98c] text-[#52796f] rounded-xl transition duration-150 inline-flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs cursor-pointer"
                title="Shuffle Deck"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            {verbTestDeck.length > 0 ? (
              <div className="space-y-6">
                
                {/* Visual Tracker numbers progress */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-[#84a98c] tracking-wider">
                    DECK POSITION: <span className="font-mono text-[#2f3e46] bg-[#f0ede6] px-2 py-0.5 rounded-md font-extrabold">{currentVerbTestIndex + 1}</span> / {verbTestDeck.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-wider">
                      Learned Status:
                    </span>
                    <span className="font-mono text-xs font-bold py-0.5 px-2 bg-[#f0ede6] text-[#2f3e46] rounded-md">
                      {verbsProgress[verbTestDeck[currentVerbTestIndex]?.id] || "UNSTUDIED"}
                    </span>
                  </div>
                </div>

                {/* Main animated check card container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={verbTestDeck[currentVerbTestIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <VerbCardView
                      key={verbTestDeck[currentVerbTestIndex].id}
                      verb={verbTestDeck[currentVerbTestIndex]}
                      practiceMode={verbsPracticePerspective}
                      status={verbsProgress[verbTestDeck[currentVerbTestIndex].id] || "UNSTUDIED"}
                      onReveal={() => setIsVerbTestCardRevealed(true)}
                      onStatusChange={(status) => handleUpdateVerbStatus(verbTestDeck[currentVerbTestIndex].id, status)}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev, Next controls deck navigation buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={currentVerbTestIndex === 0}
                    onClick={() => {
                      if (currentVerbTestIndex > 0) {
                        setCurrentVerbTestIndex(currentVerbTestIndex - 1);
                        setIsVerbTestCardRevealed(false);
                      }
                    }}
                    className="py-3 px-4 bg-white hover:bg-[#f0ede6] disabled:bg-[#fdfbf7] disabled:text-[#cad2c5] border border-[#e9e2d7] rounded-xl font-sans font-bold text-xs text-[#52796f] transition inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> PREVIOUS
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentVerbTestIndex < verbTestDeck.length - 1) {
                        setCurrentVerbTestIndex(currentVerbTestIndex + 1);
                        setIsVerbTestCardRevealed(false);
                      } else {
                        if (window.confirm("ඔබ අවසන් කාඩ්පත වෙත ළඟා වී ඇත! නැවත shuffle කිරීමට අවශ්‍ය ද? You reached the end. Re-shuffle the cards?")) {
                          shuffleVerbTestDeck();
                        }
                      }
                    }}
                    className="py-3 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl font-sans font-black text-xs transition inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    NEXT <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional Quick Action buttons if card has been revealed */}
                {isVerbTestCardRevealed && (
                  <div className="p-4 bg-white border border-[#e9e2d7] rounded-2xl shadow-sm text-center">
                    <p className="text-xs font-bold text-[#52796f] mb-2">Did you recall this verb meaning correctly?</p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          handleUpdateVerbStatus(verbTestDeck[currentVerbTestIndex].id, "NOT_YET");
                          if (currentVerbTestIndex < verbTestDeck.length - 1) {
                            setTimeout(() => {
                              setCurrentVerbTestIndex(prev => prev + 1);
                              setIsVerbTestCardRevealed(false);
                            }, 350);
                          }
                        }}
                        className="py-2.5 px-4 bg-[#bc6c25] hover:bg-[#bc6c25]/90 text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> No, forgot it
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateVerbStatus(verbTestDeck[currentVerbTestIndex].id, "OK");
                          if (currentVerbTestIndex < verbTestDeck.length - 1) {
                            setTimeout(() => {
                              setCurrentVerbTestIndex(prev => prev + 1);
                              setIsVerbTestCardRevealed(false);
                            }, 350);
                          }
                        }}
                        className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Yes, remembered!
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7]">
                <p className="text-sm font-semibold text-[#84a98c]">Your study deck is currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>)}

        {/* TAB 4: LEARN JFT ADJECTIVES */}
        {activeTab === "adjectives" && (
          <div className="space-y-6" id="tab-panel-adjectives">
            <div className="space-y-6">

            {/* Elegant Study vs Test Mode Switcher */}
            <div className="flex gap-1.5 bg-[#f0ede6] p-1.5 rounded-2xl border border-[#e9e2d7] max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setAdjectivesViewMode("learn")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  adjectivesViewMode === "learn"
                    ? "bg-[#52796f] text-white shadow-md font-black"
                    : "text-[#52796f] hover:text-[#bc6c25] hover:bg-white/70"
                }`}
              >
                📚 Study List (ලැයිස්තුව)
              </button>
              <button
                type="button"
                onClick={() => setAdjectivesViewMode("test")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                  adjectivesViewMode === "test"
                    ? "bg-[#52796f] text-white shadow-md font-black"
                    : "text-[#52796f] hover:text-[#bc6c25] hover:bg-white/70"
                }`}
              >
                🧠 Test Practice (පරීක්ෂණය)
              </button>
            </div>

            {adjectivesViewMode === "learn" ? (
              <div className="space-y-6">
                {/* Header / Banner summary bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="adjectives-stats-box">
                  {/* Box 1: Info Deck progress */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-[28px] border border-[#e9e2d7] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-[#354f52] flex items-center gap-2">
                    <Languages className="w-5 h-5 text-[#bc6c25]" /> JFT-Basic Adjectives Course (ජේ.එෆ්.ටී. විශේෂණ පද)
                  </h3>
                  <p className="text-xs text-[#84a98c] mt-1.5 leading-relaxed">
                    මෙම කොටසෙන් ඔබට JFT-Basic විභාගයට අත්‍යවශ්‍ය වන විශේෂණ පද (Adjectives) 127ම අධ්‍යයනය කළ හැක. 
                    මෙහි <strong>i-adjectives (ඉ-විශේෂණ)</strong> සහ <strong>na-adjectives (න-විශේෂණ)</strong> ලෙස කාණ්ඩ දෙකක් ඇත.
                  </p>
                </div>

                {/* Progress bar info */}
                <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-[#f0ede6]">
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#52796f] uppercase tracking-wider">විශේෂණ ප්‍රගතිය (Adjectives Study Score)</span>
                      <span className="text-sm font-extrabold text-[#354f52]">{percentAdjectivesComplete}%</span>
                    </div>
                    <div className="w-full bg-[#f0ede6] rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-[#52796f] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentAdjectivesComplete}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4 shrink-0 bg-[#fdfbf7] border border-[#e9e2d7] rounded-xl p-2.5 px-4">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">OK</span>
                      <span className="text-sm font-extrabold text-[#52796f]">✔️ {okAdjectivesCount}</span>
                    </div>
                    <div className="border-l border-[#e9e2d7] pl-4 text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">NOT YET</span>
                      <span className="text-sm font-extrabold text-[#bc6c25]">❌ {notYetAdjectivesCount}</span>
                    </div>
                    <div className="border-l border-[#e9e2d7] pl-4 text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">මුළු එකතුව</span>
                      <span className="text-sm font-extrabold text-[#354f52]">📋 {adjectives.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Actions & Configuration Panel */}
              <div className="lg:col-span-4 bg-[#ece2d0]/25 border border-[#e9e2d7] p-6 rounded-[24px] shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-xs text-[#bc6c25] uppercase tracking-widest flex items-center gap-1.5" id="adj-config-title">
                    ⚙️ Settings & Performance
                  </h4>
                  <p className="text-xs text-[#2f3e46] mt-1.5 leading-relaxed">
                    සෑම කාඩ්පතක්ම ක්ලික් කර එහි අනෙක් පැත්ත හරවා වැඩිදුර විස්තර අධ්‍යයනය කරන්න.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleResetAdjectivesProgress}
                    className="w-full py-2.5 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#bc6c25] transition shadow-xs cursor-pointer"
                  >
                    🧹 Clear Adjectives Progress Data
                  </button>
                  <div className="p-3 bg-white border border-[#e9e2d7] rounded-xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                    💡 Click the speaker button inside any adjective card to hear the audio pronunciation.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Practice Mode Toggle & Search Filter controls */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-5 bg-white rounded-[24px] border border-[#e9e2d7] shadow-sm">
              
              {/* Practice Toggle (Sinhala Front vs Japanese Front) */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider flex items-center gap-1">
                  <Languages className="w-3 h-3" /> Practice Deck View (භාෂාව)
                </span>
                <div className="flex gap-1 bg-[#f0ede6] p-1 rounded-xl self-start border border-[#e9e2d7]">
                  <button
                    type="button"
                    onClick={() => setAdjectivesPracticePerspective("sinhala")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      adjectivesPracticePerspective === "sinhala"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    🇱🇰 <strong>Sinhala Practice</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjectivesPracticePerspective("japanese")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      adjectivesPracticePerspective === "japanese"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    🇯🇵 <strong>Japanese Practice</strong>
                  </button>
                </div>
              </div>

              {/* Adjective Type (i-adjectives vs na-adjectives) */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Adjective Category (කාණ්ඩය)
                </span>
                <div className="flex items-center gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7] self-start">
                  <button
                    type="button"
                    onClick={() => setActiveAdjectiveTypeFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectiveTypeFilter === "ALL"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdjectiveTypeFilter("I")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectiveTypeFilter === "I"
                        ? "bg-white text-[#bc6c25] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#bc6c25]"
                    }`}
                  >
                    ı-adjectives
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdjectiveTypeFilter("NA")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectiveTypeFilter === "NA"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    na-adjectives
                  </button>
                </div>
              </div>

              {/* Status Filter Toggle */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Status Filtering (පෙරහන්)
                </span>
                <div className="flex items-center gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7] self-start">
                  <button
                    type="button"
                    onClick={() => setActiveAdjectivesFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectivesFilter === "ALL"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    📖 All ({adjectives.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdjectivesFilter("NOT_YET")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectivesFilter === "NOT_YET"
                        ? "bg-white text-[#bc6c25] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#bc6c25]"
                    }`}
                  >
                    ❌ Not Yet ({notYetAdjectivesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdjectivesFilter("OK")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeAdjectivesFilter === "OK"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    ✔️ OK ({okAdjectivesCount})
                  </button>
                </div>
              </div>

              {/* Text Search Element */}
              <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Search Adjectives (විශේෂණ සොයන්න)
                </span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84a98c]" />
                  <input
                    type="text"
                    value={adjectivesSearchQuery}
                    onChange={(e) => setAdjectivesSearchQuery(e.target.value)}
                    placeholder="සොයන්න (e.g. පැණිරස, 甘い, あまい...)"
                    className="w-full text-xs rounded-xl border border-[#e9e2d7] pl-10 pr-4 py-2 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                  />
                </div>
              </div>
            </div>

            {/* Adjectives Card grid layout */}
            {filteredAdjectives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="adjectives-deck-layout">
                {filteredAdjectives.map((adj) => (
                  <AdjectiveCardView
                    key={adj.id}
                    adjective={adj}
                    practiceMode={adjectivesPracticePerspective}
                    status={adjectivesProgress[adj.id] || "UNSTUDIED"}
                    onStatusChange={(status) => handleUpdateAdjectiveStatus(adj.id, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7] shadow-sm">
                <p className="text-sm font-semibold text-slate-400">විශේෂණ පද කිසිවක් හමු නොවීය. Select other search criteria.</p>
                <p className="text-xs text-slate-300 mt-1">සෙවුම් පද නැවත පරීක්ෂා කර බැලීමට උත්සාහ කරන්න.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-6">
                
            {/* Context/Assessment description box */}
            <div className="bg-white rounded-[24px] border border-[#e9e2d7] p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-medium text-sm text-[#354f52] flex items-center gap-1.5" id="adj-test-mode-title">
                  <Sparkles className="w-4 h-4 text-[#bc6c25] animate-spin" /> Adjectives SRS Evaluation Deck (විශේෂණ පද පරීක්ෂණය)
                </h3>
                <p className="text-xs text-[#84a98c] mt-1 leading-relaxed">
                  This deck is sorted based on Spaced Repetition weights. Click the card to flip and reveal its type (i/na adjective) and detailed translation. Mark "Yes" if you remembered it correctly, or "No" to review it more often.
                </p>
              </div>

              <button
                type="button"
                onClick={shuffleAdjTestDeck}
                className="p-2.5 bg-[#f0ede6] hover:bg-[#cad2c5]/45 border border-[#e9e2d7] hover:border-[#84a98c] text-[#52796f] rounded-xl transition duration-150 inline-flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs cursor-pointer"
                title="Shuffle Deck"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            {adjTestDeck.length > 0 ? (
              <div className="space-y-6">
                
                {/* Visual Tracker numbers progress */}
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-[#84a98c] tracking-wider">
                    DECK POSITION: <span className="font-mono text-[#2f3e46] bg-[#f0ede6] px-2 py-0.5 rounded-md font-extrabold">{currentAdjTestIndex + 1}</span> / {adjTestDeck.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-wider">
                      Learned Status:
                    </span>
                    <span className="font-mono text-xs font-bold py-0.5 px-2 bg-[#f0ede6] text-[#2f3e46] rounded-md">
                      {adjectivesProgress[adjTestDeck[currentAdjTestIndex]?.id] || "UNSTUDIED"}
                    </span>
                  </div>
                </div>

                {/* Main animated check card container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={adjTestDeck[currentAdjTestIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                  >
                    <AdjectiveCardView
                      key={adjTestDeck[currentAdjTestIndex].id}
                      adjective={adjTestDeck[currentAdjTestIndex]}
                      practiceMode={adjectivesPracticePerspective}
                      status={adjectivesProgress[adjTestDeck[currentAdjTestIndex].id] || "UNSTUDIED"}
                      onReveal={() => setIsAdjTestCardRevealed(true)}
                      onStatusChange={(status) => handleUpdateAdjectiveStatus(adjTestDeck[currentAdjTestIndex].id, status)}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev, Next controls deck navigation buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={currentAdjTestIndex === 0}
                    onClick={() => {
                      if (currentAdjTestIndex > 0) {
                        setCurrentAdjTestIndex(currentAdjTestIndex - 1);
                        setIsAdjTestCardRevealed(false);
                      }
                    }}
                    className="py-3 px-4 bg-white hover:bg-[#f0ede6] disabled:bg-[#fdfbf7] disabled:text-[#cad2c5] border border-[#e9e2d7] rounded-xl font-sans font-bold text-xs text-[#52796f] transition inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> PREVIOUS
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentAdjTestIndex < adjTestDeck.length - 1) {
                        setCurrentAdjTestIndex(currentAdjTestIndex + 1);
                        setIsAdjTestCardRevealed(false);
                      } else {
                        if (window.confirm("ඔබ අවසන් කාඩ්පත වෙත ළඟා වී ඇත! නැවත shuffle කිරීමට අවශ්‍ය ද? You reached the end. Re-shuffle the cards?")) {
                          shuffleAdjTestDeck();
                        }
                      }
                    }}
                    className="py-3 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl font-sans font-black text-xs transition inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    NEXT <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional Quick Action buttons if card has been revealed */}
                {isAdjTestCardRevealed && (
                  <div className="p-4 bg-white border border-[#e9e2d7] rounded-2xl shadow-sm text-center">
                    <p className="text-xs font-bold text-[#52796f] mb-2">Did you recall this adjective meaning correctly?</p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          handleUpdateAdjectiveStatus(adjTestDeck[currentAdjTestIndex].id, "NOT_YET");
                          if (currentAdjTestIndex < adjTestDeck.length - 1) {
                            setTimeout(() => {
                              setCurrentAdjTestIndex(prev => prev + 1);
                              setIsAdjTestCardRevealed(false);
                            }, 350);
                          }
                        }}
                        className="py-2.5 px-4 bg-[#bc6c25] hover:bg-[#bc6c25]/90 text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> No, forgot it
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateAdjectiveStatus(adjTestDeck[currentAdjTestIndex].id, "OK");
                          if (currentAdjTestIndex < adjTestDeck.length - 1) {
                            setTimeout(() => {
                              setCurrentAdjTestIndex(prev => prev + 1);
                              setIsAdjTestCardRevealed(false);
                            }, 350);
                          }
                        }}
                        className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Yes, remembered!
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7]">
                <p className="text-sm font-semibold text-[#84a98c]">Your study deck is currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>)}

        {/* TAB 4.5: COUNTING SYSTEMS (ගණන් කිරීමේ පසු යෙදුම්) */}
        {activeTab === "counters" && (
          <div className="space-y-6" id="tab-panel-counters">
            <div className="space-y-6">
              {/* Elegant Study vs Test Mode Switcher */}
              <div className="flex gap-1.5 bg-[#f0ede6] p-1.5 rounded-2xl border border-[#e9e2d7] max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setCountersViewMode("learn")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                    countersViewMode === "learn"
                      ? "bg-[#52796f] text-white shadow-md font-black"
                      : "text-[#354f52] hover:bg-white"
                  }`}
                >
                  📖 Study Mode (ගණන් කිරීමේ පසු යෙදුම්)
                </button>
                <button
                  type="button"
                  onClick={() => setCountersViewMode("test")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                    countersViewMode === "test"
                      ? "bg-[#52796f] text-white shadow-md font-black"
                      : "text-[#354f52] hover:bg-white"
                  }`}
                >
                  📝 Counting System Test
                </button>
              </div>

              {countersViewMode === "learn" ? (
                <div className="space-y-6">
                  {/* Stats Metrics row */}
                  <div className="bg-[#fcfaf5] border border-[#e9dfcc] rounded-2xl p-4 shadow-3xs flex flex-wrap gap-4 items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[#354f52]">ගණන් කිරීමේ පසු යෙදුම් 18 (Japanese Counting Systems)</h4>
                      <p className="text-xs text-slate-500 font-medium">ජපන් භාෂාවේ විවිධ ද්‍රව්‍ය, සතුන්, පුද්ගලයන් සහ ක්‍රියාවන් ගණන් කිරීමේදී භාවිතා වන පසු යෙදුම් 18ක් මෙහි අන්තර්ගත වේ.</p>
                    </div>
                    <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-[#ece7dc]/80">
                      <div className="text-center px-4">
                        <span className="text-[9px] uppercase font-bold text-[#84a98c] block">Progress</span>
                        <span className="text-lg font-black text-[#52796f]">{percentCountersComplete}%</span>
                      </div>
                      <div className="h-8 w-px bg-[#ece7dc]" />
                      <div className="text-center px-4">
                        <span className="text-[9px] uppercase font-bold text-[#84a98c] block">Mastered (OK)</span>
                        <span className="text-lg font-black text-green-600">{okCountersCount} / 18</span>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search counters by Sinhala, English, reading, counter sign..."
                        value={countersSearchQuery}
                        onChange={(e) => setCountersSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ece7dc] rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#84a98c]"
                      />
                    </div>
                    <div className="flex gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7]">
                      <button
                        type="button"
                        onClick={() => setActiveCountersFilter("ALL")}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                          activeCountersFilter === "ALL" ? "bg-white text-[#2f3e46] shadow-3xs" : "text-[#52796f] hover:text-[#2f3e46]"
                        }`}
                      >
                        All ({counters.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCountersFilter("NOT_YET")}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                          activeCountersFilter === "NOT_YET" ? "bg-red-50 text-red-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Not Yet ({notYetCountersCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCountersFilter("OK")}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                          activeCountersFilter === "OK" ? "bg-green-50 text-green-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Ok ({okCountersCount})
                      </button>
                    </div>
                  </div>

                  {/* Counters Cards Grid */}
                  {filteredCounters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCounters.map((c) => {
                        const status = countersProgress[c.id] || "UNSTUDIED";
                        return (
                          <div
                            key={c.id}
                            className={`bg-white rounded-2xl border transition duration-200 hover:-translate-y-0.5 hover:shadow-xs overflow-hidden flex flex-col justify-between ${
                              status === "OK"
                                ? "border-green-300 shadow-3xs"
                                : status === "NOT_YET"
                                ? "border-red-300 shadow-3xs"
                                : "border-[#ece7dc]"
                            }`}
                          >
                            {/* Card Top Title bar */}
                            <div className="p-4 bg-[#fcfaf5] border-b border-[#ece7dc]/80 flex justify-between items-center gap-2">
                              <div>
                                <h3 className="text-xs font-black text-[#354f52] tracking-wide">
                                  {c.categorySinhala}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {c.categoryEnglish}
                                </p>
                              </div>
                              <div className="shrink-0 flex items-center gap-1.5">
                                <span className="px-2.5 py-1 bg-[#52796f] text-white text-[11px] font-black rounded-lg">
                                  {c.counterChar}
                                </span>
                                <span className="px-1.5 py-0.5 bg-[#eae2d0] text-[#354f52] font-mono text-[9px] font-bold rounded-md">
                                  {c.hiraganaChar}
                                </span>
                              </div>
                            </div>

                            {/* Question Word details */}
                            <div className="p-4 border-b border-[#fcfaf5] bg-[#faf8f2]/30">
                              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wide block mb-0.5">
                                ❓ Question word (ප්‍රශ්න පදය)
                              </span>
                              <div className="flex justify-between items-center gap-1">
                                <span className="font-sans text-xs font-extrabold text-[#354f52]">
                                  {c.questionWordJapanese} ({c.questionWordRomaji})
                                </span>
                                <span className="text-[10px] text-slate-600 font-bold">
                                  {c.questionWordSinhala}
                                </span>
                              </div>
                            </div>

                            {/* Numbers 1-10 items */}
                            <div className="p-4 space-y-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                                🔢 Counters 1 - 10 (ගණන් කිරීම්)
                              </span>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                {Object.keys(c.numbers).map((numKey) => {
                                  const num = Number(numKey);
                                  const val = c.numbers[num];
                                  return (
                                    <div key={num} className="flex justify-between items-center text-[11px] border-b border-dashed border-[#ece7dc]/60 pb-1">
                                      <span className="font-black text-[#52796f] mr-1">
                                        {num}:
                                      </span>
                                      <div className="text-right">
                                        <span className="font-extrabold text-[#354f52] block leading-none">
                                          {val.japanese}
                                        </span>
                                        <span className="font-mono text-[9px] text-slate-400 block mt-0.5">
                                          {val.romaji}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Action Indicators */}
                            <div className="px-4 py-3 bg-[#fcfaf5]/70 border-t border-[#ece7dc]/60 flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateCounterStatus(c.id, "NOT_YET")}
                                className={`flex-1 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition flex items-center justify-center gap-1 border ${
                                  status === "NOT_YET"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                }`}
                              >
                                ❌ Not Yet
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCounterStatus(c.id, "OK")}
                                className={`flex-1 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition flex items-center justify-center gap-1 border ${
                                  status === "OK"
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                }`}
                              >
                                ✔️ Ok
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-16 text-center bg-white rounded-2xl border border-[#ece7dc]">
                      <p className="text-sm font-semibold text-slate-400">කිසිදු ගණන් කිරීමේ පසු යෙදුමක් හමුනොවීය. (No matching counters found.)</p>
                    </div>
                  )}
                </div>
              ) : (
                /* test view */
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Select Options Panel */}
                  <div className="bg-[#fcfaf5] border border-[#e9dfcc] rounded-2xl p-4 shadow-3xs space-y-4">
                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-black text-[#354f52]">Counting System Test (ගණන් කිරීමේ පසු යෙදුම් පරීක්ෂණය)</h4>
                      <p className="text-[11px] text-slate-500 font-medium">පහතින් ඔබට අවශ්‍ය පරීක්ෂණ ක්‍රමය තෝරාගෙන ප්‍රශ්න 18කට පිළිතුරු සපයන්න.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCountersQuizOption("sinhala");
                          handleStartCountersQuiz("sinhala");
                        }}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          countersQuizOption === "sinhala"
                            ? "bg-[#52796f] border-0 text-white font-black shadow-3xs"
                            : "bg-white border-[#ece7dc] text-[#354f52] hover:bg-slate-50 hover:border-slate-300 font-bold text-xs"
                        }`}
                      >
                        <span className="block text-xs">සිංහල තේරුම තෝරන්න</span>
                        <span className="block text-[9px] opacity-75 mt-0.5">Sinhala Meaning Quiz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCountersQuizOption("japanese");
                          handleStartCountersQuiz("japanese");
                        }}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          countersQuizOption === "japanese"
                            ? "bg-[#52796f] border-0 text-white font-black shadow-3xs"
                            : "bg-white border-[#ece7dc] text-[#354f52] hover:bg-slate-50 hover:border-slate-300 font-bold text-xs"
                        }`}
                      >
                        <span className="block text-xs">ජපන් පදය තෝරන්න</span>
                        <span className="block text-[9px] opacity-75 mt-0.5">Japanese Reading Quiz</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCountersQuizOption("relationship");
                          handleStartCountersQuiz("relationship");
                        }}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          countersQuizOption === "relationship"
                            ? "bg-[#52796f] border-0 text-white font-black shadow-3xs"
                            : "bg-white border-[#ece7dc] text-[#354f52] hover:bg-slate-50 hover:border-slate-300 font-bold text-xs"
                        }`}
                      >
                        <span className="block text-xs">පසුයෙදුම් සම්බන්ධතාවය</span>
                        <span className="block text-[9px] opacity-75 mt-0.5">Counter Context Quiz</span>
                      </button>
                    </div>
                  </div>

                  {countersQuizDeck.length > 0 && currentCountersQuizIndex < countersQuizDeck.length ? (
                    <div className="bg-white rounded-2xl border border-[#ece7dc] p-6 shadow-3xs space-y-6">
                      {/* Queue position index */}
                      <div className="flex justify-between items-center text-xs pb-3 border-b border-[#fcfaf5]">
                        <span className="text-[#84a98c] font-bold">
                          QUESTION <span className="font-mono bg-[#f0ede6] px-2 py-0.5 rounded text-[#2f3e46] font-black">{currentCountersQuizIndex + 1}</span> / {countersQuizDeck.length}
                        </span>
                        <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                          Score: {countersQuizScore} / {currentCountersQuizIndex}
                        </span>
                      </div>

                      {/* Question Description */}
                      <div className="p-4 bg-[#fcfaf5] rounded-xl border border-[#e9dfcc] text-center space-y-2">
                        <span className="text-[10px] font-black text-[#52796f] uppercase tracking-wider block">Question (ප්‍රශ්නය)</span>
                        <h3 className="text-base font-black text-[#2f3e46] leading-relaxed">
                          {countersQuizDeck[currentCountersQuizIndex].description}
                        </h3>
                      </div>

                      {/* Four choices options list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {countersQuizDeck[currentCountersQuizIndex].choices.map((choice) => {
                          const isCorrectChoice = choice === countersQuizDeck[currentCountersQuizIndex].correctAnswer;
                          const isSelectedChoice = choice === selectedCountersChoice;
                          let btnStyle = "bg-white border-[#ece7dc] text-[#354f52] hover:bg-slate-50 hover:border-slate-400";
                          
                          if (hasSubmittedCountersQuiz) {
                            if (isCorrectChoice) {
                              btnStyle = "bg-green-100 border-green-400 text-green-900 font-extrabold";
                            } else if (isSelectedChoice) {
                              btnStyle = "bg-red-100 border-red-400 text-red-900 font-extrabold";
                            } else {
                              btnStyle = "bg-white border-[#f0ede6] text-slate-300 pointer-events-none";
                            }
                          } else if (isSelectedChoice) {
                            btnStyle = "bg-[#fcfaf5] border-[#bc6c25] text-[#bc6c25] font-extrabold ring-2 ring-[#bc6c25]/10";
                          }

                          return (
                            <button
                              key={choice}
                              type="button"
                              disabled={hasSubmittedCountersQuiz}
                              onClick={() => setSelectedCountersChoice(choice)}
                              className={`p-4 rounded-xl border text-left text-xs font-bold transition duration-150 cursor-pointer flex justify-between items-center ${btnStyle}`}
                            >
                              <span>{choice}</span>
                              {hasSubmittedCountersQuiz && isCorrectChoice && (
                                <span className="text-green-600 text-lg font-black">✔️</span>
                              )}
                              {hasSubmittedCountersQuiz && isSelectedChoice && !isCorrectChoice && (
                                <span className="text-red-600 text-lg font-black">❌</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback banner */}
                      {hasSubmittedCountersQuiz && (
                        <div className={`p-4 rounded-xl text-center font-bold text-xs ${
                          selectedCountersChoice === countersQuizDeck[currentCountersQuizIndex].correctAnswer
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                        }`}>
                          {selectedCountersChoice === countersQuizDeck[currentCountersQuizIndex].correctAnswer ? (
                            <p>☀️ නිවැරදියි! (Correct!) - ඔබට ලකුණු +1 ක් හිමිවිය.</p>
                          ) : (
                            <p>❌ වැරදියි! (Incorrect) - නිවැරදි පිළිතුර: {countersQuizDeck[currentCountersQuizIndex].correctAnswer}</p>
                          )}
                        </div>
                      )}

                      {/* Control Button bar */}
                      <div className="flex gap-3 justify-end pt-3 border-t border-[#ece7dc]/60">
                        {!hasSubmittedCountersQuiz ? (
                          <button
                            type="button"
                            disabled={!selectedCountersChoice}
                            onClick={() => {
                              if (!selectedCountersChoice) return;
                              setHasSubmittedCountersQuiz(true);
                              const isCorrect = selectedCountersChoice === countersQuizDeck[currentCountersQuizIndex].correctAnswer;
                              if (isCorrect) {
                                setCountersQuizScore((prev) => prev + 1);
                                handleUpdateCounterStatus(countersQuizDeck[currentCountersQuizIndex].counterId, "OK");
                              } else {
                                handleUpdateCounterStatus(countersQuizDeck[currentCountersQuizIndex].counterId, "NOT_YET");
                              }
                            }}
                            className={`py-3 px-6 rounded-xl text-xs font-black transition shadow-xs cursor-pointer ${
                              selectedCountersChoice
                                ? "bg-[#bc6c25] hover:bg-[#833e00] text-white"
                                : "bg-slate-100 text-slate-400 border border-slate-200 pointer-events-none"
                            }`}
                          >
                            ✔️ Submit Answer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentCountersQuizIndex((prev) => prev + 1);
                              setSelectedCountersChoice(null);
                              setHasSubmittedCountersQuiz(false);
                            }}
                            className="py-3 px-6 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer"
                          >
                            Next Question ➡️
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Finished results */
                    <div className="bg-white rounded-2xl border border-[#ece7dc] p-8 shadow-xs text-center space-y-6">
                      <div className="space-y-2">
                        <span className="text-3xl">🏆</span>
                        <h3 className="text-lg font-black text-[#354f52]">Counting Quiz Completed!</h3>
                        <p className="text-xs text-slate-500">පරීක්ෂණය සාර්ථකව අවසන් කරන ලදී.</p>
                      </div>

                      <div className="p-6 bg-[#fcfaf5] rounded-2xl border border-[#e9dfcc] max-w-sm mx-auto space-y-1">
                        <span className="text-[10px] font-black text-[#52796f] uppercase block">Total Score (මුළු ලකුණු)</span>
                        <p className="text-4xl font-black font-display text-[#bc6c25]">
                          {countersQuizScore} <span className="text-sm font-medium text-slate-400">/ 18</span>
                        </p>
                        <p className="text-xs font-bold text-slate-500 pt-2">
                          {countersQuizScore >= 15 ? "☀️ විශිෂ්ටයි! (Excellent!)" : countersQuizScore >= 10 ? "✨ හොඳයි! (Good Job!)" : "📚 තවදුරටත් අධ්‍යයනය කරන්න (Keep Practicing!)"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartCountersQuiz(countersQuizOption)}
                        className="py-3 px-8 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer inline-flex items-center gap-1.5"
                      >
                        🔄 Restart Practice Test
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STUDY GRAMMAR PATTERNS */}
        {activeTab === "grammar" && (
          <div className="space-y-6" id="tab-panel-grammar">
            <div className="space-y-6" id="jft-grammar-section">
            
            {/* Grammar Stats Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Box 1: Grammar Study Stats Card */}
              <div className="lg:col-span-8 bg-white border border-[#e9e2d7] p-6 rounded-[28px] shadow-sm flex flex-col justify-between" id="grammar-stats-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#cad2c5]/40 text-[#52796f]">
                      🎯 JFT-BASIC A2 GRAMMAR MASTERY
                    </span>
                    <h3 className="text-lg font-black text-[#354f52]">
                      ව්‍යාකරණ රටා අධ්‍යයන ප්‍රගතිය (Grammar Status Tracker)
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      JFT N4 විභාගයට අදාළව නිතර අසන ප්‍රධානතම ව්‍යාකරණ රටා 20කට වඩා (Lessons 01-11, 64-65, 67-75) මෙහි අඩංගු වේ.
                    </p>
                  </div>
                  
                  {/* Circular Percent tracker count */}
                  <div className="bg-[#fcfaf2] border border-[#e9e2d7] p-4 rounded-2xl text-center shrink-0 min-w-[120px]">
                    <span className="text-[9px] font-black text-slate-400 block tracking-wider uppercase">MASTERY</span>
                    <span className="text-2xl font-black text-[#52796f] leading-none block my-1">
                      {percentGrammarComplete}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Completed OK</span>
                  </div>
                </div>

                {/* Progress bar and metrics indicators */}
                <div className="space-y-3 mt-6 border-t border-[#f0ede6] pt-4">
                  <div className="w-full bg-[#f0ede6] rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#52796f] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentGrammarComplete}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] font-bold text-[#84a98c] block uppercase">OK</span>
                      <span className="text-sm font-extrabold text-[#52796f]">✔️ {okGrammarCount}</span>
                    </div>
                    <div className="p-2 bg-[#ece2d0]/30 border border-[#ece2d0]/50 rounded-xl">
                      <span className="text-[9px] font-bold text-[#bc6c25] block uppercase">NOT YET</span>
                      <span className="text-sm font-extrabold text-[#bc6c25]">❌ {notYetGrammarCount}</span>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] font-bold text-[#84a98c] block uppercase">TOTAL CONTEXT (මුළු එකතුව)</span>
                      <span className="text-sm font-extrabold text-[#354f52]">📋 {grammarList.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Actions & Configuration Panel */}
              <div className="lg:col-span-4 bg-[#ece2d0]/25 border border-[#e9e2d7] p-6 rounded-[28px] shadow-sm flex flex-col justify-between" id="grammar-config-card">
                <div>
                  <h4 className="font-display font-bold text-xs text-[#bc6c25] uppercase tracking-widest flex items-center gap-1.5">
                    ⚙️ Settings & Reference
                  </h4>
                  <p className="text-xs text-[#2f3e46] mt-1.5 leading-relaxed font-semibold">
                    සෑම ව්‍යාකරණ කාඩ්පතක්ම ක්ලික් කර (Click/Tap) හරහා එහි අනෙක් පැත්ත හරවා ආදර්ශ වාක්‍ය, සිංහල තේරුම සහ භාවිතය අධ්‍යයනය කරන්න.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleResetGrammarProgress}
                    className="w-full py-2.5 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#bc6c25] transition shadow-xs cursor-pointer"
                  >
                    🧹 Clear Grammar Progress Data
                  </button>
                  <div className="p-3 bg-white border border-[#e9e2d7] rounded-xl text-[10px] text-slate-500 font-semibold leading-relaxed">
                    💡 Click the speaker icon inside any example sentence to listen to accurate voice pronunciation.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Practice Search Filter controls */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-5 bg-white rounded-[24px] border border-[#e9e2d7] shadow-sm" id="grammar-controls-row">
              
              {/* Status Filter Toggle */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Status Filtering (පෙරහන්)
                </span>
                <div className="flex items-center gap-1 bg-[#f0ede6] p-1 rounded-xl border border-[#e9e2d7] self-start">
                  <button
                    type="button"
                    onClick={() => setActiveGrammarFilter("ALL")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeGrammarFilter === "ALL"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    📖 All Lessons ({grammarList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGrammarFilter("NOT_YET")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeGrammarFilter === "NOT_YET"
                        ? "bg-white text-[#bc6c25] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#bc6c25]"
                    }`}
                  >
                    ❌ Not Yet ({notYetGrammarCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGrammarFilter("OK")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeGrammarFilter === "OK"
                        ? "bg-white text-[#52796f] shadow-xs font-black"
                        : "text-[#84a98c] hover:text-[#52796f]"
                    }`}
                  >
                    ✔️ OK ({okGrammarCount})
                  </button>
                </div>
              </div>

              {/* Text Search Element */}
              <div className="flex flex-col gap-1.5 flex-1 max-w-sm">
                <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">
                  Search Grammar (ව්‍යාකරණ සොයන්න)
                </span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84a98c]" />
                  <input
                    type="text"
                    value={grammarSearchQuery}
                    onChange={(e) => setGrammarSearchQuery(e.target.value)}
                    placeholder="සොයන්න (e.g. Lesson 02, koto ga arimasu, අත්දැකීම්...)"
                    className="w-full text-xs rounded-xl border border-[#e9e2d7] pl-10 pr-4 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                  />
                </div>
              </div>
            </div>

            {/* Grammar Card vertical list layout - stacked beautifully with comfortable maximum width */}
            {filteredGrammars.length > 0 ? (
              <div className="flex flex-col gap-6 max-w-4xl mx-auto" id="grammar-deck-layout">
                {filteredGrammars.map((grammar) => (
                  <GrammarCardView
                    key={grammar.id}
                    grammar={grammar}
                    status={grammarProgress[grammar.id] || "UNSTUDIED"}
                    onStatusChange={(status) => handleUpdateGrammarStatus(grammar.id, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#e9e2d7] shadow-sm" id="grammar-empty-state">
                <p className="text-sm font-semibold text-slate-400">ව්‍යාකරණ රටා කිසිවක් හමු නොවීය. Select other search criteria.</p>
                <p className="text-xs text-slate-300 mt-1">සෙවුම් පද නැවත පරීක්ෂා කර බැලීමට උත්සාහ කරන්න.</p>
              </div>
            )}
          </div>
        </div>)}

        {/* TAB 5: ADVANCED MULTIPLE CHOICE SUPER QUIZ */}
        {activeTab === "quiz" && (
          <div id="tab-panel-quiz">
            <QuizView
              kanjiCards={cards}
              verbsList={verbs}
              adjectivesList={adjectives}
              onBackToLearn={() => setActiveTab("learn")}
            />
          </div>
        )}

        {/* TAB 6: JFT VOCABULARY DICTIONARY */}
        {activeTab === "dictionary" && (
          <div id="tab-panel-dictionary">
            <DictionaryView />
          </div>
        )}

        {/* TAB 7: JFT PROGRESS STATISTICS */}
        {activeTab === "stats" && (
          <div id="tab-panel-stats">
            <StatisticsView
              kanjiCards={cards}
              kanjiProgress={progress}
              verbsList={verbs}
              verbsProgress={verbsProgress}
              adjectivesList={adjectives}
              adjectivesProgress={adjectivesProgress}
              grammarList={grammarList}
              grammarProgress={grammarProgress}
              onClearProgress={(category) => {
                if (category === "kanji" || category === "all") {
                  setProgress({});
                  localStorage.removeItem("jft_kanji_progress");
                }
                if (category === "verbs" || category === "all") {
                  setVerbsProgress({});
                  localStorage.removeItem("jft_verbs_progress");
                }
                if (category === "adjectives" || category === "all") {
                  setAdjectivesProgress({});
                  localStorage.removeItem("jft_adjectives_progress");
                }
                if (category === "grammar" || category === "all") {
                  setGrammarProgress({});
                  localStorage.removeItem("jft_grammar_progress");
                }
              }}
            />
          </div>
        )}

        {/* TAB 8: PROFILE AND GLOBAL LEADERBOARD */}
        {activeTab === "profile" && (
          <div className="space-y-8 max-w-6xl mx-auto" id="tab-panel-profile">
            
            {/* Header banner */}
            <div className="p-6 bg-white rounded-[28px] border border-[#e9e2d7] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-display font-black text-xl text-[#354f52] flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> Profile & Collective Leaderboard (ප්‍රොෆයිල් සහ ශ්‍රේණිගත කිරීම්)
                </h3>
                <p className="text-xs text-[#84a98c] mt-1.5 leading-relaxed">
                  මෙතැනින් ඔබට ඔබේම ගිණුමක් සකසාගෙන ප්‍රගතිය ජාලය හරහා උඩුගත (Sync) කළ හැකියි. ලීඩර්බෝඩ් එක හරහා අනෙකුත් සිසුන් සමඟ තරඟ කිරීමට සහ ප්‍රගති දත්ත (Progress JSON Backup) බාගත කිරීමටද හැකියාව ඇත.
                </p>
              </div>

              {/* Instant JSON data Backup Controls */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={downloadProgressJSON}
                  className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download Backup (.json)
                </button>
                <label className="py-2.5 px-4 bg-white border border-[#52796f] hover:bg-[#faf8f5] text-[#52796f] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center">
                  <Upload className="w-4 h-4" /> Upload Backup (.json)
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreProgressJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Account Profile setup details */}
              <div className="lg:col-span-5 space-y-6">
                {!userProfile ? (
                  <div className="bg-white p-6 rounded-[24px] border border-[#e9e2d7] shadow-sm space-y-6">
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-[#354f52] uppercase tracking-wider flex items-center gap-1.5">
                        👤 Create Your Profile (නව ගිණුමක් සාදන්න)
                      </h4>
                      <p className="text-[11px] text-[#84a98c] mt-1">
                        මාලිගාවට පිවිසීමට ඔබේ නම, ඊමේල් ලිපිනය සහ කැමති අවතාරයක් තෝරාගන්න.
                      </p>
                    </div>

                    {/* Dynamic Google Sign-In Integrations */}
                    <div className="p-4 bg-[#fdfbf7] border border-[#e9e2d7]/80 rounded-xl space-y-3.5">
                      <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-widest block">
                        ⚡ Google Sign-In Option
                      </span>
                      
                      {/* Mount Point for dynamic Google SDK Button */}
                      <div id="google-signin-btn-container" className="w-full"></div>

                      <div className="flex items-center justify-center gap-2 py-0.5 text-xs text-slate-400">
                        <div className="h-px bg-[#e9e2d7] flex-1"></div>
                        <span className="shrink-0 font-bold uppercase tracking-wider text-[9px]">Or Quick Login</span>
                        <div className="h-px bg-[#e9e2d7] flex-1"></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const randomId = Math.floor(100 + Math.random() * 900);
                          const mockName = prompt("ඔබගේ නම ඇතුළත් කරන්න (Your Name):", "Guest Learner") || "Guest Learner";
                          const mockEmail = `${mockName.toLowerCase().replace(/\s+/g, "")}${randomId}@mockgoogle.com`;
                          const mockAvatars = ["🦊", "🐼", "🚀", "🎓", "🗻", "🍣", "🌸", "🎏"];
                          const chosenAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];

                          const simulatedProfile = {
                            username: mockName,
                            email: mockEmail,
                            avatar: chosenAvatar,
                            joinedAt: new Date().toISOString(),
                          };
                          setUserProfile(simulatedProfile);
                        }}
                        className="w-full py-2 bg-white border border-[#bc6c25]/40 hover:bg-[#ece2d0]/20 rounded-lg text-xs font-bold text-[#bc6c25] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        🌟 One-Click Google Login Simulation
                      </button>
                    </div>

                    {/* Manual signup form fallback */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const username = formData.get("username") as string;
                        const email = formData.get("email") as string;
                        const avatar = formData.get("avatar") as string;

                        if (!username.trim() || !email.trim()) {
                          alert("කරුණාකර සියලුම තොරතුරු නිවැරදිව පුරවන්න.");
                          return;
                        }

                        setUserProfile({
                          username,
                          email,
                          avatar,
                          joinedAt: new Date().toISOString(),
                        });
                      }}
                      className="space-y-4 pt-2 border-t border-[#f0ede6]"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider">
                          Username (පරිශීලක නාමය)
                        </label>
                        <input
                          type="text"
                          name="username"
                          required
                          placeholder="e.g. Ruwan Silva"
                          className="w-full text-xs rounded-xl border border-[#e9e2d7] px-3.5 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider">
                          Email (ඊමේල් ලිපිනය - leaderboard sync සඳහා)
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="e.g. ruwan@gmail.com"
                          className="w-full text-xs rounded-xl border border-[#e9e2d7] px-3.5 py-2.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f]"
                        />
                      </div>

                      {/* Avatar Picker */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-[#52796f] uppercase tracking-wider mb-1">
                          Choose Avatar (අවතාරයක් තෝරන්න)
                        </label>
                        <div className="grid grid-cols-5 gap-2 bg-[#fdfbf7] p-2.5 rounded-xl border border-[#e9e2d7] shadow-3xs text-center">
                          {["🦊", "🐼", "🚀", "🎓", "🗻", "🍣", "🌸", "🎏", "💡", "🥋"].map((emoji) => (
                            <label
                              key={emoji}
                              className="flex items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-white hover:scale-110 active:scale-95 transition-all text-lg shadow-3xs"
                            >
                              <input
                                type="radio"
                                name="avatar"
                                value={emoji}
                                defaultChecked={emoji === "🦊"}
                                className="sr-only peer"
                              />
                              <span className="peer-checked:bg-[#bc6c25]/15 peer-checked:ring-2 peer-checked:ring-[#bc6c25]/50 px-2 py-1 rounded-md transition duration-150">
                                {emoji}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-black tracking-wide transition shadow-md cursor-pointer"
                      >
                        💾 Create Account & Sync Score
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Active logged-in profile card */}
                    <div className="bg-white p-6 rounded-[28px] border border-[#e9e2d7] shadow-sm space-y-6 relative overflow-hidden">
                      {/* Soft decorative background element */}
                      <div className="absolute top-0 right-0 w-28 h-28 bg-[#cad2c5]/20 rounded-bl-full pointer-events-none"></div>

                      <div className="flex items-center gap-4 relative z-10">
                        {userProfile.avatar.startsWith("http") ? (
                          <img
                            src={userProfile.avatar}
                            alt="Avatar"
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-full border-2 border-[#bc6c25] object-cover bg-[#fdfbf7] shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#ece2d0] border-2 border-[#bc6c25] flex items-center justify-center text-3xl shadow-sm">
                            {userProfile.avatar}
                          </div>
                        )}

                        <div>
                          <span className="text-[9px] font-black text-white bg-[#bc6c25] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Student
                          </span>
                          <h4 className="font-display font-black text-base text-[#354f52] mt-1">{userProfile.username}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{userProfile.email}</p>
                        </div>
                      </div>

                      <div className="border-t border-[#f0ede6] pt-4 space-y-3.5">
                        <span className="text-[10px] font-black text-[#52796f] uppercase tracking-wider block">
                          📂 Current Performance Records (ප්‍රගතිය)
                        </span>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] text-center shadow-3xs">
                            <span className="text-[9px] font-bold text-[#84a98c] block uppercase">Kanji</span>
                            <span className="text-sm font-black text-[#52796f]">{okCount} <span className="text-[10px] font-medium text-slate-400">/ {cards.length}</span></span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] text-center shadow-3xs">
                            <span className="text-[9px] font-bold text-[#84a98c] block uppercase">Verbs</span>
                            <span className="text-sm font-black text-[#52796f]">{okVerbsCount} <span className="text-[10px] font-medium text-slate-400">/ {verbs.length}</span></span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] text-center shadow-3xs">
                            <span className="text-[9px] font-bold text-[#84a98c] block uppercase">Adjectives</span>
                            <span className="text-sm font-black text-[#52796f]">{okAdjectivesCount} <span className="text-[10px] font-medium text-slate-400">/ {adjectives.length}</span></span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] text-center shadow-3xs">
                            <span className="text-[9px] font-bold text-[#84a98c] block uppercase">Counters</span>
                            <span className="text-sm font-black text-[#52796f]">{okCountersCount} <span className="text-[10px] font-medium text-slate-400">/ {counters.length}</span></span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] text-center shadow-3xs col-span-2">
                            <span className="text-[9px] font-bold text-[#84a98c] block uppercase">Grammar</span>
                            <span className="text-sm font-black text-[#52796f]">{okGrammarCount} <span className="text-[10px] font-medium text-slate-400">/ {grammarList.length}</span></span>
                          </div>
                        </div>

                        {/* Grand Total Progress representation */}
                        <div className="bg-[#ece2d0]/20 border border-[#e9e2d7] rounded-xl p-3.5 text-center shadow-3xs">
                          <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-wider">🏆 COMPILATION SCORE (SCOREBOARD SCORE)</span>
                          <p className="text-3xl font-display font-black text-[#354f52] mt-1">
                            {okCount + okVerbsCount + okAdjectivesCount + okGrammarCount + okCountersCount}
                          </p>
                          <p className="text-[9px] font-bold text-[#84a98c] mt-0.5">Sum of all cards mastered with status "OK"</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("ඔබගේ වත්මන් Profile එකෙන් ඉවත් වීමට අවශ්‍ය ද? Are you sure you want to log out?")) {
                              // Completely wipe current study progress out of memory and localStorage
                              setProgress({});
                              setVerbsProgress({});
                              setAdjectivesProgress({});
                              setGrammarProgress({});
                              setCountersProgress({});
                              
                              localStorage.removeItem("jft_user_profile");
                              localStorage.removeItem("jft_kanji_progress");
                              localStorage.removeItem("jft_verbs_progress");
                              localStorage.removeItem("jft_adjectives_progress");
                              localStorage.removeItem("jft_grammar_progress");
                              localStorage.removeItem("jft_counters_progress");

                              setUserProfile(null);
                            }
                          }}
                          className="flex-1 py-2.5 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-xs font-bold text-[#bc6c25] transition cursor-pointer text-center shadow-3xs"
                        >
                          🚪 Logout / Switch Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => syncProfileWithServer(userProfile)}
                          className="py-2.5 px-4 bg-[#cad2c5] hover:bg-[#cad2c5]/85 border border-[#e9e2d7] text-[#354f52] rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-3xs"
                          title="Force Sync Now"
                        >
                          🔄 Sync Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Real-time collective leaderboard */}
              <div className="lg:col-span-7 bg-white p-6 rounded-[28px] border border-[#e9e2d7] shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-[#f0ede6]">
                  <div>
                    <h4 className="font-display font-black text-sm text-[#354f52] uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500 animate-pulse" /> Live Scoreboard Leaderboard (සිසුන්ගේ ශ්‍රේණිගත කිරීම)
                    </h4>
                    <p className="text-[10px] text-[#84a98c] mt-0.5">
                      සියලුම සිසුන්ගේ පාඩම් නිමකළ කාඩ්පත් ප්‍රමාණයන් (OK Score) අනුව ශ්‍රේණිගත කිරීම්.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={fetchLeaderboard}
                    className="p-1 px-2 text-[10px] font-bold bg-[#fdfbf7] border border-[#e9e2d7] rounded-lg hover:border-[#84a98c] text-[#52796f] transition"
                  >
                    Refresh 🔄
                  </button>
                </div>

                {isLeaderboardLoading ? (
                  <div className="p-16 text-center">
                    <div className="w-10 h-10 border-4 border-t-transparent border-[#52796f] animate-spin rounded-full inline-block mb-3"></div>
                    <p className="text-xs font-semibold text-slate-400">ලීඩර්බෝඩ් දත්ත පූරණය වෙමින් පවතී (Loading ranking data)...</p>
                  </div>
                ) : leaderboard.length > 0 ? (
                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {leaderboard.map((player, idx) => {
                      const isMe = userProfile && hashEmailSafe(userProfile.email) === player.id;
                      const rankingBadges = ["🥇", "🥈", "🥉"];
                      const isTopThree = idx < 3;

                      return (
                        <div
                          key={player.id || idx}
                          className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-4 ${
                            isMe
                              ? "bg-[#bc6c25]/5 border-[#bc6c25] ring-2 ring-[#bc6c25]/10 shadow-sm"
                              : "bg-[#fdfbf7] border-[#e9e2d7] hover:border-[#cad2c5]/60 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Ranking Placement Badge */}
                            <span className="w-8 font-display text-center font-black text-sm text-slate-500 flex items-center justify-center">
                              {isTopThree ? rankingBadges[idx] : `#${idx + 1}`}
                            </span>

                            {player.avatar?.startsWith("http") ? (
                              <img
                                src={player.avatar}
                                alt={player.username}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full border border-[#e9e2d7] object-cover bg-white"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#ece2d0]/50 border border-t-[#e9e2d7] flex items-center justify-center text-xl shadow-inner">
                                {player.avatar || "👤"}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-sans font-black text-xs text-[#354f52]">
                                  {player.username}
                                </span>
                                {player.targetExam && (
                                  <span className="text-[8px] font-black bg-[#52796f]/10 text-[#52796f] border border-[#52796f]/25 rounded-md px-1.5 py-0.5">
                                    {player.targetExam}
                                  </span>
                                )}
                                {isMe && (
                                  <span className="text-[8px] font-black bg-[#bc6c25]/15 text-[#bc6c25] border border-[#bc6c25]/30 rounded-md px-1.5 py-0.5">
                                    You (ඔබ)
                                  </span>
                                )}
                              </div>
                              
                              {/* Sub progress counts badge tags */}
                              <div className="flex items-center gap-1.5 mt-1 text-[8px] font-semibold text-slate-400">
                                <span className="bg-slate-50 px-1 rounded-sm border border-slate-100">K: {player.kanjiProgress || 0}</span>
                                <span className="bg-slate-50 px-1 rounded-sm border border-slate-100">V: {player.verbsProgress || 0}</span>
                                <span className="bg-slate-50 px-1 rounded-sm border border-slate-100">A: {player.adjectivesProgress || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Mastered Scores metrics counter */}
                          <div className="text-right">
                            <span className="text-xs font-black text-[#bc6c25] block">
                              🏆 {player.totalProgress || 0}
                            </span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                              mastered
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#e9e2d7]">
                    <Users className="w-8 h-8 text-[#cad2c5] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#84a98c]">ලීඩර්බෝඩ් එක තවමත් හිස්ව පවතී. Scoreboard as pristine as snow!</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">ප්‍රථමයෙන් ඔබේ ගිණුම සාදාගෙන ප්‍රගති දත්ත update කරන්න.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </main>


      {/* Cozy, Soft Light Theme Footer */}
      <footer className="bg-[#f0ede6] text-[#352d28] py-10 border-t-2 border-[#e9e2d7] mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2.5">
          <p className="font-extrabold text-[#52796f] font-display text-sm tracking-wide">JFT & N4 Learning Helper</p>
          <p className="text-[11px] text-[#bc6c25] bg-[#ece2d0] inline-block px-4 py-1.5 rounded-full border border-[#e9e2d7] font-bold uppercase tracking-wider mt-1 shadow-3xs">
            💻 Developed by: <span className="text-[#233d30] font-black font-sans">H.D. Rusith Heshan Induwara</span>
          </p>
          <p className="text-[10px] text-[#52796f]/80 mt-2 font-semibold">
            Powered by Node.js Server Environment, Express APIs & Google Gemini AI Core
          </p>
          <p className="text-[11px] text-[#bc6c25] font-black mt-3">
            ❤️ JFT සහ JLPT විභාග ජයගැනීමට අපෙන් උණුසුම් සුභපැතුම්! ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
