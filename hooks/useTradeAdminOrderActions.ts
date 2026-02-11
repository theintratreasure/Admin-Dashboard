import { useMutation } from "@tanstack/react-query";
import {
  cancelTradeAdminPendingOrder,
  closeTradeAdminPosition,
  modifyTradeAdminPendingOrder,
  modifyTradeAdminPosition,
  placeTradeAdminMarketOrder,
  placeTradeAdminPendingOrder,
  type TradeAdminMarketOrderPayload,
  type TradeAdminPendingCancelPayload,
  type TradeAdminPendingModifyPayload,
  type TradeAdminPendingOrderPayload,
  type TradeAdminPositionClosePayload,
  type TradeAdminPositionModifyPayload,
} from "@/services/tradeAdmin.service";

export const useTradeAdminPlaceMarketOrder = () =>
  useMutation({
    mutationFn: (payload: TradeAdminMarketOrderPayload) =>
      placeTradeAdminMarketOrder(payload),
  });

export const useTradeAdminPlacePendingOrder = () =>
  useMutation({
    mutationFn: (payload: TradeAdminPendingOrderPayload) =>
      placeTradeAdminPendingOrder(payload),
  });

export const useTradeAdminModifyPendingOrder = () =>
  useMutation({
    mutationFn: (payload: TradeAdminPendingModifyPayload) =>
      modifyTradeAdminPendingOrder(payload),
  });

export const useTradeAdminCancelPendingOrder = () =>
  useMutation({
    mutationFn: (payload: TradeAdminPendingCancelPayload) =>
      cancelTradeAdminPendingOrder(payload),
  });

export const useTradeAdminModifyPosition = () =>
  useMutation({
    mutationFn: (payload: TradeAdminPositionModifyPayload) =>
      modifyTradeAdminPosition(payload),
  });

export const useTradeAdminClosePosition = () =>
  useMutation({
    mutationFn: (payload: TradeAdminPositionClosePayload) =>
      closeTradeAdminPosition(payload),
  });
