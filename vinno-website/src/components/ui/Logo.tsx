import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Photo
      src="/images/vinno-logo.jpg"
      alt="维诺·恩宠 VINNO · ENCHONG"
      priority={priority}
      className={cn("h-20 w-auto rounded-md bg-[#f7f4ee]", className)}
    />
  );
}
