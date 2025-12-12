"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

const INITIAL_COLUMNS = {
  id: true,
  scrip: true,
  segment: true,
  userId: true,
  buyRate: true,
  sellRate: true,
  lots: true,
  profitLoss: true,
  timeDiff: true,
  boughtAt: true,
};

type ColumnKey = keyof typeof INITIAL_COLUMNS;

export default function ClosedTrades() {
  const [filter, setFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleColumn = (key: ColumnKey) => {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const data: any[] = []; // Your future DB values here

  const filtered = data.filter(
    (item) =>
      item.scrip?.toLowerCase().includes(filter.toLowerCase()) ||
      item.userId?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 text-[var(--foreground)]">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold">Closed Trades</h1>

      {/* FILTER + VIEW MENU */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <input
          placeholder="Filter..."
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-3 w-full sm:w-64 outline-none"
        />

        {/* DROPDOWN WRAPPER */}
        <div className="relative ml-auto" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 bg-[var(--card-bg)] 
            border border-[var(--card-border)] px-4 py-2 rounded-md 
            hover:bg-[var(--hover-bg)] transition"
          >
            <SlidersHorizontal size={16} /> View
          </button>

          {openMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-56 bg-[var(--card-bg)]
              border border-[var(--card-border)] rounded-md shadow-xl p-3 
              z-[9999]"
            >
              <p className="text-[var(--text-muted)] text-sm mb-2">
                Toggle Columns
              </p>

              {Object.keys(columns).map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-2 cursor-pointer py-1 text-sm hover:text-[var(--primary)]"
                >
                  <input
                    type="checkbox"
                    checked={columns[col as ColumnKey]}
                    onChange={() => toggleColumn(col as ColumnKey)}
                    className="accent-[var(--primary)]"
                  />
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 overflow-x-auto text-sm">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[var(--input-bg)] border-b text-[var(--text-muted)]">
            <tr>
              {columns.id && <th className="p-3 text-left">ID</th>}
              {columns.scrip && <th className="p-3 text-left">Scrip</th>}
              {columns.segment && <th className="p-3 text-left">Segment</th>}
              {columns.userId && <th className="p-3 text-left">User ID</th>}
              {columns.buyRate && <th className="p-3 text-left">Avg Buy Rate</th>}
              {columns.sellRate && <th className="p-3 text-left">Avg Sell Rate</th>}
              {columns.lots && <th className="p-3 text-left">Lots</th>}
              {columns.profitLoss && <th className="p-3 text-left">Profit/Loss</th>}
              {columns.timeDiff && <th className="p-3 text-left">Time Diff</th>}
              {columns.boughtAt && <th className="p-3 text-left">Bought At</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  className="text-center py-10 text-[var(--text-muted)]"
                  colSpan={Object.values(columns).filter(Boolean).length}
                >
                  No results.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 flex-wrap gap-4 text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <select className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          Rows per page
        </div>

        <div className="flex items-center gap-2">
          Page 1 of 1
          <button className="px-3 py-1 border rounded-md">{`<<`}</button>
          <button className="px-3 py-1 border rounded-md">{`<`}</button>
          <button className="px-3 py-1 bg-[var(--primary)] text-black rounded-md">
            1
          </button>
          <button className="px-3 py-1 border rounded-md">{`>`}</button>
          <button className="px-3 py-1 border rounded-md">{`>>`}</button>
        </div>
      </div>
    </div>
  );
}
