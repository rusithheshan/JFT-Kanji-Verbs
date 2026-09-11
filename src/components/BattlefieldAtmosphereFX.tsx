import React, { useEffect, useState } from "react";

export type BattleAtmosphere =
  | "sakura_blizzard"
  | "thunder_storm"
  | "shooting_stars"
  | "spirit_fireflies"
  | "crimson_embers"
  | "bamboo_wind"
  | "celestial_rays";

export interface AtmosphereMeta {
  id: BattleAtmosphere;
  nameSi: string;
  nameEn: string;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  skyGradient: string;
  moonColor: string;
  moonGlow: string;
}

export const ATMOSPHERES: Record<BattleAtmosphere, AtmosphereMeta> = {
  sakura_blizzard: {
    id: "sakura_blizzard",
    nameSi: "සකුරා මල් සුළි කුණාටුව",
    nameEn: "Sakura Blizzard",
    icon: "🌸",
    badgeBg: "bg-pink-950/80",
    badgeBorder: "border-pink-400/50",
    badgeText: "text-pink-200",
    skyGradient: "from-[#170c22] via-[#2a1334] to-[#110819]",
    moonColor: "from-pink-100 to-amber-100/70",
    moonGlow: "shadow-[0_0_60px_rgba(244,114,182,0.4)]"
  },
  thunder_storm: {
    id: "thunder_storm",
    nameSi: "අකුණු සහ විදුලි කුණාටුව",
    nameEn: "Thunder & Lightning Tempest",
    icon: "⚡",
    badgeBg: "bg-indigo-950/80",
    badgeBorder: "border-sky-400/50",
    badgeText: "text-sky-200",
    skyGradient: "from-[#070d1e] via-[#0d1733] to-[#040813]",
    moonColor: "from-sky-100 to-indigo-200/50",
    moonGlow: "shadow-[0_0_60px_rgba(56,189,248,0.4)]"
  },
  shooting_stars: {
    id: "shooting_stars",
    nameSi: "තරු වර්ෂාව සහ ආලෝක ධාරා",
    nameEn: "Meteor Shower & Aurora",
    icon: "🌠",
    badgeBg: "bg-violet-950/80",
    badgeBorder: "border-cyan-400/50",
    badgeText: "text-cyan-200",
    skyGradient: "from-[#060818] via-[#0b1435] to-[#03050c]",
    moonColor: "from-cyan-100 to-blue-200/60",
    moonGlow: "shadow-[0_0_60px_rgba(34,211,238,0.45)]"
  },
  spirit_fireflies: {
    id: "spirit_fireflies",
    nameSi: "කනාමැදිරි දැල්වීම සහ වන අලෝක",
    nameEn: "Firefly Twilight & Spirit Wisps",
    icon: "✨",
    badgeBg: "bg-emerald-950/80",
    badgeBorder: "border-emerald-400/50",
    badgeText: "text-emerald-200",
    skyGradient: "from-[#031512] via-[#072b24] to-[#02100d]",
    moonColor: "from-amber-100 to-emerald-200/50",
    moonGlow: "shadow-[0_0_60px_rgba(52,211,153,0.4)]"
  },
  crimson_embers: {
    id: "crimson_embers",
    nameSi: "ගිනි පුපුරු සහ රතු සඳ රැස්",
    nameEn: "Volcano Embers & Crimson Moon",
    icon: "🔥",
    badgeBg: "bg-red-950/80",
    badgeBorder: "border-rose-400/50",
    badgeText: "text-rose-200",
    skyGradient: "from-[#220707] via-[#380e0e] to-[#130303]",
    moonColor: "from-rose-200 to-red-400/70",
    moonGlow: "shadow-[0_0_60px_rgba(244,63,94,0.5)]"
  },
  bamboo_wind: {
    id: "bamboo_wind",
    nameSi: "උණ පඳුරු සුළඟ සහ රන් පත්‍ර",
    nameEn: "Zen Bamboo Wind & Golden Leaves",
    icon: "🍃",
    badgeBg: "bg-[#0c241b]/90",
    badgeBorder: "border-lime-400/50",
    badgeText: "text-lime-200",
    skyGradient: "from-[#081813] via-[#102a21] to-[#05110d]",
    moonColor: "from-amber-100 to-yellow-100/60",
    moonGlow: "shadow-[0_0_60px_rgba(234,179,8,0.4)]"
  },
  celestial_rays: {
    id: "celestial_rays",
    nameSi: "දිව්‍යමය රන්වන් කිරණ සහ තාරකා",
    nameEn: "Celestial Golden Sunburst",
    icon: "☀️",
    badgeBg: "bg-amber-950/80",
    badgeBorder: "border-amber-400/50",
    badgeText: "text-amber-200",
    skyGradient: "from-[#191307] via-[#2d200b] to-[#0e0a03]",
    moonColor: "from-yellow-100 to-amber-300/80",
    moonGlow: "shadow-[0_0_70px_rgba(251,191,36,0.6)]"
  }
};

