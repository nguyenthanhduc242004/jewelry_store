
using System.Collections.Generic;
using System.Threading.Tasks;
using JewelryStore.Controllers;
using JewelryStore.Data;

namespace JewelryStore.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductsController.ProductPreviewDto>> GetProductPreviewsAsync(int skip = 0, int take = 50);
        Task<IEnumerable<Product>> GetAllProductsAsync(int skip = 0, int take = 50);
        Task<ProductsController.ProductDetailDto?> GetProductDetailByIdAsync(int id);
    }
}
