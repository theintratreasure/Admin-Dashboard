import api from "@/api/axios";
import { AccountPlan, AccountPlanPayload } from "@/types/accountPlan";

export const accountPlanService = {
  getAll: async (): Promise<AccountPlan[]> => {
    const { data } = await api.get("/account-plans");
    return data.data;
  },

  create: async (payload: AccountPlanPayload): Promise<AccountPlan> => {
    const { data } = await api.post("/account-plans", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: AccountPlanPayload
  ): Promise<AccountPlan> => {
    const { data } = await api.put(`/account-plans/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<string> => {
    await api.delete(`/account-plans/${id}`);
    return id;
  },
};
