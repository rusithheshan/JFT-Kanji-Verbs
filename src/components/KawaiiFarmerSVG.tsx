import React from "react";

interface KawaiiFarmerProps {
  character: "boy" | "girl";
  action?: "idle" | "celebrate" | "water" | "think";
  className?: string;
}

export const KawaiiFarmerSVG: React.FC<KawaiiFarmerProps> = ({
  character,
  action = "idle",
  className = "w-28 h-36",
}) => {
  const isGirl = character === "girl";
  const isJumping = action === "celebrate";
  const isWatering = action === "water";

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 120 150"
        className={`w-full h-full transition-transform duration-200 ${
          isJumping ? "-translate-y-3 scale-105" : ""
        }`}
      >
        <defs>
          <radialGradient id="farmerBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Straw Hat Brim (Behind head) */}
        <ellipse cx="60" cy="40" rx="46" ry="14" fill="#fcd34d" stroke="#d97706" strokeWidth="2.5" />
        {/* Hat Ribbon */}
        <path d="M 32 38 Q 60 44 88 38" stroke={isGirl ? "#f43f5e" : "#0284c7"} strokeWidth="4" fill="none" />

        {/* Hair Back */}
        {isGirl ? (
          <g>
            {/* Cute Pigtails / Twintails */}
            <circle cx="24" cy="48" r="10" fill="#78350f" />
            <circle cx="96" cy="48" r="10" fill="#78350f" />
            <ellipse cx="20" cy="56" rx="6" ry="12" fill="#78350f" />
            <ellipse cx="100" cy="56" rx="6" ry="12" fill="#78350f" />
            {/* Hair Ties */}
            <circle cx="24" cy="46" r="3" fill="#f43f5e" />
            <circle cx="96" cy="46" r="3" fill="#f43f5e" />
          </g>
        ) : (
          <g>
            {/* Short spiky boy hair */}
            <path d="M 28 42 C 28 30 92 30 92 42 Z" fill="#3f2e18" />
          </g>
        )}

        {/* Head / Face */}
        <circle cx="60" cy="52" r="24" fill="#ffedd5" stroke="#fed7aa" strokeWidth="1.5" />

        {/* Hair Bangs */}
        <path
          d={
            isGirl
              ? "M 38 42 Q 50 48 60 40 Q 70 48 82 42 C 82 32 38 32 38 42 Z"
              : "M 36 40 Q 48 46 54 38 Q 66 46 84 40 C 84 32 36 32 36 40 Z"
          }
          fill={isGirl ? "#78350f" : "#3f2e18"}
        />

        {/* Straw Hat Crown (On top of head) */}
        <path d="M 40 38 C 40 18 80 18 80 38 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        {/* Hat Badge / Flower */}
        {isGirl ? (
          <g transform="translate(68, 26)">
            <circle cx="0" cy="0" r="4" fill="#ffedd5" />
            <circle cx="0" cy="0" r="2" fill="#f59e0b" />
          </g>
        ) : (
          <circle cx="70" cy="28" r="3" fill="#38bdf8" />
        )}

        {/* Kawaii Eyes */}
        {isJumping ? (
          // Joyful arched eyes ^^
          <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 48 54 Q 53 48 58 54" />
            <path d="M 62 54 Q 67 48 72 54" />
          </g>
        ) : (
          // Big anime sparkly eyes
          <g>
            <ellipse cx="52" cy="52" rx="4" ry="5.5" fill="#0f172a" />
            <ellipse cx="68" cy="52" rx="4" ry="5.5" fill="#0f172a" />
            {/* Sparkle highlights */}
            <circle cx="51" cy="50" r="1.8" fill="#ffffff" />
            <circle cx="53" cy="54" r="0.9" fill="#ffffff" />
            <circle cx="67" cy="50" r="1.8" fill="#ffffff" />
            <circle cx="69" cy="54" r="0.9" fill="#ffffff" />
          </g>
        )}

        {/* Blush cheeks */}
        <circle cx="44" cy="58" r="5" fill="url(#farmerBlush)" />
        <circle cx="76" cy="58" r="5" fill="url(#farmerBlush)" />

        {/* Cute Smile / Mouth */}
        {isJumping ? (
          <path d="M 55 58 Q 60 65 65 58 Z" fill="#e11d48" stroke="#be123c" strokeWidth="1" />
        ) : (
          <path d="M 56 60 Q 60 64 64 60" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Body & Overalls */}
        {/* White shirt */}
        <path d="M 46 72 L 74 72 L 78 94 L 42 94 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M 38 74 L 46 80" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 82 74 L 74 80" stroke="#cbd5e1" strokeWidth="2" />

        {/* Dungarees / Overalls */}
        <path
          d="M 44 86 L 76 86 L 78 120 L 62 120 L 60 106 L 58 120 L 42 120 Z"
          fill={isGirl ? "#fb7185" : "#0284c7"}
          stroke={isGirl ? "#e11d48" : "#0369a1"}
          strokeWidth="2"
        />
        {/* Straps & yellow buttons */}
        <rect x="46" y="74" width="6" height="16" fill={isGirl ? "#f43f5e" : "#0369a1"} rx="2" />
        <rect x="68" y="74" width="6" height="16" fill={isGirl ? "#f43f5e" : "#0369a1"} rx="2" />
        <circle cx="49" cy="88" r="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="71" cy="88" r="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        {/* Front pocket with carrot motif */}
        <rect x="52" y="92" width="16" height="12" rx="3" fill="#ffffff" opacity="0.9" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M 60 95 L 60 101" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M 59 95 L 61 95" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Boots */}
        <ellipse cx="48" cy="126" rx="8" ry="6" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
        <ellipse cx="72" cy="126" rx="8" ry="6" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />

        {/* Arms & Tools depending on action */}
        {isWatering ? (
          // Holding watering can
          <g>
            <path d="M 44 76 L 30 84" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 76 L 90 84" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            {/* Cute Watering Can */}
            <g transform="translate(86, 76)">
              <rect x="0" y="4" width="18" height="16" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <path d="M 4 4 Q 9 -4 14 4" fill="none" stroke="#0284c7" strokeWidth="2" />
              <path d="M 18 10 L 26 6" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="26" cy="6" rx="2" ry="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
              {/* Droplets */}
              <circle cx="30" cy="12" r="1.5" fill="#60a5fa" className="animate-ping" />
              <circle cx="32" cy="18" r="1.5" fill="#60a5fa" className="animate-ping" />
            </g>
          </g>
        ) : isJumping ? (
          // Joyful arms up with sparkles
          <g>
            <path d="M 44 76 L 24 58" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 76 L 96 58" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            <circle cx="23" cy="56" r="4.5" fill="#ffedd5" />
            <circle cx="97" cy="56" r="4.5" fill="#ffedd5" />
          </g>
        ) : (
          // Natural resting arms
          <g>
            <path d="M 44 76 L 34 94" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 76 L 86 94" stroke="#ffedd5" strokeWidth="5" strokeLinecap="round" />
            <circle cx="34" cy="95" r="4" fill="#ffedd5" />
            <circle cx="86" cy="95" r="4" fill="#ffedd5" />
          </g>
        )}
      </svg>
    </div>
  );
};

