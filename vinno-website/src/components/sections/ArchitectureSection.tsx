"use client";

import { useState, type KeyboardEvent } from "react";
import { DataFlow } from "@/components/architecture/DataFlow";
import { LayerDetail } from "@/components/architecture/LayerDetail";
import { LayerStack } from "@/components/architecture/LayerStack";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { defaultLayerId, layerOrder, type LayerId } from "@/config/architecture";
import type { SiteContent } from "@/content/types";

export function ArchitectureSection({ content }: { content: SiteContent }) {
  const [selected, setSelected] = useState<LayerId>(defaultLayerId);
  const copy = content.architecture;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = layerOrder.indexOf(selected);
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(layerOrder[Math.max(0, index - 1)]);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected(layerOrder[Math.min(layerOrder.length - 1, index + 1)]);
    }
  }

  return (
    <section id="architecture" className="bg-[var(--color-bg-secondary)] py-20 md:py-32" aria-labelledby="architecture-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="architecture-title" index={copy.index} title={copy.title} subtitle={copy.subtitle} />
        </AnimatedReveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-[auto_minmax(0,0.92fr)_minmax(0,1.08fr)]" onKeyDown={onKeyDown}>
          <div className="hidden lg:block">
            <DataFlow />
          </div>
          <LayerStack selected={selected} onSelect={setSelected} content={content} />
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <LayerDetail id={selected} content={content} />
          </div>
        </div>
      </Container>
    </section>
  );
}
