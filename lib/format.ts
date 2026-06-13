const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> =
  [
    { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", ms: 24 * 60 * 60 * 1000 },
    { unit: "hour", ms: 60 * 60 * 1000 },
    { unit: "minute", ms: 60 * 1000 },
  ];

const relativeFormatter = new Intl.RelativeTimeFormat("es-PE", {
  numeric: "auto",
});

export function formatRelativeTime(
  isoDate: string,
  now: Date = new Date(),
): string {
  const target = new Date(isoDate);
  const diffMs = target.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  if (absMs < 60 * 1000) return "Ahora mismo";

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (absMs >= ms) {
      const value = Math.round(diffMs / ms);
      return relativeFormatter.format(value, unit);
    }
  }
  return "Ahora mismo";
}
