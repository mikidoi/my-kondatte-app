public class WeeklyMealPlan
{
    public int Id { get; set; }
    public DateOnly WeekStartDate { get; set; }
    public List<PlannedMeal> PlannedMeals { get; set; } = new();
}
