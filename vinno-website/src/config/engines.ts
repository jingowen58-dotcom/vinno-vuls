import type { StatusId } from "./status";

export const engineOrder = ["health", "healthspan", "network"] as const;

export type EngineId = (typeof engineOrder)[number];

export const engineStatus: Record<EngineId, StatusId> = {
  health: "planned",
  healthspan: "planned",
  network: "vision",
};

export const engineAnchor: Record<EngineId, string> = {
  health: "health",
  healthspan: "healthspan",
  network: "engine-network",
};
