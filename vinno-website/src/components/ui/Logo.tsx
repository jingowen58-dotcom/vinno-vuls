import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[15px] tracking-[0.2em] text-[var(--color-text-primary)]", className)}>
      <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7" fill="#102338" stroke="#46C8E8" strokeOpacity="0.7" />
        <path d="M9 23.5 16 8.5 23 23.5" fill="none" stroke="#46C8E8" strokeWidth="1.8" />
        <circle cx="16" cy="16.5" r="1.5" fill="#67E0D1" />
      </svg>
      <span className="font-display">VINNO</span>
    </span>
  );
}
