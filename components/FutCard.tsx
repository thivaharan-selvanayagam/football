"use client";

interface FutCardProps {
  name: string;
  position: string;
  overall: number;
  attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  gradient: [string, string];
  frameImage?: string;
  photo?: string | null;
  clubBadge?: string | null; 
  countryFlag?: string | null; 
  brandLogo?: string | null; // Optional custom brand logo path
  textColor?: string;
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
  clubBadge,
  countryFlag, 
  brandLogo = "/images/logo.png", // ✨ Defaults to your brand logo
  textColor = "#3c3f25",
  size = 260,
  textShiftY,
}: FutCardProps) {
  const h = size * 1.35;
  const bgGradId = `grad-${gradient[0].replace("#", "")}-${gradient[1].replace("#", "")}`;

  const metaYShift = textShiftY?.meta !== undefined ? textShiftY.meta : 0;
  const nameYShift = textShiftY?.name !== undefined ? textShiftY.name : 0;
  const statsYShift = textShiftY?.stats !== undefined ? textShiftY.stats : 0;

  return (
    <svg width={size} height={h} viewBox="0 0 260 351" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id={bgGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
      </defs>

      {/* 1. CARD FRAME BACKGROUND */}
      {frameImage ? (
        <image 
          href={frameImage} 
          xlinkHref={frameImage}
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
        />
      )}

      {/* 2. PLAYER PORTRAIT PHOTO */}
      {photo ? (
        <image 
          href={photo} 
          xlinkHref={photo} 
          x="42" 
          y="48" 
          width="176" 
          height="180" 
          preserveAspectRatio="xMidYMid meet" 
        />
      ) : (
        <circle cx="130" cy="150" r="62" fill="rgba(255,255,255,0)" /> 
      )}

      {/* 3. OVERALL RATING & POSITION */}
      <g transform={`translate(0, ${metaYShift})`}>
        <text x="48" y="78" fontFamily="Oswald, sans-serif" fontSize="34" fontWeight="700" fill={textColor} textAnchor="middle">
          {overall}
        </text>
        <text x="48" y="96" fontFamily="Oswald, sans-serif" fontSize="14" fontWeight="700" fill={textColor} textAnchor="middle" letterSpacing="0.5">
          {position?.toUpperCase()}
        </text>
      </g>

      {/* 4. PLAYER NAME */}
      <g transform={`translate(0, ${nameYShift})`}>
        <text x="130" y="252" fontFamily="Oswald, sans-serif" fontSize="22" fontWeight="700" fill={textColor} textAnchor="middle">
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Player"}
        </text>
      </g>

      {/* 5. STATS ATTRIBUTES MATRIX */}
      <g transform={`translate(0, ${statsYShift})`}>
        {Object.entries(attrs).map(([k, v], i) => {
          const x = 48 + i * 33; 
          const yBase = 276;
          return (
            <g key={k}>
              <text x={x} y={yBase} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill={textColor} opacity="0.9" textAnchor="middle">
                {k}
              </text>
              <text x={x} y={yBase + 18} fontFamily="Oswald, sans-serif" fontSize="20" fontWeight="700" fill={textColor} textAnchor="middle">
                {v}
              </text>
            </g>
          );
        })}
      </g>

      {/* 6. BOTTOM CENTER BADGES (Flag & Club) */}
      <g transform="translate(0, -6)"> 
        {countryFlag && (
          <image
            key={countryFlag} 
            href={countryFlag}
            xlinkHref={countryFlag}
            x="104"
            y="305"
            width="26"
            height="15"
            preserveAspectRatio="none"
          />
        )}

        {clubBadge ? (
          <image
            key={clubBadge} 
            href={clubBadge}
            xlinkHref={clubBadge}
            x="135.5"
            y="304.5"
            width="17"
            height="17"
            preserveAspectRatio="xMidYMid meet" 
          />
        ) : (
          <circle cx="144" cy="312" r="8.5" fill="rgba(255,255,255,0.3)" stroke={textColor} strokeWidth="0.5" strokeDasharray="2 2" />
        )}
      </g>

      {/* 7. ✨ BRAND LOGO (Positioned directly under Country Flag and Club Badge) */}
      {brandLogo && (
        <image
          href={brandLogo}
          xlinkHref={brandLogo}
          x="93"
          y="308"
          width="75"
          height="30"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </svg>
  );
}