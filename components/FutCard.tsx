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
  const bgGradId = `grad-${gradient[0].replace("#", "")}-${gradient[1].replace("#", "")}`;

  const metaYShift = textShiftY?.meta !== undefined ? textShiftY.meta : 0;
  const nameYShift = textShiftY?.name !== undefined ? textShiftY.name : 0;
  const statsYShift = textShiftY?.stats !== undefined ? textShiftY.stats : 0;
  
  return (
    <svg width={size} height={h} viewBox="0 0 260 351" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={bgGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>

        <clipPath id="shield-clip">
          <path d="M130 4 L246 36 L246 190 C246 270 196 320 130 347 C64 320 14 270 14 190 L14 36 Z" />
        </clipPath>
      </defs>

      {/* BACKGROUND FRAME LAYER */}
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
          fill={`url(#${bgGradId})`}
          clipPath="url(#shield-clip)"
        />
      )}

      {/* PLAYER PORTRAIT PHOTO */}
      <g clipPath="url(#shield-clip)">
        {photo ? (
          <image href={photo} x="20" y="35" width="220" height="220" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <circle cx="130" cy="150" r="62" fill="rgba(255,255,255,0)" /> 
        )}
      </g>

      {/* 1. OVERALL RATING & POSITION (Pushed further right to x="54" to clear the outer border line) */}
      <g transform={`translate(0, ${metaYShift})`}>
        <text 
          x="54" 
          y="80" 
          fontFamily="Oswald, sans-serif" 
          fontSize="36" 
          fontWeight="700" 
          fill="#3c3f25" 
          textAnchor="middle"
        >
          {overall}
        </text>
        <text 
          x="54" 
          y="98" 
          fontFamily="Oswald, sans-serif" 
          fontSize="15" 
          fontWeight="700" 
          fill="#3c3f25" 
          textAnchor="middle"
          letterSpacing="0.5"
        >
          {position?.toUpperCase()}
        </text>
      </g>

      {/* 2. PLAYER NAME (Lifted higher up to y="242" so it lands beautifully on the golden banner) */}
      <g transform={`translate(0, ${nameYShift})`}>
        <text
          x="130"
          y="242"
          fontFamily="Oswald, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#3c3f25"
          textAnchor="middle"
        >
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Player"}
        </text>
      </g>

      {/* 3. STATS ATTRIBUTES MATRIX (Compressed step gap from 34.5 down to 32.5 to pull everything inward) */}
      <g transform={`translate(0, ${statsYShift})`}>
        {Object.entries(attrs).map(([k, v], i) => {
          // Starting x offset moved to 48, step changed to 33. This keeps PAC and PHY safe from frame borders!
          const x = 48 + i * 33; 
          const yBase = 276;

          return (
            <g key={k}>
              <text x={x} y={yBase} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#3c3f25" opacity="0.9" textAnchor="middle">
                {k}
              </text>
              <text x={x} y={yBase + 18} fontFamily="Oswald, sans-serif" fontSize="20" fontWeight="700" fill="#3c3f25" textAnchor="middle">
                {v}
              </text>
            </g>
          );
        })}
      </g>

      {/* 4. BOTTOM CENTER BADGES (Perfected vertical placement between stats and shield tip) */}
      <g transform="translate(0, -1)"> 
        {/* England Flag - Centered horizontally at x="104" and tuned to y="301" */}
        <rect x="104" y="301" width="26" height="15" fill="#fff" stroke="#3c3f25" strokeWidth="0.5" />
        <line x1="117" y1="301" x2="117" y2="316" stroke="#da291c" strokeWidth="2.5" />
        <line x1="104" y1="308" x2="130" y2="308" stroke="#da291c" strokeWidth="2.5" />

        {/* Dynamic Club Badge - Balanced horizontally at cx="144" and tuned to cy="308" */}
        {clubInitial && (
          <g>
            <circle cx="144" cy="308" r="8.5" fill="rgba(255,255,255,0.95)" stroke="#3c3f25" strokeWidth="0.5" />
            <text 
              x="144" 
              y="311" 
              fontFamily="Oswald, sans-serif" 
              fontSize="8" 
              fontWeight="700" 
              fill="#3c3f25" 
              textAnchor="middle"
            >
              {clubInitial}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}