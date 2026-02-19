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

  const totalPlans = data.length;
  const activePlans = data.filter((plan) => plan.isActive).length;
  const demoPlans = data.filter((plan) => plan.is_demo_allowed).length;

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
    <div className="container-pad space-y-4 max-w-7xl overflow-hidden !p-0 sm:!p-[18px]">
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-[var(--text-main)]">
              Account Plans
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Configure pricing, leverage, and plan-level trading rules.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap lg:justify-end">
            <span className="inline-flex items-center rounded-full border border-[var(--card-border)] bg-[var(--chip-bg)] px-3 py-1 text-xs text-[var(--text-main)]">
              Total: {totalPlans}
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600">
              Active: {activePlans}
            </span>
            <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-600">
              Demo: {demoPlans}
            </span>

            <button
              className="btn border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--hover-bg)] sm:ml-1"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              Add Plan
            </button>
          </div>
        </div>
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
