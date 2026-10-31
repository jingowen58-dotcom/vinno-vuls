import type { StatusId } from "./status";

export const domainOrder = [
  "pet-healthspan",
  "pet-omics",
  "comparative-aging",
  "human-healthspan",
  "longevity-intelligence",
] as const;

export type DomainId = (typeof domainOrder)[number];

export const defaultDomainId: DomainId = "pet-healthspan";

export const domainStatus: Record<DomainId, StatusId> = {
  "pet-healthspan": "planned",
  "pet-omics": "vision",
  "comparative-aging": "vision",
  "human-healthspan": "vision",
  "longevity-intelligence": "vision",
};
