namespace JewelryStore.Data
{
    public class ProductImage
    {
        public int ProductId { get; set; }
        public int ImageOrder { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public Product? Product { get; set; }
    }
}