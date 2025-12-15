"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  Check,
  Calendar,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
}

const trades: any[] = [];

const ALL_COLUMNS: Column[] = [
  { key: "scrip", label: "Scrip" },
  { key: "segment", label: "Segment" },
  { key: "user", label: "User" },
  { key: "buyPrice", label: "Buy Price" },
  { key: "sellPrice", label: "Sell Price" },
  { key: "lots", label: "Lots/Units" },
  { key: "boughtAt", label: "Bought At" },
  { key: "soldAt", label: "Sold At" },
];

const downloadCSV = () => {
  if (trades.length === 0) return alert("No data to download");
  const headers = ["ID", "Scrip", "Segment", "User", "BuyPrice", "SellPrice", "Lots", "BoughtAt", "SoldAt"];
  const rows = trades.map((t) =>
    [t.id, t.scrip, t.segment, t.user, t.buyPrice, t.sellPrice, t.lots, t.boughtAt, t.soldAt].join(",")
  );
  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "trades.csv";
  link.click();
};

export default function TradesPage() {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMNS.map((c) => c.key));

  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setVisibleColumns((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-[var(--foreground)]">Trades</h1>

      {/* TOP CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-3">
          {[{ label: "from", value: from, setter: setFrom }, { label: "to", value: to, setter: setTo }].map(
            ({ label, value, setter }) => (
              <div key={label} className="flex items-center bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md gap-2">
                <span className="text-[var(--text-muted)]">{label}</span>
                <input type="date" value={value} onChange={(e) => setter(e.target.value)} className="bg-transparent text-[var(--foreground)] outline-none" />
                <Calendar size={16} className="text-[var(--text-muted)]" />
              </div>
            )
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={downloadCSV} className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md hover:bg-[var(--hover-bg)] transition text-[var(--foreground)]">
            <Download size={16} /> Download
          </button>

          <Link href="/admin/trades/live/create">
            <button className="flex items-center gap-2 bg-[var(--primary)] text-black px-4 py-2 rounded-md hover:opacity-90 transition font-medium">
              <Plus size={16} /> Add New Trade
            </button>
          </Link>
        </div>
      </div>

      {/* SEARCH + VIEW */}
     <div className={`flex flex-wrap justify-between items-center gap-3 ${openMenu ? "mb-10" : ""}`}>

        <div className="flex items-center w-full sm:w-64 bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input placeholder="Filter..." onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none ml-2 text-[var(--foreground)]" />
        </div>

        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
          <button onClick={() => setOpenMenu(!openMenu)} className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md hover:bg-[var(--hover-bg)] transition w-full sm:w-autoflex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-md hover:bg-[var(--hover-bg)] transition w-full sm:w-auto">
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
                <label key={col.key} className="flex items-center gap-2 text-sm cursor-pointer py-1 hover:text-[var(--primary)] transition">
                  <input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} className="accent-[var(--primary)]" />
                  {visibleColumns.includes(col.key) && <Check size={14} className="text-[var(--primary)]" />}
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-[var(--input-bg)] border-b text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              {ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key)).map((col) => (
                <th key={col.key} className="px-4 py-3 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={visibleColumns.length + 1} className="py-10 text-center text-[var(--text-muted)]">No results.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="
  flex flex-wrap justify-between items-center 
  mt-4 gap-4 text-[var(--text-muted)]
">

  {/* Rows Per Page */}
  <div className="flex items-center gap-3">
    <select
      className="
        bg-[var(--card-bg)] border border-[var(--card-border)] 
        px-3 py-2 rounded-md text-[var(--foreground)]
      "
    >
      <option>10</option>
      <option>25</option>
      <option>50</option>
    </select>
    <span>Rows per page</span>
  </div>

  {/* Pagination Buttons */}
  <div className="flex items-center gap-2 flex-wrap">

    <span>Page 1 of 1</span>

    {["<<", "<", "1", ">", ">>"].map((btn, i) => (
      <button
        key={i}
        className={`
          px-3 py-1 rounded-md border border-[var(--card-border)]
          ${
            btn === "1"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--foreground)]"
          }
        `}
      >
        {btn}
      </button>
    ))}
  </div>
</div>

    </div>
  );
}
