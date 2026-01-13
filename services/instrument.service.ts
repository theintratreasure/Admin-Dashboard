import api from "@/api/axios";
import {
  Instrument,
  InstrumentListResponse,
} from "@/types/instrument";

type ListParams = {
  page?: number;
  limit?: number;
  segment?: string;
};

export const createInstrument = async (
  payload: Omit<Instrument, "_id">
): Promise<Instrument> => {
  const res = await api.post("/instrument", payload);
  return res.data;
};

export const getInstruments = async (params: {
  page: number;
  limit: number;
  segment?: string;
}): Promise<InstrumentListResponse> => {
  const res = await api.get("/instrument", { params });
  return res.data;
};

export const updateInstrument = async (
  id: string,
  payload: Partial<Omit<Instrument, "_id" | "code">>
): Promise<Instrument> => {
  const res = await api.put(`/instrument/${id}`, payload);
  return res.data;
};

export const deleteInstrument = async (id: string): Promise<void> => {
  await api.delete(`/instrument/${id}`);
};