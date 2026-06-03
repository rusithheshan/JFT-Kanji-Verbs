import { useState, useEffect, FormEvent, ChangeEvent } from "react";
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
  HelpCircle
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

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"learn" | "test" | "verbs" | "adjectives" | "grammar" | "quiz" | "dictionary">("learn");

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

  // Search, Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");

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

  // Set up testing/shuffled deck whenever we enter knowledge check mode or cards list updates
  useEffect(() => {
    if (activeTab === "test") {
      shuffleTestDeck();
    }
  }, [activeTab]);

  const shuffleTestDeck = () => {
    const deck = [...cards];
    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setTestDeck(deck);
    setCurrentTestIndex(0);
    setIsTestCardRevealed(false);
  };

  // Update a card progress status
  const handleUpdateStatus = (cardId: string, status: LearningStatus) => {
    setProgress((prev) => ({
      ...prev,
      [cardId]: status,
    }));
  };

  // Update a verb progress status
  const handleUpdateVerbStatus = (verbId: string, status: LearningStatus) => {
    setVerbsProgress((prev) => ({
      ...prev,
      [verbId]: status,
    }));
  };

  // Update an adjective progress status
  const handleUpdateAdjectiveStatus = (adjId: string, status: LearningStatus) => {
    setAdjectivesProgress((prev) => ({
      ...prev,
      [adjId]: status,
    }));
  };

  // Update a grammar progress status
  const handleUpdateGrammarStatus = (grammarId: string, status: LearningStatus) => {
    setGrammarProgress((prev) => ({
      ...prev,
      [grammarId]: status,
    }));
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

  // Filtering criteria
  const filteredCards = cards.filter((card) => {
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

  // Calculate scores/ratios
  const okCount = cards.reduce((sum, card) => (progress[card.id] === "OK" ? sum + 1 : sum), 0);
  const notYetCount = cards.reduce((sum, card) => (progress[card.id] === "NOT_YET" ? sum + 1 : sum), 0);
  const percentComplete = cards.length > 0 ? Math.round((okCount / cards.length) * 100) : 0;

  // Verb scores/ratios and filtering
  const okVerbsCount = verbs.reduce((sum, v) => (verbsProgress[v.id] === "OK" ? sum + 1 : sum), 0);
  const notYetVerbsCount = verbs.reduce((sum, v) => (verbsProgress[v.id] === "NOT_YET" ? sum + 1 : sum), 0);
  const percentVerbsComplete = verbs.length > 0 ? Math.round((okVerbsCount / verbs.length) * 100) : 0;

  const filteredVerbs = verbs.filter((verb) => {
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

  // Adjective scores/ratios and filtering
  const okAdjectivesCount = adjectives.reduce((sum, a) => (adjectivesProgress[a.id] === "OK" ? sum + 1 : sum), 0);
  const notYetAdjectivesCount = adjectives.reduce((sum, a) => (adjectivesProgress[a.id] === "NOT_YET" ? sum + 1 : sum), 0);
  const percentAdjectivesComplete = adjectives.length > 0 ? Math.round((okAdjectivesCount / adjectives.length) * 100) : 0;

  const filteredAdjectives = adjectives.filter((adj) => {
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

  // Grammar scores/ratios and filtering
  const okGrammarCount = grammarList.reduce((sum, g) => (grammarProgress[g.id] === "OK" ? sum + 1 : sum), 0);
  const notYetGrammarCount = grammarList.reduce((sum, g) => (grammarProgress[g.id] === "NOT_YET" ? sum + 1 : sum), 0);
  const percentGrammarComplete = grammarList.length > 0 ? Math.round((okGrammarCount / grammarList.length) * 100) : 0;

  const filteredGrammars = grammarList.filter((grammar) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#2f3e46]" id="main-jft-container">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e9e2d7] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#52796f] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#52796f]/15">
              漢字
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-[#354f52]">
                JFT & N4 Learning Helper
              </h1>
              <p className="text-xs text-[#84a98c] font-medium">
                Sinhala & English Translations with Real-time Assessor
              </p>
            </div>
          </div>

          {/* Quick Metrics Overlay */}
          <div className="flex items-center gap-4 bg-[#fdfbf7] border border-[#e9e2d7] rounded-2xl p-2 px-3.5 self-start md:self-auto">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#84a98c] tracking-wider uppercase">
                  Progress Score
                </span>
                <span className="text-xs font-bold text-[#52796f]">{percentComplete}%</span>
              </div>
              <div className="w-32 bg-[#f0ede6] rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-[#52796f] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>
            <div className="border-l border-[#e9e2d7] pl-3.5 h-8 flex items-center gap-2">
              <span className="text-sm font-semibold text-[#354f52]">
                ✔️ {okCount} <span className="text-xs text-[#84a98c]">OK</span>
              </span>
              <span className="text-sm font-semibold text-[#354f52] border-l border-[#e9e2d7] pl-2">
                ❌ {notYetCount} <span className="text-xs text-[#84a98c]">NOT YET</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global tab Switcher row split beautifully into 2 rows to fit smaller screens and make spacing clean */}
        <div className="bg-[#fdbbf7]/0 border-t border-[#e9e2d7] px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2.5 w-full">
              {/* Row 1: Primary core study cards (4 items) */}
              <div className="flex flex-wrap gap-1.5 bg-[#f0ede6]/70 p-1.5 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab("learn")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "learn"
                      ? "bg-white text-[#52796f] shadow-xs font-black border border-[#e9e2d7]/50"
                      : "text-[#84a98c] hover:bg-white/40 hover:text-[#52796f]"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#52796f]" /> JFT Kanji
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("test")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "test"
                      ? "bg-white text-[#52796f] shadow-xs font-black border border-[#e9e2d7]/50"
                      : "text-[#84a98c] hover:bg-white/40 hover:text-[#52796f]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Check Kanji Knowledge
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("verbs")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "verbs"
                      ? "bg-white text-[#52796f] shadow-xs font-black border border-[#e9e2d7]/50"
                      : "text-[#84a98c] hover:bg-white/40 hover:text-[#52796f]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-orange-500" /> Verbs (ක්‍රියාපද)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("adjectives")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "adjectives"
                      ? "bg-white text-[#52796f] shadow-xs font-black border border-[#e9e2d7]/50"
                      : "text-[#84a98c] hover:bg-white/40 hover:text-[#52796f]"
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" /> Adjectives (විශේෂණ)
                </button>
              </div>

              {/* Row 2: Secondary grammar context, interactive quiz and JFT Book Dictionary (3 items) */}
              <div className="flex flex-wrap gap-1.5 bg-[#ece2d0]/50 p-1.5 rounded-2xl w-fit border border-[#e9e2d7]/40 shadow-3xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("grammar")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "grammar"
                      ? "bg-white text-[#bc6c25] shadow-xs font-black border border-[#bc6c25]/15"
                      : "text-[#bc6c25]/75 hover:bg-white/40 hover:text-[#bc6c25]"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#bc6c25]" /> Learn Grammar (ව්‍යාකරණ)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("quiz")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "quiz"
                      ? "bg-white text-[#52796f] shadow-xs font-black border border-[#e9e2d7]/40"
                      : "text-[#84a98c] hover:bg-white/40 hover:text-[#52796f]"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Super Quiz (ප්‍රශ්නාවලිය)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dictionary")}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "dictionary"
                      ? "bg-teal-700 text-white shadow-xs font-black"
                      : "text-teal-800 hover:bg-teal-50"
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" /> JFT Dictionary (ශබ්දකෝෂය)
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* TAB 1: LEARN JFT KANJI */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            
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
                  ❌ Not Yet ({notYetCount})
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="kanji-deck-layout">
                {filteredCards.map((card, index) => (
                  <KanjiCardView
                    key={card.id}
                    card={card}
                    status={progress[card.id] || "UNSTUDIED"}
                    mode="learn"
                    onStatusChange={(status) => handleUpdateStatus(card.id, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-sm font-semibold text-slate-400">No Kanji cards found matching filters or search query.</p>
                <p className="text-xs text-slate-300 mt-1">ඔබ ඇතුළත් කළ සෙවුම් වචන නැවත පරීක්ෂා කර බලන්න.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHECK KANJI KNOWLEDGE */}
        {activeTab === "test" && (
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
                className="p-2.5 bg-[#f0ede6] hover:bg-[#cad2c5]/40 border border-[#e9e2d7] hover:border-[#84a98c] text-[#52796f] rounded-xl transition duration-150 inline-flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs"
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
                    className="py-3 px-4 bg-white hover:bg-[#f0ede6] disabled:bg-[#fdfbf7] disabled:text-[#cad2c5] border border-[#e9e2d7] rounded-xl font-sans font-bold text-xs text-[#52796f] transition inline-flex items-center justify-center gap-2"
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
                    className="py-3 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl font-sans font-bold text-xs transition inline-flex items-center justify-center gap-2 shadow-md shadow-[#52796f]/10"
                  >
                    NEXT <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional Quick Action buttons if card has been revealed */}
                {isTestCardRevealed && (
                  <div className="p-4 bg-white border border-[#e9e2d7] rounded-2xl shadow-sm text-center">
                    <p className="text-xs font-bold text-[#52796f] mb-2">Did you recall this Kanji correctly?</p>
                    <div className="flex justify-center gap-3">
                      <button
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
                        className="py-2.5 px-4 bg-[#bc6c25] hover:bg-[#bc6c25]/90 text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" /> No, forgot it
                      </button>
                      <button
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
                        className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold duration-150 inline-flex items-center gap-1.5 shadow-sm"
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

        {/* TAB 3: LEARN & PRACTICE JFT VERBS */}
        {activeTab === "verbs" && (
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
        )}

        {/* TAB 4: LEARN JFT ADJECTIVES */}
        {activeTab === "adjectives" && (
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
        )}

        {/* TAB 4: STUDY GRAMMAR PATTERNS */}
        {activeTab === "grammar" && (
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
        )}

        {/* TAB 5: ADVANCED MULTIPLE CHOICE SUPER QUIZ */}
        {activeTab === "quiz" && (
          <QuizView
            kanjiCards={cards}
            verbsList={verbs}
            adjectivesList={adjectives}
            onBackToLearn={() => setActiveTab("learn")}
          />
        )}

        {/* TAB 6: JFT VOCABULARY DICTIONARY */}
        {activeTab === "dictionary" && (
          <DictionaryView />
        )}
      </main>


      {/* Humid Footer context */}
      <footer className="bg-[#2f3e46] text-[#cad2c5] py-8 border-t border-[#e9e2d7]/20 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-white font-display">JFT & N4 Learning Helper</p>
          <p className="text-[11px] text-white/90 bg-[#354f52] inline-block px-4 py-1.5 rounded-full border border-white/5 font-bold uppercase tracking-wider mt-1 shadow-xs">
            💻 Developed by: <span className="text-amber-300 font-extrabold font-sans">H.D. Rusith Heshan Induwara</span>
          </p>
          <p className="text-[10px] text-[#84a98c] mt-2">
            Powered by Node.js Server Environment, Express APIs & Google Gemini AI Core
          </p>
          <p className="text-[10px] text-[#ece2d0] font-sans mt-3">
            ❤️ JFT විභාගය ජයගැනීමට අපෙන් සුභපැතුම්! (Created for & by H.D. Rusith Heshan Induwara)
          </p>
        </div>
      </footer>
    </div>
  );
}
