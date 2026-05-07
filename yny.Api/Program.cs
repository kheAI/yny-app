using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://yny-ui-158766252751.us-central1.run.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connString));

var app = builder.Build();

// Apply migrations automatically
using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

// Root endpoint
app.MapGet("/", () => new { status = "ERP API running" });

// API Endpoints
app.MapGet("/api/products", async (AppDbContext db) => {
    return await db.Products.ToListAsync();
});

app.MapGet("/api/products/{code}", async (string code, AppDbContext db) => {
    var product = await db.Products.FindAsync(code);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.Run();

// Data Models
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