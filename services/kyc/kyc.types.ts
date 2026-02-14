export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface KycUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface KycImage {
  image_url: string;
  image_public_id: string;
}

export interface KycDocuments {
  front?: KycImage;
  back?: KycImage;
  selfie?: KycImage;
}

export interface AdminKyc {
  _id: string;
  user: KycUser;
  documentType?: string | null;
  documents: KycDocuments;
  status: KycStatus;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminKycListResponse {
  success: boolean;
  data: {
    list: AdminKyc[];
    pagination: Pagination;
  };
}
