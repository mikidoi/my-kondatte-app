using AutoMapper;
using MyApi.Models;

public class PlannedMealProfile : Profile
{
    public PlannedMealProfile()
    {
        CreateMap<SavePlannedMealDto, PlannedMeal>();
        CreateMap<PlannedMeal, PlannedMealDto>();
        CreateMap<Recipe, RecipeSummaryDto>();
    }
}