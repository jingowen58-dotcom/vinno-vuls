import Image from "next/image";
import { domainOrder, type DomainId } from "@/config/research-domains";
import type { SiteContent } from "@/content/types";
import { domainImages } from "@/lib/media";
import { cn } from "@/lib/utils";

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
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {domainOrder.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={selected === id}
            onClick={() => onSelect(id)}
            className={cn(
              "surface overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1",
              selected === id && "border-[var(--color-primary)]",
            )}
          >
            <Image src={domainImages[id]} alt={content.media.domains[id]} width={640} height={480} className="aspect-[4/3] h-auto w-full object-cover" />
            <span className="block px-3 py-3">
              <span className="block text-sm text-[var(--color-text-primary)]">{content.research.domains[id].title}</span>
              <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">{content.research.domains[id].keywords[0]}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">{content.media.note}</p>
    </div>
  );
}
