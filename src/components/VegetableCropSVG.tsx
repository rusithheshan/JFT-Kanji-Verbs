import React from "react";

interface VegetableCropSVGProps {
  cropId: string;
  className?: string;
  animate?: boolean;
}

export const VegetableCropSVG: React.FC<VegetableCropSVGProps> = ({
  cropId,
  className = "w-16 h-16",
  animate = false,
}) => {
  const animClass = animate ? "animate-pulse" : "";

  switch (cropId) {
    // 1. Cucumber (පිපිඤ්ඤා / きゅうり)
    case "cucumber":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="cucGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2d6a4f" />
              <stop offset="60%" stopColor="#40916c" />
              <stop offset="100%" stopColor="#52b788" />
            </linearGradient>
          </defs>
          {/* Main cucumber body with gentle curve */}
          <path
            d="M 22 75 C 15 62 25 35 48 24 C 68 15 82 22 84 30 C 86 38 72 65 52 76 C 35 85 25 82 22 75 Z"
            fill="url(#cucGrad)"
            stroke="#1b4332"
            strokeWidth="3"
          />
          {/* Texture bumps/spines */}
          <circle cx="34" cy="62" r="1.5" fill="#d8f3dc" opacity="0.8" />
          <circle cx="48" cy="48" r="1.5" fill="#d8f3dc" opacity="0.8" />
          <circle cx="62" cy="36" r="1.5" fill="#d8f3dc" opacity="0.8" />
          <circle cx="40" cy="40" r="1.5" fill="#d8f3dc" opacity="0.8" />
          <circle cx="56" cy="60" r="1.5" fill="#d8f3dc" opacity="0.8" />
          {/* Stem & tiny yellow flower */}
          <path d="M 84 28 Q 92 24 94 18" stroke="#52796f" strokeWidth="3" strokeLinecap="round" fill="none" />
          <polygon points="18,78 22,82 20,85 16,83 15,80" fill="#ffd166" />
        </svg>
      );

    // 2. Melon (පැණි පුහුල් / メロン)
    case "melon":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="melonGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#b7e4c7" />
              <stop offset="70%" stopColor="#74c69d" />
              <stop offset="100%" stopColor="#40916c" />
            </radialGradient>
          </defs>
          {/* Sphere body */}
          <circle cx="50" cy="55" r="35" fill="url(#melonGrad)" stroke="#2d6a4f" strokeWidth="3" />
          {/* Netting lines */}
          <path d="M 22 55 Q 50 40 78 55" stroke="#d8f3dc" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 25 42 Q 50 30 75 42" stroke="#d8f3dc" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 25 68 Q 50 80 75 68" stroke="#d8f3dc" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 50 20 Q 38 55 50 90" stroke="#d8f3dc" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M 50 20 Q 62 55 50 90" stroke="#d8f3dc" strokeWidth="1.5" fill="none" opacity="0.7" />
          {/* Japanese T-stem */}
          <path d="M 50 20 L 50 10" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />
          <path d="M 40 10 L 60 10" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // 3. Watermelon (කොමඩු / すいか)
    case "watermelon":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="suikaGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#52b788" />
              <stop offset="70%" stopColor="#2d6a4f" />
              <stop offset="100%" stopColor="#1b4332" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="54" r="35" fill="url(#suikaGrad)" stroke="#081c15" strokeWidth="3" />
          {/* Classic zigzag stripes */}
          <path d="M 48 19 Q 45 35 48 55 Q 52 75 50 89" stroke="#081c15" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 33 24 Q 28 42 32 60 Q 36 78 35 84" stroke="#081c15" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 67 24 Q 72 42 68 60 Q 64 78 65 84" stroke="#081c15" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Stem with cute curlicue vine */}
          <path d="M 50 19 Q 52 10 58 12" stroke="#40916c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 58 12 Q 65 14 62 8 Q 58 8 62 13" stroke="#95d5b2" strokeWidth="2" fill="none" />
        </svg>
      );

    // 4. Pumpkin / Kabocha (වට්ටක්කා / かぼちゃ)
    case "pumpkin":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="kabochaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d6a4f" />
              <stop offset="100%" stopColor="#1b4332" />
            </linearGradient>
          </defs>
          {/* Side lobes */}
          <ellipse cx="32" cy="58" rx="20" ry="26" fill="url(#kabochaGrad)" stroke="#081c15" strokeWidth="2.5" />
          <ellipse cx="68" cy="58" rx="20" ry="26" fill="url(#kabochaGrad)" stroke="#081c15" strokeWidth="2.5" />
          {/* Inner lobes */}
          <ellipse cx="42" cy="58" rx="16" ry="28" fill="#40916c" stroke="#081c15" strokeWidth="2" />
          <ellipse cx="58" cy="58" rx="16" ry="28" fill="#40916c" stroke="#081c15" strokeWidth="2" />
          {/* Center lobe */}
          <ellipse cx="50" cy="58" rx="14" ry="29" fill="#52b788" stroke="#081c15" strokeWidth="2" />
          {/* Golden highlight on underside */}
          <path d="M 38 78 Q 50 86 62 78" stroke="#f4a261" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
          {/* Sturdy woody stem */}
          <path d="M 46 30 L 48 16 L 54 18 L 52 30 Z" fill="#7f5539" stroke="#582f0e" strokeWidth="2" />
        </svg>
      );

    // 5. Eggplant (වම්බටු / なす)
    case "eggplant":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="nasuGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6a0dad" />
              <stop offset="60%" stopColor="#3c096c" />
              <stop offset="100%" stopColor="#10002b" />
            </linearGradient>
          </defs>
          {/* Teardrop body */}
          <path
            d="M 45 28 C 38 40 22 55 24 72 C 26 86 44 92 56 90 C 72 88 80 74 76 56 C 72 40 56 28 48 26 Z"
            fill="url(#nasuGrad)"
            stroke="#240046"
            strokeWidth="2.5"
          />
          {/* Gloss shine */}
          <path d="M 32 62 Q 30 76 38 82" stroke="#e0aaff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Green thorny calyx & cap */}
          <path d="M 40 28 L 32 38 L 42 34 L 48 42 L 52 33 L 60 36 L 54 26 Z" fill="#40916c" stroke="#1b4332" strokeWidth="2" />
          <path d="M 47 26 Q 44 14 42 12" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 6. Tomato (තක්කාලි / トマト)
    case "tomato":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="tomGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="50%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#9b2226" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="56" r="32" fill="url(#tomGrad)" stroke="#590d22" strokeWidth="2.5" />
          {/* Gloss highlight */}
          <ellipse cx="38" cy="44" rx="7" ry="4" transform="rotate(-30 38 44)" fill="#ffffff" opacity="0.6" />
          {/* Green star calyx & stem */}
          <path d="M 50 26 L 46 16" stroke="#40916c" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M 50 26 L 40 22 L 44 28 L 34 32 L 44 34 L 46 42 L 50 34 L 56 42 L 56 34 L 66 32 L 56 28 L 60 22 Z"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="1.5"
          />
        </svg>
      );

    // 7. Bell Pepper / Piman (මාළු මිරිස් / ピーマン)
    case "bell_pepper":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="pimanGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#52b788" />
              <stop offset="70%" stopColor="#2d6a4f" />
              <stop offset="100%" stopColor="#1b4332" />
            </linearGradient>
          </defs>
          {/* Lumpy pepper lobes */}
          <path
            d="M 32 32 C 20 38 20 70 28 82 C 34 90 44 90 50 86 C 56 90 66 90 72 82 C 80 70 80 38 68 32 C 60 28 40 28 32 32 Z"
            fill="url(#pimanGrad)"
            stroke="#081c15"
            strokeWidth="2.5"
          />
          {/* Middle indentation line */}
          <path d="M 50 34 Q 50 60 50 84" stroke="#1b4332" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Gloss */}
          <path d="M 32 46 Q 30 65 34 74" stroke="#b7e4c7" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Stem */}
          <path d="M 50 32 L 52 18" stroke="#40916c" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // 8. Potato / Jagaimo (අර්තාපල් / じゃがいも)
    case "potato":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="potGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ddb892" />
              <stop offset="70%" stopColor="#b08968" />
              <stop offset="100%" stopColor="#7f5539" />
            </radialGradient>
          </defs>
          {/* Main irregular tuber */}
          <path
            d="M 32 32 C 48 24 74 28 84 42 C 92 56 88 74 72 84 C 54 94 30 90 20 74 C 12 60 18 38 32 32 Z"
            fill="url(#potGrad)"
            stroke="#582f0e"
            strokeWidth="2.5"
          />
          {/* Small companion potato */}
          <ellipse cx="28" cy="74" rx="14" ry="10" transform="rotate(-15 28 74)" fill="#b08968" stroke="#582f0e" strokeWidth="2" />
          {/* Eyes / dimples */}
          <circle cx="48" cy="46" r="2" fill="#582f0e" opacity="0.7" />
          <circle cx="68" cy="54" r="2.5" fill="#582f0e" opacity="0.7" />
          <circle cx="42" cy="68" r="1.5" fill="#582f0e" opacity="0.7" />
          <circle cx="62" cy="74" r="2" fill="#582f0e" opacity="0.7" />
          <path d="M 44 45 Q 48 48 52 45" stroke="#7f5539" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    // 9. Onion (ලූනු / たまねぎ)
    case "onion":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="onionGrad" cx="40%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#f5ebe0" />
              <stop offset="50%" stopColor="#e3d5ca" />
              <stop offset="85%" stopColor="#d5bdaf" />
              <stop offset="100%" stopColor="#b08968" />
            </radialGradient>
          </defs>
          {/* Teardrop bulb */}
          <path
            d="M 50 18 C 30 36 20 54 22 72 C 24 88 40 94 50 94 C 60 94 76 88 78 72 C 80 54 70 36 50 18 Z"
            fill="url(#onionGrad)"
            stroke="#7f5539"
            strokeWidth="2.5"
          />
          {/* Bulb vertical peel contours */}
          <path d="M 50 20 Q 34 56 50 92" stroke="#b08968" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M 50 20 Q 66 56 50 92" stroke="#b08968" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
          {/* Roots at bottom */}
          <path d="M 46 94 Q 44 100 42 102" stroke="#7f5539" strokeWidth="1.5" fill="none" />
          <path d="M 50 94 L 50 103" stroke="#7f5539" strokeWidth="1.5" fill="none" />
          <path d="M 54 94 Q 56 100 58 102" stroke="#7f5539" strokeWidth="1.5" fill="none" />
          {/* Sprout tip at top */}
          <path d="M 50 18 L 48 10" stroke="#52796f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50 18 L 54 11" stroke="#84a98c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 10. Leek / Negi (ලීක්ස් / ねぎ)
    case "leek":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          {/* Bundle of 2 long Japanese Negi */}
          {/* First stalk */}
          <path d="M 32 90 L 58 24" stroke="#f8f9fa" strokeWidth="8" strokeLinecap="round" />
          <path d="M 58 24 L 70 8" stroke="#40916c" strokeWidth="7" strokeLinecap="round" />
          <path d="M 58 24 L 80 16" stroke="#52b788" strokeWidth="5" strokeLinecap="round" />
          {/* Second stalk */}
          <path d="M 40 92 L 64 30" stroke="#e9ecef" strokeWidth="8" strokeLinecap="round" />
          <path d="M 64 30 L 76 12" stroke="#2d6a4f" strokeWidth="7" strokeLinecap="round" />
          <path d="M 64 30 L 86 22" stroke="#40916c" strokeWidth="5" strokeLinecap="round" />
          {/* Roots at base */}
          <path d="M 32 90 L 26 96 M 34 92 L 30 98 M 38 92 L 36 99" stroke="#b08968" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 11. Lettuce (ලෙටස් / レタス)
    case "lettuce":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="letGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d8f3dc" />
              <stop offset="60%" stopColor="#95d5b2" />
              <stop offset="100%" stopColor="#52b788" />
            </radialGradient>
          </defs>
          {/* Wavy crinkled outer leaves */}
          <path
            d="M 30 35 C 20 45 15 65 26 78 C 36 90 64 92 76 80 C 88 68 85 45 74 34 C 64 22 38 22 30 35 Z"
            fill="url(#letGrad)"
            stroke="#2d6a4f"
            strokeWidth="2.5"
          />
          {/* Ruffled leaf layers */}
          <path d="M 32 40 Q 42 55 35 70 Q 55 60 70 65 Q 65 45 54 36" stroke="#40916c" strokeWidth="2" strokeLinecap="round" fill="#b7e4c7" opacity="0.8" />
          <path d="M 40 48 Q 50 60 60 50" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 12. Gobo (ගොබෝ / ごぼう)
    case "gobo":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          {/* Slender long burdock taproots */}
          <path d="M 22 88 Q 50 50 82 22" stroke="#582f0e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 32 92 Q 56 60 88 30" stroke="#7f5539" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Rings/markings */}
          <line x1="42" y1="62" x2="48" y2="60" stroke="#ddb892" strokeWidth="1.5" />
          <line x1="56" y1="48" x2="62" y2="46" stroke="#ddb892" strokeWidth="1.5" />
          <line x1="70" y1="34" x2="76" y2="32" stroke="#ddb892" strokeWidth="1.5" />
        </svg>
      );

    // 13. Shungiku (ෂින්ගිකු / しゅんぎく)
    case "shungiku":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          {/* Serrated leafy sprig */}
          <path d="M 45 92 Q 48 55 52 20" stroke="#40916c" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Serrated pinnate leaflets */}
          <path d="M 48 65 Q 28 58 24 50 Q 34 50 48 60" fill="#52b788" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 48 65 Q 68 58 74 50 Q 64 50 50 60" fill="#52b788" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 50 45 Q 32 38 28 30 Q 38 32 50 40" fill="#74c69d" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 50 45 Q 68 38 72 30 Q 62 32 50 40" fill="#74c69d" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 52 25 Q 40 18 50 8 Q 58 18 52 25" fill="#95d5b2" stroke="#1b4332" strokeWidth="1.5" />
        </svg>
      );

    // 14. Spinach / Hourensou (නිවිති / ほうれんそう)
    case "spinach":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          {/* Pinkish crown root */}
          <path d="M 50 94 L 50 85" stroke="#ff758f" strokeWidth="4.5" strokeLinecap="round" />
          {/* Fan of vibrant spade-shaped leaves */}
          <path d="M 50 85 Q 26 65 24 40 Q 42 42 50 85" fill="#2d6a4f" stroke="#1b4332" strokeWidth="2" />
          <path d="M 50 85 Q 74 65 76 40 Q 58 42 50 85" fill="#2d6a4f" stroke="#1b4332" strokeWidth="2" />
          <path d="M 50 85 Q 36 45 42 22 Q 54 35 50 85" fill="#40916c" stroke="#1b4332" strokeWidth="2" />
          <path d="M 50 85 Q 64 45 58 22 Q 46 35 50 85" fill="#52b788" stroke="#1b4332" strokeWidth="2" />
          {/* Leaf veins */}
          <path d="M 42 35 Q 46 55 50 85" stroke="#95d5b2" strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>
      );

    // 15. Cabbage (ගෝවා / キャベツ)
    case "cabbage":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="cabGrad" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#d8f3dc" />
              <stop offset="70%" stopColor="#74c69d" />
              <stop offset="100%" stopColor="#2d6a4f" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="54" r="34" fill="url(#cabGrad)" stroke="#1b4332" strokeWidth="2.5" />
          {/* Overlapping leaf wraps */}
          <path d="M 22 45 Q 45 30 75 42" stroke="#1b4332" strokeWidth="2" fill="#95d5b2" opacity="0.7" />
          <path d="M 78 55 Q 50 70 25 58" stroke="#1b4332" strokeWidth="2" fill="#74c69d" opacity="0.6" />
          {/* Leaf ribs */}
          <path d="M 35 40 Q 50 48 65 42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      );

    // 16. Chinese Cabbage / Hakusai (චීන ගෝවා / はくさい)
    case "chinese_cabbage":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          {/* Cylindrical oblong body */}
          <path
            d="M 36 86 C 30 72 32 40 40 22 C 46 12 54 12 60 22 C 68 40 70 72 64 86 C 58 92 42 92 36 86 Z"
            fill="#d8f3dc"
            stroke="#2d6a4f"
            strokeWidth="2.5"
          />
          {/* Green ruffled upper leaves */}
          <path d="M 40 22 Q 45 8 50 14 Q 55 8 60 22" fill="#52b788" stroke="#1b4332" strokeWidth="2" />
          {/* Long prominent white ribs */}
          <path d="M 44 88 L 44 42" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M 50 89 L 50 36" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M 56 88 L 56 42" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // 17. Daikon (රාබු / だいこん)
    case "daikon":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="daikonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d8f3dc" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8f9fa" />
            </linearGradient>
          </defs>
          {/* Tapered long white radish */}
          <path
            d="M 42 30 C 40 50 44 75 48 94 C 50 96 52 96 54 94 C 58 75 62 50 60 30 C 56 26 46 26 42 30 Z"
            fill="url(#daikonGrad)"
            stroke="#6c757d"
            strokeWidth="2"
          />
          {/* Fresh lush green top leaves */}
          <path d="M 48 30 Q 32 18 25 12 Q 38 18 48 26" fill="#40916c" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 52 30 Q 68 18 75 12 Q 62 18 52 26" fill="#40916c" stroke="#1b4332" strokeWidth="1.5" />
          <path d="M 50 28 Q 50 10 52 6 Q 54 12 52 28" fill="#52b788" stroke="#1b4332" strokeWidth="1.5" />
        </svg>
      );

    // 18. Carrot (කැරට් / にんじん)
    case "carrot":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="carrotGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff7b00" />
              <stop offset="70%" stopColor="#e85d04" />
              <stop offset="100%" stopColor="#dc2f02" />
            </linearGradient>
          </defs>
          {/* Tapered orange cone */}
          <path
            d="M 38 32 C 38 52 44 76 48 94 C 50 96 52 96 54 94 C 58 76 64 52 64 32 C 60 28 42 28 38 32 Z"
            fill="url(#carrotGrad)"
            stroke="#9d0208"
            strokeWidth="2.5"
          />
          {/* Horizontal texture ridges */}
          <path d="M 42 46 Q 50 48 58 46" stroke="#9d0208" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 44 60 Q 50 62 56 60" stroke="#9d0208" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 46 74 Q 50 75 54 74" stroke="#9d0208" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Green frond foliage */}
          <path d="M 50 28 L 50 10 M 50 28 L 40 14 M 50 28 L 60 14 M 50 28 L 44 8 M 50 28 L 56 8" stroke="#52b788" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // 19. Satoimo (සතෝඉමෝ / さといも)
    case "satoimo":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="satoGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#9c6644" />
              <stop offset="70%" stopColor="#7f5539" />
              <stop offset="100%" stopColor="#4a2810" />
            </radialGradient>
          </defs>
          {/* Main rounded hairy taro corm */}
          <ellipse cx="46" cy="56" rx="26" ry="28" fill="url(#satoGrad)" stroke="#381d08" strokeWidth="2.5" />
          {/* Smaller attached cormlet */}
          <ellipse cx="72" cy="64" rx="16" ry="18" fill="#7f5539" stroke="#381d08" strokeWidth="2" />
          {/* Horizontal concentric stripes typical of Taro */}
          <path d="M 28 48 Q 46 54 64 48" stroke="#381d08" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 26 58 Q 46 64 66 58" stroke="#381d08" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 30 68 Q 46 74 62 68" stroke="#381d08" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Cut stem tip */}
          <ellipse cx="46" cy="28" rx="7" ry="4" fill="#ddb892" stroke="#381d08" strokeWidth="1.5" />
        </svg>
      );

    // 20. Sweet Corn (බඩ ඉරිඟු / とうもろこし)
    case "corn":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="cornGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffea00" />
              <stop offset="70%" stopColor="#ffd000" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
          </defs>
          {/* Golden corn cob */}
          <path
            d="M 42 20 C 42 12 58 12 58 20 C 62 40 64 68 58 84 C 54 88 46 88 42 84 C 36 68 38 40 42 20 Z"
            fill="url(#cornGrad)"
            stroke="#e85d04"
            strokeWidth="2.5"
          />
          {/* Grid of sweet corn kernels */}
          {Array.from({ length: 7 }).map((_, r) => (
            <g key={r}>
              <circle cx="44" cy={28 + r * 8} r="2.5" fill="#fff3b0" />
              <circle cx="50" cy={28 + r * 8} r="2.5" fill="#fff3b0" />
              <circle cx="56" cy={28 + r * 8} r="2.5" fill="#fff3b0" />
            </g>
          ))}
          {/* Peeled green husks at base */}
          <path d="M 40 84 Q 22 70 18 50 Q 32 65 44 80" fill="#74c69d" stroke="#2d6a4f" strokeWidth="2" />
          <path d="M 60 84 Q 78 70 82 50 Q 68 65 56 80" fill="#74c69d" stroke="#2d6a4f" strokeWidth="2" />
        </svg>
      );

    // 21. Sweet Potato / Satsumaimo (බතල / さつまいも)
    case "sweet_potato":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="satsumaGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b5179e" />
              <stop offset="50%" stopColor="#7209b7" />
              <stop offset="100%" stopColor="#480ca8" />
            </linearGradient>
          </defs>
          {/* Elongated pointed purple sweet potato */}
          <path
            d="M 18 70 C 12 58 24 40 46 32 C 68 24 86 28 88 36 C 90 46 76 66 54 74 C 34 82 22 80 18 70 Z"
            fill="url(#satsumaGrad)"
            stroke="#3a0ca3"
            strokeWidth="2.5"
          />
          {/* Gold flesh reveal highlight */}
          <path d="M 32 55 Q 52 45 70 42" stroke="#ffb703" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <circle cx="36" cy="58" r="1.5" fill="#ffb703" opacity="0.8" />
          <circle cx="54" cy="50" r="1.5" fill="#ffb703" opacity="0.8" />
        </svg>
      );

    // 22. Strawberry (ස්ට්‍රෝබෙරි / いちご)
    case "strawberry":
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <radialGradient id="strawGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="60%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#a4161a" />
            </radialGradient>
          </defs>
          {/* Heart/teardrop berry */}
          <path
            d="M 50 30 C 32 30 22 45 26 64 C 30 78 44 92 50 94 C 56 92 70 78 74 64 C 78 45 68 30 50 30 Z"
            fill="url(#strawGrad)"
            stroke="#590d22"
            strokeWidth="2.5"
          />
          {/* Golden seeds */}
          <circle cx="42" cy="48" r="1.5" fill="#ffe066" />
          <circle cx="50" cy="45" r="1.5" fill="#ffe066" />
          <circle cx="58" cy="48" r="1.5" fill="#ffe066" />
          <circle cx="36" cy="60" r="1.5" fill="#ffe066" />
          <circle cx="46" cy="62" r="1.5" fill="#ffe066" />
          <circle cx="56" cy="62" r="1.5" fill="#ffe066" />
          <circle cx="64" cy="60" r="1.5" fill="#ffe066" />
          <circle cx="44" cy="74" r="1.5" fill="#ffe066" />
          <circle cx="54" cy="74" r="1.5" fill="#ffe066" />
          <circle cx="50" cy="84" r="1.5" fill="#ffe066" />
          {/* Green star calyx & stem */}
          <path d="M 50 30 L 50 16" stroke="#40916c" strokeWidth="4" strokeLinecap="round" />
          <path
            d="M 50 30 L 38 24 L 42 32 L 32 36 L 44 38 L 46 44 L 50 36 L 56 44 L 56 38 L 68 36 L 58 32 L 62 24 Z"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="1.5"
          />
        </svg>
      );

    // 23. Edamame (එදමාමේ / 枝豆)
    case "edamame":
    default:
      return (
        <svg viewBox="0 0 100 100" className={`${className} ${animClass}`}>
          <defs>
            <linearGradient id="edaGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#74c69d" />
              <stop offset="50%" stopColor="#52b788" />
              <stop offset="100%" stopColor="#2d6a4f" />
            </linearGradient>
          </defs>
          {/* Curved bean pod */}
          <path
            d="M 18 55 C 22 36 40 32 50 35 C 60 32 78 36 82 55 C 78 72 60 76 50 72 C 40 76 22 72 18 55 Z"
            fill="url(#edaGrad)"
            stroke="#1b4332"
            strokeWidth="3"
          />
          {/* 3 bean bumps inside pod */}
          <circle cx="32" cy="54" r="9" fill="#95d5b2" stroke="#40916c" strokeWidth="2" />
          <circle cx="50" cy="53" r="10" fill="#95d5b2" stroke="#40916c" strokeWidth="2" />
          <circle cx="68" cy="54" r="9" fill="#95d5b2" stroke="#40916c" strokeWidth="2" />
          {/* Little stem tip */}
          <path d="M 18 55 Q 12 52 10 46" stroke="#40916c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 82 55 Q 86 54 88 50" stroke="#40916c" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
};
