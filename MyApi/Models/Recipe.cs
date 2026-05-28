using System.ComponentModel;

namespace MyApi.Models;

public class Recipe
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public required string Description { get; set; }

    public ICollection<Category> Categories { get; set; } = [];

    public int PreparationTime { get; set; } // in minutes

    public int ServesCount { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
    public string? ImagePath { get; set; }
}