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
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;
        public DashboardController(AppDbContext db) => _db = db;

        [HttpGet("revenue")]
        public async Task<ActionResult<object>> GetRevenue()
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfThisWeek = now.Date.AddDays(-(int)now.DayOfWeek);
                var startOfLastWeek = startOfThisWeek.AddDays(-7);

                // This week revenue per day (Order - Import)
                var thisWeekOrders = await _db.Orders
                    .Where(o => o.DateCreated >= startOfThisWeek && o.DateCreated < startOfThisWeek.AddDays(7) && o.Status == "1")
                    .GroupBy(o => o.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Total = g.Sum(o => o.TotalPrice) })
                    .ToListAsync();

                var thisWeekImports = await _db.ImportForms
                    .Where(i => i.DateCreated >= startOfThisWeek && i.DateCreated < startOfThisWeek.AddDays(7))
                    .GroupBy(i => i.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Total = g.Sum(i => i.TotalPrice) })
                    .ToListAsync();

                // Last week revenue per day
                var lastWeekOrders = await _db.Orders
                    .Where(o => o.DateCreated >= startOfLastWeek && o.DateCreated < startOfThisWeek && o.Status == "1")
                    .GroupBy(o => o.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Total = g.Sum(o => o.TotalPrice) })
                    .ToListAsync();

                var lastWeekImports = await _db.ImportForms
                    .Where(i => i.DateCreated >= startOfLastWeek && i.DateCreated < startOfThisWeek)
                    .GroupBy(i => i.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Total = g.Sum(i => i.TotalPrice) })
                    .ToListAsync();

                // Calculate daily revenue for each day
                var thisWeekData = new List<object>();
                var lastWeekData = new List<object>();
                decimal thisWeekTotal = 0;
                decimal lastWeekTotal = 0;

                for (int i = 0; i < 7; i++)
                {
                    var thisDate = startOfThisWeek.AddDays(i);
                    var lastDate = startOfLastWeek.AddDays(i);

                    var thisOrderTotal = thisWeekOrders.FirstOrDefault(o => o.Date == thisDate)?.Total ?? 0;
                    var thisImportTotal = thisWeekImports.FirstOrDefault(o => o.Date == thisDate)?.Total ?? 0;
                    var thisRevenue = thisOrderTotal - thisImportTotal;

                    var lastOrderTotal = lastWeekOrders.FirstOrDefault(o => o.Date == lastDate)?.Total ?? 0;
                    var lastImportTotal = lastWeekImports.FirstOrDefault(o => o.Date == lastDate)?.Total ?? 0;
                    var lastRevenue = lastOrderTotal - lastImportTotal;

                    thisWeekData.Add(new { day = (i + 1).ToString("D2"), revenue = thisRevenue });
                    lastWeekData.Add(new { day = (i + 1).ToString("D2"), revenue = lastRevenue });

                    thisWeekTotal += thisRevenue;
                    lastWeekTotal += lastRevenue;
                }

                var percentChange = lastWeekTotal > 0 ? ((double)thisWeekTotal - (double)lastWeekTotal) / (double)lastWeekTotal * 100 : 0;

                return Ok(new
                {
                    totalRevenue = thisWeekTotal,
                    percentChange = Math.Round(percentChange, 1),
                    thisWeekData,
                    lastWeekData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error fetching revenue", details = ex.Message });
            }
        }

        [HttpGet("top-products")]
        public async Task<ActionResult<object>> GetTopProducts()
        {
            try
            {
                var topProducts = await _db.OrderDetails
                    .GroupBy(od => od.ProductId)
                    .Select(g => new
                    {
                        productId = g.Key,
                        quantitySold = g.Sum(od => od.Quantity)
                    })
                    .OrderByDescending(x => x.quantitySold)
                    .Take(5)
                    .ToListAsync();

                var productIds = topProducts.Select(p => p.productId).ToList();
                var products = await _db.Products
                    .Where(p => productIds.Contains(p.Id))
                    .ToDictionaryAsync(p => p.Id, p => p.Name);

                var result = topProducts.Select(p => new
                {
                    productName = products.ContainsKey(p.productId) ? products[p.productId] : $"Product #{p.productId}",
                    quantity = p.quantitySold
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error fetching top products", details = ex.Message });
            }
        }

        [HttpGet("top-customers")]
        public async Task<ActionResult<object>> GetTopCustomers()
        {
            try
            {
                var topCustomers = await _db.Orders
                    .Where(o => o.Status == "1") // Only completed orders
                    .GroupBy(o => o.UserId)
                    .Select(g => new
                    {
                        userId = g.Key,
                        totalSpent = g.Sum(o => o.TotalPrice)
                    })
                    .OrderByDescending(x => x.totalSpent)
                    .Take(5)
                    .ToListAsync();

                var userIds = topCustomers.Select(c => c.userId).ToList();
                var users = await _db.Users
                    .Where(u => userIds.Contains(u.Id))
                    .ToDictionaryAsync(u => u.Id, u => u.FullName);

                var result = topCustomers.Select(c => new
                {
                    customerName = users.ContainsKey(c.userId) ? users[c.userId] : $"Customer #{c.userId}",
                    totalSpent = c.totalSpent
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error fetching top customers", details = ex.Message });
            }
        }

        [HttpGet("order-stats")]
        public async Task<ActionResult<object>> GetOrderStats()
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfThisWeek = now.Date.AddDays(-(int)now.DayOfWeek);
                var startOfLastWeek = startOfThisWeek.AddDays(-7);

                var thisWeekOrders = await _db.Orders
                    .Where(o => o.DateCreated >= startOfThisWeek && o.DateCreated < startOfThisWeek.AddDays(7))
                    .GroupBy(o => o.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Count = g.Count() })
                    .ToListAsync();

                var lastWeekOrders = await _db.Orders
                    .Where(o => o.DateCreated >= startOfLastWeek && o.DateCreated < startOfThisWeek)
                    .GroupBy(o => o.DateCreated.Date)
                    .Select(g => new { Date = g.Key, Count = g.Count() })
                    .ToListAsync();

                var data = new List<object>();
                for (int i = 0; i < 7; i++)
                {
                    var thisDate = startOfThisWeek.AddDays(i);
                    var lastDate = startOfLastWeek.AddDays(i);

                    var thisCount = thisWeekOrders.FirstOrDefault(o => o.Date == thisDate)?.Count ?? 0;
                    var lastCount = lastWeekOrders.FirstOrDefault(o => o.Date == lastDate)?.Count ?? 0;

                    data.Add(new
                    {
                        day = (i + 1).ToString("D2"),
                        thisWeek = thisCount,
                        lastWeek = lastCount
                    });
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "error fetching order stats", details = ex.Message });
            }
        }
    }
}
