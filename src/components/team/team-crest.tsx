import { cn } from "@/lib/utils";

/**
 * Initials-based crest fallback. Renders the team's primary/secondary colors
 * as a circular badge. Used when no badgeUrl is available (which is most cases
 * in v1 — we don't host images yet).
 */
export function TeamCrest({
  team,
  size = "md",
  className,
}: {
  team: {
    name: string;
    shortName?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    badgeUrl?: string | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-6 text-[0.6rem]",
    md: "size-9 text-xs",
    lg: "size-14 text-base",
    xl: "size-24 text-2xl",
  }[size];

  const initials = (team.shortName ?? team.name)
    .split(/\s+/)
    .map((w) => w[0])
    .filter((c) => /[A-Za-z0-9]/.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const bg = team.primaryColor ?? "#1F2937";
  const ring = team.secondaryColor ?? "#FFFFFF";

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white shadow-sm",
        sizeClasses,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${bg} 0%, ${bg} 60%, color-mix(in oklab, ${bg} 80%, black) 100%)`,
        outline: `2px solid color-mix(in oklab, ${ring} 80%, transparent)`,
        outlineOffset: -1,
      }}
    >
      {initials}
    </span>
  );
}
