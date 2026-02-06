var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

// 2. These are the "Middlewares" (the order matters!)
app.UseAuthorization();

// 3. IMPORTANT: This maps the incoming URLs to your Controller classes
app.MapControllers();

app.Run();