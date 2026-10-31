import { brand } from "@/config/brand";
import { speciesOrder, speciesStatus } from "@/config/species";
import type { SiteContent } from "@/content/types";
import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function VulsSection({ content }: { content: SiteContent }) {
  const copy = content.vuls;

  return (
    <section id="vuls" className="py-20 md:py-32" aria-labelledby="vuls-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="vuls-title" index={copy.index} title={copy.title} subtitle={copy.subtitle} />
        </AnimatedReveal>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto h-[360px] w-full max-w-[420px]">
            <svg viewBox="0 0 420 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path className="flow-line" d="M70 70 C140 70, 160 160, 210 180" fill="none" stroke="#46C8E8" />
              <path className="flow-line" d="M350 70 C280 90, 260 150, 210 180" fill="none" stroke="#7A9FE8" />
              <path className="flow-line" d="M70 290 C130 250, 160 220, 210 180" fill="none" stroke="#67E0D1" />
              <path className="flow-line" d="M350 290 C290 250, 260 220, 210 180" fill="none" stroke="#8F86D6" strokeOpacity="0.7" />
            </svg>
            <div className="absolute top-1/2 left-1/2 w-44 -translate-x-1/2 -translate-y-1/2 surface px-4 py-5 text-center">
              <p className="font-display text-2xl tracking-[0.14em]">VULS</p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">{copy.fullName}</p>
            </div>
            {speciesOrder.map((id) => (
              <div key={id} className={position[id]}>
                <p className="text-sm text-[var(--color-text-primary)]">{copy.species[id].name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{copy.species[id].scientific}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-base leading-7 text-[var(--color-text-secondary)]">{copy.definition}</p>
            <p className="mt-4 text-base leading-7 text-[var(--color-text-primary)]">{copy.notDatabase}</p>
            <h3 className="mt-8 text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">{copy.principlesTitle}</h3>
            <ol className="mt-4 space-y-3">
              {copy.principles.map((principle, index) => (
                <li key={principle} className="flex gap-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-accent)]">0{index + 1}</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <h3 className="mt-16 text-2xl tracking-[-0.03em] text-[var(--color-text-primary)]">{copy.speciesTitle}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {speciesOrder.map((id) => (
            <article key={id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg text-[var(--color-text-primary)]">{copy.species[id].name}</h4>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{copy.species[id].scientific}</p>
                </div>
                <StatusBadge status={speciesStatus[id]} locale={content.locale} />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.species[id].summary}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-[var(--color-text-primary)]">{copy.mappingNote}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">{copy.draftNote}</p>
        <a className="mt-6 inline-flex text-sm text-[var(--color-primary)] underline decoration-[rgba(70,200,232,0.4)] underline-offset-4" href={brand.repository} rel="noreferrer">
          {copy.repository}
        </a>
      </Container>
    </section>
  );
}

const position: Record<(typeof speciesOrder)[number], string> = {
  dog: "absolute top-4 left-0 max-w-32",
  cat: "absolute top-4 right-0 max-w-32 text-right",
  other: "absolute bottom-2 left-0 max-w-36",
  human: "absolute right-0 bottom-2 max-w-36 text-right",
};
