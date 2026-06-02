import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, Bookmark, Volume2, HelpCircle } from "lucide-react";
import { JFTGrammar } from "../types";
import { LearningStatus } from "../types";

interface GrammarCardViewProps {
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
            <Check className="w-2.5 h-2.5" /> MATHAKAI (මතකයි)
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#ece2d0] text-[#bc6c25]">
            <AlertCircle className="w-2.5 h-2.5" /> THAWA ONE (තව ඕනේ)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#fdfbf7] border border-[#e9e2d7] text-[#52796f]">
            <Bookmark className="w-2.5 h-2.5" /> NEW (අලුත්)
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
        className={`w-full min-h-[460px] rounded-[36px] border-2 shadow-xs cursor-pointer relative select-none flex flex-col justify-between p-6 ${getStatusColor()}`}
      >
        {/* --- FRONT SIDE --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Info Header */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black font-mono text-[#52796f] bg-[#cad2c5]/40 px-2.5 py-0.5 rounded-full">
                LESSON {grammar.index}
              </span>
            </div>
            {getStatusBadge()}
          </div>

          {/* Central content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-4">
            <span className="text-[10px] font-black tracking-widest text-[#bc6c25] uppercase">
              GRAMMAR PATTERN • ව්‍යාකරණ රටාව
            </span>
            <h3 className="font-display font-black text-3xl text-[#354f52] leading-tight tracking-tight">
              {grammar.title}
            </h3>
            {grammar.romaji && (
              <p className="text-sm font-mono text-slate-400 font-bold">
                ({grammar.romaji})
              </p>
            )}
            <p className="text-xs text-[#84a98c] max-w-[240px] leading-relaxed mx-auto mt-2">
              {grammar.sinhalaExplanation.length > 80
                ? grammar.sinhalaExplanation.substring(0, 80) + "..."
                : grammar.sinhalaExplanation}
            </p>
          </div>

          {/* Bottom Flip Button Prompt */}
          <div className="w-full text-center border-t border-[#f0ede6] pt-3 flex items-center justify-center gap-1 text-[11px] font-black text-[#52796f] hover:text-[#354f52] transition-colors">
            <span>විස්තර බැලීමට හරවන්න (Tap to Reveal)</span>
          </div>
        </div>

        {/* --- BACK SIDE (FLIPPED) --- */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-y-auto"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={(e) => e.stopPropagation()} // Stop flip on scrolling back card details
        >
          {/* Top of Back - Title & Pattern Header */}
          <div className="space-y-2 border-b border-[#f0ede6] pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#bc6c25] uppercase tracking-wider">
                LESSON {grammar.index} • DETAILED REFERENCE
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-[10px] bg-[#f0ede6] font-extrabold hover:bg-[#cad2c5] px-2 py-0.5 rounded-md text-[#354f52]"
              >
                ආපසු හරවන්න
              </button>
            </div>
            
            <h3 className="font-display font-black text-lg text-[#354f52]">
              {grammar.title} ({grammar.romaji})
            </h3>

            {/* Pattern Construction */}
            <div className="bg-[#fcfaf2] border border-[#e9e2d7] p-2.5 rounded-xl font-mono text-xs text-[#2f3e46] font-bold">
              <span className="text-[9px] block text-[#bc6c25] font-sans font-black mb-1">PATTERN STRUCTURE:</span>
              <code>{grammar.pattern}</code>
            </div>
          </div>

          {/* Core Explanations */}
          <div className="flex-1 py-3 text-left space-y-3.5 scrollbar-thin overflow-y-auto max-h-[220px]">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#52796f] uppercase block">සිංහල පැහැදිලි කිරීම (Sinhala):</span>
              <p className="text-xs text-[#354f52] font-semibold leading-relaxed">
                {grammar.sinhalaExplanation}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase block">English explanation:</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {grammar.englishExplanation}
              </p>
            </div>

            {grammar.conjugationRules && (
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 space-y-1">
                <span className="text-[9px] font-black text-amber-800 uppercase block">Conjugation & Rules:</span>
                <p className="text-[11px] text-amber-900 font-semibold whitespace-pre-wrap leading-relaxed">
                  {grammar.conjugationRules}
                </p>
              </div>
            )}

            {(grammar.oftenUsed || grammar.notUsed) && (
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                {grammar.oftenUsed && (
                  <div className="p-2 bg-[#cad2c5]/15 border border-[#cad2c5]/40 rounded-xl">
                    <span className="font-extrabold text-[#52796f] block mb-0.5">🙌 Often Used With:</span>
                    <p className="text-slate-600 font-medium leading-relaxed">{grammar.oftenUsed}</p>
                  </div>
                )}
                {grammar.notUsed && (
                  <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl">
                    <span className="font-extrabold text-rose-700 block mb-0.5">⚠️ Not Used With:</span>
                    <p className="text-rose-900 font-medium leading-relaxed">{grammar.notUsed}</p>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Sentence Examples */}
            <div className="space-y-2 pt-2 border-t border-dashed border-[#e9e2d7]">
              <span className="text-[9px] font-black text-[#bc6c25] uppercase block">ආදර්ශ වාක්‍ය (Examples):</span>
              <div className="space-y-2">
                {grammar.examples.map((ex, exIdx) => (
                  <div key={exIdx} className="p-2.5 bg-white border border-[#e9e2d7] rounded-xl relative hover:bg-[#fcfaf2] transition-colors group">
                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-[#354f52] leading-tight">{ex.japanese}</p>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">{ex.hiragana}</p>
                        <p className="text-[11px] text-[#52796f] font-bold mt-1">🇱🇰 {ex.sinhala}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => speakJapanese(e, ex.japanese)}
                        className="p-1.5 text-slate-400 hover:text-[#52796f] bg-[#f0ede6]/50 rounded-lg shrink-0 group-hover:bg-white transition"
                        title="හඬ සවන් දෙන්න"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Controls - Learning Status */}
          <div className="pt-3 border-t border-[#f0ede6]" onClick={(e) => e.stopPropagation()}>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1 text-center">
              ඔබට මෙම ව්‍යාකරණ රටාව මතකද?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onStatusChange?.("NOT_YET")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  status === "NOT_YET"
                    ? "bg-[#bc6c25] text-white shadow-xs"
                    : "bg-[#ece2d0]/50 text-[#bc6c25] hover:bg-[#ece2d0]"
                }`}
              >
                ❌ තව ඕනේ (Not Yet)
              </button>
              <button
                type="button"
                onClick={() => onStatusChange?.("OK")}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  status === "OK"
                    ? "bg-[#52796f] text-white shadow-xs"
                    : "bg-[#cad2c5]/40 text-[#52796f] hover:bg-[#cad2c5]"
                }`}
              >
                ✔️ මතකයි (OK)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
