export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-clay uppercase">{eyebrow}</p>
      <h1 className="mt-2 font-display text-2xl leading-tight font-semibold sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}
