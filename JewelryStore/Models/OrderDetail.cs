namespace JewelryStore.Data
{
    public class OrderDetail
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtSale { get; set; }

        public decimal TotalPrice { get; set; }

        public OrderForm? Order { get; set; }
        public Product? Product { get; set; }
    }
}