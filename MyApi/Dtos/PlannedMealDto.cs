public class PlannedMealDto
{
    public int Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public int RecipeId { get; set; }
    public int WeeklyMealPlanId { get; set; }
    public RecipeSummaryDto? Recipe { get; set; }
}