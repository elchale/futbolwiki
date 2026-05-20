"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { STRINGS } from "@/lib/strings";
import { Button } from "@/components/ui/button";

export function SearchTrigger() {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      aria-label={STRINGS.nav.buscar}
      className="gap-2"
    >
      <Link href={ROUTES.buscar}>
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">{STRINGS.nav.buscar}</span>
      </Link>
    </Button>
  );
}
