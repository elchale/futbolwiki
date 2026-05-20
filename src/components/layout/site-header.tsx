import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { SiteNav } from "@/components/layout/site-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchTrigger } from "@/components/search/search-trigger";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav />
        <Link
          href={ROUTES.home}
          className="font-display text-xl font-semibold leading-none tracking-tight"
          aria-label={STRINGS.site.name}
        >
          <span className="text-primary">Fútbol</span>
          <span className="ml-1 text-foreground">Wiki</span>
        </Link>
        <div className="hidden md:block">
          <SiteNav />
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
