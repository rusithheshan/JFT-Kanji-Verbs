import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Edit3,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ChevronRight,
  RotateCcw,
  Volume2,
  Award,
  HelpCircle
} from "lucide-react";
import { KanjiCard, LearningStatus } from "../types";

interface CheckKanjiDrawingViewProps {
  kanjiCards: KanjiCard[];
  onBackToSetup?: () => void;
}

export default function CheckKanjiDrawingView({
  kanjiCards,
  onBackToSetup,
}: CheckKanjiDrawingViewProps) {
  const [shuffledDeck, setShuffledDeck] = useState<KanjiCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [step, setStep] = useState<"draw" | "scored">("draw");
  const [drawingScore, setDrawingScore] = useState<number | null>(null);
  const [showOutline, setShowOutline] = useState(false);
  const [progress, setProgress] = useState<Record<string, LearningStatus>>(() => {
    try {
      const saved = localStorage.getItem("jft_kanji_progress");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const activeCard = shuffledDeck[currentIdx];

  // Initialize shuffled deck
  useEffect(() => {
    if (kanjiCards.length > 0) {
      const shuffled = [...kanjiCards].sort(() => 0.5 - Math.random());
      setShuffledDeck(shuffled);
      setCurrentIdx(0);
      setStep("draw");
      setDrawingScore(null);
      setShowOutline(false);
    }
  }, [kanjiCards]);

  // Reset drawing sheet when current Kanji card changes
  useEffect(() => {
    setDrawingScore(null);
    setStep("draw");
    setShowOutline(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentIdx, shuffledDeck]);

  // Mobile/Desktop drawing hooks - completely isolated from background grid/watermark
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
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#1e293b"; // Dark ink

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

  // Mobile Touch Support
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
    ctx.strokeStyle = "#1e293b";

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setDrawingScore(null);
    setStep("draw");
  };

  // Robust F1-score matching algorithm with anti-scribble validation
  const checkDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeCard) return;

    // Offscreen reference canvas containing reference Kanji text
    const refCanvas = document.createElement("canvas");
    refCanvas.width = canvas.width;
    refCanvas.height = canvas.height;
    const refCtx = refCanvas.getContext("2d");
    if (!refCtx) return;

    refCtx.fillStyle = "#ffffff";
    refCtx.fillRect(0, 0, refCanvas.width, refCanvas.height);
    refCtx.fillStyle = "#000000";
    refCtx.font = "bold 150px 'Inter', sans-serif";
    refCtx.textAlign = "center";
    refCtx.textBaseline = "middle";
    refCtx.fillText(activeCard.kanji, refCanvas.width / 2, refCanvas.height / 2 + 10);

    const userCtx = canvas.getContext("2d");
    if (!userCtx) return;

    const userImg = userCtx.getImageData(0, 0, canvas.width, canvas.height);
    const refImg = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);

    // Grid check Resolution (40x40 regions)
    const gridSize = 40;
    const checkW = canvas.width / gridSize;
    const checkH = canvas.height / gridSize;

    let totalRefCells = 0;
    let totalUserCells = 0;
    let truePositives = 0;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const xCoord = Math.floor(c * checkW + checkW / 2);
        const yCoord = Math.floor(r * checkH + checkH / 2);
        const index = (yCoord * canvas.width + xCoord) * 4;

        // User drawn ink (opacity check or heavy blackness on drawing canvas)
        const uAlpha = userImg.data[index + 3];
        const hasUserInk = uAlpha > 30; // Clean template contains ONLY user drawing!

        // Reference Kanji shape (black)
        const refR = refImg.data[index];
        const hasRefBlack = refR < 100;

        if (hasRefBlack) {
          totalRefCells++;
        }
        if (hasUserInk) {
          totalUserCells++;
        }
        if (hasRefBlack && hasUserInk) {
          truePositives++;
        }
      }
    }

    if (totalRefCells === 0) totalRefCells = 1;

    // Recall: how much of the original shape did the user draw?
    const recall = truePositives / totalRefCells;

    // Precision of drawing
    const precision = totalUserCells > 0 ? (truePositives / totalUserCells) : 0;

    // Base score based on overlap recall
    const baseRatio = recall * 100;

    // Strictly penalize extra paint drawn in white spaces to completely shut down scribble fraud!
    // If they scribbled all over the canvas, totalUserCells will be massive, so outside error cells will be massive.
    const outsideErrors = Math.max(0, totalUserCells - truePositives);
    const penaltyRate = 1.2; // strict multiplier
    const scribblePenalty = Math.min(95, (outsideErrors / totalRefCells) * 100 * penaltyRate);

    let scoreVal = Math.max(0, Math.round(baseRatio - scribblePenalty));

    // Small help boost for near-perfect shapes drawn manually with finger shifts
    if (scoreVal >= 55 && scribblePenalty < 25) {
      scoreVal = Math.min(100, Math.round(scoreVal * 1.15));
    }

    if (totalUserCells < 12) {
      scoreVal = 0; // barely drew anything
    }

    setDrawingScore(scoreVal);
    setStep("scored");
    
    // Play pronunciation if successful
    if (scoreVal >= 60) {
      speakJapanese();
    }

    // Automatically mark status in local progress as well
    const updatedStatus = scoreVal >= 60 ? "OK" : "NOT_YET";
    updateProgressStatus(activeCard.id, updatedStatus);
  };

  const updateProgressStatus = (id: string, newStatus: LearningStatus) => {
    const nextProgress = {
      ...progress,
      [id]: newStatus,
    };
    setProgress(nextProgress);
    localStorage.setItem("jft_kanji_progress", JSON.stringify(nextProgress));
  };

  const handleNext = () => {
    if (currentIdx + 1 < shuffledDeck.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const reshuffled = [...kanjiCards].sort(() => 0.5 - Math.random());
      setShuffledDeck(reshuffled);
      setCurrentIdx(0);
    }
  };

  const speakJapanese = () => {
    if (!activeCard) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeCard.kanji.replace(/\./g, ""));
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Dynamic stroke order list helper used to render small legend
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
          { label: "වම් සිරස් වහලය පහළට (1)", path: "M 90 70 L 90 220" },
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
      case "上":
        return [
          { label: "තිරස් ඉර වමේ සිට දකුණට (1)", path: "" },
          { label: "මැද කෙටි සිරස් ඉර පහළට (2)", path: "" },
          { label: "පහළ දිග තිරස් ඉර (3)", path: "" }
        ];
      case "下":
        return [
          { label: "දිග තිරස් ඉර වමේ සිට දකුණට (1)", path: "" },
          { label: "මැද සිරස් කණුව පහළට (2)", path: "" },
          { label: "දකුණු පස ආනත කෙටි ඉර (3)", path: "" }
        ];
      case "中":
        return [
          { label: "වම් සිරස් ඉර (1)", path: "" },
          { label: "ඉහළ සහ දකුණු සීමාව (2)", path: "" },
          { label: "මැද තිරස් ඉර (3)", path: "" },
          { label: "මැදින් යන දිග සිරස් කණුව (4)", path: "" }
        ];
      case "一":
        return [
          { label: "දිගු තිරස් රේඛාව වමේ සිට දකුණට (1)", path: "" }
        ];
      case "二":
        return [
          { label: "ඉහළ කෙටි තිරස් රේඛාව (1)", path: "" },
          { label: "පහළ දිගු තිරස් රේඛාව (2)", path: "" }
        ];
      case "三":
        return [
          { label: "ඉහළ කෙටි තිරස් රේඛාව (1)", path: "" },
          { label: "මැද වඩාත් කෙටි තිරස් රේඛාව (2)", path: "" },
          { label: "පහළ දිගු තිරස් රේඛාව (3)", path: "" }
        ];
      case "父":
        return [
          { label: "වම් ඉහළ කෙටි කැපුම් ඉර (1)", path: "" },
          { label: "දකුණු ඉහළ කෙටි කැපුම් ඉර (2)", path: "" },
          { label: "වම් පස දිගු ඇල ඉර (3)", path: "" },
          { label: "දකුණු පස දිගු හරස් ඇල ඉර (4)", path: "" }
        ];
      case "母":
        return [
          { label: "පිටත වම් සිරස් ඉර (1)", path: "" },
          { label: "ඉහළ සහ දකුණු පිටත රාමුව (2)", path: "" },
          { label: "මැදින් දිවෙන හරස් දිගු ඉර (3)", path: "" },
          { label: "ඉහළ තිත (4)", path: "" },
          { label: "පහළ තිත (5)", path: "" }
        ];
      case "人":
        return [
          { label: "වම් පස දිගු ඇල ඉර වමේ සිට පහළට (1)", path: "" },
          { label: "දකුණු පස දිගු ඇල රේඛාව (2)", path: "" }
        ];
      case "水":
        return [
          { label: "මැද කොක්කක් ඇති සිරස් ඉර (1)", path: "" },
          { label: "වම් ඉහළ කෙටි ඉර (2)", path: "" },
          { label: "වම් පහළ ඇල ඉර (3)", path: "" },
          { label: "දකුණු පස පහළට දිවෙන ඉර (4)", path: "" }
        ];
      default:
        return [
          { label: "වමේ සිට දකුණට තිරස් රේඛා (1)", path: "" },
          { label: "ඉහළ සිට පහළට සිරස් රේඛා (2)", path: "" },
          { label: "ආනත ඇල රේඛා හෝ තිත් (3)", path: "" }
        ];
    }
  };

  if (shuffledDeck.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border">
        <p className="text-sm font-semibold text-slate-400">Loading Kanis cards deck...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] border border-[#e9e2d7] p-6 md:p-8 shadow-sm space-y-6 text-left animate-fade-in" id="check-kanji-drawing-view">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b pb-4 border-dashed border-[#e9e2d7]">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black bg-[#ece2d0] text-[#bc6c25] uppercase">
            <Award className="w-3.5 h-3.5 text-[#bc6c25]" /> KANJI DRAWING TEST • කන්ජි ලිවීමේ පරික්ෂණය
          </span>
          <h3 className="text-xl font-black text-[#354f52] font-display">
            ප්‍රශ්නය බලා නිවැරදි කන්ජි සංකේතය ලියන්න
          </h3>
          <p className="text-xs text-[#84a98c] font-semibold">
            Meaning and Furigana pronunciation is displayed below. Draw the correct Kanji stroke inside the square.
          </p>
        </div>

        {onBackToSetup && (
          <button
            type="button"
            onClick={onBackToSetup}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            ◀ ආපසු (Setup Menu)
          </button>
        )}
      </div>

      {/* QUIZ ITEM WORKSPACE PRESENTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2">
        
        {/* Left Area: Display Question prompt Meaning and Furigana slowly */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col justify-center h-full">
          <div>
            <span className="text-[10px] tracking-widest font-black uppercase text-[#84a98c]">ශබ්ද කිරීම (Furigana Reading):</span>
            <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-2">
              <span className="text-2xl font-black text-[#52796f] bg-[#f0ede6] px-4 py-1.5 rounded-full border border-[#e9e2d7]">
                {activeCard.furigana}
              </span>
              <button
                type="button"
                onClick={speakJapanese}
                className="p-2 text-slate-400 hover:text-[#52796f] bg-slate-50 border hover:bg-white rounded-full transition-colors cursor-pointer"
                title="Pronounce slow"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 p-5 bg-[#fdfbf7] rounded-[24px] border border-[#e9e2d7] shadow-inner">
            <span className="text-[10px] tracking-widest font-black text-[#bc6c25] block uppercase">සිංහල තේරුම (Meaning):</span>
            <h4 className="text-2xl font-black text-[#354f52]">
              {activeCard.sinhalaMeaning}
            </h4>
            <p className="text-xs text-slate-400 font-bold mt-1 block">
              English: <strong>{activeCard.englishMeaning}</strong>
            </p>
          </div>

          {/* Prompt card index */}
          <div className="text-[11px] font-bold text-slate-400 text-center lg:text-left">
            🚩 Question {currentIdx + 1} of {shuffledDeck.length} (Deck Cards status: {progress[activeCard.id] || "UNSTUDIED"})
          </div>
        </div>

        {/* Right Area: Drawing Canvas box with visual controller options (Large 400x400 pad) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-6 justify-center">
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-[390px] aspect-square rounded-[32px] bg-[#fdfbf7] border-2 border-[#e9e2d7] shadow-lg overflow-hidden touch-none select-none">
              {/* Background grid lines */}
              <div className="absolute inset-0 pointer-events-none select-none z-0">
                <svg className="w-full h-full opacity-60">
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="6,4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e9e2d7" strokeWidth="1" strokeDasharray="6,4" />
                </svg>
              </div>

              {/* Watermark Correct Character Outline */}
              {showOutline && activeCard && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 animate-pulse">
                  <span className="text-[170px] font-sans font-black text-rose-500/15 leading-none select-none">
                    {activeCard.kanji}
                  </span>
                </div>
              )}

              {/* Drawing sheet */}
              <canvas
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
                className="w-full h-full block cursor-crosshair z-20 relative bg-transparent"
              />
            </div>

            {/* Canvas action buttons */}
            <div className="w-full flex items-center justify-center gap-2 max-w-[390px]">
              <button
                type="button"
                onClick={handleClear}
                className="p-2 px-3 bg-gray-50 border hover:bg-gray-100 font-bold text-[11px] text-gray-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear sheet
              </button>

              <button
                type="button"
                onClick={() => setShowOutline(!showOutline)}
                className={`p-2 px-3 border font-extrabold text-[11px] rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  showOutline
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-gray-50 border hover:bg-gray-100 text-slate-700"
                }`}
              >
                {showOutline ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showOutline ? "Hide answer outline" : "See Correct Outline"}
              </button>
            </div>
          </div>

          {/* Stroke Order references guide list side layout */}
          <div className="w-full md:w-[180px] bg-[#fdfbf7] border border-[#e9e2d7] p-4 rounded-2xl flex flex-col gap-3">
            <span className="text-[10px] uppercase font-black text-[#bc6c25] block border-b pb-1">
              💡 HELP GUIDES
            </span>
            <div className="space-y-2">
              <div className="bg-white p-2.5 rounded-xl border text-[10px] text-slate-500 font-semibold leading-relaxed">
                අකුරේ ස්වරූපය අමතක නම් <strong>See Correct Outline</strong> බොත්තම ඔබා උත්තරය ලාවට බලාගන්න.
              </div>
              {/* If 山 or other common cards, show basic order count */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 block uppercase">STROKES SEQUENCE:</span>
                {getKanjiStrokeLines(activeCard.kanji)[0].path !== "" ? (
                  getKanjiStrokeLines(activeCard.kanji).map((stroke, idx) => (
                    <div key={idx} className="flex gap-1 bg-white p-1.5 rounded-lg text-[9.5px] border font-bold">
                      <span className="bg-[#52796f] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-tight text-slate-600">{stroke.label.split(" (")[0]}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 font-bold italic">Common basic stroke rules apply.</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER ACTIONS BAR */}
      <AnimatePresence mode="wait">
        {step === "draw" ? (
          <motion.div
            key="btn-check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full pt-4 border-t text-center border-slate-100"
          >
            <button
              type="button"
              onClick={checkDrawing}
              className="w-full max-w-sm py-3 bg-[#52796f] hover:bg-[#354f52] shadow-md shadow-[#52796f]/15 text-white font-black rounded-xl text-sm transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> මගේ ලිවීම පරීක්ෂා කරන්න (Check My Drawing)
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="btn-scores"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full pt-4 border-t border-[#e9e2d7] flex flex-col items-center space-y-4"
          >
            {/* Results score prompt card */}
            <div className={`w-full max-w-lg p-4 rounded-2xl border text-center relative ${
              drawingScore !== null && drawingScore >= 60
                ? "bg-[#cad2c5]/30 border-[#52796f]/50 text-[#2f3e46]"
                : "bg-orange-50 border-orange-200 text-orange-950"
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {drawingScore !== null && drawingScore >= 60 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#52796f]" />
                    <span className="font-extrabold text-sm">නියමයි! නිවැරදි කන්ජියකි. (Perfect!)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-extrabold text-sm">නැවත උත්සාහ කරන්න (Mismatch)</span>
                  </>
                )}
              </div>

              <div className="text-lg font-bold">
                කන්ජි සංකේතය: <span className="text-4xl text-[#354f52] font-sans font-black px-2">{activeCard.kanji}</span>
              </div>
              
              <p className="text-base font-black mt-2">
                ලිවීමේ සමානතාවය: <span className="text-xl text-[#bc6c25]">{drawingScore}%相似度 (F1 Score)</span>
              </p>

              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateProgressStatus(activeCard.id, "NOT_YET");
                    handleNext();
                  }}
                  className="px-4 py-1.5 bg-[#ece2d0] hover:bg-[#ece2d0]/80 text-[#bc6c25] rounded-xl text-xs font-bold transition"
                >
                  ❌ NOT YET ලෙස සලකුණු කරන්න
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateProgressStatus(activeCard.id, "OK");
                    handleNext();
                  }}
                  className="px-4 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition"
                >
                  ✔️ OK ලෙස සලකුණු කරන්න
                </button>
              </div>
            </div>

            {/* Done & Next */}
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-[#354f52] hover:bg-[#2f3e46] text-white font-black rounded-xl text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              ලකුණු කළා, ඊළඟ ප්‍රශ්නයට යන්න ➔ (Next Kanji Card) <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
