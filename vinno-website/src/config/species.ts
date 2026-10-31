import type { StatusId } from "./status";

export const speciesOrder = ["dog", "cat", "other", "human"] as const;

export type SpeciesId = (typeof speciesOrder)[number];

export const speciesStatus: Record<SpeciesId, StatusId> = {
  dog: "in_progress",
  cat: "planned",
  other: "vision",
  human: "vision",
};
