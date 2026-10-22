import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type RecipeUpdateDto = components["schemas"]["RecipeUpdateDto"];

export const recipeKeys = {
  all: ["recipes"] as const,
  detail: (id: number) => ["recipes", id] as const,
};

export function useRecipe(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.GET("/api/recipes/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateRecipe(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: RecipeUpdateDto) => {
      const { error } = await api.PUT("/api/recipes/{id}", {
        params: { path: { id } },
        body,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
    },
  });
}

export function useGetRecipes() {
  return useQuery({
    queryKey: recipeKeys.all,
    queryFn: async () => {
      const { data, error } = await api.GET("/api/recipes");
      if (error) throw error;
      return data;
    },
  });
}
