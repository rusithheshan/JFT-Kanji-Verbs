import React from "react";

export type SamuraiGender = "male" | "female";
export type SamuraiAction =
  | "idle"
  | "slash"
  | "combo"
  | "jump"
  | "jump_slash"
  | "guard"
  | "hurt"
  | "ultimate";

export type DragonColor = "red" | "green" | "gold";
export type DragonState = "fly" | "walk" | "breathe_fire" | "hurt" | "dead" | "sleep";

interface SamuraiWarriorProps {
  gender: SamuraiGender;
  action: SamuraiAction;
  facingRight: boolean;
  hasShield?: boolean;
  fireBlade?: boolean;
  className?: string;
  size?: number;
}

// -----------------------------------------------------------------------------
// 1. MALE SAMURAI WARRIOR (Boy Samurai inspired by print-339754542.jpg)
// -----------------------------------------------------------------------------
export function MaleSamuraiSVG({
  action,
  fireBlade = false,
  className = ""
}: {
  action: SamuraiAction;
  fireBlade?: boolean;
  className?: string;
}) {
  const isJumping = action === "jump" || action === "jump_slash";
  const isSlashing = action === "slash" || action === "combo" || action === "jump_slash";
  const isHurt = action === "hurt";

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 240 280"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <linearGradient id="maleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="maleRedArmor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="fireBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* ======================= BODY & ARMOR ======================= */}
        <g
          className="transition-transform duration-150 origin-bottom"
          transform={
            isHurt
              ? "rotate(-8 120 200) translate(-10, 0)"
              : isSlashing
              ? "rotate(4 120 200) translate(8, 0)"
              : ""
          }
        >
          {/* Black Undergarment Sleeves / Pants */}
          <g fill="#18181b">
            {/* Legs */}
            <rect x="94" y="200" width="18" height="40" rx="6" />
            <rect x="128" y="200" width="18" height="40" rx="6" />
            {/* Left/Right Inner Arm */}
            <path d="M 68 135 Q 55 160 62 180 L 80 175 Q 75 155 84 135 Z" />
            <path d="M 172 135 Q 185 160 178 180 L 160 175 Q 165 155 156 135 Z" />
          </g>

          {/* Red Armored Sandals (Waraji) */}
          <g fill="url(#maleRedArmor)" stroke="#000" strokeWidth="2.5">
            <ellipse cx="102" cy="242" rx="15" ry="7" />
            <ellipse cx="138" cy="242" rx="15" ry="7" />
            {/* Sandal straps */}
            <path d="M 94 238 L 102 245 L 110 238" fill="none" stroke="#000" strokeWidth="2" />
            <path d="M 130 238 L 138 245 L 146 238" fill="none" stroke="#000" strokeWidth="2" />
          </g>

          {/* Red Arm Guards (Kote) */}
          <g fill="url(#maleRedArmor)" stroke="#000" strokeWidth="2.5">
            <rect x="62" y="155" width="16" height="26" rx="4" />
            <rect x="162" y="155" width="16" height="26" rx="4" />
            {/* Gold rims on kote */}
            <rect x="62" y="177" width="16" height="4" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            <rect x="162" y="177" width="16" height="4" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* Cuirass (Do) - Red segmented breastplate with gold borders */}
          <g stroke="#000" strokeWidth="2.5">
            {/* Main torso base */}
            <path
              d="M 80 125 L 160 125 L 155 190 L 85 190 Z"
              fill="url(#maleRedArmor)"
            />
            {/* Horizontal armor ridges */}
            <line x1="82" y1="140" x2="158" y2="140" stroke="#7f1d1d" strokeWidth="3" />
            <line x1="83" y1="155" x2="157" y2="155" stroke="#7f1d1d" strokeWidth="3" />
            <line x1="84" y1="170" x2="156" y2="170" stroke="#7f1d1d" strokeWidth="3" />

            {/* Center golden square plate on chest */}
            <rect
              x="100"
              y="132"
              width="40"
              height="30"
              rx="4"
              fill="url(#maleGoldGrad)"
              stroke="#000"
              strokeWidth="2"
            />
            <rect
              x="105"
              y="137"
              width="30"
              height="20"
              rx="3"
              fill="url(#maleRedArmor)"
              stroke="#000"
              strokeWidth="2"
            />

            {/* Waist Obi Belt */}
            <rect x="82" y="185" width="76" height="12" rx="3" fill="#3f3f46" stroke="#000" strokeWidth="2" />
          </g>

          {/* Segmented Skirt Plates (Kusazuri) */}
          <g fill="url(#maleRedArmor)" stroke="#000" strokeWidth="2.5">
            {/* 3 hanging skirt flaps */}
            <path d="M 82 195 L 102 195 L 98 220 L 78 220 Z" />
            <path d="M 105 195 L 135 195 L 135 222 L 105 222 Z" />
            <path d="M 138 195 L 158 195 L 162 220 L 142 220 Z" />
            {/* Gold bottom border rims */}
            <rect x="78" y="217" width="20" height="4" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            <rect x="105" y="219" width="30" height="4" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            <rect x="142" y="217" width="20" height="4" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* Shoulder Guards (Sode) - Left & Right */}
          <g fill="url(#maleRedArmor)" stroke="#000" strokeWidth="2.5">
            {/* Left Sode */}
            <g transform="rotate(10 65 125)">
              <rect x="46" y="118" width="34" height="30" rx="5" />
              <rect x="46" y="118" width="34" height="6" fill="url(#maleGoldGrad)" />
              <rect x="46" y="142" width="34" height="6" fill="url(#maleGoldGrad)" />
            </g>
            {/* Right Sode */}
            <g transform="rotate(-10 175 125)">
              <rect x="160" y="118" width="34" height="30" rx="5" />
              <rect x="160" y="118" width="34" height="6" fill="url(#maleGoldGrad)" />
              <rect x="160" y="142" width="34" height="6" fill="url(#maleGoldGrad)" />
            </g>
          </g>

          {/* ======================= HEAD & FACE ======================= */}
          <g id="maleHeadGroup">
            {/* Neck */}
            <rect x="110" y="110" width="20" height="18" fill="#fed7aa" stroke="#000" strokeWidth="2" />

            {/* Face oval */}
            <ellipse cx="120" cy="98" rx="42" ry="36" fill="#fed7aa" stroke="#000" strokeWidth="2.5" />

            {/* Spiky Front Forehead Hair */}
            <g fill="#18181b">
              <polygon points="98,82 108,98 114,84" />
              <polygon points="112,82 120,103 128,82" />
              <polygon points="126,84 133,98 142,82" />
            </g>

            {/* Large Expressive Eyes (matching print-339754542.jpg) */}
            {/* Left Eye */}
            <g>
              <ellipse cx="102" cy="102" rx="11" ry="13" fill="#ffffff" stroke="#000" strokeWidth="2" />
              <circle cx="103" cy="102" r="7" fill="#18181b" />
              <circle cx="101" cy="99" r="2.5" fill="#ffffff" />
              <circle cx="105" cy="104" r="1.2" fill="#ffffff" />
              {/* Arched eyebrow */}
              <path d="M 92 88 Q 102 83 112 87" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Right Eye */}
            <g>
              <ellipse cx="138" cy="102" rx="11" ry="13" fill="#ffffff" stroke="#000" strokeWidth="2" />
              <circle cx="137" cy="102" r="7" fill="#18181b" />
              <circle cx="135" cy="99" r="2.5" fill="#ffffff" />
              <circle cx="139" cy="104" r="1.2" fill="#ffffff" />
              {/* Arched eyebrow */}
              <path d="M 128 87 Q 138 83 148 88" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Nose */}
            <path d="M 120 106 Q 123 112 118 113" fill="none" stroke="#ca8a04" strokeWidth="2.2" strokeLinecap="round" />

            {/* Confident Smile */}
            <path
              d="M 111 118 Q 120 126 129 118"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Cute Rosy Cheeks */}
            <circle cx="92" cy="114" r="5" fill="#f87171" opacity="0.4" />
            <circle cx="148" cy="114" r="5" fill="#f87171" opacity="0.4" />

            {/* Ear flaps on helmet (Fukikaeshi) */}
            <g fill="url(#maleRedArmor)" stroke="#000" strokeWidth="2.5">
              {/* Left wing flap */}
              <path d="M 80 75 Q 55 85 50 115 Q 65 110 78 95 Z" />
              <path d="M 50 115 L 53 105 Q 65 102 76 90" fill="none" stroke="url(#maleGoldGrad)" strokeWidth="3" />
              {/* Right wing flap */}
              <path d="M 160 75 Q 185 85 190 115 Q 175 110 162 95 Z" />
              <path d="M 190 115 L 187 105 Q 175 102 164 90" fill="none" stroke="url(#maleGoldGrad)" strokeWidth="3" />
            </g>

            {/* ======================= RED KABUTO (HELMET) ======================= */}
            <g stroke="#000" strokeWidth="2.5">
              {/* Helmet Dome */}
              <path
                d="M 76 80 C 76 35 164 35 164 80 Z"
                fill="url(#maleRedArmor)"
              />
              {/* Golden Headband / Forehead band */}
              <path
                d="M 72 82 Q 120 75 168 82 L 166 92 Q 120 85 74 92 Z"
                fill="url(#maleGoldGrad)"
              />

              {/* Golden Crescent Moon Crest (Maedate) */}
              <path
                d="M 120 54 Q 106 60 102 75 Q 120 66 138 75 Q 134 60 120 54 Z"
                fill="url(#maleGoldGrad)"
                stroke="#000"
                strokeWidth="2"
              />
              <path
                d="M 120 42 C 100 52 100 78 120 78 C 140 78 140 52 120 42 Z"
                fill="none"
                stroke="url(#maleGoldGrad)"
                strokeWidth="2"
              />

              {/* Samurai Topknot Bun (Chonmage) with Gold Ring */}
              <g>
                <circle cx="120" cy="32" r="14" fill="#18181b" stroke="#000" strokeWidth="2.5" />
                <rect
                  x="114"
                  y="40"
                  width="12"
                  height="6"
                  rx="2"
                  fill="url(#maleGoldGrad)"
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>
            </g>
          </g>

          {/* ======================= KATANA SWORD ======================= */}
          <g
            id="maleKatanaGroup"
            className="transition-transform duration-200"
            transform={
              isSlashing
                ? "translate(130, 160) rotate(-45) translate(-130, -160)"
                : isJumping
                ? "translate(130, 160) rotate(-70) translate(-130, -160)"
                : ""
            }
          >
            {/* Sword Blade */}
            <path
              d="M 135 178 Q 170 178 220 172 Q 224 174 220 178 Q 170 185 135 182 Z"
              fill={fireBlade ? "url(#fireBladeGrad)" : "url(#bladeSteel)"}
              stroke="#000"
              strokeWidth="2"
            />
            {/* Blade Shine / Fuller */}
            <line
              x1="140"
              y1="180"
              x2="210"
              y2="175"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Golden Tsuba (Crossguard) */}
            <ellipse
              cx="135"
              cy="180"
              rx="4"
              ry="10"
              fill="url(#maleGoldGrad)"
              stroke="#000"
              strokeWidth="2"
            />
            {/* Red & Black Braided Hilt (Tsuka) */}
            <rect
              x="95"
              y="176"
              width="38"
              height="8"
              rx="3"
              fill="#dc2626"
              stroke="#000"
              strokeWidth="2"
            />
            {/* Diamond wrap pattern */}
            <path
              d="M 100 176 L 105 184 L 110 176 L 115 184 L 120 176 L 125 184"
              fill="none"
              stroke="#000"
              strokeWidth="1.8"
            />
            {/* Gold pommel */}
            <rect x="91" y="175" width="5" height="10" rx="1.5" fill="url(#maleGoldGrad)" stroke="#000" strokeWidth="1.5" />

            {/* Fire Aura if Fire Blade is active */}
            {fireBlade && (
              <g opacity="0.8" className="animate-pulse">
                <path
                  d="M 140 170 Q 175 160 220 168 Q 180 190 140 185 Z"
                  fill="url(#fireBladeGrad)"
                  filter="blur(2px)"
                />
              </g>
            )}
          </g>

          {/* Right Hand Holding Katana */}
          <g stroke="#000" strokeWidth="2.5">
            <circle cx="130" cy="180" r="8" fill="#dc2626" />
            <circle cx="125" cy="180" r="7" fill="#dc2626" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. FEMALE SAMURAI WARRIOR (Girl Samurai inspired by cute-japanese-samurai-warrior-cartoon-free-vector.jpg)
