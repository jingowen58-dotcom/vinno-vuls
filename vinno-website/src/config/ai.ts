export const aiNodeOrder = ["literature", "graph", "assistant", "comparative", "discovery"] as const;

export type AiNodeId = (typeof aiNodeOrder)[number];

export const defaultAiNodeId: AiNodeId = "literature";

export const aiStatus = "vision" as const;
