"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, EyeOff } from "lucide-react";



const SEGMENTS = ["COMEX", "FOREX", "CRYPTO", "US Stocks", "US Indices"];

function formatNumber(n) {
  return Number(n).toLocaleString();
}

const DUMMY = Array.from({ length: 80 }).map((_, i) => {
  const strike = 4850 + Math.floor(i / 2) * 50;
  return {
    id: 15656450 + i,
    scrip: `ABB25DEC${strike}${i % 2 === 0 ? "CE" : "PE"}`,
    expiry: "2025-12-30",
    lotSize: 1,
    strikePrice: strike,
    enabled: false,
  };
});



function SortableTH({ label, column, sort, setSort, setHiddenCols }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isSorted = sort.column === column;

  return (
    <th className="relative p-3 text-left" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-bg)] shadow-[var(--shadow-border)] text-sm"
      >
        {label}
        {isSorted ? (
          sort.order === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-32 z-50 bg-[var(--card-bg)] rounded-xl shadow-lg">
          <button
            onClick={() => {
              setSort({ column, order: "asc" });
              setOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)]"
          >
            ↑ Asc
          </button>

          <button
            onClick={() => {
              setSort({ column, order: "desc" });
              setOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)]"
          >
            ↓ Desc
          </button>

          <div className="h-px bg-[var(--hover-bg)] my-1" />

          <button
            onClick={() => {
              setHiddenCols((p) => [...p, column]);
              setOpen(false);
            }}
            className="w-full px-3 py-2 text-sm text-red-400 flex gap-2 items-center hover:bg-[var(--hover-bg)]"
          >
            <EyeOff size={14} /> Hide
          </button>
        </div>
      )}
    </th>
  );
}



export default function ManageScrips() {
  const [data, setData] = useState(DUMMY);
  const [sort, setSort] = useState({ column: "", order: "" });
  const [hiddenCols, setHiddenCols] = useState([]);


  const [scrip, setScrip] = useState("");
  const [expiry, setExpiry] = useState("");
  const [segment, setSegment] = useState("");
  const [minStrike, setMinStrike] = useState("");
  const [maxStrike, setMaxStrike] = useState("");

  const [page, setPage] = useState(1);
 const [rowsPerPage, setRowsPerPage] = useState(10);



  const filtered = useMemo(() => {
    let rows = [...data];

    if (scrip)
      rows = rows.filter((r) =>
        r.scrip.toLowerCase().includes(scrip.toLowerCase())
      );

    if (expiry) rows = rows.filter((r) => r.expiry === expiry);
    if (minStrike) rows = rows.filter((r) => r.strikePrice >= Number(minStrike));
    if (maxStrike) rows = rows.filter((r) => r.strikePrice <= Number(maxStrike));

    if (sort.column) {
      rows.sort((a, b) =>
        sort.order === "asc"
          ? a[sort.column] > b[sort.column]
            ? 1
            : -1
          : a[sort.column] < b[sort.column]
            ? 1
            : -1
      );
    }

    return rows;
  }, [data, scrip, expiry, minStrike, maxStrike, sort]);
  

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);

  const toggleEnable = (id) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Scrips</h1>


      <div className="bg-[var(--card-bg)]   border border-[var(--card-border)] p-6 rounded-xl shadow-[var(--shadow-border)]">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <input
            placeholder="Scrip Name"
            value={scrip}
            onChange={(e) => setScrip(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--input-bg)] shadow-[var(--shadow-border)]  border border-[var(--card-border)]"
          />

          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--input-bg)] shadow-[var(--shadow-border)]  border border-[var(--card-border)]"
          />

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--card-bg)] shadow-[var(--shadow-border)]  border border-[var(--card-border)]"
          >
            <option value="">All Segments</option>
            {SEGMENTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-end">
          <input
            type="number"
            placeholder="Min Strike"
            value={minStrike}
            onChange={(e) => setMinStrike(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--input-bg)] shadow-[var(--shadow-border)]  border border-[var(--card-border)]"
          />

          <input
            type="number"
            placeholder="Max Strike"
            value={maxStrike}
            onChange={(e) => setMaxStrike(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--input-bg)] shadow-[var(--shadow-border)]  border border-[var(--card-border)]"
          />

          <button
            onClick={() => setPage(1)}
            className="h-[42px] rounded-lg bg-gray-200 text-black hover:bg-gray-300  border border-[var(--card-border)]"
          >
            Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-[var(--card-bg)] rounded-xl shadow-[var(--shadow-border)] overflow-x-auto  border border-[var(--card-border)]">
        <table className="w-full min-w-[900px] text-sm ">
          <thead>
            <tr className=" border-b">
              <th className="p-3 "></th>
              {!hiddenCols.includes("id") && (
                <SortableTH label="ID" column="id" sort={sort} setSort={setSort} setHiddenCols={setHiddenCols} />
              )}
              {!hiddenCols.includes("scrip") && (
                <SortableTH label="Scrip" column="scrip" sort={sort} setSort={setSort} setHiddenCols={setHiddenCols} />
              )}
              {!hiddenCols.includes("expiry") && (
                <SortableTH label="Expiry" column="expiry" sort={sort} setSort={setSort} setHiddenCols={setHiddenCols} />
              )}
              {!hiddenCols.includes("strikePrice") && (
                <SortableTH label="Strike" column="strikePrice" sort={sort} setSort={setSort} setHiddenCols={setHiddenCols} />
              )}
            </tr>
          </thead>

          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="hover:bg-[var(--hover-bg)]  border border-[var(--card-border)]">
                <td className="p-3">
                  <button
                    onClick={() => toggleEnable(row.id)}
                    className={`px-3 py-1 rounded-md text-sm ${row.enabled
                        ? "bg-[var(--primary)] text-white"
                        : "shadow-[var(--shadow-border)] text-[var(--text-muted)]"
                      }`}
                  >
                    {row.enabled ? "Enabled" : "Enable"}
                  </button>
                </td>

                {!hiddenCols.includes("id") && <td className="p-3">{row.id}</td>}
                {!hiddenCols.includes("scrip") && <td className="p-3">{row.scrip}</td>}
                {!hiddenCols.includes("expiry") && <td className="p-3">{row.expiry}</td>}
                {!hiddenCols.includes("strikePrice") && (
                  <td className="p-3">{formatNumber(row.strikePrice)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 text-[var(--text-muted)]">


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
