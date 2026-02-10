"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  AlertCircle,
  X,
  DollarSign,
  FileText,
  User,
  Wallet,
  UserCheck,
  Check,
  Bitcoin,
  Banknote,
  Smartphone,
  HandCoins,
  ArrowUpCircle,
} from "lucide-react";
import {
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "@/hooks/withdrawals/useWithdrawalActions";
import { useAdminWithdrawals } from "@/hooks/withdrawals/useWithdrawals";
import Pagination from "../../components/ui/pagination";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type WithdrawalRow = {
  _id: string;
  amount?: number;
  method?: string;
  status?: "PENDING" | "COMPLETED" | "REJECTED" | string;
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
  };
  account?: {
    account_number?: string;
    account_type?: string;
    plan_name?: string;
    balance?: number;
    hold_balance?: number;
  };
  payout?: {
    upi_id?: string;
    bank_name?: string;
    account_number?: string;
    crypto_address?: string;
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const responseMessage = (error as {
    response?: { data?: { message?: string; error?: string } };
  }).response?.data;

  if (typeof responseMessage?.message === "string" && responseMessage.message.trim()) {
    return responseMessage.message;
  }

  if (typeof responseMessage?.error === "string" && responseMessage.error.trim()) {
    return responseMessage.error;
  }

  const baseMessage = (error as { message?: string }).message;
  if (typeof baseMessage === "string" && baseMessage.trim()) {
    return baseMessage;
  }

  return fallback;
};

export default function AllWithdrawals() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<
    "PENDING" | "COMPLETED" | "REJECTED" | undefined
  >();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<WithdrawalRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, refetch } =
    useAdminWithdrawals({ page, limit, status, search });

  const approve = useApproveWithdrawal();
  const reject = useRejectWithdrawal();

  const withdrawals: WithdrawalRow[] = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleStatusFilter = useCallback((nextStatus: typeof status) => {
    setStatus(nextStatus);
    setPage(1);
  }, []);

  const getUserId = useCallback((withdrawal: WithdrawalRow) => {
    return withdrawal.user?._id ?? withdrawal.user?.id ?? "";
  }, []);

  const goToUserView = useCallback((withdrawal: WithdrawalRow) => {
    const userId = getUserId(withdrawal);
    if (!userId) return;

    const params = new URLSearchParams({
      name: withdrawal.user?.name ?? "",
      email: withdrawal.user?.email ?? "",
    });

    router.push(`/admin/users/users/view/${userId}?${params.toString()}`);
  }, [getUserId, router]);

  const getMethodIcon = useCallback((method?: string) => {
    const normalizedMethod = (method ?? "").toUpperCase();

    if (normalizedMethod === "CRYPTO") return <Bitcoin size={12} />;
    if (normalizedMethod === "BANK") return <Banknote size={12} />;
    if (normalizedMethod === "UPI") return <Smartphone size={12} />;
    if (normalizedMethod === "MANUAL") return <HandCoins size={12} />;

    return <FileText size={12} />;
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    setRejectReason("");
  }, []);

  const handleApprove = useCallback(async () => {
    if (!selected) return;

    try {
      await approve.mutateAsync(selected._id);
      toast.success("Withdrawal approved successfully");
      setSelected(null);
      refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to approve withdrawal"));
    }
  }, [selected, approve, refetch]);

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) return;

    try {
      await reject.mutateAsync({
        id: selected._id,
        reason: rejectReason,
      });
      toast.success("Withdrawal rejected successfully");
      setSelected(null);
      setRejectReason("");
      refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to reject withdrawal"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pad space-y-8 min-h-screen no-shadow"
    >

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h1 className="inline-flex items-center gap-2 text-base sm:text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] bg-clip-text text-transparent">
            <ArrowUpCircle size={18} className="sm:h-7 sm:w-7 text-[var(--primary)]" />
            Withdrawals Management
          </h1>
          <p className="text-[10px] sm:text-base text-[var(--text-muted)] mt-1">
            Review and manage withdrawal requests
          </p>
        </div>
        <Link
          href="/admin/users/users-funds/create?type=Withdrawal"
          className="inline-flex w-fit self-start shrink-0 items-center justify-center rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-semibold text-white whitespace-nowrap bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
        >
          <HandCoins size={14} />
          Withdrawal
        </Link>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="card-elevated shadow-none flex flex-col lg:flex-row gap-4 !p-0 sm:!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search withdrawals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-full pl-10 pr-4"
            />
          </div>
        </div>

        <div className="flex items-center flex-nowrap justify-between gap-1 w-full rounded-full bg-[var(--hover-bg)] p-0.5 sm:w-auto sm:flex-wrap sm:justify-start sm:gap-2 sm:p-1.5">
          <button
            onClick={() => handleStatusFilter(undefined)}
            aria-label="All withdrawals"
            className={`whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all sm:px-4 sm:py-2 sm:text-sm ${
              !status
                ? "bg-[var(--primary)] text-white shadow-none"
                : "text-[var(--text-muted)] hover:bg-white/70"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <FileText size={12} />
              <span className="hidden sm:inline">All</span>
            </span>
          </button>

          <button
            onClick={() => handleStatusFilter("PENDING")}
            aria-label="Pending withdrawals"
            className={`whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all sm:px-4 sm:py-2 sm:text-sm ${
              status === "PENDING"
                ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                : "text-[var(--text-muted)] hover:bg-white/70"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <AlertCircle size={12} />
              <span className="hidden sm:inline">Pending</span>
            </span>
          </button>

          <button
            onClick={() => handleStatusFilter("COMPLETED")}
            aria-label="Completed withdrawals"
            className={`whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all sm:px-4 sm:py-2 sm:text-sm ${
              status === "COMPLETED"
                ? "bg-[var(--success)]/15 text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_35%,transparent)]"
                : "text-[var(--text-muted)] hover:bg-white/70"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Check size={12} />
              <span className="hidden sm:inline">Completed</span>
            </span>
          </button>

          <button
            onClick={() => handleStatusFilter("REJECTED")}
            aria-label="Rejected withdrawals"
            className={`whitespace-nowrap px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all sm:px-4 sm:py-2 sm:text-sm ${
              status === "REJECTED"
                ? "bg-[var(--danger)]/15 text-[var(--danger)] border border-[color-mix(in_srgb,var(--danger)_35%,transparent)]"
                : "text-[var(--text-muted)] hover:bg-white/70"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <X size={12} />
              <span className="hidden sm:inline">Rejected</span>
            </span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card-elevated shadow-none">
        <div className="overflow-x-auto">
          <table className="table w-full text-[11px] sm:text-[13px]">
            <thead>
              <tr>
                <th className="font-semibold text-[var(--foreground)]">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} />
                    User
                  </span>
                </th>
                <th className="font-semibold text-[var(--foreground)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet size={13} />
                    Account
                  </span>
                </th>
                <th className="font-semibold text-[var(--foreground)]">Balance</th>
                <th className="font-semibold text-[var(--foreground)]">Hold</th>
                <th className="font-semibold text-[var(--foreground)]">
                  <span className="inline-flex items-center gap-1.5">
                    <DollarSign size={13} />
                    Amount
                  </span>
                </th>
                <th className="font-semibold text-[var(--foreground)] method-status-head">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText size={13} />
                    Method
                  </span>
                </th>
                <th className="font-semibold text-[var(--foreground)] method-status-head">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck size={13} />
                    Status
                  </span>
                </th>
                <th className="font-semibold text-[var(--foreground)]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
                        <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                        Loading withdrawals...
                      </div>
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="text-[var(--text-muted)] space-y-2">
                        <Search className="w-12 h-12 mx-auto opacity-50" />
                        <p>No withdrawals found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w: WithdrawalRow, index: number) => {
                    const hasUser = Boolean(getUserId(w));

                    return (
                      <motion.tr
                        key={w._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group transition-colors duration-200 ${
                          hasUser ? "cursor-pointer hover:!bg-[var(--hover-bg)]" : ""
                        }`}
                        onClick={() => hasUser && goToUserView(w)}
                      >
                        <td>
                          <div className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                            {w.user?.name ?? "--"}
                          </div>
                          <div className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                            {w.user?.email ?? "--"}
                          </div>
                        </td>

                        <td>
                          <div className="font-mono text-[11px] sm:text-sm bg-[var(--input-bg)] px-2 py-1 rounded">
                            {w.account?.account_number ?? "--"}
                          </div>
                          <div className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 capitalize">
                            {w.account?.plan_name ?? w.account?.account_type ?? "--"}
                          </div>
                        </td>

                        <td>
                          <div className="font-semibold text-green-600">
                            ${w.account?.balance?.toLocaleString() ?? "--"}
                          </div>
                        </td>

                        <td>
                          <div className="font-semibold text-amber-600">
                            ${w.account?.hold_balance?.toLocaleString() ?? "--"}
                          </div>
                        </td>

                        <td>
                          <div className="font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                            ${w.amount?.toLocaleString() ?? "--"}
                          </div>
                        </td>

                        <td>
                          <span className="pill method-status-pill bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50">
                            <span className="inline-flex items-center gap-1.5">
                              {getMethodIcon(w.method)}
                              {w.method ?? "--"}
                            </span>
                          </span>
                        </td>

                        <td>
                          <span
                            className={`pill method-status-pill !rounded-md font-semibold ${
                              w.status === "COMPLETED"
                                ? "pill-success"
                                : w.status === "REJECTED"
                                  ? "pill-danger"
                                  : "pill-accent"
                            }`}
                          >
                            {w.status ?? "--"}
                          </span>
                        </td>

                        <td className="text-left">
                          <div className="flex items-center justify-start gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelected(w);
                              }}
                              className="btn p-2"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="card-elevated shadow-none !p-0 w-full max-w-2xl mx-auto my-3 sm:my-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--card-border)] bg-[var(--card-bg)]/95 backdrop-blur">
                  <h3 className="inline-flex items-center gap-2 text-base sm:text-xl font-bold text-[var(--foreground)]">
                    <ArrowUpCircle size={18} />
                    Withdrawal Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)]"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">User</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{selected.user?.name ?? "--"}</p>
                      <p className="text-xs text-[var(--text-muted)]">{selected.user?.email ?? "--"}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Account</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{selected.account?.account_number ?? "--"}</p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">{selected.account?.plan_name ?? selected.account?.account_type ?? "--"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Amount</p>
                      <p className="text-base font-bold text-orange-600">${selected.amount?.toLocaleString() ?? "--"}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Balance / Hold</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        ${selected.account?.balance?.toLocaleString() ?? "--"}
                      </p>
                      <p className="text-xs text-amber-600">
                        Hold: ${selected.account?.hold_balance?.toLocaleString() ?? "--"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Method / Status</p>
                      <span className="pill method-status-pill mt-1 inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50">
                        {getMethodIcon(selected.method)}
                        {selected.method ?? "--"}
                      </span>
                      <span
                        className={`pill method-status-pill !rounded-md mt-1 inline-flex items-center font-semibold ${
                          selected.status === "COMPLETED"
                            ? "pill-success"
                            : selected.status === "REJECTED"
                              ? "pill-danger"
                              : "pill-accent"
                        }`}
                      >
                        {selected.status ?? "--"}
                      </span>
                    </div>
                  </div>

                  {(selected.payout?.upi_id ||
                    selected.payout?.bank_name ||
                    selected.payout?.account_number ||
                    selected.payout?.crypto_address) && (
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-3 sm:p-4 space-y-2">
                      <p className="text-xs font-medium text-[var(--text-muted)]">Payout Details</p>
                      {selected.payout?.upi_id && (
                        <p className="text-sm"><span className="font-semibold">UPI:</span> {selected.payout.upi_id}</p>
                      )}
                      {selected.payout?.bank_name && (
                        <p className="text-sm"><span className="font-semibold">Bank:</span> {selected.payout.bank_name}</p>
                      )}
                      {selected.payout?.account_number && (
                        <p className="text-sm"><span className="font-semibold">Account No:</span> {selected.payout.account_number}</p>
                      )}
                      {selected.payout?.crypto_address && (
                        <p className="text-sm break-all"><span className="font-semibold">Wallet:</span> {selected.payout.crypto_address}</p>
                      )}
                    </div>
                  )}

                  {selected.status === "PENDING" && (
                    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-3 sm:p-4 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleApprove}
                        disabled={approve.isPending}
                        className="btn btn-primary w-full h-11 text-sm sm:text-base"
                      >
                        {approve.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Approve Withdrawal
                          </>
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
                            onChange={(event) => setRejectReason(event.target.value)}
                            className="input resize-none w-full h-24 pr-10"
                            rows={4}
                          />
                          {rejectReason.trim().length === 0 && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 w-4 h-4" />
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleReject}
                        disabled={rejectReason.trim().length === 0 || reject.isPending}
                        className="btn w-full h-11 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reject.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <X size={16} />
                            Reject Withdrawal
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        @media (max-width: 640px) {
          .method-status-head {
            font-size: 9px !important;
          }
          .method-status-pill {
            font-size: 8px !important;
            padding: 4px 7px !important;
            line-height: 1 !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
