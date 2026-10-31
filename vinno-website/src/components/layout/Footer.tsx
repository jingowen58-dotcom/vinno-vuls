import Link from "next/link";
import { brand } from "@/config/brand";
import { engineOrder } from "@/config/engines";
import { footerExplore } from "@/config/navigation";
import type { SiteContent } from "@/content/types";
import { Logo } from "@/components/ui/Logo";

export function Footer({ locale, content }: { locale: "en" | "zh"; content: SiteContent }) {
  const hrefFor = (id: string) => `/${locale}/#${id}`;

  return (
    <footer id="contact" className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 md:px-[5vw] lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-6 text-[var(--color-text-secondary)]">{content.footer.statement}</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-xs tracking-[0.18em] text-[var(--color-primary)] uppercase">{content.footer.explore}</h2>
            <ul className="mt-4 space-y-3">
              {footerExplore.map((item) => {
                const label = content.nav.links.find((link) => link.id === item.id)?.label ?? item.id;
                return (
                  <li key={item.id}>
                    <Link href={hrefFor(item.href)} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="text-xs tracking-[0.18em] text-[var(--color-primary)] uppercase">{content.footer.business}</h2>
            <ul className="mt-4 space-y-3">
              {engineOrder.map((id) => (
                <li key={id}>
                  <Link href={hrefFor(id === "network" ? "network" : id === "healthspan" ? "healthspan" : "health")} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                    {content.footer.engines[id]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.18em] text-[var(--color-primary)] uppercase">{content.footer.contact}</h2>
          <ul className="mt-4 space-y-4">
            {content.footer.inquiries.map((item) => (
              <li key={item.title}>
                <p className="text-sm text-[var(--color-text-primary)]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-[var(--color-text-secondary)]">{content.footer.emailMissing}</p>
          {brand.email ? <a className="mt-3 inline-block text-sm text-[var(--color-primary)]" href={`mailto:${brand.email}`}>{brand.email}</a> : null}
          <a className="mt-4 inline-flex text-sm text-[var(--color-primary)] underline decoration-[rgba(70,200,232,0.4)] underline-offset-4" href={brand.repository} rel="noreferrer">
            {content.footer.repository}
          </a>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-6 text-sm text-[var(--color-text-secondary)] md:flex-row md:items-center md:justify-between md:px-[5vw]">
          <p>{content.footer.rights}</p>
          <p className="flex gap-4">
            <Link href={`/${locale}/privacy/`} className="hover:text-[var(--color-text-primary)]">
              {content.footer.privacy}
            </Link>
            <Link href={`/${locale}/terms/`} className="hover:text-[var(--color-text-primary)]">
              {content.footer.terms}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
