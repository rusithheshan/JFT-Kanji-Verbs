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
import QuizView from "./components/QuizView";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"learn" | "test" | "verbs" | "quiz">("learn");

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
                JFT-Basic Kanji Learner
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
                  Progress Mathakai
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
                ✔️ {okCount} <span className="text-xs text-[#84a98c]">Mathakai</span>
              </span>
              <span className="text-sm font-semibold text-[#354f52] border-l border-[#e9e2d7] pl-2">
                ❌ {notYetCount} <span className="text-xs text-[#84a98c]">Thama</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global tab Switcher row */}
        <div className="bg-[#fdbbf7]/0 border-t border-[#e9e2d7]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-start">
            <div className="flex gap-1 bg-[#f0ede6] p-1 rounded-full">
              <button
                onClick={() => setActiveTab("learn")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "learn"
                    ? "bg-white text-[#52796f] shadow-xs font-bold"
                    : "text-[#84a98c] hover:bg-white/50"
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Learn JFT Kanji
              </button>
              <button
                onClick={() => setActiveTab("test")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "test"
                    ? "bg-white text-[#52796f] shadow-xs font-bold"
                    : "text-[#84a98c] hover:bg-white/50"
                }`}
              >
                <Sparkles className="w-4 h-4" /> Check Kanji Knowledge
              </button>
              <button
                onClick={() => setActiveTab("verbs")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "verbs"
                    ? "bg-white text-[#52796f] shadow-xs font-bold"
                    : "text-[#84a98c] hover:bg-white/50"
                }`}
              >
                <Zap className="w-4 h-4" /> Learn Verbs (ක්‍රියාපද)
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "quiz"
                    ? "bg-white text-[#52796f] shadow-xs font-bold"
                    : "text-[#84a98c] hover:bg-white/50"
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Super Quiz (ප්‍රශ්නාවලිය)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* TAB 1: LEARN JFT KANJI */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            
            {/* Quick action grid: PDF Uploader + Custom Individual AI card adder */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Box 1: AI Custom Kanji Word Adder */}
              <div className="lg:col-span-4 bg-white p-5 rounded-[24px] border border-[#e9e2d7] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#354f52] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#52796f]" /> Card Creator (අලුත් කාඩ්)
                  </h3>
                  <p className="text-xs text-[#84a98c] mt-1 mb-4 leading-relaxed">
                    Enter any Japanese characters or individual Kanji word. Gemini AI will write translations, onyomi readings, kunyomi readings and bind a graphic card!
                  </p>
                </div>

                <form onSubmit={handleAddCustomKanji} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      disabled={isGeneratingCustomCard}
                      value={customKanjiInput}
                      onChange={(e) => setCustomKanjiInput(e.target.value)}
                      placeholder="e.g. 犬, 傘, 電車"
                      className="w-full text-sm rounded-xl border border-[#e9e2d7] px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#52796f]/15 focus:border-[#52796f] font-sans bg-[#fdfbf7]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isGeneratingCustomCard || !customKanjiInput.trim()}
                    className="w-full py-2.5 bg-[#52796f] hover:bg-[#354f52] disabled:bg-[#f0ede6] disabled:text-[#84a98c] text-white rounded-xl text-xs font-bold transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isGeneratingCustomCard ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        AI Generating...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Generate Kanji detail
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Box 2: PDF drag upload tool */}
              <div className="lg:col-span-5 bg-white p-5 rounded-[24px] border border-[#e9e2d7] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#354f52] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#52796f]" /> JFT Study PDF Uploader
                  </h3>
                  <p className="text-xs text-[#84a98c] mt-1 mb-3 leading-relaxed">
                    Upload your "JFT Kanji.pdf" study notes. Gemini AI reads, extracts, and populates up to 450 Kanji cards with full meanings automatically!
                  </p>
                </div>

                <div className="relative flex flex-col justify-center">
                  <input
                    type="file"
                    accept="application/pdf"
                    id="pdf-study-upload"
                    disabled={isUploadingPdf}
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="pdf-study-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                      isUploadingPdf
                        ? "bg-[#fdfbf7] border-[#52796f]"
                        : "border-[#cad2c5] hover:border-[#84a98c] hover:bg-[#f0ede6]/50"
                    }`}
                  >
                    {isUploadingPdf ? (
                      <div className="space-y-2 py-1">
                        <span className="inline-block w-6 h-6 border-2 border-[#52796f]/20 border-t-[#52796f] rounded-full animate-spin"></span>
                        <p className="text-[11px] font-bold text-[#52796f]">Gemini reading and translating your PDF...</p>
                        <p className="text-[9px] text-[#84a98c]">Generating Sinhala and English interpretations...</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-7 h-7 mx-auto text-[#84a98c]" />
                        <p className="text-[11px] font-bold text-[#354f52]">Choose PDF Document or Drag here</p>
                        <p className="text-[9px] text-[#84a98c]">JFT Kanji.pdf format support</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Box 3: Workspace Config Reset Options */}
              <div className="lg:col-span-3 bg-[#ece2d0]/25 border border-[#e9e2d7] p-5 rounded-[24px] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#bc6c25] flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Info & Workspace Reset
                  </h3>
                  <p className="text-xs text-[#2f3e46] mt-1 leading-relaxed">
                    Loaded {cards.length} total Kanji cards. Marked: {okCount} learned checks. You can reset learning matrices or reload default definitions at any time.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleResetProgress}
                    className="w-full py-2 bg-white border border-[#bc6c25] hover:bg-[#fdfbf7] rounded-xl text-[11px] font-bold text-[#bc6c25] transition"
                  >
                    🧹 Clear Progress Tracking Data
                  </button>
                  <button
                    onClick={handleResetAllToFactory}
                    className="w-full py-2 bg-white border border-[#84a98c] hover:bg-[#fdfbf7] rounded-xl text-[11px] font-bold text-[#52796f] transition"
                  >
                    🔄 Reset Deck list to Factory Base
                  </button>
                </div>
              </div>
            </div>

            {/* Error and Success Notices strip */}
            {(pdfParsingError || pdfSuccessMessage) && (
              <div className="animate-fade-in">
                {pdfParsingError && (
                  <div className="p-4 rounded-xl bg-[#ece2d0] border border-[#bc6c25] text-[#bc6c25] text-xs font-semibold leading-relaxed flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#bc6c25]" />
                    <span>{pdfParsingError}</span>
                  </div>
                )}
                {pdfSuccessMessage && (
                  <div className="p-4 rounded-xl bg-[#cad2c5]/30 border border-[#52796f]/40 text-[#2f3e46] text-xs font-semibold leading-relaxed flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 shrink-0 text-[#52796f]" />
                    <span>{pdfSuccessMessage}</span>
                  </div>
                )}
              </div>
            )}

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
                  <div
                    key={card.id}
                    onClick={() => {
                      // Find direct match index in cards array
                      const trueIdx = cards.findIndex((c) => c.id === card.id);
                      setFocusedCardIndex(trueIdx);
                    }}
                  >
                    <KanjiCardView
                      card={card}
                      status={progress[card.id] || "UNSTUDIED"}
                      mode="learn"
                      onStatusChange={(status) => handleUpdateStatus(card.id, status)}
                    />
                  </div>
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
                      <span className="text-[10px] font-bold text-[#84a98c] block">මතකයි</span>
                      <span className="text-sm font-extrabold text-[#52796f]">✔️ {okVerbsCount}</span>
                    </div>
                    <div className="border-l border-[#e9e2d7] pl-4 text-center">
                      <span className="text-[10px] font-bold text-[#84a98c] block">තවම ඕනේ</span>
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

        {/* TAB 4: ADVANCED MULTIPLE CHOICE SUPER QUIZ */}
        {activeTab === "quiz" && (
          <QuizView
            kanjiCards={cards}
            verbsList={verbs}
            onBackToLearn={() => setActiveTab("learn")}
          />
        )}
      </main>

      {/* Focus Mode Lightbox Slideshow Overlay */}
      <AnimatePresence>
        {focusedCardIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2f3e46]/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setFocusedCardIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white max-w-md w-full rounded-[32px] overflow-hidden shadow-2xl border-2 border-[#e9e2d7]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header inside popup */}
              <div className="flex justify-between items-center p-4 border-b border-[#e9e2d7] bg-[#fdfbf7]">
                <span className="text-xs font-bold text-[#84a98c]">
                  Focus Slide {focusedCardIndex + 1} / {cards.length}
                </span>
                <button
                  onClick={() => setFocusedCardIndex(null)}
                  className="font-bold text-lg text-[#84a98c] hover:text-[#bc6c25] px-2 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Central Card body */}
              <div className="p-6 bg-white">
                <KanjiCardView
                  card={cards[focusedCardIndex]}
                  status={progress[cards[focusedCardIndex].id] || "UNSTUDIED"}
                  mode="learn"
                  onStatusChange={(status) => handleUpdateStatus(cards[focusedCardIndex].id, status)}
                />
              </div>

              {/* Footer controls for focus element popup */}
              <div className="flex justify-between items-center px-6 pb-6 pt-2 select-none bg-white">
                <button
                  type="button"
                  disabled={focusedCardIndex === 0}
                  onClick={() => {
                    if (focusedCardIndex > 0) setFocusedCardIndex(focusedCardIndex - 1);
                  }}
                  className="py-2.5 px-4 bg-white hover:bg-[#f0ede6] border border-[#e9e2d7] text-[#52796f] disabled:opacity-30 rounded-xl transition text-xs font-bold"
                >
                  ◀ Prev Card
                </button>

                <button
                  type="button"
                  disabled={focusedCardIndex === cards.length - 1}
                  onClick={() => {
                    if (focusedCardIndex < cards.length - 1) setFocusedCardIndex(focusedCardIndex + 1);
                  }}
                  className="py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white disabled:opacity-30 rounded-xl transition text-xs font-bold"
                >
                  Next Card ▶
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Humid Footer context */}
      <footer className="bg-[#2f3e46] text-[#cad2c5] py-8 border-t border-[#e9e2d7]/20 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-white font-display">JFT-Basic Level A2 Kanji Cards Study Tracker</p>
          <p className="text-[10px] text-[#84a98c]">
            Powered by Node.js Server Environment, Express APIs & Google Gemini AI Core
          </p>
          <p className="text-[10px] text-[#ece2d0] font-sans mt-3">
            ❤️ JFT විභාගය ජයගැනීමට අපෙන් සුභපැතුම්! (Learn, Self Assess, & Excel)
          </p>
        </div>
      </footer>
    </div>
  );
}
