import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Gamepad2,
  Swords,
  Shield,
  Flame,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Target,
  Award,
  Maximize2,
  Minimize2,
  Heart,
  Gift,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  BookOpen,
  HelpCircle,
  Hash,
  Link as LinkIcon,
  Wheat,
  Clock,
  User,
  AlertTriangle,
  Pause,
  Play,
  DoorOpen,
  ArrowLeft
} from "lucide-react";
import { PRELOADED_KANJI } from "../data/preloadedKanji";
import { PRELOADED_VERBS } from "../data/preloadedVerbs";
import { PRELOADED_ADJECTIVES } from "../data/preloadedAdjectives";
import { preloadedCounters } from "../data/preloadedCounters";
import { PRELOADED_CONJUNCTIONS } from "../data/preloadedConjunctions";
import { PRELOADED_GRAMMAR } from "../data/preloadedGrammar";
import { agriJapaneseNouns, agriJapaneseVerbs } from "../data/agricultureJapaneseData";
import {
  SamuraiWarrior,
  MaleSamuraiSVG,
  FemaleSamuraiSVG,
  DragonSVG,
  SamuraiGender,
  SamuraiAction,
  DragonColor,
  DragonState
} from "./SamuraiGameCharacters";
import {
  BattlefieldCreature,
  BattleCreatureSVG,
  AnimalSpecies
} from "./WildAnimalCharacters";
import {
  BattlefieldAtmosphereFX,
  BattleAtmosphere,
  ATMOSPHERES,
  getNextAtmosphere
} from "./BattlefieldAtmosphereFX";
import { JapaneseBattlefieldBackground } from "./JapaneseBattlefieldBackground";

// Playful animal taunts for wrong answers as requested:
// "උත්තරේ වැරදි <sathekge namak> danna. Udaharanayak widiyata උත්තරේ වැරදි හරකො! Kiyala. Eka eka welawata eka eka ewa denna."
const FUNNY_ANIMAL_TAUNTS = [
  "උත්තරේ වැරදි හරකො! 🐮",
  "උත්තරේ වැරදි බූරුවො! 🫏",
  "උත්තරේ වැරදි මීහරකො! 🐃",
  "උත්තරේ වැරදි වඳුරෝ! 🐒",
  "උත්තරේ වැරදි ගෙම්බෝ! 🐸",
  "උත්තරේ වැරදි කුකුළෝ! 🐔",
  "උත්තරේ වැරදි වලහෝ! 🐻",
  "උත්තරේ වැරදි කිඹුලෝ! 🐊",
  "උත්තරේ වැරදි කපුටෝ! 🦅",
  "උත්තරේ වැරදි ඌරෝ! 🐷",
  "උත්තරේ වැරදි අලියෝ! 🐘",
  "උත්තරේ වැරදි ඉබ්බෝ! 🐢",
  "උත්තරේ වැරදි බල්ලෝ! 🐕",
  "උත්තරේ වැරදි පූසෝ! 🐱"
];

// Special Gifts given at every 5x combo (5x, 10x, 15x, 20x, 25x, etc.)
interface ComboReward {
  threshold: number;
  titleSi: string;
  titleJp: string;
  descriptionSi: string;
  icon: string;
  type:
    | "extra_life"
    | "fire_blade"
    | "divine_shield"
    | "ice_blade"
    | "thunder_storm"
    | "sakura_blessing"
    | "chrono_hourglass"
    | "shogun_armor"
    | "dragon_slayer";
}

const COMBO_REWARDS: Record<number, ComboReward> = {
  5: {
    threshold: 5,
    titleSi: "අමතර ජීවිතයක් (+1 Heart)",
    titleJp: "追加の命 (Tsuika no Inochi)",
    descriptionSi: "5x කොම්බෝ ජයග්‍රහණය වෙනුවෙන් රණශූරයාට අමතර ජීවිත 1ක් ලැබුණි!",
    icon: "❤️",
    type: "extra_life"
  },
  10: {
    threshold: 10,
    titleSi: "ගිනි අසිපත් බලය (2x Fire Blade)",
    titleJp: "火炎の刃 (Kaen no Yaiba)",
    descriptionSi: "ඊළඟ ප්‍රශ්න 5 සඳහා දෙගුණයක ලකුණු (2x Score) ප්‍රසාද දීමනාවක් සක්‍රීයයි!",
    icon: "🔥",
    type: "fire_blade"
  },
  15: {
    threshold: 15,
    titleSi: "දිව්‍ය පලිහ (Divine Shield)",
    titleJp: "神聖の盾 (Shinsei no Tate)",
    descriptionSi: "ඊළඟට සිදුවන වැරැද්දකින් ජීවිතයක් අහිමි වීම වළක්වන දිව්‍ය පලිහක් හිමිවිය!",
    icon: "🛡️",
    type: "divine_shield"
  },
  20: {
    threshold: 20,
    titleSi: "කැටි ගැසෙන අයිස් අසිපත (Freezing Ice Blade)",
    titleJp: "氷結の刃 (Hyoketsu no Yaiba)",
    descriptionSi: "ඊළඟ ප්‍රශ්න 5 සඳහා මකරුන් පැමිණීමේ වේගය 50% කින් අඩුවේ (Slow Motion)!",
    icon: "❄️",
    type: "ice_blade"
  },
  25: {
    threshold: 25,
    titleSi: "අකුණු චණ්ඩමාරුතය (Thunder Storm Zap)",
    titleJp: "雷鳴の嵐 (Raimei no Arashi)",
    descriptionSi: "ක්ෂණික +800 ලකුණු සහ ළඟාවන මකරාව ආපසු කෙළවරට තල්ලු කර දමයි!",
    icon: "⚡",
    type: "thunder_storm"
  },
  30: {
    threshold: 30,
    titleSi: "සකුරා දිව්‍ය ආශිර්වාදය (Sakura Blessing)",
    titleJp: "桜の恵み (Sakura no Megumi)",
    descriptionSi: "සම්පූර්ණ ජීවිත 2ක් (+2.0 Hearts) සහ +1200 ලකුණු ප්‍රසාදයක්!",
    icon: "🌸",
    type: "sakura_blessing"
  },
  35: {
    threshold: 35,
    titleSi: "කාල සුළි හෝරා යන්ත්‍රය (Chrono Hourglass)",
    titleJp: "時間の砂時計 (Sunadokei)",
    descriptionSi: "කාලය ආපසු හැරවීම! මකරා ආපසු කඳවුරටම යවා අමතර කාලයක් ලබාදේ!",
    icon: "⏳",
    type: "chrono_hourglass"
  },
  40: {
    threshold: 40,
    titleSi: "මහා ෂෝගුන් රන් ආන්නාහය (Grand Shogun Golden Armor)",
    titleJp: "将軍の黄金甲冑 (Shogun no Katchu)",
    descriptionSi: "අසමසම 40x කොම්බෝ! +2500 ලකුණු සහ ද්විත්ව දිව්‍ය පලිහක් (Double Shield)!",
    icon: "👑",
    type: "shogun_armor"
  },
  45: {
    threshold: 45,
    titleSi: "මිථ්‍යා ඩ්‍රැගන් විනාශකාරී බලය (Mythic Dragon Slayer Aura)",
    titleJp: "龍殺しのオーラ (Ryu-goroshi)",
    descriptionSi: "+3500 ලකුණු සහ රණශූරයා වටා පුරාවෘත්ත රන්වන් ප්‍රහාරක ආලෝකය!",
    icon: "🐉",
    type: "dragon_slayer"
  }
};

// Web Audio API Sound Synthesizer (Pure Web Audio - zero external network dependencies)
class SamuraiSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Katana Slash Whoosh
  playSlash() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.14;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.13);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    } catch {
      // Audio might be restricted
    }
  }

  // Heavy Metal Hit / Slice
  playHeavyHit() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
      this.playSlash();
    } catch {
      // safe fallback
    }
  }

  // Jump Whoosh
  playJump() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.22);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // safe fallback
    }
  }

  // Dragon Roaring Fire Breath
  playFireBreath() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(1300, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.48);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.49);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.5);
    } catch {
      // safe fallback
    }
  }

  // Dragon Claw Strike (Timeout Hit)
  playDragonClaw() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    } catch {
      // safe fallback
    }
  }

  // Timer Tick warning
  playTick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // safe fallback
    }
  }

  // Fanfare for 5x combo gift
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.28, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.38);
      });
    } catch {
      // safe fallback
    }
  }

  // Wrong Answer Buzzer / Clang
  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // safe fallback
    }
  }

  // Game Over dramatic gong
  playGameOver() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [130, 98, 65].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.85);
      });
    } catch {
      // safe fallback
    }
  }

  // Ice Freeze Chime
  playIceFreeze() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [1200, 1600, 2100].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.32);
      });
    } catch {
      // safe fallback
    }
  }

  // Thunder Zap Tempest
  playThunderZap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(800, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.3);
    } catch {
      // safe fallback
    }
  }

  // Chrono Hourglass Time Warp
  playChronoHourglass() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // safe fallback
    }
  }

  // Shogun Golden Armor Fanfare
  playShogunArmor() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    } catch {
      // safe fallback
    }
  }
}