// -----------------------------------------------------------------------------
export function FemaleSamuraiSVG({
  action,
  fireBlade = false,
  className = ""
}: {
  action: SamuraiAction;
  fireBlade?: boolean;
  className?: string;
}) {
  const isJumping = action === "jump" || action === "jump_slash";
  const isSlashing = action === "slash" || action === "combo" || action === "jump_slash";
  const isHurt = action === "hurt";

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 240 280"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <linearGradient id="femaleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="femaleRedArmor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          <linearGradient id="girlBladeSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="girlHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Long Sleek Back Hair flowing down */}
        <path
          d="M 72 110 C 60 140 60 180 82 205 C 75 160 85 125 90 110 Z"
          fill="url(#girlHairGrad)"
          stroke="#000"
          strokeWidth="2.5"
        />
        <path
          d="M 168 110 C 180 140 180 180 158 205 C 165 160 155 125 150 110 Z"
          fill="url(#girlHairGrad)"
          stroke="#000"
          strokeWidth="2.5"
        />

        {/* Main Body */}
        <g
          className="transition-transform duration-150 origin-bottom"
          transform={
            isHurt
              ? "rotate(-8 120 200) translate(-10, 0)"
              : isSlashing
              ? "rotate(4 120 200) translate(8, 0)"
              : ""
          }
        >
          {/* Black Leggings / Hakama */}
          <g fill="#18181b">
            <rect x="96" y="200" width="16" height="36" rx="5" />
            <rect x="128" y="200" width="16" height="36" rx="5" />
          </g>

          {/* Red Samurai War Boots with White Tops */}
          <g fill="url(#femaleRedArmor)" stroke="#000" strokeWidth="2.5">
            {/* Left Boot */}
            <path d="M 94 222 L 112 222 L 114 246 L 90 246 Z" />
            <rect x="92" y="220" width="22" height="5" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
            {/* Right Boot */}
            <path d="M 128 222 L 146 222 L 150 246 L 126 246 Z" />
            <rect x="126" y="220" width="22" height="5" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* Cuirass / Segmented Armor with Gold Ribs */}
          <g stroke="#000" strokeWidth="2.5">
            <path
              d="M 85 130 L 155 130 L 150 185 L 90 185 Z"
              fill="url(#femaleRedArmor)"
            />
            {/* Gold horizontal ribs (matching cute-japanese-samurai-warrior) */}
            <line x1="90" y1="142" x2="150" y2="142" stroke="url(#femaleGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="92" y1="154" x2="148" y2="154" stroke="url(#femaleGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="94" y1="166" x2="146" y2="166" stroke="url(#femaleGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Gray tied Obi knot at center */}
            <rect x="88" y="180" width="64" height="8" rx="2" fill="#94a3b8" />
            <circle cx="120" cy="184" r="5" fill="#64748b" />
            <path d="M 118 184 L 114 196 M 122 184 L 126 196" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Segmented Skirt Plates (Kusazuri) with Gold Rims */}
          <g fill="url(#femaleRedArmor)" stroke="#000" strokeWidth="2.5">
            <path d="M 86 188 L 108 188 L 104 214 L 82 214 Z" />
            <path d="M 110 188 L 130 188 L 130 216 L 110 216 Z" />
            <path d="M 132 188 L 154 188 L 158 214 L 136 214 Z" />
            {/* Gold bottom trim */}
            <rect x="82" y="211" width="22" height="4" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            <rect x="110" y="213" width="20" height="4" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            <rect x="136" y="211" width="22" height="4" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* Layered Sode Shoulder Plates */}
          <g fill="url(#femaleRedArmor)" stroke="#000" strokeWidth="2.5">
            {/* Left Sode */}
            <path d="M 68 128 L 86 128 L 82 148 L 64 148 Z" />
            <rect x="64" y="145" width="18" height="4" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.5" />
            {/* Right Sode */}
            <path d="M 154 128 L 172 128 L 176 148 L 158 148 Z" />
            <rect x="158" y="145" width="18" height="4" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* ======================= HEAD & CUTE FACE ======================= */}
          <g id="femaleHeadGroup">
            {/* Neck */}
            <rect x="111" y="112" width="18" height="18" fill="#fed7aa" stroke="#000" strokeWidth="2" />

            {/* Face Oval */}
            <ellipse cx="120" cy="102" rx="40" ry="34" fill="#fed7aa" stroke="#000" strokeWidth="2.5" />

            {/* Hair Framing with Straight Bangs */}
            <g fill="url(#girlHairGrad)">
              {/* Left hair lock */}
              <path d="M 80 88 C 76 110 74 135 88 155 C 80 135 82 110 84 88 Z" stroke="#000" strokeWidth="2" />
              {/* Right hair lock */}
              <path d="M 160 88 C 164 110 166 135 152 155 C 160 135 158 110 156 88 Z" stroke="#000" strokeWidth="2" />
              {/* Cute straight forehead bangs */}
              <path
                d="M 86 86 C 100 96 110 96 120 88 C 130 96 140 96 154 86 Z"
                stroke="#000"
                strokeWidth="2"
              />
            </g>

            {/* Sparkling Blue Eyes with Thick Eyelashes (Girl Samurai) */}
            {/* Left Eye */}
            <g>
              <ellipse cx="104" cy="104" rx="10" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
              <circle cx="104" cy="104" r="7" fill="#0284c7" />
              <circle cx="104" cy="104" r="4" fill="#0f172a" />
              <circle cx="102" cy="101" r="2.5" fill="#ffffff" />
              <circle cx="106" cy="106" r="1.2" fill="#ffffff" />
              {/* Eyelashes */}
              <path d="M 94 98 Q 104 90 114 96" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              <line x1="112" y1="95" x2="116" y2="92" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            {/* Right Eye */}
            <g>
              <ellipse cx="136" cy="104" rx="10" ry="12" fill="#ffffff" stroke="#000" strokeWidth="2" />
              <circle cx="136" cy="104" r="7" fill="#0284c7" />
              <circle cx="136" cy="104" r="4" fill="#0f172a" />
              <circle cx="134" cy="101" r="2.5" fill="#ffffff" />
              <circle cx="138" cy="106" r="1.2" fill="#ffffff" />
              {/* Eyelashes */}
              <path d="M 126 96 Q 136 90 146 98" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              <line x1="128" y1="95" x2="124" y2="92" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Cute Small Nose & Sweet Smile */}
            <circle cx="120" cy="110" r="1.8" fill="#ca8a04" />
            <path
              d="M 113 118 Q 120 125 127 118"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Rosy Blush */}
            <circle cx="94" cy="116" r="6" fill="#f43f5e" opacity="0.35" />
            <circle cx="146" cy="116" r="6" fill="#f43f5e" opacity="0.35" />

            {/* ======================= BROAD CONICAL KABUTO ======================= */}
            <g stroke="#000" strokeWidth="2.5">
              {/* Broad Conical Red Hat with Gold Trim */}
              <path
                d="M 28 92 C 55 75 90 40 120 34 C 150 40 185 75 212 92 C 160 82 80 82 28 92 Z"
                fill="url(#femaleRedArmor)"
              />
              {/* Gold rim border */}
              <path
                d="M 28 92 C 80 82 160 82 212 92"
                fill="none"
                stroke="url(#femaleGoldGrad)"
                strokeWidth="4"
              />

              {/* Large Dual Golden Kuwagata Horns */}
              <path
                d="M 70 54 C 80 18 105 18 120 48 C 135 18 160 18 170 54 C 150 36 135 34 120 54 C 105 34 90 36 70 54 Z"
                fill="url(#femaleGoldGrad)"
                stroke="#000"
                strokeWidth="2"
              />
              {/* Top Golden Knob Orb */}
              <circle cx="120" cy="24" r="8" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="2" />
            </g>
          </g>

          {/* ======================= DUAL KATANAS (TWO SWORDS) ======================= */}
          {/* Left Sword in Hand */}
          <g
            className="transition-transform duration-150"
            transform={
              isSlashing
                ? "translate(70, 175) rotate(-35) translate(-70, -175)"
                : "translate(70, 175) rotate(15) translate(-70, -175)"
            }
          >
            <path
              d="M 75 175 Q 50 190 20 230 Q 18 226 24 222 Q 52 185 75 172 Z"
              fill={fireBlade ? "url(#fireBladeGrad)" : "url(#girlBladeSteel)"}
              stroke="#000"
              strokeWidth="2"
            />
            {/* Gold Tsuba */}
            <ellipse cx="75" cy="174" rx="3.5" ry="8" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.8" />
            {/* Hilt */}
            <rect x="74" y="162" width="8" height="20" rx="3" fill="#e11d48" stroke="#000" strokeWidth="2" transform="rotate(-30 75 170)" />
          </g>

          {/* Right Sword in Hand */}
          <g
            className="transition-transform duration-150"
            transform={
              isSlashing
                ? "translate(165, 175) rotate(35) translate(-165, -175)"
                : "translate(165, 175) rotate(-15) translate(-165, -175)"
            }
          >
            <path
              d="M 165 175 Q 190 190 220 230 Q 222 226 216 222 Q 188 185 165 172 Z"
              fill={fireBlade ? "url(#fireBladeGrad)" : "url(#girlBladeSteel)"}
              stroke="#000"
              strokeWidth="2"
            />
            {/* Gold Tsuba */}
            <ellipse cx="165" cy="174" rx="3.5" ry="8" fill="url(#femaleGoldGrad)" stroke="#000" strokeWidth="1.8" />
            {/* Hilt */}
            <rect x="158" y="162" width="8" height="20" rx="3" fill="#e11d48" stroke="#000" strokeWidth="2" transform="rotate(30 165 170)" />
          </g>

          {/* Hands Holding Swords */}
          <circle cx="75" cy="172" r="7" fill="#e11d48" stroke="#000" strokeWidth="2" />
          <circle cx="165" cy="172" r="7" fill="#e11d48" stroke="#000" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. DRAGON ENEMY SVG (Faithfully matches cartoon-red-dragon-exhaling-fire...)
