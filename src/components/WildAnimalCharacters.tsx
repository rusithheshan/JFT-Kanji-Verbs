import React from "react";
import { DragonColor, DragonState, DragonSVG } from "./SamuraiGameCharacters";

export type AnimalSpecies =
  | "bear"
  | "lion"
  | "elephant"
  | "crocodile"
  | "monkey"
  | "dog"
  | "owl"
  | "parrot"
  | "pelican"
  | "butterfly"
  | "rabbit"
  | "rooster"
  | "dragon_red"
  | "dragon_green"
  | "dragon_gold";

export interface BattlefieldCreature {
  id: string;
  species: AnimalSpecies;
  movementType: "walking" | "flying";
  nameSi: string;
  nameJp?: string;
  avatarIcon?: string;
  color?: string;
  slot?: number;
  // Position on the ground when sleeping
  baseLeft?: number; // percentage from left
  baseRight?: number; // percentage from right
  baseBottom: number; // percentage from bottom (ALL SLEEP ON GROUND!)
  scale: number;
  state: DragonState; // "sleep" | "walk" | "fly" | "breathe_fire" | "hurt" | "dead"
  fireBreathActive?: boolean;
  progress: number; // 0.0 to 1.0
  totalTravelSeconds: number; // 10.0 to 15.0s
  isActiveAttacker: boolean;
}

// -----------------------------------------------------------------------------
// 1. BROWN BEAR SVG (Inspired by top-left bear in qg3x_fml4_190305.jpg)
// -----------------------------------------------------------------------------
export function BearSVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Back Legs */}
      <ellipse cx="60" cy="125" rx="16" ry="24" fill="#6d3c1a" />
      <ellipse cx="140" cy="125" rx="16" ry="24" fill="#6d3c1a" />

      {/* Main Body */}
      <ellipse cx="100" cy="95" rx="55" ry="42" fill="#8d4925" />
      {/* Chest highlights */}
      <ellipse cx="100" cy="98" rx="35" ry="26" fill="#a45a2e" opacity="0.6" />

      {/* Front Legs */}
      <ellipse cx="78" cy="130" rx="14" ry="22" fill="#8d4925" />
      <ellipse cx="122" cy="130" rx="14" ry="22" fill="#8d4925" />
      {/* Claws */}
      <circle cx="74" cy="148" r="3" fill="#3b1d09" />
      <circle cx="82" cy="148" r="3" fill="#3b1d09" />
      <circle cx="118" cy="148" r="3" fill="#3b1d09" />
      <circle cx="126" cy="148" r="3" fill="#3b1d09" />

      {/* Bear Head */}
      <ellipse cx="138" cy="65" rx="32" ry="28" fill="#8d4925" />
      {/* Ears */}
      <circle cx="124" cy="42" r="11" fill="#8d4925" />
      <circle cx="124" cy="42" r="6" fill="#d97706" />
      <circle cx="152" cy="44" r="11" fill="#8d4925" />
      <circle cx="152" cy="44" r="6" fill="#d97706" />

      {/* Muzzle */}
      <ellipse cx="152" cy="74" rx="18" ry="14" fill="#fcd34d" />
      {/* Nose */}
      <ellipse cx="158" cy="68" rx="6" ry="4.5" fill="#1f130b" />

      {/* Eyes */}
      {isSleeping ? (
        <path d="M 132 62 Q 138 66 144 62" stroke="#1f130b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#1f130b" strokeWidth="2.5">
          <line x1="134" y1="58" x2="142" y2="66" />
          <line x1="142" y1="58" x2="134" y2="66" />
        </g>
      ) : (
        <g>
          <circle cx="138" cy="60" r="4.5" fill="#1f130b" />
          <circle cx="137" cy="58" r="1.5" fill="#ffffff" />
        </g>
      )}

      {/* Mouth */}
      <path d="M 152 76 Q 158 82 164 76" stroke="#1f130b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 2. LION SVG (Golden Lion from photo)
