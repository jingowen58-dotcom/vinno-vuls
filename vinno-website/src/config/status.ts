export const statusIds = ["implemented", "in_progress", "planned", "vision"] as const;

export type StatusId = (typeof statusIds)[number];

export const statusCatalog: Record<StatusId, { en: string; zh: string }> = {
  implemented: { en: "Implemented", zh: "已实现" },
  in_progress: { en: "In Progress", zh: "进行中" },
  planned: { en: "Planned", zh: "已规划" },
  vision: { en: "Long-term Vision", zh: "长期愿景" },
};

export function aggregateStatus(ids: StatusId[]): StatusId {
  if (ids.length === 0) return "vision";
  if (ids.every((id) => id === "implemented")) return "implemented";
  if (ids.every((id) => id === "vision")) return "vision";
  if (ids.every((id) => id === "planned")) return "planned";
  if (ids.some((id) => id === "implemented" || id === "in_progress")) return "in_progress";
  if (ids.some((id) => id === "planned")) return "planned";
  return "vision";
}
