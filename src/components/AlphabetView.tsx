import React, { useState } from "react";
import { motion } from "motion/react";
import { Languages, Volume2, Search, ArrowRightLeft, BookOpen, Stars } from "lucide-react";

interface KanaCharacter {
  kana: string;
  romaji: string;
  sinhala: string;
  row: string;
  col: string;
}

const HIRAGANA_DATA: KanaCharacter[] = [
  // Vowels
  { kana: "あ", romaji: "a", sinhala: "අ", row: "Vowels", col: "a" },
  { kana: "い", romaji: "i", sinhala: "ඉ", row: "Vowels", col: "i" },
  { kana: "う", romaji: "u", sinhala: "උ", row: "Vowels", col: "u" },
  { kana: "え", romaji: "e", sinhala: "එ", row: "Vowels", col: "e" },
  { kana: "お", romaji: "o", sinhala: "ඔ", row: "Vowels", col: "o" },
  // K-row
  { kana: "か", romaji: "ka", sinhala: "ක", row: "K-row", col: "a" },
  { kana: "き", romaji: "ki", sinhala: "කි", row: "K-row", col: "i" },
  { kana: "く", romaji: "ku", sinhala: "කු", row: "K-row", col: "u" },
  { kana: "け", romaji: "ke", sinhala: "කෙ", row: "K-row", col: "e" },
  { kana: "こ", romaji: "ko", sinhala: "කො", row: "K-row", col: "o" },
  // S-row
  { kana: "さ", romaji: "sa", sinhala: "ස", row: "S-row", col: "a" },
  { kana: "し", romaji: "shi", sinhala: "ශි", row: "S-row", col: "i" },
  { kana: "す", romaji: "su", sinhala: "සු", row: "S-row", col: "u" },
  { kana: "せ", romaji: "se", sinhala: "සෙ", row: "S-row", col: "e" },
  { kana: "そ", romaji: "so", sinhala: "සො", row: "S-row", col: "o" },
  // T-row
  { kana: "た", romaji: "ta", sinhala: "ත", row: "T-row", col: "a" },
  { kana: "ち", romaji: "chi", sinhala: "චි", row: "T-row", col: "i" },
  { kana: "つ", romaji: "tsu", sinhala: "ත්සු", row: "T-row", col: "u" },
  { kana: "て", romaji: "te", sinhala: "තෙ", row: "T-row", col: "e" },
  { kana: "to", romaji: "to", sinhala: "තො", row: "T-row", col: "o" },
  // N-row
  { kana: "な", romaji: "na", sinhala: "න", row: "N-row", col: "a" },
  { kana: "に", romaji: "ni", sinhala: "නි", row: "N-row", col: "i" },
  { kana: "ぬ", romaji: "nu", sinhala: "නු", row: "N-row", col: "u" },
  { kana: "ね", romaji: "ne", sinhala: "නෙ", row: "N-row", col: "e" },
  { kana: "の", romaji: "no", sinhala: "නො", row: "N-row", col: "o" },
  // H-row
  { kana: "は", romaji: "ha", sinhala: "හ", row: "H-row", col: "a" },
  { kana: "ひ", romaji: "hi", sinhala: "හි", row: "H-row", col: "i" },
  { kana: "ふ", romaji: "fu", sinhala: "හු", row: "H-row", col: "u" },
  { kana: "へ", romaji: "he", sinhala: "හෙ", row: "H-row", col: "e" },
  { kana: "ほ", romaji: "ho", sinhala: "හො", row: "H-row", col: "o" },
  // M-row
  { kana: "ま", romaji: "ma", sinhala: "ම", row: "M-row", col: "a" },
  { kana: "み", romaji: "mi", sinhala: "මි", row: "M-row", col: "i" },
  { kana: "む", romaji: "mu", sinhala: "මු", row: "M-row", col: "u" },
  { kana: "め", romaji: "me", sinhala: "මෙ", row: "M-row", col: "e" },
  { kana: "も", romaji: "mo", sinhala: "මො", row: "M-row", col: "o" },
  // Y-row
  { kana: "や", romaji: "ya", sinhala: "ය", row: "Y-row", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "Y-row", col: "i" },
  { kana: "ゆ", romaji: "yu", sinhala: "යු", row: "Y-row", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "Y-row", col: "e" },
  { kana: "よ", romaji: "yo", sinhala: "යො", row: "Y-row", col: "o" },
  // R-row
  { kana: "ら", romaji: "ra", sinhala: "ර", row: "R-row", col: "a" },
  { kana: "り", romaji: "ri", sinhala: "රි", row: "R-row", col: "i" },
  { kana: "る", romaji: "ru", sinhala: "රු", row: "R-row", col: "u" },
  { kana: "れ", romaji: "re", sinhala: "රෙ", row: "R-row", col: "e" },
  { kana: "ろ", romaji: "ro", sinhala: "රො", row: "R-row", col: "o" },
  // W-row
  { kana: "わ", romaji: "wa", sinhala: "ව", row: "W-row", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "i" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "e" },
  { kana: "を", romaji: "wo", sinhala: "වො", row: "W-row", col: "o" },
  // N-g
  { kana: "ん", romaji: "n", sinhala: "න්/ං", row: "N-nasal", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "i" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "e" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "o" },
];

