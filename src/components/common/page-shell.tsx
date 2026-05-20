import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  width = "wide",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "narrow" | "content" | "wide" | "full";
}) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-10 sm:px-6 lg:px-8",
        width === "narrow" && "max-w-prose",
        width === "content" && "max-w-screen-md",
        width === "wide" && "max-w-screen-2xl",
        width === "full" && "max-w-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
