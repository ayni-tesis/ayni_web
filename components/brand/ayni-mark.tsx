type AyniMarkProps = {
  size?: number;
  background?: string | null;
  faceColor?: string;
  featureColor?: string;
  veinColor?: string;
  /** @deprecated use `faceColor` */
  fill?: string;
  /** @deprecated unused — kept for backwards compatibility */
  showConstruction?: boolean;
};

/**
 * AYNI brand mark — hoja de café en forma de corazón con vena central
 * y un rostro calmo (ojos curvos + sonrisa sutil).
 *
 * Por defecto dibuja el lockup completo (squircle de fondo + hoja +
 * rostro). Pasa `background={null}` para usarlo "suelto" (solo la
 * hoja con rostro, sin fondo), útil donde el contenedor ya aporta
 * el fondo (headers, badges).
 */
export function AyniMark({
  size = 64,
  background = "var(--color-primary)",
  faceColor,
  featureColor = "var(--color-primary)",
  veinColor = "var(--color-secondary)",
  fill,
}: AyniMarkProps) {
  const resolvedFaceColor = faceColor ?? fill ?? "#FFFFFF";
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      aria-label="AYNI"
      role="img"
    >
      {background && (
        <rect x="0" y="0" width="200" height="200" rx="44" fill={background} />
      )}

      {/* Heart-shaped leaf: two rounded lobes meeting in a top notch,
          tapering to a drip-tip point at the bottom. */}
      <path
        d="M100 46 C82 14, 30 18, 30 70 C30 112, 70 142, 100 178 C130 142, 170 112, 170 70 C170 18, 118 14, 100 46 Z"
        fill={resolvedFaceColor}
      />

      {/* Center vein */}
      <line
        x1="100"
        y1="56"
        x2="100"
        y2="160"
        stroke={veinColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Calm crescent eyes + subtle smile */}
      <g
        fill="none"
        stroke={featureColor}
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        <path d="M70 102 Q78 92 86 102" />
        <path d="M114 102 Q122 92 130 102" />
        <path d="M84 122 Q100 134 116 122" />
      </g>
    </svg>
  );
}
