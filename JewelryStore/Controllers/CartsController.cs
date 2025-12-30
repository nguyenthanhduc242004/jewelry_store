using JewelryStore.Data;
using JewelryStore.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JewelryStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICartService _cartService;

        public CartsController(AppDbContext db, UserManager<ApplicationUser> userManager, ICartService cartService)
        {
            _db = db;
            _userManager = userManager;
            _cartService = cartService;
        }

        public record CartItemDto(int ProductId, int Quantity, decimal PriceAtAdd, string ProductName, string? ProductImage);
        public record CartDto(int Id, int UserId, DateTime DateCreated, DateTime DateModified, string Status, List<CartItemDto> Items, decimal TotalPrice);
        public record AddProductDto(int ProductId, int Quantity);
        public record UpdateQuantityDto(int ProductId, int Quantity);

        // GET: api/carts/my-cart - Get current user's active cart
        [HttpGet("my-cart")]
        public async Task<ActionResult<CartDto>> GetMyCart()
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                // Find or create active cart for user
                var cart = await _db.Carts
                    .AsNoTracking()
                    .Where(c => c.UserId == user.Id && c.Status == "active")
                    .OrderByDescending(c => c.DateModified)
                    .FirstOrDefaultAsync();

                if (cart == null)
                {
                    // Create a new cart
                    cart = new Cart
                    {
                        UserId = user.Id,
                        DateCreated = DateTime.UtcNow,
                        DateModified = DateTime.UtcNow,
                        Status = "active"
                    };
                    _db.Carts.Add(cart);
                    await _db.SaveChangesAsync();
                }

                // Get cart items
                var items = await _db.CartItems
                    .AsNoTracking()
                    .Where(ci => ci.CartId == cart.Id)
                    .Join(_db.Products, ci => ci.ProductId, p => p.Id, (ci, p) => new { ci, p })
                    .Select(x => new CartItemDto(
                        x.ci.ProductId,
                        x.ci.Quantity,
                        x.ci.PriceAtAdd,
                        x.p.Name,
                        _db.ProductImages
                            .Where(pi => pi.ProductId == x.p.Id)
                            .OrderBy(pi => pi.ImageOrder)
                            .Select(pi => pi.ImageUrl)
                            .FirstOrDefault()
                    ))
                    .ToListAsync();

                var totalPrice = items.Sum(i => i.PriceAtAdd * i.Quantity);

                var cartDto = new CartDto(cart.Id, cart.UserId, cart.DateCreated, cart.DateModified, cart.Status, items, totalPrice);
                return Ok(cartDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error fetching cart", details = ex.Message });
            }
        }

        // POST: api/carts/add-product - Add product to cart
        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct([FromBody] AddProductDto dto)
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                await _cartService.AddToCartAsync(user.Id, dto.ProductId, dto.Quantity);
                return Ok(new { message = "Product added to cart" });
            }
            catch (ArgumentException ex)
            {
                if (ex.Message == "Product not found")
                    return NotFound(new { error = ex.Message });
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error adding product to cart", details = ex.Message });
            }
        }

        // DELETE: api/carts/remove-product/{productId} - Remove product from cart
        [HttpDelete("remove-product/{productId:int}")]
        public async Task<IActionResult> RemoveProduct([FromRoute] int productId)
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                var cart = await _db.Carts
                    .Where(c => c.UserId == user.Id && c.Status == "active")
                    .OrderByDescending(c => c.DateModified)
                    .FirstOrDefaultAsync();

                if (cart == null) return NotFound(new { error = "Cart not found" });

                var cartItem = await _db.CartItems
                    .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == productId);

                if (cartItem == null) return NotFound(new { error = "Product not in cart" });

                _db.CartItems.Remove(cartItem);
                cart.DateModified = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                return Ok(new { message = "Product removed from cart" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error removing product from cart", details = ex.Message });
            }
        }

        // PUT: api/carts/update-quantity - Update product quantity in cart
        [HttpPut("update-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityDto dto)
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                if (dto.Quantity <= 0)
                {
                    return BadRequest(new { error = "Quantity must be greater than 0" });
                }

                // Check inventory
                var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == dto.ProductId);
                if (inventory == null || inventory.Quantity < dto.Quantity)
                {
                    return BadRequest(new { error = "Insufficient stock" });
                }

                var cart = await _db.Carts
                    .Where(c => c.UserId == user.Id && c.Status == "active")
                    .OrderByDescending(c => c.DateModified)
                    .FirstOrDefaultAsync();

                if (cart == null) return NotFound(new { error = "Cart not found" });

                var cartItem = await _db.CartItems
                    .FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == dto.ProductId);

                if (cartItem == null) return NotFound(new { error = "Product not in cart" });

                cartItem.Quantity = dto.Quantity;
                cart.DateModified = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                return Ok(new { message = "Quantity updated" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error updating quantity", details = ex.Message });
            }
        }

        // POST: api/carts/confirm - Confirm cart and create order
        [HttpPost("confirm")]
        public async Task<ActionResult<object>> ConfirmCart([FromBody] OrderInfoDto orderInfo)
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                var cart = await _db.Carts
                    .Where(c => c.UserId == user.Id && c.Status == "active")
                    .OrderByDescending(c => c.DateModified)
                    .FirstOrDefaultAsync();

                if (cart == null) return NotFound(new { error = "Cart not found" });

                var cartItems = await _db.CartItems
                    .Where(ci => ci.CartId == cart.Id)
                    .ToListAsync();

                if (!cartItems.Any()) return BadRequest(new { error = "Cart is empty" });

                // Check inventory for all items
                foreach (var item in cartItems)
                {
                    var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == item.ProductId);
                    if (inventory == null || inventory.Quantity < item.Quantity)
                    {
                        var product = await _db.Products.FindAsync(item.ProductId);
                        return BadRequest(new { error = $"Insufficient stock for {product?.Name ?? "product"}" });
                    }
                }

                // Create order
                var order = new OrderForm
                {
                    UserId = user.Id,
                    TotalPrice = cartItems.Sum(ci => ci.PriceAtAdd * ci.Quantity),
                    DateCreated = DateTime.UtcNow,
                    Status = "0", // Pending
                    ShippingAddress = orderInfo.ShippingAddress ?? string.Empty,
                    PhoneNumber = orderInfo.PhoneNumber ?? string.Empty
                };

                _db.Orders.Add(order);
                await _db.SaveChangesAsync();

                // Create order details and update inventory
                foreach (var item in cartItems)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        PriceAtSale = item.PriceAtAdd,
                        TotalPrice = item.PriceAtAdd * item.Quantity
                    };
                    _db.OrderDetails.Add(orderDetail);

                    // Update inventory
                    var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == item.ProductId);
                    if (inventory != null)
                    {
                        inventory.Quantity -= item.Quantity;
                    }
                }

                // Mark cart as confirmed and clear items
                cart.Status = "confirmed";
                cart.DateModified = DateTime.UtcNow;
                _db.CartItems.RemoveRange(cartItems);

                await _db.SaveChangesAsync();

                return Ok(new { message = "Order created successfully", orderId = order.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error confirming cart", details = ex.Message });
            }
        }

        // DELETE: api/carts/clear - Clear all items from cart
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { error = "Not authenticated" });
                }

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized(new { error = "User not found" });

                var cart = await _db.Carts
                    .Where(c => c.UserId == user.Id && c.Status == "active")
                    .OrderByDescending(c => c.DateModified)
                    .FirstOrDefaultAsync();

                if (cart == null) return NotFound(new { error = "Cart not found" });

                var cartItems = await _db.CartItems.Where(ci => ci.CartId == cart.Id).ToListAsync();
                _db.CartItems.RemoveRange(cartItems);
                cart.DateModified = DateTime.UtcNow;
                await _db.SaveChangesAsync();

                return Ok(new { message = "Cart cleared" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error clearing cart", details = ex.Message });
            }
        }

        public record OrderInfoDto(string? ShippingAddress, string? PhoneNumber);
    }
}
