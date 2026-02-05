import api from "@/api/axios";
import { Instrument, InstrumentListResponse } from "@/types/instrument";

export const createInstrument = async (
  payload: Omit<Instrument, "_id">
): Promise<Instrument> => {
  const { data } = await api.post("/instrument", payload);
  return data.data;
};

export const getInstruments = async (params: {
  page: number;
  limit: number;
  segment?: string;
}): Promise<InstrumentListResponse> => {
  const { data } = await api.get("/instrument", { params });
  return data;
};

export const updateInstrument = async (
  id: string,
  payload: Partial<Omit<Instrument, "_id" | "code">>
): Promise<Instrument> => {
  const { data } = await api.put(`/instrument/${id}`, payload);
  return data.data;
};

export const deleteInstrument = async (id: string): Promise<void> => {
  await api.delete(`/instrument/${id}`);
};
