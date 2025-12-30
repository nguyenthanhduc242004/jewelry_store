using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace JewelryStore.Data.Seed
{
    public static class ImportSeeder
    {
        public static async Task SeedAsync(IServiceScope scope)
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            if (!await db.Suppliers.AnyAsync())
            {
                var suppliers = new[]
                {
                    new Supplier { Name = "Aurora Gems Co.", Address = "789 Jewel Rd", Phone = "0901234567", Status = true },
                    new Supplier { Name = "Golden Craft Ltd.", Address = "12 Gold Ave", Phone = "0907654321", Status = true },
                    new Supplier { Name = "Silverline Traders", Address = "34 Silver St", Phone = "0933333333", Status = true }
                };
                db.Suppliers.AddRange(suppliers);
                await db.SaveChangesAsync();
            }

            var supplierId = await db.Suppliers.Select(s => (int?)s.Id).FirstOrDefaultAsync();
            var productId = await db.Products.Select(p => (int?)p.Id).FirstOrDefaultAsync();
            if (supplierId == null || productId == null)
            {
                return; // prerequisites not met
            }

            if (!await db.ImportForms.AnyAsync())
            {
                var import1 = new ImportForm { SupplierId = supplierId.Value, StaffId = null, DateCreated = DateTime.UtcNow, TotalPrice = 1200.00m };
                var import2 = new ImportForm { SupplierId = supplierId.Value, StaffId = null, DateCreated = DateTime.UtcNow, TotalPrice = 3500.50m };
                db.ImportForms.AddRange(import1, import2);
                await db.SaveChangesAsync();

                if (!await db.ImportDetails.AnyAsync())
                {
                    var details = new[]
                    {
                        new ImportDetail { ImportId = import1.Id, ProductId = productId.Value, Quantity = 5, ImportPrice = 150.00m },
                        new ImportDetail { ImportId = import2.Id, ProductId = productId.Value, Quantity = 2, ImportPrice = 800.00m }
                    };
                    db.ImportDetails.AddRange(details);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}