import React, { MouseEvent, useState } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, BookOpen, Volume2, ArrowRight } from "lucide-react";
import { KanjiCard, LearningStatus } from "../types";

interface KanjiCardViewProps {
  key?: React.Key;
  card: KanjiCard;
  status: LearningStatus;
  mode: "learn" | "test";
  isRevealed?: boolean; // Used in test mode to show answer
  onStatusChange?: (newStatus: LearningStatus) => void;
  onReveal?: () => void;
}

export default function KanjiCardView({
  card,
  status,
  mode,
  isRevealed = false,
  onStatusChange,
  onReveal,
}: KanjiCardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine border color based on status
  const getStatusColor = () => {
    switch (status) {
      case "OK":
        return "border-[#52796f] bg-white";
      case "NOT_YET":
        return "border-[#bc6c25] bg-white";
      default:
        return "border-[#e9e2d7] bg-white";
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "OK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#cad2c5] text-[#2f3e46]">
            <Check className="w-3 h-3" /> OK
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#ece2d0] text-[#bc6c25]">
            <AlertCircle className="w-3 h-3" /> NOT YET
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#f0ede6] text-[#52796f]">
            <BookOpen className="w-3 h-3" /> NEW
          </span>
        );
    }
  };

  // Speaks the Kanji or Furigana reading using basic browser speech
  const speakReading = (e: MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(card.kanji.replace(/\./g, ""));
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isTestModeDetailsHidden = mode === "test" && !isRevealed;

  // Render for testing mode: standard static layout or revealed detail
  if (mode === "test") {
    return (
      <div
        id={`kanji-card-test-${card.id}`}
        className={`relative flex flex-col justify-between w-full min-h-[460px] p-6 rounded-[32px] border-2 transition-all duration-300 shadow-sm cursor-pointer border-b-8 ${getStatusColor()}`}
        onClick={() => {
          if (!isRevealed && onReveal) {
            onReveal();
          }
        }}
      >
        {/* Top Banner section */}
        <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3 mb-4">
          <span className="font-mono text-[10px] text-[#84a98c] font-black tracking-tight uppercase">
            ID: {card.id.split("_").pop()}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={speakReading}
              className="p-1 px-2 bg-[#f0ede6] text-[#354f52] rounded-xl hover:bg-[#cad2c5] transition-colors"
              title="Pronounce"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {getStatusBadge()}
          </div>
        </div>

        {isTestModeDetailsHidden ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-2xl opacity-40 scale-150 animate-pulse"></div>
              <div className="relative text-7xl font-black font-sans text-center text-[#2f3e46] tracking-wide select-all">
                {card.kanji}
              </div>
            </div>
            <div className="text-center mt-6 p-4 bg-[#f0ede6] border border-[#e9e2d7] rounded-xl max-w-sm w-full shadow-inner text-xs font-black text-[#52796f] tracking-wider uppercase">
              👆 CLICK TO REVEAL DETAILS
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-center">
              <span className="text-xs font-black tracking-widest text-[#52796f] bg-[#f0ede6] px-4 py-1.5 rounded-full mb-1 border border-[#e9e2d7]">
                {card.furigana}
              </span>

              <div className="relative my-4 flex flex-col items-center">
                <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-3xl opacity-30 scale-110"></div>
                <div className="relative text-7xl font-bold text-center text-[#2f3e46] tracking-wide font-sans select-all">
                  {card.kanji}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 mt-2 px-1">
                <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                  <span className="font-sans font-black text-[9px] text-[#84a98c] uppercase tracking-widest">
                    Onyomi (චීන)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#52796f] mt-1 break-all">
                    {card.onyomi || "—"}
                  </span>
                </div>
                <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                  <span className="font-sans font-black text-[9px] text-[#84a98c] uppercase tracking-widest">
                    Kunyomi (ජපන්)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#bc6c25] mt-1 break-all">
                    {card.kunyomi || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3.5 border-t border-[#e9e2d7] pt-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-wider text-[#84a98c] font-black mb-0.5">
                  Sinhala අර්ථය
                </span>
                <p className="text-xl font-bold text-[#354f52] font-sans tracking-tight leading-snug px-2">
                  {card.sinhalaMeaning}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-wider text-[#84a98c] font-black mb-0.5">
                  English Meaning
                </span>
                <p className="text-sm font-semibold text-[#52796f] font-display">
                  {card.englishMeaning}
                </p>
              </div>
            </div>

            {onStatusChange && (
              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#e9e2d7]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange("NOT_YET");
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-sans font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    status === "NOT_YET"
                      ? "bg-[#bc6c25] text-white shadow-md shadow-[#bc6c25]/20"
                      : "bg-[#ece2d0] text-[#bc6c25]"
                  }`}
                >
                  ❌ NOT YET
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange("OK");
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-sans font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    status === "OK"
                      ? "bg-[#52796f] text-white shadow-md shadow-[#52796f]/20"
                      : "bg-[#f0ede6] text-[#52796f]"
                  }`}
                >
                  ✔️ OK
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Learn Mode 3D Flipped Card Implementation
  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="perspective-1000 w-full min-h-[460px] cursor-pointer relative"
      id={`kanji-card-${card.id}`}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className={`w-full min-h-[460px] rounded-[36px] border-2 border-b-8 shadow-sm flex flex-col justify-between p-6 ${getStatusColor()}`}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Banner section */}
          <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3">
            <span className="font-mono text-[10px] text-[#84a98c] font-black tracking-tight uppercase">
              ID: {card.id.split("_").pop()}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={speakReading}
                className="p-1 px-2 bg-[#f0ede6] text-[#354f52] rounded-xl hover:bg-[#cad2c5] transition-colors cursor-pointer"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {getStatusBadge()}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <span className="text-xs font-black tracking-widest text-[#52796f] bg-[#f0ede6] px-4 py-1 rounded-full mb-1 border border-[#e9e2d7]">
              {card.furigana}
            </span>

            <div className="relative my-4 flex flex-col items-center">
              <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-3xl opacity-30 scale-110"></div>
              <div className="relative text-7xl font-black text-center text-[#2f3e46] tracking-wide font-sans select-all">
                {card.kanji}
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-2 px-1">
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                <span className="font-sans font-black text-[9px] text-[#84a98c] uppercase tracking-widest">
                  Onyomi (චීන)
                </span>
                <span className="font-mono text-xs font-bold text-[#52796f] mt-1 break-all">
                  {card.onyomi || "—"}
                </span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                <span className="font-sans font-black text-[9px] text-[#84a98c] uppercase tracking-widest">
                  Kunyomi (ජපන්)
                </span>
                <span className="font-mono text-xs font-bold text-[#bc6c25] mt-1 break-all">
                  {card.kunyomi || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full text-center border-t border-[#f0ede6] pt-3 flex items-center justify-center gap-1 text-[11px] font-black text-[#52796f] hover:text-[#bc6c25] transition-colors">
            <span>අර්ථය බැලීමට ක්ලික් කරන්න (Tap to reveal meaning) <ArrowRight className="w-3.5 h-3.5 inline" /></span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-y-auto"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={(e) => e.stopPropagation()} // Stop flip on scrolling back cards
        >
          <div className="space-y-4 border-b border-[#f0ede6] pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase">
                BACKSIDE DETAIL • {card.id.split("_").pop()}
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-[10px] bg-[#f0ede6] font-black hover:bg-[#cad2c5] px-2.5 py-1 rounded-lg text-[#354f52] transition-colors"
              >
                ◀ ආපසු හරවන්න
              </button>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-black tracking-widest text-[#52796f] bg-[#f0ede6] px-3.5 py-1 rounded-full border border-[#e9e2d7]">
                {card.furigana}
              </span>
              <h3 className="font-display font-black text-4xl text-[#354f52] mt-3">
                {card.kanji}
              </h3>
            </div>
          </div>

          <div className="flex-1 py-3 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#84a98c] font-black block">
                Sinhala අර්ථය
              </span>
              <p className="text-xl font-black text-[#354f52] font-sans leading-tight">
                {card.sinhalaMeaning}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#84a98c] font-black block">
                English Meaning
              </span>
              <p className="text-sm font-semibold text-[#52796f] font-display">
                {card.englishMeaning}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f0ede6]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
              ව්‍යාකරණ ප්‍රගතිය (Study Status):
            </span>
            {onStatusChange && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange("NOT_YET");
                  }}
                  className={`py-2 px-3 rounded-xl font-sans font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "NOT_YET"
                      ? "bg-[#bc6c25] text-white shadow-xs"
                      : "bg-[#ece2d0] text-[#bc6c25] hover:bg-[#ece2d0]/90"
                  }`}
                >
                  ❌ NOT YET
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange("OK");
                  }}
                  className={`py-2 px-3 rounded-xl font-sans font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
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
        </div>
      </motion.div>
    </div>
  );
}
