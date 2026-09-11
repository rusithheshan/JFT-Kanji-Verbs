import React, { useState, useMemo, useEffect } from "react";
import {
  Wheat,
  BookOpen,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  FileText,
  Filter,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookMarked,
  Printer,
  Compass,
  Lightbulb,
  Droplets,
  Scissors,
  Check,
  RotateCcw,
  Utensils,
  HeartPulse,
  Factory,
  HardHat,
  Building,
  Info
} from "lucide-react";
import { sswSectors, SSWSector } from "../data/skillTestSectors";
import {
  agricultureCropChapters,
  agricultureCropGlossary,
  CropChapter,
  GlossaryTerm
} from "../data/agricultureCropData";
import {
  agriJapaneseNouns,
  agriJapaneseVerbs,
  agriJapaneseAdjectives,
  agriJapaneseQuestionsAndManners,
  agriJapaneseGreetings,
  JapaneseVocabItem,
  JapaneseVerbItem,
  JapaneseAdjItem
} from "../data/agricultureJapaneseData";

const renderSectorIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case "Wheat":
      return <Wheat className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "HeartPulse":
      return <HeartPulse className={className} />;
    case "Factory":
      return <Factory className={className} />;
    case "HardHat":
      return <HardHat className={className} />;
    case "Building":
      return <Building className={className} />;
    default:
      return <Compass className={className} />;
  }
};