// -----------------------------------------------------------------------------
export function LionSVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Fluffy Orange Mane Backing */}
      <circle cx="135" cy="68" r="42" fill="#c2410c" />
      <circle cx="115" cy="48" r="22" fill="#ea580c" />
      <circle cx="155" cy="48" r="22" fill="#ea580c" />
      <circle cx="105" cy="80" r="24" fill="#ea580c" />
      <circle cx="160" cy="82" r="24" fill="#ea580c" />

      {/* Body */}
      <ellipse cx="80" cy="102" rx="46" ry="32" fill="#f59e0b" />
      {/* Tail */}
      <path d="M 36 95 Q 15 80 18 55" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <circle cx="18" cy="52" r="9" fill="#c2410c" />

      {/* Legs */}
      <ellipse cx="58" cy="130" rx="12" ry="20" fill="#d97706" />
      <ellipse cx="98" cy="130" rx="12" ry="20" fill="#d97706" />
      <ellipse cx="128" cy="130" rx="12" ry="20" fill="#f59e0b" />

      {/* Lion Face */}
      <ellipse cx="135" cy="68" rx="26" ry="24" fill="#fbbf24" />
      {/* Ears */}
      <circle cx="118" cy="46" r="8" fill="#c2410c" />
      <circle cx="152" cy="46" r="8" fill="#c2410c" />

      {/* Muzzle */}
      <ellipse cx="135" cy="78" rx="15" ry="11" fill="#fef3c7" />
      <polygon points="135,76 130,70 140,70" fill="#78350f" />

      {/* Eyes */}
      {isSleeping ? (
        <g stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 122 64 Q 127 68 132 64" />
          <path d="M 138 64 Q 143 68 148 64" />
        </g>
      ) : isDead ? (
        <g stroke="#78350f" strokeWidth="2.5">
          <line x1="123" y1="60" x2="129" y2="66" />
          <line x1="129" y1="60" x2="123" y2="66" />
          <line x1="141" y1="60" x2="147" y2="66" />
          <line x1="147" y1="60" x2="141" y2="66" />
        </g>
      ) : (
        <g>
          <circle cx="126" cy="62" r="4" fill="#78350f" />
          <circle cx="125" cy="60" r="1.3" fill="#ffffff" />
          <circle cx="144" cy="62" r="4" fill="#78350f" />
          <circle cx="143" cy="60" r="1.3" fill="#ffffff" />
        </g>
      )}

      {/* Smile */}
      <path d="M 130 82 Q 135 86 140 82" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 3. ELEPHANT SVG (Cute Grey/Lilac Elephant from photo)