// Available Quiz Categories
export type GameCategory =
  | "all_mixed"
  | "kanji"
  | "verbs"
  | "adjectives"
  | "counters"
  | "conjunctions"
  | "grammar"
  | "agriculture";

interface CategoryMeta {
  id: GameCategory;
  titleSi: string;
  titleJp: string;
  descriptionSi: string;
  badge: string;
  color: string;
  count: number;
}

const GAME_CATEGORIES: CategoryMeta[] = [
  {
    id: "all_mixed",
    titleSi: "සියලු අංශ මිශ්‍ර (All-in-One Mixed Challenge)",
    titleJp: "全伝授混合修行",
    descriptionSi: "කන්ජි, ක්‍රියාපද, විශේෂණ, කවුන්ටර් සහ කෘෂිකාර්මික වචන සියල්ල එකතු කළ මහා සමුරායි අභියෝගය.",
    badge: "ප්‍රධාන අභියෝගය",
    color: "from-amber-600 to-rose-700",
    count: 350
  },
  {
    id: "kanji",
    titleSi: "JFT & N5/N4 කන්ජි (Kanji Mastery)",
    titleJp: "漢字修行",
    descriptionSi: "විභාග සඳහා අත්‍යවශ්‍ය කන්ජි අක්ෂර, ඒවායේ කියවීම් සහ සිංහල තේරුම් නිවැරදිව තෝරා ජයගන්න.",
    badge: "කන්ජි 100+",
    color: "from-red-600 to-rose-700",
    count: PRELOADED_KANJI.length
  },
  {
    id: "verbs",
    titleSi: "ජපන් ක්‍රියාපද (Verbs & Forms)",
    titleJp: "動詞活用",
    descriptionSi: "Masu-form, Dictionary form, Te-form සහ ඒවායේ සිංහල ක්‍රියාකාරකම් පුහුණුව.",
    badge: "ක්‍රියාපද 50+",
    color: "from-blue-600 to-indigo-700",
    count: PRELOADED_VERBS.length
  },
  {
    id: "adjectives",
    titleSi: "විශේෂණ පද (i & na Adjectives)",
    titleJp: "形容詞鍛錬",
    descriptionSi: "ඉ-විශේෂණ සහ න-විශේෂණ පදවල නිවැරදි සිංහල අර්ථ හඳුනාගැනීම.",
    badge: "විශේෂණ 35+",
    color: "from-emerald-600 to-teal-700",
    count: PRELOADED_ADJECTIVES.length
  },
  {
    id: "counters",
    titleSi: "ගණන් කිරීමේ ප්‍රත්‍ය (Counters)",
    titleJp: "助数詞修行",
    descriptionSi: "පුද්ගලයින්, ද්‍රව්‍ය, සතුන්, පොත්, බීම ආදිය ගණින නිල ජපන් ප්‍රත්‍ය.",
    badge: "කවුන්ටර් 25+",
    color: "from-purple-600 to-fuchsia-700",
    count: preloadedCounters.length
  },
  {
    id: "conjunctions",
    titleSi: "සම්බන්ධක පද (Conjunctions)",
    titleJp: "接続詞の道",
    descriptionSi: "වාක්‍ය එකිනෙක යා කරන වැදගත් සම්බන්ධක පද (そして, それから, しかし...).",
    badge: "සම්බන්ධක 30+",
    color: "from-orange-600 to-amber-700",
    count: PRELOADED_CONJUNCTIONS.length
  },
  {
    id: "grammar",
    titleSi: "ව්‍යාකරණ රටා (Grammar Points)",
    titleJp: "文法結界",
    descriptionSi: "JFT සහ JLPT මූලික ව්‍යාකරණ ව්‍යුහයන් සහ ඒවායේ නිවැරදි භාවිතය.",
    badge: "ව්‍යාකරණ 20+",
    color: "from-cyan-600 to-blue-700",
    count: PRELOADED_GRAMMAR.length
  },
  {
    id: "agriculture",
    titleSi: "කෘෂිකාර්මික වචන (SSW Agriculture)",
    titleJp: "農業特定技能単語",
    descriptionSi: "SSW කෘෂිකර්ම විභාගයේ නිල පෙළපොත් දෙකෙන්ම ලබාගත් ප්‍රායෝගික වචන සහ ක්‍රියාපද.",
    badge: "කෘෂිකර්ම 60+",
    color: "from-lime-600 to-emerald-700",
    count: agriJapaneseNouns.length + agriJapaneseVerbs.length
  }
];

// Battlefield Creature Lair Member: either sleeping in ground nest or attacking the samurai
// "Machan uda idan nida ganna bane e nisa udin piyabanna puluwan hama sathekmath bima thamai nidagena inna ona."
// "E wagema hama aluth prashnekadima aluth sathek aharila awidina satheknam biminuth piyabana satheknam piyabagenath enawa."
export const INITIAL_LAIR_CREATURES: BattlefieldCreature[] = [
  // --- Left Ground Lair (All sleep neatly at baseBottom on the ground) ---
  {
    id: "c_bear",
    nameSi: "දුඹුරු වලසා",
    species: "bear",
    movementType: "walking",
    color: "red",
    slot: 0,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 26.5,
    isActiveAttacker: false,
    baseLeft: 1.5,
    baseBottom: 5,
    scale: 0.8
  },
  {
    id: "c_owl",
    nameSi: "රාත්‍රී බකමූණා",
    species: "owl",
    movementType: "flying",
    color: "green",
    slot: 1,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 27.0,
    isActiveAttacker: false,
    baseLeft: 6.0,
    baseBottom: 7,
    scale: 0.76
  },
  {
    id: "c_crocodile",
    nameSi: "මහා කිඹුලා",
    species: "crocodile",
    movementType: "walking",
    color: "green",
    slot: 2,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 28.0,
    isActiveAttacker: false,
    baseLeft: 10.5,
    baseBottom: 4,
    scale: 0.8
  },
  {
    id: "c_parrot",
    nameSi: "වර්ණවත් ගිරවා",
    species: "parrot",
    movementType: "flying",
    color: "gold",
    slot: 3,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 25.5,
    isActiveAttacker: false,
    baseLeft: 15.0,
    baseBottom: 7,
    scale: 0.74
  },
  {
    id: "c_elephant",
    nameSi: "රාජකීය අලියා",
    species: "elephant",
    movementType: "walking",
    color: "gold",
    slot: 4,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 29.5,
    isActiveAttacker: false,
    baseLeft: 19.5,
    baseBottom: 5,
    scale: 0.82
  },
  {
    id: "c_dragon_red",
    nameSi: "රතු අග්නි මකරා",
    species: "dragon_red",
    movementType: "flying",
    color: "red",
    slot: 5,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 26.0,
    isActiveAttacker: false,
    baseLeft: 24.0,
    baseBottom: 6,
    scale: 0.76
  },

  // --- Right Ground Lair (All sleep neatly at baseBottom on the ground) ---
  {
    id: "c_lion",
    nameSi: "කැලෑ සිංහයා",
    species: "lion",
    movementType: "walking",
    color: "gold",
    slot: 6,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 27.0,
    isActiveAttacker: false,
    baseRight: 1.5,
    baseBottom: 5,
    scale: 0.8
  },
  {
    id: "c_pelican",
    nameSi: "සුදු මානාවා",
    species: "pelican",
    movementType: "flying",
    color: "green",
    slot: 7,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 28.5,
    isActiveAttacker: false,
    baseRight: 6.0,
    baseBottom: 7,
    scale: 0.76
  },
  {
    id: "c_monkey",
    nameSi: "වේගවත් වඳුරා",
    species: "monkey",
    movementType: "walking",
    color: "red",
    slot: 8,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 25.0,
    isActiveAttacker: false,
    baseRight: 10.5,
    baseBottom: 4,
    scale: 0.76
  },
  {
    id: "c_butterfly",
    nameSi: "රන් සමනලයා",
    species: "butterfly",
    movementType: "flying",
    color: "gold",
    slot: 9,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 26.0,
    isActiveAttacker: false,
    baseRight: 15.0,
    baseBottom: 8,
    scale: 0.72
  },
  {
    id: "c_dog",
    nameSi: "සටන් සුනඛයා",
    species: "dog",
    movementType: "walking",
    color: "green",
    slot: 10,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 26.5,
    isActiveAttacker: false,
    baseRight: 19.5,
    baseBottom: 4,
    scale: 0.78
  },
  {
    id: "c_dragon_gold",
    nameSi: "රන්වන් මකරා",
    species: "dragon_gold",
    movementType: "flying",
    color: "gold",
    slot: 11,
    state: "sleep",
    fireBreathActive: false,
    progress: 0,
    totalTravelSeconds: 29.0,
    isActiveAttacker: false,
    baseRight: 24.0,
    baseBottom: 6,
    scale: 0.76
  }
];

