"use client";

import { useState } from "react";
import { useInquiry } from "@/hooks/useInquiry";
import { Inquiry } from "@/types/inquiry";
import Pagination from "../components/ui/pagination";

export default function InquiryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useInquiry(page, limit);

  if (isLoading) {
    return <div className="p-6">Loading inquiries...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">User Inquiries</h1>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <table className="w-full text-sm">
          <thead style={{ background: "var(--hover-bg)" }}>
            <tr>
              {["Name", "Email", "Phone", "Title", "Message", "Date"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {data?.data.map((item: Inquiry) => (
              <tr
                key={item._id}
                className="border-t"
                style={{ borderColor: "var(--card-border)" }}
              >
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />
    </div>
  );
}
