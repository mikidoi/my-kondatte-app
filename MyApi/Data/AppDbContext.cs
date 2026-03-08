using Microsoft.EntityFrameworkCore;
using MyApi.Models; 

namespace MyApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // This "DbSet" represents your SQL table
    // It says: "Create a table called Recipes based on the Recipe class"
    public DbSet<Recipe> Recipes { get; set; }
}