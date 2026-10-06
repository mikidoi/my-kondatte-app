using MyApi.Models;

public class PlannedMeal
{
    public int Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public int RecipeId { get; set; }
    public required Recipe Recipe { get; set; }
    public int WeeklyMealPlanId { get; set; }
    public required WeeklyMealPlan WeeklyMealPlan { get; set; }
}