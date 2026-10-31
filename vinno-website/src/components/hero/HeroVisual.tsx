"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroFallback } from "@/components/hero/HeroFallback";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene").then((module) => module.HeroScene), {
  ssr: false,
  loading: () => <HeroFallback />,
});

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual({ label }: { label: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const saveData = "connection" in navigator && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
      setEnhanced(!narrow.matches && !reduced.matches && !saveData && canUseWebGL());
    };
    update();
    narrow.addEventListener("change", update);
    reduced.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      narrow.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const element = frame.current;
    if (!element || !enhanced) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enhanced]);

  return (
    <div ref={frame} className="relative h-[280px] w-full sm:h-[420px] lg:h-[560px]" role="img" aria-label={label}>
      {enhanced ? <HeroScene frameloop={visible ? "always" : "never"} /> : <HeroFallback />}
    </div>
  );
}
