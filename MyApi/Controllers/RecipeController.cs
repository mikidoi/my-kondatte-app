using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using MyApi.Data;                   
using MyApi.Models;

namespace MyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly AppDbContext _context;
    public RecipeController(AppDbContext context)
    {
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

    [HttpPost]
    public async Task<ActionResult<Recipe>> PostRecipes(Recipe recipe)
    {
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRecipes), new { id = recipe.Id }, recipe);
    } 
}

