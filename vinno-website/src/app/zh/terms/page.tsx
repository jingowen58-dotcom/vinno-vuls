import { LegalPage } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("zh", "/terms");

export default function Page() {
  return <LegalPage locale="zh" kind="terms" />;
}
