using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<WeeklyMealPlan> WeeklyMealPlans => Set<WeeklyMealPlan>();
    public DbSet<PlannedMeal> PlannedMeals => Set<PlannedMeal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PlannedMeal>()
            .HasIndex(pm => new { pm.WeeklyMealPlanId, pm.DayOfWeek })
            .IsUnique();
    }
    
}