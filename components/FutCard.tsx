"use client";

interface FutCardProps {
  name: string;
  position: string;
  overall: number;
  attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  gradient: [string, string];
  frameImage?: string;
  photo?: string | null;
  clubBadge?: string | null; // ✨ Replaced clubInitial string with clubBadge photo URL string
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
  clubBadge, // ✨ Swapped here
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

        {/* ✨ Circular clipping mask to ensure custom uploaded badges remain perfectly round */}
        <clipPath id="badge-clip">
          <circle cx="144" cy="308" r="8.5" />
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

      {/* 1. OVERALL RATING & POSITION */}
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

      {/* 2. PLAYER NAME */}
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

      {/* 3. STATS ATTRIBUTES MATRIX */}
      <g transform={`translate(0, ${statsYShift})`}>
        {Object.entries(attrs).map(([k, v], i) => {
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

      {/* 4. BOTTOM CENTER BADGES (Full Native Shape Rendering) */}
      <g transform="translate(0, -1)"> 
        {/* England Flag */}
        <rect x="104" y="301" width="26" height="15" fill="#fff" stroke="#3c3f25" strokeWidth="0.5" />
        <line x1="117" y1="301" x2="117" y2="316" stroke="#da291c" strokeWidth="2.5" />
        <line x1="104" y1="308" x2="130" y2="308" stroke="#da291c" strokeWidth="2.5" />

        {/* Dynamic Club Badge Image Layer */}
        {clubBadge ? (
          <g>
            {/* Removed the <circle> border and clipPath mask so the full logo renders cleanly */}
            <image
              href={clubBadge}
              x="135.5"
              y="299.5"
              width="17"
              height="17"
              preserveAspectRatio="xMidYMid meet" // 'meet' ensures the full aspect ratio fits without crop distortion
            />
          </g>
        ) : (
          /* Soft dash alignment guide if empty */
          <circle cx="144" cy="308" r="8.5" fill="rgba(255,255,255,0.3)" stroke="#3c3f25" strokeWidth="0.5" strokeDasharray="2 2" />
        )}
      </g>
    </svg>
  );
}