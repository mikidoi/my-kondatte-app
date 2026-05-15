public class RecipeScanDto
{
    public IFormFile? File { get; set; }
    public string TargetLanguage { get; set; } = "English";
}
