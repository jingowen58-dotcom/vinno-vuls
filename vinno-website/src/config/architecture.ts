import type { StatusId } from "./status";

export const layerOrder = ["L6", "L5", "L4", "L3", "L2", "L1"] as const;

export type LayerId = (typeof layerOrder)[number];

export const defaultLayerId: LayerId = "L2";

export const architectureMeta: Record<
  LayerId,
  { status: StatusId; upstream: LayerId | null; downstream: LayerId | null }
> = {
  L6: { status: "vision", upstream: "L5", downstream: null },
  L5: { status: "vision", upstream: "L4", downstream: "L6" },
  L4: { status: "planned", upstream: "L3", downstream: "L5" },
  L3: { status: "in_progress", upstream: "L2", downstream: "L4" },
  L2: { status: "in_progress", upstream: "L1", downstream: "L3" },
  L1: { status: "planned", upstream: null, downstream: "L2" },
};
