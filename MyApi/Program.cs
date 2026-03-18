using Microsoft.EntityFrameworkCore;
using MyApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=kondatte.db"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();   // <--- ADD THIS
    app.UseSwaggerUI();  // <--- ADD THIS
}

// 2. These are the "Middlewares" (the order matters!)
app.UseAuthorization();

// 3. IMPORTANT: This maps the incoming URLs to your Controller classes
app.MapControllers();

app.UseStaticFiles(); // This will serve files from wwwroot folder

app.Run();