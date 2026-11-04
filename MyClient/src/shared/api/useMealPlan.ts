import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { components } from "./schema";

export type WeeklyMealPlanDto = components["schemas"]["WeeklyMealPlanDto"];
export type PlannedMealDto = components["schemas"]["PlannedMealDto"];
export type SavePlannedMealDto = components["schemas"]["SavePlannedMealDto"];

export const mealPlanKeys = {
  weeks: ["weeklyMealPlans"] as const,
  meals: (weeklyMealPlanId: number) => ["plannedMeals", weeklyMealPlanId] as const,
};

export function useWeeklyMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.weeks,
    queryFn: async () => {
      const { data, error } = await api.GET("/api/mealplansWeeks");
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateWeeklyMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weekStartDate: string) => {
      const { data, error } = await api.POST("/api/mealplansWeeks", {
        body: { weekStartDate },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.weeks });
    },
  });
}

export function usePlannedMeals(weeklyMealPlanId: number | undefined) {
  return useQuery({
    queryKey: mealPlanKeys.meals(weeklyMealPlanId ?? 0),
    queryFn: async () => {
      const { data, error } = await api.GET("/api/mealplans/{weeklyMealPlanId}/meals", {
        params: { path: { weeklyMealPlanId: weeklyMealPlanId! } },
      });
      if (error) throw error;
      return (data as unknown as PlannedMealDto[]) ?? [];
    },
    enabled: weeklyMealPlanId !== undefined,
  });
}

export function useCreatePlannedMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      weeklyMealPlanId,
      body,
    }: {
      weeklyMealPlanId: number;
      body: SavePlannedMealDto;
    }) => {
      const { data, error } = await api.POST("/api/mealplans/{weeklyMealPlanId}/meals", {
        params: { path: { weeklyMealPlanId } },
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { weeklyMealPlanId }) => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.meals(weeklyMealPlanId) });
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.weeks });
    },
  });
}

export function useDeletePlannedMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      weeklyMealPlanId,
      id,
    }: {
      weeklyMealPlanId: number;
      id: number;
    }) => {
      const { error } = await api.DELETE("/api/mealplans/{weeklyMealPlanId}/meals/{id}", {
        params: { path: { weeklyMealPlanId, id } },
      });
      if (error) throw error;
    },
    onSuccess: (_, { weeklyMealPlanId }) => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.meals(weeklyMealPlanId) });
    },
  });
}
