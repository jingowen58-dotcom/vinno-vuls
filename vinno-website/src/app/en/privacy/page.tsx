import { LegalPage } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("en", "/privacy");

export default function Page() {
  return <LegalPage locale="en" kind="privacy" />;
}
