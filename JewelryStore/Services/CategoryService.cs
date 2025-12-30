using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Data;
using Microsoft.EntityFrameworkCore;

namespace JewelryStore.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _db;
        public CategoryService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Category>> GetAllAsync(int skip = 0, int take = 50)
        {
            if (take <= 0 || take > 200) take = 50;
            var items = await _db.Categories.AsNoTracking().OrderBy(c => c.Id).Skip(skip).Take(take).ToListAsync();
            return items;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            var item = await _db.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            return item;
        }
    }
}
