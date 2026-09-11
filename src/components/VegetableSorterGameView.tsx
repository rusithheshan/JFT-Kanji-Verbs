import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  RotateCcw,
  Trophy,
  Heart,
  Timer,
  Volume2,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame,
  Search,
  Boxes,
  TrendingUp
} from "lucide-react";
import {
  VEGETABLE_FAMILIES,
  VEGETABLE_CROPS,
  VegetableCrop,
  VegetableFamily
} from "../data/vegetableFamilies";
import { VegetablePhoto } from "./VegetablePhoto";

// Synthesized audio feedback helper
const playBeep = (freq: number, type: OscillatorType = "sine", duration: number = 0.12) => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio context may not be allowed without user gesture
  }
};

const playSuccessChime = () => {
  playBeep(587.33, "triangle", 0.1);
  setTimeout(() => playBeep(880.0, "triangle", 0.18), 100);
};

const playErrorBuzzer = () => {
  playBeep(180, "sawtooth", 0.22);
};

const playLevelUp = () => {
  [440, 554, 659, 880].forEach((f, i) => {
    setTimeout(() => playBeep(f, "sine", 0.12), i * 90);
  });
};

const speakJapanese = (text: string) => {
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silent
    }
  }
};

type GameMode = "conveyor" | "misfit" | "reference";

interface SorterQuestion {
  targetCrop: VegetableCrop;
  correctFamily: VegetableFamily;
  candidateFamilies: VegetableFamily[];
}

interface MisfitQuestion {
  id: string;
  themeFamily: VegetableFamily;
  options: {
    crop: VegetableCrop;
    isMisfit: boolean;
  }[];
  promptSi: string;
  explanationSi: string;
}

