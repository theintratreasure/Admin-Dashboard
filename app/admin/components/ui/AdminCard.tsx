"use client";

export default function AdminCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        relative overflow-hidden rounded-3xl
        border border-[var(--card-border)]
        bg-[var(--card-bg)]
        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
      "
    >
      {/* top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--primary)]/40 via-[var(--primary)] to-[var(--primary)]/40" />

      <header className="border-b border-[var(--card-border)] px-6 py-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
          Verification
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          {title}
        </h1>
      </header>

      <div className="p-6">{children}</div>
    </section>
  );
}
