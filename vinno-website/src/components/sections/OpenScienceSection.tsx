import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";

export function OpenScienceSection({ content }: { content: SiteContent }) {
  const copy = content.network;

  return (
    <section id="network" className="bg-[var(--color-bg-secondary)] py-20 md:py-32" aria-labelledby="network-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="network-title" index={copy.index} title={copy.title} subtitle={copy.subtitle} />
        </AnimatedReveal>
        <p className="mt-8 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">{copy.body}</p>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <svg viewBox="0 0 560 360" className="h-auto w-full" role="img" aria-label={copy.mapCaption}>
              <ellipse cx="280" cy="180" rx="190" ry="120" fill="none" stroke="#46C8E8" strokeOpacity="0.35" />
              <ellipse cx="280" cy="180" rx="80" ry="120" fill="none" stroke="#7A9FE8" strokeOpacity="0.28" />
              <ellipse cx="280" cy="180" rx="190" ry="42" fill="none" stroke="#67E0D1" strokeOpacity="0.25" />
              {[
                [180, 120],
                [360, 110],
                [430, 190],
                [340, 250],
                [200, 240],
                [140, 180],
                [280, 150],
              ].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <circle cx={x} cy={y} r="5" fill="#67E0D1" />
                  <circle cx={x} cy={y} r="12" fill="none" stroke="#46C8E8" strokeOpacity="0.35" />
                </g>
              ))}
              <path className="flow-line" d="M180 120 C240 140, 300 130, 360 110" fill="none" stroke="#46C8E8" />
              <path className="flow-line" d="M140 180 C200 200, 260 210, 340 250" fill="none" stroke="#7A9FE8" />
              <path className="flow-line" d="M360 110 C400 150, 430 170, 430 190" fill="none" stroke="#67E0D1" />
            </svg>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.mapCaption}</p>
          </div>
          <div>
            <h3 className="text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">{copy.participantsTitle}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {copy.participants.map((participant) => (
                <li key={participant} className="surface px-4 py-3 text-sm text-[var(--color-text-primary)]">
                  {participant}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="surface mt-12 p-6 md:p-8">
          <h3 className="text-2xl tracking-[-0.03em] text-[var(--color-text-primary)]">{copy.governanceTitle}</h3>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">{copy.governanceIntro}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.rules.map((rule) => (
              <article key={rule.title}>
                <h4 className="text-sm text-[var(--color-primary)]">{rule.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{rule.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 border-t border-[var(--color-border)] pt-6">
            <h3 className="text-sm tracking-[0.16em] text-[var(--color-accent)] uppercase">{copy.separationTitle}</h3>
            <ol className="mt-4 max-w-xl space-y-3">
              {copy.separation.map((line, index) => (
                <li key={line} className="text-sm leading-6 text-[var(--color-text-primary)]">
                  <span className="mr-2 text-[var(--color-text-secondary)]">0{index + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
