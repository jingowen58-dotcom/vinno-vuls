"use client";

import { useState } from "react";
import { engineAnchor, engineOrder, engineStatus } from "@/config/engines";
import type { SiteContent } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { engineImages } from "@/lib/media";
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
                <article key={id} id={engineAnchor[id]} className="surface group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  <Photo
                    src={engineImages[id]}
                    alt={id === "health" ? content.media.domains["pet-healthspan"] : id === "healthspan" ? content.media.domains["comparative-aging"] : content.media.worldAlt}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-6 md:p-7">
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
