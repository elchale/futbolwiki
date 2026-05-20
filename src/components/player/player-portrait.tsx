import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayerPortrait({
  name,
  portraitUrl,
  size = "md",
  className,
}: {
  name: string;
  portraitUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-12 text-base",
    lg: "size-20 text-2xl",
    xl: "size-32 text-4xl",
  }[size];

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter((c) => /[A-Za-zÀ-ÿ]/.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (portraitUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={portraitUrl}
        alt={name}
        className={cn(
          "rounded-full bg-muted object-cover ring-2 ring-border",
          sizeClasses,
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-display font-semibold text-muted-foreground ring-1 ring-border",
        sizeClasses,
        className,
      )}
    >
      {initials || <User className="size-1/2" aria-hidden />}
    </span>
  );
}
