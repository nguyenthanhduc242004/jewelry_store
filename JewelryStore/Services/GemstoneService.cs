using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class GemstoneService : IGemstoneService
    {
        private readonly AppDbContext _db;
        public GemstoneService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Gemstone>> GetAllAsync(int skip = 0, int take = 50)
        {
            if (take <= 0 || take > 200) take = 50;
            var items = await _db.Gemstones.AsNoTracking().OrderBy(c => c.Id).Skip(skip).Take(take).ToListAsync();
            return items;
        }

        public async Task<Gemstone?> GetByIdAsync(int id)
        {
            var item = await _db.Gemstones.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            return item;
        }
    }
}
