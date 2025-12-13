"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal, X } from "lucide-react";

// ---------------------- TYPES ----------------------
type ColumnKey = "name" | "username" | "amount" | "datetime" | "status";

interface WithdrawalType {
  id: number;
  name: string;
  email: string;
  amount: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// ---------------------- MAIN PAGE ----------------------
export default function WithdrawalRequests() {
  const [search, setSearch] = useState("");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([
    { id: 1, name: "Elon musk", email: "elon@gmail.com", amount: "₹6,000", date: "10/12/2025, 18:34:03", status: "PENDING" },
    { id: 2, name: "Kashiram shivaji", email: "kashiram@test.com", amount: "₹777", date: "04/12/2025, 01:16:17", status: "APPROVED" },
    { id: 3, name: "Trader Sam", email: "trader@user.com", amount: "₹1,200", date: "29/11/2025, 11:21:21", status: "APPROVED" },
    { id: 4, name: "Trader Sam", email: "trader@user.com", amount: "₹100", date: "28/11/2025, 12:18:02", status: "APPROVED" },
  ]);

  // Column visibility
  const [columns, setColumns] = useState({
    name: true,
    username: true,
    amount: true,
    datetime: true,
    status: true,
  });

  // FIXED TYPE-SAFE TOGGLE FUNCTION
  const toggleColumn = (key: ColumnKey) => {
    setColumns({ ...columns, [key]: !columns[key] });
  };

  // FILTER
  const filtered = withdrawals.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  // ACTION BUTTONS
  const acceptRequest = (id: number) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === id ? { ...w, status: "APPROVED" } : w
    ));
  };

  const rejectRequest = (id: number) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === id ? { ...w, status: "REJECTED" } : w
    ));
  };

  const removeRequest = (id: number) => {
    setWithdrawals(withdrawals.filter(w => w.id !== id));
  };

  return (
    <div className="p-8 text-[var(--foreground)]">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold text-[var(--text)]">Withdrawal Requests</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add New WITHDRAWAL
        </button>
      </div>

      {/* SEARCH + VIEW */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4 relative w-full">

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full sm:w-72 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)]"
        />

        {/* VIEW DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="px-4 py-2 bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]
                       border border-[var(--card-border)] rounded-lg flex items-center gap-2"
          >
            <SlidersHorizontal size={18} /> View
          </button>

          {showViewMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)]
                            border border-[var(--card-border)] rounded-lg shadow-lg p-3 text-sm z-50">
              <p className="text-[var(--text-muted)] text-xs mb-2">Toggle columns</p>

              {[
                { key: "name", label: "Name" },
                { key: "username", label: "Username" },
                { key: "amount", label: "Amount" },
                { key: "datetime", label: "DateTime" },
                { key: "status", label: "Status" },
              ].map((col) => (
                <label key={col.key} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={columns[col.key as ColumnKey]}
                    onChange={() => toggleColumn(col.key as ColumnKey)}
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
      <div className="w-full overflow-x-auto rounded-xl border border-[var(--card-border)]">
        <table className="min-w-max w-full text-left text-sm bg-[var(--card-bg)]">
          <thead className="bg-[var(--card-bg)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">ID</th>
              {columns.name && <th className="px-4 py-3">Name</th>}
              {columns.username && <th className="px-4 py-3">Username</th>}
              {columns.amount && <th className="px-4 py-3">Amount</th>}
              {columns.datetime && <th className="px-4 py-3">Date & Time</th>}
              {columns.status && <th className="px-4 py-3">Status</th>}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} className="border-t border-[var(--card-border)] hover:bg-[var(--hover-bg)]">
                <td className="px-4 py-3">{w.id}</td>
                {columns.name && <td className="px-4 py-3">{w.name}</td>}
                {columns.username && <td className="px-4 py-3">{w.email}</td>}
                {columns.amount && <td className="px-4 py-3">{w.amount}</td>}
                {columns.datetime && <td className="px-4 py-3">{w.date}</td>}

                {/* STATUS */}
                {columns.status && (
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs ${
                        w.status === "PENDING"
                          ? "bg-[var(--info)] bg-opacity-25 text-white"
                          : w.status === "APPROVED"
                          ? "bg-[var(--success)] text-white"
                          : "bg-[var(--danger)] text-white"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                )}

                {/* ACTIONS */}
                <td className="px-4 py-3 flex flex-wrap gap-2">

                  {w.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => acceptRequest(w.id)}
                        className="px-3 py-1 bg-[var(--success)] rounded-md text-white text-sm"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectRequest(w.id)}
                        className="px-3 py-1 bg-[var(--danger)] rounded-md text-white text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {w.status === "APPROVED" && (
                    <button className="px-3 py-1 bg-[var(--primary)] rounded-md text-white">
                      Upload Screenshot
                    </button>
                  )}

                  <button
                    onClick={() => removeRequest(w.id)}
                    className="px-3 py-1 bg-[var(--danger)] rounded-md text-white text-sm"
                  >
                    Remove
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-between gap-4 mt-4 text-[var(--text-muted)]">

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
          <button className="px-3 py-1 border border-[var(--card-border)] rounded-md">{`<<`}</button>
          <button className="px-3 py-1 border border-[var(--card-border)] rounded-md">{`<`}</button>
          <button className="px-3 py-1 bg-[var(--primary)] text-white rounded-md">1</button>
          <button className="px-3 py-1 border border-[var(--card-border)] rounded-md">{`>`}</button>
          <button className="px-3 py-1 border border-[var(--card-border)] rounded-md">{`>>`}</button>
        </div>

      </div>

      {/* MODAL */}
      {showAddModal && <AddWithdrawalModal close={() => setShowAddModal(false)} />}
    </div>
  );
}


function AddWithdrawalModal({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center
        bg-black/60 backdrop-blur-sm">
      <div className="w-[95%] max-w-[500px] bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] relative">
        
        <button onClick={close} className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--foreground)]">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold">Add Withdrawal</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Create a new withdrawal request.</p>

        <label className="text-sm block mb-1">User</label>
        <select className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] mb-4">
          <option>Select a user</option>
          <option>Elon Musk</option>
          <option>Kashiram Shivaji</option>
          <option>Trader Sam</option>
        </select>

        <label className="text-sm block mb-1">Amount</label>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] mb-4"
        />

        <label className="text-sm block mb-1">Mode</label>
        <select className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] mb-4">
          <option>Offline</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
        </select>

        <label className="text-sm block mb-1">Action Remark</label>
        <textarea
          placeholder="e.g., Manual withdrawal"
          className="w-full px-3 py-2 h-24 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={close} className="px-4 py-2 bg-[var(--hover-bg)] rounded-lg">Cancel</button>

          <button className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg flex items-center gap-2">
            <Plus size={16} /> Withdrawal
          </button>
        </div>

      </div>
    </div>
  );
}
