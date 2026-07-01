"use client";

interface FutCardProps {
  name: string;
  position: string;
  overall: number;
  attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  gradient: [string, string];
  frameImage?: string;
  photo?: string | null;
  clubInitial?: string;
  countryCode?: string;
  size?: number;
  textShiftY?: {
    meta?: number;
    name?: number;
    stats?: number;
  };
}

export default function FutCard({
  name,
  position,
  overall,
  attrs,
  gradient,
  frameImage,
  photo,
  clubInitial,
  size = 260,
  textShiftY,
}: FutCardProps) {
  const h = size * 1.35;
  const id = `grad-${gradient[0].replace("#", "")}-${gradient[1].replace("#", "")}`;

  const metaYShift = textShiftY?.meta !== undefined ? textShiftY.meta : 45;
  const nameYShift = textShiftY?.name !== undefined ? textShiftY.name : 25;
  const statsYShift = textShiftY?.stats !== undefined ? textShiftY.stats : 22;
  
  return (
    <svg width={size} height={h} viewBox="0 0 260 351" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
        <clipPath id="shield-clip">
          <path d="M130 4 L246 36 L246 190 C246 270 196 320 130 347 C64 320 14 270 14 190 L14 36 Z" />
        </clipPath>
      </defs>

      {/* BACKGROUND LAYER */}
      {frameImage ? (
        <image 
          href={frameImage} 
          x="0" 
          y="0" 
          width="260" 
          height="351" 
          preserveAspectRatio="none" 
        />
      ) : (
        <path
          d="M130 4 L246 36 L246 190 C246 270 196 320 130 347 C64 320 14 270 14 190 L14 36 Z"
          fill={`url(#${id})`}
          clipPath="url(#shield-clip)"
        />
      )}

      {!frameImage && (
        <path
          d="M130 4 L246 36 L246 190 C246 270 196 320 130 347 C64 320 14 270 14 190 L14 36 Z"
          fill="none"
          stroke="#C99A3C"
          strokeWidth="3"
        />
      )}

      {/* PLAYER PHOTO LAYER */}
      <g clipPath="url(#shield-clip)">
        {photo ? (
          <image href={photo} x="20" y="60" width="220" height="220" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <circle cx="130" cy="150" r="62" fill="rgba(255,255,255,0)" /> 
        )}
      </g>

      {/* OVERALL RATING & POSITION */}
      <text x="36" y={64 + metaYShift} fontFamily="Oswald, sans-serif" fontSize="28" fontWeight="700" fill="#fff" textAnchor="middle">
        {overall}
      </text>
      <text x="36" y={80 + metaYShift} fontFamily="Oswald, sans-serif" fontSize="11" fontWeight="700" fill="#fff" opacity="0.9" textAnchor="middle">
        {position}
      </text>

      {/* PLAYER NAME */}
      {!frameImage && (
        <rect x="22" y="240" width="216" height="34" fill="rgba(14,27,43,0.55)" rx="3" />
      )}
      
      <text
        x="130"
        y={220 + nameYShift}
        fontFamily="Oswald, sans-serif"
        fontSize="21"
        fontWeight="700"
        fill="#fff"
        textAnchor="middle"
        letterSpacing="1"
      >
        {name?.toUpperCase() || "PLAYER"}
      </text>

      {/* STATS ATTRIBUTES MATRIX (Single horizontal line) */}
      {Object.entries(attrs).map(([k, v], i) => {
        // This spreads all 6 items side-by-side on the exact same row line
        const x = 35 + i * 38; 
        const yBase = 275;

        return (
          <g key={k}>
            <text x={x} y={yBase + statsYShift} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#fff" opacity="0.75" textAnchor="middle">
              {k}
            </text>
            <text x={x} y={yBase + 14 + statsYShift} fontFamily="Oswald, sans-serif" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">
              {v}
            </text>
          </g>
        );
      })}

      {/* BADGE / TEAM OVERLAYS */}
      {clubInitial && (
        <circle cx="130" cy="325" r="11" fill="rgba(255,255,255,0.85)" />
      )}
      {clubInitial && (
        <text x="130" y="330" fontFamily="Oswald, sans-serif" fontSize="11" fontWeight="700" fill="#0E1B2B" textAnchor="middle">
          {clubInitial}
        </text>
      )}
    </svg>
  );
}