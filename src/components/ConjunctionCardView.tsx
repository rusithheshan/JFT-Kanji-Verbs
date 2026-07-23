import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, Bookmark, Volume2 } from "lucide-react";
import { JFTConjunction, LearningStatus } from "../types";

interface ConjunctionCardViewProps {
  key?: React.Key;
  conjunction: JFTConjunction;
  status: LearningStatus;
  onStatusChange?: (newStatus: LearningStatus) => void;
}

export default function ConjunctionCardView({
  conjunction,
  status,
  onStatusChange,
}: ConjunctionCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Speaks Japanese text
  const speakJapanese = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "OK":
        return "border-[#52796f] border-b-8 bg-white";
      case "NOT_YET":
        return "border-amber-400 border-b-8 bg-white";
      default:
        return "border-[#e9e2d7] border-b-8 bg-white";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "OK":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#cad2c5] text-[#2f3e46]">
            <Check className="w-2.5 h-2.5" /> OK
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-2.5 h-2.5" /> NOT YET
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#fdfbf7] border border-[#e9e2d7] text-[#52796f]">
            <Bookmark className="w-2.5 h-2.5" /> NEW
          </span>
        );
    }
  };

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
      id={`conjunction-card-wrapper-${conjunction.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full transition-all duration-300 rounded-[36px] border-2 shadow-sm cursor-pointer relative select-none flex flex-col justify-between p-0 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div
          className={
            isFlipped
              ? "absolute inset-x-0 top-0 p-8 pointer-events-none opacity-0 invisible"
              : "relative w-full flex flex-col justify-between p-7 md:p-8 h-full min-h-[340px]"
          }
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Info Header */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black font-mono text-[#52796f] bg-[#cad2c5]/40 px-3 py-1 rounded-full">
                #{conjunction.index}
              </span>
              <span className="text-[10px] font-black text-[#bc6c25] bg-[#bc6c25]/10 px-2.5 py-1 rounded-lg border border-[#bc6c25]/20">
                {conjunction.categoryTag}
              </span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Central content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-4">
            <span className="text-[10px] font-black tracking-widest text-[#52796f] uppercase">
              JAPANESE CONJUNCTION • සම්බන්ධක පදය
            </span>
            
            <div className="flex items-center gap-3">
              <h3 className="font-display font-black text-4xl md:text-5xl text-[#354f52] leading-tight tracking-tight">
                {conjunction.title}
              </h3>
              <button
                type="button"
                onClick={(e) => speakJapanese(e, conjunction.title)}
                className="p-2.5 bg-[#bc6c25]/10 hover:bg-[#bc6c25]/20 text-[#bc6c25] rounded-2xl transition hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-3xs"
                title="ශ්‍රවණය කරන්න"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base font-mono text-slate-400 font-extrabold">
              ({conjunction.romaji})
            </p>

            <div className="pt-2 space-y-1">
              <p className="text-base text-[#bc6c25] font-black">
                🇱🇰 {conjunction.sinhalaMeaning}
              </p>
              <p className="text-xs text-slate-500 font-bold">
                🇬🇧 {conjunction.englishMeaning}
              </p>
            </div>
          </div>

          {/* Bottom Flip Button Prompt */}
          <div className="w-full text-center border-t border-[#f0ede6] pt-3.5 flex items-center justify-center gap-1.5 text-xs font-black text-[#52796f] hover:text-[#354f52] transition-colors">
            <span>විස්තර සහ උදාහරණ බැලීමට හරවන්න (Tap to Reveal Examples) ➔</span>
          </div>
        </div>

        {/* --- BACK SIDE (FLIPPED) --- */}
        <div
          className={
            isFlipped
              ? "relative w-full flex flex-col justify-between p-7 md:p-8 h-full"
              : "absolute inset-x-0 top-0 p-8 pointer-events-none opacity-0 invisible"
          }
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={(e) => e.stopPropagation()} // Stop flip when interacting with back details
        >
          {/* Top of Back - Title & Tag Header */}
          <div className="space-y-3 border-b border-[#f0ede6] pb-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#52796f] uppercase tracking-wider">
                  #{conjunction.index} CONJUNCTION
                </span>
                <span className="text-[9px] font-black text-[#bc6c25] bg-[#bc6c25]/10 px-2 py-0.5 rounded-md">
                  {conjunction.categoryTag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs bg-[#f0ede6] font-black hover:bg-[#cad2c5] px-3 py-1 rounded-lg text-[#354f52] transition-colors cursor-pointer"
              >
                ◀ ආපසු හරවන්න
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-2xl text-[#354f52]">
                  {conjunction.title} <span className="text-sm font-bold text-slate-400 font-mono">({conjunction.romaji})</span>
                </h3>
                <p className="text-xs font-bold text-[#bc6c25] mt-0.5">
                  {conjunction.sinhalaMeaning} • {conjunction.englishMeaning}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => speakJapanese(e, conjunction.title)}
                className="p-2 bg-[#52796f]/10 text-[#52796f] hover:bg-[#52796f] hover:text-white rounded-xl transition cursor-pointer"
                title="හඬ සවන් දෙන්න"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="flex-1 py-3 text-left space-y-4">
            {conjunction.explanationSinhala && (
              <div className="bg-[#cad2c5]/15 border border-[#cad2c5]/40 p-3 rounded-2xl">
                <span className="text-[10px] font-black text-[#52796f] uppercase block mb-1">භාවිතය (Usage Explanation):</span>
                <p className="text-xs text-[#2f3e46] font-semibold leading-relaxed">
                  {conjunction.explanationSinhala}
                </p>
              </div>
            )}

            {/* Interactive Sentence Examples */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black text-[#52796f] uppercase block">උදාහරණ වාක්‍ය (Examples):</span>
              <div className="space-y-2.5">
                {conjunction.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="p-3 bg-[#fdfbf7] border border-[#e9e2d7] rounded-2xl relative hover:bg-white shadow-3xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#354f52] leading-tight select-all">{ex.japanese}</p>
                        <p className="text-[11px] text-slate-400 font-bold font-mono">{ex.hiragana}</p>
                        <p className="text-xs text-[#52796f] font-extrabold mt-1">🇱🇰 {ex.sinhala}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => speakJapanese(e, ex.japanese)}
                        className="p-2 text-[#52796f] hover:text-white hover:bg-[#52796f] bg-[#f0ede6]/80 rounded-xl shrink-0 transition cursor-pointer font-bold"
                        title="හඬ සවන් දෙන්න"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Controls - Learning Status */}
          <div className="pt-3 border-t border-[#f0ede6]" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 text-center">
              අධ්‍යයන ප්‍රගතිය (Study Status):
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onStatusChange?.("NOT_YET")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                  status === "NOT_YET"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-amber-50 text-amber-600 hover:bg-amber-100/75 border border-amber-200"
                }`}
              >
                ❌ NOT YET
              </button>
              <button
                type="button"
                onClick={() => onStatusChange?.("OK")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                  status === "OK"
                    ? "bg-[#52796f] text-white shadow-xs"
                    : "bg-[#cad2c5]/40 text-[#52796f] hover:bg-[#cad2c5]"
                }`}
              >
                ✔️ OK
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
