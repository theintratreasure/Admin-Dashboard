"use client";

import { useState } from "react";
import { usePaymentMethods } from "@/hooks/payment-method/usePaymentMethods";
import PaymentMethodCard from "./PaymentMethodCard";
import AddPaymentModal from "./AddPaymentModal";
import GlobalLoader from "../ui/GlobalLoader";
import EditPaymentModal from "./EditPaymentModal";

export default function PaymentMethodPage() {
  const { data, isLoading } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="container-pad space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Payment methods
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)] max-w-xl">
            Manage bank accounts, UPI IDs, and crypto wallets used for customer payments.
          </p>
        </div>

        <button
          className="
          btn btn-primary
          text-sm font-medium
          shadow-[var(--shadow-1)]
          hover:opacity-90
          transition
          "
          onClick={() => setAddOpen(true)}
          type="button"
        >
          + Add payment method
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {data?.data?.map((item: any) => (
          <PaymentMethodCard
            key={item._id}
            data={item}
            onEdit={() => setEditData(item)}
          />
        ))}
      </div>

      {addOpen && <AddPaymentModal onClose={() => setAddOpen(false)} />}
      {editData && (
        <EditPaymentModal
          data={editData}
          onClose={() => setEditData(null)}
        />
      )}
    </div>
  );
}