export const KawaiiPetSVG: React.FC<{
  type: "shiba" | "bunny";
  happy?: boolean;
  className?: string;
}> = ({ type, happy = false, className = "w-20 h-20" }) => {
  if (type === "bunny") {
    return (
      <div className={`select-none ${className} ${happy ? "animate-bounce" : ""}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Long bunny ears */}
          <ellipse cx="40" cy="24" rx="7" ry="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(-10 40 24)" />
          <ellipse cx="40" cy="24" rx="4" ry="14" fill="#fbcfe8" transform="rotate(-10 40 24)" />

          <ellipse cx="60" cy="24" rx="7" ry="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" transform="rotate(10 60 24)" />
          <ellipse cx="60" cy="24" rx="4" ry="14" fill="#fbcfe8" transform="rotate(10 60 24)" />

          {/* Bunny chubby body */}
          <circle cx="50" cy="68" r="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          {/* Head */}
          <circle cx="50" cy="48" r="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          {/* Eyes */}
          {happy ? (
            <g stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M 42 48 Q 46 44 50 48" />
              <path d="M 52 48 Q 56 44 60 48" />
            </g>
          ) : (
            <g>
              <circle cx="44" cy="47" r="2.5" fill="#334155" />
              <circle cx="56" cy="47" r="2.5" fill="#334155" />
              <circle cx="43" cy="46" r="1" fill="#ffffff" />
              <circle cx="55" cy="46" r="1" fill="#ffffff" />
            </g>
          )}
          {/* Pink Nose & W-mouth */}
          <polygon points="48,52 52,52 50,55" fill="#f43f5e" />
          <path d="M 46 56 Q 50 58 54 56" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <circle cx="38" cy="53" r="3.5" fill="#fbcfe8" opacity="0.8" />
          <circle cx="62" cy="53" r="3.5" fill="#fbcfe8" opacity="0.8" />
          {/* Paws */}
          <ellipse cx="42" cy="74" rx="5" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <ellipse cx="58" cy="74" rx="5" ry="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // Shiba Inu
  return (
    <div className={`select-none ${className} ${happy ? "animate-bounce" : ""}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Curled Shiba Tail */}
        <path d="M 24 64 Q 14 54 22 46 Q 30 42 28 56" stroke="#e07a5f" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 22 46 L 20 48" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />

        {/* Shiba Body */}
        <ellipse cx="48" cy="70" rx="24" ry="18" fill="#e07a5f" stroke="#b05638" strokeWidth="2" />
        {/* White chest */}
        <ellipse cx="56" cy="72" rx="14" ry="12" fill="#fffbf0" />

        {/* Shiba Head */}
        <circle cx="66" cy="48" r="18" fill="#e07a5f" stroke="#b05638" strokeWidth="2" />
        {/* White muzzle cheeks */}
        <ellipse cx="70" cy="52" rx="12" ry="10" fill="#fffbf0" />

        {/* Triangular ears */}
        <polygon points="56,36 64,22 70,36" fill="#b05638" />
        <polygon points="59,35 64,25 68,35" fill="#fffbf0" />

        <polygon points="68,36 76,24 82,38" fill="#b05638" />
        <polygon points="70,35 76,27 80,37" fill="#fffbf0" />

        {/* Eyebrow dots (Maro) */}
        <circle cx="60" cy="42" r="2" fill="#fffbf0" />
        <circle cx="72" cy="42" r="2" fill="#fffbf0" />

        {/* Eyes */}
        {happy ? (
          <g stroke="#264653" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 60 48 Q 64 43 68 48" />
            <path d="M 72 48 Q 76 43 80 48" />
          </g>
        ) : (
          <g>
            <circle cx="63" cy="47" r="2.5" fill="#264653" />
            <circle cx="75" cy="47" r="2.5" fill="#264653" />
            <circle cx="62" cy="46" r="0.8" fill="#ffffff" />
            <circle cx="74" cy="46" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* Cute Black Nose */}
        <ellipse cx="74" cy="53" rx="2.5" ry="2" fill="#1d3557" />
        <path d="M 74 55 Q 71 58 74 60 Q 77 58 74 55" stroke="#1d3557" strokeWidth="1.2" fill="none" />

        {/* Tongue out if happy */}
        {happy && (
          <path d="M 72 58 Q 74 64 76 58 Z" fill="#e63946" stroke="#d62828" strokeWidth="0.8" />
        )}

        {/* Red Bandana Scarf */}
        <path d="M 52 56 Q 64 64 78 56 L 68 66 Z" fill="#e63946" stroke="#b7094c" strokeWidth="1.5" />
        <circle cx="68" cy="64" r="2" fill="#fdf0d5" />

        {/* Paws */}
        <ellipse cx="44" cy="85" rx="5" ry="4" fill="#fffbf0" stroke="#b05638" strokeWidth="1.5" />
        <ellipse cx="60" cy="85" rx="5" ry="4" fill="#fffbf0" stroke="#b05638" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
