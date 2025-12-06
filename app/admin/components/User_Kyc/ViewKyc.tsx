"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Eye, ChevronDown, ChevronUp, Search } from "lucide-react";

// SAMPLE USERS DATA
const users = [
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
    const [search, setSearch] = useState("");
    const [openRow, setOpenRow] = useState<number | null>(null);

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalKYC = users.length;
    const todayKYC = users.filter((u) => u.date === "2025-02-26").length;
    const pendingKYC = users.filter((u) => u.status === "Pending").length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">

            {/* TITLE */}
            <h1 className="text-xl font-semibold text-[var(--text)]">User KYC Requests</h1>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard label="Total KYC" value={totalKYC} color="var(--info)" />
                <SummaryCard label="Today's KYC" value={todayKYC} color="var(--success)" />
                <SummaryCard label="Pending KYC" value={pendingKYC} color="var(--danger)" />
            </div>

            {/* SEARCH BAR */}
            <div className="flex items-center gap-3 bg-[var(--card-bg)] p-3 border border-[var(--border)] rounded-lg">
                <Search size={18} className="text-[var(--text-muted)]" />
                <input
                    placeholder="Search user..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-[var(--text)] outline-none"
                />
            </div>

            {/* TABLE */}
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
                            <>
                                {/* DATA ROW */}
                                <tr
                                    key={user.id}
                                    className={`${index % 2 === 0 ? "bg-[var(--card-bg)]" : "bg-[var(--input-bg)]"
                                        } border-b transition-all hover:bg-[var(--hover-bg)]`}
                                >
                                    <td className="py-3 pl-3">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="text-center text-yellow-400 font-medium">{user.status}</td>

                                    {/* ACTION BUTTONS */}
                                    <td className="flex justify-center gap-3 py-2">

                                        <button style={{ background: "var(--success)", color: "#fff" }}
                                            className="px-3 py-1 text-xs rounded-md flex items-center gap-1">
                                            <Check size={14} /> Accept
                                        </button>

                                        <button style={{ background: "var(--danger)", color: "#fff" }}
                                            className="px-3 py-1 text-xs rounded-md flex items-center gap-1">
                                            <X size={14} /> Reject
                                        </button>

                                        <button
                                            style={{ background: "var(--info)", color: "#fff" }}
                                            className="px-3 py-1 text-xs rounded-md flex items-center gap-1"
                                            onClick={() => setOpenRow(openRow === user.id ? null : user.id)}
                                        >
                                            {openRow === user.id ? <ChevronUp size={14} /> : <Eye size={14} />}
                                            View
                                        </button>

                                    </td>
                                </tr>

                                {/* DROPDOWN DETAIL ROW */}
                                {openRow === user.id && (
                                    <tr className="bg-[var(--card-bg)] border-b">
                                        <td colSpan={4} className="p-4">

                                            {/* USER FULL KYC DETAILS */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div className="space-y-2 text-sm">
                                                    <p><strong>Name:</strong> {user.name}</p>
                                                    <p><strong>Email:</strong> {user.email}</p>
                                                    <p><strong>Phone:</strong> {user.phone}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-semibold">Profile Photo</p>
                                                    <img src={user.photo}
                                                        className="w-32 h-32 rounded-lg border border-[var(--border)] object-cover" />
                                                </div>

                                                <div className="col-span-2">
                                                    <p className="text-sm font-semibold mb-2">Documents</p>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {user.docs.map((doc, i) => (
                                                            <img key={i} src={doc}
                                                                className="w-40 rounded-lg border border-[var(--border)] cursor-pointer hover:scale-105 transition" />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <p className="text-sm font-semibold mb-1">Signature</p>
                                                    <img src={user.signature}
                                                        className="w-32 h-16 border border-[var(--border)] object-contain bg-white" />
                                                </div>
                                            </div>

                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
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
