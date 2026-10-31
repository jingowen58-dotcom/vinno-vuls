"use client";

import { useState } from "react";
import { engineAnchor, engineOrder, engineStatus } from "@/config/engines";
import type { SiteContent } from "@/content/types";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function EnginesSection({ content }: { content: SiteContent }) {
  const copy = content.engines;
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="engines" className="py-20 md:py-32" aria-labelledby="engines-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="engines-title" index={copy.index} title={copy.title} subtitle={copy.subtitle} />
        </AnimatedReveal>
        <div className="relative mt-12">
          <svg className="pointer-events-none absolute top-16 right-[16%] left-[16%] hidden h-px w-auto lg:block" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
            <line className="flow-line" x1="0" y1="1" x2="100" y2="1" stroke="#46C8E8" strokeWidth="2" />
          </svg>
          <div className="grid gap-5 lg:grid-cols-3">
            {engineOrder.map((id) => {
              const card = copy.cards[id];
              const expanded = open === id;
              return (
                <article key={id} id={engineAnchor[id]} className="surface group relative flex flex-col overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7">
                  <svg className="pointer-events-none absolute -top-6 -right-6 opacity-40 transition-opacity duration-300 group-hover:opacity-80" width="180" height="140" viewBox="0 0 180 140" aria-hidden="true">
                    <circle cx="120" cy="36" r="28" fill="none" stroke="#46C8E8" strokeOpacity="0.45" />
                    <circle cx="78" cy="78" r="6" fill="#67E0D1" />
                    <circle cx="132" cy="86" r="4" fill="#7A9FE8" />
                    <path d="M78 78 L120 36 L132 86" fill="none" stroke="#46C8E8" strokeOpacity="0.5" />
                  </svg>
                  <div className="relative flex items-start justify-between gap-3">
                    <p className="text-xs tracking-[0.16em] text-[var(--color-primary)] uppercase">{card.position}</p>
                    <StatusBadge status={engineStatus[id]} locale={content.locale} />
                  </div>
                  <h3 className="relative mt-5 text-2xl tracking-[-0.03em] text-[var(--color-text-primary)]">{card.name}</h3>
                  <p className="relative mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">{card.summary}</p>
                  <p className="relative mt-6 text-xs tracking-[0.16em] text-[var(--color-text-muted)] uppercase">{copy.scope}</p>
                  <ul className="relative mt-3 space-y-2">
                    {card.points.map((point) => (
                      <li key={point} className="text-sm text-[var(--color-text-primary)]">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-6">
                    <Button variant="secondary" expanded={expanded} controls={`${id}-more`} onClick={() => setOpen(expanded ? null : id)}>
                      {card.action}
                    </Button>
                    {expanded ? (
                      <p id={`${id}-more`} className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {card.more}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <p className="mt-8 max-w-3xl border-l border-[var(--color-accent)] pl-4 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.governance}</p>
      </Container>
    </section>
  );
}
