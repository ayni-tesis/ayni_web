/**
 * Placeholder visual cuando una plaga no tiene imagen subida todavía.
 * Hoja botánica minimalista en outline, sobre el cream de marca.
 * Mantiene la misma jerarquía visual que una foto real para que la grid no descose.
 */
export function PlaguePlaceholderArt() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-br from-cream to-cream-2 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 120 120"
        width="84"
        height="84"
        className="text-gray-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Sin imagen disponible</title>
        {/* leaf silhouette */}
        <path d="M30 90 C 30 50, 60 30, 95 30 C 95 65, 70 95, 30 90 Z" />
        {/* central vein */}
        <path d="M30 90 L 90 35" />
        {/* lateral veins */}
        <path d="M45 73 L 70 60" />
        <path d="M55 80 L 80 55" />
        <path d="M40 60 L 60 50" />
      </svg>
    </div>
  );
}
