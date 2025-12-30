using System.Collections.Generic;
using System.Threading.Tasks;
using JewelryStore.Data;

namespace JewelryStore.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync(int skip = 0, int take = 50);
        Task<Category?> GetByIdAsync(int id);
    }
}
