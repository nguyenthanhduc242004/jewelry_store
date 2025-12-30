using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Controllers;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _db;
        public ProductService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<ProductsController.ProductPreviewDto>> GetProductPreviewsAsync(int skip = 0, int take = 50)
        {
            if (take <= 0 || take > 200) take = 50;
            var items = await _db.Products.AsNoTracking()
                .OrderBy(p => p.Id)
                .Skip(skip)
                .Take(take)
                .Select(p => new ProductsController.ProductPreviewDto(
                    p.Id,
                    p.Name,
                    p.Material,
                    _db.ProductImages
                        .Where(i => i.ProductId == p.Id)
                        .OrderBy(i => i.ImageOrder)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault(),
                    _db.Categories.Where(c => c.Id == p.CategoryId).Select(c => c.Name).FirstOrDefault() ?? string.Empty,
                    p.Price,
                    _db.Inventory.Where(i => i.ProductId == p.Id).Select(i => i.Quantity).FirstOrDefault()
                ))
                .ToListAsync();
            return items;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync(int skip = 0, int take = 50)
        {
            if (take <= 0 || take > 200) take = 50;
            var items = await _db.Products.AsNoTracking().OrderBy(c => c.Id).Skip(skip).Take(take).ToListAsync();
            return items.AsEnumerable();
        }

        public async Task<ProductsController.ProductDetailDto?> GetProductDetailByIdAsync(int id)
        {
            var item = await _db.Products
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(p => new ProductsController.ProductDetailDto(
                    p.Id,
                    p.Name,
                    p.Material,
                    p.Description,
                    p.Price,
                    p.Status,
                    p.CategoryId,
                    _db.Categories.Where(c => c.Id == p.CategoryId).Select(c => c.Name).FirstOrDefault() ?? string.Empty,
                    _db.Inventory.Where(i => i.ProductId == p.Id).Select(i => i.Quantity).FirstOrDefault(),
                    _db.Gemstones
                        .Where(g => g.ProductId == p.Id)
                        .OrderBy(g => g.Id)
                        .Select(g => new ProductsController.ProductGemstoneDto(g.Id, g.Name, g.Weight, g.Size, g.Color))
                        .ToList()
                ))
                .FirstOrDefaultAsync();
            return item;
        }
    }
}
