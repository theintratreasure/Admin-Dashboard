import api from "@/api/axios";

export type PaymentType = "BANK" | "UPI" | "CRYPTO" | "INTERNATIONAL";

export interface PaymentMethodPayload {
  type: PaymentType;
  title: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
  branch?: string;
  upi_id?: string;
  crypto_network?: string;
  crypto_address?: string;
  international_name?: string;
  international_email?: string;
  image_url: string;
  image_public_id: string;
}

export const paymentService = {
  list: async () => (await api.get("/payment-methods/all")).data,
  create: async (p: PaymentMethodPayload) =>
    (await api.post("/payment-methods", p)).data,
  update: async (id: string, p: Partial<PaymentMethodPayload>) =>
    (await api.put(`/payment-methods/${id}`, p)).data,
  remove: async (id: string) =>
    (await api.delete(`/payment-methods/${id}`)).data,
  toggle: async (id: string, is_active: boolean) =>
    (await api.patch(`/payment-methods/${id}/status`, { is_active })).data,
};
