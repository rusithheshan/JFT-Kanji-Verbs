import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, Bookmark, Volume2, HelpCircle } from "lucide-react";
import { JFTGrammar } from "../types";
import { LearningStatus } from "../types";

interface GrammarCardViewProps {
  key?: React.Key;
  grammar: JFTGrammar;
  status: LearningStatus;
  onStatusChange?: (newStatus: LearningStatus) => void;
}

export default function GrammarCardView({
  grammar,
  status,
  onStatusChange,
}: GrammarCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Speaks Japanese sentence
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
        return "border-[#bc6c25] border-b-8 bg-white";
      default:
        return "border-[#e9e2d7] border-b-8 bg-white";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "OK":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#cad2c5] text-[#2f3e46]">
            <Check className="w-2.5 h-2.5" /> OK
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#ece2d0] text-[#bc6c25]">
            <AlertCircle className="w-2.5 h-2.5" /> NOT YET
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fdfbf7] border border-[#e9e2d7] text-[#52796f]">
            <Bookmark className="w-2.5 h-2.5" /> NEW
          </span>
        );
    }
  };

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
      id={`grammar-card-wrapper-${grammar.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full transition-all duration-300 rounded-[42px] border-2 shadow-sm cursor-pointer relative select-none flex flex-col justify-between p-0 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div
          className={isFlipped ? "absolute inset-x-0 top-0 p-8 pointer-events-none opacity-0 invisible" : "relative w-full flex flex-col justify-between p-8 h-full min-h-[380px]"}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Info Header */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-black font-mono text-[#52796f] bg-[#cad2c5]/40 px-3.5 py-1.5 rounded-full">
                LESSON {grammar.index}
              </span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Central content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-6">
            <span className="text-[11px] font-black tracking-widest text-[#bc6c25] uppercase">
              GRAMMAR PATTERN • ව්‍යාකරණ රටාව
            </span>
            <h3 className="font-display font-black text-4xl text-[#354f52] leading-tight tracking-tight">
              {grammar.title}
            </h3>
            {grammar.romaji && (
              <p className="text-base font-mono text-slate-400 font-extrabold">
                ({grammar.romaji})
              </p>
            )}
            <p className="text-sm text-[#84a98c] max-w-[280px] leading-relaxed mx-auto mt-4 font-semibold">
              {grammar.sinhalaExplanation}
            </p>
          </div>

          {/* Bottom Flip Button Prompt */}
          <div className="w-full text-center border-t border-[#f0ede6] pt-4 flex items-center justify-center gap-1.5 text-xs font-black text-[#52796f] hover:text-[#354f52] transition-colors">
            <span>විස්තර බැලීමට හරවන්න (Tap to Reveal Details) ➔</span>
          </div>
        </div>

        {/* --- BACK SIDE (FLIPPED) --- */}
        <div
          className={isFlipped ? "relative w-full flex flex-col justify-between p-8 h-full" : "absolute inset-x-0 top-0 p-8 pointer-events-none opacity-0 invisible"}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={(e) => e.stopPropagation()} // Stop flip on scrolling back card details
        >
          {/* Top of Back - Title & Pattern Header */}
          <div className="space-y-3.5 border-b border-[#f0ede6] pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-wider">
                LESSON {grammar.index} • DETAILED REFERENCE
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs bg-[#f0ede6] font-black hover:bg-[#cad2c5] px-3.5 py-1 rounded-lg text-[#354f52] transition-colors"
              >
                ◀ ආපසු හරවන්න
              </button>
            </div>
            
            <h3 className="font-display font-black text-2xl text-[#354f52]">
              {grammar.title} <span className="text-sm font-bold text-slate-400 font-mono">({grammar.romaji})</span>
            </h3>

            {/* Pattern Construction */}
            <div className="bg-[#fcfaf2] border border-[#e9e2d7] p-3.5 rounded-2xl font-mono text-sm text-[#2f3e46] font-bold shadow-inner">
              <span className="text-[10px] block text-[#bc6c25] font-sans font-black mb-1.5">PATTERN STRUCTURE:</span>
              <code>{grammar.pattern}</code>
            </div>
          </div>

          {/* Core Explanations */}
          <div className="flex-1 py-4 text-left space-y-5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-[#52796f] uppercase block">සිංහල පැහැදිලි කිරීම (Sinhala):</span>
              <p className="text-sm text-[#354f52] font-semibold leading-relaxed">
                {grammar.sinhalaExplanation}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase block">English explanation:</span>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {grammar.englishExplanation}
              </p>
            </div>

            {grammar.conjugationRules && (
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100 space-y-1.5">
                <span className="text-[10px] font-black text-amber-800 uppercase block">Conjugation & Rules:</span>
                <p className="text-xs text-amber-900 font-bold whitespace-pre-wrap leading-relaxed">
                  {grammar.conjugationRules}
                </p>
              </div>
            )}

            {(grammar.oftenUsed || grammar.notUsed) && (
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                {grammar.oftenUsed && (
                  <div className="p-3.5 bg-[#cad2c5]/25 border border-[#cad2c5]/50 rounded-2xl">
                    <span className="font-black text-[#52796f] block mb-1 text-[10px]">🙌 Often Used With:</span>
                    <p className="text-slate-700 font-semibold leading-relaxed">{grammar.oftenUsed}</p>
                  </div>
                )}
                {grammar.notUsed && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl">
                    <span className="font-black text-rose-700 block mb-1 text-[10px]">⚠️ Not Used With:</span>
                    <p className="text-rose-900 font-semibold leading-relaxed">{grammar.notUsed}</p>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Sentence Examples */}
            <div className="space-y-3 pt-3 border-t border-dashed border-[#e9e2d7]">
              <span className="text-[10px] font-black text-[#bc6c25] uppercase block">ආදර්ශ වාක්‍ය (Examples):</span>
              <div className="space-y-3">
                {grammar.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="p-3.5 bg-white border border-[#e9e2d7] rounded-2xl relative hover:bg-[#fcfaf2] transition-colors group shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-base font-black text-[#354f52] leading-tight select-all">{ex.japanese}</p>
                        <p className="text-xs text-slate-400 font-extrabold font-mono">{ex.hiragana}</p>
                        <p className="text-xs text-[#52796f] font-extrabold mt-1">🇱🇰 {ex.sinhala}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => speakJapanese(e, ex.japanese)}
                        className="p-2 text-slate-400 hover:text-[#52796f] bg-[#f0ede6]/70 rounded-xl shrink-0 group-hover:bg-[#f0ede6] transition cursor-pointer"
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
          <div className="pt-4 border-t border-[#f0ede6]" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
              ව්‍යාකරණ ප්‍රගතිය (Grammar Status):
            </span>
            <div className="grid grid-cols-2 gap-3 pb-1">
              <button
                type="button"
                onClick={() => onStatusChange?.("NOT_YET")}
                className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                  status === "NOT_YET"
                    ? "bg-[#bc6c25] text-white shadow-xs"
                    : "bg-[#ece2d0]/50 text-[#bc6c25] hover:bg-[#ece2d0]"
                }`}
              >
                ❌ NOT YET
              </button>
              <button
                type="button"
                onClick={() => onStatusChange?.("OK")}
                className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer ${
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
