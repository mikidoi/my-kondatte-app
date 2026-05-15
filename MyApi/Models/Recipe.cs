namespace MyApi.Models;

public class Recipe
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public required string Description { get; set; }

    public required string Category { get; set; }

    public int PreparationTime { get; set; } // in minutes

    public int ServesCount { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
    public string? ImagePath { get; set; }
}