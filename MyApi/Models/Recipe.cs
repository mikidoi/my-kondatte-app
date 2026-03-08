namespace MyApi.Models;

public class Recipe
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
}