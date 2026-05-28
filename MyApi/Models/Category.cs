using System.Text.Json.Serialization;
using MyApi.Models;

public class Category
{
    public int Id { get; set; }
    
    public required string Name { get; set; }

    [JsonIgnore]
    public ICollection<Recipe> Recipes { get; set; } = [];
}