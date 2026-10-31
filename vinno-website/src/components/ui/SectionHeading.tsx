export function SectionHeading({
  id,
  index,
  title,
  subtitle,
}: {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs tracking-[0.22em] text-[var(--color-primary)]">{index}</p>
      <h2 id={id} className="mt-4 text-3xl leading-[1.12] font-medium tracking-[-0.03em] text-[var(--color-text-primary)] md:text-5xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">{subtitle}</p> : null}
    </header>
  );
}
