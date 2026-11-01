import type { DomainId } from "@/config/research-domains";
import type { EngineId } from "@/config/engines";
import { basePath } from "@/lib/site";

export function asset(path: string) {
  return `${basePath}${path}`;
}

export const visuals = {
  hero: "/images/hero-network.jpg",
  layers: "/images/layer-stack.jpg",
  ai: "/images/ai-network.jpg",
  world: "/images/world-network.jpg",
  horizon: "/images/horizon.jpg",
} as const;

export const domainImages: Record<DomainId, string> = {
  "pet-healthspan": "/images/domain-healthspan.jpg",
  "pet-omics": "/images/domain-omics.jpg",
  "comparative-aging": "/images/domain-comparative.jpg",
  "human-healthspan": "/images/domain-human.jpg",
  "longevity-intelligence": "/images/domain-longevity.jpg",
};

export const engineImages: Record<EngineId, string> = {
  health: "/images/domain-healthspan.jpg",
  healthspan: "/images/domain-comparative.jpg",
  network: "/images/world-network.jpg",
};
