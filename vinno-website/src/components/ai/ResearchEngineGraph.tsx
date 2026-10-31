import { aiNodeOrder, type AiNodeId } from "@/config/ai";
import type { SiteContent } from "@/content/types";
import { KnowledgeGraph } from "@/components/ai/KnowledgeGraph";
import { cn } from "@/lib/utils";

const placement: Record<AiNodeId, string> = {
  literature: "left-1/2 top-[2%] -translate-x-1/2",
  graph: "top-[22%] right-[2%]",
  assistant: "right-[12%] bottom-[4%]",
  comparative: "bottom-[4%] left-[12%]",
  discovery: "top-[22%] left-[2%]",
};

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
    <>
      <div className="relative hidden h-[460px] md:block">
        <KnowledgeGraph />
        <div className="absolute top-1/2 left-1/2 w-36 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm leading-5 text-[var(--color-ai)]">{content.ai.center}</p>
        </div>
        {aiNodeOrder.map((id) => (
          <button key={id} type="button" aria-pressed={selected === id} onClick={() => onSelect(id)} className={cn("surface absolute max-w-44 px-4 py-3 text-left text-sm text-[var(--color-text-primary)]", placement[id], selected === id && "border-[var(--color-ai)]")}>
            {content.ai.nodes[id].title}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:hidden">
        {aiNodeOrder.map((id) => (
          <button key={id} type="button" aria-pressed={selected === id} onClick={() => onSelect(id)} className={cn("surface px-4 py-4 text-left text-sm text-[var(--color-text-primary)]", selected === id && "border-[var(--color-ai)]")}>
            {content.ai.nodes[id].title}
          </button>
        ))}
      </div>
    </>
  );
}
