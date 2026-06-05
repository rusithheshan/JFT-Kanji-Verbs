import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, BookOpen, Volume2, ArrowLeftRight } from "lucide-react";
import { JFTVerb } from "../data/preloadedVerbs";
import { LearningStatus } from "../types";

interface VerbCardViewProps {
  key?: React.Key;
  verb: JFTVerb;
  practiceMode: "sinhala" | "japanese";
  status: LearningStatus;
  onStatusChange?: (newStatus: LearningStatus) => void;
  onReveal?: () => void;
}

export default function VerbCardView({
  verb,
  practiceMode,
  status,
  onStatusChange,
  onReveal,
}: VerbCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Speaks the Verb dictionary/masu form using basic browser speech
  const speakReading = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(verb.dictionary);
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
      id={`verb-card-wrapper-${verb.id}`}
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
        className={`w-full min-h-[480px] rounded-[32px] border-2 shadow-sm cursor-pointer relative select-none flex flex-col justify-between p-6 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div 
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3">
            <span className="font-mono text-[10px] text-[#84a98c] font-bold uppercase tracking-wider">
              {practiceMode === "sinhala" ? "සිංහල ➔ ජපන්" : "ජපන් ➔ සිංහල"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce Verb"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Central Word Presentation (Based on practiceMode) */}
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            {practiceMode === "sinhala" ? (
              // Sinhala front
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-widest block">සිංහල අර්ථය</span>
                <h3 className="text-3xl font-extrabold text-[#354f52] font-sans tracking-tight">
                  {verb.sinhalaMeaning}
                </h3>
              </div>
            ) : (
              // Japanese front
              <div className="text-center space-y-4 relative w-full">
                <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-2xl opacity-15 scale-120"></div>
                <div className="relative">
                  <span className="text-xs font-semibold tracking-widest text-[#52796f] bg-[#f0ede6] px-3.5 py-0.5 rounded-full border border-[#e9e2d7]">
                    {verb.furigana}
                  </span>
                  <h3 className="text-5xl font-extrabold text-[#2f3e46] mt-4 font-sans tracking-wide">
                    {verb.kanji}
                  </h3>
                </div>
              </div>
            )}

            <div className="text-center mt-6 p-2.5 bg-[#f0ede6]/60 border border-[#e9e2d7]/50 rounded-xl max-w-xs w-full text-[10px] font-bold text-[#52796f]/90 tracking-widest animate-pulse flex items-center justify-center gap-1">
              <ArrowLeftRight className="w-3 h-3" /> CLICK TO FLIP / කාඩ්පත හරවන්න
            </div>
          </div>

          {/* Bottom quick view */}
          <div className="border-t border-[#e9e2d7] pt-3 text-center">
            <span className="text-[10px] font-bold text-slate-400">JFT-Basic Verb Card • {verb.id.toUpperCase()}</span>
          </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div 
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Card Top */}
          <div className="flex items-center justify-between w-full border-b border-[#e9e2d7] pb-3">
            <span className="font-mono text-[10px] text-[#bc6c25] font-bold uppercase tracking-wider">
              REVEALED DETAILED VERB
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce Verb"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Central Detailed Grid content with all forms */}
          <div className="flex-1 flex flex-col justify-between py-2 overflow-y-auto custom-scrollbar">
            {/* Core Translation Header */}
            <div className="text-center space-y-1 my-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold tracking-widest text-[#52796f] bg-[#f0ede6] px-2 py-0.5 rounded-md">
                  {verb.furigana}
                </span>
                <span className="text-xs font-bold text-[#bc6c25]">
                  ({verb.kanjiStem} + {verb.okurigana})
                </span>
              </div>
              <h4 className="text-2xl font-bold text-[#2f3e46]">{verb.kanji}</h4>
              <p className="text-lg font-bold text-[#52796f]">{verb.sinhalaMeaning}</p>
            </div>

            {/* JFT 6 Conjugation states GRID */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">masu (මසු)</span>
                <span className="font-mono text-xs font-extrabold text-[#52796f] mt-0.5 dir-ltr">{verb.masu}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">Dictionary (මූලික)</span>
                <span className="font-mono text-xs font-extrabold text-[#52796f] mt-0.5 dir-ltr">{verb.dictionary}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">nai (නැත)</span>
                <span className="font-mono text-xs font-extrabold text-[#bc6c25] mt-0.5 dir-ltr">{verb.nai}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">ta (අතීත ඇත)</span>
                <span className="font-mono text-xs font-extrabold text-[#52796f] mt-0.5 dir-ltr">{verb.ta}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col col-span-2">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">nakatta (අතීත නැත)</span>
                <span className="font-mono text-xs font-extrabold text-[#bc6c25] mt-0.5 dir-ltr">{verb.nakatta}</span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col col-span-2">
                <span className="text-[9px] font-bold text-[#84a98c] uppercase tracking-wider">te (te form)</span>
                <span className="font-mono text-xs font-extrabold text-[#52796f] mt-0.5 dir-ltr">{verb.te}</span>
              </div>
            </div>
          </div>

          {/* Action Status Markers */}
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
