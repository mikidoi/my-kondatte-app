using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;

[ApiController]
[Route("api/mealplansWeeks")]
public class WeeklyMealPlansController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private const string DuplicateWeekMessage = "A meal plan for this week already exists.";
    public WeeklyMealPlansController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<WeeklyMealPlanDto>>> Get()
    {
        var plans = await _context.WeeklyMealPlans.AsNoTracking().ToListAsync();
        return Ok(_mapper.Map<List<WeeklyMealPlanDto>>(plans));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WeeklyMealPlanDto>> GetById(int id)
    {
        var plan = await _context.WeeklyMealPlans.FindAsync(id);
        if (plan == null)
            return NotFound();
        return Ok(_mapper.Map<WeeklyMealPlanDto>(plan));
    }

    [HttpPost]
    public async Task<ActionResult<WeeklyMealPlanDto>> Post(SaveWeeklyMealPlanDto newWeeklyMealPlan)
    {
        newWeeklyMealPlan.WeekStartDate = WeekHelper.StartOfWeek(newWeeklyMealPlan.WeekStartDate);
        var exists = await _context.WeeklyMealPlans.AnyAsync(p => p.WeekStartDate == newWeeklyMealPlan.WeekStartDate);
        if (exists)
            return Conflict(DuplicateWeekMessage);

        var plan = _mapper.Map<WeeklyMealPlan>(newWeeklyMealPlan);
        _context.WeeklyMealPlans.Add(plan);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(DuplicateWeekMessage);

        }
        return CreatedAtAction(nameof(GetById), new { id = plan.Id}, _mapper.Map<WeeklyMealPlanDto>(plan) );
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, SaveWeeklyMealPlanDto updatedWeeklyPlan)
    {
        var plan = await _context.WeeklyMealPlans.FindAsync(id);
        if (plan == null)
            return NotFound();

        updatedWeeklyPlan.WeekStartDate = WeekHelper.StartOfWeek(updatedWeeklyPlan.WeekStartDate);
        
        var exists = await _context.WeeklyMealPlans.AnyAsync(p => p.WeekStartDate == updatedWeeklyPlan.WeekStartDate && p.Id != id);
        if (exists)
            return Conflict(DuplicateWeekMessage);
        _mapper.Map(updatedWeeklyPlan, plan);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(DuplicateWeekMessage);
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var plans = await _context.WeeklyMealPlans.FindAsync(id);
        if (plans == null)
            return NotFound();
        _context.Remove(plans);
        await _context.SaveChangesAsync();
        return NoContent();    
    }
}