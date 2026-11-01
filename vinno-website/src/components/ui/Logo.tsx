import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Photo
      src="/images/vinno-logo.png"
      alt="维诺·恩宠"
      priority={priority}
      className={cn("h-20 w-auto", className)}
    />
  );
}