export function SamuraiGameView() {
  // Game Audio Engine
  const sound = useMemo(() => new SamuraiSoundEngine(), []);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [sound, soundEnabled]);

  // Main Game States
  const [gameState, setGameState] = useState<"select_category" | "playing" | "game_over">("select_category");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all_mixed");

  // Character Selection (Male or Female) as requested:
  // "Game eka patan gaddi Maleda Femaleda kiyala thoranna enna ona."
  const [selectedGender, setSelectedGender] = useState<SamuraiGender>("male");

  // Health: 5.0 Hearts total (50 HP points). 1 timeout claw strike = 0.1 heart (10% of a heart).
  // 1 wrong answer = 1.0 full heart burned by dragon fire!
  const [lives, setLives] = useState<number>(5.0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("samurai_slasher_highscore");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Combat Stats
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState<number>(0);

  // Active Buffs (Expanded Gifts)
  const [hasShield, setHasShield] = useState<number>(0);
  const [fireBladeCharges, setFireBladeCharges] = useState<number>(0);
  const [iceBladeCharges, setIceBladeCharges] = useState<number>(0); // slows approaching dragon by 50%
  const [shogunArmorActive, setShogunArmorActive] = useState<boolean>(false);

  // Continuous Stable Battlefield Creatures (Wild Animals & Dragons Lair)
  // "Makaru godak depaththe bima nidagena innawa. Hama prashnekadima eka makarek random widiyata aharila awidagena hari piyabagena hari enna ona."
  // "Machan uda idan nida ganna bane e nisa udin piyabanna puluwan hama sathekmath bima thamai nidagena inna ona."
  const [creatures, setCreatures] = useState<BattlefieldCreature[]>(INITIAL_LAIR_CREATURES);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Samurai Animation & Position
  const [action, setAction] = useState<SamuraiAction>("idle");
  const [facingRight, setFacingRight] = useState<boolean>(true);
  const [samuraiYOffset, setSamuraiYOffset] = useState<number>(0); // for leaping high into the sky!
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Floating Combat Notification (damage or bonus)
  const [combatAlert, setCombatAlert] = useState<{ text: string; color: string } | null>(null);

  // UI / Feedback States
  const [wrongTaunt, setWrongTaunt] = useState<{ message: string; correctAnswer: string } | null>(null);
  const [unlockedReward, setUnlockedReward] = useState<ComboReward | null>(null);
  const [slicedOptionId, setSlicedOptionId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentAtmosphere, setCurrentAtmosphere] = useState<BattleAtmosphere>("sakura_blizzard");
  const containerRef = useRef<HTMLDivElement>(null);

  // Current Question
  const [currentQuestion, setCurrentQuestion] = useState<{
    id: string;
    promptCategory: string;
    promptSi: string;
    correctAnswer: {
      id: string;
      primaryText: string;
      meaning: string;
    };
    options: Array<{
      id: string;
      primaryText: string;
      subText?: string;
      isCorrect: boolean;
    }>;
  } | null>(null);

  // Native Fullscreen Handler with Escape listener
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(true));
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(true));
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false));
      } else {
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  // Trigger floating alert
  const showCombatAlert = (text: string, color: string = "text-amber-300") => {
    setCombatAlert({ text, color });
    setTimeout(() => {
      setCombatAlert(null);
    }, 1800);
  };

  // Trigger Screen Shake - disabled per user directive: "Samurai game eke prashnekata uththare waradunama nikan gassena gathiya nathi karanna."
  const triggerShake = () => {
    // Screen shaking completely disabled
  };

  // Trigger Samurai Action
  const triggerSamuraiMove = useCallback((newAction: SamuraiAction, duration: number = 600) => {
    setAction(newAction);
    if (newAction === "jump" || newAction === "jump_slash") {
      setSamuraiYOffset(-140); // Leap high into the sky!
      sound.playJump();
    }
    setTimeout(() => {
      setAction("idle");
      setSamuraiYOffset(0);
    }, duration);
  }, [sound]);

  // Wakes up one random sleeping creature from the ground lair to attack the samurai:
  // "Hama aluth prashnekadima aluth sathek aharila awidina satheknam biminuth piyabana satheknam piyabagenath enawa. Un 10s awama kalekin samuraige age wadinna ona uparima kalaya 15s."
  const wakeRandomCreature = useCallback((lair?: BattlefieldCreature[], excludeId?: string) => {
    setCreatures((prevList) => {
      const list = lair || prevList;
      const candidates = list.filter((c) => c.id !== excludeId);
      if (candidates.length === 0) return list;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      // User specified approach window: Minimum 25s, maximum 30s
      const travelDuration = Number((25.0 + Math.random() * 5.0).toFixed(1));

      return list.map((c) => {
        if (c.id === pick.id) {
          return {
            ...c,
            state: (c.movementType === "flying" ? "fly" : "walk") as DragonState,
            fireBreathActive: false,
            progress: 0,
            totalTravelSeconds: travelDuration,
            isActiveAttacker: true
          };
        }
        return {
          ...c,
          state: "sleep" as DragonState,
          fireBreathActive: false,
          progress: 0,
          isActiveAttacker: false
        };
      });
    });
    setIsTimerRunning(true);
  }, []);

  // Helper to generate a new question based on category
  const generateQuestion = useCallback((cat: GameCategory) => {
    // Category Question Builders
    if (cat === "kanji") {
      const shuffled = [...PRELOADED_KANJI].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "JFT / N5 කන්ජි අභියෝගය",
        promptSi: `"${target.sinhalaMeaning}" යන අර්ථය නිරූපණය කරන කන්ජි අක්ෂරය තෝරන්න:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.kanji,
          meaning: `${target.furigana} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.kanji,
          subText: c.furigana,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "verbs") {
      const shuffled = [...PRELOADED_VERBS].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "ජපන් ක්‍රියාපද පුහුණුව",
        promptSi: `"${target.sinhalaMeaning}" යන ක්‍රියාව සඳහා නිවැරදි ජපන් පදය තෝරන්න:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.kanji || target.masu,
          meaning: `${target.masu} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.masu,
          subText: c.te ? `Te: ${c.te}` : c.dictionary,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "adjectives") {
      const shuffled = [...PRELOADED_ADJECTIVES].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "විශේෂණ පද අභ්‍යාසය",
        promptSi: `"${target.sinhalaMeaning}" යන අර්ථය දෙන විශේෂණ පදය තෝරන්න:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.kanji || target.hiragana,
          meaning: `${target.hiragana} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.kanji || c.hiragana,
          subText: c.hiragana,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "counters") {
      const shuffled = [...preloadedCounters].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "ගණන් කිරීමේ ප්‍රත්‍ය (Counters)",
        promptSi: `"${target.categorySinhala}" ගණනය කිරීම සඳහා භාවිත කරන නිවැරදි ප්‍රත්‍යය:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.counterChar,
          meaning: `${target.hiraganaChar} (${target.categorySinhala})`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.counterChar,
          subText: c.hiraganaChar,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "conjunctions") {
      const shuffled = [...PRELOADED_CONJUNCTIONS].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "සම්බන්ධක පද (Conjunctions)",
        promptSi: `"${target.sinhalaMeaning}" යන සම්බන්ධක පදයේ නිවැරදි ජපන් යෙදුම:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.title,
          meaning: `${target.romaji} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.title,
          subText: c.romaji,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "grammar") {
      const shuffled = [...PRELOADED_GRAMMAR].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "ව්‍යාකරණ රටා (Grammar)",
        promptSi: `"${target.pattern}" රටාවේ නිවැරදි සිංහල තේරුම තෝරන්න:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.title,
          meaning: `${target.pattern} - ${target.sinhalaExplanation}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.title,
          subText: c.pattern,
          isCorrect: c.id === target.id
        }))
      };
    }

    if (cat === "agriculture") {
      const shuffled = [...agriJapaneseNouns].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "SSW කෘෂිකර්ම විභාග වචන",
        promptSi: `"${target.meaningSi}" යන කෘෂිකාර්මික වචනය සඳහා නිවැරදි ජපන් පදය:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.kanji || target.wordJp,
          meaning: `${target.wordJp} (${target.romaji})`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: target.kanji || c.wordJp,
          subText: c.romaji,
          isCorrect: c.id === target.id
        }))
      };
    }

    // Default: All Mixed Challenge
    const pool = Math.random();
    if (pool < 0.35) {
      const shuffled = [...PRELOADED_KANJI].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "කන්ජි අක්ෂර අභියෝගය",
        promptSi: `"${target.sinhalaMeaning}" හඟවන කන්ජි අක්ෂරය තෝරන්න:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.kanji,
          meaning: `${target.furigana} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.kanji,
          subText: c.furigana,
          isCorrect: c.id === target.id
        }))
      };
    } else if (pool < 0.65) {
      const shuffled = [...PRELOADED_VERBS].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const distractors = shuffled.slice(1, 4);
      const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: target.id,
        promptCategory: "ක්‍රියාපද අභ්‍යාසය",
        promptSi: `"${target.sinhalaMeaning}" සඳහා ගැළපෙන ජපන් ක්‍රියාපදය:`,
        correctAnswer: {
          id: target.id,
          primaryText: target.masu,
          meaning: `${target.masu} - ${target.sinhalaMeaning}`
        },
        options: allChoices.map((c) => ({
          id: c.id,
          primaryText: c.masu,
          subText: c.te || c.dictionary,
          isCorrect: c.id === target.id
        }))
      };
    }

    // Mix in Agriculture
    const shuffled = [...agriJapaneseNouns].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const distractors = shuffled.slice(1, 4);
    const allChoices = [target, ...distractors].sort(() => Math.random() - 0.5);
    return {
      id: target.id,
      promptCategory: "කෘෂිකර්ම සහ එදිනෙදා ජපන්",
      promptSi: `"${target.meaningSi}" සඳහා නිවැරදි ජපන් වචනය:`,
      correctAnswer: {
        id: target.id,
        primaryText: target.kanji || target.wordJp,
        meaning: `${target.wordJp} (${target.romaji})`
      },
      options: allChoices.map((c) => ({
        id: c.id,
        primaryText: c.kanji || c.wordJp,
        subText: c.romaji,
        isCorrect: c.id === target.id
      }))
    };
  }, []);

  // Contact Damage Handler: Triggered when creature physically reaches the Samurai!
  // "satha age wadunama life eken 10% adu wenna ona. Prashne ekama thiyenna ona uththarayak select karanakanma.
  // Habai thawa sathek kalin satha age waduna welema awadi wela samurai gawata ara widiyatama enna ona.
  // Meka uththarayak denakanma digatama wenna ona. Eka sathekgen eka parai damage wenne."
  const handleCreatureContactDamage = useCallback((attacker: BattlefieldCreature) => {
    triggerShake();
    sound.playDragonClaw();
    setAction("hurt");
    setTimeout(() => {
      setAction("idle");
    }, 500);

    // If divine shield is active, shield absorbs it!
    if (hasShield > 0) {
      setHasShield((s) => Math.max(0, s - 1));
      showCombatAlert("🛡️ දිව්‍ය පලිහෙන් ප්‍රහාරය වැළැක්වුණි!", "text-cyan-300 font-black");
    } else {
      setLives((prev) => {
        const nextLives = Number(Math.max(0, prev - 0.1).toFixed(1));
        if (nextLives <= 0) {
          setIsTimerRunning(false);
          sound.playGameOver();
          setTimeout(() => {
            setGameState("game_over");
          }, 800);
        }
        return nextLives;
      });
      showCombatAlert(`💥 ${attacker.nameSi}ගේ පහර වැදුණා! (-10% ජීවිතය)`, "text-rose-400 font-black");
    }

    // Attacker delivers its single damage and returns to sleep on the ground!
    // At that exact moment, ANOTHER sleeping creature wakes up and approaches!
    // The current question remains completely unchanged until the player answers!
    setCreatures((prevList) => {
      const otherSleeping = prevList.filter((c) => c.id !== attacker.id);
      const nextAttacker = otherSleeping[Math.floor(Math.random() * otherSleeping.length)];
      // Next attacker approaches: Minimum 25s, maximum 30s
      const travelDuration = Number((25.0 + Math.random() * 5.0).toFixed(1));

      return prevList.map((c) => {
        if (c.id === nextAttacker.id) {
          return {
            ...c,
            state: (c.movementType === "flying" ? "fly" : "walk") as DragonState,
            progress: 0,
            totalTravelSeconds: travelDuration,
            isActiveAttacker: true,
            fireBreathActive: false
          };
        }
        if (c.id === attacker.id) {
          return {
            ...c,
            state: "sleep" as DragonState,
            progress: 0,
            isActiveAttacker: false,
            fireBreathActive: false
          };
        }
        return c;
      });
    });
  }, [hasShield, sound]);

  // Real-time Creature Travel Animation Loop (100ms interval)
  // "Un 10s awama kalekin samuraige age wadinna ona uparima kalaya 15s. satha age wadunama life eken 10% adu wenna ona."
  useEffect(() => {
    if (gameState !== "playing" || !isTimerRunning || slicedOptionId || isPaused) return;

    const interval = setInterval(() => {
      setCreatures((prevList) => {
        const activeIdx = prevList.findIndex((c) => c.isActiveAttacker);
        if (activeIdx === -1) return prevList;

        const activeCreature = prevList[activeIdx];
        // If Ice Blade buff is active, creature moves at 50% speed (Slow Motion)
        const speedModifier = iceBladeCharges > 0 ? 0.5 : 1.0;
        const step = (0.1 / activeCreature.totalTravelSeconds) * speedModifier;
        const nextProgress = activeCreature.progress + step;

        const remainingSeconds = Math.max(0, (1 - nextProgress) * activeCreature.totalTravelSeconds);
        // Play tick sound when approaching within 3 seconds
        if (remainingSeconds <= 3.0 && Math.floor(remainingSeconds * 10) % 10 === 0) {
          sound.playTick();
        }

        // Creature collides with the Samurai!
        if (nextProgress >= 1.0) {
          handleCreatureContactDamage(activeCreature);
          return prevList;
        }

        return prevList.map((c, idx) =>
          idx === activeIdx ? { ...c, progress: nextProgress } : c
        );
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, isTimerRunning, slicedOptionId, isPaused, iceBladeCharges, handleCreatureContactDamage, sound]);

  // Start / Restart Game with Ground Sleeping Lair
  const handleStartGame = (cat: GameCategory) => {
    setSelectedCategory(cat);
    setGameState("playing");
    setIsPaused(false);
    setLives(5.0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setHasShield(0);
    setFireBladeCharges(0);
    setIceBladeCharges(0);
    setShogunArmorActive(false);
    setWrongTaunt(null);
    setUnlockedReward(null);
    setSlicedOptionId(null);
    setSamuraiYOffset(0);
    setAction("idle");
    wakeRandomCreature(INITIAL_LAIR_CREATURES);
    setCurrentQuestion(generateQuestion(cat));
    setCurrentAtmosphere(getNextAtmosphere("celestial_rays"));
  };

  // Slicing an Option in Battle
  // "Hari uththarayak dunnoth samuraita attack karapu saha e weddi lagata emin inna aharunu sathawa marala danna ona."
  const handleSliceChoice = (option: { id: string; primaryText: string; subText?: string; isCorrect: boolean }) => {
    if (gameState !== "playing" || !currentQuestion || slicedOptionId || isPaused) return;

    setSlicedOptionId(option.id);
    setIsTimerRunning(false); // pause timer during animation

    const activeCreature = creatures.find((c) => c.isActiveAttacker) || creatures[0];

    if (option.isCorrect) {
      // Samurai slashes in direction of the active creature
      const isLeft = activeCreature.baseLeft !== undefined;
      setFacingRight(isLeft);

      if (activeCreature.movementType === "flying") {
        triggerSamuraiMove("jump_slash", 700);
        sound.playHeavyHit();
      } else {
        triggerSamuraiMove("combo", 600);
        sound.playHeavyHit();
      }

      // Active creature is slain!
      setCreatures((prev) =>
        prev.map((c) =>
          c.id === activeCreature.id ? { ...c, state: "dead" as DragonState } : c
        )
      );

      const isFireBlade = fireBladeCharges > 0;
      if (isFireBlade) {
        setFireBladeCharges((c) => Math.max(0, c - 1));
      }
      if (iceBladeCharges > 0) {
        setIceBladeCharges((c) => Math.max(0, c - 1));
      }

      const points = (100 + combo * 25) * (isFireBlade ? 2 : 1) * (shogunArmorActive ? 1.5 : 1);
      const newScore = Math.round(score + points);
      const newCombo = combo + 1;

      setScore(newScore);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setCorrectAnswersCount((c) => c + 1);

      showCombatAlert(`+${points} Pts! ⚔️ ${activeCreature.nameSi} විනාශ විය!`, "text-amber-300");

      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem("samurai_slasher_highscore", newScore.toString());
        } catch {
          // ignore
        }
      }

      // Check for 5x Combo Rewards (5x, 10x, 15x, 20x, 25x, 30x, 35x, 40x, 45x...)
      if (newCombo > 0 && newCombo % 5 === 0) {
        const reward = COMBO_REWARDS[newCombo] || {
          threshold: newCombo,
          titleSi: `${newCombo}x Combo දීමනාව (+${newCombo * 60} pts)`,
          titleJp: "連続切り達成 (Renzoku Kiri)",
          descriptionSi: `${newCombo}x අඛණ්ඩ කඩු ප්‍රහාර වෙනුවෙන් රණශූරයාට ප්‍රසාද දීමනා හිමිවිය!`,
          icon: "⚡",
          type: "extra_life" as const
        };

        setUnlockedReward(reward);
        sound.playFanfare();

        // Apply Reward Effect
        if (reward.type === "extra_life") {
          setLives((l) => Math.min(5.0, Number((l + 1.0).toFixed(1))));
        } else if (reward.type === "fire_blade") {
          setFireBladeCharges((c) => c + 5);
        } else if (reward.type === "divine_shield") {
          setHasShield((s) => s + 1);
        } else if (reward.type === "ice_blade") {
          setIceBladeCharges((c) => c + 5);
          sound.playIceFreeze();
        } else if (reward.type === "thunder_storm") {
          setScore((s) => s + 800);
          sound.playThunderZap();
          setCreatures((prev) =>
            prev.map((c) => (c.isActiveAttacker ? { ...c, progress: 0 } : c))
          );
        } else if (reward.type === "sakura_blessing") {
          setLives((l) => Math.min(5.0, Number((l + 2.0).toFixed(1))));
          setScore((s) => s + 1200);
        } else if (reward.type === "chrono_hourglass") {
          sound.playChronoHourglass();
          setCreatures((prev) =>
            prev.map((c) => (c.isActiveAttacker ? { ...c, progress: 0 } : c))
          );
        } else if (reward.type === "shogun_armor") {
          sound.playShogunArmor();
          setShogunArmorActive(true);
          setHasShield((s) => s + 2);
          setScore((s) => s + 2500);
        } else if (reward.type === "dragon_slayer") {
          sound.playShogunArmor();
          setScore((s) => s + 3500);
        }

        setTimeout(() => {
          setUnlockedReward(null);
        }, 3200);
      }

      // Proceed to next question: put defeated creature back to sleep, wake up next random creature!
      // "E wagema hama aluth prashnekadima aluth sathek aharila awidina satheknam biminuth piyabana satheknam piyabagenath enawa."
      setTimeout(() => {
        setSlicedOptionId(null);
        setCreatures((prev) => {
          const resetList = prev.map((c) =>
            c.id === activeCreature.id
              ? { ...c, state: "sleep" as DragonState, progress: 0, isActiveAttacker: false }
              : c
          );
          wakeRandomCreature(resetList, activeCreature.id);
          return resetList;
        });
        setCurrentQuestion(generateQuestion(selectedCategory));
        setCurrentAtmosphere((prev) => getNextAtmosphere(prev));
      }, 700);
    } else {
      // WRONG ANSWER: Active creature roars / breathes fire at Samurai!
      setCreatures((prev) =>
        prev.map((c) =>
          c.id === activeCreature.id
            ? { ...c, state: "breathe_fire" as DragonState, fireBreathActive: true }
            : c
        )
      );

      sound.playFireBreath();
      setAction("hurt");

      const randomTaunt = FUNNY_ANIMAL_TAUNTS[Math.floor(Math.random() * FUNNY_ANIMAL_TAUNTS.length)];
      setWrongTaunt({
        message: randomTaunt,
        correctAnswer: `${currentQuestion.correctAnswer.primaryText} (${currentQuestion.correctAnswer.meaning})`
      });

      setCombo(0);
      setWrongAnswersCount((w) => w + 1);

      // Check Divine Shield protection
      if (hasShield > 0) {
        sound.playSlash();
        setHasShield((s) => s - 1);
        showCombatAlert("🛡️ දිව්‍ය පලිහෙන් ප්‍රහාරය වැළැක්වුණි!", "text-cyan-300");
      } else {
        sound.playWrong();
        setLives((prev) => {
          const nextLives = Number(Math.max(0, prev - 1.0).toFixed(1));
          if (nextLives <= 0) {
            sound.playGameOver();
            setTimeout(() => {
              setGameState("game_over");
            }, 1400);
          }
          return nextLives;
        });
        showCombatAlert("සත්වයාගේ දරුණු ප්‍රහාරය! -1 සම්පූර්ණ ජීවිතයක් දැවී ගියේය! 🔥", "text-red-400");
      }

      // Keep the SAME question! User directive: "E wagema uththare waradunama wena prashnayak denna epa."
      // Push the attacking creature back slightly so student can re-attempt the exact same question!
      setTimeout(() => {
        setWrongTaunt(null);
        setSlicedOptionId(null);
        setAction("idle");
        setIsTimerRunning(true);
        setCreatures((prev) =>
          prev.map((c) =>
            c.id === activeCreature.id
              ? {
                  ...c,
                  state: (c.movementType === "flying" ? "fly" : "walk") as DragonState,
                  progress: Math.max(0, c.progress - 0.3),
                  fireBreathActive: false
                }
              : c
          )
        );
        // Do NOT change question! currentQuestion stays the same.
      }, 1500);
    }
  };

  // Keyboard shortcut support (1, 2, 3, 4 to slice options)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (gameState === "playing" && currentQuestion && !slicedOptionId) {
        const key = e.key;
        if (key === "1" && currentQuestion.options[0]) handleSliceChoice(currentQuestion.options[0]);
        if (key === "2" && currentQuestion.options[1]) handleSliceChoice(currentQuestion.options[1]);
        if (key === "3" && currentQuestion.options[2]) handleSliceChoice(currentQuestion.options[2]);
        if (key === "4" && currentQuestion.options[3]) handleSliceChoice(currentQuestion.options[3]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, currentQuestion, slicedOptionId]);

  // Active Creature approach metrics for HUD:
  // User requirement: "Minimum 25s maximum 30s. Un 25s-30s athulatha samuraige age wadinna ona."
  const activeCreature = creatures.find((c) => c.isActiveAttacker) || creatures[0];
  const activeRemainingSec = activeCreature
    ? Math.max(0, (1 - activeCreature.progress) * activeCreature.totalTravelSeconds)
    : 28.0;
  const approxDistanceMeters = activeCreature
    ? Math.max(0, Math.round((1 - activeCreature.progress) * 30))
    : 30;
  const timerProgress = activeCreature ? activeCreature.progress : 0;

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[99999] w-screen h-screen m-0 p-0 bg-[#060911] text-white overflow-hidden select-none"
          : "space-y-6"
      }
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & GLOBAL GAME CONTROLS (Hidden in Full Screen) */}
      {/* User instruction: "Thawa machan Full Screen dunnama game eka witharak mulu screen ekema hitina widiyata hadanna navigation bars nathuwa." */}
      {/* ========================================================================= */}
      {!isFullscreen && (
        <div className="bg-linear-to-r from-[#1b2a24] via-[#2d6a4f] to-[#17382b] text-white p-4 sm:p-5 rounded-3xl shadow-md border border-emerald-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-2xl shrink-0">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  සමුරායි එදිරිව වන සතුන් (Samurai vs Wild Animals Battle)
                </h2>
                <span className="px-2 py-0.5 bg-white/10 text-emerald-100 rounded-md text-[10px] font-mono font-bold hidden sm:inline">
                  武士道・野生獣
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 font-medium">
                තත්පර 25-30 අතර නිවැරදි පිළිතුර දී ළඟාවන සතුන් පරාජය කරන්න! සත්වයා ඇඟේ හැපුණොත් 10%ක් ජීවිතය අඩුවේ!
              </p>
            </div>
          </div>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            {/* Quick Warrior Gender Switch */}
            <button
              type="button"
              onClick={() => setSelectedGender((g) => (g === "male" ? "female" : "male"))}
              className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="සමුරායි රණශූරයා මාරු කරන්න"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>{selectedGender === "male" ? "👦 කුමරා" : "👧 කුමරිය"}</span>
            </button>

            {/* Playing In-Game Controls: Pause, Restart, Exit */}
            {gameState === "playing" && (
              <>
                {/* Pause Button */}
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isPaused
                      ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/50 animate-pulse"
                      : "bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border-amber-300/40"
                  }`}
                  title={isPaused ? "ක්‍රීඩාව නැවත අරඹන්න (Resume)" : "ක්‍රීඩාව නවත්වන්න (Pause)"}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-300" /> : <Pause className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </button>

                {/* Restart Button */}
                <button
                  type="button"
                  onClick={() => handleStartGame(selectedCategory)}
                  className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="නැවත මුල සිට ක්‍රීඩාව ආරම්භ කරන්න (Restart)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
                  <span>Restart</span>
                </button>

                {/* Exit Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPaused(false);
                    setGameState("select_category");
                  }}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="ක්‍රීඩාවෙන් පිටවී Category තෝරන්න (Exit)"
                >
                  <DoorOpen className="w-3.5 h-3.5 text-rose-300" />
                  <span>Exit</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                soundEnabled
                  ? "bg-white/15 text-white hover:bg-white/25 border-white/20"
                  : "bg-red-500/20 text-red-200 hover:bg-red-500/30 border-red-400/30"
              }`}
              title={soundEnabled ? "ශබ්දය ක්‍රියා විරහිත කරන්න" : "ශබ්දය සක්‍රීය කරන්න"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300" />}
              <span className="hidden sm:inline">{soundEnabled ? "Audio ON" : "Muted"}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title={isFullscreen ? "සාමාන්‍ය තිරයට (Exit Fullscreen)" : "සම්පූර්ණ තිරය (Full Screen Game)"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit" : "Full Screen"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHARACTER SELECTION & CATEGORY SELECTION VIEW */}
      {/* ========================================================================= */}
      {gameState === "select_category" && (
        <div className="space-y-5">
          {/* CHARACTER SELECTION CARDS (Male vs Female) */}
          <div className="bg-white border-2 border-[#e9dfcc] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e9dfcc] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2d6a4f] flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  සමුරායි රණශූරයා තෝරන්න (Choose Male or Female Samurai)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  ක්‍රීඩාව ආරම්භ කිරීමට ඔබ කැමති රණශූර චරිතය තෝරාගන්න:
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                තෝරාගෙන ඇත්තේ: {selectedGender === "male" ? "සමුරායි කුමරා (Male)" : "සමුරායි කුමරිය (Female)"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Male Samurai */}
              <div
                onClick={() => setSelectedGender("male")}
                className={`p-4 rounded-2xl border-3 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  selectedGender === "male"
                    ? "border-[#2d6a4f] bg-emerald-50/70 shadow-md ring-4 ring-[#2d6a4f]/20"
                    : "border-[#e9dfcc] bg-[#fcfaf7] hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <div className="w-24 h-28 shrink-0 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-inner flex items-center justify-center">
                  <MaleSamuraiSVG action="idle" className="w-20 h-24" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black text-white bg-red-600 uppercase">
                      👦 පිරිමි (Male)
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600">Katana Master</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#2d6a4f]">
                    සමුරායි කුමරා (Boy Samurai)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    චන්ද්‍රවංක ලාංඡනය සහිත රතු කබුතෝ හිස්වැස්ම, කොණ්ඩ ගැටය සහ තනි කඩු ප්‍රහාරවලින් සතුරන් මෙල්ල කරන දක්ෂ රණශූරයා.
                  </p>
                </div>
              </div>

              {/* Option 2: Female Samurai */}
              <div
                onClick={() => setSelectedGender("female")}
                className={`p-4 rounded-2xl border-3 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  selectedGender === "female"
                    ? "border-[#2d6a4f] bg-emerald-50/70 shadow-md ring-4 ring-[#2d6a4f]/20"
                    : "border-[#e9dfcc] bg-[#fcfaf7] hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <div className="w-24 h-28 shrink-0 bg-white rounded-2xl p-1.5 border border-slate-200 shadow-inner flex items-center justify-center">
                  <FemaleSamuraiSVG action="idle" className="w-20 h-24" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black text-white bg-rose-600 uppercase">
                      👧 ගැහැණු (Female)
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600">Dual Katanas</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#2d6a4f]">
                    සමුරායි කුමරිය (Girl Samurai)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    රන් අං සහිත පුළුල් කබුතෝ තෙප්පම, නිල් ඇස් සහ අත් දෙකෙන්ම ද්විත්ව කඩු ප්‍රහාර (Dual-Wield) එල්ල කරන සටන්කාමී කුමරිය.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY SELECTOR CARDS */}
          <div className="bg-white border-2 border-[#e9dfcc] p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e9dfcc] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-[#2d6a4f] flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  විෂය ක්ෂේත්‍රය තෝරා සටන අරඹන්න (Select Quiz Category)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  ප්‍රශ්නයට තත්පර 10ක් තුළ පිළිතුරු දෙන්න. ළඟාවන සතුරන් පරාජය කර ජයග්‍රහණය කරන්න:
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 bg-[#fcfaf7] px-3 py-1.5 rounded-xl border border-[#e9dfcc]">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>High Score: {highScore} pts</span>
              </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {GAME_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group ${
                      isSelected
                        ? "border-[#2d6a4f] bg-emerald-50/60 shadow-sm ring-2 ring-[#2d6a4f]/20"
                        : "border-[#e9dfcc] bg-[#fcfaf7] hover:border-emerald-300 hover:bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black text-white bg-linear-to-r ${cat.color}`}>
                          {cat.badge}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {cat.count} Items
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-[#2d6a4f] group-hover:text-emerald-800 transition-colors">
                          {cat.titleSi}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 font-bold">
                          {cat.titleJp}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {cat.descriptionSi}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartGame(cat.id);
                      }}
                      className="w-full py-2.5 px-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <span>මෙම අංශයෙන් සටන අරඹන්න</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Primary START GAME Hero Action Button ("Mulinma patan gaddi start button ekkk danna") */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-linear-to-r from-emerald-950 via-[#17382b] to-[#0e241c] p-4 sm:p-5 rounded-2xl text-white border border-emerald-600/30 shadow-lg">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-mono font-bold text-amber-300">
                  තෝරාගත් අංශය: {GAME_CATEGORIES.find((c) => c.id === selectedCategory)?.titleSi} ({GAME_CATEGORIES.find((c) => c.id === selectedCategory)?.badge})
                </div>
                <div className="text-sm font-black text-white">
                  සමුරායි රණශූරයා සහ අංශය තෝරා අවසන් නම් සටන ආරම්භ කරන්න!
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartGame(selectedCategory)}
                className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <Swords className="w-5 h-5 text-slate-950 animate-pulse" />
                <span>⚔️ සටන ආරම්භ කරන්න (START GAME)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVE BATTLE ARENA (SAMURAI VS DRAGONS) */}
      {/* ========================================================================= */}
      {gameState === "playing" && currentQuestion && (
        <div className={isFullscreen ? "w-screen h-screen fixed inset-0 z-[99999] m-0 p-0" : "space-y-4"}>
          {/* Slasher Arena Canvas */}
          <div
            className={`w-full relative overflow-hidden select-none transition-transform duration-75 ${
              isFullscreen
                ? "w-screen h-screen fixed inset-0 z-[99999] rounded-none border-none shadow-none m-0 p-0"
                : "rounded-3xl border-2 border-[#354f52]/40 shadow-2xl"
            } ${screenShake ? "animate-ping translate-x-1 translate-y-1" : ""}`}
            style={{
              minHeight: isFullscreen ? "100vh" : "620px",
              height: isFullscreen ? "100vh" : undefined,
              background: "linear-gradient(to bottom, #060911 0%, #111a2c 40%, #1e2c42 70%, #0d131f 100%)"
            }}
          >
            {/* Japanese Battlefield Background (Mount Fuji, glowing moon, torii gate, pagoda, bamboo, stone lanterns, sakura) */}
            <JapaneseBattlefieldBackground />

            {/* Dynamic Battle Atmosphere FX - Unique animation for EVERY single question! */}
            <BattlefieldAtmosphereFX atmosphere={currentAtmosphere} />

            {/* ========================================================= */}
            {/* TOP HUD: 5 HEARTS (with partial fill), COMBO, SCORE, FULLSCREEN TOGGLE */}
            {/* ========================================================= */}
            <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-4 sm:right-4 z-40 flex items-center justify-between gap-1.5 sm:gap-2">
              {/* Hearts / Health System: 5 Hearts */}
              <div className="bg-black/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-rose-400/50 flex items-center gap-1.5 shadow-lg shrink-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono font-black text-rose-300">HP:</span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const fill = Math.max(0, Math.min(1, lives - idx));
                    return (
                      <div key={idx} className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {/* Background empty heart */}
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 fill-slate-800" />
                        {/* Foreground partial or full heart */}
                        {fill > 0 && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${Math.round(fill * 100)}%` }}
                          >
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono font-black text-rose-300 ml-0.5">
                  {lives.toFixed(1)}/5
                </span>
              </div>

              {/* Dragon Approach Time & Distance Badge */}
              <div
                className={`bg-black/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border flex items-center gap-1.5 shadow-lg shrink-0 ${
                  activeRemainingSec <= 3.0
                    ? "border-red-500 text-red-400 animate-pulse ring-2 ring-red-500/50"
                    : "border-amber-400/50 text-amber-300"
                }`}
              >
                <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeRemainingSec <= 3.0 ? "animate-spin text-red-400" : "text-amber-300"}`} />
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xs sm:text-base font-black">{activeRemainingSec.toFixed(1)}s</span>
                  <span className="text-[9px] sm:text-[10px] text-amber-200/80 font-bold hidden xs:inline">({approxDistanceMeters}m)</span>
                </div>
              </div>

              {/* Buffs and Combo indicator */}
              <div className="hidden sm:flex items-center gap-1.5">
                {combo > 0 && (
                  <div className="bg-linear-to-r from-amber-500 to-rose-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow flex items-center gap-1 animate-bounce">
                    <Zap className="w-3 h-3 text-yellow-200" />
                    <span>x{combo}</span>
                  </div>
                )}
                {hasShield > 0 && (
                  <div className="bg-cyan-500/80 text-white px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 border border-cyan-300">
                    <Shield className="w-2.5 h-2.5" />
                    <span>{hasShield}</span>
                  </div>
                )}
                {fireBladeCharges > 0 && (
                  <div className="bg-orange-500/80 text-white px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 border border-orange-300">
                    <Flame className="w-2.5 h-2.5" />
                    <span>2x</span>
                  </div>
                )}
              </div>

              {/* Score Display & Fullscreen Action Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="bg-black/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-amber-400/50 text-amber-300 font-mono text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1.5 shrink-0">
                  <span>{score} PTS</span>
                  <span className="text-[9px] text-slate-400 border-l border-white/20 pl-1.5 hidden sm:inline">
                    TOP: {highScore}
                  </span>
                </div>

                {/* Fullscreen Button in HUD */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-black/90 hover:bg-slate-900 border border-white/25 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer backdrop-blur-md shadow-md"
                  title={isFullscreen ? "සාමාන්‍ය තිරයට (Esc)" : "සම්පූර්ණ තිරය (Full Screen)"}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                      <span className="hidden sm:inline">Exit (Esc)</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                      <span className="hidden sm:inline">Full Screen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile-only combo / buff strip */}
            {combo > 0 && (
              <div className="sm:hidden absolute top-10 left-2 z-40 bg-linear-to-r from-amber-500 to-rose-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-yellow-200" />
                <span>COMBO x{combo}!</span>
              </div>
            )}

            {/* Floating Combat Notification */}
            {combatAlert && (
              <div className="absolute top-11 sm:top-14 left-1/2 -translate-x-1/2 z-40 bg-black/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xl animate-bounce">
                <span className={`text-[11px] sm:text-xs font-black ${combatAlert.color}`}>
                  {combatAlert.text}
                </span>
              </div>
            )}

            {/* Tatami Ground at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#140c06] via-[#24170d] to-[#362112] border-t-4 border-[#784620] shadow-inner" />

            {/* =================================================================== */}
            {/* UPPER BATTLE DECK: QUESTION + 4 ANSWERS (PLACED DIRECTLY UNDER QUESTION) */}
            {/* =================================================================== */}
            <div className="absolute top-12 sm:top-14 left-2 right-2 sm:left-4 sm:right-4 z-30 max-w-2xl mx-auto pointer-events-auto space-y-1.5 sm:space-y-2">
              {/* Question Banner */}
              <div className="bg-black/90 backdrop-blur-md border-2 border-amber-400/60 px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-2xl text-center">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <span className="px-2 py-0.2 bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full text-[9px] sm:text-[10px] font-mono uppercase font-bold">
                    {currentQuestion.promptCategory}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                    යතුරුපුවරුව: [1] [2] [3] [4]
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-black text-amber-100 font-serif leading-snug drop-shadow-sm">
                  {currentQuestion.promptSi}
                </h3>
              </div>

              {/* 4 Answers Placed DIRECTLY BELOW the question! */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSliced = slicedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSliceChoice(option)}
                      className={`relative p-1.5 sm:p-2.5 bg-black/90 backdrop-blur-md hover:bg-slate-900 border-2 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center min-h-[52px] sm:min-h-[64px] group transform hover:scale-[1.02] active:scale-95 ${
                        isSliced
                          ? option.isCorrect
                            ? "border-emerald-400 ring-4 ring-emerald-400/70 bg-emerald-950/90 scale-105"
                            : "border-red-500 ring-4 ring-red-500/70 bg-red-950/90 opacity-70"
                          : "border-amber-400/50 hover:border-amber-300 hover:shadow-amber-400/20"
                      }`}
                    >
                      {/* Slash visual line */}
                      {isSliced && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <div className="w-full h-1 bg-white shadow-[0_0_18px_#fff] rotate-45 transform scale-125 animate-ping" />
                        </div>
                      )}

                      {/* Key badge [1], [2], [3], [4] */}
                      <span className="absolute top-1 left-1.5 px-1 py-0.2 bg-amber-400/30 text-amber-300 rounded text-[8px] sm:text-[9px] font-mono font-black border border-amber-400/40">
                        [{idx + 1}]
                      </span>

                      <div className="space-y-0.5 pt-0.5">
                        <span className="text-base sm:text-xl md:text-2xl font-black text-amber-200 group-hover:text-amber-100 font-serif block leading-tight">
                          {option.primaryText}
                        </span>
                        {option.subText && (
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 font-mono block truncate max-w-[120px] sm:max-w-[150px]">
                            {option.subText}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5X COMBO CELEBRATION REWARD BANNER */}
            {unlockedReward && (
              <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-linear-to-r from-amber-500 via-rose-600 to-amber-500 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-yellow-300 text-center space-y-1 animate-bounce max-w-md w-11/12">
                <div className="text-2xl">{unlockedReward.icon}</div>
                <h4 className="font-black text-sm sm:text-base text-yellow-100 uppercase tracking-wide">
                  🎉 {unlockedReward.titleSi} 🎉
                </h4>
                <p className="text-xs text-white/90 font-medium">
                  {unlockedReward.descriptionSi}
                </p>
              </div>
            )}

            {/* WRONG ANSWER PLAYFUL ANIMAL TAUNT POPUP */}
            {wrongTaunt && (
              <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-linear-to-r from-red-700 via-rose-800 to-red-700 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-4 border-red-400 text-center space-y-2 animate-pulse max-w-md w-11/12">
                <div className="text-3xl">❌ 🔥</div>
                <h4 className="font-black text-lg sm:text-xl text-yellow-300 tracking-tight">
                  {wrongTaunt.message}
                </h4>
                <div className="bg-black/40 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-200">
                  නිවැරදි පිළිතුර: {wrongTaunt.correctAnswer}
                </div>
              </div>
            )}

            {/* PAUSE SCREEN OVERLAY */}
            {isPaused && (
              <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5">
                <div className="p-4 bg-amber-500/20 text-amber-300 border-2 border-amber-400/50 rounded-3xl animate-pulse">
                  <Pause className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    ක්‍රීඩාව විරාම කර ඇත (Game Paused)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    සටන නවතා ඇත. අවශ්‍ය විටෙක නැවත අරඹන්න හෝ Category වෙනස් කරන්න.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPaused(false)}
                    className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-emerald-600 to-[#2d6a4f] hover:from-emerald-700 hover:to-[#1b4332] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-emerald-300" />
                    <span>දිගටම සටන් කරන්න (Resume)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(false);
                      handleStartGame(selectedCategory);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/50 text-sky-200 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-sky-300" />
                    <span>නැවත මුල සිට (Restart)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(false);
                      setGameState("select_category");
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/50 text-rose-200 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <DoorOpen className="w-4 h-4 text-rose-300" />
                    <span>පිටවෙන්න (Exit)</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* COMBAT CHARACTERS: SLEEPING CREATURES ARE HIDDEN OFF-SCREEN */}
            {/* User directive: "E wagema saththunwa screen eke nopenenna nidi karawanna. Frame eken eliye idala ena widiyata hadanna. Samuraiwa screen eke maddata hitina widiyata ahadanna." */}
            {/* ========================================================= */}
            {creatures.map((creature) => {
              const isAttacking = creature.isActiveAttacker;
              // If not attacking, sleep silently off-screen (do NOT render in screen)
              if (!isAttacking) return null;

              let styleObj: React.CSSProperties = {};
              let facingRight = true;
              const baseBottom = creature.baseBottom ?? 8;

              // Enters from outside the frame (-18%) and approaches Samurai centered at 50%
              if (creature.baseLeft !== undefined) {
                facingRight = true;
                const curLeft = -18 + creature.progress * (47 - (-18));
                const arcY =
                  creature.movementType === "flying"
                    ? baseBottom + Math.sin(creature.progress * Math.PI) * 32 + creature.progress * 4
                    : baseBottom;
                styleObj = {
                  left: `${curLeft}%`,
                  bottom: `${arcY}%`,
                  transform: `scale(${1.0 + creature.progress * 0.15})`,
                  zIndex: 26
                };
              } else {
                facingRight = false;
                const curRight = -18 + creature.progress * (47 - (-18));
                const arcY =
                  creature.movementType === "flying"
                    ? baseBottom + Math.sin(creature.progress * Math.PI) * 32 + creature.progress * 4
                    : baseBottom;
                styleObj = {
                  right: `${curRight}%`,
                  bottom: `${arcY}%`,
                  transform: `scale(${1.0 + creature.progress * 0.15})`,
                  zIndex: 26
                };
              }

              return (
                <div
                  key={creature.id}
                  className="absolute transition-all duration-100 pointer-events-none select-none"
                  style={styleObj}
                >
                  <div className="relative w-22 sm:w-26 h-18 sm:h-22">
                    {/* Danger Alert Ring for Approaching Attacker */}
                    {creature.progress > 0.65 && (
                      <div className="absolute inset-0 rounded-full ring-4 ring-rose-500/60 animate-ping pointer-events-none" />
                    )}

                    <BattleCreatureSVG
                      species={creature.species}
                      state={creature.state}
                      facingRight={facingRight}
                      color={creature.color}
                      fireBreathActive={creature.fireBreathActive}
                    />

                    {/* Threat Name Badge */}
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap shadow-xl bg-linear-to-r from-red-600 to-amber-600 text-white border border-amber-300 ring-2 ring-red-500/40 animate-bounce">
                      ⚔️ {creature.nameSi}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 4. THE SAMURAI WARRIOR POSITIONED IN SCREEN CENTER */}
            <div
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-200 z-30 flex flex-col items-center"
              style={{
                transform: `translateX(-50%) translateY(${samuraiYOffset}px)`
              }}
            >
              {/* Shadow */}
              <div
                className="w-20 h-3 bg-black/70 rounded-full blur-xs mx-auto -mb-1 transition-all"
                style={{
                  transform: samuraiYOffset < 0 ? "scale(0.4) translateY(140px)" : "scale(1)"
                }}
              />

              {/* Katana Slash / Cross-Slash FX in Mid-Air */}
              {(action === "slash" || action === "combo" || action === "jump_slash") && (
                <div className="absolute -top-10 -left-6 w-40 h-40 pointer-events-none z-40 animate-pulse">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Primary Slash Arc */}
                    <path
                      d="M 10 160 Q 100 10 190 140"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="8"
                      strokeLinecap="round"
                      filter="drop-shadow(0 0 12px #f59e0b)"
                    />
                    {/* Secondary Cross-Slash Arc for Dual Wield */}
                    {selectedGender === "female" && (
                      <path
                        d="M 190 160 Q 100 10 10 140"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 10px #38bdf8)"
                      />
                    )}
                  </svg>
                </div>
              )}

              {/* Render Selected Warrior Component */}
              <div className="w-24 sm:w-28 h-30 sm:h-34 relative">
                <SamuraiWarrior
                  gender={selectedGender}
                  action={action}
                  facingRight={facingRight}
                  hasShield={hasShield}
                  fireBlade={fireBladeCharges > 0}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Quick Samurai Move Test & Gender Bar (Hidden in Fullscreen) */}
          {!isFullscreen && (
            <div className="bg-[#fcfaf7] border border-[#e9dfcc] p-3 rounded-2xl flex items-center justify-between gap-2 flex-wrap text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">රණශූරයා:</span>
                <span className="px-2.5 py-1 bg-white border border-[#e9dfcc] rounded-xl text-emerald-800 font-black">
                  {selectedGender === "male" ? "👦 සමුරායි කුමරා (Male)" : "👧 සමුරායි කුමරිය (Female)"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerSamuraiMove("slash")}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-[#e9dfcc] rounded-xl font-black text-slate-700 transition cursor-pointer flex items-center gap-1"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-500" />
                  <span>කඩු පහර</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerSamuraiMove("jump_slash")}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-[#e9dfcc] rounded-xl font-black text-slate-700 transition cursor-pointer flex items-center gap-1"
                >
                  <span>⬆️ උඩ පැන පහර (Jump Slash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGender((g) => (g === "male" ? "female" : "male"))}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl font-black text-amber-900 transition cursor-pointer"
                >
                  <span>චරිතය මාරු කරන්න ({selectedGender === "male" ? "Female" : "Male"})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GAME OVER MODAL / SCREEN */}
      {/* ========================================================================= */}
      {gameState === "game_over" && (
        <div className="bg-linear-to-b from-slate-900 via-[#1e293b] to-black text-white p-6 sm:p-10 rounded-3xl border-2 border-red-500/50 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          {/* Game Over Title */}
          <div className="space-y-2">
            <span className="px-4 py-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full text-xs font-black uppercase tracking-widest inline-block">
              戦い終了 (GAME OVER)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              ක්‍රීඩාව අවසන් (Game Over)!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              වන සතුන්ගේ ප්‍රහාර හමුවේ ඔබගේ සියලු ජීවිත අවසන් විය. ඔබ ලබාගත් ලකුණු මෙන්න!
            </p>
          </div>

          {/* Performance Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">අවසාන ලකුණු</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{score}</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">උපරිම Combo</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">{maxCombo}x</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">පරාජය කළ සතුන්</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{correctAnswersCount}</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">වැරදුණු වාර</span>
              <span className="text-xl sm:text-2xl font-black text-red-400 font-mono">{wrongAnswersCount}</span>
            </div>
          </div>

          {/* Achieved Warrior Rank */}
          <div className="bg-linear-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/30 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              ලබාගත් රණශූර නිලය (Warrior Rank)
            </span>
            <div className="text-lg sm:text-xl font-black text-white">
              {score >= 2000
                ? "👑 මහා ෂෝගුන් (Grand Shogun)"
                : score >= 1000
                ? "⚔️ ප්‍රධාන සමුරායි නායකයා (Samurai Master)"
                : score >= 500
                ? "🗡️ අසිපත් ශූරයා (Blade Veteran)"
                : "🥋 ආධුනික රොනින් (Novice Ronin)"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleStartGame(selectedCategory)}
              className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-emerald-600 to-[#2d6a4f] hover:from-emerald-700 hover:to-[#1b4332] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>නැවත ක්‍රීඩා කරන්න (Play Again)</span>
            </button>

            <button
              type="button"
              onClick={() => setGameState("select_category")}
              className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>වෙනත් Category එකක් තෝරන්න</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
