using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;

namespace MyApi.Controllers;

[ApiController]
[Route("api/recipes")]
public class RecipeController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    public RecipeController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType<List<RecipeDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecipes()
    {
        var recipes = await _context.Recipes.ToListAsync();
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    [ProducesResponseType<RecipeDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Get(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound();
        return Ok(recipe);
    }

    [HttpPost]
    [ProducesResponseType<RecipeDto>(StatusCodes.Status201Created)]
    public async Task<ActionResult> Post(SaveRecipeDto dto)
    {
        var recipe = _mapper.Map<Recipe>(dto);
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = recipe.Id }, _mapper.Map<RecipeDto>(recipe));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, RecipeUpdateDto updatedRecipe)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound();

        _mapper.Map(updatedRecipe, recipe);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound();
        _context.Remove(recipe);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}