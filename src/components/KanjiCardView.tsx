import { motion } from "motion/react";
import { MouseEvent } from "react";
import { Check, AlertCircle, BookOpen, Volume2, HelpCircle } from "lucide-react";
import { KanjiCard, LearningStatus } from "../types";

interface KanjiCardViewProps {
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
  // Determine gradient based on status or meaning
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#cad2c5] text-[#2f3e46]">
            <Check className="w-3.5 h-3.5" /> OK (Mathakai)
          </span>
        );
      case "NOT_YET":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ece2d0] text-[#bc6c25]">
            <AlertCircle className="w-3.5 h-3.5" /> Not Yet (Thama Na)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0ede6] text-[#52796f]">
            <BookOpen className="w-3.5 h-3.5" /> New (Thama Na)
          </span>
        );
    }
  };

  // Speaks the Kanji or Furigana reading using basic browser speech
  const speakReading = (e: MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(card.kanji.replace(/\./g, ""));
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isTestModeDetailsHidden = mode === "test" && !isRevealed;

  return (
    <motion.div
      layout
      id={`kanji-card-${card.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col justify-between w-full min-h-[460px] p-6 rounded-[32px] border-2 transition-all duration-300 shadow-xl select-none cursor-pointer ${getStatusColor()}`}
      onClick={() => {
        if (mode === "test" && !isRevealed && onReveal) {
          onReveal();
        }
      }}
    >
      {/* Top Banner section */}
      <div className="flex items-center justify-between w-full border-b border-dashed border-[#e9e2d7] pb-3 mb-4">
        <span className="font-mono text-xs text-[#84a98c] font-medium tracking-tight">
          ID: {card.id.split("_").pop()}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={speakReading}
            className="p-1.5 text-[#84a98c] hover:text-[#52796f] rounded-lg hover:bg-[#f0ede6] transition-colors"
            title="Pronounce"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          {getStatusBadge()}
        </div>
      </div>

      {/* Hidden view during checking/testing */}
      {isTestModeDetailsHidden ? (
        <div className="flex-1 flex flex-col justify-center items-center py-6">
          <div className="relative mb-6">
            {/* Glowing background orb for graphic */}
            <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-2xl opacity-40 scale-150 animate-pulse"></div>
            <div className="relative text-7xl font-bold font-sans text-center text-[#2f3e46] tracking-wide select-all">
              {card.kanji}
            </div>
          </div>
          <div className="text-center mt-6 p-4 bg-[#f0ede6] border border-[#e9e2d7] rounded-xl max-w-sm w-full shadow-inner animate-bounce text-xs font-semibold text-[#52796f] tracking-wider">
            👆 CLICK TO REVEAL DETAILS
          </div>
        </div>
      ) : (
        /* Full Detailed / Revealed View of the Kanji */
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col items-center">
            {/* Reading Furigana / Hiragana above Kanji */}
            <span className="text-sm font-semibold tracking-widest text-[#52796f] bg-[#f0ede6] px-4 py-1 rounded-full mb-1 border border-[#e9e2d7]">
              {card.furigana}
            </span>

            {/* Kanji Character with okurigana */}
            <div className="relative my-4 flex flex-col items-center">
              <div className="absolute inset-0 bg-[#cad2c5] rounded-full blur-3xl opacity-30 scale-110"></div>
              <div className="relative text-7xl font-bold text-center text-[#2f3e46] tracking-wide font-sans select-all">
                {card.kanji}
              </div>
            </div>

            {/* Onyomi and Kunyomi Readings */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2 px-1">
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                <span className="font-sans font-semibold text-[10px] text-[#84a98c] uppercase tracking-widest">
                  Onyomi (චීන)
                </span>
                <span className="font-mono text-xs font-semibold text-[#52796f] mt-1 breaking-normal">
                  {card.onyomi || "—"}
                </span>
              </div>
              <div className="p-2 bg-[#fdfbf7] rounded-xl border border-[#e9e2d7] flex flex-col items-center text-center">
                <span className="font-sans font-semibold text-[10px] text-[#84a98c] uppercase tracking-widest">
                  Kunyomi (ජපන්)
                </span>
                <span className="font-mono text-xs font-semibold text-[#bc6c25] mt-1 breaking-normal">
                  {card.kunyomi || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Translations section */}
          <div className="mt-5 space-y-3.5 border-t border-[#e9e2d7] pt-4 text-center">
            {/* Sinhala text (primary language highlighted) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-[#84a98c] font-semibold mb-0.5">
                Sinhala අර්ථය
              </span>
              <p className="text-xl font-bold text-[#354f52] font-sans tracking-tight leading-snug px-2">
                {card.sinhalaMeaning}
              </p>
            </div>

            {/* English text */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-[#84a98c] font-semibold mb-0.5">
                English Meaning
              </span>
              <p className="text-sm font-semibold text-[#52796f] font-display">
                {card.englishMeaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons footer inside the card / attached */}
      {onStatusChange && (!isTestModeDetailsHidden) && (
        <div className="grid grid-cols-2 gap-3.5 mt-5 pt-4 border-t border-[#e9e2d7]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange("NOT_YET");
            }}
            className={`w-full py-2.5 px-3 rounded-xl font-sans font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
              status === "NOT_YET"
                ? "bg-[#bc6c25] text-white shadow-md shadow-[#bc6c25]/20 active:translate-y-0.5"
                : "bg-[#ece2d0] text-[#bc6c25] hover:bg-[#ece2d0]/85 active:scale-95"
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
                ? "bg-[#52796f] text-white shadow-md shadow-[#52796f]/20 active:translate-y-0.5"
                : "bg-[#f0ede6] text-[#52796f] hover:bg-[#e9e2d7] active:scale-95"
            }`}
          >
            ✔️ OK
          </button>
        </div>
      )}
    </motion.div>
  );
}
