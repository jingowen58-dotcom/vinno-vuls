import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { visuals } from "@/lib/media";

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
          <figure>
            <Photo src={visuals.world} alt={content.media.worldAlt} className="aspect-video h-auto w-full rounded-[20px] border border-[var(--color-border)] object-cover" />
            <figcaption className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.mapCaption}</figcaption>
          </figure>
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
