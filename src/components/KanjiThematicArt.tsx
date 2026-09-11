import React from "react";

export interface KanjiThematicArtProps {
  kanji?: string;
  meaning?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * KanjiThematicArt Component
 * Custom Japanese samurai / folklore / nature vector clipart illustrations
 * matching Kanji meanings, styled uniformly with SamuraiGameCharacters.
 */
export const KanjiThematicArt: React.FC<KanjiThematicArtProps> = ({
  kanji = "",
  meaning = "",
  className = "",
  size = "md",
}) => {
  const dimMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  const sizeClass = dimMap[size] || dimMap.md;

  // Normalize search tokens
  const k = kanji.trim();
  const m = meaning.toLowerCase();

  // 1. Water / Water Day (水 / 水曜日)
  if (k.includes("水") || m.includes("water")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Water (ජලය)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
          {/* Bamboo conduit spout */}
          <path d="M 22 28 L 52 40 L 50 48 L 20 36 Z" fill="#65a30d" stroke="#365314" strokeWidth="2" />
          <ellipse cx="21" cy="32" rx="4" ry="6" fill="#84cc16" stroke="#365314" strokeWidth="1.5" />
          {/* Flowing Water drops */}
          <path d="M 48 44 C 48 44, 46 64, 38 72 C 34 76, 26 76, 24 72 C 22 68, 26 62, 34 56 Z" fill="#38bdf8" />
          <path d="M 46 62 C 46 62, 54 78, 62 82 C 68 85, 76 82, 78 74 C 80 66, 72 58, 60 54 Z" fill="#0284c7" opacity="0.8" />
          <circle cx="68" cy="42" r="6" fill="#7dd3fc" />
          <circle cx="78" cy="54" r="3.5" fill="#38bdf8" />
          {/* Japanese wave ripple line */}
          <path d="M 25 78 Q 38 70 50 78 T 75 78" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 2. Fire / Tuesday (火 / 火曜日)
  if (k.includes("火") || m.includes("fire")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Fire (ගින්න)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fff1f2" stroke="#e11d48" strokeWidth="3" />
          {/* Charcoal base / firewood logs */}
          <polygon points="25,78 75,78 68,85 18,85" fill="#44403c" stroke="#1c1917" strokeWidth="2" />
          <polygon points="30,83 80,72 82,78 32,89" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          {/* Outer flame */}
          <path d="M 50 14 C 62 34 82 50 80 70 C 78 84 64 88 50 88 C 36 88 22 84 20 70 C 18 52 38 34 50 14 Z" fill="#f43f5e" />
          {/* Inner flame */}
          <path d="M 50 28 C 58 42 70 56 68 70 C 66 80 58 84 50 84 C 42 84 34 80 32 70 C 30 56 42 42 50 28 Z" fill="#fb923c" />
          {/* Core glow */}
          <path d="M 50 45 C 55 54 62 64 60 74 C 58 80 54 82 50 82 C 46 82 42 80 40 74 C 38 64 45 54 50 45 Z" fill="#fef08a" />
          {/* Floating sparks */}
          <circle cx="32" cy="28" r="2.5" fill="#f97316" />
          <circle cx="68" cy="22" r="3" fill="#f43f5e" />
        </svg>
      </div>
    );
  }

  // 3. Tree / Wood / Thursday (木 / 木曜日 / 本)
  if (k.includes("木") || k === "本" || m.includes("tree") || m.includes("wood") || m.includes("book")) {
    if (k === "本" || m.includes("book")) {
      return (
        <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Book (පොත)">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#fefce8" stroke="#ca8a04" strokeWidth="3" />
            {/* Open Scroll / Book */}
            <path d="M 18 36 Q 50 28 50 40 Q 50 28 82 36 L 82 78 Q 50 68 50 80 Q 50 68 18 78 Z" fill="#fef9c3" stroke="#854d0e" strokeWidth="2.5" />
            {/* Spine */}
            <line x1="50" y1="36" x2="50" y2="80" stroke="#713f12" strokeWidth="3" />
            {/* Text lines */}
            <line x1="26" y1="46" x2="44" y2="44" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="56" x2="44" y2="54" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="66" x2="40" y2="64" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="44" x2="74" y2="46" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="54" x2="74" y2="56" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            {/* Red bookmark ribbon */}
            <path d="M 50 36 L 50 65 L 56 60 L 62 65 L 62 38" fill="#e11d48" />
          </svg>
        </div>
      );
    }
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Tree (ගස)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" />
          {/* Bonsai Trunk */}
          <path d="M 44 86 Q 42 66 52 56 Q 60 48 50 38" fill="none" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
          <path d="M 50 54 Q 38 46 32 50" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M 52 46 Q 66 40 70 44" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Pine / Bonsai Foliage Clouds */}
          <ellipse cx="50" cy="30" rx="18" ry="12" fill="#15803d" stroke="#14532d" strokeWidth="2" />
          <ellipse cx="28" cy="46" rx="14" ry="9" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          <ellipse cx="72" cy="42" rx="14" ry="9" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
          {/* Planter pot */}
          <polygon points="30,82 70,82 66,90 34,90" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 4. Gold / Money / Friday / Yen (金 / 金曜日 / 円 / 買います)
  if (k.includes("金") || k.includes("円") || k.includes("買") || m.includes("gold") || m.includes("money") || m.includes("yen") || m.includes("buy")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Gold Coin (රන් කාසිය)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fefce8" stroke="#eab308" strokeWidth="3" />
          {/* Japanese Koban Gold Oval */}
          <ellipse cx="50" cy="50" rx="28" ry="38" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="23" ry="33" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
          {/* Horizontal Coin Lines */}
          <line x1="32" y1="30" x2="68" y2="30" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="40" x2="70" y2="40" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="60" x2="70" y2="60" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="70" x2="68" y2="70" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
          {/* Center Stamp */}
          <rect x="42" y="44" width="16" height="12" rx="2" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
          <text x="50" y="53" textAnchor="middle" fill="#713f12" fontSize="9" fontWeight="900" fontFamily="sans-serif">両</text>
          {/* Sparkles */}
          <path d="M 76 22 L 78 28 L 84 30 L 78 32 L 76 38 L 74 32 L 68 30 L 74 28 Z" fill="#f59e0b" />
          <path d="M 22 68 L 23 72 L 27 73 L 23 74 L 22 78 L 21 74 L 17 73 L 21 72 Z" fill="#f59e0b" />
        </svg>
      </div>
    );
  }

  // 5. Earth / Soil / Saturday (土 / 土曜日)
  if (k.includes("土") || m.includes("earth") || m.includes("soil")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Earth / Stone Lantern (පස / පහන් කුළුණ)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fbf7ee" stroke="#78716c" strokeWidth="3" />
          {/* Stone Pagoda Lantern (Ishidōrō) */}
          <path d="M 32 35 Q 50 20 68 35 L 64 42 L 36 42 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
          {/* Lantern Light Box */}
          <rect x="38" y="42" width="24" height="18" fill="#fef08a" stroke="#44403c" strokeWidth="2" />
          <line x1="50" y1="42" x2="50" y2="60" stroke="#78716c" strokeWidth="2" />
          {/* Stone Base & Pillar */}
          <rect x="44" y="60" width="12" height="18" fill="#a8a29e" stroke="#44403c" strokeWidth="2" />
          <ellipse cx="50" cy="80" rx="22" ry="6" fill="#78716c" stroke="#44403c" strokeWidth="2" />
          {/* Moss & Sprout */}
          <ellipse cx="58" cy="40" rx="4" ry="2" fill="#65a30d" />
          <path d="M 66 78 Q 72 72 74 66" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. Sun / Day / Sunday / Japan / Morning (日 / 日曜日 / 日本 / 今日 / 朝)
  if (k.includes("日") || k.includes("朝") || m.includes("sun") || m.includes("day") || m.includes("japan") || m.includes("morning")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Rising Sun (උදෑසන හිරු)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fff7ed" stroke="#f97316" strokeWidth="3" />
          {/* Mount Fuji Base */}
          <polygon points="12,86 88,86 64,52 36,52" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
          {/* Fuji Snow Cap */}
          <polygon points="36,52 64,52 58,62 54,58 50,64 46,58 42,62" fill="#ffffff" />
          {/* Rising Red Sun */}
          <circle cx="50" cy="38" r="16" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
          {/* Solar rays */}
          <line x1="50" y1="14" x2="50" y2="18" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="24" x2="34" y2="27" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="24" x2="66" y2="27" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          {/* Cherry blossoms drifting */}
          <circle cx="22" cy="42" r="3" fill="#f472b6" />
          <circle cx="80" cy="48" r="2.5" fill="#f472b6" />
        </svg>
      </div>
    );
  }

  // 7. Moon / Month / Monday / Night (月 / 月曜日 / 夜)
  if (k.includes("月") || k.includes("夜") || m.includes("moon") || m.includes("month") || m.includes("night")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Crescent Moon (චන්ද්‍රයා)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#6366f1" strokeWidth="3" />
          {/* Golden Crescent Moon */}
          <path d="M 55 18 C 36 18 24 34 24 50 C 24 66 36 82 55 82 C 45 74 40 64 40 50 C 40 36 45 26 55 18 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          {/* Night clouds */}
          <path d="M 28 66 Q 44 60 58 66 Q 70 70 82 66" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* Distant stars */}
          <circle cx="68" cy="28" r="2.5" fill="#f8fafc" />
          <circle cx="78" cy="42" r="2" fill="#f8fafc" />
          <circle cx="34" cy="24" r="1.5" fill="#f8fafc" />
        </svg>
      </div>
    );
  }

  // 8. Fish (魚)
  if (k.includes("魚") || m.includes("fish")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Koi Fish (කොයි මත්ස්‍යයා)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3" />
          {/* Koi Body */}
          <path d="M 25 50 C 35 30 65 34 75 48 C 65 64 35 68 25 50 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          {/* White & Red Calico patches */}
          <ellipse cx="48" cy="45" rx="8" ry="6" fill="#ffffff" />
          <circle cx="58" cy="50" r="4" fill="#dc2626" />
          {/* Tail Fin */}
          <path d="M 75 48 Q 90 38 88 50 Q 90 62 75 48 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
          {/* Dorsal fin */}
          <path d="M 45 32 Q 55 24 60 34" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="32" cy="46" r="2.5" fill="#0f172a" />
          <circle cx="31" cy="45" r="1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 9. Meat (肉)
  if (k.includes("肉") || m.includes("meat")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Meat (මස්)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fef2f2" stroke="#dc2626" strokeWidth="3" />
          {/* Bone on Left */}
          <circle cx="20" cy="44" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="20" cy="56" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="20" y="46" width="16" height="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Meat Shank */}
          <ellipse cx="50" cy="50" rx="24" ry="18" fill="#be123c" stroke="#881337" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="20" ry="14" fill="#e11d48" />
          <ellipse cx="50" cy="50" rx="14" ry="9" fill="#fb7185" />
          {/* Bone on Right */}
          <rect x="64" y="46" width="16" height="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="80" cy="44" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="80" cy="56" r="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 10. Eat / Food (食べます / 食)
  if (k.includes("食") || m.includes("eat") || m.includes("food")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Ramen / Eat (ආහාර / කනවා)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#f59e0b" strokeWidth="3" />
          {/* Ramen Bowl */}
          <path d="M 22 52 C 22 76 78 76 78 52 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
          <ellipse cx="50" cy="52" rx="28" ry="10" fill="#fde68a" stroke="#991b1b" strokeWidth="2" />
          {/* Broth & noodles */}
          <ellipse cx="50" cy="52" rx="24" ry="7" fill="#f59e0b" />
          {/* Egg */}
          <ellipse cx="42" cy="51" rx="5" ry="4" fill="#ffffff" />
          <circle cx="42" cy="51" r="2.5" fill="#f97316" />
          {/* Nori sheet */}
          <rect x="54" y="42" width="7" height="12" rx="1" fill="#14532d" />
          {/* Steam */}
          <path d="M 40 38 Q 44 30 38 22" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <path d="M 52 36 Q 56 26 50 18" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          {/* Chopsticks */}
          <line x1="20" y1="28" x2="68" y2="48" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 11. Drink (飲みます / 飲)
  if (k.includes("飲") || m.includes("drink")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Green Tea (හරිත තේ)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" />
          {/* Wooden Coaster */}
          <ellipse cx="50" cy="80" rx="26" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          {/* Yunomi Tea Cup */}
          <path d="M 32 44 L 34 76 Q 50 82 66 76 L 68 44 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
          <ellipse cx="50" cy="44" rx="18" ry="6" fill="#86efac" stroke="#475569" strokeWidth="2" />
          {/* Japanese Ceramic pattern */}
          <path d="M 38 60 Q 50 64 62 60" fill="none" stroke="#3b82f6" strokeWidth="2" />
          {/* Steam */}
          <path d="M 46 36 Q 50 26 44 18" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 34 Q 58 24 52 16" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 12. House / Home (家)
  if (k.includes("家") || m.includes("house") || m.includes("home")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Japanese House (නිවස)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fefce8" stroke="#ca8a04" strokeWidth="3" />
          {/* Pagoda Tiled Curved Roof */}
          <path d="M 16 48 Q 50 32 84 48 L 74 38 Q 50 24 26 38 Z" fill="#334155" stroke="#0f172a" strokeWidth="2" />
          <path d="M 22 46 L 78 46 L 72 52 L 28 52 Z" fill="#64748b" />
          {/* Wooden House Frame */}
          <rect x="28" y="52" width="44" height="32" fill="#fed7aa" stroke="#78350f" strokeWidth="2.5" />
          {/* Shoji Paper Sliding Doors */}
          <rect x="36" y="58" width="13" height="26" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
          <rect x="51" y="58" width="13" height="26" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
          <line x1="36" y1="67" x2="49" y2="67" stroke="#78350f" strokeWidth="1" />
          <line x1="36" y1="75" x2="49" y2="75" stroke="#78350f" strokeWidth="1" />
          <line x1="51" y1="67" x2="64" y2="67" stroke="#78350f" strokeWidth="1" />
          <line x1="51" y1="75" x2="64" y2="75" stroke="#78350f" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 13. Hot Spring (温泉)
  if (k.includes("温泉") || k.includes("湯") || m.includes("hot spring") || m.includes("onsen")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Onsen (උණු දිය උල්පත)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#f0fdfa" stroke="#0d9488" strokeWidth="3" />
          {/* Cedar Bath Barrel Tub */}
          <path d="M 20 54 L 24 82 Q 50 88 76 82 L 80 54 Z" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
          <ellipse cx="50" cy="54" rx="30" ry="9" fill="#5eead4" stroke="#78350f" strokeWidth="2" />
          {/* Metal Band on Tub */}
          <path d="M 22 68 Q 50 74 78 68" fill="none" stroke="#475569" strokeWidth="2" />
          {/* Onsen Steam Symbol */}
          <path d="M 38 42 Q 42 32 36 22" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
          <path d="M 50 38 Q 54 26 48 14" fill="none" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 62 42 Q 66 32 60 22" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 14. Samurai Helmet / Sword / Name / Me (名前 / 私 / 友だち / 男 / 武)
  if (k.includes("名") || k.includes("私") || k.includes("友") || m.includes("name") || m.includes("friend") || m.includes("samurai")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Samurai Crest (සමුරායි ලාංඡනය)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#b45309" strokeWidth="3" />
          {/* Crossed Katanas */}
          <line x1="22" y1="22" x2="78" y2="78" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="22" x2="22" y2="78" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          {/* Katana guards (Tsuba) */}
          <circle cx="36" cy="36" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="64" cy="36" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          {/* Golden Samurai Helmet Crest (Maedate) */}
          <path d="M 30 50 Q 50 32 70 50 Q 64 68 50 76 Q 36 68 30 50 Z" fill="#991b1b" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="50,34 54,46 50,44 46,46" fill="#facc15" stroke="#78350f" strokeWidth="1" />
          <circle cx="50" cy="56" r="4" fill="#fef08a" />
        </svg>
      </div>
    );
  }

  // 15. Mountain (山)
  if (k.includes("山") || m.includes("mountain")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Mountain (කන්ද)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#eff6ff" stroke="#2563eb" strokeWidth="3" />
          <polygon points="10,84 90,84 50,22" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
          <polygon points="50,22 66,48 58,44 50,50 42,44 34,48" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M 22 84 Q 50 76 78 84" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 16. River (川)
  if (k.includes("川") || m.includes("river")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="River (ගඟ)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#059669" strokeWidth="3" />
          {/* Green Riverbanks */}
          <path d="M 8 18 Q 30 50 16 88 L 8 88 Z" fill="#22c55e" />
          <path d="M 92 18 Q 70 50 84 88 L 92 88 Z" fill="#22c55e" />
          {/* Flowing Blue River */}
          <path d="M 22 14 Q 44 48 30 88 L 70 88 Q 56 48 78 14 Z" fill="#38bdf8" />
          <path d="M 40 22 Q 52 48 44 80" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d="M 56 26 Q 64 54 58 82" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 17. Torii Gate / Go / Come / Entrance / Exit (行きます / 来ます / 入り口 / 出口 / 門)
  if (k.includes("行") || k.includes("来") || k.includes("入") || k.includes("出") || k.includes("門") || m.includes("go") || m.includes("come") || m.includes("gate")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Torii Shrine Gate (තොරණ)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fff1f2" stroke="#e11d48" strokeWidth="3" />
          {/* Curved Top Lintels */}
          <path d="M 18 32 Q 50 24 82 32 L 80 38 Q 50 30 20 38 Z" fill="#be123c" stroke="#881337" strokeWidth="2" />
          <rect x="24" y="40" width="52" height="5" fill="#be123c" stroke="#881337" strokeWidth="1.5" />
          {/* Torii Columns */}
          <rect x="30" y="38" width="7" height="46" fill="#e11d48" stroke="#881337" strokeWidth="2" />
          <rect x="63" y="38" width="7" height="46" fill="#e11d48" stroke="#881337" strokeWidth="2" />
          {/* Center Plaque */}
          <rect x="47" y="33" width="6" height="12" fill="#0f172a" />
        </svg>
      </div>
    );
  }

  // 18. High / Low / Up / Down (高い / 低い / 上 / 下)
  if (k.includes("高") || k.includes("上") || m.includes("high") || m.includes("up") || m.includes("expensive")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="High Pagoda (උස් පැගෝඩාව)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#faf5ff" stroke="#9333ea" strokeWidth="3" />
          {/* 3 Tier Pagoda */}
          <polygon points="50,16 52,24 48,24" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          {/* Tier 1 */}
          <path d="M 36 34 Q 50 26 64 34 L 60 38 L 40 38 Z" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          <rect x="44" y="38" width="12" height="8" fill="#e9d5ff" stroke="#581c87" strokeWidth="1.5" />
          {/* Tier 2 */}
          <path d="M 28 50 Q 50 40 72 50 L 68 54 L 32 54 Z" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          <rect x="42" y="54" width="16" height="10" fill="#e9d5ff" stroke="#581c87" strokeWidth="1.5" />
          {/* Tier 3 */}
          <path d="M 20 68 Q 50 56 80 68 L 76 72 L 24 72 Z" fill="#7e22ce" stroke="#581c87" strokeWidth="1.5" />
          <rect x="38" y="72" width="24" height="14" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // 19. Time / Clock / Hour / Minute (時 / 分 / 半)
  if (k.includes("時") || k.includes("分") || k.includes("半") || m.includes("time") || m.includes("minute") || m.includes("hour")) {
    return (
      <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title="Hourglass / Clock (වේලාව)">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#d97706" strokeWidth="3" />
          {/* Golden Pocket Clock Ring */}
          <circle cx="50" cy="52" r="28" fill="#fef9c3" stroke="#b45309" strokeWidth="3" />
          <circle cx="50" cy="52" r="24" fill="#ffffff" />
          {/* Top Knob */}
          <rect x="47" y="18" width="6" height="6" fill="#b45309" rx="1" />
          <circle cx="50" cy="18" r="4" fill="none" stroke="#b45309" strokeWidth="2" />
          {/* Clock Hands */}
          <line x1="50" y1="52" x2="50" y2="36" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="52" x2="64" y2="52" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="52" r="3" fill="#b45309" />
          {/* Roman ticks */}
          <circle cx="50" cy="31" r="1.5" fill="#64748b" />
          <circle cx="71" cy="52" r="1.5" fill="#64748b" />
          <circle cx="50" cy="73" r="1.5" fill="#64748b" />
          <circle cx="29" cy="52" r="1.5" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // 20. Default Elegant Japanese Kamon (Crest) with Sakura & Golden Katana
  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`} title={kanji || "Kanji Clipart"}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Outer Circular Ring */}
        <circle cx="50" cy="50" r="46" fill="#fbf8f3" stroke="#84a98c" strokeWidth="3" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#cad2c5" strokeWidth="1.5" strokeDasharray="4 2" />
        {/* Five Sakura Petals */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <g key={idx} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M 50 50 Q 42 30 50 18 Q 58 30 50 50 Z"
              fill="#fda4af"
              stroke="#e11d48"
              strokeWidth="1.5"
            />
            {/* Notch on petal */}
            <circle cx="50" cy="18" r="1.5" fill="#fbf8f3" />
          </g>
        ))}
        {/* Golden Center Crest */}
        <circle cx="50" cy="50" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#fef08a" />
      </svg>
    </div>
  );
};

export default KanjiThematicArt;
