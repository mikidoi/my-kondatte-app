using AutoMapper;
using MyApi.Models;

public class RecipeProfile : Profile
{
    public RecipeProfile()
    {
        CreateMap<SaveRecipeDto, Recipe>().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<RecipeUpdateDto, Recipe>().ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<Recipe, RecipeDto>();
    }
}