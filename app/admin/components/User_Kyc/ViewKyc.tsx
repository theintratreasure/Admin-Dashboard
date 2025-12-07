"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Eye, ChevronUp, Search } from "lucide-react";
import React from "react";

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

  /** APPROVE USER KYC */
  const approveKYC = (user: any) => {
    localStorage.setItem(
      `approved-kyc-${user.id}`,
      JSON.stringify({ ...user, approvedAt: new Date().toLocaleString() })
    );

    setUsers(users.filter((u) => u.id !== user.id));
    setConfirmUser(null);
    setSuccessMsg("KYC Approved Successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  /** REJECT USER KYC */
  const rejectKYC = (user: any, note: string) => {
    localStorage.setItem(
      `rejected-kyc-${user.id}`,
      JSON.stringify({
        ...user,
        rejectedAt: new Date().toLocaleString(),
        reason: note,
      })
    );

    setUsers(users.filter((u) => u.id !== user.id));
    setRejectUser(null);
    setSuccessMsg("KYC Rejected Successfully!");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">

      {successMsg && (
        <div className="p-3 text-center bg-green-600 text-white rounded-md">
          {successMsg}
        </div>
      )}

      <h1 className="text-xl font-semibold text-[var(--text)]">User KYC Requests</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total KYC" value={totalKYC} color="var(--info)" />
        <SummaryCard label="Today's KYC" value={todayKYC} color="var(--success)" />
        <SummaryCard label="Pending KYC" value={pendingKYC} color="var(--danger)" />
      </div>

      <div className="flex items-center gap-3 bg-[var(--card-bg)] p-3 border border-[var(--border)] rounded-lg">
        <Search size={18} className="text-[var(--text-muted)]" />
        <input
          placeholder="Search user..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-[var(--text)] outline-none"
        />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-[var(--input-bg)] text-[var(--text-muted)]">
              <th className="py-3 pl-3 text-left">Name</th>
              <th className="py-3 text-left">Email</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
  {filteredUsers.map((user, index) => (
    <React.Fragment key={user.id}>
      <tr
        className={`${
          index % 2 === 0 ? "bg-[var(--card-bg)]" : "bg-[var(--input-bg)]"
        } border-b hover:bg-[var(--hover-bg)]`}
      >
        <td className="py-3 pl-3">{user.name}</td>
        <td>{user.email}</td>
        <td className="text-center text-yellow-400 font-medium">
          {user.status}
        </td>

        <td className="flex justify-center gap-3 py-2">
          <button
            style={{ background: "var(--success)", color: "#fff" }}
            className="px-3 py-1 text-xs rounded-md flex items-center gap-1"
            onClick={() => setConfirmUser(user)}
          >
            <Check size={14} /> Accept
          </button>

          <button
            style={{ background: "var(--info)", color: "#fff" }}
            className="px-3 py-1 text-xs rounded-md flex items-center gap-1"
            onClick={() => setOpenRow(openRow === user.id ? null : user.id)}
          >
            {openRow === user.id ? <ChevronUp size={14} /> : <Eye size={14} />}
            View
          </button>

          <button
            style={{ background: "var(--danger)", color: "#fff" }}
            className="px-3 py-1 text-xs rounded-md flex items-center gap-1"
            onClick={() => setRejectUser(user)}
          >
            <X size={14} /> Reject
          </button>
        </td>
      </tr>

      {openRow === user.id && (
        <tr className="bg-[var(--card-bg)] border-b">
          <td colSpan={4} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Phone:</b> {user.phone}</p>

              <div>
                <p className="font-semibold mb-1">Profile Photo</p>
                <img src={user.photo} className="w-32 h-32 rounded-lg border object-cover" />
              </div>

              <div className="col-span-2">
                <p className="font-semibold mb-1">Documents</p>
                <div className="flex gap-3 flex-wrap">
                  {user.docs.map((doc, i) => (
                    <img key={i} src={doc} className="w-36 rounded-lg border" />
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <p className="font-semibold mb-1">Signature</p>
                <img src={user.signature} className="w-32 h-16 border object-contain bg-white" />
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

        </table>
      </div>

      {confirmUser && (
        <Modal close={() => setConfirmUser(null)}>
          <ApprovePopup user={confirmUser} confirm={() => approveKYC(confirmUser)} close={() => setConfirmUser(null)} />
        </Modal>
      )}

      {rejectUser && (
        <Modal close={() => setRejectUser(null)}>
          <RejectPopup user={rejectUser} close={() => setRejectUser(null)} rejectKYC={rejectKYC} />
        </Modal>
      )}
    </motion.div>
  );
}

/* APPROVE POPUP */
const ApprovePopup = ({ user, confirm, close }: any) => (
  <div>
    <h2 className="font-semibold text-green-500 mb-3">Approve KYC</h2>
    <p>Are you sure you want to approve <b>{user.name}</b>'s KYC?</p>

    <div className="flex justify-end gap-3 mt-4">
      <button onClick={close} className="text-sm text-[var(--text-muted)]">Cancel</button>
      <button onClick={confirm} className="px-4 py-1 rounded-md bg-[var(--success)] text-white">
        Yes, Approve
      </button>
    </div>
  </div>
);

/* MODAL */
const Modal = ({ children, close }: any) => (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-[var(--card-bg)] border p-6 rounded-xl shadow-xl w-[400px] relative">
      {children}
      <button onClick={close} className="absolute top-3 right-4 text-[var(--text-muted)]">✕</button>
    </div>
  </div>
);

/* REJECT POPUP UPDATED ✔️ */
const RejectPopup = ({ user, close, rejectKYC }: any) => {
  const [note, setNote] = useState("");

  return (
    <div>
      <h2 className="font-semibold text-red-500 mb-3">Reject KYC</h2>
      <p>Enter reason for rejecting <b>{user.name}</b>'s KYC:</p>

      <textarea
        placeholder="Reason..."
        className="w-full mt-3 bg-[var(--input-bg)] border border-[var(--input-border)] p-2 rounded-md"
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={close} className="text-sm text-[var(--text-muted)]">Cancel</button>
        <button
          onClick={() => rejectKYC(user, note)}
          className="px-4 py-1 rounded-md bg-[var(--danger)] text-white"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

/* SUMMARY CARD */
const SummaryCard = ({ label, value, color }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
    <h2 className="text-2xl font-bold" style={{ color }}>{value}</h2>
  </div>
);
