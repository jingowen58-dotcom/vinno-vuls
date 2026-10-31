import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AiResearchSection } from "@/components/sections/AiResearchSection";
import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { EnginesSection } from "@/components/sections/EnginesSection";
import { FutureSection } from "@/components/sections/FutureSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { OpenScienceSection } from "@/components/sections/OpenScienceSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ResearchDomainsSection } from "@/components/sections/ResearchDomainsSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { VulsSection } from "@/components/sections/VulsSection";
import { getContent } from "@/content";
import type { Locale } from "@/content/types";
import { organizationJsonLd } from "@/lib/seo";

export function HomePage({ locale }: { locale: Locale }) {
  const content = getContent(locale);

  return (
    <>
      <a className="skip-link" href="#main">
        {content.nav.skip}
      </a>
      <Navbar locale={locale} content={content} />
      <main id="main">
        <HeroSection locale={locale} content={content} />
        <VisionSection content={content} />
        <ProblemSection content={content} />
        <EnginesSection content={content} />
        <ArchitectureSection content={content} />
        <VulsSection content={content} />
        <ResearchDomainsSection content={content} />
        <AiResearchSection content={content} />
        <OpenScienceSection content={content} />
        <RoadmapSection content={content} />
        <FutureSection locale={locale} content={content} />
      </main>
      <Footer locale={locale} content={content} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }} />
    </>
  );
}
