"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { itemsForPhase, phaseOrder, phaseStatus, type PhaseId } from "@/config/roadmap";
import type { SiteContent } from "@/content/types";
import { cn } from "@/lib/utils";

export function RoadmapSection({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState<PhaseId>("foundation");

  return (
    <section id="roadmap" className="py-20 md:py-32" aria-labelledby="roadmap-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="roadmap-title" index={content.roadmap.index} title={content.roadmap.title} subtitle={content.roadmap.subtitle} />
        </AnimatedReveal>
        <ol className="mt-10 hidden gap-3 md:grid md:grid-cols-5">
          {phaseOrder.map((phaseId, index) => (
            <li key={phaseId}>
              <button type="button" onClick={() => setOpen(phaseId)} className={cn("h-full w-full border-t-2 pt-4 text-left", open === phaseId ? "border-[var(--color-primary)]" : "border-[var(--color-border)]")}>
                <span className="text-xs tracking-[0.16em] text-[var(--color-primary)]">0{index + 1}</span>
                <span className="mt-2 block text-sm text-[var(--color-text-primary)]">{content.roadmap.phases[phaseId].title}</span>
              </button>
            </li>
          ))}
        </ol>
        <ol className="relative mt-8 space-y-4 border-l border-[var(--color-border)] pl-6">
          {phaseOrder.map((phaseId, index) => {
            const phase = content.roadmap.phases[phaseId];
            const expanded = open === phaseId;
            return (
              <li key={phaseId}>
                <button type="button" aria-expanded={expanded} onClick={() => setOpen(phaseId)} className={cn("surface w-full p-5 text-left md:p-6", expanded && "border-[rgba(70,200,232,0.4)]")}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs tracking-[0.16em] text-[var(--color-primary)]">0{index + 1}</p>
                    <StatusBadge status={phaseStatus(phaseId)} locale={content.locale} />
                  </div>
                  <h3 className="mt-3 text-2xl tracking-[-0.03em] text-[var(--color-text-primary)]">{phase.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{phase.summary}</p>
                </button>
                {expanded ? (
                  <ul className="mt-3 space-y-3">
                    {itemsForPhase(phaseId).map(([itemId, item]) => (
                      <li key={itemId} className="surface ml-2 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="text-base text-[var(--color-text-primary)]">{content.roadmap.items[itemId].title}</h4>
                          <StatusBadge status={item.status} locale={content.locale} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{content.roadmap.items[itemId].detail}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
