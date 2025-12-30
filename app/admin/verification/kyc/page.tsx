"use client";

import { useState } from "react";
import { useGetAdminAllKyc } from "@/hooks/kyc/useGetAdminAllKyc";
import Pagination from "../../components/ui/pagination";
import AdminKycTable from "../../components/kyc/AdminKycTable";
import AdminKycViewModal from "../../components/kyc/AdminKycViewModal";
import { AdminKyc } from "@/services/kyc/kyc.types";

export default function CompletedKycPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedKyc, setSelectedKyc] =
    useState<AdminKyc | null>(null);

  const { data, isLoading } = useGetAdminAllKyc({
    page,
    limit: 10,
  });

  // ✅ ONLY VERIFIED + REJECTED
  const list =
    data?.data?.list.filter(
      (k) => k.status !== "PENDING"
    ) ?? [];

  const pagination = data?.data?.pagination;

  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">
          Completed KYC
        </h1>

        {isLoading ? (
          <p>Loading…</p>
        ) : (
          <>
            <AdminKycTable
              list={list}
              onView={(k) => setSelectedKyc(k)} // ✅ VIEW ONLY
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

      {/* ================= READ-ONLY MODAL ================= */}
      {selectedKyc && (
        <AdminKycViewModal
          data={selectedKyc}
          loading={false}
          onClose={() => setSelectedKyc(null)}
          onApprove={() => { }} // 🔒 disabled
          onReject={() => { }}  // 🔒 disabled
        />
      )}
    </>
  );
}
