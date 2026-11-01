import { brand } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import type { SiteContent } from "@/content/types";
import Image from "next/image";
import { visuals } from "@/lib/media";

export function FutureSection({ locale, content }: { locale: "en" | "zh"; content: SiteContent }) {
  const copy = content.future;

  return (
    <section id="future" className="relative overflow-hidden py-24 md:py-36" aria-labelledby="future-title">
      <Image src={visuals.horizon} alt={content.media.horizonAlt} fill sizes="100vw" className="pointer-events-none object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.2),rgba(7,17,31,0.82))]" />
      <Container className="relative">
        <p className="text-xs tracking-[0.22em] text-[var(--color-primary)]">{copy.index}</p>
        <h2 id="future-title" className="mt-4 max-w-4xl text-4xl leading-[1.1] font-medium tracking-[-0.035em] md:text-6xl">
          {copy.title}
        </h2>
        <div className="mt-8 max-w-2xl space-y-3">
          {copy.lines.map((line) => (
            <p key={line} className="text-lg leading-8 text-[var(--color-text-secondary)]">
              {line}
            </p>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-primary)]">{copy.closing}</p>
        <p className="mt-8 font-display text-xl tracking-[-0.03em] text-[var(--color-primary)] md:text-2xl">{brand.slogan}</p>
        {copy.slogan !== brand.slogan ? <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">{copy.slogan}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={`/${locale}/#vision`}>{copy.primary}</Button>
          <Button href={`/${locale}/#contact`} variant="secondary">
            {copy.secondary}
          </Button>
        </div>
      </Container>
    </section>
  );
}
