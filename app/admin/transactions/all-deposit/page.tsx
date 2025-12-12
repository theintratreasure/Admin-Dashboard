"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";

interface DepositData {
  id: number;
  name: string;
  photo: string;
  amount: number;
  mode: string;
  utr: string;
  remark: string;
  acceptedAt: string;
  screenshot: string;
}

export default function AllDeposit() {
  const [deposits, setDeposits] = useState<DepositData[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DepositData | null>(null);

  useEffect(() => {
    
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("deposit-")
    );

    const data = keys.map((key) => JSON.parse(localStorage.getItem(key)!));
    setDeposits(data);
  }, []);

  const filtered = deposits.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
        <h1 className="text-xl font-semibold text-[var(--foreground)]">
        All Deposits
      </h1>
        <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
>
  {/* All Deposit Members */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 shadow-sm"
  >
    <p className="text-sm text-[var(--text-muted)]">All Deposit Members</p>
    <h2 className="text-2xl font-bold text-[var(--primary)]">
      {deposits.length}
    </h2>
  </motion.div>

  {/* Today's Deposits */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 shadow-sm"
  >
    <p className="text-sm text-[var(--text-muted)]">Today's Deposits</p>
    <h2 className="text-2xl font-bold text-[var(--success)]">
      {
        deposits.filter(d =>
          d.acceptedAt?.startsWith(new Date().toLocaleDateString())
        ).length
      }
    </h2>
  </motion.div>

  {/* Today's Deposit Amount */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 shadow-sm"
  >
    <p className="text-sm text-[var(--text-muted)]">Today's Deposit Amount</p>
    <h2 className="text-2xl font-bold text-[var(--info)]">
      ₹{
        deposits
          .filter(d =>
            d.acceptedAt?.startsWith(new Date().toLocaleDateString())
          )
          .reduce((a, b) => a + Number(b.amount), 0)
      }
    </h2>
  </motion.div>
</motion.div>

      
      

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-[var(--card-bg)] p-3 border border-[var(--card-border)] rounded-lg">
        <Search size={18} className="text-[var(--text-muted)]" />
        <input
          placeholder="Search by user name..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-[var(--foreground)] outline-none"
        />
      </div>
      <div className="flex gap-3 ml-230">
  <button className="px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:opacity-90">
    Today Deposit
  </button>
  <button className="px-4 py-2 rounded-md bg-[var(--info)] text-white hover:opacity-90">
    All Deposit
  </button>
  
</div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-[var(--input-bg)] text-[var(--text-muted)]">
              <th className="py-3 pl-3 text-left">User</th>
              <th className="py-3 text-center">Amount</th>
              <th className="py-3 text-center">Mode</th>
              <th className="py-3 text-center">UTR</th>
              <th className="py-3 text-center">Remark</th>
              <th className="py-3 text-center">Accepted At</th>
              <th className="py-3 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((d, i) => (
                <tr
                  key={d.id}
                  className={`border-b transition-all ${
                    i % 2 === 0
                      ? "bg-[var(--card-bg)]"
                      : "bg-[var(--input-bg)]"
                  } hover:bg-[var(--hover-bg)]`}
                >
                  <td className="py-3 pl-3 flex items-center gap-2">
                    <img src={d.photo} className="w-8 h-8 rounded-full" />
                    <span className="text-[var(--foreground)]">{d.name}</span>
                  </td>

                  <td className="text-center font-semibold text-[var(--success)]">
                    ₹{d.amount}
                  </td>

                  <td className="text-center text-[var(--foreground)]">
                    {d.mode}
                  </td>

                  <td className="text-center text-[var(--foreground)]">
                    {d.utr}
                  </td>

                  <td className="text-center text-[var(--text-muted)]">
                    {d.remark}
                  </td>

                  <td className="text-center text-[var(--foreground)]">
                    {d.acceptedAt}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => setSelected(d)}
                      className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-md
                      bg-[var(--info)] text-white hover:opacity-90 transition"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-[var(--text-muted)]"
                >
                  No deposits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selected && (
        <Modal close={() => setSelected(null)}>
          <DepositDetails user={selected} />
        </Modal>
      )}
    </motion.div>
  );
}

/* DETAILS MODAL CONTENT */
const DepositDetails = ({ user }: any) => (
  <div>
    <h2 className="text-md font-semibold mb-3 text-[var(--foreground)]">
      {user.name} – Deposit Details
    </h2>

    <div className="space-y-1 text-sm">
      <p>
        <b>Amount:</b> ₹{user.amount}
      </p>
      <p>
        <b>Mode:</b> {user.mode}
      </p>
      <p>
        <b>UTR:</b> {user.utr}
      </p>
      <p>
        <b>Remark:</b> {user.remark}
      </p>
      <p>
        <b>Accepted At:</b> {user.acceptedAt}
      </p>
    </div>

    <img
      src={user.screenshot}
      className="mt-4 w-full border border-[var(--card-border)] rounded-md"
    />
  </div>
);

/* MODAL WRAPPER */
const Modal = ({ children, close }: any) => (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-xl shadow-xl w-[430px] relative">
      {children}
      <button
        className="absolute top-3 right-4 text-[var(--text-muted)]"
        onClick={close}
      >
        ✕
      </button>
    </div>
  </div>
);
