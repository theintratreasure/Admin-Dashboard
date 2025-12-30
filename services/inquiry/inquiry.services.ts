// services/inquiry/inquiry.services.ts
import api from "@/api/axios";
import { GetInquiryResponse } from "@/types/inquiry";

export async function getInquiryService(
  page = 1,
  limit = 20
): Promise<GetInquiryResponse> {
  const res = await api.get(`/inquiry?page=${page}&limit=${limit}`);
  return res.data;
}
