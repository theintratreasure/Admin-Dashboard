// hooks/useInquiry.ts
import { useQuery } from "@tanstack/react-query";
import { getInquiryService } from "@/services/inquiry/inquiry.services";
import { GetInquiryResponse } from "@/types/inquiry";

export const useInquiry = (page: number, limit: number) =>
  useQuery<GetInquiryResponse>({
    queryKey: ["inquiries", page, limit],
    queryFn: () => getInquiryService(page, limit),
    placeholderData: (prev) => prev, // ✅ v5 replacement
  });
