import { domainOrder, type DomainId } from "@/config/research-domains";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

const placement: Record<DomainId, string> = {
  "pet-healthspan": "left-1/2 top-[4%] -translate-x-1/2",
  "pet-omics": "top-[30%] right-[2%]",
  "comparative-aging": "right-[10%] bottom-[6%]",
  "human-healthspan": "bottom-[6%] left-[10%]",
  "longevity-intelligence": "top-[30%] left-[2%]",
};

export function ResearchGalaxy({
  selected,
  onSelect,
  content,
}: {
  selected: DomainId;
  onSelect: (id: DomainId) => void;
  content: SiteContent;
}) {
  return (
    <>
      <div className="relative hidden h-[520px] md:block">
        <svg viewBox="0 0 800 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <line className="flow-line" x1="400" y1="260" x2="400" y2="70" stroke="#46C8E8" />
          <line className="flow-line" x1="400" y1="260" x2="680" y2="190" stroke="#67E0D1" />
          <line className="flow-line" x1="400" y1="260" x2="620" y2="430" stroke="#7A9FE8" />
          <line className="flow-line" x1="400" y1="260" x2="180" y2="430" stroke="#46C8E8" />
          <line className="flow-line" x1="400" y1="260" x2="120" y2="190" stroke="#8F86D6" strokeOpacity="0.8" />
          <circle cx="400" cy="260" r="46" fill="none" stroke="rgba(70,200,232,0.35)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 w-40 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{content.research.domains[selected].title}</p>
        </div>
        {domainOrder.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => onSelect(id)}
            className={cn(
              "surface absolute max-w-48 px-4 py-3 text-left",
              placement[id],
              selected === id && "border-[var(--color-primary)]",
            )}
          >
            <span className="block text-sm text-[var(--color-text-primary)]">{content.research.domains[id].title}</span>
            <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">{content.research.domains[id].summary}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:hidden">
        {domainOrder.map((id) => (
          <button key={id} type="button" aria-pressed={selected === id} onClick={() => onSelect(id)} className={cn("surface px-4 py-4 text-left", selected === id && "border-[var(--color-primary)]")}>
            <span className="block text-base text-[var(--color-text-primary)]">{content.research.domains[id].title}</span>
            <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{content.research.domains[id].summary}</span>
          </button>
        ))}
      </div>
    </>
  );
}
