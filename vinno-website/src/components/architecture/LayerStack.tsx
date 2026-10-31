import { layerOrder, type LayerId } from "@/config/architecture";
import type { SiteContent } from "@/content/types";
import { LayerDetail } from "@/components/architecture/LayerDetail";
import { cn } from "@/lib/utils";

const edge: Record<LayerId, string> = {
  L1: "border-l-[rgba(70,200,232,0.35)]",
  L2: "border-l-[var(--color-primary)]",
  L3: "border-l-[var(--color-accent)]",
  L4: "border-l-[var(--color-secondary)]",
  L5: "border-l-[var(--color-ai)]",
  L6: "border-l-[rgba(70,200,232,0.55)]",
};

export function LayerStack({
  selected,
  onSelect,
  content,
}: {
  selected: LayerId;
  onSelect: (id: LayerId) => void;
  content: SiteContent;
}) {
  return (
    <div role="list" aria-label={content.architecture.selectLabel} className="space-y-2.5">
      {layerOrder.map((id) => {
        const active = selected === id;
        const layer = content.architecture.layers[id];
        return (
          <div key={id} role="listitem">
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(id)}
              className={cn(
                "surface flex w-full items-center justify-between gap-4 border-l-2 px-4 py-4 text-left transition-colors",
                edge[id],
                active ? "bg-[rgba(70,200,232,0.08)]" : "hover:bg-[rgba(160,195,220,0.04)]",
              )}
            >
              <span>
                <span className="block text-xs tracking-[0.16em] text-[var(--color-primary)]">{id}</span>
                <span className="mt-1 block text-base text-[var(--color-text-primary)]">{layer.name}</span>
              </span>
            </button>
            {active ? (
              <div className="mt-2.5 lg:hidden">
                <LayerDetail id={id} content={content} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
