using System.ComponentModel.DataAnnotations.Schema;

namespace JewelryStore.Data
{
    public class ProductSummaryView
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("code")]
        public string Code { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("category_name")]
        public string CategoryName { get; set; } = string.Empty;

        [Column("price")]
        public decimal Price { get; set; }

        [Column("material")]
        public string Material { get; set; } = string.Empty;

        [Column("status")]
        public bool Status { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }
    }
}
