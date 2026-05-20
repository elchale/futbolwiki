"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ArrowDownAZ, ArrowUpAZ, ListFilter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

export type FilterDef = {
  /** URL search-param key */
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
  /** Display priority (smaller = leftmost) */
  order?: number;
};

export type SortOption = { value: string; label: string };

export type FilterBarProps = {
  filters?: FilterDef[];
  sort?: { key?: string; options: SortOption[]; defaultValue?: string };
  totalCount?: number;
  resultLabel?: { singular: string; plural: string };
  className?: string;
};

const ANY_VALUE = "__any__";

export function FilterBar({
  filters = [],
  sort,
  totalCount,
  resultLabel,
  className,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const sortKey = sort?.key ?? "sort";
  const current = (key: string) => params.get(key) ?? "";
  const hasAnyFilter =
    filters.some((f) => current(f.key)) ||
    (sort?.defaultValue ? current(sortKey) && current(sortKey) !== sort.defaultValue : !!current(sortKey));

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === ANY_VALUE) next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`);
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const orderedFilters = [...filters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ListFilter className="size-4" aria-hidden /> Filtros
      </span>

      {orderedFilters.map((f) => {
        const value = current(f.key);
        return (
          <Select
            key={f.key}
            value={value || ANY_VALUE}
            onValueChange={(v) => set(f.key, v === ANY_VALUE ? null : v)}
          >
            <SelectTrigger className="h-9 min-w-[10rem]" aria-label={f.label}>
              <SelectValue placeholder={f.placeholder ?? f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>{f.placeholder ?? `Todos los ${f.label.toLowerCase()}`}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      {sort ? (
        <Select
          value={current(sortKey) || sort.defaultValue || sort.options[0]?.value}
          onValueChange={(v) => set(sortKey, v)}
        >
          <SelectTrigger className="h-9 min-w-[10rem]" aria-label="Ordenar">
            <ArrowDownAZ className="mr-1 size-3.5 text-muted-foreground" aria-hidden />
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {sort.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {totalCount != null && resultLabel ? (
          <span className="tabular-nums">
            {totalCount.toLocaleString("es-PE")} {totalCount === 1 ? resultLabel.singular : resultLabel.plural}
          </span>
        ) : null}
        {hasAnyFilter ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 px-2 text-xs"
          >
            <X className="mr-1 size-3" aria-hidden /> Limpiar
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { ArrowUpAZ };
