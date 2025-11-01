import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";
import type { Favorite } from "../types";

export function useFavorites() {
  const qc = useQueryClient();

  const list = useQuery<Favorite[], Error>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await client.get("/user/favorites");
      return res.data;
    },
    staleTime: 60_000,
  });

  const add = useMutation<Favorite, Error, Partial<Favorite>>({
    mutationFn: async (payload) => {
      const res = await client.post("/user/favorites", payload);
      return res.data as Favorite;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await client.delete(`/user/favorites/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return {
    favorites: list.data ?? [],
    isLoading: list.isLoading,
    isError: list.isError,
    error: list.error,
    addFavorite: add.mutateAsync,
    deleteFavorite: remove.mutateAsync,
  };
}
