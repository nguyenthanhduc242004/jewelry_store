namespace JewelryStore.Data
{
    public class Gemstone
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public float Weight { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }

        public Product? Product { get; set; }
    }
}