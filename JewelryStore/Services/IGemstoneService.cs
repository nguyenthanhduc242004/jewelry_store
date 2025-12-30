using System.Collections.Generic;
using System.Threading.Tasks;
using JewelryStore.Data;

namespace JewelryStore.Services
{
    public interface IGemstoneService
    {
        Task<IEnumerable<Gemstone>> GetAllAsync(int skip = 0, int take = 50);
        Task<Gemstone?> GetByIdAsync(int id);
    }
}
