import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountPlanService } from "@/services/accountPlan.service";
import { AccountPlan, AccountPlanPayload } from "@/types/accountPlan";

const KEY = ["account-plans"];

export const useAccountPlans = () =>
  useQuery({
    queryKey: KEY,
    queryFn: accountPlanService.getAll,
    staleTime: 1000 * 30,
  });

export const useCreateAccountPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: accountPlanService.create,
    onSuccess: (newPlan) => {
      qc.setQueryData<AccountPlan[]>(KEY, (old = []) => [
        newPlan,
        ...old,
      ]);
    },
  });
};

export const useUpdateAccountPlan = (id: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AccountPlanPayload) =>
      accountPlanService.update(id, payload),

    onSuccess: (updated) => {
      qc.setQueryData<AccountPlan[]>(KEY, (old = []) =>
        old.map((p) => (p._id === id ? updated : p))
      );
    },
  });
};

export const useDeleteAccountPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: accountPlanService.remove,
    onSuccess: (id) => {
      qc.setQueryData<AccountPlan[]>(KEY, (old = []) =>
        old.filter((p) => p._id !== id)
      );
    },
  });
};
