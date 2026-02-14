"use client";

import { useState } from "react";
import { useGetAdminAllKyc } from "@/hooks/kyc/useGetAdminAllKyc";
import { useUpdateKycStatus } from "@/hooks/kyc/useUpdateKycStatus";
import Pagination from "../../components/ui/pagination";
import AdminKycTable from "../../components/kyc/AdminKycTable";
import AdminKycViewModal from "../../components/kyc/AdminKycViewModal";
import { AdminKyc } from "@/services/kyc/kyc.types";
import GlobalLoader from "../../components/ui/GlobalLoader";
import toast from "react-hot-toast";
import { CheckCircle2, CircleEllipsis, Layers, XCircle } from "lucide-react";

type KycFilter = "ALL" | "PENDING" | "VERIFIED" | "REJECTED";
type KycAction = "APPROVE" | "REJECT";

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

export default function CompletedKycPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState<KycFilter>("ALL");
  const [selectedKyc, setSelectedKyc] =
    useState<AdminKyc | null>(null);
  const [actionInFlight, setActionInFlight] = useState<KycAction | null>(null);
  const updateStatus = useUpdateKycStatus();

  const { data, isLoading } = useGetAdminAllKyc({
    page,
    limit,
    status:
      filter === "ALL" ? undefined : filter,
  });
  const list = data?.data?.list ?? [];
  const pagination = data?.data?.pagination;

  const handleApprove = async () => {
    if (!selectedKyc) return;
    try {
      setActionInFlight("APPROVE");
      await updateStatus.mutateAsync({
        id: selectedKyc._id,
        payload: { status: "VERIFIED" },
      });
      toast.success("KYC approved successfully");
      setSelectedKyc(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to approve KYC"));
    } finally {
      setActionInFlight(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedKyc) return;
    const trimmed = reason.trim();
    if (!trimmed) return;
    try {
      setActionInFlight("REJECT");
      await updateStatus.mutateAsync({
        id: selectedKyc._id,
        payload: { status: "REJECTED", rejectionReason: trimmed },
      });
      toast.success("KYC rejected successfully");
      setSelectedKyc(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to reject KYC"));
    } finally {
      setActionInFlight(null);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold sm:text-xl">
            Completed KYC
          </h1>

          {/* FILTER TABS */}
          <div
            className="inline-flex flex-wrap items-center gap-1 rounded-xl p-1"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
            }}
          >
            {(
              [
                { value: "ALL", label: "All", icon: Layers },
                { value: "PENDING", label: "Pending", icon: CircleEllipsis },
                { value: "VERIFIED", label: "Verified", icon: CheckCircle2 },
                { value: "REJECTED", label: "Rejected", icon: XCircle },
              ] as const
            ).map((tab) => {
              const isActive = filter === tab.value;
              const Icon = tab.icon;
              const activeStyles: Record<KycFilter, { bg: string; color: string; border: string }> = {
                ALL: {
                  bg: "color-mix(in srgb, var(--primary) 12%, transparent)",
                  color: "var(--primary)",
                  border: "color-mix(in srgb, var(--primary) 25%, transparent)",
                },
                PENDING: {
                  bg: "color-mix(in srgb, var(--accent) 16%, transparent)",
                  color: "var(--accent)",
                  border: "color-mix(in srgb, var(--accent) 30%, transparent)",
                },
                VERIFIED: {
                  bg: "color-mix(in srgb, var(--success) 16%, transparent)",
                  color: "var(--success)",
                  border: "color-mix(in srgb, var(--success) 30%, transparent)",
                },
                REJECTED: {
                  bg: "color-mix(in srgb, var(--danger) 16%, transparent)",
                  color: "var(--danger)",
                  border: "color-mix(in srgb, var(--danger) 30%, transparent)",
                },
              };

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setFilter(tab.value);
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold sm:py-2 sm:text-sm"
                  style={{
                    background: isActive ? activeStyles[tab.value].bg : "transparent",
                    color: isActive ? activeStyles[tab.value].color : "var(--text-muted)",
                    border: `1px solid ${isActive ? activeStyles[tab.value].border : "transparent"}`,
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="p-6 text-center text-sm"><GlobalLoader /></div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
            <div
              className="mb-3 rounded-full px-4 py-2 text-xs font-semibold sm:text-sm"
              style={{
                background: "var(--hover-bg)",
                color: "var(--text-muted)",
              }}
            >
              📂 No Records
            </div>

            <h3 className="text-base font-semibold sm:text-lg">
              No KYC Found
            </h3>

            <p className="mt-1 max-w-md text-xs text-[var(--text-muted)] sm:text-sm">
              There are no KYC records matching the selected filter.
              Try switching between <strong>All</strong>, <strong>Pending</strong>, <strong>Verified</strong>,
              or <strong>Rejected</strong>.
            </p>
          </div>

        ) : (
          <>
            <AdminKycTable
              list={list}
              onView={(k) => setSelectedKyc(k)} // VIEW ONLY
            />

            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                limit={pagination.limit}
                onPageChange={setPage}
                onLimitChange={(l) => {
                  setLimit(l);
                  setPage(1);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* READ-ONLY MODAL */}
      {selectedKyc && (
        <AdminKycViewModal
          key={selectedKyc._id}
          data={selectedKyc}
          loading={updateStatus.isPending}
          actionInFlight={actionInFlight}
          onClose={() => setSelectedKyc(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}
