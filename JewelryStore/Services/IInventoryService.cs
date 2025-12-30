using System.Collections.Generic;
using System.Threading.Tasks;
using JewelryStore.Data;

namespace JewelryStore.Services
{
    public interface IInventoryService
    {
        Task<IEnumerable<Inventory>> GetAllAsync();
        Task<Inventory?> GetByProductIdAsync(int productId);
        Task<int> GetTotalStockAsync();
    }
}
