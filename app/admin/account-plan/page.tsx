"use client";

import { useState } from "react";
import {
  useAccountPlans,
  useCreateAccountPlan,
  useUpdateAccountPlan,
  useDeleteAccountPlan,
} from "@/hooks/useAccountPlans";
import { AccountPlan, AccountPlanPayload } from "@/types/accountPlan";
import AccountPlanTable from "../components/account-plans/AccountPlanTable";
import AccountPlanModal from "../components/account-plans/AccountPlanModal";
import GlobalLoader from "../components/ui/GlobalLoader";

export default function AccountPlansPage() {
  const { data = [], isLoading } = useAccountPlans();
  const createPlan = useCreateAccountPlan();
  const deletePlan = useDeleteAccountPlan();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AccountPlan | null>(null);

  const updatePlan = useUpdateAccountPlan(editing?._id || "");

  const submit = (payload: AccountPlanPayload) => {
    if (editing) {
      updatePlan.mutate(payload, {
        onSuccess: () => {
          setModalOpen(false);
          setEditing(null);
        },
      });
    } else {
      createPlan.mutate(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  return (
    <div className="container-pad space-y-4 max-w-6xl overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Account Plans</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Create Plan
        </button>
      </div>

      {isLoading ? (
        <div className="card-elevated p-6 text-center text-sm">
          <GlobalLoader/>
        </div>
      ) : (
        <AccountPlanTable
          data={data}
          onEdit={(p) => {
            setEditing(p);
            setModalOpen(true);
          }}
          onDelete={(id) => deletePlan.mutate(id)}
        />
      )}

      <AccountPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editing}
        onSubmit={submit}
        loading={createPlan.isPending || updatePlan.isPending}
      />
    </div>
  );
}
