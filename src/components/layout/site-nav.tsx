"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";

const NAV_ITEMS = [
  { href: ROUTES.partidos, label: STRINGS.nav.partidos },
  { href: ROUTES.equipos, label: STRINGS.nav.equipos },
  { href: ROUTES.jugadores, label: STRINGS.nav.jugadores },
  { href: ROUTES.ligas, label: STRINGS.nav.ligas },
  { href: ROUTES.torneos, label: STRINGS.nav.torneos },
  { href: ROUTES.selecciones, label: STRINGS.nav.selecciones },
];

export function SiteNav({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        orientation === "horizontal"
          ? "hidden items-center gap-6 md:flex"
          : "flex flex-col gap-1",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-sm font-medium transition-colors",
              orientation === "vertical" && "rounded-md px-3 py-2 text-base",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              orientation === "vertical" && isActive && "bg-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
