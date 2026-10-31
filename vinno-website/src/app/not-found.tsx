import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5">
      <p className="text-xs tracking-[0.2em] text-[var(--color-primary)]">VINNO</p>
      <h1 className="mt-4 text-4xl tracking-[-0.03em]">Page not found</h1>
      <p className="mt-4 text-[var(--color-text-secondary)]">This address is not part of the VINNO site.</p>
      <div className="mt-8 flex gap-5 text-sm">
        <Link href="/en/" className="text-[var(--color-primary)] underline underline-offset-4">
          English
        </Link>
        <Link href="/zh/" className="text-[var(--color-primary)] underline underline-offset-4">
          中文
        </Link>
      </div>
    </main>
  );
}
