"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const MARKET_OPTIONS = [
  "All Markets",
  "COMEX",
  "FOREX",
  "CRYPTO",
  "US Stocks",
  "US Indices",
];

const MOCK_DATA = [
  { scrip: "ALUMIN25DECFUT", bid: "65.80", ask: "66.20", ltp: "66.00", change: "+0.35", high: "67.00", low: "64.90" },
  { scrip: "COPPER25DECFUT", bid: "721.50", ask: "722.00", ltp: "721.80", change: "-1.10", high: "726.00", low: "719.40" },
  { scrip: "CRUDEOIL25DECFUT", bid: "6210", ask: "6214", ltp: "6212", change: "+18", high: "6250", low: "6155" },
  { scrip: "GOLD26FEBFUT", bid: "61510", ask: "61520", ltp: "61515", change: "+45", high: "61780", low: "61340" },
  { scrip: "GOLDM26JANFUT", bid: "61520", ask: "61535", ltp: "61530", change: "+12", high: "61700", low: "61310" },
  { scrip: "GOLDPETAL25DECFUT", bid: "6105", ask: "6110", ltp: "6107", change: "-7", high: "6125", low: "6095" },
];

export default function MarketWatch() {
  const [exchange, setExchange] = useState("COMEX");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // CLICK OUTSIDE DROPDOWN CLOSE
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  // SEARCH FILTER
  const filteredData = MOCK_DATA.filter((item) =>
    item.scrip.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="space-y-6 p-4 md:p-6">

      <h1 className="text-2xl font-semibold">Market Watch</h1>

      {/* FILTER ROW — FULLY RESPONSIVE */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">

        {/* DROPDOWN */}
        <div className="relative w-full md:w-56" ref={dropdownRef}>
          <label className="text-sm opacity-80">Exchange</label>

          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="
              bg-[var(--card-bg)] border border-[var(--border)]
              p-2 rounded-lg mt-1 text-sm cursor-pointer
              flex items-center justify-between
            "
          >
            {exchange}
            <ChevronDown size={18} className={`${dropdownOpen ? "rotate-180" : ""} transition`} />
          </div>

          {dropdownOpen && (
            <div
              className="
                absolute left-0 right-0 top-full mt-1
                bg-[var(--card-bg)] border border-[var(--border)]
                rounded-lg shadow-xl z-[9999]
              "
            >
              {MARKET_OPTIONS.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setExchange(opt);
                    setDropdownOpen(false);
                  }}
                  className="
                    p-2 text-sm cursor-pointer hover:bg-[var(--primary)]/10
                  "
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1">
          <label className="text-sm opacity-80">Search</label>
          <input
            placeholder="Search Scrip"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full bg-[var(--card-bg)] border border-[var(--border)]
              p-3 rounded-lg text-sm mt-1
              focus:ring-[var(--primary)] focus:ring-2
            "
          />
        </div>
      </div>

      {/* TABLE WRAPPER — FIXED FOR MOBILE */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-sm overflow-x-auto">

        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-[var(--primary)]/10 text-[var(--text-muted)]">
            <tr>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Scrip</th>
              <th className="p-3 text-left">Bid</th>
              <th className="p-3 text-left">Ask</th>
              <th className="p-3 text-left">LTP</th>
              <th className="p-3 text-left">Change</th>
              <th className="p-3 text-left">High</th>
              <th className="p-3 text-left">Low</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, i) => (
              <tr
                key={i}
                className="border-t border-[var(--border)] hover:bg-[var(--primary)]/10 transition"
              >
                <td className="p-3">
                  <button className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-md text-xs">
                    Add To Ban
                  </button>
                </td>

                <td className="p-3">{row.scrip}</td>
                <td className="p-3">{row.bid}</td>
                <td className="p-3">{row.ask}</td>
                <td className="p-3">{row.ltp}</td>
                <td className="p-3">{row.change}</td>
                <td className="p-3">{row.high}</td>
                <td className="p-3">{row.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FIXED FOR MOBILE */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 text-[var(--text-muted)]">
        
        {/* ROWS PER PAGE */}
        <div className="flex items-center gap-3">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Rows per page</span>
        </div>

        {/* PAGE BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <span>Page {page} of {totalPages}</span>

          <button className="px-3 py-1 bg-[var(--card-bg)] border rounded-md">{"<<"}</button>
          <button className="px-3 py-1 bg-[var(--card-bg)] border rounded-md">{"<"}</button>

          <button className="px-3 py-1 bg-[var(--primary)] text-white rounded-md">{page}</button>

          <button className="px-3 py-1 bg-[var(--card-bg)] border rounded-md">{">"}</button>
          <button className="px-3 py-1 bg-[var(--card-bg)] border rounded-md">{">>"}</button>
        </div>
      </div>
    </div>
  );
}
