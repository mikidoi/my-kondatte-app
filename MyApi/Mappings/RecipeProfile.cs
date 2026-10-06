using AutoMapper;
using MyApi.Models;

public class RecipeProfile : Profile
{
    public RecipeProfile()
    {
        CreateMap<RecipeUpdateDto, Recipe>().ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}