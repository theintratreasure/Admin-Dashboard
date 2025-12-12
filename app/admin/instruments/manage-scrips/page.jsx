"use client";

import { useMemo, useState } from "react";

const SEGMENTS = ["OPTIONS", "FUTURES", "EQ", "DERIVATIVES"];

// Format numbers (e.g. 4850 → 4,850)
function formatNumber(n) {
  return Number(n).toLocaleString();
}

// Dummy Data
const DUMMY = Array.from({ length: 80 }).map((_, i) => {
  const strike = 4850 + Math.floor(i / 2) * 50;
  const id = 15656450 + i;
  const suffix = i % 2 === 0 ? "CE" : "PE";

  return {
    id,
    scrip: `ABB25DEC${strike}${suffix}`,
    expiry: "2025-12-30",
    lotSize: 1,
    strikePrice: strike,
    enabled: false,
  };
});

export default function ManageScrips() {
  // Filters
  const [scripName, setScripName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [segment, setSegment] = useState("OPTIONS");
  const [minStrike, setMinStrike] = useState("");
  const [maxStrike, setMaxStrike] = useState("");

  // Table state
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(DUMMY);

  // Apply filters
  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (scripName && !row.scrip.toLowerCase().includes(scripName.toLowerCase()))
        return false;

      if (expiry && row.expiry !== expiry) return false;

      if (minStrike && Number(row.strikePrice) < Number(minStrike)) return false;

      if (maxStrike && Number(row.strikePrice) > Number(maxStrike)) return false;

      return true;
    });
  }, [scripName, expiry, minStrike, maxStrike, data]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Toggle row enable state
  const toggleEnable = (id) => {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const goTo = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  };

  // Reset page when filters change
  useMemo(() => setPage(1), [scripName, expiry, minStrike, maxStrike]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Scrips</h1>

      {/* FILTERS CARD */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-6 rounded-xl shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {/* Scrip Name */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Scrip Name</label>
      <input
        value={scripName}
        onChange={(e) => setScripName(e.target.value)}
        placeholder="Scrip Name"
        className="
          mt-1 w-full px-3 py-2 rounded-lg text-sm
          bg-[var(--card-bg)] border border-[var(--border)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
      />
    </div>

    {/* Expiry */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Expiry</label>
      <input
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className="
          mt-1 w-full px-3 py-2 rounded-lg text-sm
          bg-[var(--card-bg)] border border-[var(--border)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
      />
    </div>

    {/* Segment */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Segment</label>
      <select
        value={segment}
        onChange={(e) => setSegment(e.target.value)}
        className="
          mt-1 w-full px-3 py-2 rounded-lg text-sm
          bg-[var(--card-bg)] border border-[var(--border)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
      >
        {SEGMENTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    {/* Search */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Search</label>
      <div className="flex gap-2 mt-1">
        <input
          placeholder="Search"
          value={scripName}
          onChange={(e) => setScripName(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg text-sm
            bg-[var(--card-bg)] border border-[var(--border)]
            focus:ring-2 focus:ring-[var(--primary)]
          "
        />
        <button
          className="
            px-4 py-2 rounded-lg bg-[var(--primary)]
            text-white text-sm hover:opacity-90 transition
          "
        >
          Search
        </button>
      </div>
    </div>

    {/* Min Strike */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Min Strike Price</label>
      <input
        type="number"
        value={minStrike}
        onChange={(e) => setMinStrike(e.target.value)}
        placeholder="Min Strike Price"
        className="
          mt-1 w-full px-3 py-2 rounded-lg text-sm
          bg-[var(--card-bg)] border border-[var(--border)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
      />
    </div>

    {/* Max Strike */}
    <div>
      <label className="text-xs text-[var(--text-muted)]">Max Strike Price</label>
      <input
        type="number"
        value={maxStrike}
        onChange={(e) => setMaxStrike(e.target.value)}
        placeholder="Max Strike Price"
        className="
          mt-1 w-full px-3 py-2 rounded-lg text-sm
          bg-[var(--card-bg)] border border-[var(--border)]
          focus:ring-2 focus:ring-[var(--primary)]
        "
      />
    </div>

  </div>
</div>


      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[var(--table-head)]">
              <tr>
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Scrip Name</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Lot Size</th>
                <th className="p-3 text-left">Strike Price</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-[var(--border)] hover:bg-[var(--hover-bg)]"
                >
                  <td className="p-3">
                    <button
                      onClick={() => toggleEnable(row.id)}
                      className={`
                        px-3 py-1 rounded-md text-sm font-medium
                        ${
                          row.enabled
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border)]"
                        }
                      `}
                    >
                      {row.enabled ? "Enabled" : "Enable"}
                    </button>
                  </td>

                  <td className="p-3 text-[var(--text-muted)]">{row.id}</td>
                  <td className="p-3">{row.scrip}</td>
                  <td className="p-3 text-[var(--text-muted)]">{row.expiry}</td>
                  <td className="p-3">{row.lotSize}</td>
                  <td className="p-3">{formatNumber(row.strikePrice)}</td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-[var(--text-muted)]"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <select
              value={rowsPerPage}
              onChange={(e) =>
                setRowsPerPage(Number(e.target.value)) || setPage(1)
              }
              className="
                px-3 py-2 rounded-md border border-[var(--border)]
                bg-[var(--card-bg)] text-sm
              "
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="text-sm text-[var(--text-muted)]">
              Rows per page
            </span>
          </div>

          <span className="text-sm text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(1)}
              disabled={page === 1}
              className="px-2 py-1 rounded-md border border-[var(--border)]"
            >
              {"<<"}
            </button>

            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="px-2 py-1 rounded-md border border-[var(--border)]"
            >
              {"<"}
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].slice(page - 1, page + 2).map((_, i) => {
              const p = i + page;
              if (p > totalPages) return null;

              return (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`
                    px-3 py-1 rounded-md
                    ${
                      p === page
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)]"
                    }
                  `}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded-md border border-[var(--border)]"
            >
              {">"}
            </button>

            <button
              onClick={() => goTo(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded-md border border-[var(--border)]"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
