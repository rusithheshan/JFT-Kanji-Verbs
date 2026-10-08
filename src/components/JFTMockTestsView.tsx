import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Clock,
  Settings,
  Grid,
  HelpCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Check,
  X,
  Award,
  BookOpen,
  MessageSquare,
  Headphones,
  FileText,
  AlertTriangle,
  Layers,
  Lock,
  Eye,
  Info,
  Maximize,
  Minimize,
  Smartphone
} from "lucide-react";
import {
  JFT_MOCK_CATEGORIES,
  JFT_ALL_PAPERS_BY_CATEGORY,
  JFTMockTestPaper,
  JFTMockQuestion,
  JFTCategoryMeta
} from "../data/jftMockTestsData";
import { JFTCBTIllustration } from "./JFTCBTIllustrations";

interface JFTMockTestsViewProps {
  userProfile?: {
    username: string;
    targetExam: string;
    avatar: string;
  } | null;
}

// 4 Official JFT Sections
type SectionKey = "script_vocab" | "conversation" | "listening" | "reading";

interface SectionMeta {
  key: SectionKey;
  tabLabel: string;
  titleEn: string;
  titleJp: string;
  titleSi: string;
  questionRange: [number, number]; // 1-based start and end question number
}

const JFT_SECTIONS: SectionMeta[] = [
  {
    key: "script_vocab",
    tabLabel: "Script...",
    titleEn: "Script and Vocabulary",
    titleJp: "文字・語彙（もじ・ごい）",
    titleSi: "අක්ෂර සහ වචන මාලාව",
    questionRange: [1, 15]
  },
  {
    key: "conversation",
    tabLabel: "Con...",
    titleEn: "Conversation and Expression",
    titleJp: "会話・表現（かいわ・ひょうげん）",
    titleSi: "සංවාද සහ ප්‍රකාශන",
    questionRange: [16, 30]
  },
  {
    key: "listening",
    tabLabel: "List...",
    titleEn: "Listening Comprehension",
    titleJp: "聴解（ちょうかい）",
    titleSi: "සවන්දීම (2 Plays)",
    questionRange: [31, 45]
  },
  {
    key: "reading",
    tabLabel: "Rea...",
    titleEn: "Reading Comprehension",
    titleJp: "読解（どっかい）",
    titleSi: "කියවා තේරුම් ගැනීම",
    questionRange: [46, 60]
  }
];

