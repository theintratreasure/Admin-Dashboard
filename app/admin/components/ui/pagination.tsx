"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      {/* LEFT */}
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="rounded-lg px-3 py-2 text-sm"
        style={{
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)",
        }}
      >
        {[10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n} Rows
          </option>
        ))}
      </select>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-muted)]">
          Page {page} of {totalPages}
        </span>

        <PageBtn disabled={page === 1} onClick={() => onPageChange(1)}>
          ≪
        </PageBtn>
        <PageBtn disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          ‹
        </PageBtn>

        <div
          className="px-3 py-2 rounded-lg font-semibold"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          {page}
        </div>

        <PageBtn
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </PageBtn>
        <PageBtn
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          ≫
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-3 py-2 rounded-lg"
      style={{
        background: "var(--input-bg)",
        border: "1px solid var(--input-border)",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}
