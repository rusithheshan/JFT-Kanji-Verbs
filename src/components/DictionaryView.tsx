import { useState, useMemo } from "react";
import { Search, Globe2, BookOpen, Volume2, Sparkles, HelpCircle, Check, BookMarked, Info } from "lucide-react";
import { DictionaryEntry } from "../types";
import { PRELOADED_DICTIONARY } from "../data/preloadedDictionary";

export default function DictionaryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Soft pronunciation helper using Web Speech Synthesis
  const handleTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSinhala = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[!?,.()/'"•]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "si-LK"; // soft fallback or use default
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Perform multi-dimensional search across hiragana, romaji, kanji, english, sinhala meanings & search keywords
  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return PRELOADED_DICTIONARY;

    return PRELOADED_DICTIONARY.filter((item) => {
      // 1. Direct checks
      const matchesRomaji = item.romaji.toLowerCase().includes(query);
      const matchesKanji = item.kanji.toLowerCase().includes(query);
      const matchesHiragana = item.hiragana.toLowerCase().includes(query);
      const matchesEnglish = item.englishMeaning.toLowerCase().includes(query);
      const matchesSinhala = item.sinhalaMeaning.toLowerCase().includes(query);
      
      // 2. Extra keywords/Singlish matches
      const matchesKeywords = item.searchKeywords?.some((kw) => kw.toLowerCase().includes(query));

      return (
        matchesRomaji ||
        matchesKanji ||
        matchesHiragana ||
        matchesEnglish ||
        matchesSinhala ||
        matchesKeywords
      );
    });
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Title & Banner Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 border-dashed border-[#e9e2d7] gap-4">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-teal-50 text-teal-750 uppercase tracking-wider border border-teal-100">
            <BookMarked className="w-3.5 h-3.5 text-teal-600" /> Interactive JFT Dictionary • ජපන් ශබ්දකෝෂය
          </span>
          <h2 className="text-3xl font-black text-slate-800 font-display tracking-tight">
            Irodori Book Vocabulary Dictionary
          </h2>
          <p className="text-sm text-slate-500 font-semibold">
            Search 1000+ vital Japanese daily words using Kanji, Hiragana, Romaji, English, Sinhala, or phonetics instantly!
          </p>
        </div>
      </div>

      {/* Advanced Unified Multi-language Search Bar */}
      <div className="bg-white p-5 rounded-[28px] border border-[#e9e2d7] shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="සොයන්න: Type anything (e.g. 'arigatou', 'ස්තූතියි', 'greetings', '挨拶', 'あめ', 'vassa'...)"
            className="w-full text-sm rounded-2xl border border-[#e9e2d7] pl-12 pr-4 py-3.5 bg-[#fdfbf7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600/10 focus:border-teal-600 font-semibold"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">🇯🇵 Kanji / Hiragana</span>
          <span className="bg-teal-5s px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100/50">🇬🇧 English Translation</span>
          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-100">🇱🇰 සිංහල අර්ථය</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">🔡 Singlish Phonetics</span>
        </div>
      </div>

      {/* Dictionary Grid List Grid layout */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#e9e2d7] rounded-3xl p-5 hover:shadow-md hover:border-teal-500/30 transition-all duration-200 flex flex-col justify-between h-[250px] relative overflow-hidden group"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/3 rounded-full blur-2xl group-hover:bg-teal-500/6 transition-colors"></div>

              <div>
                {/* Header Row: Furigana and Rubies */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 block tracking-wide font-mono">
                      {item.romaji}
                    </span>
                    <ruby className="text-2xl font-black text-slate-800 tracking-wide font-display">
                      {item.kanji} <rt className="text-xs text-teal-600 font-bold tracking-normal py-0.5">{item.hiragana}</rt>
                    </ruby>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTTS(item.hiragana)}
                      className="p-2 text-slate-400 hover:text-teal-600 bg-slate-50 hover:bg-teal-100/30 rounded-xl transition duration-150 cursor-pointer"
                      title="🇯🇵 Hear Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyClipboard(item.kanji, item.id)}
                      className="px-2.5 py-1.5 text-[10px] text-slate-400 hover:text-teal-600 bg-slate-50 hover:bg-teal-100/30 font-bold rounded-xl transition duration-150 cursor-pointer inline-flex items-center gap-1"
                      title="Copy Kanji Word"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Kunyomi & Onyomi details block */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-[11px] font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold block tracking-wider uppercase">ONYOMI (හඬපාලන):</span>
                    <span className="text-slate-700 font-mono">{item.onyomi}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold block tracking-wider uppercase">KUNYOMI (ද්විතීයික):</span>
                    <span className="text-slate-700 font-mono">{item.kunyomi}</span>
                  </div>
                </div>
              </div>

              {/* Meanings row */}
              <div className="space-y-1.5 mt-4 border-t border-dashed border-slate-100 pt-3">
                <div className="flex items-start gap-1.5 text-xs text-slate-600 font-bold leading-relaxed">
                  <span className="inline-flex shrink-0 w-5 h-5 rounded-md bg-amber-50 text-amber-800 text-[10px] uppercase font-black items-center justify-center border border-amber-100">සිං</span>
                  <span className="truncate" title={item.sinhalaMeaning}>{item.sinhalaMeaning}</span>
                  <button onClick={() => speakSinhala(item.sinhalaMeaning)} className="p-0.5 text-slate-300 hover:text-amber-600 self-center transition cursor-pointer">
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-slate-500 font-semibold leading-relaxed">
                  <span className="inline-flex shrink-0 w-5 h-5 rounded-md bg-teal-50 text-teal-800 text-[10px] uppercase font-black items-center justify-center border border-teal-100">ENG</span>
                  <span className="truncate" title={item.englishMeaning}>{item.englishMeaning}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
            <Globe2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-slate-700">ශබ්දකෝෂ සෙවුම් ප්‍රතිඵල හමු නොවුණි</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find any JFT-Basic words matching your input query. Please search using Kanji, Romaji, English or Sinhala phrases!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
