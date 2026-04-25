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
    public RecipeController(IHubContext<RecipeHub> hubContext, AppDbContext context)
    {
        _hubContext = hubContext;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
    {
        return await _context.Recipes.ToListAsync();
    }

    /*[ HttpGet("{id}")]
    public ActionResult<Recipe> Get(int id)
    {
        var recipe = Recipes.FirstOrDefault(r => r.Id == id);
        if (recipe == null)
            return NotFound();
        return Ok(recipe);
    }*/

    [HttpPost("upload")]
    public async Task<IActionResult> PostWithImage([FromForm] RecipeUploadDto dto)
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


        var recipe = new Recipe
        {
            Name = dto.Name,
            Ingredients = dto.Ingredients,
            Instructions = dto.Instructions,
            ImagePath = fileName
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("RecipeCreated", recipe);

        return CreatedAtAction(nameof(GetRecipes), new { id = recipe.Id }, recipe);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
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

