"use client";

import { useState } from "react";
import { ResearchEngineGraph } from "@/components/ai/ResearchEngineGraph";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { aiStatus, defaultAiNodeId, type AiNodeId } from "@/config/ai";
import type { SiteContent } from "@/content/types";

export function AiResearchSection({ content }: { content: SiteContent }) {
  const [selected, setSelected] = useState<AiNodeId>(defaultAiNodeId);
  const node = content.ai.nodes[selected];

  return (
    <section id="ai" className="py-20 md:py-32" aria-labelledby="ai-title">
      <Container>
        <AnimatedReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="ai-title" index={content.ai.index} title={content.ai.title} subtitle={content.ai.subtitle} />
            <StatusBadge status={aiStatus} locale={content.locale} />
          </div>
        </AnimatedReveal>
        <p className="mt-8 max-w-3xl border-l border-[var(--color-ai)] pl-4 text-sm leading-6 text-[var(--color-text-secondary)]">{content.ai.concept}</p>
        <div className="mt-8">
          <ResearchEngineGraph selected={selected} onSelect={setSelected} content={content} />
        </div>
        <article className="surface mt-6 p-6" aria-live="polite">
          <h3 className="text-xl text-[var(--color-text-primary)]">{node.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">{node.text}</p>
        </article>
      </Container>
    </section>
  );
}
