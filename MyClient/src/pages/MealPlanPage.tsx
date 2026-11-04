import { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetRecipes } from "../shared/api/useRecipes";
import {
  useWeeklyMealPlans,
  useCreateWeeklyMealPlan,
  usePlannedMeals,
  useCreatePlannedMeal,
  useDeletePlannedMeal,
  type PlannedMealDto,
} from "../shared/api/useMealPlan";
import {
  getWeekStart,
  shiftWeek,
  getColumnDate,
  formatDateRange,
} from "../shared/utils/weekUtils";
import WeekNavigator from "../shared/components/WeekNavigator";
import DayColumn from "../shared/components/DayColumn";
import RecipePickerDialog from "../shared/components/RecipePickerDialog";

const DAYS = [
  { label: "SUN", dayOfWeek: 0 },
  { label: "MON", dayOfWeek: 1 },
  { label: "TUE", dayOfWeek: 2 },
  { label: "WED", dayOfWeek: 3 },
  { label: "THU", dayOfWeek: 4 },
  { label: "FRI", dayOfWeek: 5 },
  { label: "SAT", dayOfWeek: 6 },
];

export default function MealPlanPage() {
  const [selectedWeekStart, setSelectedWeekStart] = useState(() =>
    getWeekStart(new Date())
  );
  const [currentPickedDay, setCurrentPickedDay] = useState<number | null>(null);
  const { data: weekPlans, isLoading: plansLoading } = useWeeklyMealPlans();
  const currentPlan = weekPlans?.find(
    (p) => p.weekStartDate === selectedWeekStart
  );

  const { data: meals, isLoading: mealsLoading } = usePlannedMeals(
    currentPlan?.id
  );
  const { data: recipes } = useGetRecipes();

  const createWeek = useCreateWeeklyMealPlan();
  const createMeal = useCreatePlannedMeal();
  const deleteMeal = useDeletePlannedMeal();

  const mealByDay: Record<number, PlannedMealDto> = {};
  for (const meal of meals ?? []) {
    if (meal.dayOfWeek !== undefined) mealByDay[meal.dayOfWeek] = meal;
  }

  async function handleSelectRecipe(recipeId: number) {
    if (currentPickedDay === null) return;
    let planId = currentPlan?.id;
    if (!planId) {
      const newPlan = await createWeek.mutateAsync(selectedWeekStart);
      planId = newPlan!.id!;
    }
    await createMeal.mutateAsync({
      weeklyMealPlanId: planId,
      body: {
        dayOfWeek: currentPickedDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        recipeId,
      },
    });
    setCurrentPickedDay(null);
  }

  async function handleDeleteMeal(meal: PlannedMealDto) {
    if (meal.weeklyMealPlanId == null || meal.id == null) return;
    await deleteMeal.mutateAsync({
      weeklyMealPlanId: meal.weeklyMealPlanId,
      id: meal.id,
    });
  }

  const isLoading = plansLoading || (currentPlan !== undefined && mealsLoading);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">Kondate Hyo</Typography>
          <Typography color="text.secondary">
            {formatDateRange(selectedWeekStart)}
          </Typography>
        </Box>
        <WeekNavigator
          onPrev={() => setSelectedWeekStart((w) => shiftWeek(w, -1))}
          onNext={() => setSelectedWeekStart((w) => shiftWeek(w, 1))}
          onToday={() => setSelectedWeekStart(getWeekStart(new Date()))}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {DAYS.map((day, colIndex) => {
            const colDate = getColumnDate(selectedWeekStart, colIndex);
            const dateLabel = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(colDate);
            const meal = mealByDay[day.dayOfWeek];
            return (
              <DayColumn
                key={day.label}
                label={day.label}
                dateLabel={dateLabel}
                meal={meal}
                isWeekend={day.dayOfWeek === 0 || day.dayOfWeek === 6}
                isLast={colIndex === DAYS.length - 1}
                onAddMeal={() => setCurrentPickedDay(day.dayOfWeek)}
                onDeleteMeal={() => handleDeleteMeal(meal)}
                isDeleting={deleteMeal.isPending}
              />
            );
          })}
        </Box>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "center", mt: 2 }}
      >
        Click <strong>+ Add meal</strong> to assign a recipe to any day
      </Typography>

      <RecipePickerDialog
        open={currentPickedDay !== null}
        onClose={() => setCurrentPickedDay(null)}
        onSelect={handleSelectRecipe}
        recipes={recipes}
        isPending={createMeal.isPending || createWeek.isPending}
      />
    </Box>
  );
}
