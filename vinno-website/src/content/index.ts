import { en } from "./en";
import type { Locale, SiteContent } from "./types";
import { zh } from "./zh";

const content: Record<Locale, SiteContent> = { en, zh };

export function getContent(locale: Locale) {
  return content[locale];
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh";
}
