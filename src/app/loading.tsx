import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/common/page-shell";

export default function Loading() {
  return (
    <PageShell className="space-y-8">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </PageShell>
  );
}
