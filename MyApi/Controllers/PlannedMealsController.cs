using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;

[ApiController]
[Route("api/mealplans/{weeklyMealPlanId}/meals")]
public class PlannedMealsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private const string DuplicateDayMessage = "This day already has a meal in this plan.";
    public PlannedMealsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int weeklyMealPlanId)
    {
        var mealplans = await _context.PlannedMeals
            .Include(m => m.Recipe)
            .Where(meal => meal.WeeklyMealPlanId == weeklyMealPlanId)
            .ToListAsync();
        return Ok(mealplans);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlannedMeal>> GetById(int weeklyMealPlanId, int id)
    {
        var meal = await _context.PlannedMeals.Include(meal=>meal.Recipe).FirstOrDefaultAsync(meal => meal.Id == id && meal.WeeklyMealPlanId == weeklyMealPlanId);
        if (meal == null)
            return NotFound();
        return meal;
    }

    [HttpPost]
    public async Task<ActionResult<PlannedMealDto>> Post(int weeklyMealPlanId, SavePlannedMealDto newPlannedMeal)
    {
        var planExists = await _context.WeeklyMealPlans.AnyAsync(p => p.Id == weeklyMealPlanId);
        if (!planExists)
            return NotFound();

        var dayTaken = await _context.PlannedMeals.AnyAsync(m => m.WeeklyMealPlanId == weeklyMealPlanId && m.DayOfWeek == newPlannedMeal.DayOfWeek);
        if (dayTaken)
            return Conflict(DuplicateDayMessage);

        var recipe = await _context.Recipes.FindAsync(newPlannedMeal.RecipeId);
        if (recipe == null)
            return BadRequest("Recipe not found.");

        var plannedMeal = _mapper.Map<PlannedMeal>(newPlannedMeal);
        plannedMeal.WeeklyMealPlanId = weeklyMealPlanId;
        plannedMeal.Recipe = recipe;
        _context.PlannedMeals.Add(plannedMeal);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(DuplicateDayMessage);
        }

        return CreatedAtAction(nameof(GetById), new { weeklyMealPlanId, id = plannedMeal.Id }, _mapper.Map<PlannedMealDto>(plannedMeal));
        
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int weeklyMealPlanId, int id, UpdatePlannedMealDto updatedPlannedMeal)
    {
        var meal = await _context.PlannedMeals
            .FirstOrDefaultAsync(meal => meal.Id == id && meal.WeeklyMealPlanId == weeklyMealPlanId);
        if (meal == null)
            return NotFound();

        if (!await _context.Recipes.AnyAsync(r => r.Id == updatedPlannedMeal.RecipeId))
            return BadRequest("Recipe does not exist");

        meal.RecipeId = updatedPlannedMeal.RecipeId;
        await _context.SaveChangesAsync();
        return NoContent();

    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int weeklyMealPlanId, int id)
    {
        var meal = await _context.PlannedMeals.FirstOrDefaultAsync(meal => meal.Id == id && meal.WeeklyMealPlanId == weeklyMealPlanId);
        if (meal == null)
            return NotFound();

        _context.Remove(meal);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}