namespace JewelryStore.Data
{
    public class Inventory
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public Product? Product { get; set; }
    }
}