"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";

interface Column {
  key: string;
  label: string;
}

const ALL_COLUMNS: Column[] = [
  { key: "user", label: "User" },
  { key: "time", label: "Time" },
  { key: "commodity", label: "Commodity" },
  { key: "exchange", label: "Exchange" },
  { key: "trade", label: "Trade" },
  { key: "rate", label: "Rate" },
  { key: "lots", label: "Lots" },
  { key: "status", label: "Status" },
];

export default function PendingOrders() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key)
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleColumn = (key: string) =>
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );

  const data: any[] = []; // FUTURE DB DATA

  return (
    <div className="p-6 space-y-6 text-[var(--foreground)]">

      {/* TITLE + CREATE ORDER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">Pending Orders</h1>

        <Link href="/admin/modules/trades/pending-orders/create">
          <button className="flex items-center gap-2 bg-[var(--primary)] text-black px-5 py-2 rounded-md hover:opacity-90 transition font-medium">
            <Plus size={16} /> Create Pending Order
          </button>
        </Link>
      </div>

      {/* SEARCH + VIEW */}
      <div className="flex justify-between items-center flex-wrap gap-4">

        {/* SEARCH */}
        <div className="flex items-center w-full sm:w-64 bg-[var(--input-bg)] border border-[var(--input-border)] px-3 py-2 rounded-md">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input
            placeholder="Filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent ml-2 outline-none text-[var(--foreground)]"
          />
        </div>

        {/* VIEW DROPDOWN */}
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
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
              <p className="text-[var(--text-muted)] mb-2 text-sm">Toggle Columns</p>
              {ALL_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:text-[var(--primary)] transition"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-[var(--primary)]"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RESPONSIVE TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-x-auto text-sm">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[var(--input-bg)] border-b border-[var(--card-border)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              {ALL_COLUMNS.filter(c => visibleColumns.includes(c.key)).map(col => (
                <th key={col.key} className="px-4 py-3 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  className="text-center py-10 text-[var(--text-muted)]"
                >
                  No pending orders available
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center flex-wrap mt-4 gap-4 text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <select className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md text-[var(--foreground)]">
            <option>10</option><option>25</option><option>50</option>
          </select>
          Rows per page
        </div>

        <div className="flex items-center gap-2">
          Page 1 of 1
          {["<<", "<", "1", ">", ">>"].map((btn) => (
            <button
              key={btn}
              className={`px-3 py-1 border border-[var(--card-border)] rounded-md ${
                btn === "1" ? "bg-[var(--primary)] text-black" : "bg-[var(--card-bg)]"
              } hover:bg-[var(--hover-bg)]`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
