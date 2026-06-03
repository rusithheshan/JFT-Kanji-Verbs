import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Edit3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Trash2,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Compass
} from "lucide-react";
import { KanjiCard, LearningStatus } from "../types";

// A highly robust, multi-layered caching fallback component to load GIFs, SVGs or PNGs dynamically from CDNs and GitHub
export function KanjiStrokeImage({ kanji, className }: { kanji: string; className?: string }) {
  const code = kanji.codePointAt(0) || 0;
  const hexZeroPadded = code.toString(16).toLowerCase().padStart(5, "0");
  const decimal = code;
  const encoded = encodeURIComponent(kanji);

  const sources = [
    `https://cdn.jsdelivr.net/gh/gregcoedy/kanji-gifs@master/gifs/${encoded}.gif`,
    `https://raw.githubusercontent.com/gregcoedy/kanji-gifs/master/gifs/${encoded}.gif`,
    `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${hexZeroPadded}.svg`,
    `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hexZeroPadded}.svg`,
    `https://cdn.jsdelivr.net/gh/etienned/kanji-stroke-order-diagrams@master/diagrams/${decimal}.png`,
    `https://raw.githubusercontent.com/etienned/kanji-stroke-order-diagrams/master/diagrams/${decimal}.png`
  ];

  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [kanji]);

  if (srcIndex >= sources.length) {
    return (
      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-[9px] font-black uppercase p-1 text-center">
        <span>No Guide</span>
        <span className="text-[7.5px] font-black text-slate-300">({kanji})</span>
      </div>
    );
  }

  return (
    <img
      src={sources[srcIndex]}
      alt={`${kanji} stroke sequence`}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        setSrcIndex((prev) => prev + 1);
      }}
    />
  );
}

interface KanjiWritingPracticeViewProps {
  cards: KanjiCard[];
  progress: Record<string, LearningStatus>;
  onStatusChange: (id: string, newStatus: LearningStatus) => void;
  onClose: () => void;
}