export function SkillTestsView() {
  // Main sector selection: null means Main Hub (All Sectors Directory), or specific sector ID (Dedicated Sector Workspace)
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  // Agriculture view sub-mode (Level 2: Sub-tabs inside Agriculture):
  // "crop_book" = Book 1: General Crop Farming
  // "japanese_book" = Book 2: Agriculture Japanese
  // "glossary" = Searchable Agricultural Terms
  // "practice_quiz" = Exam Simulator & Quizzes
  // "flashcards" = Memorization Cards Game
  // "exam_guide" = Syllabus & Exam Format Guide
  const [agriStudyMode, setAgriStudyMode] = useState<
    "crop_book" | "japanese_book" | "glossary" | "practice_quiz" | "flashcards" | "exam_guide"
  >("crop_book");

  // Crop Book active chapter
  const [activeChapterId, setActiveChapterId] = useState<string>(agricultureCropChapters[0].id);
  const [cropSearchQuery, setCropSearchQuery] = useState<string>("");

  // Japanese Book filter & search
  const [japaneseCategory, setJapaneseCategory] = useState<"all" | "nouns" | "verbs" | "adjectives" | "manners">("all");
  const [japaneseSearchQuery, setJapaneseSearchQuery] = useState<string>("");

  // Glossary filter
  const [glossaryCategory, setGlossaryCategory] = useState<string>("all");
  const [glossarySearch, setGlossarySearch] = useState<string>("");

  // Flashcards state with filters and OK / Not Yet persistence
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);
  const [flashcardFilter, setFlashcardFilter] = useState<"ALL" | "NOT_YET" | "OK">("ALL");

  // Flashcards learning progress (OK / NOT_YET) with localStorage persistence
  const [flashcardStatus, setFlashcardStatus] = useState<{ [id: string]: "OK" | "NOT_YET" }>(() => {
    try {
      const saved = localStorage.getItem("ssw_agri_flashcards_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleSetFlashcardStatus = (id: string, status: "OK" | "NOT_YET") => {
    setFlashcardStatus((prev) => {
      const next = { ...prev, [id]: status };
      try {
        localStorage.setItem("ssw_agri_flashcards_status", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleResetFlashcards = () => {
    if (window.confirm("ඔබට සියලු Flashcards ප්‍රගතිය නැවත මුල සිට සැකසීමට අවශ්‍යද?")) {
      setFlashcardStatus({});
      try {
        localStorage.removeItem("ssw_agri_flashcards_status");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Quiz State
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizViewType, setQuizViewType] = useState<"single" | "all">("single");

  // UI simplification toggles
  // Audio speech synthesis helper
  const playJapaneseAudio = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Selected Sector details
  const activeSector = useMemo(
    () => sswSectors.find((s) => s.id === selectedSectorId) || sswSectors[0],
    [selectedSectorId]
  );

  // Expanded crop chapters (in-place accordion)
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>([
    agricultureCropChapters[0].id,
  ]);

  // Learned chapters with localStorage persistence
  const [learnedChapterIds, setLearnedChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ssw_agri_learned_chapters");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleLearnedChapter = (chapId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setLearnedChapterIds((prev) => {
      const updated = prev.includes(chapId)
        ? prev.filter((id) => id !== chapId)
        : [...prev, chapId];
      try {
        localStorage.setItem("ssw_agri_learned_chapters", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const toggleExpandChapter = (chapId: string) => {
    setExpandedChapterIds((prev) =>
      prev.includes(chapId) ? prev.filter((id) => id !== chapId) : [...prev, chapId]
    );
  };

  const expandAllChapters = () => {
    setExpandedChapterIds(agricultureCropChapters.map((c) => c.id));
  };

  const collapseAllChapters = () => {
    setExpandedChapterIds([]);
  };

  // Filtered glossary
  const filteredGlossary = useMemo(() => {
    return agricultureCropGlossary.filter((g) => {
      const matchCat = glossaryCategory === "all" || g.category === glossaryCategory;
      const q = glossarySearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.termSi.toLowerCase().includes(q) ||
        g.termJp.toLowerCase().includes(q) ||
        (g.romaji && g.romaji.toLowerCase().includes(q)) ||
        g.definitionSi.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [glossaryCategory, glossarySearch]);

  // Download printable / saved HTML handbook for the textbooks
  const handleDownloadHandbook = (bookNumber: 1 | 2) => {
    let title = "";
    let contentHtml = "";

    if (bookNumber === 1) {
      title = "1_General_Crop_Farming_Sinhala_Textbook.html";
      contentHtml = `
<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>කෘෂිකාර්මික කුසලතා ඇගයීම් පරීක්ෂණය - පෙළපොත සාමාන්‍ය වගා කෘෂිකර්මය</title>
  <style>
    body { font-family: sans-serif; line-height: 1.7; padding: 30px; color: #1f2937; max-width: 900px; margin: auto; }
    h1 { color: #2d6a4f; border-bottom: 2px solid #52b788; padding-bottom: 10px; }
    h2 { color: #1b4332; margin-top: 30px; border-left: 4px solid #52b788; padding-left: 10px; }
    h3 { color: #40916c; }
    .box { background: #f4fbf7; border: 1px solid #b7e4c7; padding: 15px; border-radius: 8px; margin: 15px 0; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1>農業技能測定試験 テキスト 耕種農業全般</h1>
  <h2>කෘෂිකාර්මික කුසලතා ඇගයීම් පරීක්ෂණය - සාමාන්‍ය වගා කෘෂිකර්මය (සිංහල පිටපත)</h2>
  <p><strong>ප්‍රකාශනය:</strong> ජාතික කෘෂිකර්ම මණ්ඩලය (National Chamber of Agriculture, Japan)</p>
  <hr/>
  ${agricultureCropChapters
    .map(
      (c) => `
    <h2>${c.titleSi} (${c.titleJp})</h2>
    <p><em>${c.overviewSi}</em></p>
    ${c.subsections
      .map(
        (sub) => `
      <div class="box">
        <h3>${sub.subNumber} ${sub.titleSi}</h3>
        <p>${sub.summarySi}</p>
        <ul>
          ${sub.details.map((d) => `<li>${d}</li>`).join("")}
        </ul>
        ${sub.calculation ? `<p><strong>ගණනය කිරීම:</strong><br>${sub.calculation.question}<br><em>${sub.calculation.formula}</em><br>${sub.calculation.solution.replace(/\n/g, "<br>")}</p>` : ""}
      </div>
    `
      )
      .join("")}
  `
    )
    .join("")}
  <hr/>
  <h2>කෘෂි කාර්යන්හි භාවිත වචන මාලාව</h2>
  <ul>
    ${agricultureCropGlossary
      .map(
        (g) => `
      <li><strong>${g.termSi}</strong> (${g.termJp} - ${g.romaji}): ${g.definitionSi}</li>
    `
      )
      .join("")}
  </ul>
</body>
</html>
      `;
    } else {
      title = "2_Agriculture_Japanese_Language_Sinhala_Textbook.html";
      contentHtml = `
<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <title>කෘෂිකාර්මික ජපන් භාෂා පෙළපොත - にほんご</title>
  <style>
    body { font-family: sans-serif; line-height: 1.7; padding: 30px; color: #1f2937; max-width: 900px; margin: auto; }
    h1 { color: #b08968; border-bottom: 2px solid #ddb892; padding-bottom: 10px; }
    h2 { color: #7f5539; margin-top: 30px; border-left: 4px solid #ddb892; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e6ccb2; padding: 10px; text-align: left; }
    th { background: #ede0d4; }
  </style>
</head>
<body>
  <h1>農業技能測定試験 日本語テキスト にほんご</h1>
  <h2>කෘෂිකාර්මික කුසලතා ඇගයීම් පරීක්ෂණය - ජපන් භාෂා පෙළපොත (සිංහල සංස්කරණය)</h2>
  <hr/>
  <h2>1. කෘෂිකාර්මික නාමපද (Agricultural Nouns)</h2>
  <table>
    <tr><th>ජපන්</th><th>රෝමාජි</th><th>සිංහල අර්ථය</th><th>උදාහරණ වාක්‍යය</th></tr>
    ${agriJapaneseNouns
      .map(
        (n) => `
      <tr>
        <td><strong>${n.wordJp}</strong> ${n.kanji ? `(${n.kanji})` : ""}</td>
        <td>${n.romaji}</td>
        <td>${n.meaningSi}</td>
        <td>${n.exampleSentenceJp || ""} <br><small>${n.exampleSentenceSi || ""}</small></td>
      </tr>
    `
      )
      .join("")}
  </table>

  <h2>2. කෘෂිකාර්මික ක්‍රියාපද (Workplace Verbs)</h2>
  <table>
    <tr><th>මසු ආකෘතිය</th><th>මූලික රූපය</th><th>කණ්ඩායම</th><th>සිංහල</th><th>~てください (කරන්න)</th><th>උදාහරණය</th></tr>
    ${agriJapaneseVerbs
      .map(
        (v) => `
      <tr>
        <td><strong>${v.masuForm}</strong></td>
        <td>${v.dictForm}</td>
        <td>${v.group}</td>
        <td>${v.meaningSi}</td>
        <td>${v.teForm} (${v.teKudasaiSi})</td>
        <td>${v.exampleJp}<br><small>${v.exampleSi}</small></td>
      </tr>
    `
      )
      .join("")}
  </table>

  <h2>3. ප්‍රශ්න කිරීම් සහ ආචාර සමාචාර (Questions & Greetings)</h2>
  <ul>
    ${agriJapaneseGreetings
      .map(
        (g) => `
      <li><strong>${g.jp}</strong> (${g.romaji}): ${g.si}</li>
    `
      )
      .join("")}
  </ul>
</body>
</html>
      `;
    }

    const blob = new Blob([contentHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Flashcards collection
  const flashcardDeck = useMemo(() => {
    return [
      ...agriJapaneseNouns.map((n) => ({
        id: `noun_${n.id}`,
        promptJp: n.wordJp + (n.kanji ? ` (${n.kanji})` : ""),
        promptRomaji: n.romaji,
        speakText: n.wordJp,
        answerSi: n.meaningSi,
        category: "මෙවලම් & පරිශ්‍ර (Tools & Places)",
        exampleJp: n.exampleSentenceJp,
        exampleSi: n.exampleSentenceSi
      })),
      ...agriJapaneseVerbs.map((v) => ({
        id: `verb_${v.id}`,
        promptJp: v.masuForm + " (" + v.dictForm + ")",
        promptRomaji: v.romaji,
        speakText: v.dictForm,
        answerSi: v.meaningSi + " | විධානය: " + v.teForm + " (" + v.teKudasaiSi + ")",
        category: "ක්‍රියාපද සහ විධාන (Verbs & Commands)",
        exampleJp: v.exampleJp,
        exampleSi: v.exampleSi
      })),
      ...agricultureCropGlossary.map((g) => ({
        id: `glossary_${g.id}`,
        promptJp: g.termSi,
        promptRomaji: g.termJp + (g.romaji ? ` (${g.romaji})` : ""),
        speakText: g.termJp,
        answerSi: g.definitionSi,
        category: "කෘෂි දැනුම (Agri Concepts)",
        exampleJp: g.termJp,
        exampleSi: g.definitionSi
      }))
    ];
  }, []);

  const okCardsCount = useMemo(() => {
    return flashcardDeck.filter((c) => flashcardStatus[c.id] === "OK").length;
  }, [flashcardDeck, flashcardStatus]);

  const notYetCardsCount = useMemo(() => {
    return flashcardDeck.filter((c) => flashcardStatus[c.id] === "NOT_YET").length;
  }, [flashcardDeck, flashcardStatus]);

  const filteredFlashcardDeck = useMemo(() => {
    if (flashcardFilter === "OK") {
      return flashcardDeck.filter((c) => flashcardStatus[c.id] === "OK");
    }
    if (flashcardFilter === "NOT_YET") {
      return flashcardDeck.filter((c) => flashcardStatus[c.id] === "NOT_YET");
    }
    return flashcardDeck;
  }, [flashcardDeck, flashcardFilter, flashcardStatus]);

  const currentFlashcard = filteredFlashcardDeck[flashcardIndex] || filteredFlashcardDeck[0] || flashcardDeck[0];

  const handleShuffleDeck = () => {
    setIsFlashcardFlipped(false);
    if (filteredFlashcardDeck.length > 1) {
      const randomIdx = Math.floor(Math.random() * filteredFlashcardDeck.length);
      setFlashcardIndex(randomIdx);
    }
  };

  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlashcardFlipped(false);
  }, [flashcardFilter]);

  // All review questions aggregated for the practice exam simulator
  const allExamQuestions = useMemo(() => {
    const questions: { question: string; options: string[]; correctIndex: number; explanation: string; topic: string }[] = [];
    agricultureCropChapters.forEach((chap) => {
      if (chap.reviewQuestions) {
        chap.reviewQuestions.forEach((q) => {
          questions.push({ ...q, topic: chap.titleSi });
        });
      }
    });

    // Add extra high-yield exam questions from the textbook
    questions.push(
      {
        question: "පොහොර මල්ලක '10-8-8' ලෙස සටහන් කර ඇති විට, 20kg මල්ලක අඩංගු නයිට්‍රජන් (N) බර කොපමණද?",
        options: ["1.6 kg", "2.0 kg", "10 kg", "8.0 kg"],
        correctIndex: 1,
        explanation: "නයිට්‍රජන් = 20kg × 10/100 = 2.0kg වේ. පොස්පරික් අම්ලය සහ පොටෑසියම් 20kg × 8/100 = 1.6kg බැගින් වේ.",
        topic: "පොහොර ගණනය"
      },
      {
        question: "1,000 ගුණයකින් තනුක කළ යුතු පළිබෝධනාශකයක් ලීටර් 10 ක ටැංකියකට දැමිය යුතු ඖෂධ ප්‍රමාණය කොපමණද?",
        options: ["1 mL", "10 mL", "100 mL", "1,000 mL"],
        correctIndex: 1,
        explanation: "ලීටර් 1 ක් (1,000 mL) සඳහා 1 mL අවශ්‍ය වන බැවින්, ලීටර් 10 ක් (10,000 mL) සඳහා 10 mL අවශ්‍ය වේ.",
        topic: "පළිබෝධනාශක තනුක කිරීම"
      },
      {
        question: "වී බීජ පොඟවීම (浸種 / Shinshu) සඳහා නිර්දේශිත උෂ්ණත්වය සහ කාලය කුමක්ද?",
        options: [
          "දින 2 ක් 30°C ජලයේ",
          "දින 7 සිට 10 දක්වා 10 සිට 15°C ජලයේ (සමුච්චිත උෂ්ණත්වය 100°C)",
          "දින 20 ක් 5°C ජලයේ",
          "පැය 24 ක් උතුරන ජලයේ"
        ],
        correctIndex: 1,
        explanation: "පෙළපොතේ 39 වන පිටුවට අනුව දින 7 සිට 10 දක්වා 10-15°C ජලයේ තැබිය යුතු අතර නිර්දේශිත සමුච්චිත උෂ්ණත්වය 100°C වේ.",
        topic: "වී වගාව"
      },
      {
        question: "ජපානයේ බහුලවම වගා කරන කළු පැහැති ගිනිකඳු අළු සහ හියුමස් බහුල පස හඳුන්වන්නේ කෙසේද?",
        options: ["Glay soil (ග්ලෙයි පස)", "Kuroboku soil (කුරොබොකු කළු පස)", "Brown lowland soil", "Sandy loam"],
        correctIndex: 1,
        explanation: "කුරොබොකු (Kuroboku) පස ජපානයේ ක්ෂේත්‍ර වලින් අඩක් පමණ ආවරණය කරන ගිනිකඳු අළු සහිත කළු පාංශු ස්ථරයකි.",
        topic: "පස් වර්ග"
      },
      {
        question: "ට්‍රැක්ටරයකට නැගීම සහ බැසීම සිදු කළ යුත්තේ කවර පැත්තෙන්ද?",
        options: ["දකුණු පැත්තෙන්", "වම් පැත්තෙන්", "පසුපසින්", "ඕනෑම පැත්තකින්"],
        correctIndex: 1,
        explanation: "පෙළපොතේ 30 වන පිටුවට අනුව ආරක්ෂිත ක්‍රමය වන්නේ ට්‍රැක්ටරයට නැගීම සහ බැසීම සැමවිටම වම් පැත්තෙන් සිදු කිරීමයි.",
        topic: "ආරක්ෂාව සහ සෞඛ්‍යය"
      },
      {
        question: "ශාකයක කඳේ හෝ වැලේ ඉහළම දල්ල කපා දැමීමේ ක්‍රියාවලිය (Pinching / Topping) හඳුන්වන්නේ කුමන නමකින්ද?",
        options: ["මුදුන් දළු කැපීම (摘心 - Tekishin)", "අන්තර් වියලනය (中干し)", "පෝරු ගෑම (代かき)", "වසුන් යෙදීම (マルチング)"],
        correctIndex: 0,
        explanation: "මුදුන් දළු කැපීම (Tekishin) මගින් පත්‍ර සහ ගෙඩි වෙත පෝෂ්‍ය පදාර්ථ බෙදාහැරීම ක්‍රමවත් වේ.",
        topic: "කප්පාදුව"
      },
      {
        question: "පළිබෝධනාශක ඉසින විට සුළඟ හමන දිශාවට අනුව ගමන් කළ යුත්තේ කෙසේද?",
        options: [
          "සුළඟ හමන දෙසට ඉදිරියට ගමන් කරමින්",
          "සුළඟට එරෙහිව පසුපසට ගමන් කරමින්",
          "සුළඟ නොබලා ඉදිරියට පමණක්",
          "සුළං පාර දිගේ දුවමින්"
        ],
        correctIndex: 1,
        explanation: "රසායනික ද්‍රව්‍ය කෙලින්ම ශරීරයට වැටීමෙන් වැළකීමට සුළඟට එරෙහිව පසුපසට ගමන් කරමින් ඉසිය යුතුය.",
        topic: "ආරක්ෂාව"
      }
    );
    return questions;
  }, []);

  return (
    <div className="space-y-4">
      {/* Primary Header: Skill Test Fields (SSW 特定技能) */}
      <div className="bg-white border border-[#e9dfcc] p-4 sm:p-5 rounded-2xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-700" /> TOKUTEI GINOU (SSW)
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              ශ්‍රී ලංකා Prometric විභාග මට්ටම
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#2d6a4f] tracking-tight">
            ජපන් නිපුණතා විභාග ක්ෂේත්‍ර (Skill Test Fields)
          </h1>
          <p className="text-xs text-slate-600 font-medium line-clamp-1 sm:line-clamp-none">
            ශ්‍රී ලංකාවේ පවත්වනු ලබන ජපන් රැකියා නිපුණතා ක්ෂේත්‍ර සහ සම්පූර්ණ අධ්‍යයන සම්පත්
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          <a
            href="https://www.prometric-jp.com/en/ssw/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-[#f4eee6] hover:bg-[#ebdcc7] text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Prometric Japan SSW Official Portal"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span>Prometric SSW Portal</span>
          </a>
        </div>
      </div>

      {/* LEVEL 1: MAIN TOPIC - SKILL TEST FIELDS DIRECTORY (When no sector is selected) */}
      {!selectedSectorId && (
        <div className="space-y-5">
          <div className="bg-white border border-[#e9dfcc] p-5 sm:p-6 rounded-3xl shadow-3xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9dfcc] pb-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black text-[#354f52] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#2d6a4f]" />
                  ප්‍රධාන නිපුණතා විභාග ක්ෂේත්‍ර (Main Skill Test Fields)
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  අධ්‍යයනය කිරීමට අවශ්‍ය ක්ෂේත්‍රය තෝරා එහි විශේෂිත අධ්‍යයන අංශය (Dedicated Study Portal) වෙත පිවිසෙන්න:
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-[#2d6a4f] rounded-xl text-xs font-black border border-emerald-200 self-start sm:self-center shrink-0">
                ක්ෂේත්‍ර {sswSectors.length} ක් සක්‍රීයයි
              </span>
            </div>

            {/* Grid of 6 Main Sectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {sswSectors.map((sector) => {
                const isAgri = sector.id === "agriculture";
                return (
                  <div
                    key={sector.id}
                    className="bg-[#fcfaf7] border border-[#e9dfcc] hover:border-[#2d6a4f]/50 p-5 rounded-3xl transition-all duration-200 shadow-3xs flex flex-col justify-between space-y-4 group hover:shadow-sm"
                  >
                    <div className="space-y-3">
                      {/* Top icon and badges */}
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-emerald-100 text-[#2d6a4f] rounded-2xl group-hover:scale-105 transition-transform">
                          {renderSectorIcon(sector.icon, "w-6 h-6")}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {isAgri && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-black">
                              🌾 පෙළපොත් 2ක්
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black">
                            {sector.status === "available_in_sl" ? "SL CBT විභාග ඇත" : "විස්තර"}
                          </span>
                        </div>
                      </div>

                      {/* Titles */}
                      <div>
                        <h3 className="font-black text-base text-[#2d6a4f] group-hover:text-[#1b4332] transition-colors">
                          {sector.titleSi}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 font-bold mt-0.5">
                          {sector.titleJp} ({sector.titleEn})
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                        {sector.descriptionSi}
                      </p>

                      {/* Subcategories or Key Topics Preview */}
                      <div className="space-y-1.5 pt-1 border-t border-[#e9dfcc]/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          ප්‍රධාන විෂය කරුණු:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sector.keyTopics.slice(0, 3).map((topic, tidx) => (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 bg-white border border-[#e9dfcc] text-slate-600 rounded-md text-[10px] font-medium line-clamp-1"
                            >
                              • {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSectorId(sector.id)}
                        className="flex-1 py-2.5 px-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <span>අධ්‍යයන අංශය වෙත පිවිසෙන්න</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {sector.officialUrl && (
                        <a
                          href={sector.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-white hover:bg-slate-100 border border-[#e9dfcc] text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                          title={sector.officialUrlLabel || "නිල වෙබ් අඩවිය (Official Portal)"}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#2d6a4f]" />
                          <span className="text-[11px] font-bold hidden sm:inline">නිල අඩවිය</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: DEDICATED SECTOR PORTAL (When a sector is selected) */}
      {selectedSectorId && (
        <div className="space-y-4">
          {/* Top Breadcrumb & Navigation Bar */}
          <div className="bg-[#fcfaf7] p-3 sm:p-4 rounded-2xl border border-[#e9dfcc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedSectorId(null)}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-[#e9dfcc] text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-3xs cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#2d6a4f]" />
                <span>← සියලු විභාග ක්ෂේත්‍ර (All Skill Tests)</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-[#2d6a4f] rounded-xl shrink-0">
                  {renderSectorIcon(activeSector.icon, "w-4 h-4")}
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-[#2d6a4f] line-clamp-1">
                    {activeSector.titleSi}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400 font-bold">
                    {activeSector.titleJp} ({activeSector.titleEn})
                  </p>
                </div>
              </div>
            </div>

            {/* External Links & Sector Switcher */}
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
              {/* Quick switch sector dropdown */}
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(e.target.value)}
                aria-label="වෙනත් ක්ෂේත්‍රයකට මාරුවන්න"
                className="px-2.5 py-1.5 bg-white border border-[#e9dfcc] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
              >
                {sswSectors.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.titleSi}
                  </option>
                ))}
              </select>

              {activeSector.officialUrl && (
                <a
                  href={activeSector.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#2d6a4f] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  title={activeSector.officialUrlLabel || "නිල වෙබ් අඩවිය"}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{activeSector.officialUrlLabel || "නිල අඩවිය"}</span>
                </a>
              )}

              <a
                href={activeSector.prometricUrl || "https://www.prometric-jp.com/en/ssw/"}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#f4eee6] hover:bg-[#ebdcc7] text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Prometric CBT විභාග ලියාපදිංචි අඩවිය"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Prometric CBT</span>
              </a>
            </div>
          </div>

      {/* LEVEL 2: SECTOR SUB-TABS (When Agriculture is Selected) */}
      {selectedSectorId === "agriculture" && (
        <div className="space-y-4">
          {/* Clear Sub-tabs Navigation for Agriculture */}
          <div className="bg-[#fcfaf7] p-1.5 rounded-2xl border border-[#e9dfcc] shadow-3xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setAgriStudyMode("crop_book")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "crop_book"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>සාමාන්‍ය වගාව (Book 1)</span>
            </button>

            <button
              type="button"
              onClick={() => setAgriStudyMode("japanese_book")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "japanese_book"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>කෘෂි ජපන් (Book 2)</span>
            </button>

            <button
              type="button"
              onClick={() => setAgriStudyMode("practice_quiz")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "practice_quiz"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>පෙරහුරු විභාගය (Quiz)</span>
            </button>

            <button
              type="button"
              onClick={() => setAgriStudyMode("glossary")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "glossary"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>වචනකෝෂය (Glossary)</span>
            </button>

            <button
              type="button"
              onClick={() => setAgriStudyMode("flashcards")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "flashcards"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>

            <button
              type="button"
              onClick={() => setAgriStudyMode("exam_guide")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                agriStudyMode === "exam_guide"
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "text-[#354f52] hover:bg-white hover:text-[#2d6a4f]"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>විභාග මාර්ගෝපදේශය (Guide)</span>
            </button>
          </div>

          {/* MODE 1: BOOK 1 - GENERAL CROP FARMING */}
          {agriStudyMode === "crop_book" && (
            <div className="space-y-6">
              {/* Top Overview & Learned Progress Bar */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e9dfcc] shadow-3xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <h3 className="text-base sm:text-lg font-black text-[#2d6a4f]">
                        සාමාන්‍ය වගා කෘෂිකර්මය - පෙළපොත (8 Chapters + හැඳින්වීම)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      ඕනෑම පරිච්ඡේදයක් මත ක්ලික් කරන්න — එය එතැනම පහලට extend වී සම්පූර්ණ පාඩම විවෘත වේ.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleDownloadHandbook(1)}
                      className="px-3.5 py-1.5 bg-[#2d6a4f] text-white hover:bg-[#1b4332] rounded-xl text-xs font-bold shadow-3xs flex items-center gap-1.5 transition cursor-pointer"
                      title="පෙළපොත 1 (සාමාන්‍ය වගාව) සම්පූර්ණ PDF සටහන බාගත කරන්න"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>පෙළපොත 1 බාගත (PDF - පිටු 102)</span>
                    </button>
                    <button
                      type="button"
                      onClick={expandAllChapters}
                      className="px-3 py-1.5 bg-[#f0ede6] hover:bg-[#e4decb] text-[#354f52] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      සියල්ල දිගහරින්න
                    </button>
                    <button
                      type="button"
                      onClick={collapseAllChapters}
                      className="px-3 py-1.5 bg-white border border-[#e9dfcc] hover:bg-[#faf7f2] text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      සියල්ල හකුලන්න
                    </button>
                  </div>
                </div>

                {/* Progress Bar for Learned Chapters */}
                <div className="bg-[#faf8f5] p-3.5 sm:p-4 rounded-2xl border border-[#e9dfcc] space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-[#2d6a4f] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ඉගෙනුම් ප්‍රගතිය (Study Progress)
                    </span>
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono text-[11px]">
                      {learnedChapterIds.length} / {agricultureCropChapters.length} Chapters ඉගෙන ගෙන අවසන් ({Math.round((learnedChapterIds.length / agricultureCropChapters.length) * 100)}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${(learnedChapterIds.length / agricultureCropChapters.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Vertical In-Place Expandable Chapters List */}
              <div className="space-y-4">
                {agricultureCropChapters.map((chap) => {
                  const isExpanded = expandedChapterIds.includes(chap.id);
                  const isLearned = learnedChapterIds.includes(chap.id);

                  return (
                    <div
                      key={chap.id}
                      className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? "bg-white border-[#2d6a4f] shadow-md ring-2 ring-[#2d6a4f]/15"
                          : isLearned
                          ? "bg-[#f5fbf7] border-emerald-300 shadow-3xs"
                          : "bg-white border-[#e9dfcc] hover:border-emerald-300 shadow-3xs"
                      }`}
                    >
                      {/* Chapter Card Header (Click to toggle in-place extension) */}
                      <div
                        onClick={() => toggleExpandChapter(chap.id)}
                        className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono ${
                              isLearned ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {chap.chapterNumber === 0 ? "හැඳින්වීම" : `Chapter ${chap.chapterNumber}`}
                            </span>

                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#f4efe6] text-slate-700">
                              {chap.badge}
                            </span>

                            {isLearned && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-3xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Learned ✓
                              </span>
                            )}

                            <span className="text-xs font-mono text-slate-400 ml-auto md:ml-0">
                              {chap.titleJp}
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-extrabold text-[#2d6a4f] leading-snug">
                            {chap.titleSi}
                          </h4>

                          {!isExpanded && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                              {chap.overviewSi}
                            </p>
                          )}
                        </div>

                        {/* Right Side Buttons: Learned Button & Expand/Collapse */}
                        <div className="shrink-0 flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                          {/* Learned Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleLearnedChapter(chap.id, e)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                              isLearned
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-3xs ring-2 ring-emerald-600/20"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                            title={isLearned ? "Learned ලෙස සලකුණු කර ඇත. වෙනස් කිරීමට ක්ලික් කරන්න" : "Learned ලෙස සලකුණු කරන්න"}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${isLearned ? "text-white" : "text-emerald-600"}`} />
                            <span>{isLearned ? "Learned ✓" : "Mark as Learned"}</span>
                          </button>

                          {/* Expand/Collapse Toggle Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandChapter(chap.id);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                              isExpanded
                                ? "bg-[#2d6a4f] text-white shadow-3xs"
                                : "bg-[#f0ede6] text-[#354f52] hover:bg-[#e4decb]"
                            }`}
                          >
                            <span>{isExpanded ? "හකුලන්න" : "කියවන්න"}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* IN-PLACE EXTENDED CONTENT (එතැනම පහලට දිගහැරෙන සම්පූර්ණ පාඩම) */}
                      {isExpanded && (
                        <div className="border-t border-[#e9dfcc] p-4 sm:p-6 md:p-7 bg-[#fdfcf9] space-y-6">
                          {/* Chapter Header Banner Inside Card */}
                          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e9dfcc] shadow-3xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                                  Chapter {chap.chapterNumber} - {chap.badge}
                                </span>
                                <span className="text-xs font-mono text-slate-400">
                                  {chap.titleJp}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => toggleLearnedChapter(chap.id, e)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                                  isLearned
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-3xs"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isLearned ? "ඉගෙන ගෙන අවසන් (Learned ✓)" : "Learned ලෙස සලකුණු කරන්න"}</span>
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-[#f9f7f2] p-4 rounded-xl border border-[#e9dfcc]">
                              {chap.overviewSi}
                            </p>
                          </div>

                          {/* Subsections List Inside This Chapter */}
                          <div className="space-y-4">
                            <div className="text-xs font-black text-[#2d6a4f] uppercase tracking-wider flex items-center gap-2 px-1">
                              <BookOpen className="w-4 h-4 text-emerald-600" />
                              <span>පාඩමේ අනුකොටස් ({chap.subsections.length} Subsections)</span>
                            </div>

                            {chap.subsections.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e9dfcc] shadow-3xs space-y-3 hover:border-emerald-300 transition-colors"
                              >
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                                    {sub.subNumber}
                                  </span>
                                  <h4 className="font-extrabold text-sm sm:text-base text-[#354f52]">
                                    {sub.titleSi}
                                  </h4>
                                  {sub.titleJp && (
                                    <span className="text-xs font-mono text-slate-400 ml-auto hidden sm:inline">
                                      {sub.titleJp}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs font-semibold text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                                  💡 {sub.summarySi}
                                </p>

                                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                                  {sub.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="flex items-start gap-2">
                                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Calculation Example if present */}
                                {sub.calculation && (
                                  <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs">
                                    <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                                      <Lightbulb className="w-4 h-4 text-amber-600" /> විභාගයේ නිතර අසන ගණනය කිරීම (Calculation Example)
                                    </span>
                                    <p className="font-bold text-slate-800">{sub.calculation.question}</p>
                                    <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 font-mono text-[11px] text-amber-950 whitespace-pre-line">
                                      <strong>සූත්‍රය:</strong> {sub.calculation.formula}
                                      {"\n\n"}
                                      <strong>විසඳුම:</strong>
                                      {"\n"}
                                      {sub.calculation.solution}
                                    </div>
                                  </div>
                                )}

                                {/* Practical Tip if present */}
                                {sub.practicalTip && (
                                  <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                                    <span>{sub.practicalTip}</span>
                                  </div>
                                )}

                                {/* Key Terms Pills */}
                                {sub.keyTerms && sub.keyTerms.length > 0 && (
                                  <div className="pt-2 flex flex-wrap gap-2">
                                    {sub.keyTerms.map((t, tIdx) => (
                                      <div key={tIdx} className="bg-[#f0ede6] px-3 py-1.5 rounded-xl text-[11px] space-x-1 border border-[#e9e2d7]">
                                        <span className="font-bold text-[#2d6a4f]">{t.termJp}</span>
                                        <span className="text-slate-500 font-medium">({t.termSi}):</span>
                                        <span className="text-slate-700">{t.explanation}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Chapter Review Questions if present */}
                          {chap.reviewQuestions && chap.reviewQuestions.length > 0 && (
                            <div className="bg-[#f4fbf7] p-5 sm:p-6 rounded-2xl border-2 border-emerald-200 space-y-4">
                              <h4 className="font-extrabold text-sm text-[#2d6a4f] flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                මෙම පරිච්ඡේදයේ දැනුම පරීක්ෂා කිරීම (Review Questions)
                              </h4>
                              <div className="space-y-4">
                                {chap.reviewQuestions.map((q, qIdx) => (
                                  <div key={qIdx} className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2 text-xs">
                                    <p className="font-bold text-slate-800 text-sm">{qIdx + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                      {q.options.map((opt, oIdx) => (
                                        <div
                                          key={oIdx}
                                          className={`p-2.5 rounded-xl border text-xs font-semibold ${
                                            oIdx === q.correctIndex
                                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                              : "bg-slate-50 border-slate-200 text-slate-600"
                                          }`}
                                        >
                                          {opt} {oIdx === q.correctIndex && "✓ (නිවැරදි පිළිතුර)"}
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 pt-1 italic">
                                      විස්තරය: {q.explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Chapter Bottom Bar */}
                          <div className="p-4 bg-white rounded-2xl border border-[#e9dfcc] flex flex-wrap items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={(e) => toggleLearnedChapter(chap.id, e)}
                              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                                isLearned
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-3xs"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isLearned ? "ඉගෙන ගෙන අවසන් (Learned ✓)" : "Learned ලෙස සලකුණු කරන්න"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleExpandChapter(chap.id)}
                              className="px-4 py-2 bg-[#f0ede6] hover:bg-[#e4decb] text-[#354f52] rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1"
                            >
                              <span>හකුලන්න (Collapse) ↑</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* MODE 2: BOOK 2 - AGRICULTURE JAPANESE LANGUAGE */}
          {agriStudyMode === "japanese_book" && (
            <div className="space-y-6">
              {/* Top Overview & Book 2 Download */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e9dfcc] shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <h3 className="text-base sm:text-lg font-black text-[#2d6a4f]">
                      කෘෂිකාර්මික ජපන් භාෂාව - පෙළපොත (Book 2: Agriculture Japanese)
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    ජපානයේ ගොවිපළකදී භාවිත වන නාමපද, ක්‍රියාපද, විශේෂණ පද, උපදෙස් වාක්‍ය සහ හඬ උච්චාරණය (Audio).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadHandbook(2)}
                  className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl text-xs font-bold shadow-3xs flex items-center gap-2 transition cursor-pointer shrink-0 self-start sm:self-auto"
                  title="පෙළපොත 2 (කෘෂි ජපන් භාෂාව) සම්පූර්ණ PDF සටහන බාගත කරන්න"
                >
                  <Download className="w-4 h-4" />
                  <span>පෙළපොත 2 බාගත (PDF - පිටු 64)</span>
                </button>
              </div>

              {/* Top Controls & Category Filter */}
              <div className="bg-white p-5 rounded-3xl border border-[#e9e2d7] shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "සියල්ල (All)" },
                    { id: "nouns", label: "නාමපද (Nouns - 60+)" },
                    { id: "verbs", label: "ක්‍රියාපද (Verbs - 33)" },
                    { id: "adjectives", label: "විශේෂණ (Adjectives)" },
                    { id: "manners", label: "ආචාර සමාචාර & ප්‍රශ්න" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setJapaneseCategory(cat.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        japaneseCategory === cat.id
                          ? "bg-[#2d6a4f] text-white shadow-xs"
                          : "bg-[#fdfbf7] text-[#354f52] border border-[#e9e2d7] hover:bg-[#f0ede6]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={japaneseSearchQuery}
                    onChange={(e) => setJapaneseSearchQuery(e.target.value)}
                    placeholder="වචනයක් සොයන්න..."
                    className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#e9e2d7] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  />
                </div>
              </div>

              {/* SECTION: NOUNS */}
              {(japaneseCategory === "all" || japaneseCategory === "nouns") && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-[#2d6a4f] uppercase tracking-wider flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-emerald-600" /> කෘෂිකාර්මික නාමපද (Agricultural Nouns with Sentences)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agriJapaneseNouns
                      .filter((n) => {
                        const q = japaneseSearchQuery.toLowerCase();
                        return (
                          !q ||
                          n.wordJp.toLowerCase().includes(q) ||
                          n.meaningSi.toLowerCase().includes(q) ||
                          n.romaji.toLowerCase().includes(q)
                        );
                      })
                      .map((n) => (
                        <div
                          key={n.id}
                          className="bg-white p-4 rounded-2xl border border-[#e9e2d7] shadow-3xs space-y-2 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-black text-[#354f52] flex items-center gap-2">
                              {n.wordJp} {n.kanji && <span className="text-xs font-normal text-slate-500">({n.kanji})</span>}
                            </span>
                            <button
                              type="button"
                              onClick={() => playJapaneseAudio(n.wordJp)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition cursor-pointer"
                              title="ජපන් උච්චාරණයට සවන් දෙන්න"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs font-mono text-slate-400">{n.romaji}</div>
                          <p className="text-xs font-bold text-[#2d6a4f]">{n.meaningSi}</p>

                          {n.exampleSentenceJp && (
                            <div className="bg-[#fbf9f5] p-2 rounded-xl border border-[#e9dfcc] text-[11px] space-y-1">
                              <p className="font-semibold text-slate-800 flex items-center justify-between">
                                <span>{n.exampleSentenceJp}</span>
                                <button
                                  type="button"
                                  onClick={() => playJapaneseAudio(n.exampleSentenceJp!)}
                                  className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </p>
                              <p className="text-slate-500">{n.exampleSentenceSi}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SECTION: VERBS */}
              {(japaneseCategory === "all" || japaneseCategory === "verbs") && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-black text-[#2d6a4f] uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" /> කෘෂිකාර්මික ක්‍රියාපද සහ විධාන (Workplace Verbs & ~Te Kudasai)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agriJapaneseVerbs
                      .filter((v) => {
                        const q = japaneseSearchQuery.toLowerCase();
                        return (
                          !q ||
                          v.masuForm.toLowerCase().includes(q) ||
                          v.dictForm.toLowerCase().includes(q) ||
                          v.meaningSi.toLowerCase().includes(q) ||
                          v.romaji.toLowerCase().includes(q)
                        );
                      })
                      .map((v) => (
                        <div
                          key={v.id}
                          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e9e2d7] shadow-3xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-black text-[#354f52]">{v.masuForm}</span>
                              <span className="text-xs font-mono text-slate-400 ml-2">({v.dictForm})</span>
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md ml-2">
                                {v.group}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => playJapaneseAudio(v.masuForm)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs font-black text-[#2d6a4f]">{v.meaningSi}</p>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                              <span className="text-[9px] text-emerald-800 font-bold block">විධානය (කරන්න):</span>
                              <span className="font-black text-slate-800">{v.teForm}</span>
                              <span className="text-slate-500 block text-[10px]">{v.teKudasaiSi}</span>
                            </div>
                            <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-100">
                              <span className="text-[9px] text-rose-800 font-bold block">තහනම (කරන්න එපා):</span>
                              <span className="font-black text-slate-800">{v.naideForm}</span>
                              <span className="text-slate-500 block text-[10px]">{v.naideKudasaiSi}</span>
                            </div>
                          </div>

                          <div className="bg-[#fbf9f5] p-2.5 rounded-xl border border-[#e9dfcc] text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{v.exampleJp}</span>
                              <button
                                type="button"
                                onClick={() => playJapaneseAudio(v.exampleJp)}
                                className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-slate-600 text-[11px]">{v.exampleSi}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SECTION: ADJECTIVES */}
              {(japaneseCategory === "all" || japaneseCategory === "adjectives") && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-black text-[#2d6a4f] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" /> නාම විශේෂණ (Adjectives with Opposites)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agriJapaneseAdjectives.map((adj) => (
                      <div
                        key={adj.id}
                        className="bg-white p-4 rounded-2xl border border-[#e9e2d7] shadow-3xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-[#354f52]">{adj.wordJp}</span>
                          <button
                            type="button"
                            onClick={() => playJapaneseAudio(adj.wordJp)}
                            className="p-1 bg-emerald-50 text-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-[#2d6a4f]">{adj.meaningSi}</p>
                        {adj.oppositeJp && (
                          <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <strong>ප්‍රතිවිරුද්ධ පදය:</strong> {adj.oppositeJp} ({adj.oppositeSi})
                          </p>
                        )}
                        <p className="text-[11px] text-slate-600 italic bg-[#fbf9f5] p-2 rounded-xl border border-[#e9dfcc]">
                          {adj.exampleJp} - {adj.exampleSi}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: MANNERS & GREETINGS */}
              {(japaneseCategory === "all" || japaneseCategory === "manners") && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-black text-[#2d6a4f] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> ප්‍රශ්න කිරීම් සහ ආචාර සමාචාර (Questions & Greetings)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Greetings */}
                    <div className="bg-white p-5 rounded-3xl border border-[#e9e2d7] shadow-3xs space-y-3">
                      <h4 className="font-extrabold text-xs text-[#2d6a4f] uppercase tracking-wider">
                        ගොවිපලේ ආචාර සමාචාර (Workplace Greetings)
                      </h4>
                      <div className="space-y-2 text-xs">
                        {agriJapaneseGreetings.map((g, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-[#fdfbf7] border border-[#e9e2d7] flex items-center justify-between">
                            <div>
                              <span className="font-black text-slate-800 block text-sm">{g.jp}</span>
                              <span className="text-slate-500 font-medium">{g.si}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => playJapaneseAudio(g.jp)}
                              className="p-1.5 bg-white text-emerald-700 rounded-lg border border-[#e9e2d7] cursor-pointer"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-white p-5 rounded-3xl border border-[#e9e2d7] shadow-3xs space-y-3">
                      <h4 className="font-extrabold text-xs text-[#2d6a4f] uppercase tracking-wider">
                        ප්‍රශ්න කිරීම් වචන (Question Words)
                      </h4>
                      <div className="space-y-2 text-xs">
                        {agriJapaneseQuestionsAndManners.map((q, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-[#fdfbf7] border border-[#e9e2d7] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-[#2d6a4f]">{q.jp}</span>
                              <span className="font-bold text-slate-600">{q.si}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 italic">{q.exampleJp} - {q.exampleSi}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: GLOSSARY */}
          {agriStudyMode === "glossary" && (
            <div className="bg-white p-6 rounded-3xl border border-[#e9e2d7] shadow-3xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e2d7] pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#2d6a4f] flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-emerald-600" />
                    කෘෂිකාර්මික නිල වචන මාලාව (Official Agricultural Glossary)
                  </h3>
                  <p className="text-xs text-slate-500">
                    පෙළපොතේ 90-93 පිටුවල ඇති සියලුම තාක්ෂණික වචන සහ සිංහල අර්ථ දැක්වීම් (50+ Terms).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder="වචනයක් සොයන්න..."
                      className="w-full pl-9 pr-3 py-2 bg-[#fdfbf7] border border-[#e9e2d7] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1.5">
                {["all", "පොහොර", "පස", "බීජ හා පැල", "වගා ක්‍රම", "කප්පාදුව හා අස්වැන්න", "පළිබෝධ හා රෝග"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGlossaryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      glossaryCategory === cat
                        ? "bg-[#2d6a4f] text-white"
                        : "bg-[#fdfbf7] text-[#354f52] border border-[#e9e2d7] hover:bg-[#f0ede6]"
                    }`}
                  >
                    {cat === "all" ? "සියල්ල" : cat}
                  </button>
                ))}
              </div>

              {/* Glossary Terms List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {filteredGlossary.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e2d7] space-y-2 hover:border-emerald-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#354f52] leading-tight">
                          {item.termSi}
                        </h4>
                        <span className="text-xs font-black text-[#2d6a4f] font-mono">
                          {item.termJp} {item.romaji && `(${item.romaji})`}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.definitionSi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 4: FLASHCARDS MEMORIZATION GAME (With OK & NOT YET status tracking) */}
          {agriStudyMode === "flashcards" && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-[#2d6a4f] flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  කෘෂිකාර්මික ෆ්ලෑෂ් කාඩ් මතක පුහුණුව (Flashcards)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  කාඩ්පත පෙරළා (Flip) ජපන් වචනය, විධානය සහ සිංහල අර්ථය මතක තබා ගන්න. OK සහ NOT YET මගින් ඔබේ ප්‍රගතිය සටහන් කරන්න.
                </p>
              </div>

              {/* Status Filter Tabs & Mastery Bar */}
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border border-[#e9dfcc] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setFlashcardFilter("ALL");
                        setFlashcardIndex(0);
                        setIsFlashcardFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        flashcardFilter === "ALL"
                          ? "bg-[#2d6a4f] text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-[#e9dfcc]"
                      }`}
                    >
                      <span>සියල්ල ({flashcardDeck.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFlashcardFilter("NOT_YET");
                        setFlashcardIndex(0);
                        setIsFlashcardFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        flashcardFilter === "NOT_YET"
                          ? "bg-[#bc6c25] text-white shadow-xs"
                          : "bg-white text-[#bc6c25] hover:bg-amber-50 border border-amber-200"
                      }`}
                    >
                      <span>❌ Not Yet ({notYetCardsCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFlashcardFilter("OK");
                        setFlashcardIndex(0);
                        setIsFlashcardFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        flashcardFilter === "OK"
                          ? "bg-[#2d6a4f] text-white shadow-xs"
                          : "bg-white text-[#2d6a4f] hover:bg-emerald-50 border border-emerald-200"
                      }`}
                    >
                      <span>✔️ OK ({okCardsCount})</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFlashcards}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition ml-auto cursor-pointer"
                    title="සියලු Flashcard ප්‍රගතිය Reset කරන්න"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ප්‍රගතිය</span>
                  </button>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>ප්‍රගුණ කිරීමේ මට්ටම:</span>
                    <span className="text-[#2d6a4f]">
                      {okCardsCount} / {flashcardDeck.length} Mastered (
                      {flashcardDeck.length > 0
                        ? Math.round((okCardsCount / flashcardDeck.length) * 100)
                        : 0}
                      %)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#2d6a4f] transition-all duration-300"
                      style={{
                        width: `${
                          flashcardDeck.length > 0
                            ? (okCardsCount / flashcardDeck.length) * 100
                            : 0
                        }%`
                      }}
                    />
                    <div
                      className="h-full bg-[#bc6c25] transition-all duration-300"
                      style={{
                        width: `${
                          flashcardDeck.length > 0
                            ? (notYetCardsCount / flashcardDeck.length) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* If Deck is empty under active filter */}
              {filteredFlashcardDeck.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-[#e9dfcc] space-y-3">
                  <p className="text-sm font-bold text-slate-600">
                    {flashcardFilter === "OK"
                      ? "තවම 'OK' ලෙස ලකුණු කළ කාඩ්පත් නොමැත. කාඩ්පත් අධ්‍යයනය කර මතක ඇති ඒවාට 'OK' ක්ලික් කරන්න."
                      : "තවම 'NOT YET' ලෙස ලකුණු කළ කාඩ්පත් නොමැත. අපහසු කාඩ්පත් වලට 'NOT YET' ක්ලික් කර නැවත පුහුණු වන්න."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcardFilter("ALL");
                      setFlashcardIndex(0);
                    }}
                    className="px-4 py-2 bg-[#2d6a4f] text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    සියලු කාඩ්පත් වෙත මාරුවන්න
                  </button>
                </div>
              ) : (
                <>
                  {/* Card Status & Category Pill */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
                    <span>
                      කාඩ්පත: {flashcardIndex + 1} / {filteredFlashcardDeck.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono text-[11px]">
                        {currentFlashcard.category}
                      </span>
                      {flashcardStatus[currentFlashcard.id] === "OK" && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-[#2d6a4f] border border-emerald-300 rounded-md font-black text-[10px] flex items-center gap-1">
                          ✔️ OK (මතකයි)
                        </span>
                      )}
                      {flashcardStatus[currentFlashcard.id] === "NOT_YET" && (
                        <span className="px-2 py-0.5 bg-amber-100 text-[#bc6c25] border border-amber-300 rounded-md font-black text-[10px] flex items-center gap-1">
                          ❌ Not Yet (තාම නෑ)
                        </span>
                      )}
                      {!flashcardStatus[currentFlashcard.id] && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-medium text-[10px]">
                          ⚪ නව කාඩ්පතක්
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3D Flashcard Interactive View */}
                  <div
                    onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                    className="w-full min-h-[290px] p-6 sm:p-8 rounded-3xl border-2 border-[#e9e2d7] bg-white shadow-sm hover:border-[#2d6a4f] transition-all duration-200 cursor-pointer flex flex-col justify-between items-center text-center relative overflow-hidden"
                  >
                    <div className="w-full flex justify-between items-center text-[11px] font-mono text-slate-400">
                      <span className="font-bold">
                        {isFlashcardFlipped ? "පසුපස (Answer)" : "ඉදිරිපස (Prompt)"}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> ක්ලික් කර පෙරළන්න (Click to Flip)
                      </span>
                    </div>

                    <div className="my-auto space-y-3 py-4 w-full">
                      {!isFlashcardFlipped ? (
                        <>
                          <h2 className="text-2xl sm:text-3xl font-black text-[#354f52] tracking-tight">
                            {currentFlashcard.promptJp}
                          </h2>
                          <p className="text-xs font-mono text-slate-400 font-bold">
                            {currentFlashcard.promptRomaji}
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-xl sm:text-2xl font-black text-[#2d6a4f]">
                            {currentFlashcard.answerSi}
                          </h2>
                          {currentFlashcard.exampleJp && (
                            <div className="bg-[#fbf9f5] p-3 rounded-2xl border border-[#e9dfcc] text-xs text-slate-700 max-w-md mx-auto mt-2 text-left">
                              <p className="font-bold text-[#354f52]">
                                {currentFlashcard.exampleJp}
                              </p>
                              <p className="text-slate-500 text-[11px] mt-0.5 font-medium">
                                {currentFlashcard.exampleSi}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* OK and NOT YET Action Buttons (Matching Kanji / Verbs style) */}
                    <div className="grid grid-cols-2 gap-3 w-full pt-4 border-t border-[#e9e2d7]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetFlashcardStatus(currentFlashcard.id, "NOT_YET");
                          if (filteredFlashcardDeck.length > 1) {
                            setIsFlashcardFlipped(false);
                            setFlashcardIndex(
                              (prev) => (prev + 1) % filteredFlashcardDeck.length
                            );
                          }
                        }}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-3xs ${
                          flashcardStatus[currentFlashcard.id] === "NOT_YET"
                            ? "bg-[#bc6c25] text-white shadow-md shadow-[#bc6c25]/20 ring-2 ring-[#bc6c25]/30"
                            : "bg-[#ece2d0] text-[#bc6c25] hover:bg-[#e4d6be]"
                        }`}
                      >
                        <span>❌ NOT YET</span>
                        <span className="text-[10px] opacity-80">(තාම මතක නෑ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetFlashcardStatus(currentFlashcard.id, "OK");
                          if (filteredFlashcardDeck.length > 1) {
                            setIsFlashcardFlipped(false);
                            setFlashcardIndex(
                              (prev) => (prev + 1) % filteredFlashcardDeck.length
                            );
                          }
                        }}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-3xs ${
                          flashcardStatus[currentFlashcard.id] === "OK"
                            ? "bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20 ring-2 ring-[#2d6a4f]/30"
                            : "bg-[#d8f3dc] text-[#2d6a4f] hover:bg-[#b7e4c7]"
                        }`}
                      >
                        <span>✔️ OK</span>
                        <span className="text-[10px] opacity-80">(දන්නවා / මතකයි)</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Controls below card */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <button
                      type="button"
                      disabled={flashcardIndex === 0}
                      onClick={() => {
                        setIsFlashcardFlipped(false);
                        setFlashcardIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className="px-4 py-2.5 bg-[#fdfbf7] border border-[#e9e2d7] text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                    >
                      ← පෙර කාඩ්පත (Prev)
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          playJapaneseAudio(
                            currentFlashcard.speakText || currentFlashcard.promptJp
                          );
                        }}
                        className="p-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        title="ජපන් උච්චාරණයට සවන් දෙන්න"
                      >
                        <Volume2 className="w-4 h-4" /> හඬ අසන්න
                      </button>

                      <button
                        type="button"
                        onClick={handleShuffleDeck}
                        className="p-2.5 bg-[#f4eee6] hover:bg-[#ebdcc7] text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        title="කාඩ්පත් අහඹු ලෙස මාරු කරන්න"
                      >
                        <Shuffle className="w-4 h-4 text-[#2d6a4f]" /> කලවම් (Shuffle)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsFlashcardFlipped(false);
                        setFlashcardIndex(
                          (prev) => (prev + 1) % filteredFlashcardDeck.length
                        );
                      }}
                      className="px-4 py-2.5 bg-[#2d6a4f] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1b4332] cursor-pointer"
                    >
                      ඊළඟ කාඩ්පත (Next) →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* MODE 5: PRACTICE EXAM SIMULATOR */}
          {agriStudyMode === "practice_quiz" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e9e2d7] shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#e9e2d7] pb-3">
                  <div>
                    <h3 className="font-black text-base text-[#2d6a4f] flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      කෘෂිකාර්මික නිපුණතා පෙරහුරු විභාගය (Exam Simulator)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      ජපාන නිල ප්‍රශ්න රටාවට අනුකූල බහුවරණ ප්‍රශ්න මාලාව.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-[#f4eee6] p-0.5 rounded-xl text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQuizViewType("single")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          quizViewType === "single" ? "bg-white text-[#2d6a4f] shadow-xs" : "text-slate-600"
                        }`}
                      >
                        තනි ප්‍රශ්නය
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuizViewType("all")}
                        className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          quizViewType === "all" ? "bg-white text-[#2d6a4f] shadow-xs" : "text-slate-600"
                        }`}
                      >
                        සියල්ල
                      </button>
                    </div>
                    <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl">
                      {allExamQuestions.length} Questions
                    </span>
                  </div>
                </div>

                {/* Question index navigator pills */}
                {!isQuizSubmitted && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {allExamQuestions.map((_, pIdx) => {
                      const isAnswered = selectedAnswers[pIdx] !== undefined;
                      const isCurrent = activeQuizQuestionIdx === pIdx;
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setActiveQuizQuestionIdx(pIdx);
                            if (quizViewType !== "single") setQuizViewType("single");
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 transition cursor-pointer ${
                            isCurrent
                              ? "bg-[#2d6a4f] text-white ring-2 ring-[#2d6a4f]/30"
                              : isAnswered
                              ? "bg-emerald-100 text-emerald-800 font-bold"
                              : "bg-[#f4eee6] text-slate-600 hover:bg-[#ece2d0]"
                          }`}
                        >
                          {pIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!isQuizSubmitted ? (
                  quizViewType === "single" ? (
                    // Focused Single-Question View
                    (() => {
                      const q = allExamQuestions[activeQuizQuestionIdx];
                      const qIdx = activeQuizQuestionIdx;
                      return (
                        <div className="space-y-4 pt-1">
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#fdfbf7] border border-[#e9e2d7] space-y-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-7 h-7 rounded-xl bg-[#2d6a4f] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                  {q.topic}
                                </span>
                                <p className="font-bold text-sm sm:text-base text-slate-800 leading-snug">{q.question}</p>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selectedAnswers[qIdx] === oIdx;
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx })}
                                    className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                                      isSelected
                                        ? "bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-xs"
                                        : "bg-white text-slate-700 border-[#e9e2d7] hover:bg-[#f0ede6]"
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                      isSelected ? "border-white bg-white text-[#2d6a4f]" : "border-slate-300"
                                    }`}>
                                      {isSelected ? "✓" : String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Single Question Stepper Controls */}
                          <div className="flex items-center justify-between gap-3 pt-2">
                            <button
                              type="button"
                              disabled={activeQuizQuestionIdx === 0}
                              onClick={() => setActiveQuizQuestionIdx((prev) => Math.max(0, prev - 1))}
                              className="px-4 py-2.5 bg-[#fdfbf7] border border-[#e9e2d7] text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                            >
                              ← පෙර ප්‍රශ්නය
                            </button>

                            {activeQuizQuestionIdx < allExamQuestions.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => setActiveQuizQuestionIdx((prev) => Math.min(allExamQuestions.length - 1, prev + 1))}
                                className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1b4332] cursor-pointer"
                              >
                                ඊළඟ ප්‍රශ්නය →
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsQuizSubmitted(true)}
                                className="px-5 py-2.5 bg-[#bc6c25] hover:bg-[#a2591e] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                              >
                                විභාගය අවසන් කරන්න ✓
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // All Questions View
                    <div className="space-y-6">
                      {allExamQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e2d7] space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#2d6a4f] text-white text-xs font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                                {q.topic}
                              </span>
                              <p className="font-bold text-sm text-slate-800 leading-snug">{q.question}</p>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedAnswers[idx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [idx]: oIdx })}
                                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-2.5 ${
                                    isSelected
                                      ? "bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-xs"
                                      : "bg-white text-slate-700 border-[#e9e2d7] hover:bg-[#f0ede6]"
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                    isSelected ? "border-white bg-white text-[#2d6a4f]" : "border-slate-300"
                                  }`}>
                                    {isSelected ? "✓" : String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setIsQuizSubmitted(true)}
                          className="px-8 py-3 bg-[#bc6c25] hover:bg-[#a2591e] text-white rounded-2xl text-sm font-black shadow-md cursor-pointer transition"
                        >
                          විභාගය අවසන් කර ලකුණු බලන්න (Submit Exam)
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    {/* Score summary */}
                    {(() => {
                      let correctCount = 0;
                      allExamQuestions.forEach((q, idx) => {
                        if (selectedAnswers[idx] === q.correctIndex) correctCount++;
                      });
                      const percent = Math.round((correctCount / allExamQuestions.length) * 100);
                      const isPassed = percent >= 65;

                      return (
                        <div className={`p-6 rounded-3xl text-center border-2 space-y-3 ${
                          isPassed ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
                        }`}>
                          <Award className={`w-12 h-12 mx-auto ${isPassed ? "text-emerald-600" : "text-rose-500"}`} />
                          <h2 className="text-2xl font-black">
                            {isPassed ? "සුබ පැතුම්! ඔබ සාමාර්ථ්‍යයක් ලබා ඇත 🎉" : "තවදුරටත් අධ්‍යයනය කරන්න 📚"}
                          </h2>
                          <p className="text-sm font-bold">
                            ලකුණු: {correctCount} / {allExamQuestions.length} ({percent}%)
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAnswers({});
                              setIsQuizSubmitted(false);
                            }}
                            className="px-5 py-2.5 bg-white rounded-xl text-xs font-black shadow-xs border border-slate-200 cursor-pointer"
                          >
                            නැවත පරීක්ෂණය කරන්න (Retake Quiz)
                          </button>
                        </div>
                      );
                    })()}

                    {/* Detailed Review */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-[#354f52]">පිළිතුරු සමාලෝචනය (Answer Review):</h4>
                      {allExamQuestions.map((q, idx) => {
                        const userAns = selectedAnswers[idx];
                        const isCorrect = userAns === q.correctIndex;
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border text-xs space-y-2 ${
                              isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                            }`}
                          >
                            <p className="font-bold text-slate-800">{idx + 1}. {q.question}</p>
                            <div className="text-[11px] font-semibold space-y-1">
                              <p className={isCorrect ? "text-emerald-700" : "text-rose-700"}>
                                ඔබේ පිළිතුර: {userAns !== undefined ? q.options[userAns] : "පිළිතුරු දී නැත"} {isCorrect ? "✓" : "✗"}
                              </p>
                              {!isCorrect && (
                                <p className="text-emerald-800 font-bold">
                                  නිවැරදි පිළිතුර: {q.options[q.correctIndex]}
                                </p>
                              )}
                              <p className="text-slate-500 italic pt-1">{q.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 6: AGRICULTURE EXAM GUIDE (විභාග මාර්ගෝපදේශය) */}
          {agriStudyMode === "exam_guide" && (
            <div className="space-y-4">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e9dfcc] shadow-3xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#e9dfcc] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                        විභාග මාර්ගෝපදේශය
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        農業技能測定試験 (ASAT)
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#2d6a4f]">
                      ජපන් කෘෂිකාර්මික නිපුණතා විභාගය (SSW Agriculture Exam) පිළිබඳ සම්පූර්ණ තොරතුරු
                    </h3>
                  </div>
                  <div className="p-2.5 bg-emerald-50 text-[#2d6a4f] rounded-xl hidden sm:block">
                    <Wheat className="w-6 h-6" />
                  </div>
                </div>

                {/* Key Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-[#fcfaf7] rounded-xl border border-[#e9dfcc] space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">පවත්වන ආයතනය</p>
                    <p className="text-xs font-black text-[#2d6a4f]">ජාතික කෘෂිකර්ම මණ්ඩලය</p>
                    <p className="text-[10px] text-slate-500 font-mono">National Chamber of Agriculture (NCA)</p>
                  </div>

                  <div className="p-3.5 bg-[#fcfaf7] rounded-xl border border-[#e9dfcc] space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">විභාග ක්‍රමය (Format)</p>
                    <p className="text-xs font-black text-[#2d6a4f]">Prometric CBT පරිගණක විභාගය</p>
                    <p className="text-[10px] text-slate-500 font-medium">මිනිත්තු 60 ක කාලයක්</p>
                  </div>

                  <div className="p-3.5 bg-[#fcfaf7] rounded-xl border border-[#e9dfcc] space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">සමත් වීමේ ලකුණු මට්ටම</p>
                    <p className="text-xs font-black text-[#2d6a4f]">60% - 65% හෝ ඉහළ</p>
                    <p className="text-[10px] text-slate-500 font-medium">ලකුණු ප්‍රතිඵල විභාගය අවසන් වූ විගස</p>
                  </div>

                  <div className="p-3.5 bg-[#fcfaf7] rounded-xl border border-[#e9dfcc] space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">විභාග භාෂා මාධ්‍යය</p>
                    <p className="text-xs font-black text-[#2d6a4f]">සිංහල + ජපන් භාෂාව</p>
                    <p className="text-[10px] text-slate-500 font-medium">වගා දැනුම සිංහලෙන් / ජපන් වචන ජපන් අකුරින්</p>
                  </div>
                </div>

                {/* Exam Sections Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#354f52]">
                    විභාග ප්‍රශ්න පත්‍රයේ කොටස් දෙක (Exam Paper Breakdown)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#e9dfcc] bg-white space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#2d6a4f]" />
                          <h5 className="font-extrabold text-xs text-[#2d6a4f]">
                            කොටස 1: සාමාන්‍ය වගා තාක්ෂණය සහ ආරක්ෂාව (Subject Knowledge)
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          මෙම කොටස සඳහා ප්‍රශ්න සාමාන්‍ය වගාව පෙළපොත (Book 1) ඇසුරෙන් අසනු ලබයි. පස, බීජ, වගා ක්‍රම, පළිබෝධ හා රෝග, ආරක්ෂක පියවර සහ අස්වනු නෙළීම ඇතුළත් වේ. ශ්‍රී ලංකාවේදී ප්‍රශ්න <strong>සිංහල මාධ්‍යයෙන්</strong> පරිගණක තිරයේ දිස්වේ.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadHandbook(1)}
                        className="mt-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#2d6a4f] rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start"
                        title="පෙළපොත 1 (සාමාන්‍ය වගාව) PDF සටහන බාගත කරන්න"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>පෙළපොත 1 (PDF - පිටු 102) බාගත</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-[#e9dfcc] bg-white space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-700" />
                          <h5 className="font-extrabold text-xs text-amber-900">
                            කොටස 2: කෘෂිකාර්මික ජපන් භාෂාව (Agriculture Japanese)
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          මෙම කොටස සඳහා ප්‍රශ්න කෘෂි ජපන් පෙළපොත (Book 2) ඇසුරෙන් අසනු ලබයි. කෘෂිකාර්මික මෙවලම්, ශාක කොටස්, ක්‍රියාපද, සහ ජපානයේ ගොවිපළකදී දෙනු ලබන මූලික උපදෙස් සහ ආචාර ධර්ම <strong>හිරගනා / කටකනා</strong> අකුරින් ප්‍රශ්න කෙරේ.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadHandbook(2)}
                        className="mt-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start"
                        title="පෙළපොත 2 (කෘෂි ජපන් භාෂාව) PDF සටහන බාගත කරන්න"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>පෙළපොත 2 (PDF - පිටු 64) බාගත</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Sri Lanka Prometric Instructions */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <h5 className="font-extrabold text-xs text-amber-900">ශ්‍රී ලංකා විභාග අපේක්ෂකයින් සඳහා වැදගත් උපදෙස්:</h5>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900/90 leading-relaxed">
                    <li>විභාග දිනයට වලංගු විදේශ ගමන් බලපත්‍රය (Original Passport) රැගෙන යාම අනිවාර්ය වේ.</li>
                    <li>විභාගයට අවම වශයෙන් විනාඩි 30කට පෙර Prometric විභාග ශාලාවට (උදා: ඔරියන් සිටි, කොළඹ) වාර්තා කළ යුතුය.</li>
                    <li>කෘෂිකාර්මික කුසලතා විභාගය සමත් වීම සමගම ජපන් N4 (JLPT) හෝ JFT-Basic විභාගය සමත් විය යුතුය.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTOR DETAIL VIEW (When a sector OTHER than Agriculture is selected) */}
      {selectedSectorId !== "agriculture" && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e9dfcc] shadow-3xs space-y-5">
            {/* Header with Title and Prometric link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9dfcc] pb-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-100 text-[#2d6a4f] rounded-2xl shrink-0">
                  {renderSectorIcon(activeSector.icon, "w-6 h-6")}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {activeSector.status === "available_in_sl" ? "ශ්‍රී ලංකාවේ CBT විභාග ඇත (Prometric)" : "විස්තර පමණි"}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      {activeSector.titleJp}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#2d6a4f] mt-1">
                    {activeSector.titleSi} ({activeSector.titleEn})
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed max-w-3xl">
                    {activeSector.descriptionSi}
                  </p>
                </div>
              </div>

              <a
                href="https://www.prometric-jp.com/en/ssw/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-[#f4eee6] hover:bg-[#ebdcc7] text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-center"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Prometric විභාග වෙබ් අඩවිය</span>
              </a>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#e9dfcc] space-y-1">
                <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-bold">
                  <Clock className="w-4 h-4" />
                  <span>විභාග ආකෘතිය (Test Format)</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {activeSector.testFormat}
                </p>
              </div>

              <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#e9dfcc] space-y-1">
                <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>විභාග භාෂාව (Language)</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {activeSector.testLanguage}
                </p>
              </div>

              <div className="bg-[#fcfaf7] p-4 rounded-xl border border-[#e9dfcc] space-y-1 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-bold">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>වීසා සුදුසුකම් (Tokutei Ginou)</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Specified Skilled Worker (i) වීසා සඳහා පිළිගත් නිල නිපුණතා සහතිකය.
                </p>
              </div>
            </div>

            {/* Subcategories & Specializations */}
            {activeSector.subCategories && activeSector.subCategories.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#354f52] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#2d6a4f]" />
                  අනු කාණ්ඩ සහ රැකියා අංශ (Sub-Categories & Roles)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeSector.subCategories.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-[#e9dfcc] text-xs font-bold text-slate-800 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="line-clamp-2">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Topics & Syllabus Checklist */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#354f52] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2d6a4f]" />
                විෂය නිර්දේශයේ ප්‍රධාන තේමා (Key Syllabus Topics)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSector.keyTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#fcfaf7] rounded-xl border border-[#e9dfcc] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sri Lanka Exam Registration Guide & Links */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                <h4 className="font-extrabold text-xs">ශ්‍රී ලංකා Prometric විභාග ලියාපදිංචි වීමේ තොරතුරු</h4>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                ශ්‍රී ලංකාවේ Prometric පරිගණක මධ්‍යස්ථාන මගින් පවත්වනු ලබන මෙම විභාගය සඳහා Prometric ID එකක් සාදාගෙන දිනයක් සහ වේලාවක් වෙන්කරවා (booking) ගත යුතුය. ජපන් N4 මට්ටම හෝ JFT-Basic විභාගය සමග මෙම කුසලතා විභාගය සමත් වීමෙන් SSW වීසා සඳහා සුදුසුකම් ලබයි.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://www.prometric-jp.com/en/ssw/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-amber-200 hover:bg-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Prometric Japan SSW නිල විභාග අඩවිය වෙත</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
