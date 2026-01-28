"use client";

import { useState } from "react";
import { useGetAdminAllKyc } from "@/hooks/kyc/useGetAdminAllKyc";
import Pagination from "../../components/ui/pagination";
import AdminKycTable from "../../components/kyc/AdminKycTable";
import AdminKycViewModal from "../../components/kyc/AdminKycViewModal";
import { AdminKyc } from "@/services/kyc/kyc.types";
import GlobalLoader from "../../components/ui/GlobalLoader";

type KycFilter = "ALL" | "VERIFIED" | "REJECTED";

export default function CompletedKycPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState<KycFilter>("ALL");
  const [selectedKyc, setSelectedKyc] =
    useState<AdminKyc | null>(null);

  const { data, isLoading } = useGetAdminAllKyc({
    page,
    limit,
    status:
      filter === "ALL" ? undefined : filter,
  });
  const list = data?.data?.list ?? [];
  const pagination = data?.data?.pagination;

  return (
    <>
      <div className="p-6 space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Completed KYC
          </h1>

          {/* FILTER */}
          <select value={filter} onChange={(e) => { setFilter(e.target.value as KycFilter); setPage(1); }} className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", }} >
            <option value="ALL">All</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="p-6 text-center text-sm"><GlobalLoader /></div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="mb-3 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: "var(--hover-bg)",
                color: "var(--text-muted)",
              }}
            >
              📂 No Records
            </div>

            <h3 className="text-lg font-semibold">
              No KYC Found
            </h3>

            <p className="mt-1 max-w-md text-sm text-[var(--text-muted)]">
              There are no KYC records matching the selected filter.
              Try switching between <strong>All</strong>, <strong>Verified</strong>,
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
          data={selectedKyc}
          loading={false}
          onClose={() => setSelectedKyc(null)}
          onApprove={() => { }}
          onReject={() => { }}
        />
      )}
    </>
  );
}