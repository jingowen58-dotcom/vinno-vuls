"use client";

import { useState } from "react";
import { DomainCard } from "@/components/research/DomainCard";
import { ResearchGalaxy } from "@/components/research/ResearchGalaxy";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { defaultDomainId, type DomainId } from "@/config/research-domains";
import type { SiteContent } from "@/content/types";

export function ResearchDomainsSection({ content }: { content: SiteContent }) {
  const [selected, setSelected] = useState<DomainId>(defaultDomainId);

  return (
    <section id="research" className="bg-[var(--color-bg-secondary)] py-20 md:py-32" aria-labelledby="research-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="research-title" index={content.research.index} title={content.research.title} subtitle={content.research.subtitle} />
        </AnimatedReveal>
        <div className="mt-10">
          <ResearchGalaxy selected={selected} onSelect={setSelected} content={content} />
        </div>
        <div className="mt-6">
          <DomainCard id={selected} content={content} />
        </div>
      </Container>
    </section>
  );
}
