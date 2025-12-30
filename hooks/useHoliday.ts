import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  holidayService,
  HolidayListResponse,
} from "@/services/holiday/holiday.service";

/* ================= GET ================= */

export const useHolidays = (page: number, limit: number) =>
  useQuery<HolidayListResponse>({
    queryKey: ["holidays", page, limit],
    queryFn: () => holidayService.getAll(page, limit),
    placeholderData: (prev) => prev,
  });

/* ================= CREATE ================= */

export const useCreateHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: holidayService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};

/* ================= UPDATE ================= */

export const useUpdateHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { title?: string; date?: string; isActive?: boolean };
    }) => holidayService.update(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};

/* ================= DELETE ================= */

export const useDeleteHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: holidayService.remove,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["holidays"] }),
  });
};
