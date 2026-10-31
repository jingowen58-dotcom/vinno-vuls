import { aggregateStatus, type StatusId } from "./status";

export const phaseOrder = ["foundation", "pet", "intelligence", "comparative", "global"] as const;

export type PhaseId = (typeof phaseOrder)[number];

export const roadmapItems = {
  "vuls-core": { phase: "foundation", status: "in_progress" },
  "pet-structure": { phase: "foundation", status: "in_progress" },
  validator: { phase: "foundation", status: "implemented" },
  "core-objects": { phase: "foundation", status: "in_progress" },
  "quality-provenance": { phase: "foundation", status: "in_progress" },
  "digital-records": { phase: "pet", status: "planned" },
  diagnostics: { phase: "pet", status: "planned" },
  "follow-up": { phase: "pet", status: "planned" },
  "healthspan-database": { phase: "pet", status: "planned" },
  "record-permission": { phase: "pet", status: "in_progress" },
  literature: { phase: "intelligence", status: "vision" },
  "knowledge-graph": { phase: "intelligence", status: "vision" },
  "research-assistant": { phase: "intelligence", status: "vision" },
  "multi-source": { phase: "intelligence", status: "vision" },
  "evidence-tracking": { phase: "intelligence", status: "vision" },
  "animal-aging-db": { phase: "comparative", status: "vision" },
  "species-profiles": { phase: "comparative", status: "vision" },
  "cross-species": { phase: "comparative", status: "vision" },
  "comparative-support": { phase: "comparative", status: "vision" },
  "multi-institution": { phase: "global", status: "vision" },
  "open-standards": { phase: "global", status: "vision" },
  sharing: { phase: "global", status: "vision" },
  "global-network": { phase: "global", status: "vision" },
} as const satisfies Record<string, { phase: PhaseId; status: StatusId }>;

export type RoadmapItemId = keyof typeof roadmapItems;

export function itemsForPhase(phase: PhaseId) {
  return (Object.entries(roadmapItems) as [RoadmapItemId, (typeof roadmapItems)[RoadmapItemId]][]).filter(
    ([, item]) => item.phase === phase,
  );
}

export function phaseStatus(phase: PhaseId): StatusId {
  return aggregateStatus(itemsForPhase(phase).map(([, item]) => item.status));
}
