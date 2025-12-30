"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { useGetAdminAllKyc } from "@/hooks/kyc/useGetAdminAllKyc";
import { useUpdateKycStatus } from "@/hooks/kyc/useUpdateKycStatus";
import { AdminKyc } from "@/services/kyc/kyc.types";

import AdminKycTable from "../../components/kyc/AdminKycTable";
import Pagination from "../../components/ui/pagination";
import AdminKycViewModal from "../../components/kyc/AdminKycViewModal";
import AdminCard from "../../components/ui/AdminCard";

export default function PendingKycPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedKyc, setSelectedKyc] =
    useState<AdminKyc | null>(null);

  const { data, isLoading } = useGetAdminAllKyc({
    status: "PENDING",
    page,
    limit: 10,
  });

  const { mutate: updateStatus, isPending } =
    useUpdateKycStatus();

  const list = data?.data?.list ?? [];
  const pagination = data?.data?.pagination;

  const approve = (kyc: AdminKyc) => {
    updateStatus(
      { id: kyc._id, payload: { status: "VERIFIED" } },
      {
        onSuccess: () => {
          toast.success("KYC approved");
          setSelectedKyc(null);
        },
      }
    );
  };

  const reject = (kyc: AdminKyc, reason: string) => {
    updateStatus(
      {
        id: kyc._id,
        payload: {
          status: "REJECTED",
          rejectionReason: reason,
        },
      },
      {
        onSuccess: () => {
          toast.success("KYC rejected");
          setSelectedKyc(null);
        },
      }
    );
  };

  return (
    <>
      <AdminCard title="Pending KYC Requests">
        {isLoading ? (
          <p>Loading…</p>
        ) : (
          <>
            <AdminKycTable
              list={list}
              onView={(k) => setSelectedKyc(k)}
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
      </AdminCard>

      {/* MODAL MUST BE OUTSIDE CARD */}
      {selectedKyc && (
        <AdminKycViewModal
          data={selectedKyc}
          loading={isPending}
          onClose={() => setSelectedKyc(null)}
          onApprove={() => approve(selectedKyc)}
          onReject={(reason) =>
            reject(selectedKyc, reason)
          }
        />
      )}
    </>
  );
}
