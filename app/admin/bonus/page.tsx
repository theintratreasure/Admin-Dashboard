import { DollarSign } from "lucide-react";

export default function BonusPage() {
  return (
    <div className="container-pad space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Bonus
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Under development. Update as soon as possible.
        </p>
      </div>

      <div className="card-elevated flex flex-col items-center justify-center text-center min-h-[320px]">
        <span className="rounded-2xl border border-[var(--card-border)] bg-[var(--hover-bg)] p-3 text-[var(--primary)]">
          <DollarSign size={26} />
        </span>
        <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
          Under development
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Update as soon as possible.
        </p>
      </div>
    </div>
  );
}

