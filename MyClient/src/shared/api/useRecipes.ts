import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

export const recipeKeys = {
  all: ["recipes"] as const,
  detail: (id: number) => ["recipes", id] as const,
};

export function useRecipe(id: number) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await api.GET("/api/recipes/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
      return data;
    },
  });
}

export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.all,
    queryFn: async () => {
      const { data, error } = await api.GET("/api/recipes");
      if (error) throw error;
      return data;
    },
  });
}
