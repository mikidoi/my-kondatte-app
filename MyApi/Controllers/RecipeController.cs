using Microsoft.AspNetCore.Mvc;

namespace MyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    /* private static readonly List<Recipe> Recipes = new List<Recipe>
    {
        new Recipe { Id = 1, Name = "Spaghetti Bolognese", Ingredients = "Spaghetti, Ground Beef, Tomato Sauce", Instructions = "Cook spaghetti. Brown beef. Combine with sauce." },
        new Recipe { Id = 2, Name = "Chicken Curry", Ingredients = "Chicken, Curry Powder, Coconut Milk", Instructions = "Cook chicken. Add curry powder and coconut milk. Simmer." }
    }; */

    [HttpGet]
    public ActionResult Get()
    {
        var recipes = new[]
        {
            new { Id = 1, Name = "Spaghetti Bolognese", Ingredients = "Spaghetti, Ground Beef, Tomato Sauce", Instructions = "Cook spaghetti. Brown beef. Combine with sauce." },
            new { Id = 2, Name = "Chicken Curry", Ingredients = "Chicken, Curry Powder, Coconut Milk", Instructions = "Cook chicken. Add curry powder and coconut milk. Simmer." }
        };
        return Ok(recipes);
    }
    /* public ActionResult<IEnumerable<Recipe>> Get()
    {
        return Ok(Recipes);
    } */

    /*[ HttpGet("{id}")]
    public ActionResult<Recipe> Get(int id)
    {
        var recipe = Recipes.FirstOrDefault(r => r.Id == id);
        if (recipe == null)
            return NotFound();
        return Ok(recipe);
    }

    [HttpPost]
    public ActionResult<Recipe> Post(Recipe recipe)
    {
        recipe.Id = Recipes.Max(r => r.Id) + 1;
        Recipes.Add(recipe);
        return CreatedAtAction(nameof(Get), new { id = recipe.Id }, recipe);
    } */
}