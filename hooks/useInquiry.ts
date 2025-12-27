import { useQuery } from "@tanstack/react-query";
import { getInquiryService } from "@/services/inquiry/inquiry.services";

export const useInquiry = (page: number, limit = 20) =>
  useQuery({
    queryKey: ["inquiries", page, limit],
    queryFn: () => getInquiryService(page, limit),

    
    placeholderData: (previousData) => previousData,
  });
