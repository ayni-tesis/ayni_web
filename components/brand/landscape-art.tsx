/**
 * Paisaje de selva alta (Villa Rica, Pasco) del brand kit — cordilleras en
 * capas de verde forest con disco solar en secondary. Fuente única del arte
 * usado en /brand (Image Direction) y en superficies de marca como el login.
 */
export function LandscapeArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 280"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <title>Paisaje de selva alta</title>
      {/* Sky band */}
      <rect width="400" height="280" fill="#0A1F12" />
      <rect y="120" width="400" height="160" fill="#0D2618" />
      {/* Sun disc */}
      <circle cx="290" cy="110" r="34" fill="#DDFFE7" opacity="0.15" />
      <circle cx="290" cy="110" r="22" fill="#DDFFE7" opacity="0.4" />
      {/* Distant ridge */}
      <path
        d="M0 170 L 60 140 L 130 165 L 200 130 L 280 160 L 340 138 L 400 158 L 400 280 L 0 280 Z"
        fill="#1A3D2A"
        opacity="0.7"
      />
      {/* Middle ridge */}
      <path
        d="M0 200 L 80 175 L 160 200 L 220 180 L 300 205 L 360 188 L 400 198 L 400 280 L 0 280 Z"
        fill="#0E2E1D"
      />
      {/* Foreground */}
      <path
        d="M0 235 L 100 220 L 180 240 L 260 222 L 340 244 L 400 232 L 400 280 L 0 280 Z"
        fill="#04A033"
        opacity="0.85"
      />
      {/* Halftone-ish dots */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 23) % 400;
        const y = 95 + ((i * 7) % 30);
        return (
          <circle
            key={`dot-${x}-${y}`}
            cx={x}
            cy={y}
            r="0.7"
            fill="#DDFFE7"
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
}
