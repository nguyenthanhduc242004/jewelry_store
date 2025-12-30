using JewelryStore.Data;
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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) => _db = db;

        public record OrderSummaryDto(int Id, string CustomerName, decimal TotalPrice, DateTime DateCreated, string Status);
        public record StaffActionDto(int StaffId);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderForm>>> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (take <= 0 || take > 200) take = 50;
                var items = await _db.Orders.AsNoTracking().OrderBy(c => c.Id).Skip(skip).Take(take).ToListAsync();
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching orders" });
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<IEnumerable<OrderSummaryDto>>> GetSummary([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            try
            {
                if (take <= 0 || take > 200) take = 50;
                var items = await _db.Orders
                    .AsNoTracking()
                    .OrderBy(o => o.Id)
                    .Skip(skip)
                    .Take(take)
                    .Select(o => new OrderSummaryDto(
                        o.Id,
                        _db.Users.Where(u => u.Id == o.UserId).Select(u => u.FullName ?? $"User #{o.UserId}").FirstOrDefault() ?? $"User #{o.UserId}",
                        o.TotalPrice,
                        o.DateCreated,
                        o.Status
                    ))
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching order summaries" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderForm>> GetById([FromRoute] int id)
        {
            try
            {
                var item = await _db.Orders.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "order not found" });
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching order" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderForm model)
        {
            try
            {
                _db.Orders.Add(model);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error creating order" });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] OrderForm model)
        {
            try
            {
                var exists = await _db.Orders.FirstOrDefaultAsync(c => c.Id == id);
                if (exists == null) return NotFound(new { error = "order not found" });

                exists.UserId = model.UserId;
                exists.StaffId = model.StaffId;
                exists.DateCreated = model.DateCreated;
                exists.Status = model.Status;
                exists.ShippingAddress = model.ShippingAddress;
                exists.PhoneNumber = model.PhoneNumber;

                // Recalculate total price from details
                var details = await _db.Set<OrderDetail>().Where(d => d.OrderId == id).ToListAsync();
                exists.TotalPrice = details.Sum(d => d.TotalPrice);

                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error updating order" });
            }
        }

        [HttpPatch("{id:int}/complete")]
        public async Task<IActionResult> CompleteOrder([FromRoute] int id, [FromBody(EmptyBodyBehavior = Microsoft.AspNetCore.Mvc.ModelBinding.EmptyBodyBehavior.Allow)] StaffActionDto? dto)
        {
            try
            {
                var order = await _db.Orders.FirstOrDefaultAsync(c => c.Id == id);
                if (order == null) return NotFound(new { error = "order not found" });
                order.Status = "1";
                if (dto?.StaffId != null && dto.StaffId > 0)
                {
                    order.StaffId = dto.StaffId;
                }
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error completing order", details = ex.Message });
            }
        }

        [HttpPatch("{id:int}/reject")]
        public async Task<IActionResult> RejectOrder([FromRoute] int id, [FromBody(EmptyBodyBehavior = Microsoft.AspNetCore.Mvc.ModelBinding.EmptyBodyBehavior.Allow)] StaffActionDto? dto)
        {
            try
            {
                var order = await _db.Orders.FirstOrDefaultAsync(c => c.Id == id);
                if (order == null) return NotFound(new { error = "order not found" });

                // Only increase inventory if order was in pending status (0)
                if (order.Status == "0")
                {
                    // Get all order details and restore inventory
                    var orderDetails = await _db.Set<OrderDetail>().Where(d => d.OrderId == id).ToListAsync();
                    foreach (var detail in orderDetails)
                    {
                        var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == detail.ProductId);
                        if (inventory != null)
                        {
                            inventory.Quantity += detail.Quantity;
                        }
                    }
                }

                order.Status = "2";
                if (dto?.StaffId != null && dto.StaffId > 0)
                {
                    order.StaffId = dto.StaffId;
                }
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error rejecting order", details = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                var item = await _db.Orders.FirstOrDefaultAsync(c => c.Id == id);
                if (item == null) return NotFound(new { error = "order not found" });
                _db.Orders.Remove(item);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error deleting order" });
            }
        }

        [HttpGet("{orderId:int}/details")]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetDetails([FromRoute] int orderId)
        {
            try
            {
                var items = await _db.Set<OrderDetail>().AsNoTracking().Where(d => d.OrderId == orderId).ToListAsync();
                var result = items.Select(d => new
                {
                    d.OrderId,
                    d.ProductId,
                    d.Quantity,
                    d.PriceAtSale,
                    total_price = d.TotalPrice, // Use the real column
                    d.Order,
                    d.Product
                });
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error fetching order details" });
            }
        }

        [HttpPost("{orderId:int}/details")]
        public async Task<IActionResult> AddDetail([FromRoute] int orderId, [FromBody] OrderDetail model)
        {
            try
            {
                model.OrderId = orderId;
                var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == model.ProductId);
                if (product == null)
                {
                    return NotFound(new { error = "product not found" });
                }

                // Check if inventory has sufficient stock
                var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == model.ProductId);
                if (inventory == null || inventory.Quantity < model.Quantity)
                {
                    return BadRequest(new { error = "Insufficient inventory" });
                }

                model.PriceAtSale = product.Price;
                model.TotalPrice = model.PriceAtSale * model.Quantity;
                _db.Set<OrderDetail>().Add(model);
                await _db.SaveChangesAsync();

                // Decrease inventory stock when order is created
                inventory.Quantity -= model.Quantity;
                await _db.SaveChangesAsync();

                // Recalculate order total price
                var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
                if (order != null)
                {
                    order.TotalPrice = await _db.Set<OrderDetail>().Where(d => d.OrderId == orderId).SumAsync(d => d.TotalPrice);
                    await _db.SaveChangesAsync();
                }
                return Created($"api/orders/{orderId}/details", model);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error creating order detail" });
            }
        }

        [HttpDelete("{orderId:int}/details/{productId:int}")]
        public async Task<IActionResult> DeleteDetail([FromRoute] int orderId, [FromRoute] int productId)
        {
            try
            {
                var item = await _db.Set<OrderDetail>().FirstOrDefaultAsync(d => d.OrderId == orderId && d.ProductId == productId);
                if (item == null) return NotFound(new { error = "order detail not found" });

                // Restore inventory when deleting order detail
                var inventory = await _db.Inventory.FirstOrDefaultAsync(i => i.ProductId == productId);
                if (inventory != null)
                {
                    inventory.Quantity += item.Quantity;
                }

                _db.Set<OrderDetail>().Remove(item);
                await _db.SaveChangesAsync();
                // Recalculate order total price
                var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
                if (order != null)
                {
                    order.TotalPrice = await _db.Set<OrderDetail>().Where(d => d.OrderId == orderId).SumAsync(d => d.TotalPrice);
                    await _db.SaveChangesAsync();
                }
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "error deleting order detail" });
            }
        }
    }
}