public class SaveRecipeDto
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Ingredients { get; set; }
    public required string Instructions { get; set; }
    public string? SourceUrl { get; set; }
}
