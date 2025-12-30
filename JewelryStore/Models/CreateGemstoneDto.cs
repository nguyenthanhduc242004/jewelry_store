namespace JewelryStore.Data
{
    public class CreateGemstoneDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public float Weight { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
    }
}
