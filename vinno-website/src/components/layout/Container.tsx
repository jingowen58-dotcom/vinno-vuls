import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-[5vw]", className)}>
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </div>
  );
}
