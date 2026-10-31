import { domainStatus, type DomainId } from "@/config/research-domains";
import type { SiteContent } from "@/content/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function DomainCard({ id, content }: { id: DomainId; content: SiteContent }) {
  const domain = content.research.domains[id];

  return (
    <article className="surface p-6 md:p-8" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-secondary)]">{domain.subtitle}</p>
        <StatusBadge status={domainStatus[id]} locale={content.locale} />
      </div>
      <h3 className="mt-3 text-2xl tracking-[-0.03em] text-[var(--color-text-primary)]">{domain.title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {domain.keywords.map((keyword) => (
          <li key={keyword} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)]">
            {keyword}
          </li>
        ))}
      </ul>
      <dl className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <dt className="text-xs tracking-[0.16em] text-[var(--color-primary)] uppercase">{content.research.direction}</dt>
          <dd className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{domain.direction}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.16em] text-[var(--color-primary)] uppercase">{content.research.database}</dt>
          <dd className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{domain.databasePlan}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">{content.research.dataTypes}</dt>
          <dd>
            <ul className="mt-2 space-y-1">
              {domain.dataTypes.map((item) => (
                <li key={item} className="text-sm leading-6 text-[var(--color-text-primary)]">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">{content.research.questions}</dt>
          <dd>
            <ul className="mt-2 space-y-1">
              {domain.questions.map((item) => (
                <li key={item} className="text-sm leading-6 text-[var(--color-text-primary)]">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <p className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm leading-6 text-[var(--color-text-secondary)]">
        <span className="text-[var(--color-text-primary)]">{content.research.state}. </span>
        {domain.state}
      </p>
    </article>
  );
}
