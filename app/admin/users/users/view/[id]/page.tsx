
"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Copy,
  MapPin,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  User,
  Users,
  Hash,
  Building2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Modal from "@/app/admin/components/ui/Modal";
import GlobalLoader from "@/app/admin/components/ui/GlobalLoader";
import { Toast } from "@/app/admin/components/ui/Toast";
import Pagination from "@/app/admin/components/ui/pagination";
import { useAdminUser } from "@/hooks/useAdminUser";
import { useAdminUserAccounts } from "@/hooks/useAdminUserAccounts";
import { useAdminUserTransactions } from "@/hooks/useAdminUserTransactions";
import { useUpdateAdminUser } from "@/hooks/useUpdateAdminUser";
import { useChangeAdminUserPassword } from "@/hooks/useChangeAdminUserPassword";
import type { AdminUserUpdatePayload } from "@/types/user";
import type { AdminTransaction } from "@/types/transaction";

const kycStyles: Record<string, string> = {
  VERIFIED: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600",
  PENDING: "border-amber-500/40 bg-amber-500/5 text-amber-600",
  NOT_STARTED: "border-slate-400/40 bg-slate-400/5 text-slate-600",
  REJECTED: "border-red-500/40 bg-red-500/5 text-red-600",
};

const txStatusStyles: Record<string, string> = {
  SUCCESS: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  PENDING: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  FAILED: "border-rose-500/40 bg-rose-500/10 text-rose-700",
  REJECTED: "border-slate-500/40 bg-slate-500/10 text-slate-700",
};

const txTypeStyles: Record<string, string> = {
  DEPOSIT: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  WITHDRAW: "border-rose-500/40 bg-rose-500/10 text-rose-700",
  TRADE_PROFIT: "border-sky-500/40 bg-sky-500/10 text-sky-700",
  TRADE_LOSS: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  BONUS: "border-purple-500/40 bg-purple-500/10 text-purple-700",
  ADJUSTMENT: "border-slate-500/40 bg-slate-500/10 text-slate-700",
};

