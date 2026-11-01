import { aiNodeOrder, type AiNodeId } from "@/config/ai";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

export function ResearchEngineGraph({
  selected,
  onSelect,
  content,
}: {
  selected: AiNodeId;
  onSelect: (id: AiNodeId) => void;
  content: SiteContent;
}) {
  return (
    <div className="grid gap-3">
      {aiNodeOrder.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={selected === id}
          onClick={() => onSelect(id)}
          className={cn(
            "surface px-4 py-3 text-left text-sm text-[var(--color-text-primary)]",
            selected === id && "border-[var(--color-ai)]",
          )}
        >
          {content.ai.nodes[id].title}
        </button>
      ))}
    </div>
  );
}
