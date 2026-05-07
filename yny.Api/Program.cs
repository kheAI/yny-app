using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// Setup CORS so our React frontend is allowed to talk to this API
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Connect to PostgreSQL
var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connString));

var app = builder.Build();
app.UseCors("AllowAll");

// API Endpoints
app.MapGet("/api/products", async (AppDbContext db) => {
    return await db.Products.ToListAsync();
});

app.MapGet("/api/products/{code}", async (string code, AppDbContext db) => {
    var product = await db.Products.FindAsync(code);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.Run();

// Data Models (Must match SQL exactly)
public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Product> Products { get; set; }
}

public class Product {
    [Key]
    public string ProductCode { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int QuantityInStock { get; set; }
    public string Status { get; set; } = string.Empty;
}