const FieldControl = ({
  icon: Icon,
  children,
  trailing,
  className = "",
}: {
  icon: LucideIcon;
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) => (
  <div
    className={`flex items-center gap-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 ${className}`}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
      <Icon size={16} />
    </span>
    <div className="min-w-0 flex-1">{children}</div>
    {trailing ? (
      <span className="ml-2 text-[var(--text-muted)]">{trailing}</span>
    ) : null}
  </div>
);

type SelectOption = {
  value: string;
  label: string;
  dotClass?: string;
};

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  toneClass = "border-[var(--card-border)] bg-[var(--card-bg)]",
  buttonClassName = "",
  menuClassName = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  toneClass?: string;
  buttonClassName?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const onClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!ref.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick, true);
    document.addEventListener("touchstart", onClick, true);
    return () => {
      document.removeEventListener("mousedown", onClick, true);
      document.removeEventListener("touchstart", onClick, true);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`mt-1 h-10 w-full rounded-xl border px-3 py-2 text-sm font-semibold text-[var(--text-main)] ${toneClass} bg-[var(--card-bg)] ${buttonClassName} flex items-center justify-between transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 ${
          open ? "border-[var(--primary)]/40 bg-[var(--primary)]/5" : ""
        }`}
      >
        <span className="inline-flex min-w-0 flex-1 items-center gap-2">
          {selected?.dotClass && (
            <span className={`h-2.5 w-2.5 rounded-full ${selected.dotClass}`} />
          )}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-40 mt-2 w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden ${menuClassName}`}
        >
          <div className="max-h-64 overflow-auto">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value || opt.label}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition hover:bg-[var(--hover-bg)] ${
                    active
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                      : ""
                  }`}
                >
                  {opt.dotClass && (
                    <span className={`h-2.5 w-2.5 rounded-full ${opt.dotClass}`} />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserViewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params?.id as string | string[] | undefined;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;

  const userQuery = useAdminUser(userId);
  const updateMutation = useUpdateAdminUser();
  const changePasswordMutation = useChangeAdminUserPassword();

  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof AdminUserUpdatePayload, boolean>>>({});
  const [activeTab, setActiveTab] = useState("Fund History");
  const [localProfile, setLocalProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    isMailVerified: boolean;
    kycStatus: string;
  }>({
    name: "",
    email: "",
    phone: "",
    isMailVerified: false,
    kycStatus: "NOT_STARTED",
  });
  const [txPage, setTxPage] = useState(1);
  const [txLimit, setTxLimit] = useState(20);
  const [txAccountId, setTxAccountId] = useState("");
  const [txType, setTxType] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [txReferenceId, setTxReferenceId] = useState("");
  const [txSortBy, setTxSortBy] = useState("createdAt");
  const [txSortDir, setTxSortDir] = useState("desc");
  const [fromDate, setFromDate] = useState<string>(() => {
    const year = new Date().getFullYear();
    return `${year}-01-01`;
  });
  const [toDate, setToDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [draftFromDate, setDraftFromDate] = useState<string>(() => {
    const year = new Date().getFullYear();
    return `${year}-01-01`;
  });
  const [draftToDate, setDraftToDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState<AdminUserUpdatePayload>({
    name: "",
    phone: "",
    isMailVerified: false,
    kycStatus: "NOT_STARTED",
    date_of_birth: "",
    gender: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileFromParams = useMemo(() => {
    const name = searchParams.get("name") ?? "";
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";
    const kycStatus = searchParams.get("kycStatus") ?? "NOT_STARTED";
    const isMailVerified = searchParams.get("isMailVerified") === "true";

    return { name, email, phone, kycStatus, isMailVerified };
  }, [searchParams]);

  const accountsQuery = useAdminUserAccounts({
    userId,
    page: 1,
    limit: 50,
  });

  const accountOptions = useMemo<SelectOption[]>(() => {
    const list = accountsQuery.data?.data ?? [];
    if (!list.length) {
      return [
        {
          value: "",
          label: accountsQuery.isLoading ? "Loading accounts..." : "All Accounts",
          dotClass: "bg-slate-300",
        },
      ];
    }

    return [
      { value: "", label: "All Accounts", dotClass: "bg-slate-300" },
      ...list.map((account) => {
        const typeLabel =
          account.account_type?.toLowerCase() === "demo" ? "Demo" : "Live";
        const planLabel = account.plan_name ? ` • ${account.plan_name}` : "";
        return {
          value: account._id,
          label: `${account.account_number ?? account._id} • ${typeLabel}${planLabel}`,
          dotClass:
            account.account_type?.toLowerCase() === "demo"
              ? "bg-slate-500"
              : "bg-emerald-500",
        };
      }),
    ];
  }, [accountsQuery.data?.data, accountsQuery.isLoading]);

  const transactionsQuery = useAdminUserTransactions({
    userId,
    page: txPage,
    limit: txLimit,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    account: txAccountId || undefined,
    type: txType || undefined,
    status: txStatus || undefined,
    referenceId: txReferenceId || undefined,
    sortBy: txSortBy || undefined,
    sortDir: txSortDir || undefined,
  });

  const txData = transactionsQuery.data?.data ?? [];
  const txPagination = transactionsQuery.data?.pagination;
  const txSummary = transactionsQuery.data?.summary;
  const txTotalPages = txPagination?.totalPages ?? 1;
  const txTotal = txPagination?.total ?? txData.length;

  const formatAmount = (value?: number) => {
    if (value === undefined || value === null) return "--";
    return value.toLocaleString("en-IN");
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const resolveTxType = (tx: AdminTransaction) =>
    (tx.transactionType ?? tx.type ?? "").toString();
  const resolveTxStatus = (tx: AdminTransaction) =>
    (tx.status ?? "").toString();

  useEffect(() => {
    const profile = userQuery.data;
    const source = profile ?? profileFromParams;

    setLocalProfile({
      name: source.name ?? "",
      email: source.email ?? "",
      phone: source.phone ?? "",
      isMailVerified: Boolean(source.isMailVerified),
      kycStatus: source.kycStatus ?? "NOT_STARTED",
    });

    setForm({
      name: source.name ?? "",
      phone: source.phone ?? "",
      isMailVerified: Boolean(source.isMailVerified),
      kycStatus: source.kycStatus ?? "NOT_STARTED",
      date_of_birth: profile?.date_of_birth
        ? profile.date_of_birth.slice(0, 10)
        : "",
      gender: profile?.gender ?? "",
      address_line_1: profile?.address_line_1 ?? "",
      address_line_2: profile?.address_line_2 ?? "",
      city: profile?.city ?? "",
      state: profile?.state ?? "",
      country: profile?.country ?? "",
      pincode: profile?.pincode ?? "",
    });

    setTouched({});
  }, [profileFromParams, userQuery.data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const displayName = localProfile.name || "User";
  const displayEmail = localProfile.email || "--";

  const kycBadgeClass =
    kycStyles[localProfile.kycStatus ?? ""] ||
    "border-[var(--border-subtle)] bg-[var(--chip-bg)] text-[var(--text-muted)]";

  const mailBadgeClass = localProfile.isMailVerified
    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-600"
    : "border-amber-500/40 bg-amber-500/5 text-amber-600";

  const canSubmit = useMemo(
    () => !updateMutation.isPending,
    [updateMutation.isPending]
  );

  const handleChange =
    (key: keyof AdminUserUpdatePayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => ({ ...prev, [key]: true }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;

    const payload = (Object.keys(form) as Array<keyof AdminUserUpdatePayload>).reduce(
      (acc, key) => {
        if (touched[key]) {
          acc[key] = form[key] as never;
        }
        return acc;
      },
      {} as AdminUserUpdatePayload
    );

    if (Object.keys(payload).length === 0) {
      setToast("No changes to update.");
      setEditOpen(false);
      return;
    }

    updateMutation.mutate(
      { id: userId, payload },
      {
        onSuccess: (resp: any) => {
          const msg =
            resp?.message || resp?.data?.message || "Profile updated successfully";
          const nextProfile = {
            name: form.name ?? localProfile.name,
            email: localProfile.email,
            phone: form.phone ?? localProfile.phone,
            isMailVerified: form.isMailVerified ?? localProfile.isMailVerified,
            kycStatus: form.kycStatus ?? localProfile.kycStatus,
          };

          setLocalProfile(nextProfile);
          setTouched({});
          setEditOpen(false);
          setToast(msg);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Update failed. Please try again.";
          setToast(msg);
        },
      }
    );
  };

  const handleCopy = async (value: string, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setToast(`${label} copied.`);
    } catch {
      setToast("Copy failed.");
    }
  };

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    setPasswordError("");

    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!newPassword || !confirmPassword) {
      setPasswordError("Please enter and confirm the new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    changePasswordMutation.mutate(
      { userId, newPassword },
      {
        onSuccess: (resp: any) => {
          const msg =
            resp?.message ||
            resp?.data?.message ||
            "Password updated successfully";
          setToast(msg);
          setPasswordForm({ newPassword: "", confirmPassword: "" });
          setPasswordOpen(false);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Unable to update password.";
          setPasswordError(msg);
        },
      }
    );
  };

  return (
    <div className="container-pad space-y-5 text-[var(--foreground)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]">
            <span className="h-7 w-7 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              <Download size={14} />
            </span>
            Export Trades
          </button>
          <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]">
            <span className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Download size={14} />
            </span>
            Export Funds
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-5">
        {userQuery.isLoading ? (
          <div className="py-6">
            <GlobalLoader />
          </div>
        ) : userQuery.isError ? (
          <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>Unable to load latest user data from server.</span>
            <button
              type="button"
              onClick={() => userQuery.refetch()}
              className="w-fit rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{displayName}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={14} />
                  {displayEmail}
                  {displayEmail && displayEmail !== "--" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(displayEmail, "Email")}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                      aria-label="Copy email"
                    >
                      <Copy size={12} />
                    </button>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={14} />
                  {localProfile.phone || "--"}
                  {localProfile.phone && localProfile.phone !== "--" && (
                    <button
                      type="button"
                      onClick={() => handleCopy(localProfile.phone, "Phone")}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                      aria-label="Copy phone"
                    >
                      <Copy size={12} />
                    </button>
                  )}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 uppercase tracking-wide ${mailBadgeClass}`}
                >
                  <Mail size={12} />
                  {localProfile.isMailVerified ? "MAIL VERIFIED" : "MAIL UNVERIFIED"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 uppercase tracking-wide ${kycBadgeClass}`}
                >
                  <ShieldCheck size={12} />
                  KYC {(localProfile.kycStatus || "STATUS").replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setViewOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]"
              >
                <Eye size={16} /> View Details
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]"
              >
                <Pencil size={16} /> Update
              </button>
              <button
                onClick={() => setPasswordOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-medium hover:bg-[var(--hover-bg)]"
              >
                <KeyRound size={16} /> Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {["Fund History", "Active Trades", "Closed Trades", "Pending Trades"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {activeTab === "Fund History" && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Fund - Withdrawal & Deposits</h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                <span>Total: {txTotal}</span>
                {txSummary?.totalAmount !== undefined && (
                  <span>Total Amount: {txSummary.totalAmount.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <div className="flex w-full flex-col gap-1 sm:w-auto">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  From
                </span>
                <div className="relative w-full sm:w-auto">
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                  <input
                    type="date"
                    value={draftFromDate || ""}
                    onChange={(e) => setDraftFromDate(e.target.value || "")}
                    className="w-full sm:w-[170px] rounded-lg border border-[var(--input-border)] bg-[var(--card-bg)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-1 sm:w-auto">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                  To
                </span>
                <div className="relative w-full sm:w-auto">
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                  <input
                    type="date"
                    value={draftToDate || ""}
                    onChange={(e) => setDraftToDate(e.target.value || "")}
                    className="w-full sm:w-[170px] rounded-lg border border-[var(--input-border)] bg-[var(--card-bg)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFromDate(draftFromDate);
                  setToDate(draftToDate);
                  setTxPage(1);
                }}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
              >
                Apply Dates
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Account
              </label>
              <CustomSelect
                value={txAccountId}
                onChange={(next) => {
                  setTxAccountId(next);
                  setTxPage(1);
                }}
                placeholder="All Accounts"
                toneClass="border-slate-300/70"
                options={accountOptions}
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Type
              </label>
              <CustomSelect
                value={txType}
                onChange={(next) => {
                  setTxType(next);
                  setTxPage(1);
                }}
                placeholder="All Types"
                toneClass="border-amber-300/70"
                options={[
                  { value: "", label: "All Types", dotClass: "bg-slate-300" },
                  { value: "DEPOSIT", label: "Deposit", dotClass: "bg-emerald-500" },
                  { value: "WITHDRAW", label: "Withdraw", dotClass: "bg-amber-500" },
                  { value: "TRADE_PROFIT", label: "Trade Profit", dotClass: "bg-sky-500" },
                  { value: "TRADE_LOSS", label: "Trade Loss", dotClass: "bg-rose-500" },
                  { value: "BONUS", label: "Bonus", dotClass: "bg-purple-500" },
                  { value: "ADJUSTMENT", label: "Adjustment", dotClass: "bg-slate-500" },
                ]}
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Status
              </label>
              <CustomSelect
                value={txStatus}
                onChange={(next) => {
                  setTxStatus(next);
                  setTxPage(1);
                }}
                placeholder="All Status"
                toneClass="border-rose-300/70"
                options={[
                  { value: "", label: "All Status", dotClass: "bg-slate-300" },
                  { value: "SUCCESS", label: "Success", dotClass: "bg-emerald-500" },
                  { value: "PENDING", label: "Pending", dotClass: "bg-amber-500" },
                  { value: "FAILED", label: "Failed", dotClass: "bg-rose-500" },
                  { value: "REJECTED", label: "Rejected", dotClass: "bg-slate-500" },
                ]}
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Reference Id
              </label>
              <input
                value={txReferenceId}
                onChange={(e) => {
                  setTxReferenceId(e.target.value);
                  setTxPage(1);
                }}
                placeholder="Search reference id"
                className="mt-1 w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                  Sort By
                </label>
                <CustomSelect
                  value={txSortBy}
                  onChange={(next) => {
                    setTxSortBy(next);
                    setTxPage(1);
                  }}
                  placeholder="Created At"
                  toneClass="border-sky-300/70"
                  options={[
                    { value: "createdAt", label: "Created At", dotClass: "bg-emerald-500" },
                    { value: "amount", label: "Amount", dotClass: "bg-sky-500" },
                    { value: "status", label: "Status", dotClass: "bg-amber-500" },
                    { value: "type", label: "Type", dotClass: "bg-slate-500" },
                  ]}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                  Direction
                </label>
                <CustomSelect
                  value={txSortDir}
                  onChange={(next) => {
                    setTxSortDir(next);
                    setTxPage(1);
                  }}
                  placeholder="Desc"
                  toneClass="border-violet-300/70"
                  options={[
                    { value: "desc", label: "Desc", dotClass: "bg-slate-600" },
                    { value: "asc", label: "Asc", dotClass: "bg-slate-400" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTxType("");
                setTxStatus("");
                setTxReferenceId("");
                setTxAccountId("");
                setTxSortBy("createdAt");
                setTxSortDir("desc");
                setTxPage(1);
              }}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-xs font-medium hover:bg-[var(--hover-bg)]"
            >
              Reset Filters
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="bg-[var(--input-bg)] text-[var(--text-muted)] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Remark</th>
                  <th className="px-4 py-3">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactionsQuery.isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <GlobalLoader />
                    </td>
                  </tr>
                ) : transactionsQuery.isError ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-[var(--danger)]">
                      Failed to load transactions.
                    </td>
                  </tr>
                ) : txData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-[var(--text-muted)]">
                      No transactions found for selected date range.
                    </td>
                  </tr>
                ) : (
                  txData.map((tx: AdminTransaction) => (
                    <tr
                      key={tx._id ?? `${tx.createdAt}-${tx.amount}`}
                      className="border-t border-[var(--card-border)]"
                    >
                      <td className="px-4 py-3 font-medium">{formatAmount(tx.amount)}</td>
                      <td className="px-4 py-3">{formatDateTime(tx.createdAt)}</td>
                      <td className="px-4 py-3">
                        {resolveTxType(tx) ? (
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                              txTypeStyles[resolveTxType(tx)] ??
                              "border-[var(--card-border)] bg-[var(--chip-bg)] text-[var(--text-muted)]"
                            }`}
                          >
                            {resolveTxType(tx).replaceAll("_", " ")}
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {resolveTxStatus(tx) ? (
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                              txStatusStyles[resolveTxStatus(tx)] ??
                              "border-[var(--card-border)] bg-[var(--chip-bg)] text-[var(--text-muted)]"
                            }`}
                          >
                            {resolveTxStatus(tx)}
                          </span>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="px-4 py-3">{tx.referenceId ?? "--"}</td>
                      <td className="px-4 py-3">{tx.remark ?? tx.notes ?? "--"}</td>
                      <td className="px-4 py-3">{formatAmount(tx.balanceAfter)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={txPage}
            totalPages={txTotalPages}
            limit={txLimit}
            onPageChange={setTxPage}
            onLimitChange={(next) => {
              setTxLimit(next);
              setTxPage(1);
            }}
          />
        </div>
      )}


      {activeTab !== "Fund History" && (
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-sm text-[var(--text-muted)]">
          No data available for {activeTab}.
        </div>
      )}

      <Modal
        title="User Details"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <User size={12} /> Full Name
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.name ?? localProfile.name ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Mail size={12} /> Email
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.email ?? localProfile.email ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Phone size={12} /> Phone
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.phone ?? localProfile.phone ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Mail size={12} /> Mail Verified
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${mailBadgeClass}`}
              >
                {localProfile.isMailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <ShieldCheck size={12} /> KYC Status
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${kycBadgeClass}`}
              >
                {(localProfile.kycStatus || "STATUS").replaceAll("_", " ")}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Calendar size={12} /> Date of Birth
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.date_of_birth
                ? userQuery.data.date_of_birth.slice(0, 10)
                : "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Users size={12} /> Gender
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.gender ?? form.gender ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 sm:col-span-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <MapPin size={12} /> Address Line 1
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.address_line_1 ?? form.address_line_1 ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 sm:col-span-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Building2 size={12} /> Address Line 2
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.address_line_2 ?? form.address_line_2 ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <MapPin size={12} /> City
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.city ?? form.city ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <MapPin size={12} /> State
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.state ?? form.state ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Globe size={12} /> Country
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.country ?? form.country ?? "--"}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
              <Hash size={12} /> Pincode
            </div>
            <p className="mt-1 text-sm font-medium">
              {userQuery.data?.pincode ?? form.pincode ?? "--"}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        title="Edit Profile"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        size="xl"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold hover:bg-[var(--hover-bg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              disabled={!canSubmit}
              className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              Save Changes
            </button>
          </div>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">Full Name</label>
              <FieldControl icon={User}>
                <input
                  value={form.name ?? ""}
                  onChange={handleChange("name")}
                  placeholder="Enter full name"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">Phone</label>
              <FieldControl icon={Phone}>
                <input
                  value={form.phone ?? ""}
                  onChange={handleChange("phone")}
                  placeholder="Enter phone number"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <Mail size={12} /> Mail Verified
              </label>
              <CustomSelect
                value={form.isMailVerified ? "true" : "false"}
                onChange={(next) => {
                  setForm((prev) => ({ ...prev, isMailVerified: next === "true" }));
                  setTouched((prev) => ({ ...prev, isMailVerified: true }));
                }}
                placeholder="Select status"
                options={[
                  { value: "true", label: "Verified", dotClass: "bg-emerald-500" },
                  { value: "false", label: "Unverified", dotClass: "bg-amber-500" },
                ]}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <ShieldCheck size={12} /> KYC Status
              </label>
              <CustomSelect
                value={form.kycStatus || "NOT_STARTED"}
                onChange={(next) => {
                  setForm((prev) => ({ ...prev, kycStatus: next }));
                  setTouched((prev) => ({ ...prev, kycStatus: true }));
                }}
                placeholder="Select KYC status"
                options={[
                  { value: "VERIFIED", label: "Verified", dotClass: "bg-emerald-500" },
                  { value: "PENDING", label: "Pending", dotClass: "bg-amber-500" },
                  { value: "NOT_STARTED", label: "Not Started", dotClass: "bg-slate-500" },
                  { value: "REJECTED", label: "Rejected", dotClass: "bg-rose-500" },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">Date of Birth</label>
              <FieldControl icon={Calendar}>
                <input
                  type="date"
                  value={form.date_of_birth ?? ""}
                  onChange={handleChange("date_of_birth")}
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none"
                />
              </FieldControl>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <Users size={12} /> Gender
              </label>
              <CustomSelect
                value={form.gender ?? ""}
                onChange={(next) => {
                  setForm((prev) => ({ ...prev, gender: next }));
                  setTouched((prev) => ({ ...prev, gender: true }));
                }}
                placeholder="Select gender"
                options={[
                  { value: "MALE", label: "Male", dotClass: "bg-sky-500" },
                  { value: "FEMALE", label: "Female", dotClass: "bg-pink-500" },
                  { value: "OTHER", label: "Other", dotClass: "bg-slate-500" },
                ]}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[var(--text-muted)]">Address Line 1</label>
              <FieldControl icon={MapPin}>
                <input
                  value={form.address_line_1 ?? ""}
                  onChange={handleChange("address_line_1")}
                  placeholder="Enter address line 1"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[var(--text-muted)]">Address Line 2</label>
              <FieldControl icon={Building2}>
                <input
                  value={form.address_line_2 ?? ""}
                  onChange={handleChange("address_line_2")}
                  placeholder="Enter address line 2"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">City</label>
              <FieldControl icon={MapPin}>
                <input
                  value={form.city ?? ""}
                  onChange={handleChange("city")}
                  placeholder="Enter city"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">State</label>
              <FieldControl icon={MapPin}>
                <input
                  value={form.state ?? ""}
                  onChange={handleChange("state")}
                  placeholder="Enter state"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">Country</label>
              <FieldControl icon={Globe}>
                <input
                  value={form.country ?? ""}
                  onChange={handleChange("country")}
                  placeholder="Enter country"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)]">Pincode</label>
              <FieldControl icon={Hash}>
                <input
                  value={form.pincode ?? ""}
                  onChange={handleChange("pincode")}
                  placeholder="Enter pincode"
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </FieldControl>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title="Change Password"
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPasswordOpen(false)}
              className="rounded-sm border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold hover:bg-[var(--hover-bg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="change-password-form"
              className="rounded-sm border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80"
            >
              Change
            </button>
          </div>
        }
      >
        <form id="change-password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {passwordError}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)]">New Password</label>
            <FieldControl
              icon={KeyRound}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            >
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
                className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </FieldControl>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)]">Confirm Password</label>
            <FieldControl
              icon={KeyRound}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </FieldControl>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast} />}
    </div>
  );
}
