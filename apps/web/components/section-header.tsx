export function SectionHeader({
  label,
  title,
  lede,
}: {
  label?: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl sm:mb-14">
      {label && (
        <p className="font-[family-name:var(--font-mono)] text-xs text-accent">
          {label}
        </p>
      )}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.03em] text-fg sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
          {lede}
        </p>
      )}
    </div>
  );
}
