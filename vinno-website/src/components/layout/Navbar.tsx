"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { observedSections } from "@/config/navigation";
import type { SiteContent } from "@/content/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

function swapLocale(pathname: string, next: "en" | "zh") {
  if (!/^\/(en|zh)(?=\/|$)/.test(pathname)) return `/${next}/`;
  return pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${next}`);
}

export function Navbar({ locale, content }: { locale: "en" | "zh"; content: SiteContent }) {
  const pathname = usePathname() || `/${locale}`;
  const active = useActiveSection(observedSections);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const other = locale === "en" ? "zh" : "en";
  const mapped = active === "problem" ? "vision" : active === "vuls" ? "architecture" : active === "ai" || active === "network" ? "research" : active;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hrefFor = (id: string) => `/${locale}/#${id}`;

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 border-b transition-colors", scrolled || open ? "border-[var(--color-border)] bg-[rgba(7,17,31,0.86)] backdrop-blur-md" : "border-transparent bg-transparent")}>
      <div className="mx-auto flex h-28 w-full max-w-[1440px] items-center justify-between px-5 md:px-[5vw]">
        <Link href={`/${locale}/`} aria-label="维诺·恩宠 VINNO · ENCHONG">
          <Logo priority className="h-24" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {content.nav.links.map((link) => (
            <Link key={link.id} href={hrefFor(link.id)} className={cn("text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]", mapped === link.id && "text-[var(--color-text-primary)]")} aria-current={mapped === link.id ? "true" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href={hrefFor("health")} className="text-sm tracking-wide text-[var(--color-text-primary)]">
            {content.nav.health}
          </Link>
          <Link href={swapLocale(pathname, other)} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" hrefLang={other}>
            {content.nav.language}
          </Link>
          <Link href={hrefFor("contact")} className="inline-flex min-h-10 items-center rounded-[10px] bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-bg)]">
            {content.nav.contact}
          </Link>
        </div>
        <button type="button" className="inline-flex size-11 items-center justify-center text-[var(--color-text-primary)] lg:hidden" aria-expanded={open} aria-label={open ? content.nav.closeMenu : content.nav.openMenu} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-[var(--color-border)] px-5 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col">
            {content.nav.links.map((link) => (
              <Link key={link.id} href={hrefFor(link.id)} className="border-b border-[var(--color-border)] py-4 text-lg text-[var(--color-text-primary)]" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={hrefFor("health")} className="border-b border-[var(--color-border)] py-4 text-lg" onClick={() => setOpen(false)}>
              {content.nav.health}
            </Link>
            <Link href={hrefFor("contact")} className="py-4 text-lg" onClick={() => setOpen(false)}>
              {content.nav.contact}
            </Link>
            <Link href={swapLocale(pathname, other)} className="pt-2 text-sm tracking-[0.16em] text-[var(--color-primary)]" hrefLang={other} onClick={() => setOpen(false)}>
              {content.nav.language}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
