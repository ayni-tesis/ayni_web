type AyniMarkProps = {
  size?: number;
  fill?: string;
  veinColor?: string;
  showConstruction?: boolean;
};

/**
 * AYNI brand mark — hoja-escudo de café con la letra "A"
 * formada por la vena central y dos venas laterales (negative space).
 */
export function AyniMark({
  size = 64,
  fill = "var(--color-primary)",
  veinColor = "#F5F1E8",
  showConstruction = false,
}: AyniMarkProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={size}
      aria-label="AYNI"
      role="img"
    >
      {showConstruction && (
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.3" fill="none">
          <circle cx="60" cy="70" r="60" />
          <line x1="60" y1="0" x2="60" y2="140" />
          <line x1="0" y1="70" x2="120" y2="70" />
          <line x1="36" y1="100" x2="60" y2="38" />
          <line x1="84" y1="100" x2="60" y2="38" />
        </g>
      )}

      {/* Leaf-shield silhouette */}
      <path
        d="M60 6 C92 6, 112 30, 112 70 L60 134 L8 70 C8 30, 28 6, 60 6 Z"
        fill={fill}
      />

      {/* Negative-space "A" formed by leaf veins */}
      <g
        fill="none"
        stroke={veinColor}
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <line x1="36" y1="100" x2="60" y2="38" />
        <line x1="84" y1="100" x2="60" y2="38" />
        <line x1="46" y1="74" x2="74" y2="74" />
      </g>
    </svg>
  );
}
