using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Hubs;
using MyApi.Models;

namespace MyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{

    private readonly IHubContext<RecipeHub> _hubContext;
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    private readonly ILogger<RecipeController> _logger;

    public RecipeController(IHubContext<RecipeHub> hubContext, AppDbContext context,
        IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _hubContext = hubContext;
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
    {
        return await _context.Recipes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Recipe>> GetRecipe(int id)
    {
        if(id <= 0)
            return BadRequest("Invalid recipe ID.");
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound();
        return Ok(recipe);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Recipe>>> SearchRecipes([FromQuery] string query)
    {
        if(string.IsNullOrWhiteSpace(query))
        return BadRequest("Query cannot be empty.");

        var recipes = await _context.Recipes.Where(r => r.Name.Contains(query) || r.Description.Contains(query))
            .ToListAsync();
        return Ok(recipes);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.Name != "")
            .Select(c => c.Name)
            .Distinct()
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> CreateRecipe([FromForm] RecipeUploadDto dto)
    {
        string? fileName = null;
        if (dto.File != null)
        {
            var file = dto.File;

            if (file.Length > 5 * 1024 * 1024) // 5MB limit
            {
                return BadRequest("File size exceeds the 5MB limit.");
            }
            fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);


            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }


        var categoryEntities = new List<Category>();
        foreach (var name in dto.Categories.Where(n => !string.IsNullOrWhiteSpace(n)))
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == name)
                           ?? new Category { Name = name };
            categoryEntities.Add(category);
        }

        var recipe = new Recipe
        {
            Name = dto.Name,
            Description = dto.Description,
            Categories = categoryEntities,
            PreparationTime = dto.PreparationTime,
            ServesCount = dto.ServesCount,
            Ingredients = dto.Ingredients,
            Instructions = dto.Instructions,
            ImagePath = fileName
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();


        return CreatedAtAction(nameof(GetRecipes), new { id = recipe.Id }, recipe);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditRecipe(int id, [FromForm] RecipeEditDto dto)
    {
        var recipe = await _context.Recipes.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == id);
        if (recipe == null)
            return NotFound();

        recipe.Categories.Clear();
        foreach (var name in dto.Categories.Where(n => !string.IsNullOrWhiteSpace(n)))
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == name) ?? new Category { Name = name };
            recipe.Categories.Add(category);
        }
        recipe.Name = dto.Name;
        recipe.Description = dto.Description;
        recipe.PreparationTime = dto.PreparationTime;
        recipe.ServesCount = dto.ServesCount;
        recipe.Ingredients = dto.Ingredients;
        recipe.Instructions = dto.Instructions;
        if(dto.File != null) 
        {
            var file = dto.File;

            if (file.Length > 5 * 1024 * 1024) // 5MB limit
            {
                return BadRequest("File size exceeds the 5MB limit.");
            }
            if (!string.IsNullOrEmpty(recipe.ImagePath))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", recipe.ImagePath);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            recipe.ImagePath = fileName;
        }

        _context.Recipes.Update(recipe);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RecipeUpdated", recipe);

        return NoContent();
    }
    
    [HttpPost("scan")]
    public async Task<IActionResult> ScanRecipe([FromForm] RecipeScanDto dto)
    {
        if (dto.File == null) return BadRequest("No image provided.");
        if (dto.File.Length > 5 * 1024 * 1024) return BadRequest("File size exceeds the 5MB limit.");

        using var ms = new MemoryStream();
        await dto.File.CopyToAsync(ms);
        var base64 = Convert.ToBase64String(ms.ToArray());

        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrEmpty(apiKey)) return StatusCode(500, "Gemini API key not configured.");

        var prompt = BuildScanPrompt(dto.TargetLanguage);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { inlineData = new { mimeType = dto.File.ContentType, data = base64 } },
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new { responseMimeType = "application/json" }
        };

        var client = _httpClientFactory.CreateClient();
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";
        var response = await client.PostAsJsonAsync(url, requestBody);

        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            return StatusCode((int)response.StatusCode, $"Gemini error: {err}");
        }

        var responseBody = await response.Content.ReadFromJsonAsync<JsonElement>();
        var text = responseBody
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrEmpty(text)) return StatusCode(500, "Empty response from Gemini.");

        var result = JsonSerializer.Deserialize<ScannedRecipeResult>(text,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        return Ok(result);
    }

    private static string BuildScanPrompt(string targetLanguage)
    {
        return $@"You are a recipe extraction assistant. Look at this image of a recipe.

1. Read all the text from the image.
2. Detect the source language of the recipe.
3. Translate everything into {targetLanguage}.

Return ONLY a valid JSON object — no explanation, no markdown — with exactly these fields:
{{
  ""name"": ""translated recipe name"",
  ""description"": ""one or two sentence description of the dish"",
  ""categories"": ""meal categories, e.g. Dinner, Breakfast, Dessert"",
  ""ingredients"": ""one ingredient per line, e.g:\n200g flour\n2 eggs\n1 tsp salt"",
  ""instructions"": ""numbered steps, e.g:\n1. Preheat oven to 180C\n2. Mix flour and eggs"",
  ""detectedLanguage"": ""the language the recipe was written in, e.g. Japanese""
}}

If the image does not contain a recipe, return: {{""name"":"""",""description"":""Not a recipe image"",""categories"":"""",""ingredients"":"""",""instructions"":"""",""detectedLanguage"":""""}}";
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound();

        if (!string.IsNullOrEmpty(recipe.ImagePath))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", recipe.ImagePath);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RecipeDeleted", id);
        
        return NoContent();
    }
}

