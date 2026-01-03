"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, AlertCircle, X } from "lucide-react";
import { useAdminDeposits } from "@/hooks/deposit/useAdminDeposits";
import { useApproveDeposit, useRejectDeposit } from "@/hooks/deposit/useDepositActions";
import Pagination from "../../components/ui/pagination";
import { useEditDepositAmount } from "@/hooks/deposit/useEditDepositAmount";

export default function AllDeposit() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | undefined>();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editAmount, setEditAmount] = useState<number>(0);
  const editMutation = useEditDepositAmount();
  const { data, isLoading, refetch } = useAdminDeposits({
    page,
    limit,
    status,
    // search,
  });

  const approve = useApproveDeposit();
  const reject = useRejectDeposit();

  const deposits = data?.data ?? [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handleStatusFilter = useCallback((newStatus: typeof status) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleApprove = useCallback(async () => {
    if (selected) {
      await approve.mutateAsync(selected._id);
      setSelected(null);
      refetch();
    }
  }, [selected, approve, refetch]);

  const handleReject = useCallback(async () => {
    if (selected && rejectReason.trim()) {
      await reject.mutateAsync({
        id: selected._id,
        reason: rejectReason,
      });
      setSelected(null);
      setRejectReason("");
      refetch();
    }
  }, [selected, rejectReason, reject, refetch]);

  const closeModal = useCallback(() => {
    setSelected(null);
    setRejectReason("");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pad space-y-8 min-h-screen"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
            Deposits Management
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Manage and review all deposit requests
          </p>
        </div>

      </div>

      {/* FILTERS & SEARCH */}
      <div className="card-elevated flex flex-col lg:flex-row gap-4 p-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search deposits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10 pr-4"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleStatusFilter(undefined)}
            className={`btn ${!status ? 'btn-primary' : 'btn-ghost'}`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("PENDING")}
            className={`pill ${status === "PENDING" ? "pill-accent" : ""}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter("APPROVED")}
            className={`pill ${status === "APPROVED" ? "pill-success" : ""}`}
          >
            Approved
          </button>
          <button
            onClick={() => handleStatusFilter("REJECTED")}
            className={`pill ${status === "REJECTED" ? "pill-danger" : ""}`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="card-elevated">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="font-semibold text-[var(--foreground)]">User</th>
                <th className="font-semibold text-[var(--foreground)]">Account</th>
                <th className="font-semibold text-[var(--foreground)]">Amount</th>
                <th className="font-semibold text-[var(--foreground)]">Method</th>
                <th className="font-semibold text-[var(--foreground)]">Status</th>
                <th className="font-semibold text-[var(--foreground)] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
                        <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                        Loading deposits...
                      </div>
                    </td>
                  </tr>
                ) : deposits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="text-[var(--text-muted)] space-y-2">
                        <Search className="w-12 h-12 mx-auto opacity-50" />
                        <p>No deposits found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  deposits.map((d: any, index: number) => (
                    <motion.tr
                      key={d._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      {/* USER */}
                      <td>
                        <div className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                          {d.user?.name ?? d.user}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                          {d.user?.email}
                        </div>
                      </td>

                      {/* ACCOUNT */}
                      <td>
                        <div className="font-mono text-sm bg-[var(--input-bg)] px-2 py-1 rounded">
                          {d.account?.account_number}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1 capitalize">
                          {d.account?.account_type} • {d.account?.account_plan_id?.name}
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td>
                        <div className="font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                          ${d.amount?.toLocaleString()}
                        </div>
                      </td>

                      {/* METHOD */}
                      <td>
                        <span className="pill bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50">
                          {d.method}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`pill font-semibold ${d.status === "APPROVED"
                              ? "pill-success shadow-sm"
                              : d.status === "REJECTED"
                                ? "pill-danger shadow-sm"
                                : "pill-accent shadow-sm"
                            }`}
                        >
                          {d.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelected(d)}
                        className="btn p-2"
                      >
                        <Eye size={16} />
                      </button>

                      {d.status === "PENDING" && (
                        <button
                          onClick={() => {
                            setSelected(d);
                            setEditAmount(d.amount);
                            setEditOpen(true);
                          }}
                          className="p-2 text-[var(--primary)]"
                        >
                          ✎
                        </button>
                      )}
                    </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADVANCED PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="card-elevated w-full max-w-lg max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Deposit Details
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)]"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* IMAGE PROOF */}
              {selected.proof?.image_url && (
                <div className="p-6 border-b border-[var(--card-border)]">
                  <img
                    src={selected.proof.image_url}
                    alt="Deposit proof"
                    className="w-full h-64 object-contain rounded-xl bg-[var(--input-bg)]"
                  />
                </div>
              )}

              {/* ACTIONS */}
              {selected.status === "PENDING" && (
                <div className="p-6 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    disabled={approve.isPending}
                    className="btn btn-primary w-full h-12 text-lg shadow-lg hover:shadow-xl"
                  >
                    {approve.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Approving...
                      </>
                    ) : (
                      "Approve Deposit"
                    )}
                  </motion.button>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--foreground)] block">
                      Reject Reason (Required)
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Enter reason for rejection..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="input resize-none w-full h-24 pr-10"
                        rows={4}
                      />
                      {rejectReason.trim().length === 0 && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReject}
                    disabled={rejectReason.trim().length === 0 || reject.isPending}
                    className="btn w-full h-12 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reject.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Rejecting...
                      </>
                    ) : (
                      "Reject Deposit"
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
       {/* EDIT MODAL */}
        {editOpen && selected && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              className="card-elevated w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Edit Deposit Amount
              </h3>

              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                className="input w-full mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setEditOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await editMutation.mutateAsync({
                      id: selected._id,
                      newAmount: editAmount,
                    });
                    refetch();
                  }}
                  className="btn btn-primary flex-1"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

    </motion.div>
  );
}
