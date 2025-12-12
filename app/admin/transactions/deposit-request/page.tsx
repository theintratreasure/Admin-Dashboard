"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// SAMPLE DEPOSIT DATA


export default function UserDeposit() {

  const [deposits, setDeposits]  = useState([
  {
    id: 1,
    name: "Ravi Sharma",
    photo: "/users/ravi.png",
    amount: 2500,
    mode: "UPI",
    utr: "UTR98445321",
    remark: "Deposit for trading",
    status: "Pending",
    screenshot: "/deposit/ravi_upi.png",
    date: "2025-02-27",
  },
  {
    id: 2,
    name: "Aman Gupta",
    photo: "/users/aman.png",
    amount: 5000,
    mode: "Bank Transfer",
    utr: "UTR76588721",
    remark: "Wallet top-up",
    status: "Pending",
    screenshot: "/deposit/aman_bank.png",
    date: "2025-02-26",
  },
  {
    id: 3,
    name: "Priya Verma",
    photo: "/users/priya.png",
    amount: 1800,
    mode: "UPI",
    utr: "UTR55321912",
    remark: "Deposit stuck",
    status: "Pending",
    screenshot: "/deposit/priya_upi.png",
    date: "2025-02-27",
  },
]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const router = useRouter();

  const filtered = deposits.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // SUMMARY
  const totalDeposit = deposits.reduce((a, b) => a + b.amount, 0);
  const pendingDeposit = deposits.filter((d) => d.status === "Pending").length;

  // ACCEPT FUNCTION
  const acceptDeposit = (user: any) => {
    const dt = new Date();
    const date = dt.toLocaleDateString();
    const time = dt.toLocaleTimeString();

    const acceptedData = {
      ...user,
      status: "Accepted",
      acceptedAt: `${date} ${time}`,
    };

    const confirmSave = window.confirm(
    `${user.name}'s Deposit has been successfully accepted!\nDo you want to save this record?`
  );

  if (confirmSave) {
    localStorage.setItem(`deposit-${user.id}`, JSON.stringify(acceptedData));

    setDeposits((prev: any[]) => prev.filter((item) => item.id !== user.id));

    setSelected(null); // Close modal after save
    alert("Deposit Successfully Saved!");
  }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">

      <h1 className="text-xl font-semibold text-[var(--text)]">User Deposits</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Deposit" value={`₹${totalDeposit}`} color="var(--success)" />
        <SummaryCard label="Pending Deposits" value={pendingDeposit} color="var(--danger)" />
        <SummaryCard label="Pending Remarks" value="Remarks Required" color="var(--info)" />
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-[var(--card-bg)] p-3 border border-[var(--border)] rounded-lg">
        <Search size={18} className="text-[var(--text-muted)]" />
        <input
          placeholder="Search user by name..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-[var(--text)] outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 shadow-sm overflow-x-auto">
  <table className="w-full text-sm min-w-[850px]">
  <thead>
    <tr className="border-b bg-[var(--input-bg)] text-[var(--text-muted)]">
      <th className="py-3 px-4 text-left">User</th>
      <th className="py-3 px-4 text-center">Amount</th>
      <th className="py-3 px-4 text-center">Mode</th>
      <th className="py-3 px-4 text-center">Txn ID</th>
      <th className="py-3 px-4 text-center">Remark</th>
      <th className="py-3 px-4 text-center">Status</th>
      <th className="py-3 px-4 text-center w-[200px]">Actions</th>
    </tr>
  </thead>

  <tbody>
    {filtered.map((d, i) => (
      <tr
        key={d.id}
        className={`${
          i % 2 === 0 ? "bg-[var(--card-bg)]" : "bg-[var(--input-bg)]"
        } border-b hover:bg-[var(--hover-bg)] transition-all`}
      >
        <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap">
          <img src={d.photo} className="w-8 h-8 rounded-full" />
          {d.name}
        </td>

        <td className="px-4 text-center font-semibold text-[var(--success)] whitespace-nowrap">
          ₹{d.amount}
        </td>

        <td className=" px-4 text-center whitespace-nowrap">
          {d.mode}
        </td>

        <td className="px-4 text-center truncate max-w-[150px]">
          {d.utr}
        </td>

        <td className=" px-4 text-center text-[var(--text-muted)] truncate max-w-[200px]">
          {d.remark}
        </td>

        <td className=" px-4 text-center text-yellow-400 whitespace-nowrap">
          {d.status}
        </td>

        <td
  className="
    flex flex-col sm:flex-row
    justify-center items-center
    gap-3 sm:gap-2
    py-3
    w-full
  "
>
  {/* Accept */}
  <button
    onClick={() => setSelected({ ...d, confirmAccept: true })}
    className="
      bg-[var(--success)] text-white
      w-full sm:w-auto
      px-4 py-2
      text-xs rounded-md
      flex items-center justify-center gap-2
    "
  >
    <Check size={14} /> Accept
  </button>

  {/* Reject */}
  <button
    onClick={() => setSelected({ ...d, rejectMode: true })}
    className="
      bg-[var(--danger)] text-white
      w-full sm:w-auto
      px-4 py-2
      text-xs rounded-md
      flex items-center justify-center gap-2
    "
  >
    <X size={14} /> Reject
  </button>

  {/* View */}
  <button
    onClick={() => setSelected(d)}
    className="
      bg-[var(--info)] text-white
      w-full sm:w-auto
      px-4 py-2
      text-xs rounded-md
      flex items-center justify-center gap-2
    "
  >
    <Eye size={14} /> View
  </button>
</td>

      </tr>
    ))}
  </tbody>
</table>

</div>


      {/* MODAL LOGIC */}
      {selected && (
        <Modal close={() => setSelected(null)}>
          {selected.confirmAccept ? (
            <AcceptConfirm
              user={selected}
              confirm={() => acceptDeposit(selected)}
              close={() => setSelected(null)}
            />
          ) : selected.rejectMode ? (
            <RejectBox close={() => setSelected(null)} />
          ) : (
            <DepositDetails user={selected} />
          )}
        </Modal>
      )}
    </motion.div>
  );
}

/* SUMMARY CARD */
const SummaryCard = ({ label, value, color }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
    <h2 className="text-2xl font-bold" style={{ color }}>{value}</h2>
  </div>
);

/* DETAILS MODAL */
const DepositDetails = ({ user }: any) => (
  <div>
    <h2 className="text-md font-semibold mb-3">{user.name} – Deposit Details</h2>
    <p><b>Amount:</b> ₹{user.amount}</p>
    <p><b>Mode:</b> {user.mode}</p>
    <p><b>UTR:</b> {user.utr}</p>
    <p className="mb-3"><b>Remark:</b> {user.remark}</p>
    <img src={user.screenshot} className="border border-[var(--border)] rounded-md w-full" />
  </div>
);

/* ACCEPT CONFIRMATION POPUP */
const AcceptConfirm = ({ user, confirm, close }: any) => (
  <div>
    <h2 className="font-semibold text-green-500 mb-3">Confirm Accept</h2>
    <p>Do you want to accept <b>{user.name}</b>'s deposit?</p>

    <div className="flex justify-end gap-3 mt-4">
      <button onClick={close} className="text-[var(--text-muted)] text-sm">Cancel</button>
      <button
        onClick={confirm}
        style={{ background: "var(--success)", color: "#fff" }}
        className="px-4 py-1 rounded-md text-sm"
      >
        Yes, Accept
      </button>
    </div>
  </div>
);

/* REJECT BOX */
const RejectBox = ({ close }: any) => {
  const [note, setNote] = useState("");
  return (
    <div>
      <h2 className="font-semibold mb-3 text-red-500">Reject Deposit</h2>
      <textarea
        placeholder="Enter reason..."
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 rounded-md bg-[var(--input-bg)] border border-[var(--input-border)]"
      />
      <div className="flex justify-end gap-3 mt-3">
        <button onClick={close} className="text-[var(--text-muted)] text-sm">Cancel</button>
        <button
          onClick={close}
          style={{ background: "var(--danger)", color: "#fff" }}
          className="px-4 py-1 rounded-md text-sm"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

/* MODAL WRAPPER */
const Modal = ({ children, close }: any) => (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-[var(--card-bg)] border border-[var(--border)] p-6 rounded-xl shadow-xl w-[430px] relative">
      {children}
      <button className="absolute top-3 right-4 text-[var(--text-muted)]" onClick={close}>✕</button>
    </div>
  </div>
);
