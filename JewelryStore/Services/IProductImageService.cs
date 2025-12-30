using System.Collections.Generic;
using System.Threading.Tasks;
using JewelryStore.Data;

namespace JewelryStore.Services
{
    public interface IProductImageService
    {
        Task<IEnumerable<ProductImage>> GetAllByProductIdAsync(int productId);
        Task<ProductImage?> GetByProductAndOrderAsync(int productId, int imageOrder);
    }
}