// Available in 3 color variants: "red", "green", "gold"
// -----------------------------------------------------------------------------
interface DragonSVGProps {
  color: DragonColor;
  state?: DragonState;
  facingRight?: boolean;
  fireBreathActive?: boolean;
  className?: string;
  size?: number;
}

export function DragonSVG({
  color = "red",
  state = "walk",
  facingRight = true,
  fireBreathActive = false,
  className = ""
}: DragonSVGProps) {
  // Theme Color Configurations based on user request:
  // "Dragonwa me widiyatama rathu kola saha gold patin design karanna thun widiyakata kalawame ena widiyata."
  const theme = {
    red: {
      bodyBase: "#dc2626",
      bodyGradStart: "#ef4444",
      bodyGradEnd: "#991b1b",
      bellyBase: "#fef08a",
      bellyEnd: "#fde047",
      wingMembrane: "#27272a",
      horn: "#f8fafc",
      spikes: "#18181b",
      firePrimary: "#f97316",
      fireSecondary: "#fde047"
    },
    green: {
      bodyBase: "#059669",
      bodyGradStart: "#10b981",
      bodyGradEnd: "#064e3b",
      bellyBase: "#d9f99d",
      bellyEnd: "#bef264",
      wingMembrane: "#1c1917",
      horn: "#fef08a",
      spikes: "#0f172a",
      firePrimary: "#84cc16",
      fireSecondary: "#fef08a"
    },
    gold: {
      bodyBase: "#d97706",
      bodyGradStart: "#f59e0b",
      bodyGradEnd: "#78350f",
      bellyBase: "#fef9c3",
      bellyEnd: "#fde68a",
      wingMembrane: "#3b2314",
      horn: "#ffffff",
      spikes: "#451a03",
      firePrimary: "#eab308",
      fireSecondary: "#ffffff"
    }
  }[color];

  const isFlying = state === "fly";
  const isBreathingFire = state === "breathe_fire" || fireBreathActive;
  const isHurt = state === "hurt";
  const isDead = state === "dead";
  const isSleeping = state === "sleep";

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        transform: `scaleX(${facingRight ? 1 : -1})`
      }}
    >
      {/* Floating Zzz for sleeping dragons */}
      {isSleeping && (
        <div className="absolute -top-3 right-8 font-black text-amber-300 text-xs tracking-wider animate-bounce select-none pointer-events-none drop-shadow-md">
          Zzz... 💤
        </div>
      )}
      <svg
        viewBox="0 0 280 220"
        className={`w-full h-full drop-shadow-xl overflow-visible transition-all duration-300 ${
          isDead
            ? "opacity-0 scale-50"
            : isHurt
            ? "brightness-150 contrast-125"
            : isSleeping
            ? "opacity-85 filter saturate-90"
            : ""
        }`}
      >
        <defs>
          <linearGradient id={`dragonBody_${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.bodyGradStart} />
            <stop offset="70%" stopColor={theme.bodyBase} />
            <stop offset="100%" stopColor={theme.bodyGradEnd} />
          </linearGradient>
          <linearGradient id={`dragonBelly_${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.bellyBase} />
            <stop offset="100%" stopColor={theme.bellyEnd} />
          </linearGradient>
          <linearGradient id={`dragonFire_${color}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor={theme.fireSecondary} />
            <stop offset="65%" stopColor={theme.firePrimary} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Group with animation transform */}
        <g
          className={`${isFlying ? "animate-pulse" : ""}`}
          transform={isFlying ? "translate(0, -6)" : ""}
        >
          {/* ===================== WINGS (Black Bat Wings with Ribs) ===================== */}
          <g id="dragonWings" stroke="#000" strokeWidth="2.5">
            {/* Back Wing */}
            <path
              d="M 125 78 C 115 28 85 24 72 38 C 76 60 88 88 108 96 C 88 92 78 78 72 38 C 96 32 118 42 125 78 Z"
              fill={theme.wingMembrane}
            />
            {/* Scalloped wing edge */}
            <path
              d="M 72 38 Q 80 62 86 78 Q 98 75 108 96"
              fill={theme.wingMembrane}
            />

            {/* Front Main Bat Wing (Faithfully matches the reference image) */}
            <path
              d="M 132 82 C 120 22 82 18 68 36 C 72 65 90 95 120 105 Z"
              fill={theme.wingMembrane}
            />
            {/* Wing bone struts */}
            <line x1="130" y1="82" x2="68" y2="36" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68 36 Q 78 65 88 85 Q 102 85 118 105" fill="none" stroke="#000" strokeWidth="2" />
            {/* Top claw on wing */}
            <polygon points="68,36 64,30 72,34" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          </g>

          {/* ===================== TAIL WITH TRIANGULAR ARROW TIP ===================== */}
          <g id="dragonTail" stroke="#000" strokeWidth="2.5">
            {/* Long S-curve tail */}
            <path
              d="M 105 145 C 75 145 35 130 18 152 C 5 170 14 195 40 185 C 55 178 75 165 95 160 Z"
              fill={`url(#dragonBody_${color})`}
            />
            {/* Arrowhead Spade Tip (matching reference image) */}
            <polygon
              points="14,152 4,175 28,172"
              fill={`url(#dragonBody_${color})`}
              stroke="#000"
              strokeWidth="2.5"
            />

            {/* Triangular Black Ridge Spikes along tail & back */}
            <g fill={theme.spikes} stroke="#000" strokeWidth="1.5">
              <polygon points="18,152 14,142 25,148" />
              <polygon points="32,142 30,132 40,140" />
              <polygon points="48,136 48,124 58,134" />
              <polygon points="68,128 70,116 80,126" />
              <polygon points="88,118 92,104 100,116" />
              <polygon points="106,108 112,94 120,106" />
              <polygon points="126,96 134,82 140,94" />
              <polygon points="146,84 154,70 160,82" />
            </g>
          </g>

          {/* ===================== MAIN BODY & BELLY ===================== */}
          <g id="dragonTorso" stroke="#000" strokeWidth="2.5">
            {/* Back curved torso */}
            <path
              d="M 110 102 C 145 102 165 110 168 135 C 170 165 135 175 105 160 C 95 140 98 115 110 102 Z"
              fill={`url(#dragonBody_${color})`}
            />

            {/* Segmented Underbelly with Horizontal Ribs (Yellow/Gold plates) */}
            <path
              d="M 148 102 C 160 115 164 140 156 168 C 142 166 134 150 138 120 C 140 110 144 105 148 102 Z"
              fill={`url(#dragonBelly_${color})`}
            />
            {/* Horizontal belly rib lines */}
            <line x1="146" y1="112" x2="157" y2="114" stroke="#ca8a04" strokeWidth="2" />
            <line x1="142" y1="125" x2="161" y2="128" stroke="#ca8a04" strokeWidth="2" />
            <line x1="138" y1="138" x2="162" y2="142" stroke="#ca8a04" strokeWidth="2" />
            <line x1="136" y1="152" x2="158" y2="156" stroke="#ca8a04" strokeWidth="2" />

            {/* Scale Swirls on Hip (as seen in reference) */}
            <path d="M 85 155 Q 92 148 100 152" fill="none" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
            <path d="M 94 165 Q 102 158 108 162" fill="none" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* ===================== HIND LEGS & FEET ===================== */}
          <g id="dragonLegs" stroke="#000" strokeWidth="2.5">
            {/* Muscular crouching hind leg */}
            <path
              d="M 120 150 C 135 150 148 165 142 188 L 132 196 L 118 196 C 112 182 110 162 120 150 Z"
              fill={`url(#dragonBody_${color})`}
            />
            {/* Foot with 3 sharp white claws */}
            <ellipse cx="132" cy="196" rx="14" ry="5" fill={`url(#dragonBody_${color})`} />
            <polygon points="122,198 116,204 126,202" fill="#ffffff" />
            <polygon points="132,198 132,206 138,202" fill="#ffffff" />
            <polygon points="142,198 148,204 144,200" fill="#ffffff" />

            {/* Front Claw Arms (reaching forward aggressively) */}
            <path
              d="M 152 120 Q 172 118 184 128 L 178 134 Q 165 128 148 128 Z"
              fill={`url(#dragonBody_${color})`}
            />
            {/* Front 3 hand claws */}
            <polygon points="182,126 192,125 186,131" fill="#ffffff" />
            <polygon points="182,130 190,134 182,136" fill="#ffffff" />
            <polygon points="178,134 184,140 176,138" fill="#ffffff" />
          </g>

          {/* ===================== HEAD & EXPRESSIVE FACE ===================== */}
          <g id="dragonHead" stroke="#000" strokeWidth="2.5">
            {/* Dragon Head Contour */}
            <path
              d="M 156 80 C 160 55 185 58 198 62 C 208 65 214 74 212 84 C 205 92 188 95 182 95 L 180 102 C 170 100 160 92 156 80 Z"
              fill={`url(#dragonBody_${color})`}
            />

            {/* White Curved Horns pointing back */}
            <path
              d="M 166 62 C 160 38 142 32 135 34 C 145 44 155 52 162 65 Z"
              fill={theme.horn}
            />
            <path
              d="M 174 65 C 170 45 155 40 148 42 C 156 50 165 56 170 68 Z"
              fill={theme.horn}
            />

            {/* Nostril & Snout */}
            <circle cx="206" cy="74" r="2.5" fill="#000000" />

            {/* Fierce / Cartoon Eye (or Closed Sleepy Eye when sleeping) */}
            {isSleeping ? (
              <path
                d="M 176 72 Q 183 78 190 72"
                fill="none"
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : (
              <>
                <ellipse cx="182" cy="70" rx="6" ry="8" fill="#ffffff" stroke="#000" strokeWidth="2" />
                <circle cx="183" cy="70" r="4" fill="#000000" />
                <circle cx="181" cy="68" r="1.5" fill="#ffffff" />
                {/* Angry Eyebrow ridge */}
                <path d="M 174 64 Q 184 62 192 68" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {/* Open Mouth with Sharp Teeth */}
            <path
              d="M 188 88 L 210 82 L 195 98 Z"
              fill="#7f1d1d"
            />
            {/* Sharp White Teeth */}
            <polygon points="194,84 198,90 202,83" fill="#ffffff" />
            <polygon points="204,82 208,88 210,82" fill="#ffffff" />
            <polygon points="196,96 200,90 204,94" fill="#ffffff" />
          </g>

          {/* ===================== FIRE EXHALATION BLAST ===================== */}
          {/* Sizzling cone of fire when breathing fire! */}
          {isBreathingFire && (
            <g id="dragonFireBreath" className="animate-pulse">
              {/* Flame Outer Glow */}
              <path
                d="M 208 82 Q 235 68 275 62 Q 260 85 280 95 Q 245 92 205 92 Z"
                fill={`url(#dragonFire_${color})`}
                filter="drop-shadow(0 0 10px #f97316)"
              />
              {/* Core Hot White/Yellow Flame Tongues */}
              <path
                d="M 208 84 Q 228 75 255 72 Q 242 85 260 88 Q 235 88 206 90 Z"
                fill="#ffffff"
                opacity="0.85"
              />
              {/* Flying Fire Sparks */}
              <circle cx="265" cy="65" r="2.5" fill="#fef08a" />
              <circle cx="272" cy="78" r="3" fill="#f97316" />
              <circle cx="260" cy="98" r="2" fill="#ef4444" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 4. COMBAT WRAPPER: UNIFIED SAMURAI WARRIOR COMPONENT
// -----------------------------------------------------------------------------
export function SamuraiWarrior({
  gender,
  action,
  facingRight,
  hasShield = false,
  fireBlade = false,
  className = ""
}: SamuraiWarriorProps) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        transform: `scaleX(${facingRight ? 1 : -1})`
      }}
    >
      {/* Divine Shield Aura Effect */}
      {hasShield && (
        <div className="absolute inset-0 -m-4 rounded-full border-4 border-cyan-400/80 bg-cyan-400/15 shadow-[0_0_25px_rgba(34,211,238,0.7)] animate-pulse pointer-events-none z-30" />
      )}

      {/* Render selected Gender */}
      {gender === "male" ? (
        <MaleSamuraiSVG action={action} fireBlade={fireBlade} />
      ) : (
        <FemaleSamuraiSVG action={action} fireBlade={fireBlade} />
      )}
    </div>
  );
}
