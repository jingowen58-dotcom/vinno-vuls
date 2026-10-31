import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  expanded?: boolean;
  controls?: string;
};

const variants = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[#8fdef2]",
  secondary:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:border-[var(--color-primary)]",
};

export function Button({ children, href, onClick, variant = "primary", className, expanded, controls }: ButtonProps) {
  const classNames = cn(
    "inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 text-sm font-medium tracking-wide transition-colors",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classNames} onClick={onClick} aria-expanded={expanded} aria-controls={controls}>
      {children}
    </button>
  );
}