export function JFTMockTestsView({ userProfile }: JFTMockTestsViewProps) {
  // Active Category: 'full' | 'script_vocab' | 'conversation' | 'listening' | 'reading'
  const [selectedCategory, setSelectedCategory] = useState<
    "full" | "script_vocab" | "conversation" | "listening" | "reading"
  >("full");

  // Active Paper Set Index (0 to 9 for Set 1 to Set 10)
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number>(0);

  const activeCategoryMeta: JFTCategoryMeta = useMemo(() => {
    return (
      JFT_MOCK_CATEGORIES.find((c) => c.id === selectedCategory) ||
      JFT_MOCK_CATEGORIES[0]
    );
  }, [selectedCategory]);

  const categoryPapers: JFTMockTestPaper[] = useMemo(() => {
    return JFT_ALL_PAPERS_BY_CATEGORY[selectedCategory] || [];
  }, [selectedCategory]);

  const activePaper: JFTMockTestPaper = useMemo(() => {
    return categoryPapers[selectedPaperIndex] || categoryPapers[0];
  }, [categoryPapers, selectedPaperIndex]);

  // Exam operational mode
  const [examStatus, setExamStatus] = useState<"in_progress" | "result">("in_progress");

  // Completed/Locked Sections (when finished, cannot be reopened!)
  const [completedSections, setCompletedSections] = useState<Record<SectionKey, boolean>>({
    script_vocab: false,
    conversation: false,
    listening: false,
    reading: false
  });

  // Current active section (Script & Vocab -> Conversation -> Listening -> Reading)
  const [currentSectionKey, setCurrentSectionKey] = useState<SectionKey>("script_vocab");

  // Current active question index (0 to totalQuestions - 1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // User answers mapping: { [questionId: number]: optionId (1, 2, 3, 4) }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  // Flagged for review questions mapping: { [questionId: number]: boolean }
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Listening Audio Plays Count per question: { [questionId: number]: number } (Max 2 plays per JFT specification)
  const [audioPlaysCount, setAudioPlaysCount] = useState<Record<number, number>>({});
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Timer countdown in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (activePaper?.durationMinutes || 60) * 60
  );
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Modals
  const [isFinishSectionModalOpen, setIsFinishSectionModalOpen] = useState<boolean>(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<"lang1" | "lang2" | null>(null);
  const [sectionLockedNotice, setSectionLockedNotice] = useState<string | null>(null);

  // Review screen filter
  const [resultFilter, setResultFilter] = useState<"all" | "incorrect" | "flagged">("all");

  // Full Screen State & Ref (targeted to only this CBT monitor container)
  const cbtContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        if (cbtContainerRef.current?.requestFullscreen) {
          await cbtContainerRef.current.requestFullscreen();
        }
        setIsFullScreen(true);
        try {
          if (screen.orientation && "lock" in screen.orientation) {
            // @ts-expect-error - orientation lock
            await screen.orientation.lock("landscape");
          }
        } catch {
          // ignore orientation lock error
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullScreen(false);
        try {
          if (screen.orientation && "unlock" in screen.orientation) {
            screen.orientation.unlock();
          }
        } catch {
          // ignore
        }
      }
    } catch {
      // In case iframe or device blocks browser API, fallback to full screen CSS overlay
      setIsFullScreen((prev) => !prev);
    }
  };

  // Sync fullscreen exit when user presses ESC or browser exits
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Reset exam whenever paper or category changes
  useEffect(() => {
    if (activePaper) {
      setSecondsRemaining(activePaper.durationMinutes * 60);
      setCurrentQuestionIndex(0);
      setCurrentSectionKey("script_vocab");
      setCompletedSections({
        script_vocab: false,
        conversation: false,
        listening: false,
        reading: false
      });
      setUserAnswers({});
      setFlaggedQuestions({});
      setAudioPlaysCount({});
      setExamStatus("in_progress");
      setIsTimerPaused(false);
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
    }
  }, [selectedCategory, selectedPaperIndex, activePaper?.id]);

  // Countdown timer hook
  useEffect(() => {
    if (examStatus !== "in_progress" || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamStatus("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStatus, isTimerPaused]);

  // Formatted timer hh : mm : ss
  const formattedTimer = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [secondsRemaining]);

  // Determine current active question
  const currentQuestion: JFTMockQuestion | undefined =
    activePaper?.questions[currentQuestionIndex];

  // Current active section meta
  const activeSectionMeta = useMemo(() => {
    if (selectedCategory !== "full") {
      const match = JFT_SECTIONS.find((s) => s.key === selectedCategory);
      return match || JFT_SECTIONS[0];
    }
    return JFT_SECTIONS.find((s) => s.key === currentSectionKey) || JFT_SECTIONS[0];
  }, [selectedCategory, currentSectionKey]);

  // Questions in the currently active section
  const sectionQuestions = useMemo(() => {
    if (!activePaper?.questions) return [];
    if (selectedCategory !== "full") {
      return activePaper.questions;
    }
    const [startNum, endNum] = activeSectionMeta.questionRange;
    return activePaper.questions.filter(
      (q) => q.questionNumber >= startNum && q.questionNumber <= endNum
    );
  }, [activePaper, selectedCategory, activeSectionMeta]);

  // Index of question relative to the current section (1-based: 1 to 15)
  const currentSectionQuestionIndex = useMemo(() => {
    if (!currentQuestion) return 0;
    const foundIdx = sectionQuestions.findIndex((q) => q.id === currentQuestion.id);
    return foundIdx >= 0 ? foundIdx : 0;
  }, [sectionQuestions, currentQuestion]);

  // Current question listening audio play limit (Max 2 plays)
  const currentAudioPlays = currentQuestion ? (audioPlaysCount[currentQuestion.id] || 0) : 0;
  const isAudioLimitReached = currentAudioPlays >= 2;

  // Handle Japanese speech synthesis audio playback for Listening
  const handlePlayAudio = (scriptText: string) => {
    if (!currentQuestion) return;
    if (currentAudioPlays >= 2) return;
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = "ja-JP";
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsAudioPlaying(true);
      setAudioPlaysCount((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1
      }));
    };

    utterance.onend = () => {
      setIsAudioPlaying(false);
    };

    utterance.onerror = () => {
      setIsAudioPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Option selection handler
  const handleSelectOption = (optionId: number) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  // Toggle review flag
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Navigation: Next
  const handleNextQuestion = () => {
    if (currentSectionQuestionIndex < sectionQuestions.length - 1) {
      const nextQ = sectionQuestions[currentSectionQuestionIndex + 1];
      const nextOverallIdx = activePaper.questions.findIndex((q) => q.id === nextQ.id);
      if (nextOverallIdx >= 0) {
        setCurrentQuestionIndex(nextOverallIdx);
      }
    } else {
      // Reached end of current section
      setIsFinishSectionModalOpen(true);
    }
  };

  // Navigation: Back
  const handleBackQuestion = () => {
    if (currentSectionQuestionIndex > 0) {
      const prevQ = sectionQuestions[currentSectionQuestionIndex - 1];
      const prevOverallIdx = activePaper.questions.findIndex((q) => q.id === prevQ.id);
      if (prevOverallIdx >= 0) {
        setCurrentQuestionIndex(prevOverallIdx);
      }
    }
  };

  // Switch to question within section
  const handleGoToQuestion = (q: JFTMockQuestion) => {
    const idx = activePaper.questions.findIndex((item) => item.id === q.id);
    if (idx >= 0) {
      setCurrentQuestionIndex(idx);
    }
  };

  // Candidate confirms finishing the current section
  const handleConfirmFinishSection = () => {
    setIsFinishSectionModalOpen(false);

    if (selectedCategory !== "full") {
      // Single category paper: directly conclude exam
      setExamStatus("result");
      return;
    }

    // Full mock test: lock current section permanently!
    setCompletedSections((prev) => ({
      ...prev,
      [currentSectionKey]: true
    }));

    // Find next section
    const currentIdx = JFT_SECTIONS.findIndex((s) => s.key === currentSectionKey);
    if (currentIdx < JFT_SECTIONS.length - 1) {
      const nextSec = JFT_SECTIONS[currentIdx + 1];
      setCurrentSectionKey(nextSec.key);
      const [startNum] = nextSec.questionRange;
      const targetQIndex = activePaper.questions.findIndex(
        (q) => q.questionNumber === startNum
      );
      if (targetQIndex >= 0) {
        setCurrentQuestionIndex(targetQIndex);
      }
    } else {
      // All 4 sections completed! Finish exam!
      setExamStatus("result");
    }
  };

  // Section Tab Click Handler (Blocks finished sections!)
  const handleSectionTabClick = (sectionKey: SectionKey) => {
    if (selectedCategory !== "full") return;

    if (completedSections[sectionKey]) {
      setSectionLockedNotice(
        `"${JFT_SECTIONS.find((s) => s.key === sectionKey)?.titleEn}" has been finished and is locked. You cannot return to it.`
      );
      setTimeout(() => setSectionLockedNotice(null), 3500);
      return;
    }

    if (sectionKey !== currentSectionKey) {
      setSectionLockedNotice(
        `Please complete the current section and click "Finish Section" to proceed.`
      );
      setTimeout(() => setSectionLockedNotice(null), 3500);
      return;
    }
  };

  // Official JFT-Basic 250 Points Calculation & Band Assessment
  const scoreResults = useMemo(() => {
    if (!activePaper) return { totalScore: 0, percentage: 0, level: "Below A1", isPassed: false };

    let correctTotal = 0;
    const sectionBreakdown: Record<SectionKey, { correct: number; total: number; score: number }> = {
      script_vocab: { correct: 0, total: 0, score: 0 },
      conversation: { correct: 0, total: 0, score: 0 },
      listening: { correct: 0, total: 0, score: 0 },
      reading: { correct: 0, total: 0, score: 0 }
    };

    activePaper.questions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctOption;
      if (isCorrect) correctTotal++;

      if (sectionBreakdown[q.section]) {
        sectionBreakdown[q.section].total++;
        if (isCorrect) sectionBreakdown[q.section].correct++;
      }
    });

    const totalQuestions = activePaper.questions.length;
    // Scaled to exactly 250 Points
    const scaledScore = Math.round((correctTotal / totalQuestions) * 250);
    const percentage = Math.round((correctTotal / totalQuestions) * 100);

    // Calculate scaled score per section (/ 62.5 each)
    Object.keys(sectionBreakdown).forEach((k) => {
      const item = sectionBreakdown[k as SectionKey];
      if (item.total > 0) {
        item.score = Math.round((item.correct / item.total) * 62.5);
      }
    });

    // Official CEFR / SSW Levels:
    // 200 - 250: A2.2 (Passed! SSW Tokutei Ginou 1 Qualification)
    // 175 - 199: A2.1 (Elementary Basic Level 1)
    // 145 - 174: A1 (Basic Foundation Level)
    // Below 145: Below A1 (Needs Improvement)
    let level: "A2.2" | "A2.1" | "A1" | "Below A1" = "Below A1";
    let levelLabelSi = "A1 මට්ටමට වඩා අඩුයි (නැවත පුහුණු වන්න)";
    let isPassed = false;

    if (scaledScore >= 200) {
      level = "A2.2";
      levelLabelSi = "A2.2 මට්ටම සමත් විය (Specified Skilled Worker SSW සුදුසුකම් ලාභී! 🎉)";
      isPassed = true;
    } else if (scaledScore >= 175) {
      level = "A2.1";
      levelLabelSi = "A2.1 මට්ටම ලබා ගන්නා ලදී (ප්‍රාථමික මූලික මට්ටම 1)";
      isPassed = false;
    } else if (scaledScore >= 145) {
      level = "A1";
      levelLabelSi = "A1 මට්ටම ලබා ගන්නා ලදී (මූලික පදනම් මට්ටම)";
      isPassed = false;
    } else {
      level = "Below A1";
      levelLabelSi = "A1 මට්ටමට වඩා අඩුයි (තවදුරටත් පුහුණුව අවශ්‍යයි)";
      isPassed = false;
    }

    return {
      totalScore: scaledScore,
      correctTotal,
      totalQuestions,
      percentage,
      level,
      levelLabelSi,
      isPassed,
      sectionBreakdown
    };
  }, [activePaper, userAnswers]);

  const candidateDisplayName = userProfile?.username || "USER mygration";

  return (
    <div className="w-full flex flex-col items-center select-none pb-12 font-sans">
      {/* ========================================================================= */}
      {/* TOP JFT CONTROL PANEL: Category Switcher (5 Categories) & Set Selector    */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1240px] bg-white rounded-2xl border border-slate-300 shadow-sm p-4 sm:p-5 mb-3 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-100 text-red-700">🇯🇵</span>
              JFT-Basic Prometric CBT Examination Center (ජපන් පදනම් පරීක්ෂණ ආදර්ශ විභාග)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official Prometric CBT Interface: ප්‍රශ්න 60 කින් යුත් පූර්ණ ආදර්ශ විභාග සහ කාණ්ඩ 4ක පරීක්ෂණ (ලකුණු 250න්)
            </p>
          </div>

          {/* YouTube Playlist External Resource Link */}
          {activeCategoryMeta.playlistUrl && (
            <a
              href={activeCategoryMeta.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
              title="YouTube ආදර්ශ විභාග වීඩියෝ මාලාව නරඹන්න"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch YouTube Playlist</span>
            </a>
          )}
        </div>

        {/* 5 Main Categories Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
          {JFT_MOCK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedPaperIndex(0);
                }}
                className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-[#608038] text-white border-[#608038] shadow-md ring-2 ring-emerald-500/20"
                    : "bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    {cat.id === "full" ? (
                      <Award className="w-4 h-4 text-amber-300" />
                    ) : cat.id === "script_vocab" ? (
                      <BookOpen className="w-4 h-4 text-emerald-300" />
                    ) : cat.id === "conversation" ? (
                      <MessageSquare className="w-4 h-4 text-blue-300" />
                    ) : cat.id === "listening" ? (
                      <Headphones className="w-4 h-4 text-purple-300" />
                    ) : (
                      <FileText className="w-4 h-4 text-orange-300" />
                    )}
                    <span className="text-xs font-black line-clamp-1">{cat.titleSi}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`${isSelected ? "text-emerald-100" : "text-slate-500"} font-medium`}>
                    10 Sets
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat.id === "full" ? "60 Qs • 60 min" : `${cat.durationMinutes} min`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 10 Sets Selector Carousel */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Layers className="w-4 h-4 text-[#608038]" />
            <span>Select Exam Set (ප්‍රශ්න පත්‍ර කට්ටලය):</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedPaperIndex(i)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  selectedPaperIndex === i
                    ? "bg-[#608038] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                Set {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Phone Landscape & Full Screen Assistant Banner */}
      {!isFullScreen && (
        <div className="w-full max-w-[1240px] bg-slate-900 border border-slate-700 p-2.5 px-4 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Smartphone className="w-4 h-4 rotate-90" />
            </div>
            <div>
              <span className="font-bold text-white">📱 Phone Landscape & Full Screen:</span>{" "}
              <span className="text-slate-300">
                පහත CBT විභාග තිරය පමණක් <strong>Full Screen</strong> කර Phone එක <strong>Landscape (තිරස් අතට)</strong> හරවා සැබෑ CBT පරිගණක විභාගයක් පරිදිම පහසුවෙන් භාවිතා කරන්න.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFullScreen}
            className="px-3.5 py-1.5 bg-[#608038] hover:bg-[#6e9340] text-white rounded-lg text-xs font-black flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-xs active:scale-95"
          >
            <Maximize className="w-3.5 h-3.5 text-amber-300" />
            <span>Full Screen (පූර්ණ තිරය)</span>
          </button>
        </div>
      )}

      {/* Floating Portrait Hint in Fullscreen */}
      {isFullScreen && (
        <div className="hidden portrait:flex fixed top-16 left-1/2 -translate-x-1/2 z-[100000] bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-2xl items-center gap-2 animate-bounce pointer-events-none border border-amber-300">
          <Smartphone className="w-4 h-4 rotate-90" />
          <span>Phone එක Landscape (තිරස් අතට) හරවන්න</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTHENTIC CBT MONITOR CONTAINER (100% REPLICATION OF CBT SCREENSHOTS)    */}
      {/* ========================================================================= */}
      <div
        ref={cbtContainerRef}
        id="cbt-monitor-jft-view"
        className={`transition-all duration-200 select-none ${
          isFullScreen
            ? "fixed inset-0 z-[99999] w-screen h-[100dvh] max-w-none m-0 border-0 rounded-none bg-white flex flex-col overflow-hidden"
            : "w-full max-w-[1240px] flex flex-col bg-[#ffffff] shadow-2xl border-4 border-[#000000] my-2 min-h-[560px] h-[680px] max-h-[86vh] overflow-hidden"
        }`}
      >
        {/* -------------------- 1. TOP BAR (BLACK #000000) -------------------- */}
        <div className="w-full bg-[#000000] text-white min-h-[42px] h-[44px] landscape:min-h-[36px] landscape:h-[36px] px-2.5 sm:px-5 py-0.5 sm:py-1 flex items-center justify-between border-b border-black shrink-0">
          {/* Top Left: Question & Section */}
          <div className="flex flex-col justify-center leading-tight">
            <div className="text-xs sm:text-sm landscape:text-xs font-bold tracking-wide">
              <span>Question:</span>{" "}
              <span className="font-mono text-sm sm:text-base landscape:text-xs text-white ml-1 font-bold">
                {currentSectionQuestionIndex + 1}
              </span>
            </div>
            <div className="text-[10px] sm:text-xs landscape:text-[9.5px] text-slate-300 font-medium tracking-wide truncate max-w-[130px] sm:max-w-none">
              <span>Section:</span>{" "}
              <span className="text-white ml-1">{activeSectionMeta.titleEn}</span>
            </div>
          </div>

          {/* Top Center: Time Remaining Display with Red Rounded Rectangle Border */}
          <div className="bg-[#000000] border-2 border-[#ef4444] rounded-md px-2 sm:px-3 py-0.5 flex items-center gap-1 sm:gap-2">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
            <div className="flex flex-col items-center justify-center leading-none text-center">
              <span className="text-[7.5px] sm:text-[9px] landscape:text-[7.5px] text-white/90 font-medium">
                Section Time Remaining
              </span>
              <span className="font-mono text-xs sm:text-sm landscape:text-xs font-bold tracking-wider text-white">
                {formattedTimer}
              </span>
            </div>
          </div>

          {/* Top Right: Full Screen Button & Finish Section Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleFullScreen}
              className="bg-[#242424] hover:bg-[#333333] active:bg-[#1a1a1a] text-white border border-[#444444] px-2 sm:px-2.5 py-1 rounded-xs font-bold text-xs landscape:text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0 shadow-xs"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen (පූර්ණ තිරය)"}
            >
              {isFullScreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline landscape:inline">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline landscape:inline">Full Screen</span>
                </>
              )}
            </button>

            {/* Finish Section Button (Warm Golden Yellow / Peach) */}
            <button
              type="button"
              onClick={() => setIsFinishSectionModalOpen(true)}
              className="bg-[#fac457] hover:bg-[#f5b842] active:bg-[#e0a838] text-[#000000] border border-[#000000] px-2.5 sm:px-4 py-1 rounded-xs font-bold text-xs sm:text-sm landscape:text-xs shadow-xs transition cursor-pointer shrink-0"
            >
              Finish Section
            </button>
          </div>
        </div>

        {/* -------------------- 2. SUB-HEADER BANNER (OLIVE GREEN #608038) -------------------- */}
        <div className="w-full bg-[#608038] text-white h-[24px] sm:h-[26px] landscape:h-[22px] px-2.5 sm:px-5 flex items-center justify-between text-[11px] sm:text-xs landscape:text-[10px] font-medium tracking-wide shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold">Test:</span>
            <span className="truncate">Japan Foundation Test for Basic Japanese</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold">Candidate:</span>
            <span className="font-medium">{candidateDisplayName}</span>
          </div>
        </div>

        {/* Temporary Section Locked Alert Notice */}
        {sectionLockedNotice && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 py-1 text-xs text-amber-900 font-bold flex items-center gap-2 animate-bounce shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>{sectionLockedNotice}</span>
          </div>
        )}

        {/* -------------------- 3. MAIN QUESTION & TEST AREA -------------------- */}
        <div className="flex-1 min-h-0 w-full flex relative bg-white overflow-hidden">
          {/* LEFT RAIL: Section Tabs & Vertical Question Navigator (image001.png) */}
          <div className="w-[68px] sm:w-[92px] landscape:w-[68px] bg-[#f5f5f5] border-r border-[#d4d4d4] flex shrink-0 select-none h-full overflow-hidden">
            {/* Extreme Left Vertical Section Tabs */}
            <div className="w-[24px] sm:w-[34px] landscape:w-[24px] bg-[#e5e5e5] border-r border-[#d4d4d4] flex flex-col items-center py-1 sm:py-2 gap-1 text-[9px] sm:text-[10px] font-bold text-slate-700 h-full overflow-hidden shrink-0">
              {JFT_SECTIONS.map((sec) => {
                const isSecActive = sec.key === activeSectionMeta.key;
                const isSecCompleted = completedSections[sec.key];

                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => handleSectionTabClick(sec.key)}
                    className={`w-full py-2 sm:py-3 px-0.5 flex flex-col items-center justify-center text-center transition cursor-pointer border-y ${
                      isSecActive
                        ? "bg-white text-[#608038] font-black border-slate-300 shadow-xs"
                        : isSecCompleted
                        ? "bg-[#d4d4d4] text-slate-500 cursor-not-allowed border-transparent"
                        : "bg-[#e5e5e5] hover:bg-slate-200 text-slate-600 border-transparent"
                    }`}
                    title={`${sec.titleEn} (${isSecCompleted ? "Finished & Locked" : isSecActive ? "Active" : "Pending"})`}
                  >
                    {isSecCompleted && <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 mb-0.5 text-slate-500" />}
                    <span className="writing-vertical text-[8px] sm:text-[9px] landscape:text-[8px] uppercase tracking-wider">
                      {sec.tabLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Questions Palette for Currently Active Section */}
            <div className="flex-1 flex flex-col items-center py-1.5 gap-1 overflow-y-auto h-full scrollbar-thin px-0.5">
              {sectionQuestions.map((q, qLocalIdx) => {
                const isCurrent = currentQuestion?.id === q.id;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];

                // Styling matching image001.png legend:
                // - Gray: Answered
                // - Green with right arrow/pentagon: Currently answering
                // - Green rounded rectangle: Unanswered
                // - With flag: Review needed
                if (isCurrent) {
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleGoToQuestion(q)}
                      className="relative w-7 h-6 sm:w-8 sm:h-7 landscape:w-6.5 landscape:h-5.5 bg-[#608038] text-white flex items-center justify-center text-[10px] sm:text-xs landscape:text-[10px] font-black shadow-sm transition cursor-pointer shrink-0"
                      style={{
                        clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)"
                      }}
                      title={`Question ${qLocalIdx + 1} (Currently answering)`}
                    >
                      <span className="mr-0.5 sm:mr-1">{qLocalIdx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 text-amber-300 text-[9px]">
                          ⚑
                        </span>
                      )}
                    </button>
                  );
                }

                if (isAnswered) {
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleGoToQuestion(q)}
                      className="relative w-6 h-6 sm:w-7 sm:h-7 landscape:w-6 landscape:h-5.5 bg-[#9ca3af] hover:bg-[#6b7280] text-white rounded text-[10px] sm:text-xs landscape:text-[10px] font-bold flex items-center justify-center transition cursor-pointer shrink-0"
                      title={`Question ${qLocalIdx + 1} (Answered)`}
                    >
                      <span>{qLocalIdx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 text-amber-400 text-[9px]">
                          ⚑
                        </span>
                      )}
                    </button>
                  );
                }

                // Unanswered: Green rounded rectangle
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleGoToQuestion(q)}
                    className="relative w-6 h-6 sm:w-7 sm:h-7 landscape:w-6 landscape:h-5.5 bg-[#608038] hover:bg-[#6e9340] text-white rounded text-[10px] sm:text-xs landscape:text-[10px] font-bold flex items-center justify-center transition cursor-pointer shrink-0"
                    title={`Question ${qLocalIdx + 1} (Unanswered)`}
                  >
                    <span>{qLocalIdx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 text-amber-300 text-[9px]">
                        ⚑
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN TEST QUESTION CONTENT AREA (RESPONSIVE SPLIT ON LANDSCAPE) */}
          <div className="flex-1 min-h-0 flex flex-col p-2 sm:p-4 landscape:p-2.5 overflow-y-auto">
            {currentQuestion ? (
              <div className="w-full flex flex-col landscape:flex-row gap-2.5 sm:gap-5 items-start">
                {/* Left Column in Landscape (Question Prompt, Instruction, Illustration, Audio) */}
                <div className="w-full landscape:w-1/2 flex flex-col gap-2">
                  {/* Light Blue Instruction Box (Matches image001, image002, image003) */}
                  <div className="bg-[#e9f2fa] border border-[#bcd7ef] p-2 sm:p-2.5 landscape:p-1.5 rounded-md space-y-1">
                    <div className="text-xs sm:text-sm landscape:text-xs font-semibold text-slate-900 leading-snug">
                      {currentQuestion.instructionEn || "Look at the illustration and choose the correct word."}
                    </div>

                    {/* Your Language 1 & Your Language 2 Buttons */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setIsLanguageModalOpen("lang1")}
                        className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[10px] sm:text-xs landscape:text-[10px] font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>Your Language 1</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsLanguageModalOpen("lang2")}
                        className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[10px] sm:text-xs landscape:text-[10px] font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-amber-600" />
                        <span>Your Language 2</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Listening Audio Player Bar (image002.png & image003.png) */}
                  {currentQuestion.audioScriptJp && (
                    <div className="p-1.5 sm:p-2 landscape:p-1.5 bg-[#181818] rounded-md text-white flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isAudioLimitReached}
                          onClick={() => handlePlayAudio(currentQuestion.audioScriptJp!)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 landscape:w-6.5 landscape:h-6.5 rounded-full flex items-center justify-center font-bold text-xs transition cursor-pointer shrink-0 ${
                            isAudioLimitReached
                              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                              : isAudioPlaying
                              ? "bg-purple-600 text-white animate-pulse"
                              : "bg-[#608038] hover:bg-[#6e9340] text-white shadow-xs"
                          }`}
                          title="Press to play audio (Max 2 times)"
                        >
                          {isAudioPlaying ? (
                            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>

                        <div className="space-y-0 leading-tight">
                          <div className="text-[10px] sm:text-xs landscape:text-[10px] font-bold text-slate-200">
                            {isAudioPlaying ? "Playing Japanese Audio..." : "Japanese Audio Dialog"}
                          </div>
                          <div className="text-[8.5px] sm:text-[9.5px] landscape:text-[8px] text-slate-400">
                            Max 2 times
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] sm:text-[10px] landscape:text-[8.5px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                          Plays: {currentAudioPlays} / 2
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Question Japanese Prompt / Sentence (Clean without non-JFT Kanji) */}
                  {currentQuestion.questionJp && (
                    <div className="text-xs sm:text-base landscape:text-xs font-bold text-slate-900 font-japanese leading-relaxed pt-0.5">
                      {currentQuestion.questionJp}
                    </div>
                  )}

                  {/* Illustration Display (Matches YouTube and Screenshots, compact in landscape) */}
                  {currentQuestion.illustrationType && (
                    <div className="py-0.5 flex flex-col items-start gap-1">
                      <div className="p-1 sm:p-2 landscape:p-1 bg-white rounded-lg border border-slate-200 shadow-xs inline-block">
                        <JFTCBTIllustration
                          type={currentQuestion.illustrationType}
                          size="md"
                          className="max-h-[115px] sm:max-h-[165px] landscape:max-h-[85px] w-auto"
                        />
                      </div>
                      <span className="text-[10px] text-[#52796f] font-semibold flex items-center gap-1">
                        <span>📸 අදාළ සැබෑ ඡායාරූපය (Question Photo)</span>
                        <span className="text-slate-400">• (විශාල කර බැලීමට Click කරන්න)</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column in Landscape (Choices Area) */}
                <div className="w-full landscape:w-1/2 flex flex-col gap-1.5 sm:gap-2 justify-center">
                  {/* Picture Choices for Listening (image002.png & image003.png) */}
                  {currentQuestion.pictureChoices && currentQuestion.pictureChoices.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-[10px] sm:text-xs landscape:text-[10px] font-semibold text-slate-600">
                        Answer by clicking on your choice:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {currentQuestion.pictureChoices.map((picType, idx) => {
                          const optionId = idx + 1;
                          const isSelected = userAnswers[currentQuestion.id] === optionId;

                          return (
                            <button
                              key={optionId}
                              type="button"
                              onClick={() => handleSelectOption(optionId)}
                              className={`p-1.5 sm:p-2 landscape:p-1 rounded-lg border-2 text-center transition cursor-pointer flex flex-col items-center justify-between gap-1 ${
                                isSelected
                                  ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/40 shadow-sm"
                                  : "bg-white hover:bg-slate-50 border-slate-300"
                              }`}
                            >
                              <span className="text-[10px] font-bold text-slate-700">({optionId})</span>
                              <div className="w-full flex items-center justify-center p-0.5">
                                <JFTCBTIllustration
                                  type={picType}
                                  size="sm"
                                  className="max-h-[48px] sm:max-h-[75px] landscape:max-h-[42px] w-auto"
                                />
                              </div>
                              <span
                                className={`text-[8.5px] sm:text-[9px] font-bold px-1 py-0.2 rounded ${
                                  isSelected ? "bg-amber-400 text-black" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {isSelected ? "Selected" : "Choose"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Standard Text Choices (White boxes with thin gray border, image001 & hqdefault) */
                    <div className="space-y-1.5">
                      {currentQuestion.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[currentQuestion.id] === opt.id;
                        const letterLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(opt.id)}
                            className={`w-full text-left p-2 sm:p-2.5 landscape:p-1.5 rounded border transition cursor-pointer flex items-center justify-between text-xs sm:text-sm landscape:text-xs font-japanese ${
                              isSelected
                                ? "bg-[#fffbeb] border-[#f59e0b] text-[#78350f] font-bold shadow-xs ring-1 ring-amber-400"
                                : "bg-white hover:bg-[#fafafa] border-[#d4d4d4] text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-bold text-xs landscape:text-[11px] text-slate-500 w-3.5">
                                {letterLabel}.
                              </span>
                              <span>{opt.textJp}</span>
                            </div>

                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">No question selected.</div>
            )}
          </div>
        </div>

        {/* -------------------- 4. BOTTOM BAR (BLACK #000000) -------------------- */}
        <div className="w-full bg-[#000000] text-white min-h-[40px] h-[42px] landscape:min-h-[36px] landscape:h-[36px] px-2.5 sm:px-5 py-0.5 sm:py-1 flex items-center justify-between border-t border-black shrink-0">
          {/* Bottom Left: Settings, Grid, and Full Screen Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsGridModalOpen(true)}
              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
              title="Question Palette Grid"
            >
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={toggleFullScreen}
              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen (පූර්ණ තිරය)"}
            >
              {isFullScreen ? (
                <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              ) : (
                <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              )}
            </button>
          </div>

          {/* Bottom Right: Flag, Back, Next Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Flag for reviewing answer */}
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`px-2.5 sm:px-3 py-1 rounded-xs text-xs landscape:text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                currentQuestion && flaggedQuestions[currentQuestion.id]
                  ? "bg-amber-400 text-black font-black"
                  : "bg-[#608038] hover:bg-[#6c8f40] text-white"
              }`}
              title="Flag for reviewing answer"
            >
              <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline landscape:inline">Flag</span>
            </button>

            {/* Back Button */}
            <button
              type="button"
              disabled={currentSectionQuestionIndex === 0}
              onClick={handleBackQuestion}
              className={`px-3 sm:px-4 py-1 rounded-xs text-xs landscape:text-[11px] font-bold flex items-center gap-0.5 transition cursor-pointer ${
                currentSectionQuestionIndex === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-[#608038] hover:bg-[#6c8f40] text-white"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-3 sm:px-4 py-1 bg-[#608038] hover:bg-[#6c8f40] text-white rounded-xs text-xs landscape:text-[11px] font-bold flex items-center gap-0.5 transition cursor-pointer"
            >
              <span>{currentSectionQuestionIndex === sectionQuestions.length - 1 ? "Finish Section" : "Next"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FINISH SECTION CONFIRMATION MODAL (PERMANENT LOCK SPECIFICATION)      */}
      {/* ========================================================================= */}
      {isFinishSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Finish Section: {activeSectionMeta.titleEn}?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Once you finish this section,{" "}
              <strong className="text-rose-600">
                you cannot return to this section or change your answers
              </strong>
              .
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-700">
                <span>Total Questions in Section:</span>
                <span className="font-bold">{sectionQuestions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span>
                <span className="font-bold">
                  {sectionQuestions.filter((q) => userAnswers[q.id] !== undefined).length}
                </span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Unanswered:</span>
                <span className="font-bold">
                  {sectionQuestions.filter((q) => userAnswers[q.id] === undefined).length}
                </span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Flagged for Review:</span>
                <span className="font-bold">
                  {sectionQuestions.filter((q) => flaggedQuestions[q.id]).length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFinishSectionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Continue Working on this Section
              </button>

              <button
                type="button"
                onClick={handleConfirmFinishSection}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#fac457] hover:bg-[#f5b842] text-black font-black border border-black transition cursor-pointer shadow-xs"
              >
                Finish and Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. YOUR LANGUAGE 1 & 2 MODAL                                            */}
      {/* ========================================================================= */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {isLanguageModalOpen === "lang1" ? "Your Language 1 (English)" : "Your Language 2 (සිංහල උපදෙස්)"}
              </h3>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-2 py-1">
              {isLanguageModalOpen === "lang1" ? (
                <>
                  <p className="font-bold text-slate-900">
                    Question {currentSectionQuestionIndex + 1}:
                  </p>
                  <p>{currentQuestion?.instructionEn || "Choose the most appropriate answer."}</p>
                  <p className="text-[11px] text-slate-500">
                    Section: {activeSectionMeta.titleEn} • Question {currentQuestion?.questionNumber}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-900">
                    ප්‍රශ්න උපදෙස් සහ සාරාංශය:
                  </p>
                  <p className="leading-relaxed">
                    {currentQuestion?.questionSi || "ප්‍රශ්නය කියවා වඩාත් නිවැරදි පිළිතුර තෝරන්න."}
                  </p>
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                    💡 විභාගය අවසානයේ සියලුම ප්‍රශ්න සඳහා සවිස්තරාත්මක සිංහල විවරණ බලාගත හැක.
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(null)}
              className="w-full py-2 bg-[#608038] text-white rounded text-xs font-bold cursor-pointer"
            >
              OK (තේරුම් ගත්තා)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. QUESTION GRID PALETTE MODAL                                          */}
      {/* ========================================================================= */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#608038]" />
                Question Palette: {activeSectionMeta.titleEn}
              </h3>
              <button
                type="button"
                onClick={() => setIsGridModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5 max-h-[350px] overflow-y-auto p-1">
              {sectionQuestions.map((q, idx) => {
                const isCurrent = currentQuestion?.id === q.id;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];

                let bg = "bg-[#608038] text-white"; // Unanswered
                if (isCurrent) bg = "bg-[#608038] text-white ring-2 ring-emerald-400";
                else if (isAnswered) bg = "bg-[#9ca3af] text-white"; // Answered

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      handleGoToQuestion(q);
                      setIsGridModalOpen(false);
                    }}
                    className={`relative p-3 rounded-lg text-xs font-black flex items-center justify-center transition cursor-pointer ${bg}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 text-amber-300 text-[10px]">
                        ⚑
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsGridModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Close Palette
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SETTINGS MODAL                                                       */}
      {/* ========================================================================= */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-700" />
                CBT Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Timer Pause:</span>
                <button
                  type="button"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    isTimerPaused ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isTimerPaused ? "Paused" : "Running"}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t">
                Official Prometric JFT-Basic CBT simulator.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-2 bg-slate-800 text-white rounded text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. OFFICIAL SCORECARD & DETAILED RESULTS (250 POINTS SCALE)               */}
      {/* ========================================================================= */}
      {examStatus === "result" && (
        <div className="w-full max-w-[1240px] my-6 bg-white rounded-2xl border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Certificate Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl text-white ${
              scoreResults.isPassed ? "bg-[#608038]" : "bg-slate-800"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span
                    className={`text-xs uppercase tracking-wider font-black px-3 py-1 rounded-full ${
                      scoreResults.isPassed
                        ? "bg-amber-400 text-black shadow-xs"
                        : "bg-rose-500/80 text-white"
                    }`}
                  >
                    {scoreResults.isPassed
                      ? "🎉 PASSED A2.2 (සමත් විය)"
                      : "⚠️ COMPLETED (ප්‍රතිඵලය සටහන් විය)"}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">
                    Official Scale: 250 Points
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black">
                  {scoreResults.levelLabelSi}
                </h2>
                <p className="text-xs text-white/80">
                  Candidate: {candidateDisplayName} • Exam: JFT-Basic CBT Simulator • Set {selectedPaperIndex + 1}
                </p>
              </div>

              {/* Total Score / 250 Badge */}
              <div className="bg-black/30 backdrop-blur-xs p-5 rounded-2xl text-center flex items-center gap-6 border border-white/20">
                <div>
                  <div className="text-[10px] uppercase font-bold text-white/70">
                    JFT Total Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-amber-300 mt-1">
                    {scoreResults.totalScore}
                    <span className="text-lg text-white/70"> / 250</span>
                  </div>
                </div>

                <div className="border-l border-white/20 pl-6 text-left space-y-1 text-xs">
                  <div>
                    <span className="text-white/70">Level:</span>{" "}
                    <strong className="text-amber-300 font-black text-sm">
                      {scoreResults.level}
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/70">Correct:</span>{" "}
                    <strong className="text-white">
                      {scoreResults.correctTotal} / {scoreResults.totalQuestions} ({scoreResults.percentage}%)
                    </strong>
                  </div>
                  <div>
                    <span className="text-white/70">SSW Status:</span>{" "}
                    <strong className={scoreResults.isPassed ? "text-emerald-300" : "text-rose-300"}>
                      {scoreResults.isPassed ? "Qualified (A2.2)" : "Needs 200+ for SSW"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Evaluation Bands Reference Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              JFT-Basic Score Assessment Standards (ලකුණු 250 මිනුම් දණ්ඩ):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-lg border ${
                  scoreResults.level === "A2.2"
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="font-black text-emerald-800">200 - 250: A2.2</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  සමත් විය (SSW Tokutei Ginou අවශ්‍යතාවය සපුරයි)
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  scoreResults.level === "A2.1"
                    ? "bg-blue-100 border-blue-500 text-blue-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="font-black text-blue-800">175 - 199: A2.1</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  ප්‍රාථමික මට්ටම 1 (තව සුළු ලකුණු ගණනක් අවශ්‍යයි)
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  scoreResults.level === "A1"
                    ? "bg-amber-100 border-amber-500 text-amber-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="font-black text-amber-800">145 - 174: A1</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  මූලික පදනම් මට්ටම (තවදුරටත් පුහුණුව අවශ්‍යයි)
                </div>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  scoreResults.level === "Below A1"
                    ? "bg-rose-100 border-rose-500 text-rose-950 font-bold"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="font-black text-rose-800">Below 145: Below A1</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  නැවත පුහුණු වන්න (මූලික දැනුම තහවුරු කරගන්න)
                </div>
              </div>
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#608038]" />
              Section-by-Section Performance (කාණ්ඩ 4 අනුව ලකුණු විග්‍රහය):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {JFT_SECTIONS.map((sec) => {
                const data = scoreResults.sectionBreakdown[sec.key];
                if (!data || data.total === 0) return null;
                const pct = Math.round((data.correct / data.total) * 100);

                return (
                  <div key={sec.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 block line-clamp-1">
                      {sec.titleEn}
                    </span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {data.correct} / {data.total}{" "}
                      <span className="text-xs text-slate-500">({data.score} / 62.5 pts)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#608038] h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retake & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold">පෙරහන (Filter):</span>
              <div className="flex gap-1">
                {(["all", "incorrect", "flagged"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setResultFilter(mode)}
                    className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition cursor-pointer ${
                      resultFilter === mode
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {mode === "all" ? "සියල්ල (All)" : mode === "incorrect" ? "වැරදුණු ප්‍රශ්න" : "Flagged"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setFlaggedQuestions({});
                  setCurrentQuestionIndex(0);
                  setCurrentSectionKey("script_vocab");
                  setCompletedSections({
                    script_vocab: false,
                    conversation: false,
                    listening: false,
                    reading: false
                  });
                  setSecondsRemaining((activePaper?.durationMinutes || 60) * 60);
                  setExamStatus("in_progress");
                }}
                className="px-4 py-2 bg-[#608038] hover:bg-[#6c8f40] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>නැවත විභාගය කරන්න (Retake)</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Sinhala Explanations */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#608038]" /> ප්‍රශ්න සහ සවිස්තරාත්මක සිංහල විවරණ (Detailed Explanations):
            </h3>

            {activePaper.questions
              .filter((q) => {
                if (resultFilter === "incorrect") return userAnswers[q.id] !== q.correctOption;
                if (resultFilter === "flagged") return flaggedQuestions[q.id];
                return true;
              })
              .map((q) => {
                const userSelected = userAnswers[q.id];
                const isCorrect = userSelected === q.correctOption;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border-2 transition space-y-2.5 ${
                      isCorrect ? "bg-emerald-50/50 border-emerald-300" : "bg-rose-50/50 border-rose-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                            isCorrect ? "bg-emerald-600" : "bg-rose-600"
                          }`}
                        >
                          {isCorrect ? "✓" : "✗"}
                        </span>
                        <span>ප්‍රශ්නය {q.questionNumber}: {q.sectionTitleJp}</span>
                      </div>
                      <span className="text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {q.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-semibold">{q.instructionEn}</p>
                      <p className="text-sm font-bold text-slate-900 font-japanese">{q.questionJp}</p>
                    </div>

                    {/* Illustration if present */}
                    {q.illustrationType && (
                      <div className="p-2 bg-white rounded border border-slate-200 inline-block">
                        <JFTCBTIllustration type={q.illustrationType} size="sm" />
                      </div>
                    )}

                    {/* Audio Script for Listening */}
                    {q.audioScriptJp && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs space-y-1">
                        <span className="font-bold text-purple-900 flex items-center gap-1">
                          <Headphones className="w-3.5 h-3.5 text-purple-700" />
                          Audio Dialog Script (ශ්‍රව්‍ය සංවාදය):
                        </span>
                        <p className="font-japanese text-slate-800 whitespace-pre-line leading-relaxed">
                          {q.audioScriptJp}
                        </p>
                      </div>
                    )}

                    {/* Options list */}
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isThisCorrect = q.correctOption === opt.id;
                        const isThisUserSelected = userSelected === opt.id;

                        let style = "bg-white border-slate-200 text-slate-700";
                        if (isThisCorrect) style = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                        else if (isThisUserSelected) style = "bg-rose-100 border-rose-500 text-rose-950 font-bold";

                        return (
                          <div
                            key={opt.id}
                            className={`p-2 px-3 rounded border text-xs flex items-center justify-between font-japanese ${style}`}
                          >
                            <span>
                              {opt.id}. {opt.textJp} ({opt.textSi})
                            </span>
                            {isThisCorrect && (
                              <span className="text-[10px] text-emerald-800 font-black">
                                ✓ නිවැරදි පිළිතුර
                              </span>
                            )}
                            {isThisUserSelected && !isThisCorrect && (
                              <span className="text-[10px] text-rose-800 font-black">
                                ✗ ඔබ තේරූ පිළිතුර
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Sinhala Explanation */}
                    <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                      <strong className="text-[#608038] block">විවරණය (Sinhala Explanation):</strong>
                      <p className="leading-relaxed">{q.explanationSi}</p>
                      {q.contextSi && (
                        <div className="text-[11px] text-slate-500 pt-1 border-t">
                          📌 සන්දර්භය: {q.contextSi}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
