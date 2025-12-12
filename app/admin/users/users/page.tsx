"use client";
import { useState } from "react";
import { SlidersHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// ------------------ TYPES FIX ------------------
type ColumnKey =
  | "firstName"
  | "lastName"
  | "username"
  | "ledger"
  | "grossPL"
  | "brokerage"
  | "netPL"
  | "admin"
  | "demo"
  | "status";

export default function TradingClients() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [showViewMenu, setShowViewMenu] = useState(false);

  // ------------------ COLUMNS ------------------
  const [columns, setColumns] = useState<Record<ColumnKey, boolean>>({
    firstName: true,
    lastName: true,
    username: true,
    ledger: true,
    grossPL: true,
    brokerage: true,
    netPL: true,
    admin: true,
    demo: true,
    status: true,
  });

  const toggleColumn = (key: ColumnKey) => {
    setColumns({ ...columns, [key]: !columns[key] });
  };

  const clients = [
    { id: 1, first: "Trader", last: "Sam", email: "trader@user.com", ledger: "-", gross: "-", brokerage: "₹145.187", net: "-", admin: "-", demo: "-" },
    { id: 2, first: "Trader 2", last: "Dhyan", email: "trader2@user.com", ledger: "-", gross: "-", brokerage: "₹0", net: "-", admin: "-", demo: "-" },
    { id: 3, first: "My", last: "Trader", email: "satanianket@gmail.com", ledger: "-", gross: "-", brokerage: "₹0", net: "-", admin: "-", demo: "-" },
  ];

  const filtered = clients.filter((c) =>
    c.first.toLowerCase().includes(search.toLowerCase()) ||
    c.last.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-[var(--foreground)]">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Manage Users and their accounts
      </p>

      {/* FILTER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

        {/* SEARCH */}
        <input
          placeholder="Filter clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full sm:w-64 rounded-lg bg-[var(--input-bg)] 
                     border border-[var(--input-border)] text-[var(--foreground)]
                     focus:ring-2 focus:ring-[var(--primary)]"
        />

        {/* STATUS + DEMO BUTTONS */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]
                             hover:bg-[var(--hover-bg)] flex-1 sm:flex-none">
            + Status
          </button>

          <button className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]
                             hover:bg-[var(--hover-bg)] flex-1 sm:flex-none">
            + Demo
          </button>
        </div>

        {/* ADD NEW USER */}
        <button
          onClick={() => router.push("/admin/users/users/clients")}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)]
                     text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> Add New Trading Users
        </button>

        {/* VIEW DROPDOWN */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="px-4 py-2 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]
                       border border-[var(--card-border)] flex items-center gap-2 w-full sm:w-auto"
          >
            <SlidersHorizontal size={18} /> View
          </button>

          {showViewMenu && (
            <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-56 p-3 
                            bg-[var(--card-bg)] border border-[var(--card-border)]
                            rounded-lg shadow-xl text-sm z-50">
              <p className="text-[var(--text-muted)] text-xs mb-2">Toggle columns</p>

              {[
                { key: "firstName" as ColumnKey, label: "First Name" },
                { key: "lastName" as ColumnKey, label: "Last Name" },
                { key: "username" as ColumnKey, label: "Username" },
                { key: "ledger" as ColumnKey, label: "Ledger Balance" },
                { key: "grossPL" as ColumnKey, label: "Gross P/L" },
                { key: "brokerage" as ColumnKey, label: "Brokerage" },
                { key: "netPL" as ColumnKey, label: "Net P/L" },
                { key: "admin" as ColumnKey, label: "Admin" },
                { key: "demo" as ColumnKey, label: "Demo" },
                { key: "status" as ColumnKey, label: "Status" },
              ].map((col) => (
                <label key={col.key} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={columns[col.key]}
                    onChange={() => toggleColumn(col.key)}
                    className="accent-[var(--primary)]"
                  />
                  <span className="text-[var(--foreground)]">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto rounded-xl border border-[var(--card-border)] mt-4">
        <table className="w-full min-w-[800px] text-left text-sm bg-[var(--card-bg)]">
          <thead className="bg-[var(--input-bg)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              {columns.firstName && <th className="px-4 py-3">First Name</th>}
              {columns.lastName && <th className="px-4 py-3">Last Name</th>}
              {columns.username && <th className="px-4 py-3">Username</th>}
              {columns.ledger && <th className="px-4 py-3">Ledger</th>}
              {columns.grossPL && <th className="px-4 py-3">Gross P/L</th>}
              {columns.brokerage && <th className="px-4 py-3">Brokerage</th>}
              {columns.netPL && <th className="px-4 py-3">Net P/L</th>}
              {columns.admin && <th className="px-4 py-3">Admin</th>}
              {columns.demo && <th className="px-4 py-3">Demo</th>}
              {columns.status && <th className="px-4 py-3">Status</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-[var(--card-border)] hover:bg-[var(--hover-bg)] duration-200">
                <td className="px-4 py-3">{c.id}</td>
                {columns.firstName && <td className="px-4 py-3">{c.first}</td>}
                {columns.lastName && <td className="px-4 py-3">{c.last}</td>}
                {columns.username && <td className="px-4 py-3">{c.email}</td>}
                {columns.ledger && <td className="px-4 py-3">{c.ledger}</td>}
                {columns.grossPL && <td className="px-4 py-3">{c.gross}</td>}
                {columns.brokerage && <td className="px-4 py-3">{c.brokerage}</td>}
                {columns.netPL && <td className="px-4 py-3">{c.net}</td>}
                {columns.admin && <td className="px-4 py-3">{c.admin}</td>}
                {columns.demo && <td className="px-4 py-3">{c.demo}</td>}
                {columns.status && <td className="px-4 py-3">-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-between items-center mt-4 gap-4 text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <select className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-md">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Rows per page</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Page 1 of 1</span>
          {["<<", "<", "1", ">", ">>"].map((btn) => (
            <button
              key={btn}
              className={`px-3 py-1 rounded-md border border-[var(--card-border)] ${
                btn === "1"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
