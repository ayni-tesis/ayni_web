import { cn } from "@/lib/utils";

const AVATAR_PALETTE = [
  { bg: "bg-secondary", text: "text-primary" },
  { bg: "bg-[#FFE5E5]", text: "text-error" },
  { bg: "bg-[#FFF4D6]", text: "text-warning" },
  { bg: "bg-gray-5", text: "text-gray-1" },
] as const;

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase();
  return (parts[0]?.[0]! + parts[1]?.[0]!).toUpperCase();
}

function pickPalette(seed: string): (typeof AVATAR_PALETTE)[number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]!;
}

type AvatarProps = {
  fullName: string;
  src?: string | null;
  size?: number;
  className?: string;
};

export function Avatar({ fullName, src, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      // biome-ignore lint/performance/noImgElement: avatar served from external bucket, Next/Image domain config aún no aplicable en mock
      <img
        src={src}
        alt={fullName}
        width={size}
        height={size}
        className={cn("rounded-full object-cover shrink-0", className)}
      />
    );
  }

  const palette = pickPalette(fullName);
  const fontSize = Math.round(size * 0.4);

  return (
    <div
      aria-label={fullName}
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0",
        palette.bg,
        palette.text,
        className,
      )}
      style={{ width: size, height: size, fontSize }}
    >
      {getInitials(fullName)}
    </div>
  );
}
