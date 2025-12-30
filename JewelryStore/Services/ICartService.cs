using System.Threading.Tasks;

namespace JewelryStore.Services
{
    public interface ICartService
    {
        Task AddToCartAsync(int userId, int productId, int quantity);
    }
}