// -----------------------------------------------------------------------------
export function ElephantSVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Body */}
      <ellipse cx="85" cy="98" rx="50" ry="38" fill="#94a3b8" />
      {/* Sturdy Legs */}
      <rect x="52" y="112" width="18" height="34" rx="8" fill="#64748b" />
      <rect x="76" y="112" width="18" height="34" rx="8" fill="#94a3b8" />
      <rect x="104" y="112" width="18" height="34" rx="8" fill="#64748b" />
      <rect x="126" y="112" width="18" height="34" rx="8" fill="#94a3b8" />

      {/* Head */}
      <circle cx="136" cy="74" r="32" fill="#94a3b8" />
      {/* Big Flappy Ear */}
      <ellipse cx="112" cy="70" rx="22" ry="28" fill="#cbd5e1" />
      <ellipse cx="112" cy="70" rx="15" ry="20" fill="#f472b6" opacity="0.6" />

      {/* Curved Trunk */}
      <path
        d="M 154 82 C 168 88 182 105 174 120 C 168 128 158 122 162 114 C 166 106 156 94 148 88 Z"
        fill="#94a3b8"
      />
      {/* Little Tusk */}
      <polygon points="144,94 154,92 146,102" fill="#f8fafc" />

      {/* Eye */}
      {isSleeping ? (
        <path d="M 132 68 Q 138 73 144 68" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#1e293b" strokeWidth="2.5">
          <line x1="134" y1="64" x2="142" y2="72" />
          <line x1="142" y1="64" x2="134" y2="72" />
        </g>
      ) : (
        <g>
          <circle cx="138" cy="66" r="4.5" fill="#1e293b" />
          <circle cx="137" cy="64" r="1.5" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 4. CROCODILE SVG (Green Reptile from photo)
// -----------------------------------------------------------------------------
export function CrocodileSVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 210 140" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Serrated Back Spikes */}
      <path
        d="M 30 78 L 40 65 L 50 78 L 60 65 L 70 78 L 80 65 L 90 78 L 100 65 L 110 78 L 120 65 L 130 78"
        fill="#14532d"
      />

      {/* Body & Tail */}
      <path
        d="M 15 95 Q 40 75 100 75 Q 160 75 195 82 C 205 85 205 98 185 100 L 130 102 C 100 104 30 110 15 95 Z"
        fill="#16a34a"
      />
      {/* Light Green Belly */}
      <path d="M 60 98 Q 110 102 150 98 Q 110 92 60 98 Z" fill="#86efac" />

      {/* Legs */}
      <rect x="55" y="98" width="14" height="22" rx="6" fill="#15803d" />
      <rect x="115" y="98" width="14" height="22" rx="6" fill="#15803d" />

      {/* Long Snout Jaw & Teeth */}
      <polygon points="155,88 160,82 165,88" fill="#f8fafc" />
      <polygon points="170,88 175,82 180,88" fill="#f8fafc" />
      <polygon points="185,88 190,82 195,88" fill="#f8fafc" />

      {/* Eye Mound */}
      <ellipse cx="142" cy="70" rx="10" ry="12" fill="#16a34a" />
      {isSleeping ? (
        <path d="M 137 72 Q 142 76 147 72" stroke="#052e16" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#052e16" strokeWidth="2.5">
          <line x1="138" y1="68" x2="146" y2="76" />
          <line x1="146" y1="68" x2="138" y2="76" />
        </g>
      ) : (
        <g>
          <circle cx="142" cy="70" r="4.5" fill="#fef08a" />
          <ellipse cx="142" cy="70" rx="1.5" ry="3.5" fill="#052e16" />
        </g>
      )}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 5. MONKEY SVG (Playful Brown Monkey from photo)
// -----------------------------------------------------------------------------
export function MonkeySVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 180 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Curled Tail */}
      <path
        d="M 40 100 C 15 100 10 50 28 42 C 40 36 45 55 34 60 C 25 65 24 85 45 92 Z"
        fill="#78350f"
      />
      {/* Body */}
      <ellipse cx="80" cy="105" rx="34" ry="28" fill="#92400e" />
      <ellipse cx="80" cy="108" rx="20" ry="18" fill="#fed7aa" />

      {/* Limbs */}
      <rect x="58" y="125" width="12" height="24" rx="6" fill="#78350f" />
      <rect x="92" y="125" width="12" height="24" rx="6" fill="#78350f" />

      {/* Head */}
      <circle cx="115" cy="72" r="26" fill="#92400e" />
      {/* Big Round Ears */}
      <circle cx="92" cy="68" r="10" fill="#92400e" />
      <circle cx="92" cy="68" r="6" fill="#fed7aa" />
      <circle cx="138" cy="68" r="10" fill="#92400e" />
      <circle cx="138" cy="68" r="6" fill="#fed7aa" />

      {/* Peach Face Heart */}
      <ellipse cx="115" cy="76" rx="18" ry="16" fill="#fed7aa" />
      <circle cx="115" cy="74" r="2.5" fill="#78350f" />

      {/* Eyes */}
      {isSleeping ? (
        <path d="M 108 68 Q 115 72 122 68" stroke="#451a03" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#451a03" strokeWidth="2.5">
          <line x1="108" y1="65" x2="114" y2="71" />
          <line x1="114" y1="65" x2="108" y2="71" />
          <line x1="118" y1="65" x2="124" y2="71" />
          <line x1="124" y1="65" x2="118" y2="71" />
        </g>
      ) : (
        <g>
          <circle cx="110" cy="68" r="3.5" fill="#451a03" />
          <circle cx="122" cy="68" r="3.5" fill="#451a03" />
        </g>
      )}
      <path d="M 110 82 Q 115 87 120 82" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 6. SHIBA / DOG SVG (Golden-White Dog from photo)
// -----------------------------------------------------------------------------
export function DogSVG({ state = "walk" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";

  return (
    <svg viewBox="0 0 180 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Curled Tail */}
      <path d="M 35 85 Q 20 60 30 50 Q 42 45 42 62 Z" fill="#d97706" />
      {/* Body */}
      <ellipse cx="80" cy="100" rx="38" ry="26" fill="#f59e0b" />
      <ellipse cx="86" cy="102" rx="24" ry="18" fill="#fef3c7" />

      {/* Legs */}
      <rect x="56" y="118" width="10" height="24" rx="5" fill="#d97706" />
      <rect x="74" y="118" width="10" height="24" rx="5" fill="#f59e0b" />
      <rect x="94" y="118" width="10" height="24" rx="5" fill="#f59e0b" />

      {/* Head */}
      <ellipse cx="122" cy="68" rx="24" ry="22" fill="#f59e0b" />
      {/* White Cheeks */}
      <ellipse cx="126" cy="74" rx="15" ry="12" fill="#fef3c7" />

      {/* Pointy Ears */}
      <polygon points="106,55 114,32 122,52" fill="#b45309" />
      <polygon points="126,52 135,34 142,55" fill="#b45309" />

      {/* Nose */}
      <circle cx="134" cy="72" r="3.5" fill="#18181b" />

      {/* Tongue out! */}
      <path d="M 130 80 Q 134 90 138 80 Z" fill="#f43f5e" />

      {/* Eyes */}
      {isSleeping ? (
        <path d="M 116 66 Q 122 70 128 66" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#18181b" strokeWidth="2.5">
          <line x1="118" y1="62" x2="124" y2="68" />
          <line x1="124" y1="62" x2="118" y2="68" />
        </g>
      ) : (
        <g>
          <circle cx="122" cy="65" r="3.5" fill="#18181b" />
          <circle cx="121" cy="63" r="1.2" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 7. OWL SVG - FLYING CREATURE (Nocturnal Owl from photo)
// -----------------------------------------------------------------------------
export function OwlSVG({ state = "fly" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";
  const isFlying = state === "fly";

  return (
    <svg viewBox="0 0 180 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Spread Wings if flying, tucked wings if sleeping */}
      {isFlying ? (
        <g fill="#475569">
          <path d="M 45 75 Q 15 50 10 25 Q 35 45 55 65 Z" />
          <path d="M 135 75 Q 165 50 170 25 Q 145 45 125 65 Z" />
        </g>
      ) : (
        <g fill="#475569">
          <ellipse cx="62" cy="95" rx="10" ry="24" transform="rotate(15 62 95)" />
          <ellipse cx="118" cy="95" rx="10" ry="24" transform="rotate(-15 118 95)" />
        </g>
      )}

      {/* Body */}
      <ellipse cx="90" cy="92" rx="34" ry="40" fill="#64748b" />
      {/* Patterned Chest */}
      <ellipse cx="90" cy="98" rx="22" ry="28" fill="#e2e8f0" />
      <path d="M 82 85 Q 90 92 98 85 M 80 100 Q 90 107 100 100 M 84 112 Q 90 118 96 112" stroke="#94a3b8" strokeWidth="2" fill="none" />

      {/* Head Tuft Ears */}
      <polygon points="68,52 62,32 80,46" fill="#475569" />
      <polygon points="112,52 118,32 100,46" fill="#475569" />

      {/* Head */}
      <ellipse cx="90" cy="58" rx="28" ry="22" fill="#64748b" />

      {/* Big Luminous Eyes */}
      {isSleeping ? (
        <g stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 74 58 Q 80 64 86 58" />
          <path d="M 94 58 Q 100 64 106 58" />
        </g>
      ) : isDead ? (
        <g stroke="#0f172a" strokeWidth="2.5">
          <line x1="75" y1="54" x2="83" y2="62" />
          <line x1="83" y1="54" x2="75" y2="62" />
          <line x1="97" y1="54" x2="105" y2="62" />
          <line x1="105" y1="54" x2="97" y2="62" />
        </g>
      ) : (
        <g>
          <circle cx="80" cy="58" r="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <circle cx="80" cy="58" r="5" fill="#0f172a" />
          <circle cx="78" cy="56" r="2" fill="#ffffff" />

          <circle cx="100" cy="58" r="10" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <circle cx="100" cy="58" r="5" fill="#0f172a" />
          <circle cx="98" cy="56" r="2" fill="#ffffff" />
        </g>
      )}

      {/* Beak */}
      <polygon points="90,62 86,72 94,72" fill="#f97316" />

      {/* Feet / Talons */}
      <circle cx="80" cy="134" r="4" fill="#f97316" />
      <circle cx="86" cy="134" r="4" fill="#f97316" />
      <circle cx="94" cy="134" r="4" fill="#f97316" />
      <circle cx="100" cy="134" r="4" fill="#f97316" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 8. PARROT / MACAW SVG - FLYING CREATURE (Colorful Parrot from photo)
// -----------------------------------------------------------------------------
export function ParrotSVG({ state = "fly" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";
  const isFlying = state === "fly";

  return (
    <svg viewBox="0 0 180 160" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Long Colorful Tail Feathers */}
      <path d="M 50 110 Q 30 145 20 160 Q 40 140 55 118 Z" fill="#0284c7" />
      <path d="M 54 110 Q 38 140 32 155 Q 46 135 58 116 Z" fill="#e11d48" />

      {/* Wings */}
      {isFlying ? (
        <g>
          <path d="M 70 70 Q 30 35 15 15 Q 50 40 85 65 Z" fill="#0284c7" />
          <path d="M 75 75 Q 40 50 30 35 Q 55 55 85 70 Z" fill="#eab308" />
        </g>
      ) : (
        <ellipse cx="65" cy="85" rx="14" ry="28" fill="#0284c7" transform="rotate(20 65 85)" />
      )}

      {/* Body */}
      <ellipse cx="90" cy="82" rx="26" ry="32" fill="#e11d48" />
      <ellipse cx="98" cy="85" rx="14" ry="20" fill="#eab308" />

      {/* Head */}
      <circle cx="115" cy="56" r="20" fill="#e11d48" />
      {/* White Eye Patch */}
      <ellipse cx="114" cy="54" rx="10" ry="8" fill="#f8fafc" />

      {/* Hooked Beak */}
      <path d="M 124 50 C 142 50 144 68 135 74 C 132 74 130 65 125 62 Z" fill="#334155" />
      <path d="M 125 64 Q 130 65 132 72 Z" fill="#1e293b" />

      {/* Eye */}
      {isSleeping ? (
        <path d="M 110 54 Q 114 58 118 54" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#0f172a" strokeWidth="2">
          <line x1="111" y1="51" x2="117" y2="57" />
          <line x1="117" y1="51" x2="111" y2="57" />
        </g>
      ) : (
        <g>
          <circle cx="114" cy="54" r="3.5" fill="#0f172a" />
          <circle cx="113" cy="52" r="1.2" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 9. PELICAN / CRANE SVG - FLYING CREATURE (White Pelican from photo)
// -----------------------------------------------------------------------------
export function PelicanSVG({ state = "fly" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";
  const isFlying = state === "fly";

  return (
    <svg viewBox="0 0 190 150" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Flight Wings */}
      {isFlying ? (
        <g>
          <path d="M 70 70 Q 30 30 10 20 Q 45 45 80 65 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="10,20 25,32 30,22" fill="#1e293b" />
        </g>
      ) : (
        <ellipse cx="60" cy="80" rx="15" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      )}

      {/* Body */}
      <ellipse cx="80" cy="85" rx="34" ry="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

      {/* Long Curved Neck */}
      <path d="M 104 80 C 120 70 125 50 118 42 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* Head */}
      <circle cx="118" cy="40" r="14" fill="#f8fafc" />

      {/* Huge Golden-Orange Pouch Beak */}
      <path
        d="M 126 36 L 175 42 C 172 65 145 68 126 52 Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="1.5"
      />

      {/* Eye */}
      {isSleeping ? (
        <path d="M 114 38 Q 118 42 122 38" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : isDead ? (
        <g stroke="#0f172a" strokeWidth="2">
          <line x1="115" y1="35" x2="121" y2="41" />
          <line x1="121" y1="35" x2="115" y2="41" />
        </g>
      ) : (
        <g>
          <circle cx="118" cy="38" r="3" fill="#0f172a" />
          <circle cx="117" cy="37" r="1" fill="#ffffff" />
        </g>
      )}

      {/* Webbed Feet */}
      <polygon points="75,110 65,124 85,124" fill="#d97706" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 10. GIANT BUTTERFLY SVG - FLYING CREATURE (Orange Monarch from photo)
// -----------------------------------------------------------------------------
export function ButterflySVG({ state = "fly" }: { state: DragonState }) {
  const isSleeping = state === "sleep";
  const isDead = state === "dead";
  const isFlying = state === "fly";

  return (
    <svg viewBox="0 0 170 150" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Ornate Wings */}
      <g
        className={isFlying ? "animate-pulse" : ""}
        transform={isSleeping ? "scale(0.85) translate(12, 12)" : ""}
      >
        {/* Left Upper Wing */}
        <path
          d="M 85 70 C 40 20 15 35 25 75 C 32 95 65 90 85 75 Z"
          fill="#ea580c"
          stroke="#000000"
          strokeWidth="3"
        />
        {/* Yellow dots inside left wing */}
        <circle cx="45" cy="55" r="5" fill="#fef08a" />
        <circle cx="58" cy="70" r="4" fill="#fef08a" />

        {/* Right Upper Wing */}
        <path
          d="M 85 70 C 130 20 155 35 145 75 C 138 95 105 90 85 75 Z"
          fill="#ea580c"
          stroke="#000000"
          strokeWidth="3"
        />
        {/* Yellow dots inside right wing */}
        <circle cx="125" cy="55" r="5" fill="#fef08a" />
        <circle cx="112" cy="70" r="4" fill="#fef08a" />

        {/* Lower Wings */}
        <path
          d="M 85 75 C 55 85 45 120 70 130 C 85 132 85 95 85 75 Z"
          fill="#f97316"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <path
          d="M 85 75 C 115 85 125 120 100 130 C 85 132 85 95 85 75 Z"
          fill="#f97316"
          stroke="#000000"
          strokeWidth="2.5"
        />
      </g>

      {/* Central Caterpillar Body */}
      <ellipse cx="85" cy="78" rx="7" ry="24" fill="#18181b" />

      {/* Antennae */}
      <path d="M 83 55 Q 70 35 60 40" fill="none" stroke="#18181b" strokeWidth="2.5" />
      <circle cx="60" cy="40" r="3" fill="#ea580c" />
      <path d="M 87 55 Q 100 35 110 40" fill="none" stroke="#18181b" strokeWidth="2.5" />
      <circle cx="110" cy="40" r="3" fill="#ea580c" />

      {/* Eyes */}
      {isSleeping ? (
        <path d="M 81 60 Q 85 63 89 60" stroke="#f8fafc" strokeWidth="1.5" fill="none" />
      ) : isDead ? (
        <g stroke="#f8fafc" strokeWidth="1.5">
          <line x1="82" y1="58" x2="88" y2="64" />
          <line x1="88" y1="58" x2="82" y2="64" />
        </g>
      ) : (
        <g>
          <circle cx="83" cy="60" r="2" fill="#f8fafc" />
          <circle cx="87" cy="60" r="2" fill="#f8fafc" />
        </g>
      )}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// UNIFIED CREATURE RENDERER
// -----------------------------------------------------------------------------
export function BattleCreatureSVG({
  species,
  state = "walk",
  facingRight = true,
  fireBreathActive = false,
  color,
  className = ""
}: {
  species: AnimalSpecies;
  state?: DragonState;
  facingRight?: boolean;
  fireBreathActive?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        transform: `scaleX(${facingRight ? 1 : -1})`
      }}
    >
      {/* Floating Zzz bubble for all sleeping creatures */}
      {state === "sleep" && (
        <div className="absolute -top-5 right-2 z-10 flex items-center gap-0.5 pointer-events-none select-none">
          <span className="text-xs font-mono font-black text-sky-200 animate-pulse drop-shadow-md">
            💤 Zzz...
          </span>
        </div>
      )}

      {/* Render matching creature based on species */}
      {species === "bear" && <BearSVG state={state} />}
      {species === "lion" && <LionSVG state={state} />}
      {species === "elephant" && <ElephantSVG state={state} />}
      {species === "crocodile" && <CrocodileSVG state={state} />}
      {species === "monkey" && <MonkeySVG state={state} />}
      {species === "dog" && <DogSVG state={state} />}
      {species === "owl" && <OwlSVG state={state} />}
      {species === "parrot" && <ParrotSVG state={state} />}
      {species === "pelican" && <PelicanSVG state={state} />}
      {species === "butterfly" && <ButterflySVG state={state} />}
      {species === "dragon_red" && (
        <DragonSVG color={(color as DragonColor) || "red"} state={state} facingRight={true} fireBreathActive={fireBreathActive} />
      )}
      {species === "dragon_green" && (
        <DragonSVG color={(color as DragonColor) || "green"} state={state} facingRight={true} fireBreathActive={fireBreathActive} />
      )}
      {species === "dragon_gold" && (
        <DragonSVG color={(color as DragonColor) || "gold"} state={state} facingRight={true} fireBreathActive={fireBreathActive} />
      )}
    </div>
  );
}
