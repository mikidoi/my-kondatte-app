using AutoMapper;

public class WeeklyMealPlanProfile : Profile
{
    public WeeklyMealPlanProfile()
    {
        CreateMap<SaveWeeklyMealPlanDto, WeeklyMealPlan>();
        CreateMap<WeeklyMealPlan, WeeklyMealPlanDto>();
    }
}