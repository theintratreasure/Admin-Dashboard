"use client";

import { useState } from "react";
import { Eye, Check, X, Search } from "lucide-react";
import { useGetAdminAllKyc } from "@/hooks/kyc/useGetAdminAllKyc";
import { useUpdateKycStatus } from "@/hooks/kyc/useUpdateKycStatus";

type KycUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  docs?: string[];
};

export default function UserKYC() {
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] =
    useState<"PENDING" | "VERIFIED" | "REJECTED">("PENDING");

  const { data, isLoading, isError } = useGetAdminAllKyc({
    status: statusFilter,
    page: 1,
    limit: 10,
  });

  const { mutate: updateStatus, isPending } = useUpdateKycStatus();

  const users: KycUser[] = data?.data?.list ?? data?.data ?? [];

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load KYC</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">KYC Requests</h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3">
        <div className="flex gap-2 border p-2 rounded w-full">
          <Search size={18} />
          <input
            className="w-full outline-none"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
          className="border p-2 rounded"
        >
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tbody key={u._id}>
              <tr className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>

                {/* STATUS BADGE */}
                <td className="p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : u.status === "VERIFIED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() =>
                      setOpenRow(openRow === u._id ? null : u._id)
                    }
                  >
                    <Eye size={14} />
                  </button>

                  {u.status === "PENDING" && (
                    <>
                      <button
                        disabled={isPending}
                        onClick={() =>
                          updateStatus({
                            kycId: u._id,
                            payload: { status: "VERIFIED" },
                          })
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        disabled={isPending}
                        onClick={() => {
                          if (!rejectReason[u._id]) {
                            alert("Please enter rejection reason");
                            return;
                          }

                          updateStatus({
                            kycId: u._id,
                            payload: {
                              status: "REJECTED",
                              rejectionReason: rejectReason[u._id],
                            },
                          });
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* EXPAND ROW */}
              {openRow === u._id && (
                <tr>
                  <td colSpan={4} className="p-3 bg-gray-50">
                    <p>
                      <b>Name:</b> {u.name}
                    </p>
                    <p>
                      <b>Email:</b> {u.email}
                    </p>

                    {u.status === "PENDING" && (
                      <textarea
                        className="w-full border mt-2 p-2"
                        placeholder="Reject reason"
                        value={rejectReason[u._id] || ""}
                        onChange={(e) =>
                          setRejectReason((p) => ({
                            ...p,
                            [u._id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </tbody>
      </table>
    </div>
  );
}
