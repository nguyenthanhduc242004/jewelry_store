namespace JewelryStore.Data
{
    public class ImportDetail
    {
        public int ImportId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal ImportPrice { get; set; }
        public decimal TotalPrice { get; set; }

        public ImportForm? Import { get; set; }
        public Product? Product { get; set; }
    }
}