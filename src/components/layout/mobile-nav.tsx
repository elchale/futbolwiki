"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SiteNav } from "@/components/layout/site-nav";
import { STRINGS } from "@/lib/strings";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          className="md:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-left font-display text-xl">
            {STRINGS.site.name}
          </SheetTitle>
        </SheetHeader>
        <div className="p-4" onClick={() => setOpen(false)}>
          <SiteNav orientation="vertical" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
