import { Container } from "@/components/layout/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";

export function ProblemSection({ content }: { content: SiteContent }) {
  const copy = content.problem;

  return (
    <section id="problem" className="bg-[var(--color-bg-secondary)] py-20 md:py-32" aria-labelledby="problem-title">
      <Container>
        <AnimatedReveal>
          <SectionHeading id="problem-title" index={copy.index} title={copy.title} subtitle={copy.intro} />
        </AnimatedReveal>
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div>
            <h3 className="text-sm tracking-[0.16em] text-[var(--color-text-secondary)] uppercase">{copy.issuesTitle}</h3>
            <ul className="mt-4 space-y-3">
              {copy.issues.map((issue, index) => (
                <li key={issue.title} className="surface p-5">
                  <p className="text-xs tracking-[0.14em] text-[var(--color-text-muted)]">0{index + 1}</p>
                  <h4 className="mt-2 text-lg text-[var(--color-text-primary)]">{issue.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{issue.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
            <svg width="72" height="100%" viewBox="0 0 72 640" preserveAspectRatio="none" className="h-full">
              <path className="flow-line" d="M36 16 C36 180, 36 460, 36 624" fill="none" stroke="#46C8E8" strokeWidth="1.4" />
              <circle cx="36" cy="80" r="4" fill="#67E0D1" />
              <circle cx="36" cy="320" r="4" fill="#46C8E8" />
              <circle cx="36" cy="560" r="4" fill="#7A9FE8" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">{copy.pathTitle}</h3>
            <ul className="mt-4 space-y-3">
              {copy.issues.map((issue) => (
                <li key={issue.response} className="surface border-[rgba(70,200,232,0.28)] p-5">
                  <p className="text-sm leading-6 text-[var(--color-text-primary)]">{issue.response}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.pathNote}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
