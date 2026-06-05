import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, BookOpen, Volume2, ArrowLeftRight } from "lucide-react";
import { JFTAdjective } from "../data/preloadedAdjectives";
import { LearningStatus } from "../types";

interface AdjectiveCardViewProps {
  key?: React.Key;
  adjective: JFTAdjective;
  practiceMode: "sinhala" | "japanese";
  status: LearningStatus;
  onStatusChange?: (newStatus: LearningStatus) => void;
  onReveal?: () => void;
}

export default function AdjectiveCardView({
  adjective,
  practiceMode,
  status,
  onStatusChange,
  onReveal,
}: AdjectiveCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Speaks the adjective using simple browser TTS
  const speakReading = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(adjective.kanji);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "OK":
        return "border-[#52796f] border-b-8 bg-white text-slate-900";
      case "NOT_YET":
        return "border-[#bc6c25] border-b-8 bg-white text-slate-900";
      default:
        return "border-[#e9e2d7] border-b-8 bg-white text-slate-900";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "OK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#cad2c5] text-[#2f3e46]">
            <Check className="w-3 h-3" /> OK
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ece2d0] text-[#bc6c25]">
            <AlertCircle className="w-3 h-3" /> NOT YET
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f0ede6] text-[#52796f]">
            <BookOpen className="w-3 h-3" /> NEW
          </span>
        );
    }
  };

  return (
    <div
      className="relative w-full shrink-0"
      style={{ perspective: "1000px" }}
      id={`adjective-card-wrapper-${adjective.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => {
          const nextFlipped = !isFlipped;
          setIsFlipped(nextFlipped);
          if (nextFlipped && onReveal) {
            onReveal();
          }
        }}
        className={`w-full min-h-[360px] rounded-[32px] border-2 shadow-sm cursor-pointer relative select-none flex flex-col justify-between p-6 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Top Info */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3">
            <span className="font-mono text-[10px] text-[#84a98c] font-bold uppercase tracking-wider">
              {practiceMode === "sinhala" ? "සිංහල ➔ ජපන්" : "ජපන් ➔ සිංහල"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Core presentation */}
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            {practiceMode === "sinhala" ? (
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-widest block">සිංහල අර්ථය</span>
                <h3 className="text-3xl font-extrabold text-[#354f52] font-sans tracking-tight">
                  {adjective.sinhalaMeaning}
                </h3>
              </div>
            ) : (
              <div className="text-center space-y-3 relative w-full">
                <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-2xl opacity-10 scale-120"></div>
                <div className="relative">
                  <span className="text-xs font-semibold tracking-widest text-[#52796f] bg-[#f0ede6] px-3 py-0.5 rounded-full border border-[#e9e2d7]">
                    {adjective.hiragana}
                  </span>
                  <h3 className="text-4xl font-extrabold text-[#2f3e46] mt-3 font-sans tracking-wide">
                    {adjective.kanji}
                  </h3>
                </div>
              </div>
            )}

            <div className="text-center mt-5 p-2 bg-[#f0ede6]/60 border border-[#e9e2d7]/50 rounded-xl max-w-xs w-full text-[9px] font-bold text-[#52796f]/90 tracking-widest animate-pulse flex items-center justify-center gap-1">
              <ArrowLeftRight className="w-3 h-3" /> CLICK TO FLIP / කාඩ්පත හරවන්න
            </div>
          </div>

          <div className="border-t border-[#e9e2d7] pt-2 text-center">
            <span className="text-[9px] font-extrabold text-[#84a98c] uppercase tracking-widest">
              {adjective.type === "i" ? "i-形容詞 (i-Adjective)" : "na-形容詞 (na-Adjective)"}
            </span>
          </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Top Revealed bar */}
          <div className="flex items-center justify-between w-full border-b border-[#e9e2d7] pb-3">
            <span className="font-mono text-[10px] text-[#bc6c25] font-bold uppercase tracking-wider">
              {adjective.type === "i" ? "ı-ADJECTIVE DETAILED" : "na-ADJECTIVE DETAILED"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Central detailed content */}
          <div className="flex-1 flex flex-col justify-center py-4 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-[#52796f] bg-[#f0ede6] px-3 py-0.5 rounded-full border border-[#e9e2d7]">
                {adjective.hiragana}
              </span>
              <h4 className="text-4xl font-extrabold text-[#2f3e46] pt-1">{adjective.kanji}</h4>
            </div>

            <div className="p-3.5 bg-[#fdfbf7] rounded-2xl border border-[#e9e2d7] space-y-1 shadow-inner">
              <span className="text-[10px] font-bold text-[#84a98c] uppercase tracking-wider">සිංහල තේරුම (Meaning)</span>
              <p className="text-lg font-bold text-[#354f52] leading-snug">{adjective.sinhalaMeaning}</p>
            </div>

            <div className="text-[11px] font-semibold text-slate-500 leading-relaxed max-w-xs mx-auto">
              {adjective.type === "i" ? (
                <span>මෙය <strong>i-Adjective (ඉ-විශේෂණයක්)</strong> වන බැවින් ඍජුවම නාමපදයකට තබා සම්බන්ධ කළ හැක (e.g. {adjective.kanji} + නාමපදයක්).</span>
              ) : (
                <span>මෙය <strong>na-Adjective (න-විශේෂණයක්)</strong> වන මුත් නාමපද හා යෙදීමේදී අවසානයට <strong>な (na)</strong> අනිවාර්යයෙන් එක් වේ.</span>
              )}
            </div>
          </div>

          {/* Bottom Actions status update */}
          {onStatusChange && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#e9e2d7]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("NOT_YET");
                  setIsFlipped(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all duration-150 cursor-pointer ${
                  status === "NOT_YET"
                    ? "bg-[#bc6c25] text-white shadow-xs"
                    : "bg-[#ece2d0] text-[#bc6c25] hover:bg-[#ece2d0]/80"
                }`}
              >
                ❌ NOT YET
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("OK");
                  setIsFlipped(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all duration-150 cursor-pointer ${
                  status === "OK"
                    ? "bg-[#52796f] text-white shadow-xs"
                    : "bg-[#f0ede6] text-[#52796f] hover:bg-[#e9e2d7]"
                }`}
              >
                ✔️ OK
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
