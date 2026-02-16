import api from "@/api/axios";

export type BonusSettings = {
  bonus_enabled: boolean;
  default_bonus_percent: number;
  updatedAt?: string;
};

export type BonusSettingsResponse = {
  success?: boolean;
  message?: string;
  data?: BonusSettings;
};

export type BonusSettingsPayload = {
  bonus_enabled: boolean;
  default_bonus_percent: number;
};

export type BonusCreditPayload = {
  accountId: string;
  amount: number;
  reason?: string;
};

export type BonusCreditResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accountId?: string;
    bonusAdded?: number;
    bonusBalance?: number;
    equity?: number;
  };
};

function unwrapSettings(payload: BonusSettingsResponse | BonusSettings) {
  if (payload && typeof payload === "object" && "success" in payload) {
    if ((payload as BonusSettingsResponse).success === false) {
      throw new Error(
        (payload as BonusSettingsResponse).message || "Failed to load bonus settings."
      );
    }
    return (payload as BonusSettingsResponse).data as BonusSettings;
  }
  return payload as BonusSettings;
}

export const getBonusSettings = async (): Promise<BonusSettings> => {
  const res = await api.get<BonusSettingsResponse>("/bonus/settings");
  return unwrapSettings(res.data);
};

export const updateBonusSettings = async (
  payload: BonusSettingsPayload
): Promise<BonusSettings> => {
  const res = await api.put<BonusSettingsResponse>("/bonus/settings", payload);
  return unwrapSettings(res.data);
};

export const creditBonus = async (
  payload: BonusCreditPayload
): Promise<BonusCreditResponse> => {
  const res = await api.post<BonusCreditResponse>("/bonus/admin/credit", payload);
  return res.data;
};
