import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";

export function VisionSection({ content }: { content: SiteContent }) {
  const copy = content.vision;

  return (
    <section id="vision" className="py-20 md:py-32" aria-labelledby="vision-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="vision-title" index={copy.index} title={copy.title} subtitle={copy.subtitle} />
        </AnimatedReveal>
        <div className="mt-8 max-w-3xl space-y-4">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-7 text-[var(--color-text-secondary)]">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-14">
          <h3 className="text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">{copy.flowTitle}</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {copy.flow.map((step, index) => (
              <li key={step.label} className="surface relative p-5">
                <span className="text-xs tracking-[0.16em] text-[var(--color-accent)]">0{index + 1}</span>
                <p className="mt-3 text-base text-[var(--color-text-primary)]">{step.label}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.text}</p>
                {index < copy.flow.length - 1 ? <span className="absolute top-1/2 -right-3 hidden h-px w-4 bg-[var(--color-primary)] md:block" aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
