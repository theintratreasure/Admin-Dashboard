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

export type InstrumentSearchItem = {
  _id: string;
  code: string;
  name: string;
  segment?: string;
};

export type InstrumentSearchResponse = {
  success?: boolean;
  data?: InstrumentSearchItem[] | { data?: InstrumentSearchItem[] };
};

export const searchInstruments = async (params: {
  q: string;
  segment?: string;
  limit?: number;
}): Promise<InstrumentSearchItem[]> => {
  const { data } = await api.get("/instrument/search", { params });
  const list =
    (data?.data?.data as InstrumentSearchItem[]) ||
    (data?.data as InstrumentSearchItem[]) ||
    [];
  return Array.isArray(list) ? list : [];
};
