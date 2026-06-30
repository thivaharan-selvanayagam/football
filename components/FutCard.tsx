"use client";

interface FutCardProps {
  name: string;
  position: string;
  overall: number;
  attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
  gradient: [string, string];
  photo?: string | null;
  clubInitial?: string;
  countryCode?: string;
  size?: number;
}

export default function FutCard({
  name,
  position,
  overall,
  attrs,
  gradient,
  photo,
  clubInitial,
  size = 260,
}: FutCardProps) {
  const h = size * 1.35;
  const id = `grad-${gradient[0].replace("#", "")}-${gradient[1].replace("#", "")}`;
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
      <path
        d="M130 4 L246 36 L246 190 C246 270 196 320 130 347 C64 320 14 270 14 190 L14 36 Z"
        fill={`url(#${id})`}
        stroke="#C99A3C"
        strokeWidth="3"
      />
      <g clipPath="url(#shield-clip)">
        {photo ? (
          <image href={photo} x="20" y="60" width="220" height="220" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <circle cx="130" cy="150" r="62" fill="rgba(255,255,255,0.25)" />
        )}
      </g>
      <text x="28" y="64" fontFamily="Oswald, sans-serif" fontSize="34" fontWeight="700" fill="#fff">
        {overall}
      </text>
      <text x="28" y="84" fontFamily="Oswald, sans-serif" fontSize="13" fill="#fff" opacity="0.9">
        {position}
      </text>
      <rect x="22" y="240" width="216" height="34" fill="rgba(14,27,43,0.55)" rx="3" />
      <text
        x="130"
        y="263"
        fontFamily="Oswald, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#fff"
        textAnchor="middle"
        letterSpacing="1"
      >
        {name?.toUpperCase() || "PLAYER"}
      </text>
      {Object.entries(attrs).map(([k, v], i) => {
        const x = 30 + i * 36;
        return (
          <g key={k}>
            <text x={x} y="288" fontFamily="Inter, sans-serif" fontSize="11" fill="#fff" opacity="0.85" textAnchor="middle">
              {k}
            </text>
            <text x={x} y="304" fontFamily="Oswald, sans-serif" fontSize="15" fontWeight="700" fill="#fff" textAnchor="middle">
              {v}
            </text>
          </g>
        );
      })}
      {clubInitial && (
        <circle cx="130" cy="322" r="11" fill="rgba(255,255,255,0.85)" />
      )}
      {clubInitial && (
        <text x="130" y="327" fontFamily="Oswald, sans-serif" fontSize="11" fontWeight="700" fill="#0E1B2B" textAnchor="middle">
          {clubInitial}
        </text>
      )}
    </svg>
  );
}
