"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

const ALL_COLUMNS: Column[] = [
  { key: "scrip", label: "Scrip" },
  { key: "lots", label: "Lots" },
  { key: "avgBuyRate", label: "Avg buy rate" },
  { key: "avgSellRate", label: "Avg sell rate" },
  { key: "profitLoss", label: "Profit/Loss" },
  { key: "brokerage", label: "Brokerage" },
  { key: "netPL", label: "Net P/L" },
];

export default function ClosedPositions() {
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [openMenu, setOpenMenu] = useState(false);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  return (
    <div className="p-6 space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-[var(--foreground)]">
        Closed Positions
      </h1>

      {/* SEARCH + VIEW OPTIONS */}
      <div className="flex justify-between items-center flex-wrap gap-3">

        {/* FILTER */}
        <div className="flex items-center w-full sm:w-64 bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input
            placeholder="Filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none ml-2 text-[var(--foreground)]"
          />
        </div>

        
        {/* VIEW BUTTON */}
<div className="relative w-full sm:w-auto">
  <button
    onClick={() => setOpenMenu(!openMenu)}
    className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md hover:bg-[var(--hover-bg)] transition w-full sm:w-auto"
  >
    <SlidersHorizontal size={16} /> View
  </button>

  {openMenu && (
    <div className="absolute top-full left-0 sm:right-0 sm:left-auto
        mt-2 w-[90vw] sm:w-48
        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        rounded-md shadow-lg p-3 z-50">
      <p className="text-[var(--text-muted)] mb-2 text-sm">Toggle columns</p>

      {ALL_COLUMNS.map((col) => (
        <label
          key={col.key}
          className="flex items-center gap-2 cursor-pointer py-1 text-[var(--foreground)] text-sm"
        >
          <input
            type="checkbox"
            checked={visibleColumns.includes(col.key)}
            onChange={() => toggleColumn(col.key)}
            className="accent-[var(--primary)]"
          />
          {visibleColumns.includes(col.key) && (
            <Check size={14} className="text-[var(--primary)]" />
          )}
          <span>{col.label}</span>
        </label>
      ))}
    </div>
  )}
</div>

      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-[var(--input-bg)] border-b border-[var(--card-border)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>

              {ALL_COLUMNS.filter(c => visibleColumns.includes(c.key)).map((col) => (
                <th key={col.key} className="px-4 py-3 text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* EMPTY STATE */}
            <tr>
              <td
                colSpan={visibleColumns.length + 1}
                className="text-center py-10 text-[var(--text-muted)]"
              >
                No results.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 flex-wrap gap-4 text-[var(--text-muted)]">

        {/* Rows per page */}
        <div className="flex items-center gap-3">
          <select className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md text-[var(--foreground)]">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          Rows per page
        </div>

        {/* Page info + controls */}
        <div className="flex items-center gap-2">
          Page 1 of 1
          <button className="px-3 py-1 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-md hover:bg-[var(--hover-bg)]">
            {"<<"}
          </button>
          <button className="px-3 py-1 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-md hover:bg-[var(--hover-bg)]">
            {"<"}
          </button>
          <button className="px-3 py-1 bg-[var(--primary)] text-black rounded-md">
            1
          </button>
          <button className="px-3 py-1 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-md hover:bg-[var(--hover-bg)]">
            {">"}
          </button>
          <button className="px-3 py-1 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-md hover:bg-[var(--hover-bg)]">
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
