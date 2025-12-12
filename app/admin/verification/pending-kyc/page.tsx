"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Eye, ChevronUp, Search } from "lucide-react";
import React from "react";

// ============== MOCK DATA ==============
const initialUsers = [
  {
    id: 1,
    name: "Ravi Sharma",
    email: "ravi@example.com",
    phone: "9876543210",
    status: "Pending",
    date: "2025-02-26",
    photo: "/kyc/ravi_photo.png",
    signature: "/kyc/ravi_sign.png",
    docs: ["/kyc/ravi_aadhar.png", "/kyc/ravi_pan.png"],
  },
  {
    id: 2,
    name: "Aman Gupta",
    email: "aman@example.com",
    phone: "9123456780",
    status: "Pending",
    date: "2025-02-26",
    photo: "/kyc/aman_photo.png",
    signature: "/kyc/aman_sign.png",
    docs: ["/kyc/aman_pan.png"],
  },
];

// =======================================

export default function UserKYC() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [confirmUser, setConfirmUser] = useState<any>(null);
  const [rejectUser, setRejectUser] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalKYC = users.length;
  const todayKYC = users.filter((u) => u.date === "2025-02-26").length;
  const pendingKYC = users.filter((u) => u.status === "Pending").length;

  const approveKYC = (user: any) => {
    localStorage.setItem(
      `approved-kyc-${user.id}`,
      JSON.stringify({ ...user, approvedAt: new Date().toLocaleString() })
    );
    setUsers(users.filter((u) => u.id !== user.id));
    setConfirmUser(null);
    toast("KYC Approved Successfully!");
  };

  const rejectKYC = (user: any, reason: string) => {
    localStorage.setItem(
      `rejected-kyc-${user.id}`,
      JSON.stringify({
        ...user,
        rejectedAt: new Date().toLocaleString(),
        reason,
      })
    );
    setUsers(users.filter((u) => u.id !== user.id));
    setRejectUser(null);
    toast("KYC Rejected Successfully!");
  };

  const toast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      {successMsg && (
        <div className="bg-[var(--success)] text-white text-center py-2 rounded-md">
          {successMsg}
        </div>
      )}

      <h1 className="text-xl font-semibold text-[var(--foreground)]">Pending KYC Requests</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total KYC" value={totalKYC} color="var(--info)" />
        <SummaryCard label="Today's KYC" value={todayKYC} color="var(--success)" />
        <SummaryCard label="Pending KYC" value={pendingKYC} color="var(--danger)" />
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 p-3 border bg-[var(--card-bg)] border-[var(--input-border)] rounded-lg">
        <Search size={18} className="text-[var(--text-muted)]" />
        <input
          placeholder="Search user..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border border-[var(--input-border)] rounded-xl p-5 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="bg-[var(--input-bg)] border-b text-[var(--text-muted)]">
              <th className="py-3 pl-3 text-left">Name</th>
              <th className="py-3 text-left">Email</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <React.Fragment key={u.id}>
                <tr className="border-b hover:bg-[var(--hover-bg)]">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="px-4">{u.email}</td>
                  <td className="px-4 text-center text-yellow-400 font-semibold">{u.status}</td>
                  <td className="py-3 flex justify-center gap-2 flex-wrap">
                    <ActionBtn color="var(--success)" icon={<Check size={14} />} label="Accept" onClick={() => setConfirmUser(u)} />
                    <ActionBtn color="var(--info)" icon={<Eye size={14} />} label="View" onClick={() => setOpenRow(openRow === u.id ? null : u.id)} />
                    <ActionBtn color="var(--danger)" icon={<X size={14} />} label="Reject" onClick={() => setRejectUser(u)} />
                  </td>
                </tr>

                {openRow === u.id && <DetailsRow user={u} />}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUPS */}
      {confirmUser && (
        <Modal close={() => setConfirmUser(null)}>
          <ApprovePopup user={confirmUser} confirm={() => approveKYC(confirmUser)} close={() => setConfirmUser(null)} />
        </Modal>
      )}

      {rejectUser && (
        <Modal close={() => setRejectUser(null)}>
          <RejectPopup user={rejectUser} rejectKYC={rejectKYC} close={() => setRejectUser(null)} />
        </Modal>
      )}
    </motion.div>
  );
}

/* SUMMARY CARD */
const SummaryCard = ({ label, value, color }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--input-border)] rounded-lg p-4 shadow-md">
    <p className="text-xs text-[var(--text-muted)]">{label}</p>
    <h2 className="text-2xl font-bold" style={{ color }}>{value}</h2>
  </div>
);

/* ACTION BUTTON */
const ActionBtn = ({ label, color, icon, onClick }: any) => (
  <button
    className="px-3 py-2 text-xs rounded-md flex items-center justify-center gap-2 text-white"
    style={{ background: color }}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);

/* DETAILS EXPANSION */
const DetailsRow = ({ user }: any) => (
  <tr className="bg-[var(--card-bg)]">
    <td colSpan={4} className="p-4">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <img src={user.photo} className="w-28 rounded-md border object-cover" />
        </div>

        {/* DOCS */}
        <div>
          <p className="font-semibold mb-2">Documents</p>
          <div className="flex gap-3 flex-wrap">
            {user.docs.map((d: any, i: number) => (
              <img key={i} src={d} className="w-28 border rounded-md" />
            ))}
          </div>
        </div>

        <div className="col-span-2 mt-3">
          <p className="font-semibold mb-2">Signature</p>
          <img src={user.signature} className="w-32 h-16 border bg-white object-contain" />
        </div>
      </div>
    </td>
  </tr>
);

/* MODAL */
const Modal = ({ children, close }: any) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-[var(--card-bg)] p-6 border-[var(--input-border)] border rounded-xl shadow-xl relative w-[90%] sm:w-[400px]">
      {children}
      <button onClick={close} className="absolute top-2 right-3 text-xl text-[var(--text-muted)]">×</button>
    </div>
  </div>
);

/* APPROVE POPUP */
const ApprovePopup = ({ user, confirm, close }: any) => (
  <div>
    <h2 className="font-semibold text-green-600 mb-3">Approve KYC</h2>
    <p>Are you sure you want to approve <b>{user.name}</b>'s KYC?</p>

    <div className="flex justify-end gap-3 mt-4">
      <button onClick={close} className="text-sm text-[var(--text-muted)]">Cancel</button>
      <button onClick={confirm} className="px-4 py-1 rounded bg-[var(--success)] text-white">Approve</button>
    </div>
  </div>
);

/* REJECT POPUP */
const RejectPopup = ({ user, rejectKYC, close }: any) => {
  const [reason, setReason] = useState("");
  return (
    <div>
      <h2 className="font-semibold text-red-500 mb-3">Reject KYC</h2>
      <textarea
        placeholder="Reason..."
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-[var(--input-bg)] border p-2 rounded-md"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={close} className="text-sm text-[var(--text-muted)]">Cancel</button>
        <button onClick={() => rejectKYC(user, reason)} className="px-4 py-1 bg-[var(--danger)] text-white rounded">
          Reject
        </button>
      </div>
    </div>
  );
};
