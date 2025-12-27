import api from "@/api/axios";



export type PaymentType = "BANK" | "UPI" | "CRYPTO";

export type AddPaymentMethodPayload = {
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

  image_url: string;
  image_public_id: string;
};

export const addPaymentMethodService = async (
  payload: AddPaymentMethodPayload
) => {
  const res = await api.post("/payment-methods", payload);
  return res.data;
};


export const getPaymentMethodsService = async () => {
  const res = await api.get("/payment-methods/all");
  return res.data;
};


export const togglePaymentStatusService = async ({
  id,
  is_active,
}: {
  id: string;
  is_active: boolean;
}) => {
  const res = await api.patch(
    `/payment-methods/${id}/status`,
    { is_active }
  );
  return res.data;
};


export const updatePaymentMethodService = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<AddPaymentMethodPayload>;
}) => {
  const res = await api.put(`/payment-methods/${id}`, payload);
  return res.data;
};


export const deletePaymentMethodService = async (id: string) => {
  const res = await api.delete(`/payment-methods/${id}`);
  return res.data;
};
