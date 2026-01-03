"use client";

import { useState } from "react";
import { SlidersHorizontal, Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";

// ------------------ Types ------------------
type ColumnKey =
  | "id"
  | "name"
  | "amount"
  | "type"
  | "notes"
  | "mode"
  | "created";

interface FundType {
  id: number;
  name: string;
  amount: string;
  type: "Added" | "Deducted";
  notes: string;
  mode: "ONLINE" | "OFFLINE";
  created: string;
}

// ------------------ Dummy Data ------------------
const initialFunds: FundType[] = [
  {
    id: 1,
    name: "Elon musk",
    amount: "$10,000",
    type: "Added",
    notes: "Approved",
    mode: "ONLINE",
    created: "2025-12-09T07:39:17.430Z",
  },
  {
    id: 2,
    name: "Kashiram shivaji",
    amount: "$777",
    type: "Deducted",
    notes: "xzcfxx",
    mode: "OFFLINE",
    created: "2025-12-03T19:46:17.350Z",
  },
  {
    id: 3,
    name: "Kashiram shivaji",
    amount: "$888",
    type: "Added",
    notes: "dsaf",
    mode: "OFFLINE",
    created: "2025-12-03T19:45:35.173Z",
  },
];

export default function TraderFunds() {
  const router = useRouter();

  const [funds, setFunds] = useState<FundType[]>(initialFunds);
  const [searchUser, setSearchUser] = useState("");
  const [showViewMenu, setShowViewMenu] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState<Record<ColumnKey, boolean>>({
    id: true,
    name: true,
    amount: true,
    type: true,
    notes: true,
    mode: true,
    created: true,
  });

  // ------------------ FIX: Typed toggleColumn ------------------
  const toggleColumn = (key: ColumnKey) => {
    setColumns({ ...columns, [key]: !columns[key] });
  };

  // Search filter
  const filteredFunds = funds.filter((f) =>
    f.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  // ------------------ CSV DOWNLOAD ------------------
  const downloadCSV = () => {
    const header = ["ID", "Name", "Amount", "Txn Type", "Notes", "Txn Mode", "Created At"];

    const rows = funds.map((f) => [
      f.id,
      f.name,
      f.amount,
      f.type,
      f.notes,
      f.mode,
      f.created,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Trader_Funds.csv";
    link.click();
  };

  return (
    <div className="p-6 text-[var(--foreground)]">

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">

        <input
          type="text"
          placeholder="from   mm/dd/yyyy"
          className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]"
        />

        <input
          type="text"
          placeholder="to   mm/dd/yyyy"
          className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]"
        />

        {/* Download CSV */}
        <button
          onClick={downloadCSV}
          className="ml-auto px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg flex items-center gap-2"
        >
          <Download size={18} /> Download
        </button>

        {/* Add Trader Fund */}
        <button
          onClick={() => router.push("/admin/users/users-funds/create")}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Trader Fund
        </button>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mt-6">User Funds</h2>

      {/* Search + View */}
      <div className="flex flex-wrap justify-between mt-4 items-center">

        <input
          type="text"
          placeholder="Filter by User Name..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="px-4 py-2 w-72 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)]"
        />

        {/* VIEW DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg flex items-center gap-2"
          >
            <SlidersHorizontal size={18} /> View
          </button>

          {showViewMenu && (
            <div className="absolute right-0 mt-2 w-48 p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl z-50">
              {(
                Object.keys(columns) as ColumnKey[]
              ).map((key) => (
                <label key={key} className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={columns[key]}
                    onChange={() => toggleColumn(key)}
                    className="accent-[var(--primary)]"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto border border-[var(--card-border)] rounded-xl">
        <table className="min-w-max w-full bg-[var(--card-bg)] text-left text-sm">
          <thead>
            <tr className="text-[var(--text-muted)]">

              {columns.id && <th className="px-4 py-3">ID</th>}
              {columns.name && <th className="px-4 py-3">Name</th>}
              {columns.amount && <th className="px-4 py-3">Amount</th>}
              {columns.type && <th className="px-4 py-3">Txn Type</th>}
              {columns.notes && <th className="px-4 py-3">Notes</th>}
              {columns.mode && <th className="px-4 py-3">Txn Mode</th>}
              {columns.created && <th className="px-4 py-3">Created At</th>}

            </tr>
          </thead>

          <tbody>
            {filteredFunds.map((item) => (
              <tr key={item.id} className="border-t border-[var(--card-border)] hover:bg-[var(--hover-bg)]">

                {columns.id && <td className="px-4 py-3">{item.id}</td>}
                {columns.name && <td className="px-4 py-3">{item.name}</td>}
                {columns.amount && <td className="px-4 py-3">{item.amount}</td>}

                {columns.type && (
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs ${
                        item.type === "Added"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                )}

                {columns.notes && <td className="px-4 py-3">{item.notes}</td>}
                {columns.mode && <td className="px-4 py-3">{item.mode}</td>}
                {columns.created && <td className="px-4 py-3">{item.created}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-[var(--text-muted)] flex-wrap gap-3">
        <span>Page 1 of 1</span>

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md bg-[var(--card-bg)]">{"<<"}</button>
          <button className="px-3 py-1 border rounded-md bg-[var(--card-bg)]">{"<"}</button>
          <button className="px-3 py-1 bg-[var(--primary)] text-white rounded-md">1</button>
          <button className="px-3 py-1 border rounded-md bg-[var(--card-bg)]">{">"}</button>
          <button className="px-3 py-1 border rounded-md bg-[var(--card-bg)]">{">>"}</button>
        </div>
      </div>
    </div>
  );
}
