using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly AppDbContext _db;
        public ProductImageService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<ProductImage>> GetAllByProductIdAsync(int productId)
        {
            var items = await _db.ProductImages
                .AsNoTracking()
                .Where(i => i.ProductId == productId)
                .OrderBy(i => i.ImageOrder)
                .ToListAsync();
            return items;
        }

        public async Task<ProductImage?> GetByProductAndOrderAsync(int productId, int imageOrder)
        {
            var item = await _db.ProductImages
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.ProductId == productId && i.ImageOrder == imageOrder);
            return item;
        }
    }
}
