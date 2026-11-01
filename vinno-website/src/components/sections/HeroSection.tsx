"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import type { SiteContent } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroSection({ locale, content }: { locale: "en" | "zh"; content: SiteContent }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 28]);
  const copy = content.hero;

  return (
    <section className="hero-wash relative overflow-hidden pt-28 md:pt-32" aria-labelledby="hero-title">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative">
        <div className="grid items-center gap-8 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="max-w-2xl py-8 lg:py-16">
            <p className="text-xs tracking-[0.22em] text-[var(--color-primary)]">{copy.eyebrow}</p>
            <h1 id="hero-title" className="mt-5 text-[2.35rem] leading-[1.08] font-medium tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[4.15rem]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">{copy.subtitle}</p>
            <p className="mt-6 max-w-xl border-l border-[var(--color-primary)] pl-4 text-sm leading-6 text-[var(--color-text-secondary)]">{copy.today}</p>
            <p className="mt-6 font-display text-lg tracking-[-0.03em] text-[var(--color-text-primary)] md:text-xl">{copy.aside}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`/${locale}/#vision`}>{copy.primary}</Button>
              <Button href={`/${locale}/#architecture`} variant="secondary">
                {copy.secondary}
              </Button>
            </div>
          </div>
          <motion.div style={{ y }}>
            <HeroVisual label={copy.visualLabel} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
