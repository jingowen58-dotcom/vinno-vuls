import { statusCatalog, type StatusId } from "@/config/status";
import type { Locale } from "@/content/types";
import { cn } from "@/lib/utils";

const tones: Record<StatusId, string> = {
  implemented: "border-[var(--color-accent)] text-[var(--color-accent)]",
  in_progress: "border-[var(--color-primary)] text-[var(--color-primary)]",
  planned: "border-[var(--color-secondary)] text-[var(--color-secondary)]",
  vision: "border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]",
};

export function StatusBadge({ status, locale }: { status: StatusId; locale: Locale }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.12em] uppercase", tones[status])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {statusCatalog[status][locale]}
    </span>
  );
}
