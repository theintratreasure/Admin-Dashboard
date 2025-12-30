// types/inquiry.ts

export type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  ip: string;
  createdAt: string;
};

export type GetInquiryResponse = {
  success: boolean;
  data: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
};
