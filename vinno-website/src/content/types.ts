import type { AiNodeId } from "@/config/ai";
import type { LayerId } from "@/config/architecture";
import type { EngineId } from "@/config/engines";
import type { DomainId } from "@/config/research-domains";
import type { PhaseId, RoadmapItemId } from "@/config/roadmap";
import type { SpeciesId } from "@/config/species";

export type Locale = "en" | "zh";

export type SiteContent = {
  locale: Locale;
  meta: { title: string; description: string; ogLocale: string };
  nav: {
    links: { id: string; label: string }[];
    health: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    skip: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
    today: string;
    visualLabel: string;
  };
  vision: {
    index: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    flowTitle: string;
    flow: { label: string; text: string }[];
  };
  problem: {
    index: string;
    title: string;
    intro: string;
    issuesTitle: string;
    pathTitle: string;
    pathNote: string;
    issues: { title: string; text: string; response: string }[];
  };
  engines: {
    index: string;
    title: string;
    subtitle: string;
    scope: string;
    governance: string;
    cards: Record<EngineId, { name: string; position: string; summary: string; points: string[]; action: string; more: string }>;
  };
  architecture: {
    index: string;
    title: string;
    subtitle: string;
    inputLabel: string;
    outputLabel: string;
    relationLabel: string;
    selectLabel: string;
    layers: Record<LayerId, { name: string; subtitle: string; description: string; inputs: string[]; outputs: string[]; relation: string; note: string }>;
  };
  vuls: {
    index: string;
    title: string;
    subtitle: string;
    fullName: string;
    definition: string;
    notDatabase: string;
    principlesTitle: string;
    principles: string[];
    speciesTitle: string;
    mappingNote: string;
    draftNote: string;
    repository: string;
    species: Record<SpeciesId, { name: string; scientific: string; summary: string }>;
  };
  research: {
    index: string;
    title: string;
    subtitle: string;
    direction: string;
    dataTypes: string;
    questions: string;
    database: string;
    state: string;
    domains: Record<DomainId, { title: string; subtitle: string; summary: string; keywords: string[]; direction: string; dataTypes: string[]; questions: string[]; databasePlan: string; state: string }>;
  };
  ai: {
    index: string;
    title: string;
    subtitle: string;
    concept: string;
    center: string;
    nodes: Record<AiNodeId, { title: string; text: string }>;
  };
  network: {
    index: string;
    title: string;
    subtitle: string;
    body: string;
    mapCaption: string;
    participantsTitle: string;
    participants: string[];
    governanceTitle: string;
    governanceIntro: string;
    rules: { title: string; text: string }[];
    separationTitle: string;
    separation: string[];
  };
  roadmap: {
    index: string;
    title: string;
    subtitle: string;
    phases: Record<PhaseId, { title: string; summary: string }>;
    items: Record<RoadmapItemId, { title: string; detail: string }>;
  };
  future: {
    index: string;
    title: string;
    lines: string[];
    closing: string;
    slogan: string;
    primary: string;
    secondary: string;
  };
  footer: {
    statement: string;
    explore: string;
    business: string;
    contact: string;
    emailMissing: string;
    repository: string;
    rights: string;
    privacy: string;
    terms: string;
    inquiries: { title: string; text: string }[];
    engines: Record<EngineId, string>;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    privacy: string[];
    terms: string[];
    back: string;
  };
};
