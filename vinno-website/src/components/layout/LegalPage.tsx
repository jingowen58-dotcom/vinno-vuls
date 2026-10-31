import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getContent } from "@/content";
import type { Locale } from "@/content/types";

export function LegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" }) {
  const content = getContent(locale);
  const title = kind === "privacy" ? content.legal.privacyTitle : content.legal.termsTitle;
  const paragraphs = kind === "privacy" ? content.legal.privacy : content.legal.terms;

  return (
    <>
      <a className="skip-link" href="#main">
        {content.nav.skip}
      </a>
      <Navbar locale={locale} content={content} />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 pt-32 pb-24">
        <h1 className="text-4xl tracking-[-0.03em]">{title}</h1>
        <div className="mt-8 space-y-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-7 text-[var(--color-text-secondary)]">
              {paragraph}
            </p>
          ))}
        </div>
        <Link href={`/${locale}/`} className="mt-10 inline-flex text-sm text-[var(--color-primary)] underline underline-offset-4">
          {content.legal.back}
        </Link>
      </main>
      <Footer locale={locale} content={content} />
    </>
  );
}
