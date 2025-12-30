using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace JewelryStore.Data.Seed
{
    public static class OrderSeeder
    {
        public static async Task SeedAsync(IServiceScope scope)
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var userId = await db.Users.Select(u => (int?)u.Id).FirstOrDefaultAsync();
            var productId = await db.Products.Select(p => (int?)p.Id).FirstOrDefaultAsync();

            if (userId == null || productId == null)
            {
                // prerequisites not met; skip seeding
                return;
            }

            if (!await db.Orders.AnyAsync())
            {
                var order1 = new OrderForm
                {
                    UserId = userId.Value,
                    StaffId = null,
                    TotalPrice = 2299.49m,
                    DateCreated = DateTime.UtcNow,
                    Status = "Chờ xử lý",
                    ShippingAddress = "123 Main St",
                    PhoneNumber = "0123456789"
                };

                var order2 = new OrderForm
                {
                    UserId = userId.Value,
                    StaffId = null,
                    TotalPrice = 4999.00m,
                    DateCreated = DateTime.UtcNow,
                    Status = "Đã hoàn thành",
                    ShippingAddress = "456 Market Ave",
                    PhoneNumber = "0987654321"
                };

                db.Orders.AddRange(order1, order2);
                await db.SaveChangesAsync();

                if (!await db.Set<OrderDetail>().AnyAsync())
                {
                    var details = new[]
                    {
                        new OrderDetail { OrderId = order1.Id, ProductId = productId.Value, Quantity = 3, PriceAtSale = 1999.99m },
                        new OrderDetail { OrderId = order2.Id, ProductId = productId.Value, Quantity = 1, PriceAtSale = 4999.00m }
                    };
                    db.Set<OrderDetail>().AddRange(details);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}