using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;

namespace JewelryStore.Data.Seed
{
    public static class CatalogSeeder
    {
        public static async Task SeedAsync(IServiceScope scope)
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var didAdd = false;

            // Categories
            if (!await db.Categories.AnyAsync())
            {
                var categories = new[]
                {
                    new Category { Id = 1, Name = "Rings", Status = true },
                    new Category { Id = 2, Name = "Necklaces", Status = true },
                    new Category { Id = 3, Name = "Bracelets", Status = true },
                    new Category { Id = 4, Name = "Earrings", Status = true }
                };
                db.Categories.AddRange(categories);
                didAdd = true;
            }

            // Products
            if (!await db.Products.AnyAsync())
            {
                var products = new[]
                {
                    new Product { Id = 1, CategoryId = 1, Name = "Gold Ring A", Material = "Gold 18K", Description = "Elegant gold ring.", Price = 1999.99m, Status = true },
                    new Product { Id = 2, CategoryId = 2, Name = "Diamond Necklace B", Material = "Diamond, Silver", Description = "Sparkling diamond necklace.", Price = 4999.00m, Status = true },
                    new Product { Id = 3, CategoryId = 3, Name = "Silver Bracelet C", Material = "Silver 925", Description = "Classic silver bracelet.", Price = 299.50m, Status = true },
                    new Product { Id = 4, CategoryId = 4, Name = "Pearl Earrings D", Material = "Pearl, Gold", Description = "Elegant pearl earrings.", Price = 899.99m, Status = true }
                };
                db.Products.AddRange(products);
                didAdd = true;
            }

            // Gemstones
            if (!await db.Gemstones.AnyAsync())
            {
                var gemstones = new[]
                {
                    new Gemstone { Id = 1, ProductId = 1, Name = "Diamond", Weight = 0.5f, Size = "5mm", Color = "Clear" },
                    new Gemstone { Id = 2, ProductId = 1, Name = "Ruby", Weight = 0.3f, Size = "4mm", Color = "Red" },
                    new Gemstone { Id = 3, ProductId = 2, Name = "Diamond", Weight = 1.2f, Size = "8mm", Color = "Clear" }
                };
                db.Gemstones.AddRange(gemstones);
                didAdd = true;
            }

            // Inventory
            if (!await db.Inventory.AnyAsync())
            {
                var inventory = new[]
                {
                    new Inventory { ProductId = 1, Quantity = 10 },
                    new Inventory { ProductId = 2, Quantity = 5 },
                    new Inventory { ProductId = 3, Quantity = 20 },
                    new Inventory { ProductId = 4, Quantity = 15 }
                };
                db.Inventory.AddRange(inventory);
                didAdd = true;
            }

            // Product images
            if (!await db.ProductImages.AnyAsync())
            {
                const string url = "https://res.cloudinary.com/djf63iwha/image/upload/v1761568149/Charm_wuvozq.webp";
                var images = new[]
                {
                    new ProductImage { ProductId = 1, ImageOrder = 1, ImageUrl = url },
                    new ProductImage { ProductId = 2, ImageOrder = 1, ImageUrl = url },
                    new ProductImage { ProductId = 3, ImageOrder = 1, ImageUrl = url },
                    new ProductImage { ProductId = 4, ImageOrder = 1, ImageUrl = url }
                };
                db.ProductImages.AddRange(images);
                didAdd = true;
            }

            if (didAdd)
            {
                await db.SaveChangesAsync();
            }
        }
    }
}