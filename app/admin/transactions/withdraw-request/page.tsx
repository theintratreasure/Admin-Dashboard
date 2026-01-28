"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import {
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "@/hooks/withdrawals/useWithdrawalActions";
import { useAdminWithdrawals } from "@/hooks/withdrawals/useWithdrawals";
import Pagination from "../../components/ui/pagination";

export default function AllWithdrawals() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<
    "PENDING" | "COMPLETED" | "REJECTED" | undefined
  >();
  const [selected, setSelected] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, refetch } =
    useAdminWithdrawals({ page, limit, status });

  const approve = useApproveWithdrawal();
  const reject = useRejectWithdrawal();

  const withdrawals = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleApprove = async () => {
    if (!selected) return;
    await approve.mutateAsync(selected._id);
    setSelected(null);
    refetch();
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return;
    await reject.mutateAsync({
      id: selected._id,
      reason: rejectReason,
    });
    setSelected(null);
    setRejectReason("");
    refetch();
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-[var(--text-main)]">
          Withdrawals Management
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Review and manage withdrawal requests
        </p>
      </div>

      {/* FILTER */}
      <div className="card p-3 flex flex-wrap gap-2">
        {["All", "PENDING", "COMPLETED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() =>
              setStatus(s === "All" ? undefined : (s as any))
            }
            className={`pill ${
              (s === "All" && !status) || status === s
                ? "pill-accent"
                : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="card overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-soft)] text-left">
              <th className="py-3 px-2">User</th>
              <th className="px-2">Account</th>
              <th className="px-2">Balance</th>
              <th className="px-2">Hold</th>
              <th className="px-2">Amount</th>
              <th className="px-2">Method</th>
              <th className="px-2">Status</th>
              <th className="px-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center">
                  Loading withdrawals...
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[var(--text-muted)]">
                  No withdrawals found
                </td>
              </tr>
            ) : (
              withdrawals.map((w: any) => (
                <tr
                  key={w._id}
                  className="border-b border-[var(--border-soft)]"
                >
                  <td className="py-3 px-2">
                    <div className="font-medium">
                      {w.user?.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {w.user?.email}
                    </div>
                  </td>

                  <td className="px-2">
                    <div className="font-mono text-xs">
                      {w.account?.account_number}
                    </div>
                    <div className="text-xs capitalize text-[var(--text-muted)]">
                      {w.account?.account_type}
                    </div>
                  </td>

                  <td className="px-2 text-green-600 font-medium">
                    ${w.account?.balance?.toLocaleString()}
                  </td>

                  <td className="px-2 text-yellow-600 font-medium">
                    ${w.account?.hold_balance?.toLocaleString()}
                  </td>

                  <td className="px-2 font-semibold">
                    ${w.amount?.toLocaleString()}
                  </td>

                  <td className="px-2">{w.method}</td>

                  <td className="px-2">
                    <span
                      className={`pill ${
                        w.status === "COMPLETED"
                          ? "pill-success"
                          : w.status === "REJECTED"
                          ? "pill-danger"
                          : "pill-accent"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>

                  <td className="px-2 text-center">
                    <button
                      onClick={() => setSelected(w)}
                      className="btn p-2"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="card w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Withdrawal Details
                </h3>
                <button onClick={() => setSelected(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm space-y-2 break-all">
                <p><strong>User:</strong> {selected.user?.name}</p>
                <p><strong>Email:</strong> {selected.user?.email}</p>
                <p><strong>Account:</strong> {selected.account?.account_number}</p>
                <p><strong>Type:</strong> {selected.account?.account_type}</p>
                <p><strong>Balance:</strong> ${selected.account?.balance}</p>
                <p><strong>Hold:</strong> ${selected.account?.hold_balance}</p>
                <p><strong>Amount:</strong> ${selected.amount}</p>
                <p><strong>Method:</strong> {selected.method}</p>

                {/* Payout */}
                {selected.payout?.upi_id && (
                  <p><strong>UPI:</strong> {selected.payout.upi_id}</p>
                )}
                {selected.payout?.bank_name && (
                  <p><strong>Bank:</strong> {selected.payout.bank_name}</p>
                )}
                {selected.payout?.account_number && (
                  <p><strong>Account No:</strong> {selected.payout.account_number}</p>
                )}
                {selected.payout?.crypto_address && (
                  <p><strong>Wallet:</strong> {selected.payout.crypto_address}</p>
                )}
              </div>

              {selected.status === "PENDING" && (
                <>
                  <button
                    onClick={handleApprove}
                    className="btn btn-primary w-full"
                  >
                    Approve Withdrawal
                  </button>

                  <textarea
                    placeholder="Reject reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="input w-full h-20"
                  />

                  <button
                    onClick={handleReject}
                    className="btn bg-red-600 text-white w-full"
                  >
                    Reject Withdrawal
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