export const VegetableSorterGameView: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>("conveyor");

  // Conveyor Mode State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15);
  const [inspectionLog, setInspectionLog] = useState<{ text: string; correct: boolean } | null>(null);

  // Reference Mode State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>("all");

  // Generator for Conveyor questions
  const generateConveyorQuestion = useCallback((): SorterQuestion => {
    const crop = VEGETABLE_CROPS[Math.floor(Math.random() * VEGETABLE_CROPS.length)];
    const correctFamily = VEGETABLE_FAMILIES.find((f) => f.id === crop.familyId) || VEGETABLE_FAMILIES[0];

    const otherFamilies = VEGETABLE_FAMILIES.filter((f) => f.id !== correctFamily.id);
    const shuffledOthers = [...otherFamilies].sort(() => Math.random() - 0.5);
    const candidateFamilies = [correctFamily, ...shuffledOthers.slice(0, 3)].sort(() => Math.random() - 0.5);

    return {
      targetCrop: crop,
      correctFamily,
      candidateFamilies
    };
  }, []);

  const [currentConveyorQ, setCurrentConveyorQ] = useState<SorterQuestion>(generateConveyorQuestion);

  // Generator for Misfit (Odd-One-Out) questions
  const generateMisfitQuestion = useCallback((): MisfitQuestion => {
    const multiCropFamilies = VEGETABLE_FAMILIES.filter((f) => f.cropIds.length >= 2);
    const themeFamily = multiCropFamilies[Math.floor(Math.random() * multiCropFamilies.length)];

    const familyCrops = VEGETABLE_CROPS.filter((c) => c.familyId === themeFamily.id);
    const shuffledFamilyCrops = [...familyCrops].sort(() => Math.random() - 0.5);
    const matchingCrops = shuffledFamilyCrops.slice(0, Math.min(3, shuffledFamilyCrops.length));

    const otherCrops = VEGETABLE_CROPS.filter((c) => c.familyId !== themeFamily.id);
    const misfitCrop = otherCrops[Math.floor(Math.random() * otherCrops.length)];

    const options = [
      ...matchingCrops.map((c) => ({ crop: c, isMisfit: false })),
      { crop: misfitCrop, isMisfit: true }
    ].sort(() => Math.random() - 0.5);

    return {
      id: `${themeFamily.id}-${Date.now()}`,
      themeFamily,
      options,
      promptSi: `පහත එළවළු අතරින් "${themeFamily.nameSi}" (${themeFamily.botanicalName}) ට අයත් නොවන විෂම එළවළුව කුමක්ද?`,
      explanationSi: `"${misfitCrop.nameSi}" අයත් වන්නේ "${misfitCrop.familyNameSi}" (${misfitCrop.familyBotanical}) ටය.`
    };
  }, []);

  const [currentMisfitQ, setCurrentMisfitQ] = useState<MisfitQuestion>(generateMisfitQuestion);
  const [misfitSelectedCropId, setMisfitSelectedCropId] = useState<string | null>(null);
  const [misfitFeedback, setMisfitFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

  // Conveyor countdown timer
  useEffect(() => {
    if (gameMode !== "conveyor" || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playErrorBuzzer();
          setStreak(0);
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setIsGameOver(true);
            }
            return Math.max(0, nextL);
          });
          setInspectionLog({
            text: `කාලය අවසන්! "${currentConveyorQ.targetCrop.nameSi}" අයත් වන්නේ ${currentConveyorQ.correctFamily.nameSi} (${currentConveyorQ.correctFamily.nameJp}) ටය.`,
            correct: false
          });
          setCurrentConveyorQ(generateConveyorQuestion());
          return maxTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, isGameOver, maxTime, currentConveyorQ, generateConveyorQuestion]);

  // Handle Conveyor Crate Selection
  const handleSelectCrate = (chosenFamily: VegetableFamily) => {
    if (isGameOver) return;

    const isCorrect = chosenFamily.id === currentConveyorQ.correctFamily.id;

    if (isCorrect) {
      playSuccessChime();
      const points = 20 + streak * 5;
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));

      if (newStreak % 5 === 0) {
        setLevel((lv) => lv + 1);
        setMaxTime((mt) => Math.max(7, mt - 1));
        playLevelUp();
      }

      setInspectionLog({
        text: `නිවැරදියි! "${currentConveyorQ.targetCrop.nameSi}" (${currentConveyorQ.targetCrop.nameJpKana}) අයත් වන්නේ ${chosenFamily.nameSi} ටමය. (+${points} ලකුණු)`,
        correct: true
      });
    } else {
      playErrorBuzzer();
      setStreak(0);
      setLives((l) => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setIsGameOver(true);
        }
        return Math.max(0, nextL);
      });

      setInspectionLog({
        text: `වැරදියි! "${currentConveyorQ.targetCrop.nameSi}" අයත් වන්නේ ${currentConveyorQ.correctFamily.nameSi} (${currentConveyorQ.correctFamily.nameJp}) ටය.`,
        correct: false
      });
    }

    setCurrentConveyorQ(generateConveyorQuestion());
    setTimeLeft(maxTime);
  };

  // Keyboard shortcut listener [1], [2], [3], [4]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameMode !== "conveyor" || isGameOver) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentConveyorQ.candidateFamilies[idx]) {
          handleSelectCrate(currentConveyorQ.candidateFamilies[idx]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameMode, isGameOver, currentConveyorQ]);

  // Handle Misfit Selection
  const handleMisfitChoice = (option: { crop: VegetableCrop; isMisfit: boolean }) => {
    if (misfitFeedback) return;
    setMisfitSelectedCropId(option.crop.id);

    if (option.isMisfit) {
      playSuccessChime();
      setScore((s) => s + 35);
      setStreak((st) => st + 1);
      setMisfitFeedback({
        correct: true,
        explanation: `හරියටම හරි! ${currentMisfitQ.explanationSi}`
      });
    } else {
      playErrorBuzzer();
      setStreak(0);
      setMisfitFeedback({
        correct: false,
        explanation: `වැරදියි! "${option.crop.nameSi}" අයත් වන්නේද ${currentMisfitQ.themeFamily.nameSi} ටමය. ${currentMisfitQ.explanationSi}`
      });
    }
  };

  const handleNextMisfit = () => {
    setMisfitSelectedCropId(null);
    setMisfitFeedback(null);
    setCurrentMisfitQ(generateMisfitQuestion());
  };

  const handleRestartConveyor = () => {
    setScore(0);
    setStreak(0);
    setLives(5);
    setLevel(1);
    setMaxTime(15);
    setTimeLeft(15);
    setIsGameOver(false);
    setInspectionLog(null);
    setCurrentConveyorQ(generateConveyorQuestion());
  };

  // Filtered crops for Digital Reference Mode
  const filteredCrops = useMemo(() => {
    return VEGETABLE_CROPS.filter((c) => {
      const matchFamily = selectedFamilyFilter === "all" || c.familyId === selectedFamilyFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchFamily;

      const matchText =
        c.nameSi.toLowerCase().includes(q) ||
        c.nameJpKana.toLowerCase().includes(q) ||
        (c.nameJpKanji && c.nameJpKanji.toLowerCase().includes(q)) ||
        c.nameRomaji.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.familyNameSi.toLowerCase().includes(q) ||
        c.familyBotanical.toLowerCase().includes(q);

      return matchFamily && matchText;
    });
  }, [selectedFamilyFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER - CLEAN & SOPHISTICATED MINIMALIST JAPANESE DESIGN */}
      {/* ========================================================================= */}
      <div className="bg-[#fcfaf7] border border-[#e8e2d8] rounded-3xl p-5 sm:p-6 text-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-[11px] font-mono font-bold tracking-wide">
            <span>JA 農業協同組合</span>
            <span>•</span>
            <span>පෙළපොත පිටු 45-46 වර්ගීකරණය</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vegetable Families
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            ජපන් කෘෂිකර්ම විභාගයේ එළවළු පවුල් 12 (Cucurbitaceae, Solanaceae, Brassicaceae ආදී) සැබෑ ඡායාරූප මඟින් පහසුවෙන් හඳුනාගන්න.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-white p-1 rounded-2xl border border-[#e2dcd2] shadow-xs flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setGameMode("conveyor")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === "conveyor"
                ? "bg-[#2d6a4f] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>වර්ගීකරණය</span>
          </button>

          <button
            type="button"
            onClick={() => setGameMode("misfit")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === "misfit"
                ? "bg-[#2d6a4f] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>විෂම එළවළුව</span>
          </button>

          <button
            type="button"
            onClick={() => setGameMode("reference")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === "reference"
                ? "bg-[#2d6a4f] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>පවුල් 12 අත්පොත</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE 1: CLASSIFICATION (කූඩ වර්ගීකරණය) */}
      {/* ========================================================================= */}
      {gameMode === "conveyor" && (
        <div className="space-y-4">
          {/* Dashboard Bar */}
          <div className="bg-white border border-[#e8e2d8] p-3 rounded-2xl flex items-center justify-between gap-2 flex-wrap text-slate-800 shadow-xs">
            {/* Lives */}
            <div className="flex items-center gap-1.5 bg-rose-50/80 px-3 py-1.5 rounded-xl border border-rose-200/80">
              <span className="text-[11px] font-mono font-bold text-rose-800">ජීවිත:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < lives ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-1.5 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/80 text-emerald-900 font-mono text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>මට්ටම: LV.{level}</span>
            </div>

            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-xl shadow-xs text-xs font-black">
                <Flame className="w-3.5 h-3.5 text-yellow-200" />
                <span>COMBO x{streak}!</span>
              </div>
            )}

            {/* Score */}
            <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs font-black">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>ලකුණු: {score}</span>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleRestartConveyor}
              className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition cursor-pointer"
              title="නැවත ආරම්භ කරන්න"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* GAME OVER MODAL */}
          {isGameOver ? (
            <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-md max-w-md mx-auto">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">පරීක්ෂණ අවසරය අවසන්</h3>
                <p className="text-xs text-slate-500">
                  නැවුම් එළවළු පවුල් නිවැරදිව හඳුනාගැනීම සඳහා නැවත පුහුණු වන්න.
                </p>
              </div>

              <div className="bg-[#fcfaf7] border border-[#e8e2d8] p-4 rounded-2xl space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">අවසාන ලකුණු:</span>
                  <span className="font-black text-emerald-800 text-base">{score} PTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">උපරිම Combo:</span>
                  <span className="font-bold text-amber-800">{maxStreak}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ළඟාවූ මට්ටම:</span>
                  <span className="font-bold text-slate-700">LV.{level}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRestartConveyor}
                className="w-full py-3 bg-[#2d6a4f] hover:bg-[#23533e] text-white font-bold rounded-2xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>නැවත පරීක්ෂාව ආරම්භ කරන්න</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Central Vegetable Card with Real Photo */}
              <div className="relative bg-white border border-[#e5e0d8] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden text-center">
                {/* Timer Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeLeft <= 4 ? "bg-rose-500" : timeLeft <= 7 ? "bg-amber-400" : "bg-[#2d6a4f]"
                    }`}
                    style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                  />
                </div>

                <div className="max-w-xl mx-auto space-y-4">
                  {/* Timer & Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-mono font-bold">
                      📦 එළවළු අංකය #{Math.floor(score / 20) + 1}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      <Timer className="w-3.5 h-3.5 text-slate-500" />
                      <span>{timeLeft}s ඉතිරියි</span>
                    </div>
                  </div>

                  {/* Real Photo Presentation of the Vegetable */}
                  <div className="bg-[#fcfaf7] border border-[#e8e2d8] p-6 rounded-3xl flex flex-col items-center justify-center">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 relative shadow-sm rounded-2xl overflow-hidden">
                      <VegetablePhoto
                        cropId={currentConveyorQ.targetCrop.id}
                        photoUrl={currentConveyorQ.targetCrop.photoUrl}
                        nameSi={currentConveyorQ.targetCrop.nameSi}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover rounded-2xl"
                      />
                    </div>

                    {/* Audio Pronunciation Button */}
                    <button
                      type="button"
                      onClick={() => speakJapanese(currentConveyorQ.targetCrop.nameJpKana)}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold transition cursor-pointer border border-[#ded8ce] shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>ජපන් උච්චාරණය ({currentConveyorQ.targetCrop.nameRomaji})</span>
                    </button>

                    {/* Japanese Names Display */}
                    <div className="mt-3 space-y-0.5 text-center">
                      <div className="text-xs text-emerald-800 font-mono font-bold">
                        {currentConveyorQ.targetCrop.nameJpKanji && currentConveyorQ.targetCrop.nameJpKanji !== "-"
                          ? currentConveyorQ.targetCrop.nameJpKanji
                          : ""}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {currentConveyorQ.targetCrop.nameJpKana} ({currentConveyorQ.targetCrop.nameRomaji})
                      </h2>
                      <p className="text-base sm:text-lg font-bold text-slate-700">
                        {currentConveyorQ.targetCrop.nameSi}
                        <span className="text-xs font-mono text-slate-500 ml-1.5">
                          ({currentConveyorQ.targetCrop.nameEn})
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Instruction */}
                  <div className="bg-[#f7f5f0] border border-[#e5e0d8] p-2.5 rounded-2xl text-center">
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      👇 මෙම එළවළුව අයත් වන නිවැරදි <span className="text-[#2d6a4f] font-black">ශාක කුලය / පවුල (Family)</span> තෝරන්න (යතුරුපුවරුවෙන් [1], [2], [3], [4]):
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 CANDIDATE BOTANICAL FAMILY CRATES - CLEAN & SOPHISTICATED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentConveyorQ.candidateFamilies.map((family, idx) => (
                  <button
                    key={family.id}
                    type="button"
                    onClick={() => handleSelectCrate(family)}
                    className="group relative p-4 rounded-2xl border border-[#ded8ce] bg-white hover:bg-[#faf8f5] hover:border-[#2d6a4f] transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-sm min-h-[105px]"
                  >
                    {/* Keyboard shortcut tag */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-mono font-bold border border-slate-200">
                      [{idx + 1}]
                    </span>

                    {/* Japanese Family Name with Furigana */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 font-mono block">
                        {family.botanicalName}
                      </span>
                      <h4 className="text-base font-black text-slate-900 leading-tight">
                        {family.nameSi}
                      </h4>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block">
                        {family.nameJp}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Result Log Notification */}
              {inspectionLog && (
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-medium text-xs sm:text-sm transition-all shadow-2xs ${
                    inspectionLog.correct
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  {inspectionLog.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{inspectionLog.text}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODE 2: MISFIT DETECTIVE (විෂම එළවළුව සොයන්න - EXAM TRICK QUESTIONS) */}
      {/* ========================================================================= */}
      {gameMode === "misfit" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e0d8] rounded-3xl p-6 text-slate-800 space-y-4 shadow-sm text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-xs font-mono font-bold">
              <span>🔎 කෘෂිකර්ම විභාග ප්‍රශ්න අභියෝගය</span>
              <span>•</span>
              <span>Odd-One-Out Misfit Detective</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {currentMisfitQ.promptSi}
              </h2>
              <p className="text-xs text-slate-600">
                පහත දැක්වෙන එළවළු 4 න් 3 ක්ම මෙම පවුලට අයත් වන අතර, එකක් පමණක් වෙනත් පවුලකට අයත් වේ. එම විෂම එළවළුව තෝරන්න:
              </p>
            </div>

            {/* 4 Crops Inspection Grid with Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
              {currentMisfitQ.options.map((option, idx) => {
                const isSelected = misfitSelectedCropId === option.crop.id;
                let borderStyle = "border-[#ded8ce] hover:border-[#2d6a4f]";
                let bgStyle = "bg-[#fcfaf7]";

                if (misfitFeedback) {
                  if (option.isMisfit) {
                    borderStyle = "border-emerald-500 ring-2 ring-emerald-400";
                    bgStyle = "bg-emerald-50";
                  } else if (isSelected) {
                    borderStyle = "border-rose-400 ring-2 ring-rose-400";
                    bgStyle = "bg-rose-50";
                  }
                }

                return (
                  <button
                    key={`${option.crop.id}-${idx}`}
                    type="button"
                    disabled={misfitFeedback !== null}
                    onClick={() => handleMisfitChoice(option)}
                    className={`relative p-3 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer group shadow-2xs hover:shadow-xs ${borderStyle} ${bgStyle}`}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-xl overflow-hidden shadow-2xs mb-2">
                      <VegetablePhoto
                        cropId={option.crop.id}
                        photoUrl={option.crop.photoUrl}
                        nameSi={option.crop.nameSi}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[11px] font-mono font-bold text-emerald-800">
                        {option.crop.nameJpKana}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {option.crop.nameSi}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {option.crop.nameRomaji}
                      </span>
                    </div>

                    {/* Misfit badge revealed after answer */}
                    {misfitFeedback && option.isMisfit && (
                      <span className="mt-2 px-2 py-0.5 bg-emerald-700 text-white rounded-md text-[10px] font-bold">
                        ✅ විෂම එළවළුව!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation and Next Question Button */}
            {misfitFeedback && (
              <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#f7f5f0] border border-[#e5e0d8] space-y-3 text-center">
                <p
                  className={`text-sm font-bold ${
                    misfitFeedback.correct ? "text-emerald-800" : "text-rose-800"
                  }`}
                >
                  {misfitFeedback.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleNextMisfit}
                  className="px-5 py-2.5 bg-[#2d6a4f] hover:bg-[#23533e] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-2xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>මීළඟ විෂම ප්‍රශ්නය වෙත යන්න</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODE 3: DIGITAL REFERENCE (පිටු 45-46 පවුල් 12 නිල අත්පොත) */}
      {/* ========================================================================= */}
      {gameMode === "reference" && (
        <div className="space-y-5">
          {/* Reference Search and Filter Bar */}
          <div className="bg-white border border-[#e5e0d8] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="එළවළු හෝ පවුලේ නම සොයන්න (සිංහල / 日本語)..."
                className="w-full pl-9 pr-4 py-2 bg-[#fcfaf7] border border-[#ded8ce] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Family Selector Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-500 shrink-0">පවුල:</span>
              <select
                value={selectedFamilyFilter}
                onChange={(e) => setSelectedFamilyFilter(e.target.value)}
                className="bg-[#fcfaf7] border border-[#ded8ce] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="all">සියලුම පවුල් 12 (All Families)</option>
                {VEGETABLE_FAMILIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nameSi} ({f.nameJp})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 12 Families Accordion / Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VEGETABLE_FAMILIES.filter(
              (f) => selectedFamilyFilter === "all" || f.id === selectedFamilyFilter
            ).map((family) => {
              const cropsInFamily = VEGETABLE_CROPS.filter((c) => c.familyId === family.id);
              return (
                <div
                  key={family.id}
                  className="bg-white border border-[#e5e0d8] rounded-3xl p-5 space-y-3.5 shadow-2xs hover:shadow-xs transition"
                >
                  {/* Family Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-500 block">
                        {family.botanicalName}
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        {family.nameSi}
                      </h3>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block mt-0.5">
                        {family.nameJp}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                      බෝග {cropsInFamily.length}ක්
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {family.descriptionSi}
                  </p>

                  {/* Crops inside this family */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {cropsInFamily.map((crop) => (
                      <div
                        key={crop.id}
                        className="bg-[#fcfaf7] border border-[#ded8ce] p-2.5 rounded-xl flex items-center justify-between gap-3 hover:bg-white transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 relative shrink-0 rounded-lg overflow-hidden border border-slate-200">
                            <VegetablePhoto
                              cropId={crop.id}
                              photoUrl={crop.photoUrl}
                              nameSi={crop.nameSi}
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">
                                {crop.nameSi}
                              </span>
                              <span className="text-xs font-bold text-emerald-800 font-mono">
                                ({crop.nameJpKana})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {crop.nameRomaji} • {crop.nameEn}
                            </span>
                          </div>
                        </div>

                        {/* Listen Button */}
                        <button
                          type="button"
                          onClick={() => speakJapanese(crop.nameJpKana)}
                          className="p-1.5 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                          title="ජපන් උච්චාරණය අසන්න"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
