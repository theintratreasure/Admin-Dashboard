"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useInquiry } from "@/hooks/useInquiry";

export default function InquiryPage() {
  const [page, setPage] = useState(1);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (!token) {
    return (
      <div className="p-6 text-yellow-500">
        Admin login required to view inquiries.
      </div>
    );
  }

  const { data, isLoading, error } = useInquiry(page, 20);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Unauthorized access. Please login as Admin.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="text-[var(--primary)]" />
        Inquiry List
      </h1>

      <div
        className="rounded-xl border overflow-x-auto"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <table className="w-full">
          <thead style={{ background: "var(--input-bg)" }}>
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.docs?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-[var(--text-muted)]"
                >
                  No inquiries found
                </td>
              </tr>
            )}

            {data?.data?.docs?.map((item) => (
              <tr key={item._id}>
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-[var(--text-muted)]">
                  {item.email}
                </td>
                <td className="p-3">{item.message}</td>
                <td className="p-3 text-sm text-[var(--text-muted)]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          disabled={
            !data?.data?.totalPages ||
            page === data.data.totalPages
          }
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
