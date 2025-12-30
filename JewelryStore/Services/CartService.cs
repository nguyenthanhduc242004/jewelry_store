using System;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class CartService : ICartService
    {
        private readonly AppDbContext _db;
        public CartService(AppDbContext db) => _db = db;

        public async Task AddToCartAsync(int userId, int productId, int quantity)
        {
            // Validate product exists
            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new ArgumentException("Product not found");

            // Check inventory
            var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == productId);
            if (inventory == null || inventory.Quantity < quantity)
            {
                throw new ArgumentException("Insufficient stock");
            }

            // Find or create active cart
            var cart = await _db.Carts
                .Where(c => c.UserId == userId && c.Status == "active")
                .OrderByDescending(c => c.DateModified)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    DateCreated = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow,
                    Status = "active"
                };
                _db.Carts.Add(cart);
                await _db.SaveChangesAsync();
            }

            // Check if product already in cart
            var existingItem = await _db.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == productId);

            if (existingItem != null)
            {
                // Update quantity
                existingItem.Quantity += quantity;
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = productId,
                    Quantity = quantity,
                    PriceAtAdd = product.Price
                };
                _db.CartItems.Add(cartItem);
            }

            cart.DateModified = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