export const ALL_ATMOSPHERES: BattleAtmosphere[] = [
  "sakura_blizzard",
  "thunder_storm",
  "shooting_stars",
  "spirit_fireflies",
  "crimson_embers",
  "bamboo_wind",
  "celestial_rays"
];

// Helper to pick next atmosphere different from current
export function getNextAtmosphere(current: BattleAtmosphere): BattleAtmosphere {
  const others = ALL_ATMOSPHERES.filter((a) => a !== current);
  return others[Math.floor(Math.random() * others.length)];
}

interface Props {
  atmosphere: BattleAtmosphere;
}

export const BattlefieldAtmosphereFX: React.FC<Props> = ({ atmosphere }) => {
  const meta = ATMOSPHERES[atmosphere] || ATMOSPHERES.sakura_blizzard;
  const [lightningFlash, setLightningFlash] = useState(false);

  // Occasional random lightning flash during thunder_storm
  useEffect(() => {
    if (atmosphere !== "thunder_storm") return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 120);
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setLightningFlash(true);
            setTimeout(() => setLightningFlash(false), 90);
          }, 180);
        }
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [atmosphere]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 transition-colors duration-1000">
      {/* Sky Background Gradient */}
      <div
        className={`absolute inset-0 bg-linear-to-b ${meta.skyGradient} transition-all duration-1000`}
      />

      {/* Lightning Flash Overlay */}
      {atmosphere === "thunder_storm" && lightningFlash && (
        <div className="absolute inset-0 bg-sky-200/25 z-20 pointer-events-none transition-opacity duration-75" />
      )}

      {/* Atmospheric Glowing Moon */}
      <div
        className={`absolute top-4 sm:top-6 right-6 sm:right-10 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-linear-to-b ${meta.moonColor} ${meta.moonGlow} opacity-90 transition-all duration-1000`}
      >
        {/* Subtle craters */}
        <div className="absolute top-4 left-5 w-3 h-3 rounded-full bg-black/10 blur-[0.5px]" />
        <div className="absolute bottom-5 right-6 w-4 h-4 rounded-full bg-black/10 blur-[0.5px]" />
        <div className="absolute top-9 left-11 w-2.5 h-2.5 rounded-full bg-black/10 blur-[0.5px]" />
      </div>

      {/* Mount Fuji Silhouette */}
      <svg
        className="absolute bottom-14 sm:bottom-16 left-1/4 w-72 sm:w-96 h-36 sm:h-44 opacity-25"
        viewBox="0 0 300 150"
      >
        <polygon points="150,20 280,150 20,150" fill="#94a3b8" />
        <polygon points="150,20 185,55 115,55" fill="#ffffff" />
      </svg>

      {/* ========================================================================= */}
      {/* 1. SAKURA BLIZZARD: Swirling cherry blossom petals across the night arena */}
      {/* ========================================================================= */}
      {atmosphere === "sakura_blizzard" && (
        <div className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => {
            const startLeft = (i * 4.2 + (i % 3) * 7) % 100;
            const animDuration = 4.5 + (i % 5) * 1.2;
            const animDelay = (i * 0.35) % 4.0;
            const size = 10 + (i % 4) * 4;
            return (
              <div
                key={i}
                className="absolute animate-float-sakura"
                style={{
                  left: `${startLeft}%`,
                  top: `-20px`,
                  animation: `sakuraFall ${animDuration}s linear infinite`,
                  animationDelay: `${animDelay}s`,
                  opacity: 0.8
                }}
              >
                <svg width={size} height={size} viewBox="0 0 24 24">
                  <path
                    d="M12 2 C13.5 6 18 8 18 12 C18 16 14 18 12 22 C10 18 6 16 6 12 C6 8 10.5 6 12 2 Z"
                    fill="#f472b6"
                    opacity={0.85}
                  />
                  <circle cx="12" cy="12" r="1.5" fill="#fbcfe8" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THUNDER STORM: Jagged lightning bolts, rain streaks & stormy dark mist */}
      {/* ========================================================================= */}
      {atmosphere === "thunder_storm" && (
        <div className="absolute inset-0">
          {/* Stormy Rain Streaks */}
          {Array.from({ length: 28 }).map((_, i) => {
            const left = (i * 3.6) % 100;
            const delay = (i * 0.12) % 1.5;
            const height = 18 + (i % 4) * 8;
            return (
              <div
                key={i}
                className="absolute w-[1.5px] bg-sky-200/40 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `-30px`,
                  height: `${height}px`,
                  transform: "rotate(15deg)",
                  animation: `rainFall 0.8s linear infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}

          {/* Glowing Jagged Lightning Arc during flash */}
          {lightningFlash && (
            <svg
              className="absolute top-0 left-1/3 w-48 h-64 opacity-90 z-30 filter drop-shadow-[0_0_12px_#38bdf8]"
              viewBox="0 0 100 200"
            >
              <polyline
                points="50,0 42,60 65,70 30,130 50,135 25,200"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <polyline
                points="50,0 42,60 65,70 30,130 50,135 25,200"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SHOOTING STARS: Streaking meteors across the night sky & cyan aurora  */}
      {/* ========================================================================= */}
      {atmosphere === "shooting_stars" && (
        <div className="absolute inset-0">
          {/* Aurora Borealis Glow Band */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-cyan-500/15 via-emerald-500/10 to-transparent blur-2xl opacity-60 animate-pulse" />

          {/* Diagonal Shooting Stars */}
          {Array.from({ length: 6 }).map((_, i) => {
            const startX = 15 + i * 14;
            const delay = i * 1.8;
            return (
              <div
                key={i}
                className="absolute w-28 sm:w-36 h-[2px] bg-linear-to-r from-transparent via-cyan-200 to-white opacity-0"
                style={{
                  top: `${10 + (i % 4) * 12}%`,
                  left: `${startX}%`,
                  transform: "rotate(-32deg)",
                  animation: `shootingStar 3.5s ease-in infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}

          {/* Twinkling Star Field */}
          {Array.from({ length: 22 }).map((_, i) => {
            const left = (i * 4.7) % 95;
            const top = (i * 3.9) % 55;
            const size = 1.5 + (i % 3);
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-ping"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDuration: `${2.0 + (i % 3)}s`,
                  opacity: 0.7
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SPIRIT FIREFLIES: Golden & Jade green floating fireflies with soft halo */}
      {/* ========================================================================= */}
      {atmosphere === "spirit_fireflies" && (
        <div className="absolute inset-0">
          {Array.from({ length: 22 }).map((_, i) => {
            const left = (i * 4.5 + (i % 3) * 6) % 94;
            const bottom = 12 + (i * 3.2) % 65;
            const duration = 3.5 + (i % 4) * 0.9;
            const delay = (i * 0.4) % 3.0;
            const color = i % 2 === 0 ? "#34d399" : "#fef08a";
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  bottom: `${bottom}%`,
                  width: `${5 + (i % 3) * 2}px`,
                  height: `${5 + (i % 3) * 2}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}, 0 0 20px ${color}`,
                  animation: `fireflyFloat ${duration}s ease-in-out infinite alternate`,
                  animationDelay: `${delay}s`,
                  opacity: 0.85
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CRIMSON EMBERS: Glowing volcanic ash & sparks rising into red sky */}
      {/* ========================================================================= */}
      {atmosphere === "crimson_embers" && (
        <div className="absolute inset-0">
          {/* Blood Moon Ring Overlay */}
          <div className="absolute top-2 right-8 w-28 h-28 rounded-full border-2 border-rose-500/40 animate-ping pointer-events-none opacity-40" />

          {/* Rising Glowing Embers */}
          {Array.from({ length: 26 }).map((_, i) => {
            const left = (i * 3.9 + (i % 4) * 5) % 96;
            const size = 3 + (i % 4) * 2;
            const duration = 3.0 + (i % 3) * 0.8;
            const delay = (i * 0.25) % 3.0;
            const emberColor = i % 3 === 0 ? "#f43f5e" : i % 3 === 1 ? "#fb923c" : "#facc15";
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  bottom: `15px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: emberColor,
                  boxShadow: `0 0 8px ${emberColor}`,
                  animation: `emberRise ${duration}s ease-out infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BAMBOO WIND: Whirling bamboo leaves & breezy green trails */}
      {/* ========================================================================= */}
      {atmosphere === "bamboo_wind" && (
        <div className="absolute inset-0">
          {/* Bamboo silhouettes on sides */}
          <div className="absolute -bottom-4 left-2 w-8 h-48 border-r-4 border-[#1c382b] opacity-40" />
          <div className="absolute -bottom-4 left-6 w-6 h-56 border-r-4 border-[#1c382b] opacity-30" />
          <div className="absolute -bottom-4 right-4 w-8 h-52 border-l-4 border-[#1c382b] opacity-40" />

          {/* Swirling bamboo leaves */}
          {Array.from({ length: 20 }).map((_, i) => {
            const startLeft = (i * 5.1) % 100;
            const duration = 4.0 + (i % 3) * 1.0;
            const delay = (i * 0.3) % 2.5;
            const leafColor = i % 2 === 0 ? "#84cc16" : "#eab308";
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${startLeft}%`,
                  top: `-15px`,
                  animation: `bambooLeafSwirl ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  opacity: 0.85
                }}
              >
                <svg width="22" height="10" viewBox="0 0 24 12">
                  <path
                    d="M 2 6 Q 12 0 22 6 Q 12 12 2 6 Z"
                    fill={leafColor}
                    opacity={0.8}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CELESTIAL RAYS: Majestic Shinto golden rays & heavenly stardust */}
      {/* ========================================================================= */}
      {atmosphere === "celestial_rays" && (
        <div className="absolute inset-0">
          {/* Rotating celestial rays radiating from horizon center */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-20 pointer-events-none animate-spin-slow">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={200 + 200 * Math.cos((i * Math.PI) / 6)}
                  y2={200 + 200 * Math.sin((i * Math.PI) / 6)}
                  stroke="#fbbf24"
                  strokeWidth="24"
                  strokeOpacity="0.3"
                />
              ))}
            </svg>
          </div>

          {/* Shimmering Golden Dust Particles */}
          {Array.from({ length: 24 }).map((_, i) => {
            const left = (i * 4.2) % 96;
            const top = (i * 3.5) % 75;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-amber-200/90 shadow-[0_0_10px_#fde047] animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDuration: `${1.8 + (i % 3)}s`,
                  opacity: 0.8
                }}
              />
            );
          })}
        </div>
      )}

      {/* Global Embedded Styles for Atmospheric Keyframes */}
      <style>{`
        @keyframes sakuraFall {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(120px, 420px, 0) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes rainFall {
          0% {
            transform: translateY(0) rotate(15deg);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(440px) rotate(15deg);
            opacity: 0.1;
          }
        }
        @keyframes shootingStar {
          0% {
            transform: translate3d(0, 0, 0) rotate(-32deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          25% {
            transform: translate3d(180px, 120px, 0) rotate(-32deg);
            opacity: 0;
          }
          100% {
            transform: translate3d(180px, 120px, 0) rotate(-32deg);
            opacity: 0;
          }
        }
        @keyframes fireflyFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(18px, -24px, 0) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate3d(-14px, -45px, 0) scale(0.9);
            opacity: 0.4;
          }
        }
        @keyframes emberRise {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translate3d(${Math.sin(1) * 20}px, -150px, 0) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(${Math.sin(2) * 35}px, -320px, 0) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes bambooLeafSwirl {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(140px, 390px, 0) rotate(540deg);
            opacity: 0;
          }
        }
        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 60s linear infinite;
        }
      `}</style>
    </div>
  );
};
