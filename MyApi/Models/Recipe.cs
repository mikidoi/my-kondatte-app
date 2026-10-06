
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models;

public class Recipe
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
    public string? SourceUrl { get; set; }
}