import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDefaultWatchlist,
  addDefaultWatchlist,
  removeDefaultWatchlist,
} from "@/services/defaultWatchlist.service";

export function useDefaultWatchlist() {
  return useQuery({
    queryKey: ["default-watchlist"],
    queryFn: fetchDefaultWatchlist,
  });
}

export function useAddDefaultWatchlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addDefaultWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["default-watchlist"] });
    },
  });
}

export function useRemoveDefaultWatchlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: removeDefaultWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["default-watchlist"] });
    },
  });
}
