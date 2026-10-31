import { architectureMeta, type LayerId } from "@/config/architecture";
import type { SiteContent } from "@/content/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function LayerDetail({ id, content }: { id: LayerId; content: SiteContent }) {
  const layer = content.architecture.layers[id];
  const meta = architectureMeta[id];

  return (
    <article className="surface p-6 md:p-8" aria-live="polite">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-sm tracking-[0.16em] text-[var(--color-primary)]">{id}</span>
        <StatusBadge status={meta.status} locale={content.locale} />
      </div>
      <h3 className="mt-4 text-2xl tracking-[-0.03em] text-[var(--color-text-primary)] md:text-3xl">{layer.name}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{layer.subtitle}</p>
      <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)]">{layer.description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">{content.architecture.inputLabel}</h4>
          <ul className="mt-3 space-y-2">
            {layer.inputs.map((item) => (
              <li key={item} className="text-sm leading-6 text-[var(--color-text-primary)]">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.16em] text-[var(--color-primary)] uppercase">{content.architecture.outputLabel}</h4>
          <ul className="mt-3 space-y-2">
            {layer.outputs.map((item) => (
              <li key={item} className="text-sm leading-6 text-[var(--color-text-primary)]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 border-t border-[var(--color-border)] pt-5">
        <h4 className="text-xs tracking-[0.16em] text-[var(--color-text-secondary)] uppercase">{content.architecture.relationLabel}</h4>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-primary)]">{layer.relation}</p>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{layer.note}</p>
      </div>
    </article>
  );
}
