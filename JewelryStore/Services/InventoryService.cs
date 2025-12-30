using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _db;
        public InventoryService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Inventory>> GetAllAsync()
        {
            var items = await _db.Inventory.AsNoTracking().OrderBy(i => i.ProductId).ToListAsync();
            return items;
        }

        public async Task<Inventory?> GetByProductIdAsync(int productId)
        {
            var item = await _db.Inventory.AsNoTracking().FirstOrDefaultAsync(i => i.ProductId == productId);
            return item;
        }

        public async Task<int> GetTotalStockAsync()
        {
            var totalStock = await _db.Inventory.AsNoTracking().SumAsync(i => i.Quantity);
            return totalStock;
        }
    }
}