export default function KanjiWritingPracticeView({
  cards,
  progress,
  onStatusChange,
  onClose,
}: KanjiWritingPracticeViewProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Solid, 2: Step-by-Step, 3: Watermark Brush, 4: Blank Brush
  const [drawingScore, setDrawingScore] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [drawStatus, setDrawStatus] = useState<LearningStatus | null>(null);

  // Interactive Stroke Order Player States
  const [showStrokePlayer, setShowStrokePlayer] = useState(false);
  const [playerStep, setPlayerStep] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const activeCard = cards[activeIdx];

  // Reset drawing canvas and verification states on card/step change
  useEffect(() => {
    setDrawingScore(null);
    setHasChecked(false);
    setDrawStatus(progress[activeCard?.id] || "UNSTUDIED");
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeIdx, step, activeCard]);

  // Autoplay effect to cycle through stroke steps
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAutoplay && showStrokePlayer && activeCard) {
      const strokesCount = getKanjiStrokeLines(activeCard.kanji).length;
      interval = setInterval(() => {
        setPlayerStep((prev) => {
          if (prev >= strokesCount - 1) {
            return 0; // Loop back
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoplay, showStrokePlayer, activeCard]);

  // Audio Pronunciation
  const speakKanji = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeCard?.kanji.replace(/\./g, ""));
      utterance.lang = "ja-JP";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Drawing mouse handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawing.current = true;
    lastX.current = x;
    lastY.current = y;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 12; // Slightly thicker brush for comfortable writing
    ctx.strokeStyle = "#2f3e46"; // Premium dark stone color for ink

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  // Touch handlers for mobile/tablet drawing
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    isDrawing.current = true;
    lastX.current = x;
    lastY.current = y;
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || e.touches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#2f3e46";

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
  };

  // Clear drawing canvas completely
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setDrawingScore(null);
    setHasChecked(false);
  };

  // F1-Score Similarity check with anti-scribble validation
  const checkCanvasDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create offscreen canvas with target character rendered cleanly
    const refCanvas = document.createElement("canvas");
    refCanvas.width = canvas.width;
    refCanvas.height = canvas.height;
    const refCtx = refCanvas.getContext("2d");
    if (!refCtx) return;

    // Draw reference character at same size & location
    refCtx.fillStyle = "#ffffff";
    refCtx.fillRect(0, 0, refCanvas.width, refCanvas.height);
    refCtx.fillStyle = "#000000";
    refCtx.font = "bold 150px 'Inter', sans-serif";
    refCtx.textAlign = "center";
    refCtx.textBaseline = "middle";
    refCtx.fillText(activeCard?.kanji, refCanvas.width / 2, refCanvas.height / 2 + 10);

    // Get pixel grids
    const userContext = canvas.getContext("2d");
    if (!userContext) return;
    const userImageData = userContext.getImageData(0, 0, canvas.width, canvas.height);
    const refImageData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
    
    if (!userImageData || !refImageData) return;

    // Grid checker Resolution (40x40 cell areas)
    const gridSize = 40;
    const cellW = canvas.width / gridSize;
    const cellH = canvas.height / gridSize;

    let totalRefCells = 0;
    let totalUserCells = 0;
    let truePositives = 0;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const checkX = Math.floor(c * cellW + cellW / 2);
        const checkY = Math.floor(r * cellH + cellH / 2);
        const pixelIdx = (checkY * canvas.width + checkX) * 4;

        // User drawn ink (opacity check on clean template)
        const userDrawOpacity = userImageData.data[pixelIdx + 3];
        const isUserInk = userDrawOpacity > 30; // Clean absolute canvas has ONLY user strokes!

        // Reference Kanji shape (black)
        const refR = refImageData.data[pixelIdx];
        const isRefBlack = refR < 100;

        if (isRefBlack) {
          totalRefCells++;
        }
        if (isUserInk) {
          totalUserCells++;
        }
        if (isRefBlack && isUserInk) {
          truePositives++;
        }
      }
    }

    if (totalRefCells === 0) totalRefCells = 1;

    // Recall: how much of the original character shape did the user's painted lines cover?
    const recall = truePositives / totalRefCells;

    // Scale up base ratio generously to allow high finger drawing hand flexibility
    const baseRatio = Math.min(100, recall * 135);

    // Highly forgiving scribble penalization (designed around hand shakiness and deviation tolerance)
    const outsideErrors = Math.max(0, totalUserCells - truePositives);
    const penaltyRate = 0.35; // Lowered from 1.2 for rich hand-drawing tolerance
    const scribblePenalty = Math.min(65, (outsideErrors / totalRefCells) * 100 * penaltyRate);

    let finalScore = Math.max(0, Math.round(baseRatio - scribblePenalty));

    // Support flexible score shifts
    if (finalScore > 25) {
      finalScore = Math.min(100, finalScore + 15);
    }

    if (finalScore >= 78) {
      finalScore = 100;
    }

    if (totalUserCells < 5) {
      finalScore = 0; // barely drew anything
    }

    setDrawingScore(finalScore);
    setHasChecked(true);

    // Auto mark status to OK if they did well (forgiving score of 55%+ is passed!)
    if (finalScore >= 55) {
      onStatusChange(activeCard.id, "OK");
      setDrawStatus("OK");
    } else {
      onStatusChange(activeCard.id, "NOT_YET");
      setDrawStatus("NOT_YET");
    }
  };

  const handleNextCard = () => {
    if (activeIdx + 1 < cards.length) {
      setActiveIdx((prev) => prev + 1);
      setStep(1);
    }
  };

  const handlePrevCard = () => {
    if (activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
      setStep(1);
    }
  };

  const getStepGuideSinhala = () => {
    switch (step) {
      case 1:
        return "කන්ජි අකුර හොඳින් බලා මතක තබා ගන්න. (Study the solid shape)";
      case 2:
        return "අඳින පිළිවෙළ (Stroke guides) බලාගෙන අකුරේ හැඩය විශ්ලේෂණය කරන්න.";
      case 3:
        return "ලා පාටින් පෙනෙන අකුර උඩින් හරියටම බුරුසුවෙන් ඇඳ පුහුණු වන්න. (Trace physical watermark)";
      case 4:
        return "දැන් හිස් කොටුව මත ඔබගේ මතකයෙන් මුළු කන්ජි අකුරම අඳින්න! (Draw from memory and check)";
    }
  };

  // Dynamic correct stroke order lists
  const getKanjiStrokeLines = (kanji: string) => {
    switch (kanji) {
      case "山":
        return [
          { label: "මැද සිරස් රේඛාව පහළට (1)", path: "M 150 50 L 150 250" },
          { label: "වම් සිරස් හා පහළ තිරස් (2)", path: "M 80 120 L 80 230 L 220 230" },
          { label: "දකුණු සිරස් පහළට (3)", path: "M 220 120 L 220 230" }
        ];
      case "川":
        return [
          { label: "වම් සිරස් වහලය පහළට (1)", path: "M 90 70 L 90 220 C 90 240, 75 250, 70 250" },
          { label: "මැද කෙටි සිරස් ඉර (2)", path: "M 150 95 L 150 205" },
          { label: "දකුණු සිරස් පහළට (3)", path: "M 210 50 L 210 250" }
        ];
      case "日":
        return [
          { label: "වම් සිරස් කණුව (1)", path: "M 90 60 L 90 240" },
          { label: "ඉහළ පිටත සහ දකුණ (2)", path: "M 90 60 L 210 60 L 210 240" },
          { label: "මැද තිරස් හරස් ඉර (3)", path: "M 90 150 L 210 150" },
          { label: "පතුළේ තිරස් පියන (4)", path: "M 90 240 L 210 240" }
        ];
      case "月":
        return [
          { label: "වම් සිරස් ආනත පහළට (1)", path: "M 90 50 L 90 180 C 90 220, 80 240, 65 250" },
          { label: "ඉහළ, දකුණු සිරස් සහ කොක්ක (2)", path: "M 90 50 L 200 50 L 200 230 C 200 245, 190 245, 185 240" },
          { label: "මැද පළමු කෙටි ඉර (3)", path: "M 90 110 L 200 110" },
          { label: "මැද දෙවන කෙටි ඉර (4)", path: "M 90 170 L 200 170" }
        ];
      case "火":
        return [
          { label: "වම් පැත්තේ කෙටි තිත (1)", path: "M 90 110 Q 100 120, 110 130" },
          { label: "දකුණු පැත්තේ කෙටි තිත (2)", path: "M 210 110 Q 200 120, 190 130" },
          { label: "මැද වම් පසට දිවෙන රේඛාව (3)", path: "M 150 60 C 140 120, 110 210, 70 250" },
          { label: "මැද දකුණට වැතිරෙන කකුල (4)", path: "M 150 140 Q 180 180, 230 250" }
        ];
      default:
        // Generic fallback strokes representing cross section
        return [
          { label: "මැද හරස් රේඛාව (1)", path: "M 70 150 L 230 150" },
          { label: "සිරස් මැද ඉර (2)", path: "M 150 50 L 150 250" },
          { label: "ආනත හරස් රේඛාව (3)", path: "M 80 80 L 220 220" }
        ];
    }
  };

  return (
    <div className="bg-[#fcfaf2] rounded-[32px] border border-[#e9e2d7] p-6 shadow-sm space-y-6" id="kanji-writing-studio">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#e9e2d7] pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#ece2d0] text-[#bc6c25] uppercase">
            <Edit3 className="w-3.5 h-3.5" /> KANJI WRITING CANVAS
          </span>
          <h3 className="text-xl font-black text-[#354f52] font-display mt-1">
            කන්ජි අකුරු ලිවීමේ පුහුණු පාසල
          </h3>
          <p className="text-xs text-slate-500">
            {cards.length} කන්ජි අකුරු වලින් සෑදූ විශේෂිත පුහුණු පරික්ෂණය
          </p>
        </div>

        {/* Action Toggle Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[#f0ede6] hover:bg-[#cad2c5] text-[#354f52] text-xs font-bold rounded-xl transition cursor-pointer"
        >
          ◀ ආපසු කාඩ්පත් ග්‍රිඩ් එකට (Back to Cards)
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border">
          <p className="text-sm font-semibold text-slate-400">Please load Kanji cards first to practice writing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Kanji metadata details Card */}
          <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#e9e2d7] p-6 shadow-xs space-y-5">
            
            {/* Card Navigator */}
            <div className="flex items-center justify-between bg-[#fcfaf2] p-2.5 rounded-xl border">
              <button
                type="button"
                onClick={handlePrevCard}
                disabled={activeIdx === 0}
                className="p-1 px-3 bg-white text-[#bc6c25] border disabled:opacity-40 rounded-lg text-xs font-extrabold transition cursor-pointer font-sans"
              >
                ◀ කලින්
              </button>
              <span className="font-mono text-xs font-black text-[#354f52]">
                CARD {activeIdx + 1} / {cards.length}
              </span>
              <button
                type="button"
                onClick={handleNextCard}
                disabled={activeIdx === cards.length - 1}
                className="p-1 px-3 bg-white text-[#bc6c25] border disabled:opacity-40 rounded-lg text-xs font-extrabold transition cursor-pointer font-sans"
              >
                ඊළඟ ▶
              </button>
            </div>

            {/* Main Title Panel */}
            <div className="text-center space-y-3 pt-2">
              <span className="text-[10px] tracking-widest text-[#bc6c25] font-black uppercase bg-[#ece2d0] px-3.5 py-1 rounded-full border border-[#e9e2d7]">
                {activeCard.furigana} - {activeCard?.id.split("_").pop()?.toUpperCase()}
              </span>
              
              <h2 className="text-5xl font-black text-[#2f3e46] font-sans my-4">
                {activeCard.kanji}
              </h2>

              <button
                type="button"
                onClick={speakKanji}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ede6]/70 hover:bg-[#ece2d0] text-xs font-bold rounded-xl text-[#52796f] transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> හඬ ඇසීමට ක්ලික් කරන්න (Speak)
              </button>
            </div>

            {/* Readings */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7]">
                <span className="font-sans font-black text-[9px] text-[#84a98c] block uppercase tracking-wider">Onyomi (චීන)</span>
                <span className="font-mono font-bold text-slate-700 block mt-0.5">{activeCard.onyomi || "—"}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7]">
                <span className="font-sans font-black text-[9px] text-[#84a98c] block uppercase tracking-wider">Kunyomi (ජපන්)</span>
                <span className="font-mono font-bold text-[#bc6c25] block mt-0.5">{activeCard.kunyomi || "—"}</span>
              </div>
            </div>

            {/* Meanings */}
            <div className="p-3.5 bg-amber-50/20 border border-amber-900/10 rounded-2xl relative space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase text-[#84a98c]">සිංහල තේරුම (Meaning)</span>
                <p className="text-base font-black text-[#354f52] leading-tight mt-0.5">{activeCard.sinhalaMeaning}</p>
              </div>
              <div className="border-t border-[#e9e2d7]/50 pt-2.5">
                <span className="text-[9px] font-black uppercase text-[#84a98c]">English Meaning</span>
                <p className="text-xs font-bold text-[#52796f] leading-tight mt-0.5">{activeCard.englishMeaning}</p>
              </div>
            </div>

            {/* Status Selector Progress inside writing arena */}
            <div className="border-t border-[#e9e2d7] pt-4">
              <span className="text-[9px] font-black text-slate-400 block mb-2 uppercase text-center tracking-wider">
                මෙම කන්ජි ප්‍රගතිය (Writing Proficiency):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(activeCard.id, "NOT_YET");
                    setDrawStatus("NOT_YET");
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    drawStatus === "NOT_YET"
                      ? "bg-[#bc6c25] text-white shadow-xs"
                      : "bg-[#ece2d0]/50 text-[#bc6c25] hover:bg-[#ece2d0]"
                  }`}
                >
                  ❌ NOT YET
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(activeCard.id, "OK");
                    setDrawStatus("OK");
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    drawStatus === "OK"
                      ? "bg-[#52796f] text-white shadow-xs"
                      : "bg-[#cad2c5]/40 text-[#52796f] hover:bg-[#cad2c5]"
                  }`}
                >
                  ✔️ OK
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Studio Practice Step-by-Step with LOKU Canvas */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#e9e2d7] p-6 shadow-xs flex flex-col items-center space-y-6">
            
            {/* Steps Controller header */}
            <div className="w-full flex justify-between bg-[#f0ede6] p-1.5 rounded-2xl border border-[#e9e2d7] items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStep(s as any)}
                  className={`flex-1 py-2 text-center rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                    step === s
                      ? "bg-white text-[#bc6c25] shadow-xs scale-102"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  පියවර {s}
                </button>
              ))}
            </div>

            {/* Instruction strip banner */}
            <div className="w-full p-3 bg-amber-50/40 border border-amber-900/5 text-[#354f52] rounded-xl text-xs font-semibold text-center leading-relaxed">
              💡 {getStepGuideSinhala()}
            </div>

            {/* Layout Box for Canvas & Side Stroke Order Helper */}
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
              
              {/* Workspace LOKU Canvas / View Panel wrapper (400x400 width) */}
              <div className="relative w-full max-w-[390px] aspect-square rounded-[36px] bg-[#fcfaf2] border-2 border-[#e9e2d7] shadow-md overflow-hidden flex items-center justify-center touch-none">
                
                {/* STEP 1: Dark/solid Kanji view */}
                {step === 1 && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
                    <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-3xl opacity-15"></div>
                    <span className="text-[140px] font-black text-[#2f3e46] font-sans select-none">
                      {activeCard.kanji}
                    </span>
                  </div>
                )}

                {/* STEP 2: Step-by-step stroke visualization order mapping */}
                {step === 2 && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                    {/* SVG Canvas depicting custom simulated path lines */}
                    <svg className="w-full h-full max-w-[340px]" viewBox="0 0 300 300">
                      {/* Background Grid crosshairs */}
                      <line x1="150" y1="0" x2="150" y2="300" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="150" x2="300" y2="150" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Rendering our customized stroke line segments */}
                      {getKanjiStrokeLines(activeCard.kanji).map((stroke, idx) => (
                        <g key={idx} className="group">
                          <motion.path
                            d={stroke.path}
                            fill="none"
                            stroke="#bc6c25"
                            strokeWidth="11"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 1.5,
                              delay: idx * 1.3,
                              repeat: Infinity,
                              repeatDelay: 1.5
                            }}
                          />
                          {/* Start coordinates indicator point to signify start directions */}
                          <circle cx={stroke.path.split(" ")[1]} cy={stroke.path.split(" ")[2]} r="6" fill="#52796f" />
                          <text
                            x={parseInt(stroke.path.split(" ")[1]) - 12}
                            y={parseInt(stroke.path.split(" ")[2]) - 12}
                            fill="#354f52"
                            fontSize="16"
                            fontWeight="black"
                          >
                            {idx + 1}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                )}

                {/* STEP 3 & STEP 4: Interactive Drawing Canvas with Background Overlay Grid/Watermark */}
                {(step === 3 || step === 4) && (
                  <div className="relative w-full h-full select-none">
                    {/* Background SVG Grid */}
                    <div className="absolute inset-0 pointer-events-none select-none z-0">
                      <svg className="w-full h-full opacity-60">
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="6,4" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="6,4" />
                      </svg>
                    </div>

                    {/* Faint watermark outline - ONLY for step === 3 */}
                    {step === 3 && activeCard && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 animate-fade-in text-center">
                        <span className="text-[170px] font-sans font-black text-rose-500/15 leading-none select-none">
                          {activeCard.kanji}
                        </span>
                      </div>
                    )}

                    {/* Clean Drawing Sheet */}
                    <canvas
                      id="drawing-core-canvas"
                      ref={canvasRef}
                      width={386}
                      height={386}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawingTouch}
                      onTouchMove={drawTouch}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full block cursor-crosshair relative z-20 pointer-events-auto bg-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Side Stroke Order Panel displayed during writing (Step 3 or Step 4) so they can study stroke sequence */}
              {(step === 3 || step === 4) && (
                <div className="w-full md:w-[180px] bg-[#fdfbf7] border border-[#e9e2d7] p-4 rounded-2xl flex flex-col gap-3">
                  <span className="text-[10px] uppercase font-black text-[#bc6c25] tracking-tight block border-b pb-1">
                    ✍️ STROKE ORDER GUIDE
                  </span>
                  <div className="space-y-2 max-h-[140px] md:max-h-none overflow-y-auto pr-0.5">
                    {getKanjiStrokeLines(activeCard.kanji).map((stroke, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start bg-white p-2 rounded-xl text-[10px] border">
                        <span className="flex items-center justify-center bg-[#bc6c25] text-white w-4.5 h-4.5 font-bold rounded-full shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-600 font-bold leading-normal">{stroke.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Animated Stroke Order GIF/PNG Card Guide */}
                  {activeCard && activeCard.kanji && (
                    <div className="space-y-1.5 mt-1">
                      <div 
                        onClick={() => {
                          setPlayerStep(0);
                          setShowStrokePlayer(true);
                        }}
                        className="rounded-xl border border-[#e9e2d7] hover:border-[#bc6c25]/50 overflow-hidden bg-white p-1.5 flex flex-col items-center justify-center gap-1 relative shadow-3xs min-h-[96px] group cursor-pointer transition-all duration-200"
                      >
                        <KanjiStrokeImage
                          kanji={activeCard.kanji}
                          className="w-14 h-14 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-center p-1 text-[9px] text-white font-bold select-none gap-0.5 z-30">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>පියවර බලන්න</span>
                        </div>

                        <span className="text-[8px] font-bold text-[#52796f] uppercase text-center block tracking-tight">
                          {activeCard.kanji} Animation
                        </span>
                      </div>

                      {/* Animate stroke player trigger button */}
                      <button
                        type="button"
                        onClick={() => {
                          setPlayerStep(0);
                          setShowStrokePlayer(true);
                        }}
                        className="w-full mt-1 py-1.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-orange-700 hover:text-orange-850 text-[10px] font-black transition-all flex items-center justify-center gap-1 border border-orange-200 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 animate-pulse text-amber-500" />
                        Animate Stroke (පියවර බලන්න)
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Brush Controls & Results (For Step 3 and 4) */}
            {(step === 3 || step === 4) && (
              <div className="w-full flex flex-col items-center gap-4">
                
                {/* Drawing Actions toolbar */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear (මකන්න)
                  </button>

                  <button
                    type="button"
                    onClick={checkCanvasDrawing}
                    className="p-2.5 px-6 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> ලිවීම පරීක්ෂා කරන්න (Check Writing)
                  </button>
                </div>

                {/* Score and verification overlays */}
                {hasChecked && drawingScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full max-w-lg p-4 rounded-2xl border text-center space-y-1.5 ${
                      drawingScore >= 60
                        ? "bg-[#cad2c5]/30 border-[#52796f]/40 text-[#2f3e46]"
                        : "bg-orange-50 border-orange-200 text-orange-950"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {drawingScore >= 60 ? (
                        <CheckCircle2 className="w-5 h-5 text-[#52796f]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <span className="font-extrabold text-sm">
                        {drawingScore >= 60 ? "විශිෂ්ට ලිවීමක්! (Excellent)" : "තව ටිකක් උත්සාහ කරන්න (Keep practicing!)"}
                      </span>
                    </div>
                    <p className="text-xl font-black font-mono">
                      අකුරු සමානතාවය (Match Similarity): <span className="text-2xl text-[#bc6c25]">{drawingScore}%</span>
                    </p>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      {drawingScore >= 60
                        ? "ප්‍රශස්ත හැඩකය නිවැරදිව ප්‍රතිනිර්මාණය කර ඇත! ප්‍රගතිය OK ලෙස සටහන් විය."
                        : "හැඩය තරමක් වෙනස්ය. ලිවීම් පිළිවෙළ තවදුරටත් බලා නැවත අඳින්න."}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Stepper Navigation Footer Buttons */}
            <div className="w-full flex justify-between border-t border-[#e9e2d7] pt-4 items-center">
              <button
                type="button"
                onClick={() => setStep((s) => (s > 1 ? (s - 1) as any : 1))}
                disabled={step === 1}
                className="p-2 bg-gray-100 disabled:opacity-40 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> කලින් පියවර (Prev Step)
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s < 4 ? (s + 1) as any : 4))}
                  className="p-2 px-4 bg-[#bc6c25] hover:bg-[#a05c1f] text-white text-xs font-black rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  ඊළඟ පියවර (Next Step) <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleNextCard();
                  }}
                  disabled={activeIdx === cards.length - 1}
                  className="p-2 px-6 bg-[#354f52] hover:bg-[#2f3e46] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-55"
                >
                  🎯 DONE & NEXT KANJI CARD
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Dynamic Step-by-Step Stroke Player Modal */}
      <AnimatePresence>
        {showStrokePlayer && activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#fcfaf4] border-2 border-[#e9e2d7] rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header banner */}
              <div className="bg-[#f0ede6] px-6 py-4 flex items-center justify-between border-b border-[#e9e2d7]">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#bc6c25]">
                    INTERACTIVE STROKE PLAYER • පියවරෙන් පියවර
                  </span>
                  <h4 className="text-sm font-black text-[#354f52]">
                    {activeCard.kanji} - කන්ජි ලිවීම පියවරෙන් පියවර
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowStrokePlayer(false);
                    setIsAutoplay(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition cursor-pointer"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Container Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] text-left">
                
                {/* Upper interactive comparison grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left panel: Massive Kanji symbol with animated SVG/Canvas trace preview */}
                  <div className="rounded-2xl border border-[#e9e2d7] p-4 bg-white flex flex-col items-center justify-center min-h-[160px] relative shadow-2xs">
                    <span className="text-8xl font-sans font-black text-slate-800 select-none">
                      {activeCard.kanji}
                    </span>
                    <span className="text-[10px] font-black text-[#52796f] uppercase tracking-widest mt-2">
                      Symbol Canvas
                    </span>
                  </div>

                  {/* Right panel: Animated sequence gif running live */}
                  <div className="rounded-2xl border border-[#e9e2d7] p-4 bg-white flex flex-col items-center justify-center min-h-[160px] relative shadow-2xs">
                    <KanjiStrokeImage
                      kanji={activeCard.kanji}
                      className="w-24 h-24 object-contain mix-blend-multiply"
                    />
                    <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-widest mt-2 animate-pulse">
                      Live sequence gif
                    </span>
                  </div>
                </div>

                {/* Lower Action Tracker Player */}
                <div className="bg-[#f0ede6]/60 p-4.5 rounded-2xl border border-[#e9e2d7]/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      STEP {playerStep + 1} OF {getKanjiStrokeLines(activeCard.kanji).length}:
                    </span>
                    {/* Autoplay Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${isAutoplay ? "bg-emerald-100 text-emerald-800 animate-pulse" : "bg-slate-200 text-slate-600"}`}>
                      {isAutoplay ? "● AUTOPLAYING" : "⏸ PAUSED"}
                    </span>
                  </div>

                  {/* Active highlight visual drawing sequence */}
                  <div className="bg-white rounded-xl p-3 border border-[#e9e2d7] flex gap-3 items-center shadow-3xs hover:border-[#bc6c25]/30 transition">
                    <div className="bg-[#bc6c25] text-white text-base font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                      {playerStep + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-[#354f52]">
                        {getKanjiStrokeLines(activeCard.kanji)[playerStep]?.label.split(" (")[0] || "ශ්‍රේණි රේඛාව අඳින්න."}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        ඔබ අඳින විට කන්ජි අකුරේ {playerStep + 1} වන පියවර ලෙස මෙම පිහිටීම අනුගමනය කරන්න.
                      </p>
                    </div>
                  </div>

                  {/* Progressive dots sequence */}
                  <div className="flex gap-1.5 items-center justify-center py-1">
                    {getKanjiStrokeLines(activeCard.kanji).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPlayerStep(idx);
                          setIsAutoplay(false); // Stop autoplay when custom clicked
                        }}
                        className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                          playerStep === idx
                            ? "bg-[#bc6c25] border-[#bc6c25] scale-120 shadow-xs"
                            : "bg-white border-slate-300 hover:border-slate-500"
                        }`}
                        title={`Go to stroke step ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Controls Actions bar */}
                  <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-dashed border-[#e9e2d7]">
                    <button
                      type="button"
                      onClick={() => {
                        setPlayerStep((prev) => Math.max(0, prev - 1));
                        setIsAutoplay(false);
                      }}
                      disabled={playerStep === 0}
                      className="px-3.5 py-1.5 rounded-lg border bg-white hover:bg-slate-150 disabled:opacity-40 disabled:hover:bg-white text-xs font-bold text-slate-700 transition cursor-pointer"
                    >
                      ◀ Previous (පෙර)
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAutoplay(prev => !prev)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer text-white ${
                        isAutoplay ? "bg-red-600 hover:bg-red-700" : "bg-[#52796f] hover:bg-[#354f52]"
                      }`}
                    >
                      {isAutoplay ? "⏸ Stop Auto" : "▶ Start Auto"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const strokesCount = getKanjiStrokeLines(activeCard.kanji).length;
                        setPlayerStep((prev) => (prev < strokesCount - 1 ? prev + 1 : 0));
                        setIsAutoplay(false);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border bg-white hover:bg-slate-150 text-xs font-bold text-slate-700 transition cursor-pointer"
                    >
                      Next (ඊළඟ) ▶
                    </button>
                  </div>

                </div>

                {/* Additional tip for Kanji drawing */}
                <div className="p-3 bg-teal-50 border border-teal-150 rounded-xl text-[10px] text-teal-800 font-bold leading-relaxed space-y-1">
                  <p>💡 Tip: ජපන් Kanji ලිවීමේදී සාමාන්‍යයෙන් ඉහළ සිට පහළටත්, වමේ සිට දකුණටත් ඉහත පියවර අනුපිළිවෙලට අනුව ඇඳීම මඟින් නිවැරදි කන්ජි හැඩය පහසුවෙන් මතක තබාගත හැක.</p>
                </div>

              </div>

              {/* Bottom play close bar */}
              <div className="bg-slate-50 px-6 py-4.5 border-t border-[#e9e2d7] text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowStrokePlayer(false);
                    setIsAutoplay(false);
                  }}
                  className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition cursor-pointer"
                >
                  Close Player
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
