import React, { useState, useEffect } from "react";
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
  Languages
} from "lucide-react";
import { KanjiCard } from "../data/preloadedKanji";
import { JFTVerb } from "../data/preloadedVerbs";

export type QuizMode =
  | "kanji_reading" // Kanji -> Hiragana
  | "reading_kanji" // Hiragana -> Kanji
  | "sinhala_verb_japanese" // Sinhala Verb -> Kanji (Furigana)
  | "japanese_verb_sinhala"; // Japanese Verb -> Sinhala

interface QuizQuestion {
  prompt: string;
  correctAnswer: string;
  options: string[];
  originalItem: KanjiCard | JFTVerb;
}

interface QuizAnswerHistory {
  questionPrompt: string;
  correctAnswer: string;
  userChoice: string;
  isCorrect: boolean;
  originalItem: KanjiCard | JFTVerb;
}

interface QuizViewProps {
  kanjiCards: KanjiCard[];
  verbsList: JFTVerb[];
  onBackToLearn?: () => void;
}

export default function QuizView({ kanjiCards, verbsList, onBackToLearn }: QuizViewProps) {
  // Setup States
  const [quizMode, setQuizMode] = useState<QuizMode>("kanji_reading");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<"setup" | "playing" | "summary">("setup");

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

  // Generate the Quiz Questions
  const startQuiz = () => {
    let pool: Array<KanjiCard | JFTVerb> = [];
    let isVerbsMode = quizMode === "sinhala_verb_japanese" || quizMode === "japanese_verb_sinhala";

    if (isVerbsMode) {
      pool = [...verbsList];
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

      if (!isVerbsMode) {
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
      } else {
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
      if (quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading") {
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
      if (quizMode === "sinhala_verb_japanese" || quizMode === "reading_kanji") {
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
      if (quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading") {
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
      <AnimatePresence mode="wait">
        
        {/* --- 1. SETUP / CONFIGURATION SCREEN --- */}
        {gameState === "setup" && (
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
                Kanji සහ ක්‍රියාපද (Verbs) සඳහා විකල්ප 4කින් යුත් බහුවරණ ප්‍රශ්නාවලිය ජපන් සහ සිංහලෙන් පුහුණු වෙන්න.
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
                      ප්‍රශ්නය ලෙස Kanji පෙන්වන අතර නිවැරදි හිරගනා ශබ්දය තෝරාගත යුතුය.
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

              </div>
            </div>

            {/* Questions count choice */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-[#52796f] uppercase tracking-wider">
                ප්‍රශ්න ගණන තෝරන්න (Select Question Volume)
              </h3>
              <div className="flex gap-2">
                {[10, 20, 30, 50, 100].map((num) => {
                  let maxAvailable = quizMode === "sinhala_verb_japanese" || quizMode === "japanese_verb_sinhala" ? verbsList.length : kanjiCards.length;
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
                {(quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading") && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(currentQuestion.prompt)}
                    className="mx-auto mt-2 p-2 bg-[#f0ede6] hover:bg-[#e9e2d7]/80 rounded-xl flex items-center gap-1.5 text-xs font-bold text-[#52796f] transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Pronounce Pronprompt
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
                      {("englishMeaning" in currentQuestion.originalItem) ? (
                        <>
                          <strong>English Meaning:</strong> {(currentQuestion.originalItem as KanjiCard).englishMeaning} | <strong>Sinhala:</strong> {(currentQuestion.originalItem as KanjiCard).sinhalaMeaning}
                        </>
                      ) : (
                        <>
                          <strong>Conjugation:</strong> Masu form is <code>{(currentQuestion.originalItem as JFTVerb).masu}</code> and Dictionary form is <code>{(currentQuestion.originalItem as JFTVerb).dictionary}</code>.
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
                        {(quizMode === "japanese_verb_sinhala" || quizMode === "kanji_reading") && (
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
                        {("englishMeaning" in record.originalItem) ? (
                          <>
                            Sinhala: {(record.originalItem as KanjiCard).sinhalaMeaning} | Furigana: {(record.originalItem as KanjiCard).furigana}
                          </>
                        ) : (
                          <>
                            Masu: {(record.originalItem as JFTVerb).masu} | Dict: {(record.originalItem as JFTVerb).dictionary}
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
