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
  ImageIcon,
  X,
  Check,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import {
  ALL_MOCK_TEST_PAPERS,
  MockQuestion,
  MockTestPaper
} from "../data/mockTestsData";

interface MockTestsViewProps {
  userProfile?: {
    username: string;
    targetExam: string;
    avatar: string;
  } | null;
}

export function MockTestsView({ userProfile }: MockTestsViewProps) {
  // 10 Papers Selection (Default: Paper 1)
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number>(0);
  const activePaper: MockTestPaper = ALL_MOCK_TEST_PAPERS[selectedPaperIndex] || ALL_MOCK_TEST_PAPERS[0];

  // Exam operational mode
  const [examStatus, setExamStatus] = useState<"in_progress" | "result">("in_progress");
  
  // Current active question index (0-based, so 0 is Question 1, 14 is Question 15)
  // By default start at Question 15 (index 14) or Question 1 (index 0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(14);

  // User answers mapping: { [questionId: number]: optionId (1, 2, or 3) }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({
    // Pre-populate a few answered like the screenshot (16, 17, 18, 19, 20 are green)
    16: 1,
    17: 2,
    18: 1,
    19: 3,
    20: 1
  });

  // Flagged for review questions mapping: { [questionId: number]: boolean }
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Language display mode: "language2" = Sinhala (as shown in screenshot), "language1" = Japanese
  const [activeLanguage, setActiveLanguage] = useState<"language2" | "language1">("language2");

  // Timer: 60 minutes countdown in seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(activePaper.durationMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Modals
  const [isGridModalOpen, setIsGridModalOpen] = useState<boolean>(false);
  const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState<boolean>(false);
  const [isPaperSelectOpen, setIsPaperSelectOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Review screen filter
  const [resultFilter, setResultFilter] = useState<"all" | "incorrect" | "flagged">("all");

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Formatted timer hh : mm : ss (matching the screenshot format "00 : 00 : 00")
  const formattedTimer = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    return `${hours.toString().padStart(2, "0")} : ${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  }, [secondsRemaining]);

  const currentQuestion: MockQuestion = activePaper.questions[currentQuestionIndex] || activePaper.questions[0];

  // Select an option
  const handleSelectOption = (optionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  // Toggle flag
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Switch Paper
  const handleSelectPaper = (idx: number) => {
    setSelectedPaperIndex(idx);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSecondsRemaining(60 * 60);
    setExamStatus("in_progress");
    setIsPaperSelectOpen(false);
  };

  // Submit and Finish
  const handleConfirmFinish = () => {
    setIsFinishConfirmOpen(false);
    setExamStatus("result");
  };

  // Calculate results
  const { score, totalQuestions, percentage, isPassed, incorrectCount } = useMemo(() => {
    let correct = 0;
    activePaper.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOption) {
        correct++;
      }
    });
    const total = activePaper.questions.length;
    const pct = Math.round((correct / total) * 100);
    return {
      score: correct,
      totalQuestions: total,
      percentage: pct,
      isPassed: correct >= activePaper.passingScore,
      incorrectCount: total - correct
    };
  }, [activePaper, userAnswers]);

  // Candidate name displayed in top olive bar (matches screenshot: "USER mygration")
  const candidateDisplayName = userProfile?.username || "USER mygration";

  // Sidebar window of questions around the current question (matching screenshot showing vertical strip: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
  const sidebarQuestions = useMemo(() => {
    // Show all 45 questions or focused chunk with smooth scroll
    return activePaper.questions;
  }, [activePaper]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#111111] text-slate-900 flex flex-col items-center justify-start select-none min-h-screen font-sans"
    >
      {/* Paper Switcher Quick Bar (Allows switching across all 10 Papers) */}
      <div className="w-full bg-[#181818] border-b border-[#2d2d2d] px-3 sm:px-6 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">📄 Paper Set:</span>
          <span className="font-mono font-bold text-white bg-[#262626] px-2 py-0.5 rounded border border-[#3d3d3d]">
            {activePaper.title}
          </span>
          <span className="hidden md:inline text-slate-400">
            • {activePaper.titleSi} (ප්‍රශ්න 45)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsPaperSelectOpen(true)}
          className="px-3 py-1 bg-[#608038] hover:bg-[#6e9340] text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Papers 1 - 10 තෝරන්න (Select Paper)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC CBT MONITOR CONTAINER (EXACT 1:1 REPLICATION OF SCREENSHOT)   */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1240px] flex flex-col bg-[#ffffff] shadow-2xl border-4 border-[#000000] my-2">

        {/* -------------------- 1. TOP BAR (BLACK #000000) -------------------- */}
        <div className="w-full bg-[#000000] text-white h-[48px] px-4 sm:px-6 flex items-center justify-between">
          
          {/* Left: Question: 15 */}
          <div className="flex items-center text-sm sm:text-base font-normal tracking-wide">
            <span>Question:</span>
            <span className="ml-3 sm:ml-4 font-bold text-white text-base sm:text-lg">
              {currentQuestion.id}
            </span>
          </div>

          {/* Center: Total Test Time Remaining 00 : 00 : 00 */}
          <div className="flex items-center gap-2 text-white">
            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-none text-center">
              <span className="text-[10px] sm:text-xs text-white/90">Total Test Time Remaining</span>
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
                {formattedTimer}
              </span>
            </div>
          </div>

          {/* Right: Finish Section (Amber/Yellow rounded button) */}
          <button
            type="button"
            onClick={() => setIsFinishConfirmOpen(true)}
            className="bg-[#fac457] hover:bg-[#f3be4c] active:bg-[#e6b13e] text-[#000000] px-4 py-1.5 rounded-sm font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            Finish Section
          </button>
        </div>

        {/* -------------------- 2. SUB-HEADER BANNER (OLIVE GREEN #608038) -------------------- */}
        <div className="w-full bg-[#608038] text-white h-[26px] px-4 sm:px-6 flex items-center justify-between text-xs font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">Test:</span>
            <span>General Crop Farming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold">Candidate:</span>
            <span className="font-medium">{candidateDisplayName}</span>
          </div>
        </div>

        {/* -------------------- 3. MAIN QUESTION & TEST AREA -------------------- */}
        <div className="w-full flex min-h-[460px] sm:min-h-[500px] relative bg-white overflow-hidden">
          
          {/* Subtle DS Watermark in Background (Matching screenshot) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-[0.06] select-none">
            <span className="font-serif font-black text-8xl text-slate-800 tracking-widest">DS</span>
            <span className="font-serif font-black text-9xl text-slate-800 tracking-widest">DS</span>
            <span className="font-serif font-black text-8xl text-slate-800 tracking-widest">DS</span>
          </div>

          {/* LEFT VERTICAL QUESTION NAV STRIP (11, 12, 13, 14, 15, 16, 17, 18, 19, 20...) */}
          <div className="w-[46px] sm:w-[50px] bg-[#f5f5f5] border-r border-[#d4d4d4] flex flex-col shrink-0 py-1 overflow-y-auto max-h-[500px] scrollbar-thin">
            {sidebarQuestions.map((q, idx) => {
              const isCurrent = currentQuestionIndex === idx;
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];

              // Styling matching screenshot:
              // - Answered: green background #608038 with white text
              // - Current question: highlighted green #608038 with arrow or border
              // - Unanswered: dark charcoal grey #383838 with white text and small top notch
              let tabBg = "bg-[#383838] text-white hover:bg-[#4a4a4a]";
              if (isCurrent) {
                tabBg = "bg-[#608038] text-white ring-2 ring-emerald-500 z-10 shadow-xs";
              } else if (isAnswered) {
                tabBg = "bg-[#608038] text-white hover:bg-[#6c8f40]";
              } else if (isFlagged) {
                tabBg = "bg-[#d97706] text-white";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-[40px] sm:w-[44px] h-[22px] my-[1px] ml-[2px] rounded-r-sm text-[11px] font-bold flex items-center justify-center transition cursor-pointer relative ${tabBg}`}
                  title={`Question ${q.id}: ${q.topic}`}
                >
                  {/* Small top-left fold notch like physical tab in screenshot */}
                  <span className="absolute top-0 left-0 w-[3px] h-[3px] bg-black/30"></span>
                  <span>{q.id}</span>
                </button>
              );
            })}
          </div>

          {/* CENTER TEST CONTENT AREA */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 relative z-10">
            
            {/* Top Container: Question Box & Language Buttons */}
            <div className="space-y-3">
              
              {/* Question Blue Box (Soft baby blue #dbe6f3 matching screenshot) */}
              <div className="w-full bg-[#dbe6f3] border border-[#cbd5e1] p-3 sm:p-4 rounded-xs shadow-2xs">
                <p className="text-[#0f172a] text-sm sm:text-[15px] font-medium leading-relaxed font-sans">
                  {activeLanguage === "language2"
                    ? currentQuestion.questionSi
                    : currentQuestion.questionJp}
                </p>
              </div>

              {/* Language 1 & Language 2 Toggles (Matching screenshot buttons) */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setActiveLanguage("language1")}
                  className={`px-2 py-1 rounded-xs border text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer shadow-3xs ${
                    activeLanguage === "language1"
                      ? "bg-[#608038] text-white border-[#608038] font-bold"
                      : "bg-[#ffffff] text-[#333333] border-[#a3a3a3] hover:bg-slate-100"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 opacity-70" />
                  <span>Your Language 1</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLanguage("language2")}
                  className={`px-2 py-1 rounded-xs border text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer shadow-3xs ${
                    activeLanguage === "language2"
                      ? "bg-[#608038] text-white border-[#608038] font-bold"
                      : "bg-[#ffffff] text-[#333333] border-[#a3a3a3] hover:bg-slate-100"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 opacity-70" />
                  <span>Your Language 2</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>

                <span className="text-[10px] text-slate-500 font-mono ml-2">
                  (Language 1: 日本語 • Language 2: සිංහල)
                </span>
              </div>

              {/* CHOICES / OPTIONS (Clean Rectangular Boxes with Black Border, matching screenshot) */}
              <div className="pt-6 sm:pt-8 space-y-3.5 max-w-[500px]">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestion.id] === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full min-h-[38px] px-4 py-2 border border-[#000000] transition cursor-pointer flex items-center rounded-xs ${
                        isSelected
                          ? "bg-[#eaf1fb] border-2 border-[#1e40af] shadow-xs"
                          : "bg-[#ffffff] hover:bg-[#fbfbfb]"
                      }`}
                    >
                      <span className="text-[#000000] text-xs sm:text-sm font-medium tracking-wide">
                        {activeLanguage === "language2" ? option.textSi : option.textJp}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* BOTTOM RIGHT ASAT LOGO (Matching screenshot exactly) */}
            <div className="self-end mt-6 select-none flex flex-col items-center text-center">
              <div className="font-black text-3xl sm:text-4xl text-[#000000] tracking-tighter leading-none font-sans">
                ASAT
              </div>
              <div className="w-full h-[1.5px] bg-[#000000] my-1"></div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#000000] tracking-tight leading-none uppercase">
                Agriculture Skill Assessment Test
              </div>
              <div className="text-[8px] text-[#444444] font-medium leading-tight mt-0.5">
                Hosted by National Chamber of Agriculture
              </div>
            </div>

          </div>

        </div>

        {/* -------------------- 4. BOTTOM BAR (BLACK #000000) -------------------- */}
        <div className="w-full bg-[#000000] text-white h-[46px] px-3 sm:px-6 flex items-center justify-between">
          
          {/* Left Controls: Gear, Grid, Question-mark (White icons) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaperSelectOpen(true)}
              className="p-1 hover:text-emerald-400 transition cursor-pointer text-white"
              title="Settings & Paper Selector"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsGridModalOpen(true)}
              className="p-1 hover:text-emerald-400 transition cursor-pointer text-white"
              title="Questions Overview Grid"
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="p-1 hover:text-emerald-400 transition cursor-pointer text-white"
              title="Exam Help & Guidelines"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Right Controls: Green Flag, < Back, Next > */}
          <div className="flex items-center gap-2">
            
            {/* Green Flag Button */}
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`w-[36px] h-[30px] rounded flex items-center justify-center transition cursor-pointer ${
                flaggedQuestions[currentQuestion.id]
                  ? "bg-[#d97706] hover:bg-[#b45309]"
                  : "bg-[#608038] hover:bg-[#6c8f40]"
              }`}
              title="Flag / Mark for Review"
            >
              <Flag className="w-4 h-4 text-white fill-white" />
            </button>

            {/* < Back Button (Olive green #608038) */}
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-1.5 bg-[#608038] hover:bg-[#6c8f40] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1"
            >
              <span>&lt; Back</span>
            </button>

            {/* Next > Button (Olive green #608038) */}
            <button
              type="button"
              disabled={currentQuestionIndex === activePaper.totalQuestions - 1}
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(activePaper.totalQuestions - 1, prev + 1))}
              className="px-4 py-1.5 bg-[#608038] hover:bg-[#6c8f40] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1"
            >
              <span>Next &gt;</span>
            </button>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. PAPER SELECTION MODAL (PAPERS 01 TO 10)                               */}
      {/* ========================================================================= */}
      {isPaperSelectOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl border-2 border-slate-300 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-4 bg-[#608038] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-300" /> CBT ප්‍රශ්න පත්‍ර 10 තෝරාගැනීම (Select from 10 Papers)
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  සෑම ප්‍රශ්න පත්‍රයකම සියලුම පාඩම් ආවරණය වන පරිදි ප්‍රශ්න 45 ක් අඩංගුය.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaperSelectOpen(false)}
                className="p-1 rounded hover:bg-black/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Papers List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {ALL_MOCK_TEST_PAPERS.map((paper, idx) => {
                const isSelected = selectedPaperIndex === idx;

                return (
                  <div
                    key={paper.id}
                    onClick={() => handleSelectPaper(idx)}
                    className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#f0f7e6] border-[#608038] shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#608038] text-white rounded text-[10px] font-black uppercase">
                          Paper {paper.paperNumber.toString().padStart(2, "0")}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {paper.titleSi}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        {paper.titleJp} • 45 Questions • 60 Minutes
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="text-[#608038] font-black text-xs bg-white px-2.5 py-1 rounded-full border border-[#608038]">
                          ✓ Active Now
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 bg-slate-200 hover:bg-[#608038] hover:text-white text-slate-700 text-xs font-bold rounded transition cursor-pointer"
                        >
                          පටන් ගන්න
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setIsPaperSelectOpen(false)}
                className="px-4 py-1.5 bg-slate-700 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                වසන්න (Close)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. QUESTION OVERVIEW GRID MODAL (ALL 45 QUESTIONS)                        */}
      {/* ========================================================================= */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-[#000000] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#fac457]" />
                <h3 className="font-bold text-sm text-white">
                  ප්‍රශ්න 45 ලැයිස්තුව (Question Overview Grid)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGridModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-4 text-xs font-bold text-slate-700 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#608038]"></span>
                <span>පිළිතුරු දුන් ({Object.keys(userAnswers).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#d97706]"></span>
                <span>සලකුණු කළ ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#383838]"></span>
                <span>පිළිතුරු නොදුන් ({activePaper.totalQuestions - Object.keys(userAnswers).length})</span>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {activePaper.questions.map((q, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];

                  let bg = "bg-[#383838] text-white";
                  if (isCurrent) {
                    bg = "bg-[#608038] text-white ring-3 ring-[#fac457] z-10";
                  } else if (isFlagged) {
                    bg = "bg-[#d97706] text-white";
                  } else if (isAnswered) {
                    bg = "bg-[#608038] text-white";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setIsGridModalOpen(false);
                      }}
                      className={`h-10 rounded-sm font-bold text-xs flex items-center justify-center cursor-pointer transition ${bg}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsGridModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold cursor-pointer"
              >
                නැවත ප්‍රශ්නයට
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGridModalOpen(false);
                  setIsFinishConfirmOpen(true);
                }}
                className="px-4 py-1.5 bg-[#fac457] hover:bg-[#f3be4c] text-black font-bold text-xs rounded cursor-pointer"
              >
                Finish Section
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. FINISH CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {isFinishConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#fef3c7] text-[#d97706] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Are you sure you want to finish this section?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ඔබට මෙම විභාග කොටස අවසන් කර ප්‍රතිඵල බැලීමට අවශ්‍යද?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">පිළිතුරු දුන්:</span>
                <span className="font-bold text-[#608038] text-base">{Object.keys(userAnswers).length} / 45</span>
              </div>
              <div>
                <span className="text-slate-500 block">නොදුන්:</span>
                <span className="font-bold text-rose-600 text-base">{45 - Object.keys(userAnswers).length}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFinishConfirmOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold cursor-pointer"
              >
                Cancel (ආපසු)
              </button>
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="flex-1 py-2 bg-[#608038] hover:bg-[#6e9340] text-white rounded text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Finish Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. HELP MODAL                                                             */}
      {/* ========================================================================= */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#608038]" /> විභාග පද්ධති මඟපෙන්වීම (ASAT CBT Guide)
              </h3>
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>• <strong>ප්‍රශ්න පත්‍ර 10:</strong> Settings (⚙) හෝ ඉහළ තීරුවෙන් ඕනෑම Paper 1 - 10 ප්‍රශ්න පත්‍රයක් තෝරා පුහුණු විය හැක.</p>
              <p>• <strong>භාෂා මාරු කිරීම:</strong> `Your Language 1` (ජපන්) සහ `Your Language 2` (සිංහල) බොත්තම් මඟින් භාෂාව පහසුවෙන් මාරු කරන්න.</p>
              <p>• <strong>සලකුණු කිරීම (Flag):</strong> සැක සහිත ප්‍රශ්න කොළ පැහැති ධජය (Flag) ඔබා සලකුණු කර තබා පසුව පරික්ෂා කරන්න.</p>
              <p>• <strong>ප්‍රශ්න 45 ලැයිස්තුව:</strong> පහළ ඇති 3x3 Grid බොත්තම මඟින් සම්පූර්ණ ප්‍රශ්න 45 ම එකවර බලා අවශ්‍ය ප්‍රශ්නයට කෙලින්ම පිවිසිය හැක.</p>
            </div>

            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2 bg-[#608038] text-white rounded text-xs font-bold cursor-pointer"
            >
              තේරුම් ගත්තා (OK)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. DETAILED RESULTS & SCORECARD (WHEN FINISHED)                          */}
      {/* ========================================================================= */}
      {examStatus === "result" && (
        <div className="w-full max-w-[1240px] my-6 bg-white rounded-2xl border-2 border-slate-300 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Certificate Banner */}
          <div className={`p-6 rounded-2xl text-white ${isPassed ? "bg-[#608038]" : "bg-rose-700"}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full">
                  {isPassed ? "🎉 PASSED (සමත් විය)" : "⚠️ NOT PASSED (නැවත උත්සාහ කරන්න)"}
                </span>
                <h2 className="text-2xl font-black mt-2">
                  {activePaper.titleSi} - ප්‍රතිඵල සටහන
                </h2>
                <p className="text-xs text-white/80">
                  Candidate: {candidateDisplayName} • Exam: General Crop Farming
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-xl text-center flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-white/70 block uppercase">ලකුණු (Score)</span>
                  <span className="text-3xl font-black">{score} / {totalQuestions}</span>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <span className="text-[10px] text-white/70 block uppercase">ප්‍රතිශතය</span>
                  <span className="text-3xl font-black text-amber-300">{percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">පෙරහන:</span>
              <button
                type="button"
                onClick={() => setResultFilter("all")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  resultFilter === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border"
                }`}
              >
                සියල්ල ({totalQuestions})
              </button>
              <button
                type="button"
                onClick={() => setResultFilter("incorrect")}
                className={`px-3 py-1 rounded text-xs font-bold cursor-pointer ${
                  resultFilter === "incorrect" ? "bg-rose-600 text-white" : "bg-white text-rose-700 border"
                }`}
              >
                වැරදුනු ප්‍රශ්න ({incorrectCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setFlaggedQuestions({});
                  setCurrentQuestionIndex(0);
                  setSecondsRemaining(60 * 60);
                  setExamStatus("in_progress");
                }}
                className="px-4 py-2 bg-[#608038] hover:bg-[#6c8f40] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>නැවත විභාගය කරන්න (Retake)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPaperSelectOpen(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>වෙනත් Paper එකක් තෝරන්න</span>
              </button>
            </div>
          </div>

          {/* Question Explanations List */}
          <div className="space-y-4">
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
                    className={`p-4 rounded-xl border-2 transition ${
                      isCorrect ? "bg-emerald-50/50 border-emerald-300" : "bg-rose-50/50 border-rose-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${isCorrect ? "bg-emerald-600" : "bg-rose-600"}`}>
                          {isCorrect ? "✓" : "✗"}
                        </span>
                        <span>ප්‍රශ්නය {q.id}: {q.topic}</span>
                      </div>
                      <span className="text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {q.chapter}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-slate-500 font-mono">{q.questionJp}</p>
                      <p className="text-sm font-bold text-slate-900">{q.questionSi}</p>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {q.options.map((opt) => {
                        const isThisCorrect = q.correctOption === opt.id;
                        const isThisUserSelected = userSelected === opt.id;

                        let style = "bg-white border-slate-200 text-slate-700";
                        if (isThisCorrect) style = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                        else if (isThisUserSelected) style = "bg-rose-100 border-rose-500 text-rose-950 font-bold";

                        return (
                          <div key={opt.id} className={`p-2 px-3 rounded border text-xs flex items-center justify-between ${style}`}>
                            <span>{opt.id}. {opt.textSi} ({opt.textJp})</span>
                            {isThisCorrect && <span className="text-[10px] text-emerald-800 font-black">✓ නිවැරදි පිළිතුර</span>}
                            {isThisUserSelected && !isThisCorrect && <span className="text-[10px] text-rose-800 font-black">✗ ඔබ තේරූ පිළිතුර</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                      <strong className="text-[#608038] block">විවරණය:</strong>
                      <p className="leading-relaxed">{q.explanationSi}</p>
                      <div className="text-[11px] text-slate-500 pt-1 border-t">
                        📖 {q.referenceLesson}
                      </div>
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
