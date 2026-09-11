import React from "react";

interface JapaneseBattlefieldBackgroundProps {
  className?: string;
}

export const JapaneseBattlefieldBackground: React.FC<JapaneseBattlefieldBackgroundProps> = ({
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <style>{`
        @keyframes bambooSwayLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3.5deg) skewX(-1.5deg); }
        }
        @keyframes bambooSwayRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3.5deg) skewX(1.5deg); }
        }
        @keyframes snowDrift {
          0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.8; }
          100% { transform: translateY(320px) translateX(-25px); opacity: 0; }
        }
        @keyframes mistRoll {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
        }
        .animate-bamboo-left {
          transform-origin: bottom left;
          animation: bambooSwayLeft 5s ease-in-out infinite;
        }
        .animate-bamboo-right {
          transform-origin: bottom right;
          animation: bambooSwayRight 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Deep Midnight Night Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #020617 0%, #0a1329 30%, #111d38 55%, #182848 75%, #0b1528 100%)"
        }}
      />

      {/* 2. Twinkling Stars & Nebula Glow */}
      <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nebulaGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#c084fc" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#nebulaGlow)" />
        {/* Starfield dots */}
        {[
          [5, 12, 1.2], [12, 8, 1.5], [18, 22, 1], [25, 15, 1.8], [32, 6, 1],
          [38, 18, 1.3], [44, 10, 1.5], [52, 14, 1.2], [58, 8, 1.8], [65, 20, 1],
          [72, 11, 1.4], [78, 16, 1.6], [85, 7, 1.2], [92, 19, 1.5], [96, 10, 1],
          [10, 32, 1], [22, 28, 1.4], [35, 30, 1.2], [48, 25, 1.6], [62, 32, 1.1],
          [75, 26, 1.3], [88, 30, 1.5]
        ].map(([x, y, r], i) => (
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill="#ffffff" opacity={0.65 + (i % 4) * 0.1} />
        ))}
      </svg>

      {/* 3. Luminous Full Moon with Silver Aura */}
      <div className="absolute top-4 right-12 sm:right-24 pointer-events-none">
        <div className="absolute -inset-8 bg-amber-100/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -inset-4 bg-amber-50/30 rounded-full blur-lg" />
        <div className="relative w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-gradient-to-br from-[#fffdfa] via-[#fef9c3] to-[#fef08a] shadow-[0_0_50px_rgba(254,240,138,0.45)] border border-amber-100/60 overflow-hidden">
          <div className="absolute top-4 left-6 w-6 h-5 bg-amber-200/40 rounded-full blur-[1px]" />
          <div className="absolute top-9 left-11 w-8 h-7 bg-amber-200/30 rounded-full blur-[2px]" />
          <div className="absolute bottom-4 right-5 w-7 h-6 bg-amber-200/35 rounded-full blur-[1px]" />
        </div>
      </div>

      {/* 4. MAJESTIC SNOW MOUNTAIN RANGE (හිම කඳු පෙළ - MOUNT FUJI & SNOWY PEAKS) */}
      <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 h-52 sm:h-64 pointer-events-none">
        <svg viewBox="0 0 1200 320" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            {/* Distant Snow Mountains gradient */}
            <linearGradient id="deepSnowMtn" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </linearGradient>
            {/* Fuji snowcap gradient */}
            <linearGradient id="fujiSnow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#e0e7ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
            </linearGradient>
            {/* Left/Right snow peak gradients */}
            <linearGradient id="sideSnowPeak" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="70%" stopColor="#c7d2fe" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.2" />
            </linearGradient>
            {/* Foreground rolling hills */}
            <linearGradient id="hillsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Far Distant Jagged Snow Mountains (Backdrop) */}
          <path
            d="M 0 320 L 0 190 L 110 140 L 220 185 L 340 120 L 460 170 L 600 80 L 740 165 L 880 110 L 1020 175 L 1140 130 L 1200 160 L 1200 320 Z"
            fill="#172554"
            opacity="0.5"
          />

          {/* Left Snowy Mountain Peak */}
          <polygon points="260,110 120,320 400,320" fill="url(#deepSnowMtn)" opacity="0.9" />
          <polygon points="260,110 200,180 230,175 260,190 285,178 320,185" fill="url(#sideSnowPeak)" />

          {/* Right Snowy Mountain Peak */}
          <polygon points="960,105 820,320 1100,320" fill="url(#deepSnowMtn)" opacity="0.9" />
          <polygon points="960,105 900,175 935,170 960,186 990,174 1020,180" fill="url(#sideSnowPeak)" />

          {/* Central Mount Fuji (富士山) Cone */}
          <polygon points="600,45 400,320 800,320" fill="url(#deepSnowMtn)" />
          {/* Mount Fuji White Snow Cap */}
          <polygon
            points="600,45 525,135 550,130 575,145 600,132 625,146 650,131 675,136"
            fill="url(#fujiSnow)"
          />
          {/* Snow tongue rivulets flowing down Fuji */}
          <path
            d="M 555 135 L 550 175 L 562 142 M 590 138 L 595 190 L 605 142 M 630 145 L 638 180 L 626 142"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Foreground rolling pine hills with Pagoda & Torii */}
          <path
            d="M 0 320 L 0 250 Q 150 195 350 255 Q 550 305 800 235 Q 1020 185 1200 245 L 1200 320 Z"
            fill="url(#hillsGrad)"
          />

          {/* Distant Japanese Pagoda (五重塔) on left hill */}
          <g transform="translate(180, 165)" fill="#0f172a">
            <line x1="25" y1="0" x2="25" y2="18" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="25" cy="5" r="2.5" />
            <polygon points="10,25 25,18 40,25 35,32 15,32" />
            <polygon points="7,38 25,30 43,38 38,46 12,46" />
            <polygon points="4,52 25,44 46,52 40,61 10,61" />
            <polygon points="1,68 25,58 49,68 43,78 7,78" />
            <polygon points="0,85 25,74 50,85 45,100 5,100" />
            <rect x="18" y="100" width="14" height="25" />
          </g>

          {/* Distant Shinto Torii Gate (鳥居) on right hill */}
          <g transform="translate(940, 175)" fill="#dc2626" stroke="#991b1b" strokeWidth="1">
            <path d="M 0 10 Q 25 5 50 10 L 48 14 Q 25 10 2 14 Z" />
            <rect x="5" y="18" width="40" height="3" />
            <rect x="12" y="10" width="4" height="38" />
            <rect x="34" y="10" width="4" height="38" />
          </g>
        </svg>
      </div>

      {/* 5. GENTLE FALLING SNOW PARTICLES (හිම පියලි) */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: 10, delay: 0, duration: 6, size: 2.5 },
          { x: 22, delay: 2, duration: 7, size: 3 },
          { x: 35, delay: 1, duration: 5.5, size: 2 },
          { x: 48, delay: 3, duration: 6.5, size: 2.5 },
          { x: 62, delay: 1.5, duration: 8, size: 3.5 },
          { x: 75, delay: 3.5, duration: 5.8, size: 2 },
          { x: 88, delay: 0.5, duration: 7.2, size: 2.8 },
          { x: 95, delay: 2.5, duration: 6.2, size: 2.2 }
        ].map((snow, i) => (
          <div
            key={`snow-${i}`}
            className="absolute rounded-full bg-white/80 shadow-[0_0_8px_white]"
            style={{
              left: `${snow.x}%`,
              top: "-10px",
              width: `${snow.size}px`,
              height: `${snow.size}px`,
              animation: `snowDrift ${snow.duration}s linear infinite`,
              animationDelay: `${snow.delay}s`
            }}
          />
        ))}
      </div>

      {/* 6. SWAYING BAMBOO GROVE - LEFT FLANK (උණ බට පැද්දෙන visual) */}
      <div className="absolute bottom-16 left-0 w-36 sm:w-56 h-64 sm:h-72 pointer-events-none z-10 animate-bamboo-left opacity-85">
        <svg viewBox="0 0 160 220" className="w-full h-full" fill="#04120c">
          {/* Bamboo Stalk 1 */}
          <rect x="15" y="15" width="7" height="205" rx="2" fill="#0b2e1e" />
          <line x1="14" y1="50" x2="23" y2="50" stroke="#1b4d36" strokeWidth="2" />
          <line x1="14" y1="90" x2="23" y2="90" stroke="#1b4d36" strokeWidth="2" />
          <line x1="14" y1="135" x2="23" y2="135" stroke="#1b4d36" strokeWidth="2" />
          <line x1="14" y1="180" x2="23" y2="180" stroke="#1b4d36" strokeWidth="2" />

          {/* Bamboo Stalk 2 */}
          <rect x="38" y="0" width="8" height="220" rx="2" fill="#061d13" />
          <line x1="37" y1="40" x2="47" y2="40" stroke="#15422e" strokeWidth="2" />
          <line x1="37" y1="80" x2="47" y2="80" stroke="#15422e" strokeWidth="2" />
          <line x1="37" y1="125" x2="47" y2="125" stroke="#15422e" strokeWidth="2" />
          <line x1="37" y1="170" x2="47" y2="170" stroke="#15422e" strokeWidth="2" />

          {/* Bamboo Stalk 3 */}
          <rect x="65" y="30" width="6" height="190" rx="2" fill="#09271a" />
          <line x1="64" y1="65" x2="72" y2="65" stroke="#1b4d36" strokeWidth="1.5" />
          <line x1="64" y1="105" x2="72" y2="105" stroke="#1b4d36" strokeWidth="1.5" />
          <line x1="64" y1="150" x2="72" y2="150" stroke="#1b4d36" strokeWidth="1.5" />

          {/* Bamboo Stalk 4 (Slanted) */}
          <rect x="90" y="50" width="5" height="170" rx="1.5" fill="#05170f" transform="rotate(2 90 220)" />

          {/* Bamboo Leaves - Clusters swaying with the stalks */}
          <g fill="#103a27">
            <path d="M 22 50 Q 40 40 48 44 Q 38 56 22 53 Z" />
            <path d="M 22 50 Q 5 38 -2 42 Q 8 55 22 52 Z" />
            <path d="M 45 40 Q 65 28 72 32 Q 58 46 45 43 Z" />
            <path d="M 45 80 Q 25 70 18 76 Q 30 88 45 83 Z" />
            <path d="M 45 80 Q 68 70 76 74 Q 60 88 45 83 Z" />
            <path d="M 70 65 Q 92 52 100 58 Q 84 72 70 68 Z" />
            <path d="M 70 105 Q 50 95 42 102 Q 56 114 70 108 Z" />
            <path d="M 92 50 Q 115 36 124 42 Q 106 58 92 53 Z" />
            <path d="M 92 90 Q 112 80 120 85 Q 104 98 92 93 Z" />
          </g>
        </svg>
      </div>

      {/* 7. SWAYING BAMBOO GROVE - RIGHT FLANK (උණ බට පැද්දෙන visual) */}
      <div className="absolute bottom-16 right-0 w-36 sm:w-56 h-64 sm:h-72 pointer-events-none z-10 animate-bamboo-right opacity-85">
        <svg viewBox="0 0 160 220" className="w-full h-full" fill="#04120c">
          <g transform="scale(-1, 1) translate(-160, 0)">
            {/* Bamboo Stalk 1 */}
            <rect x="15" y="10" width="7.5" height="210" rx="2" fill="#0b2e1e" />
            <line x1="14" y1="45" x2="23" y2="45" stroke="#1b4d36" strokeWidth="2" />
            <line x1="14" y1="85" x2="23" y2="85" stroke="#1b4d36" strokeWidth="2" />
            <line x1="14" y1="130" x2="23" y2="130" stroke="#1b4d36" strokeWidth="2" />

            {/* Bamboo Stalk 2 */}
            <rect x="42" y="25" width="8" height="195" rx="2" fill="#061d13" />
            <line x1="41" y1="60" x2="51" y2="60" stroke="#15422e" strokeWidth="2" />
            <line x1="41" y1="105" x2="51" y2="105" stroke="#15422e" strokeWidth="2" />
            <line x1="41" y1="150" x2="51" y2="150" stroke="#15422e" strokeWidth="2" />

            {/* Bamboo Stalk 3 */}
            <rect x="70" y="5" width="6" height="215" rx="1.5" fill="#09271a" />
            <line x1="69" y1="40" x2="77" y2="40" stroke="#1b4d36" strokeWidth="1.5" />
            <line x1="69" y1="85" x2="77" y2="85" stroke="#1b4d36" strokeWidth="1.5" />
            <line x1="69" y1="135" x2="77" y2="135" stroke="#1b4d36" strokeWidth="1.5" />

            {/* Leaves */}
            <g fill="#103a27">
              <path d="M 22 45 Q 42 35 50 40 Q 38 52 22 48 Z" />
              <path d="M 22 85 Q 5 72 -3 78 Q 8 91 22 88 Z" />
              <path d="M 48 60 Q 70 48 78 54 Q 62 68 48 63 Z" />
              <path d="M 48 105 Q 26 94 18 100 Q 32 113 48 108 Z" />
              <path d="M 74 40 Q 98 28 106 34 Q 88 48 74 43 Z" />
              <path d="M 74 85 Q 96 74 104 80 Q 88 94 74 88 Z" />
            </g>
          </g>
        </svg>
      </div>

      {/* 8. TRADITIONAL STONE LANTERNS WITH AMBER GLOW */}
      <div className="absolute bottom-20 left-4 sm:left-10 z-15 pointer-events-none">
        <svg width="40" height="70" viewBox="0 0 40 70">
          <polygon points="20,5 38,18 2,18" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="20" cy="4" r="2.5" fill="#1e293b" />
          <rect x="10" y="18" width="20" height="16" fill="#fef08a" opacity="0.95" />
          <rect x="10" y="18" width="20" height="16" fill="#f59e0b" opacity="0.4" />
          <line x1="20" y1="18" x2="20" y2="34" stroke="#78350f" strokeWidth="1.5" />
          <line x1="10" y1="26" x2="30" y2="26" stroke="#78350f" strokeWidth="1.5" />
          <rect x="8" y="34" width="24" height="6" fill="#1e293b" />
          <rect x="15" y="40" width="10" height="20" fill="#0f172a" />
          <rect x="5" y="60" width="30" height="10" fill="#1e293b" rx="2" />
        </svg>
        <div className="absolute top-4 left-1 w-8 h-8 bg-amber-300/40 rounded-full blur-md animate-pulse" />
      </div>

      <div className="absolute bottom-20 right-4 sm:right-10 z-15 pointer-events-none">
        <svg width="40" height="70" viewBox="0 0 40 70">
          <polygon points="20,5 38,18 2,18" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="20" cy="4" r="2.5" fill="#1e293b" />
          <rect x="10" y="18" width="20" height="16" fill="#fef08a" opacity="0.95" />
          <rect x="10" y="18" width="20" height="16" fill="#f59e0b" opacity="0.4" />
          <line x1="20" y1="18" x2="20" y2="34" stroke="#78350f" strokeWidth="1.5" />
          <line x1="10" y1="26" x2="30" y2="26" stroke="#78350f" strokeWidth="1.5" />
          <rect x="8" y="34" width="24" height="6" fill="#1e293b" />
          <rect x="15" y="40" width="10" height="20" fill="#0f172a" />
          <rect x="5" y="60" width="30" height="10" fill="#1e293b" rx="2" />
        </svg>
        <div className="absolute top-4 left-1 w-8 h-8 bg-amber-300/40 rounded-full blur-md animate-pulse" />
      </div>

      {/* 9. DOJO COURTYARD STONE / TATAMI PLATFORM GROUND */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-[#020617] via-[#090e1a] to-[#172033] border-t-2 border-amber-400/30">
        <div className="w-full h-full opacity-30 flex justify-around">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-px h-full bg-gradient-to-b from-amber-400/30 to-transparent" />
          ))}
        </div>
      </div>

      {/* 10. MYSTICAL ROLLING MIST & CHERRY BLOSSOM PETALS */}
      <div className="absolute bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-white/10 via-white/5 to-transparent blur-xs pointer-events-none" />

      {[
        { x: "8%", y: "25%", s: "scale-90", o: "opacity-70", d: "animate-pulse" },
        { x: "24%", y: "45%", s: "scale-105", o: "opacity-80", d: "" },
        { x: "42%", y: "15%", s: "scale-75", o: "opacity-60", d: "animate-pulse" },
        { x: "65%", y: "35%", s: "scale-100", o: "opacity-85", d: "" },
        { x: "82%", y: "55%", s: "scale-85", o: "opacity-70", d: "animate-pulse" },
        { x: "90%", y: "20%", s: "scale-95", o: "opacity-75", d: "" }
      ].map((petal, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none text-rose-300/80 drop-shadow-sm ${petal.s} ${petal.o} ${petal.d}`}
          style={{ left: petal.x, top: petal.y }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};
