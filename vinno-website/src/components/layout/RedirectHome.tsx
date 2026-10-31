"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/en/");
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <Link href="/en/" className="font-display text-sm tracking-[0.22em] text-[var(--color-primary)]">
        VINNO
      </Link>
    </main>
  );
}
