import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminInternalTransfer,
  type InternalTransferPayload,
} from "@/services/internalTransfer.service";

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  typeof value === "object" && value !== null;

const toFiniteNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const applyInternalTransferToAccountsCache = (
  cached: unknown,
  payload: InternalTransferPayload
) => {
  if (!isRecord(cached)) return cached;
  if (!Array.isArray(cached.data)) return cached;

  const fromId = payload.fromAccount;
  const toId = payload.toAccount;
  const amount = payload.amount;

  if (
    !fromId ||
    !toId ||
    fromId === toId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return cached;
  }

  let changed = false;
  const nextData = cached.data.map((account) => {
    if (!isRecord(account)) return account;

    const accountId = typeof account._id === "string" ? account._id : "";
    if (!accountId || (accountId !== fromId && accountId !== toId)) {
      return account;
    }

    const prevBalance = toFiniteNumber(account.balance) ?? 0;
    const prevEquity =
      toFiniteNumber(account.equity) ?? (toFiniteNumber(account.balance) ?? 0);

    const delta = accountId === fromId ? -amount : amount;
    const nextBalance = roundMoney(prevBalance + delta);
    const nextEquity = roundMoney(prevEquity + delta);

    changed = true;
    return {
      ...account,
      balance: nextBalance,
      equity: nextEquity,
    };
  });

  if (!changed) return cached;
  return { ...cached, data: nextData };
};

export const useAdminInternalTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InternalTransferPayload) =>
      createAdminInternalTransfer(payload),
    onSuccess: (_data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["admin-user-accounts"] },
        (cached) => applyInternalTransferToAccountsCache(cached, variables)
      );

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["admin-user-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
      }, 700);
    },
  });
};
