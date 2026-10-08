import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, BookOpen, Volume2, ArrowLeftRight, Sparkles } from "lucide-react";
import { VocabularyItem, LearningStatus } from "../types";

interface VocabularyCardViewProps {
  key?: React.Key;
  item: VocabularyItem;
  practiceMode: "sinhala" | "japanese";
  status: LearningStatus;
  onStatusChange?: (newStatus: LearningStatus) => void;
  onReveal?: () => void;
}

export default function VocabularyCardView({
  item,
  practiceMode,
  status,
  onStatusChange,
  onReveal,
}: VocabularyCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Speaks the vocabulary word using browser SpeechSynthesis
  const speakReading = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.kanji || item.reading);
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

  const getLevelBadge = () => {
    const lvl = item.level;
    let badgeStyle = "bg-amber-100 text-amber-900 border-amber-200";
    let icon = "🔰";
    if (lvl === "N3") {
      badgeStyle = "bg-blue-100 text-blue-900 border-blue-200";
      icon = "📘";
    } else if (lvl === "N4") {
      badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-200";
      icon = "📗";
    } else if (lvl === "JFT") {
      badgeStyle = "bg-rose-100 text-rose-900 border-rose-200";
      icon = "🇯🇵";
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-3xs ${badgeStyle}`}>
        <span>{icon}</span> {lvl}
      </span>
    );
  };

  return (
    <div
      className="relative w-full shrink-0"
      style={{ perspective: "1000px" }}
      id={`vocab-card-wrapper-${item.id}`}
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
        className={`w-full min-h-[380px] rounded-[32px] border-2 shadow-sm cursor-pointer relative select-none flex flex-col justify-between p-6 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Top Info Bar */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3">
            <div className="flex items-center gap-2">
              {getLevelBadge()}
              {item.category && (
                <span className="text-[10px] font-bold text-[#84a98c] bg-[#f0ede6] px-2 py-0.5 rounded-md border border-[#e9e2d7]">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce Word"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Central Word Presentation */}
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            {practiceMode === "sinhala" ? (
              // Sinhala front
              <div className="text-center space-y-2 max-w-sm">
                <span className="text-[10px] uppercase font-bold text-[#84a98c] tracking-widest block">
                  සිංහල අර්ථය (Meaning)
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#354f52] font-sans tracking-tight leading-snug">
                  {item.sinhalaMeaning}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {item.englishMeaning}
                </p>
              </div>
            ) : (
              // Japanese front
              <div className="text-center space-y-4 relative w-full">
                <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-2xl opacity-15 scale-120"></div>
                <div className="relative">
                  <span className="text-xs font-semibold tracking-widest text-[#52796f] bg-[#f0ede6] px-3.5 py-0.5 rounded-full border border-[#e9e2d7]">
                    {item.reading}
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-[#2f3e46] mt-4 font-sans tracking-wide">
                    {item.kanji}
                  </h3>
                  {item.romaji && (
                    <p className="font-mono text-xs font-bold text-[#84a98c] mt-2 tracking-wider">
                      {item.romaji}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center mt-6 p-2.5 bg-[#f0ede6]/60 border border-[#e9e2d7]/50 rounded-xl max-w-xs w-full text-[10px] font-bold text-[#52796f]/90 tracking-widest animate-pulse flex items-center justify-center gap-1">
              <ArrowLeftRight className="w-3 h-3" /> CLICK TO FLIP / කාඩ්පත හරවන්න
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="border-t border-[#e9e2d7] pt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>
              {practiceMode === "sinhala" ? "සිංහල ➔ ජපන්" : "ජපන් ➔ සිංහල"}
            </span>
            <span>
              {item.partOfSpeech && (
                <span className="uppercase mr-2 text-[#84a98c]">
                  [{item.partOfSpeech}]
                </span>
              )}
              #{item.indexNumber || item.id}
            </span>
          </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Top Info Bar */}
          <div className="flex items-center justify-between w-full border-b border-[#e9e2d7] pb-3">
            <div className="flex items-center gap-2">
              {getLevelBadge()}
              {item.category && (
                <span className="text-[10px] font-bold text-[#84a98c] bg-[#f0ede6] px-2 py-0.5 rounded-md border border-[#e9e2d7]">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
                title="Pronounce Word"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          {/* Central Detailed Content */}
          <div className="flex-1 flex flex-col justify-center items-center py-4 text-center space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-[#52796f] bg-[#f0ede6] px-3 py-0.5 rounded-full border border-[#e9e2d7]">
                {item.reading}
              </span>
              <h4 className="text-3xl sm:text-4xl font-extrabold text-[#2f3e46] mt-1 font-sans">
                {item.kanji}
              </h4>
              {item.romaji && (
                <p className="font-mono text-xs font-bold text-[#84a98c]">
                  {item.romaji}
                </p>
              )}
            </div>

            <div className="p-3 bg-[#fdfbf7] rounded-2xl border border-[#e9e2d7] max-w-sm w-full space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#84a98c] block">
                අර්ථය (Meaning)
              </span>
              <p className="text-base sm:text-lg font-black text-[#52796f] leading-snug">
                {item.sinhalaMeaning}
              </p>
              <p className="text-xs font-bold text-[#354f52]">
                {item.englishMeaning}
              </p>
            </div>

            {item.partOfSpeech && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#cad2c5]/30 text-[#354f52]">
                <Sparkles className="w-2.5 h-2.5 text-[#bc6c25]" /> Part of Speech: {item.partOfSpeech}
              </span>
            )}
          </div>

          {/* Action Buttons on Reveal */}
          {onStatusChange && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#e9e2d7]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("NOT_YET");
                  setIsFlipped(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 ${
                  status === "NOT_YET"
                    ? "bg-[#bc6c25] text-white shadow-xs"
                    : "bg-[#ece2d0] text-[#bc6c25] hover:bg-[#ece2d0]/80"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" /> තවම බෑ (NOT YET)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange("OK");
                  setIsFlipped(false);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 ${
                  status === "OK"
                    ? "bg-[#52796f] text-white shadow-xs"
                    : "bg-[#cad2c5] text-[#2f3e46] hover:bg-[#cad2c5]/80"
                }`}
              >
                <Check className="w-3.5 h-3.5" /> දන්නවා (OK)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
