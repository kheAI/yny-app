using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://yny-ui.vercel.app",
            "https://yny-ui-158766252751.us-central1.run.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connString));
//.UseLowerCaseNamingConvention());

var app = builder.Build();

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.MapGet("/", () => new { status = "ERP API running" });

app.MapGet("/api/products", async (AppDbContext db) => {
    return await db.Products.ToListAsync();
});

app.MapGet("/api/products/{code}", async (string code, AppDbContext db) => {
    var product = await db.Products.FindAsync(code);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.Run();

[Table("products")]
public class Product {
    [Column("productcode")]
    [Key]
    public string ProductCode { get; set; } = string.Empty;
    
    [Column("productname")]
    public string ProductName { get; set; } = string.Empty;
    
    [Column("category")]
    public string Category { get; set; } = string.Empty;
    
    [Column("quantityinstock")]
    public int QuantityInStock { get; set; }
    
    [Column("status")]
    public string Status { get; set; } = string.Empty;
}

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Product> Products { get; set; }
}