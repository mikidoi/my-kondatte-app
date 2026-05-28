using System.ComponentModel.DataAnnotations;

public class RecipeUploadDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public List<string> Categories { get; set; } = [];

    public int PreparationTime { get; set; } // in minutes
    public int ServesCount { get; set; }
    
    [Required]
    public string Ingredients { get; set; } = string.Empty;

    [Required]
    public string Instructions { get; set; } = string.Empty;
    public IFormFile? File { get; set; } 
}