const KATAKANA_DATA: KanaCharacter[] = [
  // Vowels
  { kana: "ア", romaji: "a", sinhala: "අ", row: "Vowels", col: "a" },
  { kana: "イ", romaji: "i", sinhala: "ඉ", row: "Vowels", col: "i" },
  { kana: "ウ", romaji: "u", sinhala: "උ", row: "Vowels", col: "u" },
  { kana: "エ", romaji: "e", sinhala: "එ", row: "Vowels", col: "e" },
  { kana: "オ", romaji: "o", sinhala: "ඔ", row: "Vowels", col: "o" },
  // K-row
  { kana: "カ", romaji: "ka", sinhala: "ක", row: "K-row", col: "a" },
  { kana: "キ", romaji: "ki", sinhala: "කි", row: "K-row", col: "i" },
  { kana: "ク", romaji: "ku", sinhala: "කු", row: "K-row", col: "u" },
  { kana: "ケ", romaji: "ke", sinhala: "කෙ", row: "K-row", col: "e" },
  { kana: "コ", romaji: "ko", sinhala: "කො", row: "K-row", col: "o" },
  // S-row
  { kana: "サ", romaji: "sa", sinhala: "ස", row: "S-row", col: "a" },
  { kana: "シ", romaji: "shi", sinhala: "ශි", row: "S-row", col: "i" },
  { kana: "ス", romaji: "su", sinhala: "සු", row: "S-row", col: "u" },
  { kana: "セ", romaji: "se", sinhala: "සෙ", row: "S-row", col: "e" },
  { kana: "ソ", romaji: "so", sinhala: "සො", row: "S-row", col: "o" },
  // T-row
  { kana: "タ", romaji: "ta", sinhala: "ත", row: "T-row", col: "a" },
  { kana: "チ", romaji: "chi", sinhala: "චි", row: "T-row", col: "i" },
  { kana: "ツ", romaji: "tsu", sinhala: "ත්සු", row: "T-row", col: "u" },
  { kana: "テ", romaji: "te", sinhala: "තෙ", row: "T-row", col: "e" },
  { kana: "ト", romaji: "to", sinhala: "තො", row: "T-row", col: "o" },
  // N-row
  { kana: "ナ", romaji: "na", sinhala: "න", row: "N-row", col: "a" },
  { kana: "ニ", romaji: "ni", sinhala: "නි", row: "N-row", col: "i" },
  { kana: "ヌ", romaji: "nu", sinhala: "නු", row: "N-row", col: "u" },
  { kana: "ネ", romaji: "ne", sinhala: "නෙ", row: "N-row", col: "e" },
  { kana: "ノ", romaji: "no", sinhala: "නො", row: "N-row", col: "o" },
  // H-row
  { kana: "ハ", romaji: "ha", sinhala: "හ", row: "H-row", col: "a" },
  { kana: "ヒ", romaji: "hi", sinhala: "හි", row: "H-row", col: "i" },
  { kana: "フ", romaji: "fu", sinhala: "හු", row: "H-row", col: "u" },
  { kana: "ヘ", romaji: "he", sinhala: "හෙ", row: "H-row", col: "e" },
  { kana: "ホ", romaji: "ho", sinhala: "හො", row: "H-row", col: "o" },
  // M-row
  { kana: "マ", romaji: "ma", sinhala: "ම", row: "M-row", col: "a" },
  { kana: "ミ", romaji: "mi", sinhala: "මි", row: "M-row", col: "i" },
  { kana: "ム", romaji: "mu", sinhala: "මු", row: "M-row", col: "u" },
  { kana: "メ", romaji: "me", sinhala: "මෙ", row: "M-row", col: "e" },
  { kana: "モ", romaji: "mo", sinhala: "මො", row: "M-row", col: "o" },
  // Y-row
  { kana: "ヤ", romaji: "ya", sinhala: "ය", row: "Y-row", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "Y-row", col: "i" },
  { kana: "ユ", romaji: "yu", sinhala: "යු", row: "Y-row", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "Y-row", col: "e" },
  { kana: "ヨ", romaji: "yo", sinhala: "යො", row: "Y-row", col: "o" },
  // R-row
  { kana: "ラ", romaji: "ra", sinhala: "ර", row: "R-row", col: "a" },
  { kana: "リ", romaji: "ri", sinhala: "රි", row: "R-row", col: "i" },
  { kana: "ル", romaji: "ru", sinhala: "රු", row: "R-row", col: "u" },
  { kana: "レ", romaji: "re", sinhala: "රෙ", row: "R-row", col: "e" },
  { kana: "ロ", romaji: "ro", sinhala: "රො", row: "R-row", col: "o" },
  // W-row
  { kana: "ワ", romaji: "wa", sinhala: "ව", row: "W-row", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "i" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "W-row", col: "e" },
  { kana: "ヲ", romaji: "wo", sinhala: "වො", row: "W-row", col: "o" },
  // N-g
  { kana: "ン", romaji: "n", sinhala: "න්/ං", row: "N-nasal", col: "a" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "i" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "u" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "e" },
  { kana: "", romaji: "", sinhala: "", row: "N-nasal", col: "o" },
];

