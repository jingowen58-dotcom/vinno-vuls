"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { SiteContent } from "@/content/types";
import { visuals } from "@/lib/media";

export function HeroSection({ locale, content }: { locale: "en" | "zh"; content: SiteContent }) {
  const copy = content.hero;

  return (
    <section className="relative overflow-hidden pt-28 md:pt-32" aria-labelledby="hero-title">
      <Photo src={visuals.hero} alt={content.media.heroAlt} priority className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.55),rgba(7,17,31,0.9))] md:bg-[linear-gradient(90deg,#07111f_0%,rgba(7,17,31,0.9)_46%,rgba(7,17,31,0.25)_100%)]" />
      <Container className="relative">
        <div className="grid items-end gap-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl py-10 lg:py-20">
            <p className="text-xs tracking-[0.22em] text-[var(--color-primary)]">{copy.eyebrow}</p>
            <h1 id="hero-title" className="mt-5 text-[2.35rem] leading-[1.08] font-medium tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[4.15rem]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">{copy.subtitle}</p>
            <p className="mt-6 max-w-xl border-l border-[var(--color-primary)] pl-4 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.today}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`/${locale}/#vision`}>{copy.primary}</Button>
              <Button href={`/${locale}/#architecture`} variant="secondary">
                {copy.secondary}
              </Button>
            </div>
          </div>
          <p className="pb-10 text-right font-display text-xl leading-snug tracking-[-0.03em] text-[var(--color-text-primary)] md:text-2xl lg:pb-20">
            {copy.aside}
          </p>
        </div>
      </Container>
    </section>
  );
}
