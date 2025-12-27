import api from "@/api/axios";


export type Inquiry = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type GetInquiryResponse = {
  success: boolean;
  data: {
    docs: Inquiry[];
    page: number;
    limit: number;
    totalPages: number;
    totalDocs: number;
  };
};


export async function getInquiryService(
  page = 1,
  limit = 20
): Promise<GetInquiryResponse> {
  const res = await api.get(
    `/inquiry?page=${page}&limit=${limit}` 
  );
  return res.data;
}