export default function AlphabetView() {
  const [subTab, setSubTab] = useState<"hiragana" | "katakana">("hiragana");
  const [search, setSearch] = useState("");
  const [hoveredChar, setHoveredChar] = useState<KanaCharacter | null>(null);

  const activeData = subTab === "hiragana" ? HIRAGANA_DATA : KATAKANA_DATA;

  const filteredData = activeData.filter((item) => {
    if (!item.kana) return false;
    const query = search.toLowerCase();
    return (
      item.kana.includes(query) ||
      item.romaji.includes(query) ||
      item.sinhala.includes(query) ||
      item.row.toLowerCase().includes(query)
    );
  });

  const speak = (txt: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(txt);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#52796f] to-[#354f52] rounded-3xl p-6 text-white shadow-xs border border-[#44655f]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-black text-xl flex items-center gap-2">
              <Languages className="w-5 h-5 text-emerald-300 animate-pulse" />
              Japanese Alphabets (ජපන් හෝඩිය)
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              Hiragana is used for native words and grammatical markers. Katakana is used for foreign names, loanwords, and emphasis. Tap any letter to hear the native pronunciation!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15">
            <button
              onClick={() => { setSubTab("hiragana"); setSearch(""); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                subTab === "hiragana" ? "bg-white text-[#354f52]" : "text-white hover:bg-white/5"
              }`}
            >
              Hiragana (හිරගනා)
            </button>
            <button
              onClick={() => { setSubTab("katakana"); setSearch(""); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                subTab === "katakana" ? "bg-white text-[#354f52]" : "text-white hover:bg-white/5"
              }`}
            >
              Katakana (කටකනා)
            </button>
          </div>
        </div>
      </div>

      {/* Control Actions Panel */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-[#e9e2d7] p-4 rounded-3xl shadow-3xs">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search characters (e.g. 'a', 'ka', 'ක', 'hiragana')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border border-[#e9e2d7] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#52796f] text-slate-700"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {hoveredChar && hoveredChar.kana && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-[#f5f1ea] rounded-2xl border border-[#e2dacb] text-xs">
            <span className="text-slate-400 font-bold">Previewing:</span>
            <span className="font-black text-[#52796f] text-lg">{hoveredChar.kana}</span>
            <span className="font-semibold text-slate-600">Romaji: <strong className="text-slate-900">{hoveredChar.romaji}</strong></span>
            <span className="font-semibold text-slate-600">Sinhala: <strong className="text-slate-900">{hoveredChar.sinhala}</strong></span>
          </div>
        )}
      </div>

      {/* Grid view */}
      {search ? (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 px-1">
            Found {filteredData.length} matching character{filteredData.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3.5">
            {filteredData.map((item, idx) => (
              <motion.button
                key={`${item.kana}-${idx}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  speak(item.kana);
                  setHoveredChar(item);
                }}
                className="bg-white border border-[#e9e2d7] hover:border-[#52796f] rounded-2xl p-4.5 flex flex-col items-center justify-between text-center gap-1.5 shadow-3xs cursor-pointer transition group"
              >
                <span className="text-3xl font-black text-slate-800 select-none group-hover:text-[#52796f] transition" id={`character-${item.kana}`}>
                  {item.kana}
                </span>
                <div className="flex items-center gap-1 justify-center">
                  <span className="text-[10px] font-black tracking-wider text-slate-600 uppercase">
                    {item.romaji}
                  </span>
                  <Volume2 className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#52796f] transition" />
                </div>
                <span className="text-[10px] font-bold text-[#52796f] bg-[#52796f]/5 px-1.5 py-0.5 rounded-md leading-none">
                  {item.sinhala}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Traditional Column / Row Chart Layout */
        <div className="bg-white border border-[#e9e2d7] rounded-3xl p-4 sm:p-6 overflow-x-auto shadow-sm">
          <div className="min-w-[640px] space-y-3">
            {/* Header Columns: A I U E O */}
            <div className="grid grid-cols-11 items-center gap-3 font-display font-black text-slate-400 text-[10px] uppercase tracking-widest border-b border-[#f0ede6] pb-3 text-center">
              <div className="text-left pl-3 text-[#52796f]">Row (පේළිය)</div>
              <div>A (අ / a)</div>
              <div>I (ඉ / i)</div>
              <div>U (උ / u)</div>
              <div>E (එ / e)</div>
              <div>O (ඔ / o)</div>
              <div className="col-span-5 text-right pr-3 text-[#52796f]/80">Tap row to hear row sequence</div>
            </div>

            {/* Rows Mapping */}
            {((): React.ReactNode => {
              const rows = Array.from(new Set(activeData.map((d) => d.row)));
              return (
                <div className="space-y-3.5 pt-2">
                  {rows.map((rowName) => {
                    const rowItems = activeData.filter((i) => i.row === rowName);
                    // Standard rows have up to 5 elements mapped in a, i, u, e, o sequence
                    const order = ["a", "i", "u", "e", "o"];
                    
                    return (
                      <div
                         key={rowName}
                        className="grid grid-cols-11 items-center gap-3 text-center group/row py-1 rounded-2xl hover:bg-slate-50/50"
                      >
                        {/* Row Identifier */}
                        <div
                          onClick={() => {
                            // Find all characters with actual content and read them one by one
                            const speakSeq = rowItems.filter(r => r.kana).map(r => r.kana);
                            if (speakSeq.length) {
                              speak(speakSeq.join(", "));
                            }
                          }}
                          className="text-left font-display font-bold text-xs text-[#354f52] cursor-pointer pl-3 hover:underline flex items-center gap-1.5 select-none"
                        >
                          <BookOpen className="w-3 h-3 text-[#52796f]/60" />
                          {rowName.replace("-row", "")}
                        </div>

                        {/* 5 sound Column Slots */}
                        {order.map((colChar) => {
                          const item = rowItems.find((i) => i.col === colChar);
                          if (!item || !item.kana) {
                            return <div key={`${rowName}-${colChar}`} className="bg-[#ece2d0]/20 rounded-2xl h-16 border border-transparent" />;
                          }

                          return (
                            <motion.button
                              key={`${rowName}-${colChar}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onMouseEnter={() => setHoveredChar(item)}
                              onClick={() => speak(item.kana)}
                              className="bg-white border border-[#e9e2d7] hover:border-[#52796f] rounded-2xl p-2 py-2.5 flex flex-col items-center justify-between text-center gap-1 shadow-3xs hover:shadow-2xs transition cursor-pointer select-none group"
                            >
                              <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-[#52796f] transition">
                                {item.kana}
                              </span>
                              <div className="flex items-center gap-0.5 justify-center leading-none">
                                <span className="text-[9px] font-extrabold text-slate-500 uppercase">
                                  {item.romaji}
                                </span>
                                <Volume2 className="w-2 h-2 text-slate-300 group-hover:text-[#52796f] transition" />
                              </div>
                              <span className="text-[9px] font-bold text-[#52796f] font-mono mt-0.5 leading-none">
                                  {item.sinhala}
                              </span>
                            </motion.button>
                          );
                        })}

                        {/* Extra filler columns */}
                        <div className="col-span-5 flex items-center justify-end pr-3">
                          <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover/row:opacity-100 transition whitespace-nowrap">
                            👉 Tap row title to hear sequencing (පේළියේ ශබ්දය)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Guide Card below */}
      <div className="bg-[#fcfaf7] p-5 rounded-3xl border border-[#ece4d5] flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="font-display font-black text-xs text-[#354f52] uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-start">
            <Stars className="w-4 h-4 text-emerald-500" /> Memorization Strategy (පහසුවෙන් මතක තබා ගමු)
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            We recommend breaking your studies into Gojūon rows. Spend 10 minutes speaking each character out loud, tracing them with your finger while using the Native speaker synthesis feedback inside the <strong>JFT Course Deck</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const items = activeData.filter((i) => i.kana);
              const randomItem = items[Math.floor(Math.random() * items.length)];
              speak(randomItem.kana);
              setHoveredChar(randomItem);
            }}
            className="px-5 py-2.5 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-black shadow-3xs hover:shadow-2xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Play Random Sound (අහඹු ශබ්දය)
          </button>
        </div>
      </div>
    </div>
  );
}
